import React from 'react';
import Link from 'next/link';
import { CirclePlus, Plus } from 'lucide-react';

const CustomButton = ({ 
  title, 
  href, 
  icon: Icon = Plus, 
  onClick,
  disabled = false,
  className = '',
  mobileTitle = title,
  color = 'primary' // Default color
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-300 hover:from-blue-600 hover:to-pink-400',
    green: 'from-green-500 to-emerald-300 hover:from-green-600 hover:to-pink-400',
    red: 'from-red-500 to-pink-300 hover:from-red-600 hover:to-pink-400',
    purple: 'from-purple-500 to-indigo-300 hover:from-purple-600 hover:to-pink-400',
  };

  const buttonClasses = `
    relative overflow-hidden font-ea-football tracking-wider uppercase    text-white  rounded-md text-sm px-6 py-2 
    inline-flex items-center justify-center
    transition-all duration-300 ease-in-out
    transform  angular-cut
    focus:outline-none focus:ring-2 focus:ring-offset-2 ]
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  const buttonContent = (
    <button 
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      aria-label={title}
    >
      <span className={` bg-secondary absolute inset-0 bg-gradient-to-r [${colorClasses[color] || colorClasses.blue}]`}></span>
      <span className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-50"></span>
      <span className="relative flex items-center">
        <Icon className="w-5 h-5 mr-2 animate-pulse" />
        <span className="hidden md:inline">{title}</span>
        <span className="md:hidden">{mobileTitle}</span>
      </span>
      <span className="absolute inset-0  opacity-25 rounded-md"></span>
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12"></span>
     
    </button>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className="group">
        {buttonContent}
      </Link>
    );
  }

  return <div className="group">{buttonContent}</div>;
};

export default CustomButton;