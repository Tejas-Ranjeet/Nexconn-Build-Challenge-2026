'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, AccessibilitySettings, ChatMessage } from '../types/chat';
import {
  AlertTriangle,
  X,
  MapPin,
  HeartPulse,
  Flame,
  Users2,
  Package,
  CheckCircle,
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
      // Auto fetch GPS location if supported
      if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setIsLocating(false);
            setLocationText(`GPS: Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)} (${currentUser.location || 'Local Area'})`);
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
        ? 'CRITICAL MEDICAL EMERGENCY'
        : emergencyType === 'rescue'
        ? 'URGENT RESCUE / HAZARD'
        : emergencyType === 'elderly'
        ? 'ELDERLY ASSISTANCE REQUIRED'
        : 'EMERGENCY SUPPLIES / RATION';

    const sosMsg: ChatMessage = {
      id: `sos_${Date.now()}`,
      channelId: 'sahaay_emergency',
      senderId: currentUser.userId,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatarUrl,
      content: `🚨 [${emergencyTitle}] Reported by ${currentUser.name}.\nLocation: ${locationText}\nNotes: ${
        details || 'Immediate volunteer / first responder dispatch requested.'
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
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          accessibility.highContrast
            ? 'bg-black text-yellow-400 border-yellow-400'
            : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        {/* Modal Header */}
        <div className="bg-rose-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 animate-bounce" />
            <div>
              <h3 className="font-bold text-base tracking-wide">BROADCAST EMERGENCY SOS</h3>
              <p className="text-xs text-rose-100">Dispatches instantly to Nexconn Emergency Channels</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-rose-700 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-xl font-bold text-emerald-600">Emergency Alert Broadcasted!</h4>
            <p className="text-xs text-slate-500">
              Your SOS notification has been prioritized and dispatched to on-duty volunteers and medical officers.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBroadcast} className="p-5 space-y-4">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">
                1. Select Emergency Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'medical', label: 'Medical Distress', icon: HeartPulse, color: 'text-rose-600' },
                  { id: 'rescue', label: 'Hazard / Rescue', icon: Flame, color: 'text-amber-600' },
                  { id: 'elderly', label: 'Elder Assistance', icon: Users2, color: 'text-blue-600' },
                  { id: 'supplies', label: 'Food / Oxygen', icon: Package, color: 'text-emerald-600' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = emergencyType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setEmergencyType(item.id as any)}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        isSelected
                          ? accessibility.highContrast
                            ? 'bg-yellow-400 text-black border-yellow-400 font-bold'
                            : 'bg-rose-50 border-rose-400 text-rose-950 font-semibold ring-2 ring-rose-400/30'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${item.color}`} />
                      <span className="text-xs font-bold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-500 flex items-center justify-between">
                <span>2. Emergency Location</span>
                {isLocating && <span className="text-[10px] text-blue-600">Detecting GPS...</span>}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="Apartment, Landmark, Street or Ward"
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-hidden ${
                    accessibility.highContrast
                      ? 'bg-black text-yellow-400 border-yellow-400'
                      : 'bg-slate-50 border-slate-200 focus:border-rose-500'
                  }`}
                />
              </div>
            </div>

            {/* Additional details */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-500">
                3. Situation Notes / Symptoms
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe patient condition, number of persons, or specific assistance required..."
                className={`w-full p-3 text-xs rounded-xl border focus:outline-hidden ${
                  accessibility.highContrast
                    ? 'bg-black text-yellow-400 border-yellow-400'
                    : 'bg-slate-50 border-slate-200 focus:border-rose-500'
                }`}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-100 text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>BROADCAST SOS NOW</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
