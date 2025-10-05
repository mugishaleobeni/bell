import React from 'react';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    colorClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass }) => (
    <Card className={`glass-light backdrop-blur-sm border border-glass-border shadow-lg ${colorClass} transition-shadow hover:shadow-xl`}>
        <CardContent className="p-4 flex items-center justify-between">
            <div>
                <CardDescription className="text-sm font-semibold text-muted-foreground uppercase">{title}</CardDescription>
                <CardTitle className="text-3xl font-extrabold mt-1">{value}</CardTitle>
            </div>
            {/* The icon is wrapped to give it a background color based on the status color */}
            <div className={`p-3 rounded-full bg-opacity-20 ${colorClass.replace('border-l-4 border-', 'bg-')} text-white`}>
                 {/* We style the icon directly in the main component, so we don't need color manipulation here */}
                {icon}
            </div>
        </CardContent>
    </Card>
);