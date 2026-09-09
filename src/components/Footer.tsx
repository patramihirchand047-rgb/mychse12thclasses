import React, { useState } from 'react';
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck, FileText, CheckCircle2, Lock } from 'lucide-react';
import { PageView } from '../types';
import { ChseEmblemLogo } from './ChseEmblemLogo';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onSwitchToAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSwitchToAdmin }) => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  const handleNav = (page: PageView) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-14 pb-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            {/* Brand column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-400 to-blue-600 shadow-md">
                  <ChseEmblemLogo size={44} />
                </div>
                <div>
                  <span className="text-xl font-black tracking-tight text-white font-['Outfit']">
                    MY CHSE 12TH CLASSES
                  </span>
                </div>
              </div>
              <p className="text-amber-400 font-medium text-sm">
                Learn Today • Succeed Tomorrow
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                A dedicated educational registration and academic guidance portal supporting +2 Higher Secondary students across Odisha and India for CHSE curriculum excellence.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified CHSE +2 Curriculum Portal</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 font-['Outfit']">
                Quick Navigation
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <button
                    onClick={() => handleNav('home')}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('register')}
                    className="text-slate-400 hover:text-amber-300 transition-colors font-medium flex items-center gap-1.5"
                  >
                    Student Registration
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
                      Open
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('status')}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Check Registration Status
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('about')}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('contact')}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Contact &amp; Helpdesk
                  </button>
                </li>
              </ul>
            </div>

            {/* Streams Covered */}
            <div>
              <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 font-['Outfit']">
                Academic Streams
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center gap-2 text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>+2 Arts (Humanities &amp; Social Sciences)</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>+2 Science (PCM / PCB Streams)</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>+2 Commerce (Finance, Accounting &amp; Mgmt)</span>
                </li>
                <li className="pt-2">
                  <span className="text-xs text-slate-500 block">
                    All 6 subjects configured according to the standard Council syllabus structure.
                  </span>
                </li>
              </ul>
            </div>

            {/* Helpdesk Contacts */}
            <div>
              <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 font-['Outfit']">
                Student Helpdesk
              </h3>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Location - Bhubaneswar, India</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <a
                    href="mailto:patramihirchand66@gmail.com"
                    className="hover:text-amber-300 transition-colors select-all"
                  >
                    patramihirchand66@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <a
                    href="tel:8917408498"
                    className="hover:text-amber-300 transition-colors font-medium select-all"
                  >
                    8917408498
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Legal & Rights */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              &copy; 2026 MY CHSE 12TH CLASSES. All Rights Reserved.
            </p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <button
                onClick={() => setModalType('privacy')}
                className="hover:text-slate-200 transition-colors underline-offset-4 hover:underline cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setModalType('terms')}
                className="hover:text-slate-200 transition-colors underline-offset-4 hover:underline cursor-pointer"
              >
                Terms &amp; Conditions
              </button>
              {onSwitchToAdmin && (
                <>
                  <span className="text-slate-700 hidden sm:inline">|</span>
                  <button
                    onClick={onSwitchToAdmin}
                    id="footer-admin-portal-link"
                    className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Office Login</span>
                  </button>
                </>
              )}
              <span className="text-slate-700 hidden sm:inline">|</span>
              <span className="text-slate-500 font-mono">System v3.0 (Admin &amp; User)</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal for Privacy Policy */}
      {modalType === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-slate-800 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-700" />
                Privacy Policy
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>
            <div className="text-xs space-y-3 leading-relaxed text-slate-600">
              <p>
                <strong>MY CHSE 12TH CLASSES</strong> is committed to preserving student privacy and confidential academic records.
              </p>
              <p>
                1. <strong>Information Collected:</strong> We collect student name, Gmail ID, age, chosen academic stream, six designated subjects, and residential district/block details purely for enrollment and verification purposes.
              </p>
              <p>
                2. <strong>Public Data Masking:</strong> The public status search tool displays only your Registration ID, Name, Stream, and Admission Status. Personal contacts, residential addresses, and Gmail addresses are never disclosed publicly.
              </p>
              <p>
                3. <strong>Data Security:</strong> Student records are protected against unauthorized modification or duplicate spoofing.
              </p>
            </div>
            <div className="pt-2 text-right border-t border-slate-100">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Terms & Conditions */}
      {modalType === 'terms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-slate-800 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-700" />
                Terms &amp; Conditions
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>
            <div className="text-xs space-y-3 leading-relaxed text-slate-600">
              <p>
                1. <strong>Accuracy of Information:</strong> Students must submit authentic and verifiable details during registration. Discrepancies may lead to rejection during administrative review.
              </p>
              <p>
                2. <strong>One Registration Per Gmail:</strong> Each student is entitled to register with a single valid Gmail account. Subsequent attempts with the same Gmail address will reference existing Registration IDs.
              </p>
              <p>
                3. <strong>Registration ID Custody:</strong> Students must safely retain their Registration ID (format <code>MYCHSE-2026-XXXXX</code>) to check review updates and admission status.
              </p>
              <p>
                4. <strong>Subject Requirements:</strong> All applicants must select exactly six distinct subjects matching the CHSE Odisha council curriculum guidelines for Arts, Science, or Commerce.
              </p>
            </div>
            <div className="pt-2 text-right border-t border-slate-100">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
