import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Globe,
  Share2,
  Sparkles
} from 'lucide-react';
import { PageView } from '../types';

interface ContactPageProps {
  onNavigate: (page: PageView) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'Admission Query',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
          <Phone className="w-3.5 h-3.5" />
          Student Helpdesk &amp; Advisory
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950 font-['Outfit']">
          Contact MY CHSE 12TH CLASSES
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Have queries regarding registration, stream selection, or admission review? Our academic guidance team is here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Official Contact Placeholders */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] pb-3 border-b border-slate-100">
              Official Contact Information
            </h2>

            <div className="space-y-5 text-sm">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Student Helpdesk Email
                  </span>
                  <a
                    href="mailto:patramihirchand66@gmail.com"
                    className="font-semibold text-blue-900 hover:text-blue-700 block select-all transition-colors"
                  >
                    patramihirchand66@gmail.com
                  </a>
                  <span className="text-xs text-slate-500">
                    Direct Support for Student Admissions &amp; Inquiries
                  </span>
                </div>
              </div>

              {/* Phone Helpline */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Student Helpline / Phone
                  </span>
                  <a
                    href="tel:8917408498"
                    className="font-bold text-slate-900 hover:text-amber-700 block select-all text-base transition-colors"
                  >
                    8917408498
                  </a>
                  <span className="text-xs text-slate-500">
                    Call / WhatsApp Support (Mon-Sat, 9 AM - 6 PM)
                  </span>
                </div>
              </div>

              {/* Campus / Location */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Location
                  </span>
                  <p className="font-semibold text-slate-900 leading-relaxed text-sm">
                    Bhubaneswar, India
                  </p>
                  <span className="text-xs text-slate-500">
                    Academic Advisory &amp; Student Coordination Center
                  </span>
                </div>
              </div>

              {/* Office Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Advisory Office Hours
                  </span>
                  <span className="font-medium text-slate-800 text-xs">
                    Monday to Saturday: 9:00 AM – 6:00 PM
                  </span>
                  <span className="text-xs text-slate-500 block">
                    Online Portal: Active 24/7
                  </span>
                </div>
              </div>
            </div>

            {/* Social Media Channels Placeholder */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                Social Learning Channels
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium">
                  YouTube: @mychse12thclasses
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium">
                  Telegram: @mychse12thportal
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium">
                  WhatsApp: CHSE 12th Broadcast
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Query / Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
                  Send an Inquiry
                </h2>
                <p className="text-xs text-slate-500">
                  Fill in your message and our academic team will respond via email
                </p>
              </div>
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-emerald-950 font-['Outfit']">
                  Inquiry Received!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to MY CHSE 12TH CLASSES. We have logged your query and an academic advisor will respond to your email shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormState({ name: '', email: '', subject: 'Admission Query', message: '' });
                  }}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Student / Parent Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Email Address <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Query Subject
                  </label>
                  <select
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                  >
                    <option value="Admission Query">Admission &amp; Registration Query</option>
                    <option value="Stream Selection">Stream &amp; 6 Subjects Selection Help</option>
                    <option value="Registration Status Check">Registration Status Check Assistance</option>
                    <option value="CHSE Syllabus & Notes">CHSE Curriculum &amp; Study Notes</option>
                    <option value="Other Assistance">Other General Inquiry</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Message / Question <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Write your query in detail..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>{loading ? 'Submitting...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
