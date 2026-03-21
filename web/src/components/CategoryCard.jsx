import React from 'react';
import { motion } from 'framer-motion';
import { Route as Road, Lightbulb, Leaf, Trash2, Hammer, HelpCircle } from 'lucide-react';

const iconMap = {
  Road,
  Lightbulb,
  Leaf,
  Trash2,
  Hammer,
  HelpCircle,
};

const CategoryCard = ({ icon, label, color, selected, onClick }) => {
  const IconComponent = iconMap[icon] || HelpCircle;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-2xl p-4 transition-all duration-200 ${
        selected ? 'scale-105' : ''
      }`}
      style={{
        background: selected ? '#EFF6FF' : '#FFFFFF',
        border: selected ? '2px solid #3b82f6' : '2px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: '48px',
            height: '48px',
            backgroundColor: color,
          }}
        >
          <IconComponent className="text-white" size={24} />
        </div>
        <div className="font-medium text-sm text-center" style={{ color: '#3b82f6' }}>{label}</div>
      </div>
    </motion.button>
  );
};

export default CategoryCard;