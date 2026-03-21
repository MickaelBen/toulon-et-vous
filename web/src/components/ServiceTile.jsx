import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Leaf, FileText, Inbox, AlertTriangle, Calendar, HeartPulse, Newspaper, Landmark, ArrowRight } from 'lucide-react';

const iconMap = {
  MapPin,
  Leaf,
  FileText,
  Inbox,
  AlertTriangle,
  Calendar,
  HeartPulse,
  Newspaper,
  Landmark,
};

const ServiceTile = ({ icon, label, color, subtitle, large, onClick }) => {
  const IconComponent = iconMap[icon] || Landmark;
  
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 0.97 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-200 ${
        large ? 'col-span-2' : ''
      }`}
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-full flex-shrink-0"
          style={{
            width: large ? '56px' : '48px',
            height: large ? '56px' : '48px',
            backgroundColor: color,
          }}
        >
          <IconComponent className="text-white" size={large ? 28 : 24} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm leading-tight" style={{ color: '#3b82f6' }}>{label}</div>
          {subtitle && (
            <div className="text-xs mt-1 leading-tight" style={{ color: '#6B7280' }}>{subtitle}</div>
          )}
        </div>
        {large && (
          <ArrowRight style={{ color: '#9CA3AF' }} className="flex-shrink-0" size={20} />
        )}
      </div>
    </motion.button>
  );
};

export default ServiceTile;