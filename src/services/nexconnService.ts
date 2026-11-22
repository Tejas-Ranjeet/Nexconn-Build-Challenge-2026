'use client';

import { PRESET_USERS, SAHAAY_CHANNELS } from '../data/mockData';

export type NexconnConnectionStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR' | 'DEMO_MODE';

class NexconnService {
  private static instance: NexconnService;
  private nceEngine: any = null;
  private chatUIApp: any = null;
  private isInitialized = false;
  private connectionStatus: NexconnConnectionStatus = 'DISCONNECTED';
  private statusListeners: Array<(status: NexconnConnectionStatus, message?: string) => void> = [];
  private currentUserId: string = '';
  private currentAppKey: string = '';

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

  public addStatusListener(listener: (status: NexconnConnectionStatus, message?: string) => void) {
    this.statusListeners.push(listener);
    listener(this.connectionStatus);
    return () => {
      this.statusListeners = this.statusListeners.filter((l) => l !== listener);
    };
  }

  private notifyStatus(status: NexconnConnectionStatus, message?: string) {
    this.connectionStatus = status;
    this.statusListeners.forEach((l) => l(status, message));
  }

  /**
   * Initializes Nexconn Engine and ChatUI
   */
  public async initialize(appKeyInput?: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    try {
      const appKey =
        appKeyInput ||
        process.env.NEXT_PUBLIC_NEXCONN_APP_KEY ||
        localStorage.getItem('nexconn_app_key') ||
        'YOUR_APP_KEY';

      this.currentAppKey = appKey;

      // Dynamically import Nexconn modules on client side
      const { NCEngine, LogLevel, ConnectionStatusHandler } = await import('@nexconn/chat');
      const { NCChatUIApplication } = await import('@nexconn/chatui');

      // Initialize Nexconn Chat Engine
      NCEngine.initialize({
        appKey,
        logLevel: LogLevel.DEBUG,
      });

      this.nceEngine = NCEngine;

      // Define ServiceHooks for user and group profiles
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
            name: `Sahaay Alert System (${systemId})`,
          }));
        },
      };

      // Initialize ChatUI application
      const app = NCChatUIApplication.initialize({
        hooks,
        language: 'en_US',
      });

      if (app) {
        app.ready();
        this.chatUIApp = app;
      }

      // Add connection status handler
      NCEngine.addConnectionStatusHandler(
        'sahaay_handler',
        new ConnectionStatusHandler({
          onConnectionStatusChanged: (event: any) => {
            const status = event?.status;
            const code = event?.code;
            console.log('[Nexconn] Connection status changed:', status, 'code:', code);
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

      this.isInitialized = true;
      return true;
    } catch (err: any) {
      console.warn('[Nexconn] SDK Initialization notice:', err.message);
      // Fallback to demo mode for testing UI
      this.notifyStatus('DEMO_MODE', 'Running in interactive demo mode');
      return false;
    }
  }

  /**
   * Connects user using a server-issued access token
   */
  public async connectUser(userId: string, name: string): Promise<{ success: boolean; isDemo: boolean }> {
    this.currentUserId = userId;
    this.notifyStatus('CONNECTING');

    try {
      // Fetch token from server API endpoint
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

      if (tokenData.mode === 'demo' || !tokenData.result?.accessToken || tokenData.result.accessToken.startsWith('demo_token')) {
        console.log('[Nexconn] Connected in Demo / Simulation Mode');
        this.notifyStatus('DEMO_MODE', 'Connected in Demo Mode');
        return { success: true, isDemo: true };
      }

      if (this.nceEngine) {
        const result = await this.nceEngine.connect({ token: tokenData.result.accessToken });
        if (result.isOk) {
          console.log('[Nexconn] Live connected to server! User:', result.data.userId);
          this.notifyStatus('CONNECTED', `Connected as ${userId}`);
          return { success: true, isDemo: false };
        } else {
          console.warn('[Nexconn] Connect call returned error code:', result.code);
          this.notifyStatus('DEMO_MODE', `Server error (${result.code}), switched to demo mode`);
          return { success: true, isDemo: true };
        }
      }

      this.notifyStatus('DEMO_MODE');
      return { success: true, isDemo: true };
    } catch (err: any) {
      console.warn('[Nexconn] Connect error, falling back to demo mode:', err);
      this.notifyStatus('DEMO_MODE', err.message);
      return { success: true, isDemo: true };
    }
  }

  /**
   * Opens a channel in ChatUI
   */
  public async openChannel(channelId: string, isDirect: boolean = false): Promise<boolean> {
    if (!this.chatUIApp || !this.chatUIApp.ifReady()) {
      return false;
    }

    try {
      const { DirectChannelIdentifier, GroupChannelIdentifier } = await import('@nexconn/chat');
      const identifier = isDirect
        ? new DirectChannelIdentifier(channelId.replace('direct_', ''))
        : new GroupChannelIdentifier(channelId);

      await this.chatUIApp.openChannel(identifier, true);
      return true;
    } catch (err) {
      console.warn('[Nexconn] openChannel warning:', err);
      return false;
    }
  }

  public getChatUIApp() {
    return this.chatUIApp;
  }
}

export const nexconnService = NexconnService.getInstance();
