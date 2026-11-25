import React from 'react';
import { cn } from '../../lib/utils/formatters';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className,
}) => {
  const variants = {
    default: 'bg-[#21262d] text-[#8b949e] border-[#30363d]',
    success: 'bg-[#238636]/15 text-[#3fb950] border-[#238636]/40',
    warning: 'bg-[#d29922]/15 text-[#d29922] border-[#d29922]/40',
    danger: 'bg-[#da3633]/15 text-[#f85149] border-[#da3633]/40',
    info: 'bg-[#388bfd]/15 text-[#58a6ff] border-[#388bfd]/40',
    purple: 'bg-[#a371f7]/15 text-[#bc8cff] border-[#a371f7]/40',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};
