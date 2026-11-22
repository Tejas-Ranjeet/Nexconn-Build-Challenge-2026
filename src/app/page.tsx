'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ChannelSidebar } from '../components/ChannelSidebar';
import { ChatArea } from '../components/ChatArea';
import { SOSModal } from '../components/SOSModal';
import { NexconnProofModal } from '../components/NexconnProofModal';
import { SubmissionHelper } from '../components/SubmissionHelper';
import {
  UserProfile,
  SahaayChannel,
  AccessibilitySettings,
  ChatMessage,
} from '../types/chat';
import { PRESET_USERS, SAHAAY_CHANNELS } from '../data/mockData';
import { nexconnService, NexconnConnectionStatus } from '../services/nexconnService';
import { AlertTriangle } from 'lucide-react';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(PRESET_USERS[0]);
  const [activeChannel, setActiveChannel] = useState<SahaayChannel>(SAHAAY_CHANNELS[0]);
  const [connectionStatus, setConnectionStatus] = useState<NexconnConnectionStatus>('CONNECTING');
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isProofOpen, setIsProofOpen] = useState(false);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    fontSize: 'normal',
    highContrast: false,
    screenReaderOptimized: false,
    textToSpeechEnabled: false,
    speechToTextEnabled: true,
  });

  // Initialize Nexconn on client mount
  useEffect(() => {
    let unsubscribeStatus: (() => void) | undefined;

    const setup = async () => {
      unsubscribeStatus = nexconnService.addStatusListener((status) => {
        setConnectionStatus(status);
      });

      await nexconnService.initialize();
      await nexconnService.connectUser(currentUser.userId, currentUser.name);
    };

    setup();

    return () => {
      if (unsubscribeStatus) unsubscribeStatus();
    };
  }, []);

  // When user switches role in header, reconnect
  const handleSelectUser = async (user: UserProfile) => {
    setCurrentUser(user);
    await nexconnService.connectUser(user.userId, user.name);
  };

  const handleUpdateAccessibility = (settings: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => ({ ...prev, ...settings }));
  };

  const handleBroadcastSOS = (sosMessage: ChatMessage) => {
    // Switch to Emergency channel immediately so user sees the posted SOS
    setActiveChannel(SAHAAY_CHANNELS[0]);
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        accessibility.highContrast
          ? 'bg-black text-yellow-400 font-medium'
          : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Top Navigation & Accessibility Bar */}
      <Header
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        connectionStatus={connectionStatus}
        accessibility={accessibility}
        onUpdateAccessibility={handleUpdateAccessibility}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenProof={() => setIsProofOpen(true)}
        onOpenSubmission={() => setIsSubmissionOpen(true)}
      />

      {/* Main Workspace: Sidebar & Chat Interface */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative" style={{ height: 'calc(100vh - 65px)' }}>
        <ChannelSidebar
          activeChannelId={activeChannel.id}
          onSelectChannel={(ch) => setActiveChannel(ch)}
          accessibility={accessibility}
          currentUser={currentUser}
        />

        <ChatArea
          channel={activeChannel}
          currentUser={currentUser}
          accessibility={accessibility}
          onOpenSOS={() => setIsSOSOpen(true)}
        />
      </div>

      {/* Floating Emergency SOS Trigger for Mobile View */}
      <div className="md:hidden fixed bottom-4 right-4 z-30">
        <button
          onClick={() => setIsSOSOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-rose-600 text-white font-bold shadow-xl animate-bounce"
        >
          <AlertTriangle className="w-5 h-5" />
          <span>EMERGENCY SOS</span>
        </button>
      </div>

      {/* Modals */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        currentUser={currentUser}
        accessibility={accessibility}
        onBroadcastSOS={handleBroadcastSOS}
      />

      <NexconnProofModal
        isOpen={isProofOpen}
        onClose={() => setIsProofOpen(false)}
        connectionStatus={connectionStatus}
        accessibility={accessibility}
      />

      <SubmissionHelper
        isOpen={isSubmissionOpen}
        onClose={() => setIsSubmissionOpen(false)}
        accessibility={accessibility}
      />
    </div>
  );
}
