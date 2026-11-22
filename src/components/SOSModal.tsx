'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, AccessibilitySettings, ChatMessage } from '../types/chat';
import {
  AlertCircle,
  X,
  MapPin,
  HeartPulse,
  Flame,
  Users,
  Package,
  CheckCircle2,
} from 'lucide-react';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  accessibility: AccessibilitySettings;
  onBroadcastSOS: (sosMessage: ChatMessage) => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  accessibility,
  onBroadcastSOS,
}) => {
  const [emergencyType, setEmergencyType] = useState<'medical' | 'rescue' | 'elderly' | 'supplies'>('medical');
  const [locationText, setLocationText] = useState(currentUser.location || 'Sector 4, Rohini');
  const [details, setDetails] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setIsLocating(false);
            setLocationText(`Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)} (${currentUser.location || 'Local Area'})`);
          },
          () => {
            setIsLocating(false);
          },
          { timeout: 5000 }
        );
      }
    }
  }, [isOpen, currentUser.location]);

  if (!isOpen) return null;

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();

    const emergencyTitle =
      emergencyType === 'medical'
        ? 'MEDICAL EMERGENCY'
        : emergencyType === 'rescue'
        ? 'RESCUE / HAZARD'
        : emergencyType === 'elderly'
        ? 'ELDERLY ASSISTANCE'
        : 'EMERGENCY SUPPLIES';

    const sosMsg: ChatMessage = {
      id: `sos_${Date.now()}`,
      channelId: 'sahaay_emergency',
      senderId: currentUser.userId,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatarUrl,
      content: `[${emergencyTitle}] Reported by ${currentUser.name}.\nLocation: ${locationText}\nNotes: ${
        details || 'Immediate responder assistance requested.'
      }`,
      timestamp: Date.now(),
      isUrgent: true,
      isSOS: true,
      emergencyDetails: {
        type: emergencyType,
        location: locationText,
        status: 'pending',
      },
    };

    onBroadcastSOS(sosMsg);
    setIsSuccess(true);

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <h3 className="font-semibold text-sm text-slate-900">Emergency Assistance Request</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-semibold text-sm text-slate-900">Emergency Request Dispatched</h4>
            <p className="text-xs text-slate-500">
              Your request has been routed to the emergency response team.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBroadcast} className="p-4 space-y-4">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Request Type
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'medical', label: 'Medical Support', icon: HeartPulse },
                  { id: 'rescue', label: 'Hazard / Rescue', icon: Flame },
                  { id: 'elderly', label: 'Elder Assistance', icon: Users },
                  { id: 'supplies', label: 'Rations / Supplies', icon: Package },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = emergencyType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setEmergencyType(item.id as any)}
                      className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-colors ${
                        isSelected
                          ? 'border-red-500 bg-red-50/50 text-red-900 font-medium'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700">Location</label>
                {isLocating && <span className="text-[11px] text-blue-600">Detecting...</span>}
              </div>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  required
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="Address or landmark"
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-hidden focus:border-slate-400"
                />
              </div>
            </div>

            {/* Details */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Situation Details (Optional)
              </label>
              <textarea
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe current condition or specific help required..."
                className="w-full p-2 text-xs rounded-md border border-slate-200 focus:outline-hidden focus:border-slate-400"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-md border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors"
              >
                Dispatch Alert
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
