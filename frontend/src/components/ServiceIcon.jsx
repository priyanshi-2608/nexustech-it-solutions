import React from 'react';
import * as LucideIcons from 'lucide-react';

const ServiceIcon = ({ iconName, size = 24, className }) => {
  const cleanName = typeof iconName === 'string' ? iconName.trim() : 'Code';
  const IconComponent = LucideIcons[cleanName] || LucideIcons.Code;

  return <IconComponent size={size} className={className} />;
};

export default ServiceIcon;