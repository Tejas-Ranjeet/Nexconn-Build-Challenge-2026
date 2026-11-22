'use client';

import React, { useState } from 'react';
import { SahaayChannel, AccessibilitySettings, UserProfile } from '../types/chat';
import { SAHAAY_CHANNELS, DIRECT_CHANNELS } from '../data/mockData';
import { Hash, Search } from 'lucide-react';

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

  const filteredChannels = SAHAAY_CHANNELS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-full md:w-60 border-r border-slate-200 bg-slate-50/50 flex flex-col h-full select-none shrink-0">
      {/* Search Input */}
      <div className="p-2.5 border-b border-slate-200">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-2.5 py-1.5 text-xs rounded-md border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-hidden focus:border-slate-400 transition-colors"
          />
        </div>
      </div>

      {/* Channel Lists */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {/* Community Channels */}
        <div>
          <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Channels
          </div>
          <div className="space-y-0.5 mt-0.5">
            {filteredChannels.map((channel) => {
              const isActive = activeChannelId === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => onSelectChannel(channel)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors flex items-center justify-between text-xs ${
                    isActive
                      ? 'bg-slate-200/90 text-slate-900 font-semibold'
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{channel.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Direct Messages */}
        <div>
          <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Direct Messages
          </div>
          <div className="space-y-0.5 mt-0.5">
            {DIRECT_CHANNELS.map((channel) => {
              const isActive = activeChannelId === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => onSelectChannel(channel)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors flex items-center justify-between text-xs ${
                    isActive
                      ? 'bg-slate-200/90 text-slate-900 font-semibold'
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
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
      <div className="p-2.5 border-t border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-200"
          />
          <div className="min-w-0">
            <p className="font-semibold text-xs text-slate-800 truncate">{currentUser.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{currentUser.badge}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
