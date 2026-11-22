'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  SahaayChannel,
  ChatMessage,
  UserProfile,
  AccessibilitySettings,
} from '../types/chat';
import { nexconnService } from '../services/nexconnService';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  CheckCheck,
  AlertTriangle,
  MapPin,
  ExternalLink,
  Users,
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
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatMessageTime = (timestamp: number) => {
    if (!isMounted) return '';
    try {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  // Load real messages from Nexconn & LocalStorage on channel switch
  useEffect(() => {
    const isGroup = channel.category !== 'direct';

    // 1. Immediately load stored messages from persistent storage
    const stored = nexconnService.getChannelMessages(channel.id);
    setMessages(stored);

    // 2. Fetch remote history from Nexconn servers
    nexconnService.loadMessageHistory(channel.id, isGroup).then((remote) => {
      if (remote && remote.length > 0) {
        setMessages(remote);
      }
    });

    // 3. Open channel in ChatUI if available
    if (nexconnService.getChatUIApp()) {
      nexconnService.openChannel(channel.id, channel.category === 'direct');
    }

    // 4. Subscribe to live real-time messages
    const unsubscribe = nexconnService.addMessageListener((targetChannelId, updatedMsgs) => {
      if (targetChannelId === channel.id) {
        setMessages(updatedMsgs);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [channel.id, channel.category]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Text-to-speech audio synthesis
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speech-to-text dictation
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
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
      recognition.lang = 'en-IN';

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  // Send message
  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText || inputText).trim();
    if (!textToSend || isSending) return;

    setInputText('');
    setIsSending(true);

    try {
      const isGroup = channel.category !== 'direct';
      const res = await nexconnService.sendTextMessage(
        channel.id,
        textToSend,
        isGroup,
        currentUser
      );

      if (res.message) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === res.message!.id)) return prev;
          return [...prev, res.message!];
        });
      }

      if (accessibility.textToSpeechEnabled) {
        speakText(`Sent: ${textToSend}`);
      }
    } catch (err) {
      console.error('Failed to send:', err);
    } finally {
      setIsSending(false);
    }
  };

  // Open second user window for testing live two-way chat
  const handleOpenSecondWindow = () => {
    if (typeof window === 'undefined') return;
    const secondUserId =
      currentUser.userId === 'user_anita_devi'
        ? 'user_arjun_patel'
        : 'user_anita_devi';
    window.open(
      `/?user=${secondUserId}`,
      '_blank',
      'width=540,height=820,menubar=no,toolbar=no,location=no,status=no'
    );
  };

  const getFontSizeClass = () => {
    switch (accessibility.fontSize) {
      case 'large':
        return 'text-base';
      case 'xlarge':
        return 'text-lg';
      default:
        return 'text-xs';
    }
  };

  // Quick prompt templates
  const quickTemplates = [
    'Request medical check-in',
    'Need prescription medicine delivery',
    'Supplies / drinking water assistance',
    'Local power interruption reported',
  ];

  return (
    <main className="flex-1 flex flex-col h-full bg-slate-50/40 overflow-hidden">
      {/* Channel Header */}
      <div className="h-14 border-b border-slate-200/80 bg-white px-4 flex items-center justify-between shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm text-slate-900 truncate">
              {channel.name}
            </h2>
            {channel.isUrgent && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200/80">
                Priority
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 truncate max-w-md">
            {channel.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Test 2-Way Chat Link */}
          <button
            onClick={handleOpenSecondWindow}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            title="Open a 2nd window as another user to test live real-time messaging"
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Open 2nd Window</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-sm font-medium">No messages in this channel yet.</p>
            <p className="text-xs mt-1 text-slate-400">Type a message below to coordinate with your community.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser.userId;

            // Render Emergency SOS Card with clean, serious triage design
            if (msg.isSOS) {
              return (
                <div key={msg.id} className="flex items-start gap-2.5 max-w-xl mx-auto my-2">
                  <div className="w-full bg-white border border-slate-200 border-l-4 border-l-red-600 rounded-r-xl p-3.5 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200/80">
                          <AlertTriangle className="w-3 h-3" />
                          EMERGENCY ALERT
                        </span>
                        <span className="text-xs font-semibold text-slate-900">{msg.senderName}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({msg.senderRole})</span>
                      </div>
                      <span className="text-[11px] text-slate-400" suppressHydrationWarning>
                        {formatMessageTime(msg.timestamp)}
                      </span>
                    </div>

                    {msg.emergencyDetails?.location && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 rounded-lg px-2.5 py-1.5 mb-2 border border-slate-200/60 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>Location: {msg.emergencyDetails.location}</span>
                      </div>
                    )}

                    <p className={`${getFontSizeClass()} font-medium text-slate-900 leading-relaxed whitespace-pre-wrap`}>
                      {msg.content}
                    </p>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-[11px] text-slate-400">
                      <button
                        onClick={() => speakText(`Emergency alert from ${msg.senderName}: ${msg.content}`)}
                        className="flex items-center gap-1 hover:text-slate-700 transition-colors font-medium"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen to Alert</span>
                      </button>
                      <span className="text-emerald-600 font-medium">Delivered to Responders</span>
                    </div>
                  </div>
                </div>
              );
            }

            // Normal Messages
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full border border-slate-200 object-cover mt-0.5 shrink-0"
                />

                {isMe ? (
                  /* My Outgoing Message */
                  <div className="max-w-[85%] sm:max-w-md rounded-2xl rounded-tr-xs px-4 py-2.5 bg-blue-600 text-white shadow-2xs">
                    <div className="flex items-center justify-between gap-3 mb-1 text-blue-100 text-[10px]">
                      <span className="font-semibold text-white">{msg.senderName}</span>
                      <span suppressHydrationWarning>{formatMessageTime(msg.timestamp)}</span>
                    </div>

                    <p className={`${getFontSizeClass()} leading-relaxed whitespace-pre-wrap text-white`}>
                      {msg.content}
                    </p>

                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-blue-200">
                      <CheckCheck className="w-3 h-3" />
                      <span>Delivered</span>
                    </div>
                  </div>
                ) : (
                  /* Other's Incoming Message */
                  <div className="max-w-[85%] sm:max-w-md rounded-2xl rounded-tl-xs px-4 py-2.5 bg-white border border-slate-200 text-slate-900 shadow-2xs">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-slate-900">{msg.senderName}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-normal">
                          {msg.senderRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400" suppressHydrationWarning>
                        {formatMessageTime(msg.timestamp)}
                      </span>
                    </div>

                    <p className={`${getFontSizeClass()} leading-relaxed whitespace-pre-wrap text-slate-800`}>
                      {msg.content}
                    </p>

                    <div className="flex items-center justify-between mt-1 pt-1 text-[11px] text-slate-400">
                      <button
                        onClick={() => speakText(`${msg.senderName}: ${msg.content}`)}
                        className="flex items-center gap-1 hover:text-slate-700 transition-colors"
                        title="Read aloud"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="px-4 py-1.5 bg-white/80 border-t border-slate-200/60 overflow-x-auto flex items-center gap-1.5 shrink-0">
        {quickTemplates.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(undefined, prompt)}
            className="text-[11px] px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Composer Input Card */}
      <form
        onSubmit={(e) => handleSendMessage(e)}
        className="p-3 bg-white border-t border-slate-200 shrink-0"
      >
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:bg-white focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-100 transition-all">
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`p-1.5 rounded-lg flex items-center justify-center transition-colors ${
              isRecording
                ? 'bg-red-600 text-white animate-pulse'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
            }`}
            title={isRecording ? 'Listening... click to stop' : 'Voice to text dictation'}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            placeholder={
              isRecording
                ? 'Listening to your voice...'
                : `Message #${channel.name}...`
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-transparent border-none outline-hidden text-xs text-slate-900 placeholder:text-slate-400"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors ${
              inputText.trim() && !isSending
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs'
                : 'bg-slate-200/70 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </form>
    </main>
  );
};
