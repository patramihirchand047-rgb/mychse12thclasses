import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  BookOpen,
  FileCheck,
  Target,
  Trophy,
  ClipboardList,
  Send,
  Hash,
  Search,
  Sparkles,
  ShieldCheck,
  Users,
  GraduationCap
} from 'lucide-react';
import { HeroIllustration } from '../components/HeroIllustration';
import { PageView } from '../types';

interface HomePageProps {
  onNavigate: (page: PageView) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
                <GraduationCap className="w-4 h-4 text-amber-600" />
                <span>CHSE Odisha +2 Higher Secondary Platform</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-950 tracking-tight leading-[1.15] font-['Outfit']">
                  MY CHSE 12TH CLASSES
                </h1>
                <p className="text-xl sm:text-2xl font-bold text-amber-600 font-['Outfit']">
                  Learn Today • Succeed Tomorrow
                </p>
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Welcome to MY CHSE 12TH CLASSES — a student learning community created to support CHSE +2 students in their academic journey.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  id="hero-register-btn"
                  onClick={() => onNavigate('register')}
                  className="px-7 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-base shadow-lg shadow-blue-700/25 hover:shadow-xl hover:shadow-blue-700/35 transition-all flex items-center justify-center gap-2.5 group cursor-pointer border border-blue-600"
                >
                  <span>Register Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  id="hero-status-btn"
                  onClick={() => onNavigate('status')}
                  className="px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border-2 border-slate-300 hover:border-blue-700 hover:text-blue-700 shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Search className="w-5 h-5 text-blue-600" />
                  <span>Check Registration Status</span>
                </button>
              </div>

              {/* Quick highlights */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  One-time Free Registration
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Instant Unique Registration ID
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Arts • Science • Commerce
                </span>
              </div>
            </div>

            {/* Right Hero Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY JOIN US SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Key Benefits
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 font-['Outfit']">
            Why Join Us?
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Dedicated academic mentorship and structured curriculum for +2 students preparing for CHSE board examinations.
          </p>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow hover:border-blue-200 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 text-xl group-hover:scale-110 transition-transform">
                📚
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                Quality Learning
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Comprehensive subject coverage structured according to the latest Odisha CHSE syllabus with focused conceptual clarity and notes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-blue-700 flex items-center gap-1">
              Curriculum Aligned
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow hover:border-amber-200 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 text-xl group-hover:scale-110 transition-transform">
                📝
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                Exam Preparation
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Chapter-wise test series, previous years' question banks, answer writing techniques, and regular assessments for board exams.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-amber-700 flex items-center gap-1">
              Test Series &amp; PYQs
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow hover:border-indigo-200 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 text-xl group-hover:scale-110 transition-transform">
                🎯
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                Student Support
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                One-to-one academic doubt clearing, career counseling, guidance for competitive exams, and personal mentorship support.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-indigo-700 flex items-center gap-1">
              Personal Mentorship
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow hover:border-emerald-200 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 text-xl group-hover:scale-110 transition-transform">
                🏆
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                Better Academic Performance
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Proven methodologies that elevate grades, enhance analytical thinking, and build confidence to score top percentiles in +2 examinations.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-emerald-700 flex items-center gap-1">
              High Success Rate
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW REGISTRATION WORKS */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 font-['Outfit']">
              How Registration Works
            </h2>
            <p className="text-sm text-slate-600">
              Simple 4-step registration process to get enrolled in MY CHSE 12TH CLASSES.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs relative">
              <div className="w-9 h-9 rounded-full bg-blue-700 text-white font-extrabold text-sm flex items-center justify-center mb-4 shadow-sm">
                1
              </div>
              <div className="text-blue-700 mb-2">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 font-['Outfit']">
                Fill Registration Form
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your personal details, select your stream (Arts, Science, Commerce), choose all 6 subjects, and specify your location.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs relative">
              <div className="w-9 h-9 rounded-full bg-blue-700 text-white font-extrabold text-sm flex items-center justify-center mb-4 shadow-sm">
                2
              </div>
              <div className="text-blue-700 mb-2">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 font-['Outfit']">
                Submit Details
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review your summary thoroughly, confirm accuracy, and submit your registration securely to the platform.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs relative">
              <div className="w-9 h-9 rounded-full bg-amber-500 text-blue-950 font-extrabold text-sm flex items-center justify-center mb-4 shadow-sm">
                3
              </div>
              <div className="text-amber-600 mb-2">
                <Hash className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 font-['Outfit']">
                Receive Registration ID
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instantly receive your official unique Registration ID (e.g. <code>MYCHSE-2026-00001</code>) and save your registration slip.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs relative">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center mb-4 shadow-sm">
                4
              </div>
              <div className="text-emerald-600 mb-2">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 font-['Outfit']">
                Check Registration Status
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your Registration ID anytime to track your admission review status (Pending, Approval, or Rejected).
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => onNavigate('register')}
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
            >
              Start your registration now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-8 sm:p-12 text-center text-white overflow-hidden shadow-xl border border-blue-700/50">
          {/* Subtle gold accent circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-blue-500/20 blur-xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
              Admissions 2026
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-['Outfit']">
              Ready to Join MY CHSE 12TH CLASSES?
            </h2>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Take the first step towards academic excellence and superior CHSE +2 board exam results. Secure your enrollment today.
            </p>
            <div className="pt-3">
              <button
                id="cta-register-btn"
                onClick={() => onNavigate('register')}
                className="px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-base shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2 cursor-pointer font-['Outfit']"
              >
                <span>Register Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
