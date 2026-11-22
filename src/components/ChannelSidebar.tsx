'use client';

import React, { useState } from 'react';
import { SahaayChannel, AccessibilitySettings, UserProfile } from '../types/chat';
import { SAHAAY_CHANNELS, DIRECT_CHANNELS } from '../data/mockData';
import {
  ShieldAlert,
  Stethoscope,
  Users,
  Bell,
  MessageSquare,
  UserCheck,
  Search,
} from 'lucide-react';

interface ChannelSidebarProps {
  activeChannelId: string;
  onSelectChannel: (channel: SahaayChannel) => void;
  accessibility: AccessibilitySettings;
  currentUser: UserProfile;
}

export const ChannelSidebar: React.FC<ChannelSidebarProps> = ({
  activeChannelId,
  onSelectChannel,
  accessibility,
  currentUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getChannelIcon = (iconName: string, isUrgent?: boolean) => {
    const iconClass = 'w-4 h-4 shrink-0';
    switch (iconName) {
      case 'ShieldAlert':
        return <ShieldAlert className={`${iconClass} ${isUrgent ? 'text-red-500' : 'text-slate-400'}`} />;
      case 'Stethoscope':
        return <Stethoscope className={`${iconClass} text-slate-400`} />;
      case 'Users':
        return <Users className={`${iconClass} text-slate-400`} />;
      case 'Bell':
        return <Bell className={`${iconClass} text-slate-400`} />;
      case 'MessageSquare':
        return <MessageSquare className={`${iconClass} text-slate-400`} />;
      default:
        return <UserCheck className={`${iconClass} text-slate-400`} />;
    }
  };

  const filteredChannels = SAHAAY_CHANNELS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-full md:w-64 border-r border-slate-200 bg-slate-50/50 flex flex-col h-full select-none shrink-0">
      {/* Search Input */}
      <div className="p-3 border-b border-slate-200">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-hidden focus:border-slate-400 transition-colors"
          />
        </div>
      </div>

      {/* Channel Lists */}
      <div className="flex-1 overflow-y-auto p-2 space-y-5">
        {/* Community Channels */}
        <div>
          <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Channels
          </div>
          <div className="space-y-0.5 mt-1">
            {filteredChannels.map((channel) => {
              const isActive = activeChannelId === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => onSelectChannel(channel)}
                  className={`w-full text-left px-2.5 py-2 rounded-md transition-colors flex items-center justify-between text-xs ${
                    isActive
                      ? 'bg-slate-200/80 text-slate-900 font-medium'
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {getChannelIcon(channel.icon, channel.isUrgent)}
                    <span className="truncate">{channel.name}</span>
                  </div>
                  {channel.unreadCount ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-slate-200 text-slate-700">
                      {channel.unreadCount}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Direct Messages */}
        <div>
          <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Direct Messages
          </div>
          <div className="space-y-0.5 mt-1">
            {DIRECT_CHANNELS.map((channel) => {
              const isActive = activeChannelId === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => onSelectChannel(channel)}
                  className={`w-full text-left px-2.5 py-2 rounded-md transition-colors flex items-center justify-between text-xs ${
                    isActive
                      ? 'bg-slate-200/80 text-slate-900 font-medium'
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate">{channel.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Status Bar */}
      <div className="p-3 border-t border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
          />
          <div className="min-w-0">
            <p className="font-medium text-xs text-slate-800 truncate">{currentUser.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{currentUser.badge}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
