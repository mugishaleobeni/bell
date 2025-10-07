import React from 'react';
import { Loader2 } from 'lucide-react';

// Define size options for flexibility
type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface SpinnerProps {
    /** The size of the spinner icon. */
    size?: SpinnerSize;
    /** Optional class name for custom styling. */
    className?: string;
}

// Map size prop to Tailwind CSS classes
const sizeClasses: Record<SpinnerSize, string> = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
};

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
    // text-primary ensures the spinner color respects the current theme (dark/light mode)
    // animate-spin is the standard Tailwind utility for continuous rotation
    const sizeClass = sizeClasses[size];
    
    return (
        <Loader2 
            className={`animate-spin text-primary ${sizeClass} ${className}`} 
            aria-label="Loading..."
        />
    );
};