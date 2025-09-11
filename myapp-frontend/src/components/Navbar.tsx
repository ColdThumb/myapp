import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import Button from './Button';

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface NavbarProps {
  brand?: React.ReactNode;
  items?: NavItem[];
  actions?: React.ReactNode;
  className?: string;
  sticky?: boolean;
  transparent?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  brand,
  items = [],
  actions,
  className,
  sticky = true,
  transparent = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const baseClasses = [
    'w-full border-b border-gray-200',
    'transition-all duration-normal',
  ];

  const backgroundClasses = transparent
    ? 'bg-white/80 backdrop-blur-md'
    : 'bg-white';

  const positionClasses = sticky ? 'sticky top-0 z-50' : '';

  const navbarClasses = cn(
    baseClasses,
    backgroundClasses,
    positionClasses,
    className
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={navbarClasses}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          {brand && (
            <div className="flex-shrink-0">
              {brand}
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {items.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'text-sm font-medium transition-all duration-normal relative',
                      'hover:text-primary',
                      isActive
                        ? 'text-primary after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full'
                        : 'text-gray-600'
                    )
                  }
                >
                  <div className="flex items-center space-x-2">
                    {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {actions}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="small"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
          <div className="px-6 py-4 space-y-2">
            {items.map((item, index) => (
              <NavLink
                key={index}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'block px-4 py-3 rounded-lg text-base font-medium transition-all duration-normal',
                    isActive
                      ? 'bg-gray-100 text-primary'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  )
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  {item.icon && <span className="w-5 h-5">{item.icon}</span>}
                  <span>{item.label}</span>
                </div>
              </NavLink>
            ))}
            
            {actions && (
              <div className="pt-4 border-t border-gray-200">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;