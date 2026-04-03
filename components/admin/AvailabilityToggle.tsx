'use client';

import { Switch } from '@/components/ui/switch';

interface AvailabilityToggleProps {
  available: boolean;
  onChange: (available: boolean) => void;
}

export default function AvailabilityToggle({ available, onChange }: AvailabilityToggleProps) {
  return (
    <Switch
      checked={available}
      onCheckedChange={onChange}
    />
  );
}
