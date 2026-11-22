import { UserProfile, SahaayChannel, ChatMessage } from '../types/chat';

export const PRESET_USERS: UserProfile[] = [
  {
    userId: 'user_anita_devi',
    name: 'Anita Devi',
    role: 'citizen',
    badge: 'Resident',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    location: 'Sector 4, Rohini',
    phone: '+91 98112 34567',
  },
  {
    userId: 'user_arjun_patel',
    name: 'Arjun Patel',
    role: 'volunteer',
    badge: 'First Responder',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    location: 'Sector 4 Rescue Team',
    phone: '+91 98223 45678',
  },
  {
    userId: 'user_dr_sunita',
    name: 'Dr. Sunita Sharma',
    role: 'doctor',
    badge: 'Physician',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150',
    location: 'Community Health Center',
    phone: '+91 98334 56789',
  },
  {
    userId: 'user_rajesh_kumar',
    name: 'Rajesh Kumar',
    role: 'coordinator',
    badge: 'Area Coordinator',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    location: 'Disaster Management Cell',
    phone: '+91 98445 67890',
  },
];

export const SAHAAY_CHANNELS: SahaayChannel[] = [
  {
    id: 'sahaay_emergency',
    name: 'Emergency & Rescue',
    category: 'emergency',
    description: 'distress alerts, immediate rescue dispatch, and life-safety coordination.',
    icon: 'ShieldAlert',
    isUrgent: true,
    memberCount: 1420,
    unreadCount: 0,
  },
  {
    id: 'sahaay_medical',
    name: 'Medical Support',
    category: 'medical',
    description: 'Physician consultations, urgent prescription assistance, and medical supplies.',
    icon: 'Stethoscope',
    isUrgent: false,
    memberCount: 890,
    unreadCount: 0,
  },
  {
    id: 'sahaay_volunteers',
    name: 'Volunteer Network',
    category: 'volunteers',
    description: 'On-the-ground volunteer mobilization and relief support coordination.',
    icon: 'Users',
    isUrgent: false,
    memberCount: 430,
    unreadCount: 0,
  },
  {
    id: 'sahaay_announcements',
    name: 'Community Announcements',
    category: 'announcements',
    description: 'Verified public bulletins, municipal notices, and weather advisories.',
    icon: 'Bell',
    isUrgent: false,
    memberCount: 3200,
    unreadCount: 0,
  },
  {
    id: 'sahaay_general',
    name: 'General Support',
    category: 'general',
    description: 'Neighborhood assistance, elder welfare, and mutual community aid.',
    icon: 'MessageSquare',
    isUrgent: false,
    memberCount: 2150,
    unreadCount: 0,
  },
];

export const DIRECT_CHANNELS: SahaayChannel[] = [
  {
    id: 'direct_user_dr_sunita',
    name: 'Dr. Sunita Sharma',
    category: 'direct',
    description: 'Direct medical consultation and prescription assistance.',
    icon: 'UserCheck',
    memberCount: 2,
  },
  {
    id: 'direct_user_arjun_patel',
    name: 'Arjun Patel',
    category: 'direct',
    description: 'Direct volunteer support and doorstep delivery help.',
    icon: 'UserCheck',
    memberCount: 2,
  },
];

// Clean initial message storage — no preloaded mock history
export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  sahaay_emergency: [],
  sahaay_medical: [],
  sahaay_volunteers: [],
  sahaay_announcements: [],
  sahaay_general: [],
  direct_user_dr_sunita: [],
  direct_user_arjun_patel: [],
};
