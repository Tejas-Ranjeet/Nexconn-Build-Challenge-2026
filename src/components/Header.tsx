'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserProfile, AccessibilitySettings } from '../types/chat';
import { PRESET_USERS } from '../data/mockData';
import { NexconnConnectionStatus } from '../services/nexconnService';
import {
  Shield,
  Volume2,
  VolumeX,
  Type,
  Sun,
  Moon,
  AlertCircle,
  MoreVertical,
  Code2,
  FileText,
  Radio,
  ExternalLink,
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="h-14 border-b border-slate-200 bg-white px-4 flex items-center justify-between z-30 select-none">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
          <Shield className="w-4 h-4 text-slate-100" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 text-sm tracking-tight">Sahaay</span>
            <span className="text-slate-300 text-xs">/</span>
            <span className="text-xs text-slate-500 font-normal hidden sm:inline">
              Community Support Network
            </span>
          </div>
        </div>
      </div>

      {/* Center / Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Network Connection Indicator */}
        <div
          onClick={onOpenProof}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700"
          title="Click to view Nexconn network connection details"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              connectionStatus === 'CONNECTED'
                ? 'bg-emerald-500'
                : connectionStatus === 'CONNECTING'
                ? 'bg-amber-500'
                : 'bg-slate-400'
            }`}
          />
          <span className="hidden sm:inline">
            {connectionStatus === 'CONNECTED'
              ? 'Connected'
              : connectionStatus === 'CONNECTING'
              ? 'Connecting...'
              : 'Offline'}
          </span>
        </div>

        {/* User Account Switcher */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-md px-2 py-0.5">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-5 h-5 rounded-full object-cover"
          />
          <select
            value={currentUser.userId}
            onChange={(e) => {
              const found = PRESET_USERS.find((u) => u.userId === e.target.value);
              if (found) onSelectUser(found);
            }}
            className="text-xs font-medium text-slate-800 bg-transparent focus:outline-hidden cursor-pointer py-1 pr-1"
          >
            {PRESET_USERS.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.name} ({user.badge})
              </option>
            ))}
          </select>
        </div>

        {/* Accessibility Toggles (Clean & Subtle) */}
        <div className="hidden md:flex items-center border border-slate-200 rounded-md p-0.5 text-slate-600 bg-slate-50">
          {/* Font Size Toggle */}
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
            className="px-2 py-1 hover:bg-white rounded text-xs font-semibold transition-colors"
            title="Adjust text scale"
          >
            <Type className="w-3.5 h-3.5" />
          </button>

          {/* Audio Read-Aloud Toggle */}
          <button
            onClick={() =>
              onUpdateAccessibility({
                textToSpeechEnabled: !accessibility.textToSpeechEnabled,
              })
            }
            className={`px-2 py-1 rounded text-xs transition-colors ${
              accessibility.textToSpeechEnabled ? 'bg-white text-blue-600 shadow-2xs' : 'hover:bg-white'
            }`}
            title="Read incoming messages aloud"
          >
            {accessibility.textToSpeechEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </div>

        {/* Emergency Request Button */}
        <button
          onClick={onOpenSOS}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-red-600 hover:bg-red-700 text-white transition-colors shadow-2xs"
          title="Send an emergency distress request"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Emergency Request</span>
        </button>

        {/* More Options / Developer Tools Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="More options and integration info"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 text-xs">
                <div className="px-3 py-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  Integration & Tools
                </div>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenProof();
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Code2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Nexconn SDK Status & Logs</span>
                </button>
                <Link
                  href="/simulator"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Radio className="w-3.5 h-3.5 text-slate-400" />
                  <span>SDK Documentation Studio</span>
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenSubmission();
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Hackathon Submission Kit</span>
                </button>
                <div className="border-t border-slate-100 my-1" />
                <div className="px-3 py-1 text-[11px] text-slate-400">
                  App Key: z3v5yqkbzet40
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
