'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { useSettings } from '@/contexts/SettingsContext';

interface ChartCardProps {
  title: string;
  description?: string;
  data: any[];
  type?: 'line' | 'bar';
  xKey: string;
  yKey1: string;
  yKey2?: string;
  color1?: string;
  color2?: string;
  name1?: string;
  name2?: string;
  className?: string;
}

export function ChartCard({ 
  title, description, data, type = 'line', xKey, 
  yKey1, yKey2, color1 = '#22c55e', color2 = '#d97706',
  name1, name2, className
}: ChartCardProps) {
  const { theme } = useSettings();
  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'line' ? (
              <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey={xKey} stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Rp ${val / 1000}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-secondary)', 
                    borderColor: 'var(--border-light)',
                    color: 'var(--text-primary)'
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey={yKey1} name={name1 || yKey1} stroke={color1} strokeWidth={2} activeDot={{ r: 8 }} />
                {yKey2 && <Line type="monotone" dataKey={yKey2} name={name2 || yKey2} stroke={color2} strokeWidth={2} />}
              </LineChart>
            ) : (
              <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey={xKey} stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-secondary)', 
                    borderColor: 'var(--border-light)',
                    color: 'var(--text-primary)'
                  }} 
                />
                <Legend />
                <Bar dataKey={yKey1} name={name1 || yKey1} fill={color1} radius={[4, 4, 0, 0]} />
                {yKey2 && <Bar dataKey={yKey2} name={name2 || yKey2} fill={color2} radius={[4, 4, 0, 0]} />}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
