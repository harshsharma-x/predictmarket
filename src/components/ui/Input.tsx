'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ── Types ────────────────────────────────────────────────────────────────────

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  /** Icon rendered on the left side */
  leftIcon?: React.ReactNode;
  /** Icon or element rendered on the right side */
  rightIcon?: React.ReactNode;
  /** Stretch to fill parent width (default true) */
  fullWidth?: boolean;
  /** Wrapper className */
  wrapperClassName?: string;
}

// ── Component ────────────────────────────────────────────────────────────────

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      fullWidth = true,
      wrapperClassName,
      id,
      className,
      disabled,
      ...rest
    },
    ref
  ) {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const hasError = Boolean(error);

    return (
      <div className={twMerge(clsx('flex flex-col gap-1.5', fullWidth && 'w-full', wrapperClassName))}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-300 select-none"
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative flex items-center">
          {/* Left icon */}
          {leftIcon && (
            <span className="absolute left-3 text-gray-400 pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={twMerge(
              clsx(
                'w-full rounded-xl bg-white/5 border text-white placeholder-gray-500',
                'px-4 py-2.5 text-sm',
                'transition-all duration-150',
                'focus:outline-none focus:ring-2 focus:ring-offset-0',
                'disabled:opacity-50 disabled:cursor-not-allowed',

                leftIcon  && 'pl-10',
                rightIcon && 'pr-10',

                hasError
                  ? 'border-red-500/70 focus:ring-red-500/50 focus:border-red-500'
                  : 'border-white/10 focus:ring-indigo-500/50 focus:border-indigo-500/70 hover:border-white/20',

                className
              )
            )}
            {...rest}
          />

          {/* Right icon */}
          {rightIcon && (
            <span className="absolute right-3 text-gray-400">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Error / hint */}
        {(error || hint) && (
          <p
            className={clsx(
              'text-xs',
              hasError ? 'text-red-400' : 'text-gray-500'
            )}
          >
            {error ?? hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
