'use client';

import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types/chat';
import { X, User, MapPin, Briefcase } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
}) => {
  const [name, setName] = useState(currentUser.name || '');
  const [role, setRole] = useState<UserRole>(currentUser.role || 'citizen');
  const [location, setLocation] = useState(currentUser.location || 'Sector 4, Rohini');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim() || 'Community Member';
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const userId = `user_${slug}`;

    const badge =
      role === 'doctor'
        ? 'Physician'
        : role === 'volunteer'
        ? 'First Responder'
        : role === 'coordinator'
        ? 'Area Coordinator'
        : 'Resident';

    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      cleanName
    )}&backgroundColor=0f172a&textColor=ffffff`;

    const updatedProfile: UserProfile = {
      userId,
      name: cleanName,
      role,
      badge,
      location: location.trim() || 'Sector 4, Rohini',
      avatarUrl,
    };

    onSaveProfile(updatedProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-slate-900">Your Profile & Identity</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Your Name
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Enter your full name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-slate-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Your Role in the Community
            </label>
            <div className="relative">
              <Briefcase className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:border-slate-400 transition-colors"
              >
                <option value="citizen">Resident / Citizen</option>
                <option value="volunteer">Volunteer / First Responder</option>
                <option value="doctor">Doctor / Healthcare Professional</option>
                <option value="coordinator">Area Coordinator</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Location / Address
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Flat 302, Pocket B, Rohini"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-slate-400 transition-colors"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-2xs transition-colors"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
