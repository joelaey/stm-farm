import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, description, trend, className }: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            {title}
          </p>
          <div className="h-10 w-10 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
            <Icon className="h-5 w-5 text-[var(--primary)]" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{value}</div>
          {(description || trend) && (
            <p className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
              {trend && (
                <span className={cn('font-medium', trend.isPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]')}>
                  {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                </span>
              )}
              {description && <span>{description}</span>}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
