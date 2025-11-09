// Card 组件
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hover = false,
}) => {
  const hoverStyle = hover ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer' : '';
  const clickableStyle = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`
        bg-white rounded-lg shadow-md p-4 transition-all duration-200
        ${hoverStyle} ${clickableStyle} ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
