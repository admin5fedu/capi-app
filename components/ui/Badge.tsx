
import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
}

const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-primary text-white border-transparent',
    secondary: 'bg-slate-100 text-slate-700 border-transparent',
    destructive: 'bg-rose-50 text-rose-600 border-rose-100',
    outline: 'bg-white text-slate-600 border-slate-200',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    info: 'bg-blue-50 text-blue-600 border-blue-100',
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

export default Badge;
