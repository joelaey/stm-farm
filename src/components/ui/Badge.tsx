import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-medium)]',
    success: 'bg-[#dcfce7] text-[#166534] border-[#bbf7d0] dark:bg-[#14532d] dark:text-[#4ade80] dark:border-[#166534]',
    warning: 'bg-[#fef9c3] text-[#854d0e] border-[#fef08a] dark:bg-[#422006] dark:text-[#facc15] dark:border-[#713f12]',
    danger: 'bg-[#fee2e2] text-[#991b1b] border-[#fecaca] dark:bg-[#450a0a] dark:text-[#f87171] dark:border-[#7f1d1d]',
    info: 'bg-[#dbeafe] text-[#1e40af] border-[#bfdbfe] dark:bg-[#1e3a8a] dark:text-[#60a5fa] dark:border-[#1e40af]',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
