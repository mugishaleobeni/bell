import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
  return (
    <Select defaultValue="en">
      <SelectTrigger className="w-[140px] glass-nav border-glass-border">
        <Globe className="w-4 h-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="glass-medium backdrop-blur-xl border border-glass-border">
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="rw">Kinyarwanda</SelectItem>
      </SelectContent>
    </Select>
  );
}
