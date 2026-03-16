import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value, max = 5, size = 'md', interactive = false, onChange }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (index) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[...Array(max)].map((_, index) => (
        <Star
          key={index}
          className={`${sizes[size]} ${
            index < value
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300 dark:text-gray-600'
          } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
};

export default Rating;