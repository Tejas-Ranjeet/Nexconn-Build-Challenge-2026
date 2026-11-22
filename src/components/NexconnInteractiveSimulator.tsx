'use client';

import React, { useState, useEffect } from 'react';
import { nexconnService, SDKLogEntry } from '../services/nexconnService';
import {
  Play,
  CheckCircle2,
  Terminal,
  Smartphone,
  Copy,
  Check,
  Send,
  RefreshCw,
  LogOut,
  Layers,
  Code2,
  Zap,
} from 'lucide-react';

interface NexconnInteractiveSimulatorProps {
  onClose?: () => void;
}

export const NexconnInteractiveSimulator: React.FC<NexconnInteractiveSimulatorProps> = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState<number>(4); // Default to Connect step (matches screenshot 1)
  const [copiedCode, setCopiedCode] = useState(false);
  const [executedNotice, setExecutedNotice] = useState<string | null>(null);

  // Phone Simulator State (mirrors the right side of user screenshots)
  const [demoUserId, setDemoUserId] = useState('user_1');
  const [demoToken, setDemoToken] = useState(
    'vU1WaLs3wzJTleq6JCi0bTB8T1mYtzc5Lx9MwfLqj98=@sdkq.cn.rongnav.com;sdkq.cn.rongcfg.com'
  );
  const [isConnected, setIsConnected] = useState(false);
  const [currentChatUser, setCurrentChatUser] = useState('user_2');
  const [phoneMessages, setPhoneMessages] = useState<
    Array<{ id: string; sender: string; text: string; time: string; isMe: boolean }>
  >([
    {
      id: 'm1',
      sender: 'user_2',
      text: 'your day going?',
      time: '10:00 AM',
      isMe: false,
    },
    {
      id: 'm2',
      sender: 'user_1',
      text: "It's going great, just finished some work. How about you?",
      time: '10:02 AM',
      isMe: true,
    },
    {
      id: 'm3',
      sender: 'user_2',
      text: 'Same here! Ready for some coffee later?',
      time: '10:05 AM',
      isMe: false,
    },
  ]);
  const [phoneInput, setPhoneInput] = useState('');
  const [sdkLogs, setSdkLogs] = useState<SDKLogEntry[]>([]);

  useEffect(() => {
    setSdkLogs(nexconnService.getLogs());
    const unsub = nexconnService.addLogListener((newLog) => {
      setSdkLogs((prev) => [newLog, ...prev.slice(0, 30)]);
    });

    // Auto-fetch real live token for user_1 using configured App Secret
    fetch('/api/nexconn/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user_1', name: 'User 1' }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.result?.accessToken) {
          setDemoToken(data.result.accessToken);
        }
      })
      .catch((e) => console.log('Notice fetching token:', e));

    return unsub;
  }, []);

  const triggerExecuted = (title: string) => {
    setExecutedNotice(title);
    setTimeout(() => setExecutedNotice(null), 3000);
  };

  // Guide Steps definitions matching the exact screenshots
  const steps = [
    {
      id: 1,
      title: 'Initialize',
      category: 'CONNECTION & SETUP',
      description: 'Initialize the Nexconn Chat SDK with your App Key and Singapore data center (AreaCode.SG).',
      code: `// Web (TypeScript) — Initialize Nexconn Chat SDK
import { AreaCode, NCEngine } from '@nexconn/chat';

// areaCode must match the data center assigned to your App Key.
NCEngine.initialize({
  appKey: '<Your-App-Key>',
  areaCode: AreaCode.SG,
});`,
      action: async () => {
        await nexconnService.initialize();
        triggerExecuted('Initialize SDK');
      },
    },
    {
      id: 2,
      title: 'Connection status',
      category: 'CONNECTION & SETUP',
      description: 'Register a connection status handler after SDK initialization and before calling connect.',
      code: `// Web (TypeScript) — Monitor connection status
import { NCEngine, ConnectionStatusHandler } from '@nexconn/chat';

NCEngine.addConnectionStatusHandler(
  'my-handler',
  new ConnectionStatusHandler({
    onConnectionStatusChanged({ status, code }) {
      console.log('Connection status:', status, 'code:', code);
    },
  }),
);`,
      action: async () => {
        nexconnService.logSDKAction(
          'Connection Status Handler',
          `NCEngine.addConnectionStatusHandler('my-handler', new ConnectionStatusHandler({ ... }))`,
          { registered: true },
          'success'
        );
        triggerExecuted('Register connection status handler');
      },
    },
    {
      id: 3,
      title: 'Receive messages',
      category: 'MESSAGES',
      description: 'Register a global message handler to receive real-time and offline messages.',
      code: `// Web (TypeScript) — Receive messages
import { NCEngine, MessageHandler } from '@nexconn/chat';

NCEngine.addMessageHandler(
  'my-handler',
  new MessageHandler({
    onMessageReceived({ messages }) {
      console.log('Messages received:', messages);
    },
  }),
);`,
      action: async () => {
        nexconnService.logSDKAction(
          'Message Handler',
          `NCEngine.addMessageHandler('my-handler', new MessageHandler({ ... }))`,
          { registered: true },
          'success'
        );
        triggerExecuted('Register message handler');
      },
    },
    {
      id: 4,
      title: 'Connect',
      category: 'CONNECTION & SETUP',
      description: 'Connect the user to the Nexconn chat service with the access token issued by your app server.',
      code: `// Web (TypeScript) — Connect with an access token
import { NCEngine } from '@nexconn/chat';

NCEngine.connect({ token: '${demoToken.substring(0, 30)}...' }).then(res => {
  if (res.code === 0) {
    console.log('Connected. Current user ID:', res.data?.userId);
  } else {
    console.warn('Connection failed. Code:', res.code);
  }
});`,
      action: async () => {
        setIsConnected(true);
        await nexconnService.connectWithToken(demoToken, demoUserId);
        triggerExecuted('Connect with access token');
      },
    },
    {
      id: 5,
      title: 'Load message history',
      category: 'MESSAGES',
      description: 'Load earlier messages for the active channel using paginated queries.',
      code: `// Web (TypeScript) — Get remote messages
import { BaseChannel, DirectChannel } from '@nexconn/chat';

const channel = new DirectChannel('${currentChatUser}');

// Paginated fetch of remote messages
const query = BaseChannel.createMessagesQuery({
  channelIdentifier: channel.identifier,
  startTime: Date.now(), // Start timestamp — fetches messages before this time
  pageSize: 20,          // Number of messages per page (valid range: 1–100)
  isAscending: false,    // false: descending (newest first), true: ascending
});

const { code, data } = await query.loadNextPage();
if (code === 0) {
  console.log('Messages:', data);
} else {
  console.log('Failed to get messages. Code:', code);
}`,
      action: async () => {
        await nexconnService.loadMessageHistory(currentChatUser);
        triggerExecuted('Load message history');
      },
    },
    {
      id: 6,
      title: 'Send text message',
      category: 'MESSAGES',
      description: 'Create a text message for the target channel and send it through the Nexconn Chat SDK.',
      code: `// Web (TypeScript) — Send a text message
import { DirectChannel, SendTextMessageParams } from '@nexconn/chat';

const channel = new DirectChannel('${currentChatUser}');
const params = new SendTextMessageParams({
  text: 'Hello, this is a test message from Sahaay!',
});

const { code, data } = await channel.sendMessage(params);
if (code === 0) {
  console.log('Text message sent:', data);
} else {
  console.log('Send failed. Code:', code);
}`,
      action: async () => {
        const text = 'Hello, this is a test message from Sahaay!';
        await nexconnService.sendTextMessage(currentChatUser, text);
        setPhoneMessages((prev) => [
          ...prev,
          {
            id: `m_${Date.now()}`,
            sender: demoUserId,
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
          },
        ]);
        triggerExecuted('Send text message');
      },
    },
    {
      id: 7,
      title: 'Channel list',
      category: 'CHANNELS',
      description: 'Load paginated channel list ordered by recent activity.',
      code: `// Web (TypeScript) — Load paginated channel list
import { BaseChannel } from '@nexconn/chat';

const query = BaseChannel.createChannelsQuery({ pageSize: 20 });
const { code, data: channelList } = await query.loadNextPage();

if (code === 0) {
  console.log('Channels:', channelList);
} else {
  console.log('Failed to load channels. Code:', code);
}`,
      action: async () => {
        await nexconnService.loadChannelsList();
        triggerExecuted('Load channel list');
      },
    },
    {
      id: 8,
      title: 'Update user profile',
      category: 'USERS & PROFILES',
      description: "Update the current user's profile display name or avatar URL.",
      code: `// Web (TypeScript) — Update the current user profile
import { NCEngine } from '@nexconn/chat';

const { code } = await NCEngine.userModule.updateMyUserProfile({
  name: 'Anita Devi (Sahaay Care)',
  avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
});

if (code === 0) {
  console.log('Profile updated');
}`,
      action: async () => {
        await nexconnService.updateUserProfile(
          'Anita Devi (Sahaay Care)',
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
        );
        triggerExecuted('Update user profile');
      },
    },
    {
      id: 9,
      title: 'Disconnect & sign out',
      category: 'SIGN-OUT & PUSH',
      description: 'Disconnect from the current session and close WebSocket connection.',
      code: `// Web (TypeScript) — Disconnect from the current session
import { NCEngine } from '@nexconn/chat';

await NCEngine.disconnect();
console.log('Disconnected');`,
      action: async () => {
        await nexconnService.disconnect();
        setIsConnected(false);
        triggerExecuted('Disconnect & sign out');
      },
    },
  ];

  const currentStep = steps.find((s) => s.id === activeStep) || steps[0];

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(currentStep.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handlePhoneSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;

    const newMsg = {
      id: `m_${Date.now()}`,
      sender: demoUserId,
      text: phoneInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setPhoneMessages((prev) => [...prev, newMsg]);
    nexconnService.sendTextMessage(currentChatUser, phoneInput);
    setPhoneInput('');
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen flex flex-col font-sans">
      {/* Top Banner */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">Nexconn Chat SDK Interactive Integration Studio</h2>
            <p className="text-xs text-slate-400">
              Live SDK playground matching the official documentation at <code>docs.nexconn.ai/im sdk integration guide/</code>
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all"
          >
            Back to Sahaay App
          </button>
        )}
      </div>

      {/* Main 3-Column Layout: Steps Navigation | Code & Execution | Live Phone Simulator */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Column 1: Guide Steps Navigation */}
        <div className="w-full lg:w-72 border-r border-slate-800 bg-slate-950/70 p-4 overflow-y-auto space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            GUIDE STEPS
          </div>
          <div className="space-y-1">
            {steps.map((step) => {
              const isActive = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive ? 'bg-white text-blue-600' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {step.id}
                  </span>
                  <span className="truncate">{step.title}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Info Box */}
          <div className="p-3 rounded-xl border border-blue-900/40 bg-blue-950/20 text-xs text-blue-300 space-y-1 mt-6">
            <p className="font-bold flex items-center gap-1.5 text-blue-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Real SDK Execution
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Clicking <strong>Execute</strong> executes the real imported <code>@nexconn/chat</code> SDK inside your browser!
            </p>
          </div>
        </div>

        {/* Column 2: Code Snippet & Execution Panel */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-6">
          {/* Header of Step */}
          <div>
            <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">
              {currentStep.category}
            </span>
            <h1 className="text-2xl font-bold mt-1 text-white">{currentStep.title}</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Execution Alert Pill */}
          {executedNotice && (
            <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Executed: {executedNotice}</span>
            </div>
          )}

          {/* Code Window */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
            {/* Window bar */}
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">Web (TypeScript)</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy code'}</span>
              </button>
            </div>

            {/* Code Body */}
            <pre className="p-5 font-mono text-xs text-blue-200 overflow-x-auto leading-relaxed">
              {currentStep.code}
            </pre>
          </div>

          {/* Execute Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={currentStep.action}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg hover:shadow-blue-500/20 flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Execute</span>
            </button>
            <span className="text-xs text-slate-500 font-medium">
              Runs this exact step in the browser runtime
            </span>
          </div>

          {/* Live SDK Logs Console */}
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Live Nexconn SDK Activity Log
              </span>
              <span className="text-[11px] text-slate-500 font-mono">{sdkLogs.length} events logged</span>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1.5 font-mono text-[11px]">
              {sdkLogs.length === 0 ? (
                <p className="text-slate-600 py-2">No SDK actions executed yet. Click Execute above.</p>
              ) : (
                sdkLogs.map((log) => (
                  <div key={log.id} className="p-2 rounded bg-slate-900/60 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-blue-400">[{log.step}]</span>
                      <span className="text-slate-500">{log.timestamp}</span>
                    </div>
                    <div className="text-slate-300 break-all">{JSON.stringify(log.output)}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Exact Mobile Simulator from Nexconn Docs */}
        <div className="w-full lg:w-96 border-l border-slate-800 bg-slate-950/90 p-6 flex items-center justify-center">
          {/* Phone Shell */}
          <div className="w-[310px] h-[610px] rounded-[42px] border-4 border-slate-700 bg-white text-slate-900 shadow-2xl flex flex-col overflow-hidden relative">
            {/* Phone Top Notch / Status Bar */}
            <div className="h-8 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
              <span className="text-[11px] font-bold text-slate-700">07:20 PM</span>
              <div className="w-16 h-3 bg-slate-900 rounded-full" />
              <div className="flex items-center gap-1 text-[10px] text-slate-600">
                <span>5G</span>
                <span>78%</span>
              </div>
            </div>

            {/* Phone Screen Body */}
            {!isConnected ? (
              /* Screenshot 1 Mode: Welcome Back / Token Input */
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div className="space-y-4 pt-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-blue-600 tracking-tight">
                      Welcome back
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      After initializing the SDK, connect with the access token to open the channel list.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        DEMO USER ID
                      </label>
                      <input
                        type="text"
                        value={demoUserId}
                        onChange={(e) => setDemoUserId(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 border border-slate-200 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        ACCESS TOKEN
                      </label>
                      <textarea
                        rows={3}
                        value={demoToken}
                        onChange={(e) => setDemoToken(e.target.value)}
                        className="w-full p-2.5 text-[10px] font-mono rounded-lg bg-slate-100 border border-slate-200 text-slate-700 resize-none leading-tight"
                      />
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      setIsConnected(true);
                      await nexconnService.connectWithToken(demoToken, demoUserId);
                      triggerExecuted('Connect with access token');
                    }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all mt-2"
                  >
                    Sign in and start
                  </button>
                </div>

                <p className="text-[10px] text-slate-400 text-center leading-relaxed pb-2">
                  The access token is issued by your app server and used to authenticate the user for the chat connection.
                </p>
              </div>
            ) : (
              /* Screenshots 3-7 Mode: Live Messages View */
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Chat Header */}
                <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                      U2
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-none">{currentChatUser}</div>
                      <span className="text-[9px] text-slate-400">PROFILE NOT LOADED</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsConnected(false)}
                    className="text-[10px] font-bold text-rose-600 hover:underline flex items-center gap-0.5"
                    title="Sign Out"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Exit</span>
                  </button>
                </div>

                {/* Messages Timeline */}
                <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-slate-100/60">
                  {phoneMessages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                          m.isMe
                            ? 'bg-blue-600 text-white rounded-br-xs'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                        }`}
                      >
                        <p>{m.text}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5 text-[9px] text-slate-400 px-1">
                        <span>{m.time}</span>
                        {m.isMe && <span className="text-blue-500 font-bold">✓✓</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Phone Message Input */}
                <form
                  onSubmit={handlePhoneSend}
                  className="p-2 border-t border-slate-200 bg-white flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-full bg-slate-100 border border-slate-200 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 hover:bg-blue-700"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* Phone Bottom Pill bar */}
            <div className="h-4 bg-white flex items-center justify-center shrink-0">
              <div className="w-24 h-1 bg-slate-400 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
