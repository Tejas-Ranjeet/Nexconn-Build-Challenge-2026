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
  Hash,
  MapPin,
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
  currentUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getChannelIcon = (iconName: string, isUrgent?: boolean) => {
    const iconClass = 'w-3.5 h-3.5 shrink-0';
    if (isUrgent) {
      return <ShieldAlert className={`${iconClass} text-red-500`} />;
    }
    switch (iconName) {
      case 'Stethoscope':
        return <Stethoscope className={`${iconClass} text-slate-400`} />;
      case 'Users':
        return <Users className={`${iconClass} text-slate-400`} />;
      case 'Bell':
        return <Bell className={`${iconClass} text-slate-400`} />;
      case 'MessageSquare':
        return <MessageSquare className={`${iconClass} text-slate-400`} />;
      default:
        return <Hash className={`${iconClass} text-slate-400`} />;
    }
  };

  const filteredChannels = SAHAAY_CHANNELS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-full md:w-64 border-r border-slate-200/80 bg-slate-50/60 flex flex-col h-full select-none shrink-0">
      {/* Community Location Banner */}
      <div className="px-3 py-2.5 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-800 truncate">Sector 4 Community Grid</span>
        </div>
        <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
          Active
        </span>
      </div>

      {/* Search Input */}
      <div className="p-2.5 border-b border-slate-200/60">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search channels & lines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-hidden focus:border-slate-300 transition-colors"
          />
        </div>
      </div>

      {/* Channel Lists */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {/* Community Channels */}
        <div>
          <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Community Channels
          </div>
          <div className="space-y-0.5 mt-1">
            {filteredChannels.map((channel) => {
              const isActive = activeChannelId === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => onSelectChannel(channel)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors flex items-center justify-between text-xs ${
                    isActive
                      ? 'bg-slate-200/80 text-slate-900 font-semibold shadow-2xs'
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {getChannelIcon(channel.icon, channel.isUrgent)}
                    <span className="truncate">{channel.name}</span>
                  </div>
                  {channel.isUrgent ? (
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-red-100 text-red-700">
                      SOS
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Direct Care Lines */}
        <div>
          <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Direct Care Lines
          </div>
          <div className="space-y-0.5 mt-1">
            {DIRECT_CHANNELS.map((channel) => {
              const isActive = activeChannelId === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => onSelectChannel(channel)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors flex items-center justify-between text-xs ${
                    isActive
                      ? 'bg-slate-200/80 text-slate-900 font-semibold shadow-2xs'
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate">{channel.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">1:1</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-2.5 border-t border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative shrink-0">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
            />
            <span className="w-2 h-2 rounded-full bg-emerald-500 border border-white absolute bottom-0 right-0" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-xs text-slate-800 truncate">{currentUser.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{currentUser.badge} · {currentUser.location}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
