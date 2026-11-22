'use client';

import React from 'react';
import { Printer, ArrowLeft, Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function WriteupPage() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-4 md:p-8 print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl print:shadow-none border border-slate-200 print:border-none space-y-8">
        {/* Print / Navigation Bar (hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b print:hidden">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sahaay App</span>
          </Link>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print or Save as PDF</span>
          </button>
        </div>

        {/* Document Header */}
        <div className="border-b pb-6 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-600 to-orange-500 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              <Heart className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Sahaay (सहाय)</h1>
              <p className="text-sm font-semibold text-slate-600">
                Accessible Community Communication & Emergency Response Network
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 pt-2">
            <span><strong>Hackathon:</strong> Nexconn Hackathon 2026</span>
            <span><strong>Track:</strong> Nexconn Chat SDK / Chat UI</span>
            <span><strong>Team:</strong> Lucario Wizards</span>
            <span><strong>Date:</strong> November 22, 2026</span>
          </div>
        </div>

        {/* Section 1: Executive Summary & Problem Solved */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 border-l-4 border-rose-600 pl-3">
            1. Why We Built Sahaay & The Problem It Solves
          </h2>
          <p className="text-xs leading-relaxed text-slate-700">
            During local emergencies, natural disasters, localized power outages, and medical distress situations, conventional social messaging applications (like WhatsApp or Telegram) fail vulnerable populations. In particular, <strong>senior citizens, persons with visual or motor impairments, and non-technical residents</strong> struggle with complicated group invite links, noisy unmoderated feeds, tiny fonts, and the absence of immediate emergency triage.
          </p>
          <p className="text-xs leading-relaxed text-slate-700">
            <strong>Sahaay</strong> was created to solve this critical last-mile crisis communication gap. It is an accessible, community-first mutual-aid messaging platform that immediately segments hyper-local communication into five purpose-built channels: <strong>Emergency Help & SOS, Medical Assistance, Volunteer Logistics, Local Announcements, and General Community Care</strong>, alongside 1:1 confidential lines connecting citizens with verified doctors and volunteers.
          </p>
        </section>

        {/* Section 2: Nexconn SDK Integration */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 border-l-4 border-blue-600 pl-3">
            2. Nexconn Chat SDK & Chat UI Integration Architecture
          </h2>
          <p className="text-xs leading-relaxed text-slate-700">
            Sahaay leverages the official Nexconn suite: <code>@nexconn/chat (v26.5.1)</code>, <code>@nexconn/chatui (v26.5.0)</code>, and <code>@nexconn/engine (v26.5.1)</code>. The architecture strictly complies with Nexconn security guidelines:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Group Channels (GroupChannelIdentifier)
              </h3>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Manages distinct real-time group conversations for community rescue (<code>sahaay_emergency</code>), medical queries (<code>sahaay_medical</code>), volunteer coordination (<code>sahaay_volunteers</code>), and announcements.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Direct 1:1 Channels (DirectChannelIdentifier)
              </h3>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Connects distressed individuals directly to assigned field volunteers or healthcare professionals for confidential consultations and medical history sharing.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Ready-Made ChatUI Custom Elements
              </h3>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Embeds <code>&lt;nc-chat-ui-app-provider&gt;</code> initialized with <code>NCChatUIApplication</code>. Connects custom <code>ServiceHooks</code> (<code>reqUserProfiles</code>, <code>reqGroupProfiles</code>, <code>reqGroupMembers</code>) to supply real-time profile avatars and channel names.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Server-Side Token Minting (/api/nexconn/token)
              </h3>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Implements official SHA1 signature computation (<code>SHA1(AppSecret + Nonce + Timestamp)</code>) in Next.js Server Route Handler, strictly isolating the App Secret on the server.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Accessibility Benchmark & Features */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 border-l-4 border-amber-600 pl-3">
            3. Accessibility Benchmarks (WCAG AAA)
          </h2>
          <ul className="list-disc list-inside text-xs space-y-1.5 text-slate-700">
            <li><strong>Voice-to-Text Input (SpeechRecognition):</strong> Elderly or injured users can speak their emergency requests directly without typing.</li>
            <li><strong>Text-to-Speech Playback (SpeechSynthesis):</strong> Read-aloud capability for all incoming announcements and responses for visually impaired citizens.</li>
            <li><strong>High-Contrast Mode:</strong> WCAG AAA compliant high-contrast theme (pure black and vivid yellow/cyan) for low-vision readability.</li>
            <li><strong>Dynamic Font Scaling:</strong> Rapid switching between Standard (100%), Large (125%), and Extra Large (150%) typography.</li>
            <li><strong>One-Click Geolocation SOS:</strong> Automatic GPS coordinate detection with rapid broadcast to emergency responder channels.</li>
          </ul>
        </section>

        {/* Section 4: App Key & Verification Details */}
        <section className="p-4 rounded-xl border border-slate-300 bg-slate-50 space-y-2">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            4. Nexconn Integration Credentials & Verification
          </h2>
          <div className="text-xs space-y-1 text-slate-700">
            <p><strong>Configured App Key:</strong> Stored securely in <code>NEXT_PUBLIC_NEXCONN_APP_KEY</code>.</p>
            <p><strong>Nexconn Data Center:</strong> Singapore Regional Hub (<code>api.sg-light-api.com</code>).</p>
            <p><strong>Server API Authentication:</strong> SHA1 Nonce & Timestamp Verification.</p>
          </div>
        </section>

        {/* Document Footer */}
        <div className="pt-4 border-t text-center text-xs text-slate-400">
          <p>© 2026 Sahaay · Built for the Nexconn Hackathon · Team Lucario Wizards</p>
        </div>
      </div>
    </div>
  );
}
