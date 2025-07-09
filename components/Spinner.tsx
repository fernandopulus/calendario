
import React from 'react';

interface SpinnerProps {
    size?: 'small' | 'medium' | 'large';
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'medium' }) => {
    const sizeClasses = {
        small: 'w-5 h-5 border-2',
        medium: 'w-8 h-8 border-4',
        large: 'w-16 h-16 border-4',
    };
    
    return (
        <div className={`${sizeClasses[size]} border-slate-300 border-t-indigo-600 rounded-full animate-spin`}></div>
    );
};

export default Spinner;
