'use client';

import React, { useState } from 'react';
import { SahaayChannel, AccessibilitySettings, UserProfile } from '../types/chat';
import { SAHAAY_CHANNELS, DIRECT_CHANNELS } from '../data/mockData';
import {
  AlertOctagon,
  Stethoscope,
  Users,
  Megaphone,
  HeartHandshake,
  UserCheck,
  Search,
  Radio,
  PlusCircle,
  HelpCircle,
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
    const iconClass = `w-4 h-4 ${isUrgent ? 'text-rose-600 animate-pulse' : 'text-slate-500'}`;
    switch (iconName) {
      case 'AlertOctagon':
        return <AlertOctagon className={iconClass} />;
      case 'Stethoscope':
        return <Stethoscope className={iconClass} />;
      case 'Users':
        return <Users className={iconClass} />;
      case 'Megaphone':
        return <Megaphone className={iconClass} />;
      case 'HeartHandshake':
        return <HeartHandshake className={iconClass} />;
      default:
        return <UserCheck className={iconClass} />;
    }
  };

  const filteredChannels = SAHAAY_CHANNELS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={`w-full md:w-80 border-r flex flex-col h-full ${
        accessibility.highContrast
          ? 'bg-black text-yellow-400 border-yellow-400'
          : 'bg-slate-50/70 border-slate-200'
      }`}
    >
      {/* Search & Channel Header */}
      <div className="p-3 border-b border-slate-200/80">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search channels or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border focus:outline-hidden ${
              accessibility.highContrast
                ? 'bg-black text-yellow-400 border-yellow-400 placeholder:text-yellow-600'
                : 'bg-white border-slate-200 focus:border-blue-500 placeholder:text-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Channel Groups List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {/* Community & Emergency Channels */}
        <div>
          <div className="flex items-center justify-between px-2 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Community Channels</span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
              <Radio className="w-3 h-3 animate-pulse" /> Live
            </span>
          </div>
          <div className="space-y-1 mt-1">
            {filteredChannels.map((channel) => {
              const isActive = activeChannelId === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => onSelectChannel(channel)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 ${
                    isActive
                      ? accessibility.highContrast
                        ? 'bg-yellow-400 text-black font-bold'
                        : 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200'
                      : accessibility.highContrast
                      ? 'hover:bg-yellow-950/40 text-yellow-300'
                      : 'hover:bg-slate-200/60 text-slate-700'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                      channel.isUrgent
                        ? 'bg-rose-100 text-rose-600 border border-rose-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {getChannelIcon(channel.icon, channel.isUrgent)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="truncate text-xs font-bold">{channel.name}</span>
                      {channel.unreadCount ? (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            channel.isUrgent ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'
                          }`}
                        >
                          {channel.unreadCount}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {channel.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-medium">
                      <span>Nexconn Group ID: {channel.id}</span>
                      {channel.memberCount && <span>· {channel.memberCount} members</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Direct Channels (1:1 Care Coordination) */}
        <div>
          <div className="flex items-center justify-between px-2 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Direct Care Lines (1:1)</span>
          </div>
          <div className="space-y-1 mt-1">
            {DIRECT_CHANNELS.map((channel) => {
              const isActive = activeChannelId === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => onSelectChannel(channel)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 ${
                    isActive
                      ? accessibility.highContrast
                        ? 'bg-yellow-400 text-black font-bold'
                        : 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200'
                      : accessibility.highContrast
                      ? 'hover:bg-yellow-950/40 text-yellow-300'
                      : 'hover:bg-slate-200/60 text-slate-700'
                  }`}
                >
                  <div className="p-2 rounded-lg mt-0.5 shrink-0 bg-blue-50 text-blue-600 border border-blue-100">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="truncate text-xs font-bold">{channel.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {channel.description}
                    </p>
                    <div className="text-[10px] text-slate-400 mt-1">
                      DirectChannelIdentifier: {channel.id.replace('direct_', '')}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Information & Help Banner */}
      <div
        className={`p-3 border-t text-xs ${
          accessibility.highContrast
            ? 'bg-black text-yellow-400 border-yellow-400'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full border object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="font-bold truncate text-xs">{currentUser.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{currentUser.badge}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
