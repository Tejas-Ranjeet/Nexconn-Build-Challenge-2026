export type UserRole = 'citizen' | 'volunteer' | 'doctor' | 'coordinator';

export interface UserProfile {
  userId: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
  badge: string;
  phone?: string;
  location?: string;
}

export type ChannelCategory = 'emergency' | 'medical' | 'volunteers' | 'announcements' | 'general' | 'direct';

export interface SahaayChannel {
  id: string;
  name: string;
  category: ChannelCategory;
  description: string;
  icon: string;
  unreadCount?: number;
  isUrgent?: boolean;
  memberCount?: number;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  content: string;
  timestamp: number;
  isUrgent?: boolean;
  isSOS?: boolean;
  emergencyDetails?: {
    type: 'medical' | 'rescue' | 'elderly' | 'supplies';
    location?: string;
    coordinates?: { lat: number; lng: number };
    status: 'pending' | 'in_progress' | 'resolved';
  };
}

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  screenReaderOptimized: boolean;
  textToSpeechEnabled: boolean;
  speechToTextEnabled: boolean;
}
