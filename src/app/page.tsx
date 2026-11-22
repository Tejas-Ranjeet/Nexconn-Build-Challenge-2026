'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ChannelSidebar } from '../components/ChannelSidebar';
import { ChatArea } from '../components/ChatArea';
import { SOSModal } from '../components/SOSModal';
import { NexconnProofModal } from '../components/NexconnProofModal';
import { ProfileModal } from '../components/ProfileModal';
import {
  UserProfile,
  SahaayChannel,
  AccessibilitySettings,
  ChatMessage,
} from '../types/chat';
import { PRESET_USERS, SAHAAY_CHANNELS } from '../data/mockData';
import { nexconnService, NexconnConnectionStatus } from '../services/nexconnService';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(PRESET_USERS[0]);
  const [activeChannel, setActiveChannel] = useState<SahaayChannel>(SAHAAY_CHANNELS[0]);
  const [connectionStatus, setConnectionStatus] = useState<NexconnConnectionStatus>('CONNECTING');
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isProofOpen, setIsProofOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    fontSize: 'normal',
    highContrast: false,
    screenReaderOptimized: false,
    textToSpeechEnabled: false,
    speechToTextEnabled: true,
  });

  // Check URL query parameters or localStorage for user identity
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const userParam = params.get('user');
      if (userParam) {
        const found = PRESET_USERS.find((u) => u.userId === userParam);
        if (found) {
          setCurrentUser(found);
          nexconnService.connectUser(found.userId, found.name);
          return;
        }
      }

      // Check if custom profile was saved previously
      const saved = localStorage.getItem('sahaay_custom_user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.userId) {
            setCurrentUser(parsed);
            nexconnService.connectUser(parsed.userId, parsed.name);
          }
        } catch (e) {
          console.warn('Failed to parse saved user:', e);
        }
      }
    }
  }, []);

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
  }, [currentUser.userId]);

  // When user switches role in header, reconnect with fresh server token
  const handleSelectUser = async (user: UserProfile) => {
    setCurrentUser(user);
    await nexconnService.connectUser(user.userId, user.name);
  };

  const handleSaveProfile = async (profile: UserProfile) => {
    setCurrentUser(profile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sahaay_custom_user', JSON.stringify(profile));
    }
    await nexconnService.connectUser(profile.userId, profile.name);
  };

  const handleUpdateAccessibility = (settings: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => ({ ...prev, ...settings }));
  };

  const handleBroadcastSOS = async (sosMessage: ChatMessage) => {
    await nexconnService.sendTextMessage(
      'sahaay_emergency',
      sosMessage.content,
      true,
      currentUser
    );
    setActiveChannel(SAHAAY_CHANNELS[0]);
  };

  return (
    <div className="h-screen flex flex-col bg-white text-slate-900 overflow-hidden">
      {/* Top Navigation Bar */}
      <Header
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        connectionStatus={connectionStatus}
        accessibility={accessibility}
        onUpdateAccessibility={handleUpdateAccessibility}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenProof={() => setIsProofOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Workspace: Sidebar & Chat Interface */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
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

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
}
