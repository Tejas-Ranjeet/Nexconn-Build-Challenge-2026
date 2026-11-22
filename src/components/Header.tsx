'use client';

import React, { useState } from 'react';
import { UserProfile, AccessibilitySettings } from '../types/chat';
import { PRESET_USERS } from '../data/mockData';
import { NexconnConnectionStatus } from '../services/nexconnService';
import {
  Volume2,
  VolumeX,
  Type,
  AlertCircle,
  ChevronDown,
  Check,
  UserPlus,
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
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSelectUser,
  connectionStatus,
  accessibility,
  onUpdateAccessibility,
  onOpenSOS,
  onOpenProof,
  onOpenProfile,
}) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  return (
    <header className="h-13 border-b border-slate-200/80 bg-white px-4 flex items-center justify-between z-30 select-none shrink-0">
      {/* Brand: Clean typographic title, no tacky logo box */}
      <div className="flex items-center gap-2">
        <span className="font-bold text-slate-900 text-base tracking-tight">Sahaay</span>
        <span className="text-slate-300 text-xs">/</span>
        <span className="text-xs text-slate-500 font-normal hidden sm:inline">
          Community Support
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Network Connection Status */}
        <button
          onClick={onOpenProof}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600"
          title="Nexconn WebSocket Live (Click for connection logs)"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              connectionStatus === 'CONNECTED'
                ? 'bg-emerald-500'
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

        {/* User Account Switcher / Custom Profile */}
        <div className="relative">
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md px-2 py-1 transition-colors text-left"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-5 h-5 rounded-full object-cover border border-slate-200"
            />
            <span className="text-xs font-medium text-slate-800 hidden sm:inline">
              {currentUser.name}
            </span>
            <span className="hidden md:inline text-[10px] px-1 py-0.2 rounded bg-slate-200 text-slate-600 font-normal">
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
                {/* Custom Profile Action */}
                <div className="px-2 pb-1.5 mb-1 border-b border-slate-100">
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      onOpenProfile();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100/70 text-blue-700 text-xs font-medium flex items-center gap-2 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Set Custom Name / Profile</span>
                  </button>
                </div>

                <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Presets / Personas
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
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-xs transition-colors ${
                        isSelected
                          ? 'bg-slate-100 text-slate-900 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-xs leading-tight">{user.name}</p>
                          <p className="text-[10px] text-slate-400 leading-tight">{user.badge}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Accessibility Tools (Clean & Subtle) */}
        <div className="hidden sm:flex items-center border border-slate-200 rounded-md p-0.5 text-slate-600 bg-slate-50">
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
            title="Adjust text scale"
          >
            <Type className="w-3.5 h-3.5" />
          </button>

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
            title="Read messages aloud"
          >
            {accessibility.textToSpeechEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Emergency Request Button */}
        <button
          onClick={onOpenSOS}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
          title="Send emergency distress alert"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Emergency Request</span>
        </button>

        {/* Developer Logs & SDK Info */}
        <button
          onClick={onOpenProof}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Nexconn Chat SDK Logs"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
