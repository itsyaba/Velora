'use client';

import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export default function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color, 
  bgColor 
}: MetricCardProps) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-1">{value}</h3>
      <p className="text-sm text-muted-foreground mb-2">{title}</p>
      <p className="text-xs text-green-600">{change}</p>
    </div>
  );
}
