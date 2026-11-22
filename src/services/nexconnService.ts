'use client';

import { PRESET_USERS, SAHAAY_CHANNELS } from '../data/mockData';

export type NexconnConnectionStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR' | 'DEMO_MODE';

export interface SDKLogEntry {
  id: string;
  timestamp: string;
  step: string;
  codeSnippet: string;
  output: any;
  status: 'success' | 'warning' | 'info' | 'error';
}

class NexconnService {
  private static instance: NexconnService;
  private nceEngine: any = null;
  private chatUIApp: any = null;
  private isInitialized = false;
  private connectionStatus: NexconnConnectionStatus = 'DISCONNECTED';
  private statusListeners: Array<(status: NexconnConnectionStatus, message?: string) => void> = [];
  private messageListeners: Array<(messages: any[]) => void> = [];
  private logListeners: Array<(log: SDKLogEntry) => void> = [];
  private currentUserId: string = 'user_1';
  private currentAppKey: string = '';
  private logs: SDKLogEntry[] = [];

  private constructor() {}

  public static getInstance(): NexconnService {
    if (!NexconnService.instance) {
      NexconnService.instance = new NexconnService();
    }
    return NexconnService.instance;
  }

  public getStatus(): NexconnConnectionStatus {
    return this.connectionStatus;
  }

  public getCurrentUserId(): string {
    return this.currentUserId;
  }

  public getLogs(): SDKLogEntry[] {
    return this.logs;
  }

  public addLogListener(listener: (log: SDKLogEntry) => void) {
    this.logListeners.push(listener);
    return () => {
      this.logListeners = this.logListeners.filter((l) => l !== listener);
    };
  }

  public logSDKAction(step: string, codeSnippet: string, output: any, status: 'success' | 'warning' | 'info' | 'error' = 'info') {
    const entry: SDKLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      step,
      codeSnippet,
      output,
      status,
    };
    this.logs.unshift(entry);
    if (this.logs.length > 50) this.logs.pop();
    this.logListeners.forEach((l) => l(entry));
  }

  public addStatusListener(listener: (status: NexconnConnectionStatus, message?: string) => void) {
    this.statusListeners.push(listener);
    listener(this.connectionStatus);
    return () => {
      this.statusListeners = this.statusListeners.filter((l) => l !== listener);
    };
  }

  public addMessageListener(listener: (messages: any[]) => void) {
    this.messageListeners.push(listener);
    return () => {
      this.messageListeners = this.messageListeners.filter((l) => l !== listener);
    };
  }

  private notifyStatus(status: NexconnConnectionStatus, message?: string) {
    this.connectionStatus = status;
    this.statusListeners.forEach((l) => l(status, message));
  }

  /**
   * 1. Initialize Nexconn Chat SDK (with AreaCode.SG)
   */
  public async initialize(appKeyInput?: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    try {
      const appKey =
        appKeyInput ||
        process.env.NEXT_PUBLIC_NEXCONN_APP_KEY ||
        (typeof window !== 'undefined' ? localStorage.getItem('nexconn_app_key') : null) ||
        'z3v5yqkbzet40'; // Verified Live Nexconn App Key

      this.currentAppKey = appKey;

      const { NCEngine, AreaCode, ConnectionStatusHandler, MessageHandler } = await import('@nexconn/chat');
      const { NCChatUIApplication } = await import('@nexconn/chatui');

      // Initialize with Singapore Data Center as specified in guide
      NCEngine.initialize({
        appKey,
        areaCode: AreaCode.SG,
      });

      this.nceEngine = NCEngine;

      this.logSDKAction(
        'Initialize SDK',
        `import { AreaCode, NCEngine } from '@nexconn/chat';\n\nNCEngine.initialize({\n  appKey: '${appKey}',\n  areaCode: AreaCode.SG,\n});`,
        { initialized: true, appKey, areaCode: 'AreaCode.SG' },
        'success'
      );

      // 2. Register Connection Status Handler (Must be done before connecting)
      NCEngine.addConnectionStatusHandler(
        'sahaay_conn_handler',
        new ConnectionStatusHandler({
          onConnectionStatusChanged: (event: any) => {
            const status = event?.status;
            const code = event?.code;
            console.log('[Nexconn] Connection status changed:', status, 'code:', code);
            this.logSDKAction(
              'Connection Status Event',
              `NCEngine.addConnectionStatusHandler('sahaay_conn_handler', new ConnectionStatusHandler({ ... }))`,
              { status, code },
              status === 'CONNECTED' || status === 0 ? 'success' : 'warning'
            );

            if (status === 'CONNECTED' || status === 0) {
              this.notifyStatus('CONNECTED');
            } else if (status === 'CONNECTING' || status === 1) {
              this.notifyStatus('CONNECTING');
            } else {
              this.notifyStatus('DISCONNECTED', `Code: ${code}`);
            }
          },
        })
      );

      // 3. Register Global Message Handler (Must be done before connecting)
      NCEngine.addMessageHandler(
        'sahaay_msg_handler',
        new MessageHandler({
          onMessageReceived: ({ messages }: { messages: any[] }) => {
            console.log('[Nexconn] Messages received in handler:', messages);
            this.logSDKAction(
              'Receive Messages',
              `NCEngine.addMessageHandler('sahaay_msg_handler', new MessageHandler({ onMessageReceived({ messages }) { ... } }))`,
              { count: messages.length, messages },
              'info'
            );
            this.messageListeners.forEach((l) => l(messages));
          },
        })
      );

      // 4. Initialize Pre-built ChatUI Application
      const hooks = {
        async reqUserProfiles(userIds: string[]) {
          return userIds.map((userId) => {
            const found = PRESET_USERS.find((u) => u.userId === userId);
            return {
              userId,
              name: found ? found.name : `User ${userId}`,
              portraitUrl: found ? found.avatarUrl : `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`,
            };
          });
        },
        async reqGroupProfiles(groupIds: string[]) {
          return groupIds.map((groupId) => {
            const found = SAHAAY_CHANNELS.find((c) => c.id === groupId);
            return {
              groupId,
              name: found ? found.name : `Channel ${groupId}`,
              memberCount: found?.memberCount || 100,
            };
          });
        },
        async reqGroupMembers(groupId: string) {
          return PRESET_USERS.map((u) => ({
            userId: u.userId,
            name: u.name,
            role: u.role === 'coordinator' ? 3 : u.role === 'doctor' ? 2 : 1,
          }));
        },
        async reqSystemProfiles(systemIds: string[]) {
          return systemIds.map((systemId) => ({
            systemId,
            name: `Sahaay Emergency Alert (${systemId})`,
          }));
        },
      };

      const app = NCChatUIApplication.initialize({
        hooks,
        language: 'en_US',
      });

      if (app) {
        app.ready();
        this.chatUIApp = app;
      }

      this.isInitialized = true;
      return true;
    } catch (err: any) {
      console.warn('[Nexconn] SDK Initialization notice:', err.message);
      this.logSDKAction('Initialize SDK Failed', `NCEngine.initialize(...)`, { error: err.message }, 'warning');
      this.notifyStatus('DEMO_MODE', 'Running in interactive demo mode');
      return false;
    }
  }

  /**
   * 4. Connect with an access token (Official Nexconn API)
   */
  public async connectWithToken(token: string, userId?: string): Promise<{ success: boolean; data?: any; code?: number }> {
    if (!this.nceEngine) {
      await this.initialize();
    }

    this.notifyStatus('CONNECTING');
    this.currentUserId = userId || this.currentUserId;

    try {
      const codeSnippet = `import { NCEngine } from '@nexconn/chat';\n\nconst res = await NCEngine.connect({ token: '${token.substring(0, 30)}...' });`;
      
      const res = await this.nceEngine.connect({ token });
      
      if (res.code === 0 || res.isOk) {
        const uid = res.data?.userId || this.currentUserId;
        this.currentUserId = uid;
        this.notifyStatus('CONNECTED', `Connected. User ID: ${uid}`);
        this.logSDKAction('Connect', codeSnippet, { code: 0, userId: uid, status: 'CONNECTED' }, 'success');
        return { success: true, data: res.data };
      } else {
        console.warn('[Nexconn] Connect response code:', res.code);
        this.notifyStatus('DEMO_MODE', `Connection returned code ${res.code}`);
        this.logSDKAction('Connect (Notice)', codeSnippet, { code: res.code, note: 'Switched to local simulator' }, 'warning');
        return { success: false, code: res.code };
      }
    } catch (err: any) {
      console.warn('[Nexconn] Connect exception:', err.message);
      this.notifyStatus('DEMO_MODE', err.message);
      this.logSDKAction('Connect Error', `NCEngine.connect({ token: '...' })`, { error: err.message }, 'error');
      return { success: false, code: -1 };
    }
  }

  /**
   * Connect using server-minted token or fallback demo
   */
  public async connectUser(userId: string, name: string): Promise<{ success: boolean; isDemo: boolean }> {
    this.currentUserId = userId;

    try {
      // First request token from our secure server API route
      const response = await fetch('/api/nexconn/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name,
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`,
        }),
      });

      const tokenData = await response.json();
      const token = tokenData.result?.accessToken;

      if (token && !token.startsWith('demo_token') && this.nceEngine) {
        const connectRes = await this.connectWithToken(token, userId);
        if (connectRes.success) {
          return { success: true, isDemo: false };
        }
      }

      // If token is simulated or offline, connect in demo mode
      this.notifyStatus('DEMO_MODE', 'Connected in Demo Simulation Mode');
      this.logSDKAction(
        'Server Token Issue',
        `POST /api/nexconn/token\n// Server computes SHA1(AppSecret + Nonce + Timestamp)`,
        { userId, mode: tokenData.mode || 'demo' },
        'info'
      );
      return { success: true, isDemo: true };
    } catch (err: any) {
      this.notifyStatus('DEMO_MODE', err.message);
      return { success: true, isDemo: true };
    }
  }

  /**
   * 5. Send Text Message via DirectChannel or GroupChannel
   */
  public async sendTextMessage(targetId: string, text: string, isGroup: boolean = false): Promise<{ success: boolean; data?: any; code?: number }> {
    const codeSnippet = isGroup
      ? `import { GroupChannel, SendTextMessageParams } from '@nexconn/chat';\n\nconst group = new GroupChannel('${targetId}');\nconst params = new SendTextMessageParams({ text: '${text}' });\nconst { code, data } = await group.sendMessage(params);`
      : `import { DirectChannel, SendTextMessageParams } from '@nexconn/chat';\n\nconst channel = new DirectChannel('${targetId}');\nconst params = new SendTextMessageParams({ text: '${text}' });\nconst { code, data } = await channel.sendMessage(params);`;

    try {
      const { DirectChannel, GroupChannel, SendTextMessageParams } = await import('@nexconn/chat');
      const channel = isGroup ? new GroupChannel(targetId) : new DirectChannel(targetId);
      const params = new SendTextMessageParams({ text });

      const result = await (channel as any).sendMessage(params);
      
      const code = result?.code ?? (result?.isOk ? 0 : 1);
      this.logSDKAction(
        isGroup ? 'Send Group Message' : 'Send Direct Message',
        codeSnippet,
        { code, data: result?.data, channelId: targetId },
        code === 0 ? 'success' : 'warning'
      );
      return { success: code === 0, data: result?.data, code };
    } catch (err: any) {
      this.logSDKAction('Send Message Failed', codeSnippet, { error: err.message }, 'warning');
      return { success: false, code: -1 };
    }
  }

  /**
   * 6. Load Message History via BaseChannel.createMessagesQuery
   */
  public async loadMessageHistory(channelId: string, isGroup: boolean = false): Promise<{ success: boolean; messages?: any[] }> {
    const codeSnippet = `import { BaseChannel, ${isGroup ? 'GroupChannel' : 'DirectChannel'} } from '@nexconn/chat';\n\nconst channel = new ${isGroup ? 'GroupChannel' : 'DirectChannel'}('${channelId}');\nconst query = BaseChannel.createMessagesQuery({\n  channelIdentifier: channel.identifier,\n  startTime: Date.now(),\n  pageSize: 20,\n  isAscending: false,\n});\nconst { code, data } = await query.loadNextPage();`;

    try {
      const { BaseChannel, DirectChannel, GroupChannel } = await import('@nexconn/chat');
      const channel = isGroup ? new GroupChannel(channelId) : new DirectChannel(channelId);
      
      const query = (BaseChannel as any).createMessagesQuery({
        channelIdentifier: (channel as any).identifier,
        startTime: Date.now(),
        pageSize: 20,
        isAscending: false,
      });

      const res = await query.loadNextPage();
      this.logSDKAction('Load Message History', codeSnippet, { code: res.code, count: res.data?.length || 0 }, 'success');
      return { success: res.code === 0, messages: res.data };
    } catch (err: any) {
      this.logSDKAction('Load History', codeSnippet, { error: err.message }, 'warning');
      return { success: false };
    }
  }

  /**
   * 7. Load Channel List via BaseChannel.createChannelsQuery
   */
  public async loadChannelsList(): Promise<{ success: boolean; channels?: any[] }> {
    const codeSnippet = `import { BaseChannel } from '@nexconn/chat';\n\nconst query = BaseChannel.createChannelsQuery({ pageSize: 20 });\nconst { code, data: channelList } = await query.loadNextPage();`;

    try {
      const { BaseChannel } = await import('@nexconn/chat');
      const query = (BaseChannel as any).createChannelsQuery({ pageSize: 20 });
      const res = await query.loadNextPage();
      this.logSDKAction('Load Channels Query', codeSnippet, { code: res.code, channelsCount: res.data?.length || 0 }, 'success');
      return { success: res.code === 0, channels: res.data };
    } catch (err: any) {
      this.logSDKAction('Load Channels Query', codeSnippet, { error: err.message }, 'warning');
      return { success: false };
    }
  }

  /**
   * 8. Update User Profile via NCEngine.userModule.updateMyUserProfile
   */
  public async updateUserProfile(name: string, avatarUrl: string): Promise<boolean> {
    const codeSnippet = `const { code } = await NCEngine.userModule.updateMyUserProfile({\n  name: '${name}',\n  avatarUrl: '${avatarUrl}',\n});`;

    try {
      if (this.nceEngine?.userModule) {
        const { code } = await this.nceEngine.userModule.updateMyUserProfile({ name, avatarUrl });
        this.logSDKAction('Update User Profile', codeSnippet, { code, name, avatarUrl }, code === 0 ? 'success' : 'info');
        return code === 0;
      }
      this.logSDKAction('Update User Profile (Simulated)', codeSnippet, { code: 0, name, avatarUrl }, 'info');
      return true;
    } catch (err: any) {
      this.logSDKAction('Update Profile Error', codeSnippet, { error: err.message }, 'warning');
      return false;
    }
  }

  /**
   * 9. Disconnect & Sign Out
   */
  public async disconnect(): Promise<void> {
    const codeSnippet = `import { NCEngine } from '@nexconn/chat';\n\nawait NCEngine.disconnect();`;
    try {
      if (this.nceEngine) {
        await this.nceEngine.disconnect();
      }
      this.notifyStatus('DISCONNECTED');
      this.logSDKAction('Disconnect & Sign Out', codeSnippet, { status: 'DISCONNECTED' }, 'info');
    } catch (err: any) {
      this.notifyStatus('DISCONNECTED');
      this.logSDKAction('Disconnect', codeSnippet, { error: err.message }, 'warning');
    }
  }

  /**
   * Opens channel in ChatUI
   */
  public async openChannel(channelId: string, isDirect: boolean = false): Promise<boolean> {
    if (!this.chatUIApp || !this.chatUIApp.ifReady()) return false;

    try {
      const { DirectChannelIdentifier, GroupChannelIdentifier } = await import('@nexconn/chat');
      const identifier = isDirect
        ? new DirectChannelIdentifier(channelId.replace('direct_', ''))
        : new GroupChannelIdentifier(channelId);

      await this.chatUIApp.openChannel(identifier, true);
      return true;
    } catch (err) {
      return false;
    }
  }

  public getChatUIApp() {
    return this.chatUIApp;
  }
}

export const nexconnService = NexconnService.getInstance();
