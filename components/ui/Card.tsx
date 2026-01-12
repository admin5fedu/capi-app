
import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  headerAction?: React.ReactNode;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className, title, description, headerAction, noPadding = false }) => {
  return (
    <div className={cn(
      'rounded-3xl border-none bg-white shadow-soft transition-all duration-300 overflow-hidden', 
      className
    )}>
      {(title || description) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-5 md:px-8 md:py-6 border-b border-slate-50 gap-2">
          <div className="space-y-1">
            {title && <h3 className="text-base font-bold tracking-tight text-slate-900">{title}</h3>}
            {description && <p className="text-xs text-slate-400 font-medium">{description}</p>}
          </div>
          {headerAction && <div className="shrink-0 w-full sm:w-auto">{headerAction}</div>}
        </div>
      )}
      <div className={cn(noPadding ? "p-0" : "p-4 md:p-8")}>{children}</div>
    </div>
  );
};

export default Card;
