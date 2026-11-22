'use client';

import React, { useState } from 'react';
import { AccessibilitySettings } from '../types/chat';
import {
  FileText,
  X,
  Copy,
  Check,
  ExternalLink,
  Download,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface SubmissionHelperProps {
  isOpen: boolean;
  onClose: () => void;
  accessibility: AccessibilitySettings;
}

export const SubmissionHelper: React.FC<SubmissionHelperProps> = ({
  isOpen,
  onClose,
  accessibility,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, fieldId: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const projectSummary = `Sahaay is an accessible, community-driven emergency and mutual-aid communication platform designed to bridge the critical gap between vulnerable citizens (such as senior citizens, persons with disabilities, and localized residents) and nearby first responders, certified volunteers, and healthcare professionals. Built directly on top of the Nexconn Chat SDK and Chat UI, Sahaay organizes communication into five purpose-driven real-time channels: Emergency Help & SOS, Medical Assistance, Volunteer Logistics, Local Announcements, and General Community Care, in addition to encrypted 1:1 direct care lines. Sahaay addresses the physical and cognitive friction of traditional messaging apps by integrating WCAG AAA high-contrast modes, scalable typography, one-click geolocation-tagged SOS broadcasts, native Web Speech voice-to-text input, and automated text-to-speech audio playback. During local crises, extreme weather, medical distress, or basic care needs, Sahaay guarantees prioritized message delivery, rapid volunteer triage, and inclusive community support.`;

  const sdkFeaturesText = `Sahaay integrates the official Nexconn Chat SDK (@nexconn/chat v26.5.1), Chat UI (@nexconn/chatui v26.5.0), and Realtime Engine (@nexconn/engine v26.5.1). Key SDK capabilities implemented include:
1. Group Channels (GroupChannelIdentifier): Powering 5 community channels (Emergency Help, Medical Assistance, Volunteer Network, Local Announcements, and General Care).
2. Direct 1:1 Channels (DirectChannelIdentifier): Enabling private, secure 1:1 triage between distressed citizens and verified doctors or first responders.
3. Pre-built Chat UI Web Components (<nc-chat-ui-app-provider>): Embedding seamless message timelines with custom ServiceHooks for user profiles (reqUserProfiles) and channel metadata (reqGroupProfiles).
4. Server-Side Token Generation (/api/nexconn/token): Secure implementation of Nexconn Server API SHA1 signature hashing (AppSecret + Nonce + Timestamp) ensuring App Secrets remain protected server-side.
5. Real-Time Connection Status Lifecycle (ConnectionStatusHandler): Monitoring CONNECTED, CONNECTING, and DISCONNECTED network states with visual feedback.
6. Assistive Speech Integration: Bridging Web Speech API with Nexconn Chat for hands-free emergency messaging and audio readout.`;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className={`w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${
          accessibility.highContrast
            ? 'bg-black text-yellow-400 border-yellow-400'
            : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        {/* Header */}
        <div className="bg-indigo-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-indigo-200" />
            <div>
              <h3 className="font-bold text-base">Nexconn Hackathon Submission Kit</h3>
              <p className="text-xs text-indigo-200">
                Exact copy-paste answers matching the official Reskilll submission form
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Fields Accordion */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
          {/* Section 01: Project Name & Summary */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                01 Project
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Project name*
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="Sahaay – Accessible Community & Emergency Communication"
                  className="flex-1 p-2 bg-white dark:bg-slate-800 border rounded-lg font-semibold"
                />
                <button
                  onClick={() =>
                    copyToClipboard(
                      'Sahaay – Accessible Community & Emergency Communication',
                      'name'
                    )
                  }
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1 font-bold"
                >
                  {copiedField === 'name' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  One-paragraph summary* (Tell us what the app does and who it is for)
                </label>
                <span className="text-[11px] text-slate-400">
                  {projectSummary.length} / 2000 characters
                </span>
              </div>
              <textarea
                readOnly
                rows={5}
                value={projectSummary}
                className="w-full p-2.5 bg-white dark:bg-slate-800 border rounded-lg font-sans leading-relaxed"
              />
              <button
                onClick={() => copyToClipboard(projectSummary, 'summary')}
                className="mt-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1.5 font-bold"
              >
                {copiedField === 'summary' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>Copy Summary</span>
              </button>
            </div>
          </div>

          {/* Section 02: Proof of Nexconn integration */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-500 block border-b pb-2">
              02 Proof of Nexconn Integration
            </span>

            <div className="space-y-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Nexconn packages used* (Select both checkboxes in form):
              </label>
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5 font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <Check className="w-4 h-4" /> [x] Chat SDK (Required)
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <Check className="w-4 h-4" /> [x] Chat UI (Counts as Chat SDK usage)
                </span>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Nexconn App Key*
              </label>
              <p className="text-slate-500 mb-1.5">
                Copy your App Key from{' '}
                <a
                  href="https://console.nexconn.ai/agile/apps/km"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline font-semibold"
                >
                  console.nexconn.ai/agile/apps/km
                </a>
                .
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  SDK features you used* (Minimum 30 characters)
                </label>
                <span className="text-[11px] text-slate-400">
                  {sdkFeaturesText.length} characters (exceeds requirement)
                </span>
              </div>
              <textarea
                readOnly
                rows={6}
                value={sdkFeaturesText}
                className="w-full p-2.5 bg-white dark:bg-slate-800 border rounded-lg font-mono text-[11px] leading-relaxed"
              />
              <button
                onClick={() => copyToClipboard(sdkFeaturesText, 'features')}
                className="mt-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1.5 font-bold"
              >
                {copiedField === 'features' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>Copy SDK Features Text</span>
              </button>
            </div>
          </div>

          {/* Section 04: Write-up PDF Link */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-500 block border-b pb-2">
              04 Write-up PDF (Generated & Ready)
            </span>
            <p className="text-slate-600 dark:text-slate-400">
              The complete write-up is generated in <code>SAHAAY_WRITEUP.md</code> and printable as PDF. It covers problem statement, Nexconn SDK architectural integration, accessibility benchmarks, and impact.
            </p>
            <a
              href="/writeup"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs"
            >
              <FileText className="w-4 h-4" />
              <span>Open Printable Write-up PDF Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Section 06: Prior work */}
          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-500 block mb-1">
              06 Prior work
            </span>
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Select: <strong>"No, built for this challenge"</strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-xs hover:bg-indigo-700 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
