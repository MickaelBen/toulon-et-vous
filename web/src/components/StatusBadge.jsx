import React from 'react';

const StatusBadge = ({ status, small }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Nouveau':
        return { bg: 'rgba(37, 99, 235, 0.2)', text: '#3B82F6', label: 'Nouveau' };
      case 'En cours':
        return { bg: 'rgba(245, 158, 11, 0.2)', text: '#F59E0B', label: 'En cours' };
      case 'Résolu':
        return { bg: 'rgba(22, 163, 74, 0.2)', text: '#16A34A', label: 'Résolu' };
      case 'Fermé':
        return { bg: 'rgba(107, 114, 128, 0.2)', text: '#9CA3AF', label: 'Fermé' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.2)', text: '#9CA3AF', label: status };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center justify-center font-medium rounded-full ${
        small ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
      style={{
        backgroundColor: config.bg,
        color: config.text,
      }}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;