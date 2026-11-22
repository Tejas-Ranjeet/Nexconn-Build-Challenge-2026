'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  SahaayChannel,
  ChatMessage,
  UserProfile,
  AccessibilitySettings,
} from '../types/chat';
import { INITIAL_MESSAGES } from '../data/mockData';
import { nexconnService } from '../services/nexconnService';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  AlertTriangle,
  Clock,
  CheckCheck,
  Shield,
  Layers,
  Sparkles,
  MapPin,
  Heart,
  CornerDownRight,
} from 'lucide-react';

interface ChatAreaProps {
  channel: SahaayChannel;
  currentUser: UserProfile;
  accessibility: AccessibilitySettings;
  onOpenSOS: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  channel,
  currentUser,
  accessibility,
  onOpenSOS,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(
    INITIAL_MESSAGES[channel.id] || []
  );
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [viewMode, setViewMode] = useState<'accessible' | 'official_chatui'>('accessible');
  const [chatUIMounted, setChatUIMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Sync messages when channel changes
  useEffect(() => {
    setMessages(INITIAL_MESSAGES[channel.id] || []);
    // Try to open channel in Nexconn ChatUI as well
    if (nexconnService.getChatUIApp()) {
      nexconnService.openChannel(channel.id, channel.category === 'direct');
    }
  }, [channel.id]);

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, viewMode]);

  // Text to speech utility
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Web Speech API Voice-to-Text handler
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Optimized for Indian English / Multilingual

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      setIsRecording(false);
    }
  };

  // Send message handler
  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText || inputText).trim();
    if (!textToSend) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      channelId: channel.id,
      senderId: currentUser.userId,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatarUrl,
      content: textToSend,
      timestamp: Date.now(),
      isUrgent: channel.isUrgent || textToSend.toLowerCase().includes('urgent') || textToSend.toLowerCase().includes('sos'),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // If text to speech is globally enabled, read aloud
    if (accessibility.textToSpeechEnabled) {
      speakText(`Sent: ${textToSend}`);
    }

    // Auto-respond simulation if asking for emergency or medication
    if (textToSend.toLowerCase().includes('ambulance') || textToSend.toLowerCase().includes('emergency')) {
      setTimeout(() => {
        const responseMsg: ChatMessage = {
          id: `msg_resp_${Date.now()}`,
          channelId: channel.id,
          senderId: 'user_arjun_patel',
          senderName: 'Arjun Patel',
          senderRole: 'volunteer',
          senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
          content: 'Acknowledged emergency alert! Dispatch coordinates logged. First responder unit has been alerted.',
          timestamp: Date.now(),
          isUrgent: true,
        };
        setMessages((prev) => [...prev, responseMsg]);
        if (accessibility.textToSpeechEnabled) {
          speakText('Emergency response received from Arjun Patel: First responder unit has been alerted.');
        }
      }, 1500);
    }
  };

  // Quick emergency templates
  const quickTemplates = [
    '🚨 Need urgent medical assistance at my location',
    '💊 Required: Essential prescription medication delivery',
    '⚡ Power failure in our residential block',
    '🍲 Drinking water & ration assistance needed',
    '✅ Safe & available to assist neighbors',
  ];

  const getFontSizeClass = () => {
    switch (accessibility.fontSize) {
      case 'large':
        return 'text-base';
      case 'xlarge':
        return 'text-lg';
      default:
        return 'text-sm';
    }
  };

  return (
    <main
      className={`flex-1 flex flex-col h-full overflow-hidden ${
        accessibility.highContrast ? 'bg-black text-yellow-400' : 'bg-slate-100/50'
      }`}
    >
      {/* Channel Header */}
      <div
        className={`px-4 py-3 border-b flex items-center justify-between shrink-0 ${
          accessibility.highContrast
            ? 'bg-black border-yellow-400 text-yellow-400'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm md:text-base truncate">{channel.name}</h2>
              {channel.isUrgent && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                  PRIORITY CHANNEL
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 truncate max-w-lg">
              {channel.description}
            </p>
          </div>
        </div>

        {/* View Mode Toggle: Sahaay Care View vs Official Nexconn ChatUI */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center p-0.5 rounded-lg border text-xs font-semibold ${
              accessibility.highContrast ? 'border-yellow-400 bg-black' : 'border-slate-200 bg-slate-100'
            }`}
          >
            <button
              onClick={() => setViewMode('accessible')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'accessible'
                  ? accessibility.highContrast
                    ? 'bg-yellow-400 text-black font-bold'
                    : 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Accessible Care View
            </button>
            <button
              onClick={() => {
                setViewMode('official_chatui');
                nexconnService.openChannel(channel.id, channel.category === 'direct');
              }}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                viewMode === 'official_chatui'
                  ? accessibility.highContrast
                    ? 'bg-yellow-400 text-black font-bold'
                    : 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Official Nexconn UI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Display */}
      {viewMode === 'official_chatui' ? (
        <div className="flex-1 w-full h-full relative bg-white">
          <div className="absolute top-2 right-2 z-10 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md border border-blue-200">
            Rendered with <code>&lt;nc-chat-ui-app-provider /&gt;</code> (@nexconn/chatui)
          </div>
          {React.createElement('nc-chat-ui-app-provider', {
            style: {
              width: '100%',
              height: '100%',
              display: 'block',
            },
          })}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm font-semibold">No messages in this channel yet.</p>
              <p className="text-xs mt-1">Send a message below or trigger an SOS broadcast.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === currentUser.userId;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-9 h-9 rounded-full border shrink-0 object-cover mt-1"
                  />
                  <div
                    className={`max-w-[85%] sm:max-w-xl rounded-2xl p-3.5 shadow-xs transition-all ${
                      msg.isSOS
                        ? accessibility.highContrast
                          ? 'border-4 border-yellow-400 bg-yellow-400 text-black'
                          : 'bg-rose-50 border-2 border-rose-400 text-rose-950'
                        : isMe
                        ? accessibility.highContrast
                          ? 'bg-yellow-400 text-black font-semibold'
                          : 'bg-blue-600 text-white'
                        : accessibility.highContrast
                        ? 'bg-zinc-900 border border-yellow-400 text-yellow-300'
                        : 'bg-white border border-slate-200 text-slate-900'
                    }`}
                  >
                    {/* Header info inside bubble */}
                    <div className="flex items-center justify-between gap-3 text-xs mb-1.5 opacity-90">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span>{msg.senderName}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                            isMe
                              ? 'bg-blue-700/60 text-blue-100'
                              : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {msg.senderRole.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[10px] opacity-75">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* SOS Details Card */}
                    {msg.isSOS && msg.emergencyDetails && (
                      <div className="my-2 p-2.5 rounded-xl bg-rose-600 text-white font-medium text-xs space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-sm">
                          <AlertTriangle className="w-4 h-4 animate-bounce" />
                          <span>HIGH-PRIORITY SOS DISPATCH</span>
                        </div>
                        {msg.emergencyDetails.location && (
                          <div className="flex items-center gap-1.5 text-xs text-rose-100">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span>Location: {msg.emergencyDetails.location}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full">
                            Status: {msg.emergencyDetails.status.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-rose-200 font-mono">
                            Nexconn Priority Header: Urgent
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Message Body */}
                    <p className={`${getFontSizeClass()} leading-relaxed whitespace-pre-wrap`}>
                      {msg.content}
                    </p>

                    {/* Message Actions: Audio Listen Button */}
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-black/10 dark:border-white/10 text-xs">
                      <button
                        onClick={() => speakText(`${msg.senderName} says: ${msg.content}`)}
                        className={`flex items-center gap-1 text-[11px] font-semibold hover:underline ${
                          isMe ? 'text-blue-100' : 'text-blue-600 dark:text-blue-400'
                        }`}
                        title="Read message aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen Aloud</span>
                      </button>

                      {isMe && (
                        <div className="flex items-center gap-1 text-[10px] opacity-80">
                          <CheckCheck className="w-3.5 h-3.5 text-blue-200" />
                          <span>Delivered</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Quick Assist Chips */}
      {viewMode === 'accessible' && (
        <div
          className={`px-4 py-2 border-t overflow-x-auto flex items-center gap-2 shrink-0 ${
            accessibility.highContrast
              ? 'bg-black border-yellow-400'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Quick Messages:
          </span>
          {quickTemplates.map((template, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(undefined, template)}
              className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap border font-medium transition-all ${
                accessibility.highContrast
                  ? 'border-yellow-400 bg-black text-yellow-300 hover:bg-yellow-400 hover:text-black'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 shadow-2xs'
              }`}
            >
              {template}
            </button>
          ))}
        </div>
      )}

      {/* Message Input Bar */}
      {viewMode === 'accessible' && (
        <form
          onSubmit={(e) => handleSendMessage(e)}
          className={`p-3 border-t shrink-0 ${
            accessibility.highContrast
              ? 'bg-black border-yellow-400'
              : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-2">
            {/* Voice Input (Speech to Text) */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                  : accessibility.highContrast
                  ? 'bg-black text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title={isRecording ? 'Listening... click to stop' : 'Click to Speak (Voice-to-Text)'}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input Field */}
            <input
              type="text"
              placeholder={
                isRecording
                  ? 'Listening to speech... please speak now'
                  : `Message #${channel.name}...`
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className={`flex-1 px-4 py-2.5 rounded-xl border ${getFontSizeClass()} focus:outline-hidden ${
                accessibility.highContrast
                  ? 'bg-black text-yellow-400 border-yellow-400 placeholder:text-yellow-600'
                  : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500'
              }`}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
                inputText.trim()
                  ? accessibility.highContrast
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800'
              }`}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          {isRecording && (
            <p className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              Microphone active: Speaking automatically transcribes to text...
            </p>
          )}
        </form>
      )}
    </main>
  );
};
