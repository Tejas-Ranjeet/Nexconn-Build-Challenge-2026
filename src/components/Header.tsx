'use client';

import React from 'react';
import { UserProfile, AccessibilitySettings } from '../types/chat';
import { PRESET_USERS } from '../data/mockData';
import { NexconnConnectionStatus } from '../services/nexconnService';
import {
  Heart,
  Volume2,
  VolumeX,
  Type,
  Sun,
  Moon,
  ShieldCheck,
  FileText,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  connectionStatus: NexconnConnectionStatus;
  accessibility: AccessibilitySettings;
  onUpdateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  onOpenSOS: () => void;
  onOpenProof: () => void;
  onOpenSubmission: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSelectUser,
  connectionStatus,
  accessibility,
  onUpdateAccessibility,
  onOpenSOS,
  onOpenProof,
  onOpenSubmission,
}) => {
  return (
    <header
      className={`border-b transition-colors ${
        accessibility.highContrast
          ? 'bg-black text-yellow-400 border-yellow-400'
          : 'bg-white/95 backdrop-blur-md text-slate-800 border-slate-200 shadow-xs'
      } px-4 py-3 sticky top-0 z-40`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Mission */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${
              accessibility.highContrast
                ? 'bg-yellow-400 text-black border-2 border-black'
                : 'bg-gradient-to-tr from-rose-600 to-orange-500 text-white'
            }`}
          >
            <Heart className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">Sahaay</h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                सहाय
              </span>
              <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                Accessible Community & Emergency Network
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Powered by <strong className="text-blue-600 font-semibold">Nexconn Chat SDK</strong> · Hackathon Track
            </p>
          </div>
        </div>

        {/* Action Controls & Accessibility Toolbar */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Connection Indicator */}
          <button
            onClick={onOpenProof}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              connectionStatus === 'CONNECTED'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                : connectionStatus === 'CONNECTING'
                ? 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse'
                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
            }`}
            title="Inspect Nexconn Chat SDK Integration status"
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                connectionStatus === 'CONNECTED'
                  ? 'bg-emerald-500'
                  : connectionStatus === 'CONNECTING'
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
              }`}
            />
            <span>
              {connectionStatus === 'CONNECTED'
                ? 'Nexconn Connected'
                : connectionStatus === 'CONNECTING'
                ? 'Connecting Nexconn...'
                : 'Nexconn SDK Active'}
            </span>
            <ShieldCheck className="w-3.5 h-3.5" />
          </button>

          {/* Accessibility Controls */}
          <div
            className={`flex items-center border rounded-lg p-0.5 gap-0.5 ${
              accessibility.highContrast ? 'border-yellow-400 bg-black' : 'border-slate-200 bg-slate-50'
            }`}
          >
            {/* Font Size Button */}
            <button
              onClick={() => {
                const next =
                  accessibility.fontSize === 'normal'
                    ? 'large'
                    : accessibility.fontSize === 'large'
                    ? 'xlarge'
                    : 'normal';
                onUpdateAccessibility({ fontSize: next });
              }}
              className="p-1.5 rounded hover:bg-slate-200/60 text-xs font-bold flex items-center gap-1"
              title="Change Text Size for Accessibility"
            >
              <Type className="w-3.5 h-3.5" />
              <span>
                {accessibility.fontSize === 'normal'
                  ? 'A'
                  : accessibility.fontSize === 'large'
                  ? 'A+'
                  : 'A++'}
              </span>
            </button>

            {/* High Contrast Mode Toggle */}
            <button
              onClick={() => onUpdateAccessibility({ highContrast: !accessibility.highContrast })}
              className={`p-1.5 rounded text-xs font-medium flex items-center ${
                accessibility.highContrast ? 'bg-yellow-400 text-black' : 'hover:bg-slate-200/60'
              }`}
              title="Toggle High Contrast Mode (WCAG AAA)"
            >
              {accessibility.highContrast ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Text to Speech Toggle */}
            <button
              onClick={() =>
                onUpdateAccessibility({
                  textToSpeechEnabled: !accessibility.textToSpeechEnabled,
                })
              }
              className={`p-1.5 rounded text-xs font-medium flex items-center ${
                accessibility.textToSpeechEnabled ? 'text-blue-600 bg-blue-50' : 'hover:bg-slate-200/60'
              }`}
              title="Toggle Audio Read-Out (Text-to-Speech)"
            >
              {accessibility.textToSpeechEnabled ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* User Persona Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500 font-medium pl-1.5 hidden md:inline">Role:</span>
            <select
              value={currentUser.userId}
              onChange={(e) => {
                const found = PRESET_USERS.find((u) => u.userId === e.target.value);
                if (found) onSelectUser(found);
              }}
              className="text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 focus:outline-hidden"
            >
              {PRESET_USERS.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.name} ({user.badge})
                </option>
              ))}
            </select>
          </div>

          {/* Hackathon Submission Form Helper Button */}
          <button
            onClick={onOpenSubmission}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs"
            title="Open Hackathon Submission Form Helper & Write-Up"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Submission Kit</span>
          </button>

          {/* SOS Emergency Trigger Button */}
          <button
            onClick={onOpenSOS}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-lg animate-pulse"
            title="Broadcast Immediate Emergency SOS"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>SOS EMERGENCY</span>
          </button>
        </div>
      </div>
    </header>
  );
};
