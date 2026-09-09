import React from 'react';
import {
  GraduationCap,
  BookOpen,
  FileCheck2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const HeroIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Background Soft Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600/10 via-amber-500/10 to-indigo-600/10 rounded-3xl blur-xl -z-10" />

      {/* Main Academic Portal Showcase Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-200/50 space-y-6">
        {/* Top Header Row */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center shadow-md shadow-blue-700/20">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-900 uppercase tracking-wider font-['Outfit']">
                Academic Session 2026
              </div>
              <div className="text-base font-extrabold text-slate-900 font-['Outfit']">
                +2 Student Portal
              </div>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Admissions Open
          </span>
        </div>

        {/* 3 Streams Chips */}
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            Available Academic Streams
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-center">
              <div className="text-sm font-extrabold text-blue-900 font-['Outfit']">Arts</div>
              <div className="text-[10px] text-blue-600 font-medium">Humanities & MIL</div>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-center">
              <div className="text-sm font-extrabold text-amber-900 font-['Outfit']">Science</div>
              <div className="text-[10px] text-amber-700 font-medium">PCM & Biology</div>
            </div>
            <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 text-center">
              <div className="text-sm font-extrabold text-purple-900 font-['Outfit']">Commerce</div>
              <div className="text-[10px] text-purple-700 font-medium">Accounts & BST</div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Checklist */}
        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 mt-0.5 shrink-0">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 font-['Outfit']">
                Instant Registration ID
              </div>
              <div className="text-[11px] text-slate-500">
                Official auto-generated unique registration code upon registration
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 mt-0.5 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 font-['Outfit']">
                Live Status Verification
              </div>
              <div className="text-[11px] text-slate-500">
                Check pending and admitted enrollment status anytime with your ID
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 mt-0.5 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 font-['Outfit']">
                Odisha CHSE Curriculum
              </div>
              <div className="text-[11px] text-slate-500">
                Complete 6-subject allocation across 30 Odisha districts & blocks
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Badge */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Free Student Enrollment
          </span>
          <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
            MYCHSE-2026
          </span>
        </div>
      </div>
    </div>
  );
};
