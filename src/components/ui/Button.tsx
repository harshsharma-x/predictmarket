'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ── Variant & size maps ──────────────────────────────────────────────────────

const variantClasses = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 ' +
    'border border-indigo-500 shadow-lg shadow-indigo-900/30',
  secondary:
    'bg-white/10 text-white hover:bg-white/20 active:bg-white/5 ' +
    'border border-white/10 backdrop-blur-sm',
  ghost:
    'bg-transparent text-gray-300 hover:text-white hover:bg-white/10 ' +
    'border border-transparent',
  danger:
    'bg-red-600 text-white hover:bg-red-500 active:bg-red-700 ' +
    'border border-red-500 shadow-lg shadow-red-900/30',
} as const;

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
} as const;

// ── Types ────────────────────────────────────────────────────────────────────

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// ── Component ────────────────────────────────────────────────────────────────

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      ...rest
    },
    ref
  ) {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={twMerge(
          clsx(
            // Base
            'inline-flex items-center justify-center font-medium',
            'transition-all duration-150 ease-in-out',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900',
            'select-none cursor-pointer',

            variantClasses[variant],
            sizeClasses[size],

            fullWidth && 'w-full',

            isDisabled &&
              'opacity-50 cursor-not-allowed pointer-events-none',

            className
          )
        )}
        {...rest}
      >
        {loading ? (
          <Loader2 className="animate-spin shrink-0" size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}

        {children && <span>{children}</span>}

        {!loading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
