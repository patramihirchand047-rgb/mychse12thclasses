import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://ozvjfrpnqcciupluuppc.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_oQk1hTI2WzzARMf7sq9KrA_syp3IuAt';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
