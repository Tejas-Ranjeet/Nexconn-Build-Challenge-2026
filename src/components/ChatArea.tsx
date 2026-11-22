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
  AlertTriangle,
  CheckCheck,
  Layers,
  Sparkles,
  MapPin,
  Radio,
  ExternalLink,
  Users,
  RefreshCw,
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
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
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

  // Load real messages from Nexconn on mount and when channel switches
  useEffect(() => {
    const isGroup = channel.category !== 'direct';

    // 1. Instantly display any cached messages for this channel
    const cached = nexconnService.getChannelMessages(channel.id);
    setMessages(cached);

    // 2. Fetch real message history from Nexconn servers via BaseChannel.createMessagesQuery
    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const remoteMsgs = await nexconnService.loadMessageHistory(channel.id, isGroup);
        if (remoteMsgs && remoteMsgs.length > 0) {
          setMessages(remoteMsgs);
        }
      } catch (err) {
        console.warn('Error fetching message history:', err);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();

    // 3. Open in Nexconn ChatUI if ready
    if (nexconnService.getChatUIApp()) {
      nexconnService.openChannel(channel.id, channel.category === 'direct');
    }

    // 4. Subscribe to incoming real-time messages for this channel
    const unsubscribeMessages = nexconnService.addMessageListener((targetChannelId, updatedMsgs) => {
      if (targetChannelId === channel.id) {
        setMessages(updatedMsgs);
      }
    });

    return () => {
      unsubscribeMessages();
    };
  }, [channel.id, channel.category]);

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
      recognition.lang = 'en-IN';

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

  // Send real message handler via Nexconn Chat SDK
  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText || inputText).trim();
    if (!textToSend || isSending) return;

    setInputText('');
    setIsSending(true);

    try {
      const isGroup = channel.category !== 'direct';

      // Send real message over Nexconn Chat SDK
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
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  // Quick message templates
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

  // Open second user window for live 2-way demonstration
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

  return (
    <main
      className={`flex-1 flex flex-col h-full overflow-hidden ${
        accessibility.highContrast ? 'bg-black text-yellow-400' : 'bg-slate-100/50'
      }`}
    >
      {/* Channel Header */}
      <div
        className={`px-4 py-3 border-b flex flex-wrap items-center justify-between gap-2 shrink-0 ${
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
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                <span>Nexconn Live (AreaCode.SG)</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate max-w-lg mt-0.5">
              {channel.description}
            </p>
          </div>
        </div>

        {/* Live Testing & View Mode Controls */}
        <div className="flex items-center gap-2">
          {/* Button to open 2nd window for live 2-way testing */}
          <button
            onClick={handleOpenSecondWindow}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg transition-all"
            title="Open a 2nd browser window as another user to test live 2-way messaging"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Test 2-Way Chat</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          {/* View Mode Toggle: Sahaay Accessible View vs Official Nexconn ChatUI */}
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
          <div className="absolute top-2 right-2 z-10 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md border border-blue-200 shadow-xs">
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
          {isLoadingHistory && messages.length === 0 && (
            <div className="flex items-center justify-center py-8 text-xs text-slate-500 gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span>Syncing real-time channel history with Nexconn servers...</span>
            </div>
          )}

          {messages.length === 0 && !isLoadingHistory ? (
            <div className="text-center py-12 px-4 max-w-md mx-auto">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Radio className="w-7 h-7 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                Live Channel Ready: #{channel.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Connected to Nexconn Chat Infrastructure (Singapore AreaCode.SG). No prior messages in this room yet.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() =>
                    handleSendMessage(
                      undefined,
                      `Hello from ${currentUser.name}! Checking in on the ${channel.name} channel via Nexconn real-time chat.`
                    )
                  }
                  className="text-xs px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send First Live Check-In Message</span>
                </button>
              </div>
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
                          {(msg.senderRole || 'citizen').toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[10px] opacity-75" suppressHydrationWarning>
                        {formatMessageTime(msg.timestamp)}
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
                          <span>Delivered via Nexconn</span>
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
                  : `Type a real-time message to #${channel.name}...`
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
              disabled={!inputText.trim() || isSending}
              className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
                inputText.trim() && !isSending
                  ? accessibility.highContrast
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800'
              }`}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isSending ? 'Sending...' : 'Send'}
              </span>
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
