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
  AlertCircle,
  ChevronDown,
  Check,
  Info,
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
}) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  return (
    <header className="h-14 border-b border-slate-200 bg-white px-4 flex items-center justify-between z-30 select-none shrink-0">
      {/* Brand & Identity */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-2xs">
          <Shield className="w-4 h-4 text-slate-100" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-slate-900 text-sm tracking-tight">Sahaay</span>
          <span className="hidden sm:inline text-xs text-slate-400 font-normal">
            Community Emergency Network
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Network Connection Status */}
        <button
          onClick={onOpenProof}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors bg-slate-50 border border-slate-200/80 hover:bg-slate-100 text-slate-600"
          title="Nexconn WebSocket Live (Click for connection logs)"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              connectionStatus === 'CONNECTED'
                ? 'bg-emerald-500 animate-pulse'
                : connectionStatus === 'CONNECTING'
                ? 'bg-amber-500'
                : 'bg-slate-400'
            }`}
          />
          <span className="text-[11px] font-medium hidden sm:inline">
            {connectionStatus === 'CONNECTED'
              ? 'Nexconn Live'
              : connectionStatus === 'CONNECTING'
              ? 'Connecting...'
              : 'Offline'}
          </span>
        </button>

        {/* User Account Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg px-2.5 py-1 transition-colors text-left"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-5 h-5 rounded-full object-cover"
            />
            <div className="hidden sm:block">
              <span className="text-xs font-medium text-slate-800 block leading-tight">
                {currentUser.name}
              </span>
            </div>
            <span className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600 font-medium">
              {currentUser.badge}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isUserDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsUserDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch User Persona
                </div>
                {PRESET_USERS.map((user) => {
                  const isSelected = user.userId === currentUser.userId;
                  return (
                    <button
                      key={user.userId}
                      onClick={() => {
                        onSelectUser(user);
                        setIsUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs transition-colors ${
                        isSelected
                          ? 'bg-blue-50 text-blue-900 font-medium'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-xs font-medium leading-tight">{user.name}</p>
                          <p className="text-[10px] text-slate-400 leading-tight">{user.badge} · {user.location}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Accessibility Tools */}
        <div className="hidden sm:flex items-center border border-slate-200/80 rounded-lg p-0.5 text-slate-600 bg-slate-50">
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
            className="p-1 hover:bg-white rounded text-xs font-medium transition-colors"
            title="Adjust text size (Standard / Large / XL)"
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
            className={`p-1 rounded text-xs transition-colors ${
              accessibility.textToSpeechEnabled
                ? 'bg-white text-blue-600 shadow-2xs'
                : 'hover:bg-white text-slate-400'
            }`}
            title="Toggle text-to-speech read-aloud"
          >
            {accessibility.textToSpeechEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Emergency Distress Button */}
        <button
          onClick={onOpenSOS}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors shadow-2xs"
          title="Send an emergency distress signal"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>SOS Distress</span>
        </button>

        {/* Info Icon for SDK & Logs */}
        <button
          onClick={onOpenProof}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="View Nexconn Chat SDK info & network logs"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
