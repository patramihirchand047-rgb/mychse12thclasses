import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import os from 'os';

function getDataDir(): string {
  if (process.env.DATA_DIR) return process.env.DATA_DIR;
  if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.VERCEL) {
    return path.join(os.tmpdir(), 'mychse_data');
  }
  const defaultDir = path.join(process.cwd(), 'data');
  try {
    if (!fs.existsSync(defaultDir)) {
      fs.mkdirSync(defaultDir, { recursive: true });
    }
    return defaultDir;
  } catch {
    return path.join(os.tmpdir(), 'mychse_data');
  }
}

function getAdminFilePath(): string {
  return path.join(getDataDir(), 'admin.json');
}

function getAuditFilePath(): string {
  return path.join(getDataDir(), 'audit_logs.json');
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  salt: string;
  password_hash: string;
  created_at: string;
  last_login: string | null;
}

export interface AdminSession {
  token: string;
  admin_id: string;
  email: string;
  name: string;
  role: string;
  expires_at: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  admin_email: string;
  action: string;
  registration_id?: string;
  details: string;
}

// In-memory active sessions map (token -> session)
const activeSessions = new Map<string, AdminSession>();

// Secret key for HMAC signed session tokens
const SESSION_SECRET = process.env.SESSION_SECRET || 'mychse-office-2026-secure-secret-key';

function createSignedSessionToken(session: Omit<AdminSession, 'token'>): string {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `adm_sess_${payload}.${signature}`;
}

function verifySignedSessionToken(token: string): AdminSession | null {
  if (!token || !token.startsWith('adm_sess_')) return null;
  const content = token.slice('adm_sess_'.length);
  const dotIndex = content.lastIndexOf('.');
  if (dotIndex === -1) return null;
  const payload = content.slice(0, dotIndex);
  const signature = content.slice(dotIndex + 1);
  const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  if (signature !== expectedSignature) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (Date.now() > data.expires_at) return null;
    return {
      token,
      admin_id: data.admin_id,
      email: data.email,
      name: data.name,
      role: data.role,
      expires_at: data.expires_at
    };
  } catch {
    return null;
  }
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function ensureDataDirectory() {
  try {
    const dir = getDataDir();
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (err) {
    console.warn('Storage directory note:', err);
  }
}

let inMemoryAdminUsers: AdminUser[] | null = null;

export function getAdminUsers(): AdminUser[] {
  ensureDataDirectory();

  let users: AdminUser[] = inMemoryAdminUsers ? [...inMemoryAdminUsers] : [];
  const adminFile = getAdminFilePath();

  if (users.length === 0 && fs.existsSync(adminFile)) {
    try {
      const content = fs.readFileSync(adminFile, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        users = parsed;
      } else if (parsed && typeof parsed === 'object' && parsed.email) {
        users = [parsed];
      }
    } catch (err) {
      console.warn('Failed to parse admin.json, re-initializing admin accounts:', err);
    }
  }

  let modified = false;

  // Ensure Office Login account: patramihirchand66@gmail.com with Ms@2026
  const targetEmail = 'patramihirchand66@gmail.com'.toLowerCase();
  const officeAdminIndex = users.findIndex(u => u.email.toLowerCase() === targetEmail);

  if (officeAdminIndex === -1) {
    const salt = crypto.randomBytes(16).toString('hex');
    const password_hash = hashPassword('Ms@2026', salt);
    const officeAdmin: AdminUser = {
      id: 'admin_patramihirchand66',
      email: targetEmail,
      name: 'Mihirchand Patra',
      role: 'Office Administrator',
      salt,
      password_hash,
      created_at: new Date().toISOString(),
      last_login: null
    };
    users.unshift(officeAdmin);
    modified = true;
  } else {
    // Ensure credentials match Ms@2026
    const admin = users[officeAdminIndex];
    const testHash = hashPassword('Ms@2026', admin.salt);
    if (testHash !== admin.password_hash) {
      const salt = crypto.randomBytes(16).toString('hex');
      admin.salt = salt;
      admin.password_hash = hashPassword('Ms@2026', salt);
      admin.name = admin.name || 'Mihirchand Patra';
      admin.role = admin.role || 'Office Administrator';
      modified = true;
    }
  }

  // Seed default admin if list was empty
  const defaultEmail = (process.env.ADMIN_EMAIL || 'admin@mychse12thclasses.edu.in').toLowerCase().trim();
  if (!users.some(u => u.email.toLowerCase() === defaultEmail)) {
    const defaultPassword = process.env.ADMIN_PASSWORD || 'Admin@CHSE2026!';
    const salt = crypto.randomBytes(16).toString('hex');
    const password_hash = hashPassword(defaultPassword, salt);
    users.push({
      id: 'admin_' + crypto.randomUUID(),
      email: defaultEmail,
      name: 'Super Administrator',
      role: 'Super Administrator',
      salt,
      password_hash,
      created_at: new Date().toISOString(),
      last_login: null
    });
    modified = true;
  }

  if (modified) {
    saveAdminUsers(users);
  }

  return users;
}

export function getAdminUser(email?: string): AdminUser {
  const users = getAdminUsers();
  if (email) {
    const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (found) return found;
  }
  return users[0];
}

export function saveAdminUsers(users: AdminUser[]): void {
  inMemoryAdminUsers = [...users];
  try {
    ensureDataDirectory();
    const adminFile = getAdminFilePath();
    const tempFile = `${adminFile}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(users, null, 2), 'utf-8');
    fs.renameSync(tempFile, adminFile);
  } catch (err) {
    console.warn('Admin user storage note (in-memory active):', err);
  }
}

export function saveAdminUser(admin: AdminUser): void {
  const users = getAdminUsers();
  const idx = users.findIndex(u => u.id === admin.id || u.email.toLowerCase() === admin.email.toLowerCase());
  if (idx !== -1) {
    users[idx] = admin;
  } else {
    users.push(admin);
  }
  saveAdminUsers(users);
}

export function authenticateAdmin(email: string, password: string): { session: AdminSession; admin: Omit<AdminUser, 'salt' | 'password_hash'> } {
  const users = getAdminUsers();

  const normalizedEmail = email.trim().toLowerCase();
  const admin = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (!admin) {
    throw new Error('Invalid email or password.');
  }

  const computedHash = hashPassword(password, admin.salt);
  if (!crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(admin.password_hash, 'hex'))) {
    throw new Error('Invalid email or password.');
  }

  // Update last login
  admin.last_login = new Date().toISOString();
  saveAdminUser(admin);

  // Generate cryptographic signed session token (24-hour expiration)
  const expires_at = Date.now() + 24 * 60 * 60 * 1000;
  const tokenPayload = {
    admin_id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    expires_at
  };
  const token = createSignedSessionToken(tokenPayload);

  const session: AdminSession = {
    token,
    ...tokenPayload
  };

  activeSessions.set(token, session);

  addAuditLog(admin.email, 'ADMIN_LOGIN', `Office user logged into Admin Portal: ${admin.name} (${admin.email})`);

  return {
    session,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      created_at: admin.created_at,
      last_login: admin.last_login
    }
  };
}

export function verifyAdminToken(token: string | undefined): AdminSession | null {
  if (!token) return null;

  const session = activeSessions.get(token);
  if (session) {
    if (Date.now() > session.expires_at) {
      activeSessions.delete(token);
      return null;
    }
    return session;
  }

  // Fallback to cryptographic signature verification (works across serverless cold starts & instances)
  const verified = verifySignedSessionToken(token);
  if (verified) {
    activeSessions.set(token, verified);
    return verified;
  }

  return null;
}

export function logoutAdmin(token: string | undefined): boolean {
  if (!token) return false;
  const session = activeSessions.get(token);
  if (session) {
    addAuditLog(session.email, 'ADMIN_LOGOUT', 'Administrator logged out of Admin Panel');
  }
  return activeSessions.delete(token);
}

export function changeAdminPassword(currentPassword: string, newPassword: string, adminEmail?: string): void {
  const users = getAdminUsers();
  const admin = adminEmail
    ? users.find(u => u.email.toLowerCase() === adminEmail.trim().toLowerCase())
    : users[0];

  if (!admin) {
    throw new Error('Admin user not found.');
  }

  const computedHash = hashPassword(currentPassword, admin.salt);
  if (!crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(admin.password_hash, 'hex'))) {
    throw new Error('Current password is incorrect.');
  }

  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }

  const newSalt = crypto.randomBytes(16).toString('hex');
  const newHash = hashPassword(newPassword, newSalt);

  admin.salt = newSalt;
  admin.password_hash = newHash;
  saveAdminUser(admin);

  addAuditLog(admin.email, 'PASSWORD_CHANGE', `Password changed successfully for ${admin.email}`);
}

// Audit logs
export function getAuditLogs(limit = 100): AuditLogEntry[] {
  try {
    ensureDataDirectory();
    const auditFile = getAuditFilePath();
    if (!fs.existsSync(auditFile)) {
      return [];
    }
    const raw = fs.readFileSync(auditFile, 'utf-8');
    const logs = JSON.parse(raw) as AuditLogEntry[];
    return logs.slice(0, limit);
  } catch {
    return [];
  }
}

export function addAuditLog(adminEmail: string, action: string, details: string, registrationId?: string): void {
  try {
    ensureDataDirectory();
    const auditFile = getAuditFilePath();
    let logs: AuditLogEntry[] = [];
    if (fs.existsSync(auditFile)) {
      try {
        logs = JSON.parse(fs.readFileSync(auditFile, 'utf-8'));
      } catch {
        logs = [];
      }
    }

    const entry: AuditLogEntry = {
      id: 'log_' + crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      admin_email: adminEmail,
      action,
      registration_id: registrationId,
      details
    };

    logs.unshift(entry);
    if (logs.length > 500) {
      logs = logs.slice(0, 500);
    }

    fs.writeFileSync(auditFile, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to save audit log entry (handled in serverless):', err);
  }
}
