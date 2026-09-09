import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Award,
  Users,
  Compass,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Target,
  Sparkles
} from 'lucide-react';
import { PageView } from '../types';

interface AboutPageProps {
  onNavigate: (page: PageView) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Top Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
          <GraduationCap className="w-4 h-4 text-amber-600" />
          Academic Community &amp; Guidance
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-950 font-['Outfit']">
          About MY CHSE 12TH CLASSES
        </h1>
        <p className="text-lg sm:text-xl font-bold text-amber-600 font-['Outfit']">
          Learn Today • Succeed Tomorrow
        </p>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed pt-2">
          MY CHSE 12TH CLASSES is an educational platform designed to support students with learning resources, academic guidance and exam preparation.
        </p>
      </div>

      {/* Institutional Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Outfit']">
            Our Academic Mission
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our mission is to empower every CHSE +2 student with high-standard learning material, conceptual clarity, disciplined study schedules, and continuous evaluation, ensuring equal academic opportunities across all districts of Odisha and neighboring states.
          </p>
          <ul className="space-y-2 pt-2 text-xs text-slate-600 font-medium">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Syllabus-aligned chapter modules &amp; formula sheets
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Comprehensive doubt-resolution channels
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Rigorous Council mock tests &amp; paper analysis
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Outfit']">
            Our Vision for +2 Students
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            We envision building a state-wide academic community where +2 Higher Secondary students develop strong analytical foundations, excel in their Council board examinations, and gain competitive confidence for career entrances like JEE, NEET, CUET, and CA Foundation.
          </p>
          <ul className="space-y-2 pt-2 text-xs text-slate-600 font-medium">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              Personalized mentorship tailored to student strengths
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              Transparent digital registration and status tracking
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              Continuous performance tracking and feedback
            </li>
          </ul>
        </div>
      </div>

      {/* Supported Disciplines */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">
            Streams &amp; Disciplines Offered
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Dedicated subject structures designed in accordance with Council of Higher Secondary Education standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3">
            <div className="text-amber-400 font-bold text-base font-['Outfit']">
              +2 Arts (Humanities)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In-depth coverage of History, Political Science, Economics, Education, Sociology, Logic, Geography, Sanskrit, and IT with focus on descriptive answer structuring.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3">
            <div className="text-blue-400 font-bold text-base font-['Outfit']">
              +2 Science (PCM / PCB)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Conceptual clarity and numerical mastery across Physics, Chemistry, Mathematics, Biology (Botany &amp; Zoology), and Computer Science aligned with board and entrance requirements.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3">
            <div className="text-emerald-400 font-bold text-base font-['Outfit']">
              +2 Commerce (Management)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Core training in Accountancy, Business Studies &amp; Management (BSM), Business Mathematics &amp; Statistics (BMS), Costing, and Banking fundamentals.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center bg-blue-50/70 rounded-3xl p-8 border border-blue-200/80 space-y-4">
        <h3 className="text-xl font-bold text-blue-950 font-['Outfit']">
          Ready to Begin Your +2 Journey with Us?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Enroll in MY CHSE 12TH CLASSES and get your official registration ID today.
        </p>
        <button
          onClick={() => onNavigate('register')}
          className="px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Fill Registration Form</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
