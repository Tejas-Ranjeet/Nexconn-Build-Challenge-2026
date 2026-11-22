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
  Layers,
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
  onOpenSOS,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [viewMode, setViewMode] = useState<'accessible' | 'official_chatui'>('accessible');
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
  }, [messages, viewMode]);

  // Text-to-speech
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speech-to-text
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

  // Quick message chips (Clean text, no emojis)
  const quickPrompts = [
    'Request medical check-in',
    'Need prescription medication delivery',
    'Supplies and water assistance needed',
    'Power disruption reported',
    'Available to assist neighbors',
  ];

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
        return 'text-sm';
    }
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-slate-50/30 overflow-hidden">
      {/* Channel Header */}
      <div className="h-14 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm text-slate-900 truncate">
              {channel.name}
            </h2>
            {channel.isUrgent && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                Priority
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 truncate max-w-md">
            {channel.description}
          </p>
        </div>

        {/* View Mode & Multi-User Testing Controls */}
        <div className="flex items-center gap-2">
          {/* Test 2-Way Chat Link */}
          <button
            onClick={handleOpenSecondWindow}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
            title="Open a 2nd window as another user to test live real-time messaging"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Open 2nd Window</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>

          {/* View Toggle */}
          <div className="flex items-center p-0.5 rounded-md border border-slate-200 bg-slate-100 text-xs font-medium">
            <button
              onClick={() => setViewMode('accessible')}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewMode === 'accessible'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => {
                setViewMode('official_chatui');
                nexconnService.openChannel(channel.id, channel.category === 'direct');
              }}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                viewMode === 'official_chatui'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Nexconn UI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      {viewMode === 'official_chatui' ? (
        <div className="flex-1 w-full h-full relative bg-white">
          {React.createElement('nc-chat-ui-app-provider', {
            style: {
              width: '100%',
              height: '100%',
              display: 'block',
            },
          })}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-sm font-medium">No messages in this channel yet.</p>
              <p className="text-xs mt-1 text-slate-400">Type a message below to start the conversation.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === currentUser.userId;

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
                    <div className="max-w-[85%] sm:max-w-md rounded-2xl rounded-tr-xs px-3.5 py-2.5 text-xs bg-blue-600 text-white shadow-2xs">
                      <div className="flex items-center justify-between gap-3 mb-1 text-blue-100 text-[11px]">
                        <span className="font-medium text-white">{msg.senderName}</span>
                        <span suppressHydrationWarning>{formatMessageTime(msg.timestamp)}</span>
                      </div>

                      <p className={`${getFontSizeClass()} leading-relaxed whitespace-pre-wrap text-white`}>
                        {msg.content}
                      </p>

                      <div className="flex items-center justify-end gap-1 mt-1.5 pt-1 text-[10px] text-blue-200">
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Delivered</span>
                      </div>
                    </div>
                  ) : (
                    /* Other's Incoming Message */
                    <div className="max-w-[85%] sm:max-w-md rounded-2xl rounded-tl-xs px-3.5 py-2.5 text-xs bg-white border border-slate-200 text-slate-900 shadow-2xs">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900">{msg.senderName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-normal">
                            {msg.senderRole}
                          </span>
                          {msg.isUrgent && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-50 text-red-600 font-medium border border-red-200">
                              Emergency
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400" suppressHydrationWarning>
                          {formatMessageTime(msg.timestamp)}
                        </span>
                      </div>

                      <p className={`${getFontSizeClass()} leading-relaxed whitespace-pre-wrap text-slate-800`}>
                        {msg.content}
                      </p>

                      <div className="flex items-center justify-between mt-1.5 pt-1 text-[11px] text-slate-400">
                        <button
                          onClick={() => speakText(`${msg.senderName}: ${msg.content}`)}
                          className="flex items-center gap-1 hover:text-slate-700 transition-colors"
                          title="Listen to message"
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
      )}

      {/* Quick Prompts (Clean Text Chips) */}
      {viewMode === 'accessible' && (
        <div className="px-4 py-2 border-t border-slate-200 bg-white overflow-x-auto flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-medium text-slate-400 shrink-0">
            Quick:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(undefined, prompt)}
              className="text-xs px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Message Input Bar */}
      {viewMode === 'accessible' && (
        <form
          onSubmit={(e) => handleSendMessage(e)}
          className="p-3 border-t border-slate-200 bg-white shrink-0"
        >
          <div className="flex items-center gap-2">
            {/* Voice Input */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-2 rounded-md border flex items-center justify-center transition-colors ${
                isRecording
                  ? 'bg-red-600 text-white border-red-700'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title={isRecording ? 'Listening... click to stop' : 'Voice to text'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Input Field */}
            <input
              type="text"
              placeholder={
                isRecording
                  ? 'Listening...'
                  : `Message #${channel.name}...`
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className={`flex-1 px-3 py-2 rounded-md border border-slate-200 bg-slate-50 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-slate-400 text-xs transition-colors`}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className={`px-3.5 py-2 rounded-md font-medium text-xs flex items-center gap-1.5 transition-colors ${
                inputText.trim() && !isSending
                  ? 'bg-slate-900 hover:bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>
        </form>
      )}
    </main>
  );
};
