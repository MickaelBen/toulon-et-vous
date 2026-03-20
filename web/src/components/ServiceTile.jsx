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
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
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
          <div className="text-white font-bold text-sm leading-tight">{label}</div>
          {subtitle && (
            <div className="text-white/60 text-xs mt-1 leading-tight">{subtitle}</div>
          )}
        </div>
        {large && (
          <ArrowRight className="text-white/60 flex-shrink-0" size={20} />
        )}
      </div>
    </motion.button>
  );
};

export default ServiceTile;