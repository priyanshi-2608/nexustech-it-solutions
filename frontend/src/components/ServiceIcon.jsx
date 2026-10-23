// src/components/ServiceIcon.jsx
import React from 'react';
import * as LucideIcons from 'lucide-react';

const ServiceIcon = ({ iconName, size = 24, className }) => {
  // Trim and ensure we have a string
  const cleanName = typeof iconName === 'string' ? iconName.trim() : 'Code';
  
  // Look up the icon from Lucide, fallback to 'Code' if not found
  const IconComponent = LucideIcons[cleanName] || LucideIcons.Code;

  return <IconComponent size={size} className={className} />;
};

export default ServiceIcon;