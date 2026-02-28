'use client';

import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ── Types ────────────────────────────────────────────────────────────────────

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  /** Whether the modal is visible */
  open: boolean;
  /** Called when the user requests to close (backdrop click / Esc / × button) */
  onClose: () => void;
  /** Modal window title */
  title?: React.ReactNode;
  /** Optional footer slot */
  footer?: React.ReactNode;
  size?: ModalSize;
  /** Prevent closing on backdrop click */
  disableBackdropClose?: boolean;
  /** Prevent closing on Escape key */
  disableEscClose?: boolean;
  className?: string;
  children: React.ReactNode;
}

const sizeClasses: Record<ModalSize, string> = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-[calc(100vw-2rem)]',
};

// ── Component ────────────────────────────────────────────────────────────────

export function Modal({
  open,
  onClose,
  title,
  footer,
  size = 'md',
  disableBackdropClose = false,
  disableEscClose = false,
  className,
  children,
}: ModalProps) {
  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!disableEscClose && e.key === 'Escape') onClose();
    },
    [disableEscClose, onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll while modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!disableBackdropClose && e.target === e.currentTarget) onClose();
  };

  return (
    // Portal-like fixed overlay
    <div
      className={clsx(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        // Backdrop
        'bg-black/70 backdrop-blur-sm',
        // Fade-in animation
        'animate-in fade-in duration-150'
      )}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      {/* Modal panel */}
      <div
        className={twMerge(
          clsx(
            'relative w-full flex flex-col',
            'bg-gray-900 border border-white/10',
            'rounded-2xl shadow-2xl shadow-black/60',
            // Slide-up animation
            'animate-in slide-in-from-bottom-4 duration-200',
            sizeClasses[size],
            // Max height with scroll
            'max-h-[calc(100vh-2rem)] overflow-hidden',
            className
          )
        )}
      >
        {/* Header */}
        {(title !== undefined) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
            <h2 className="text-base font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className={clsx(
                'rounded-lg p-1.5 text-gray-400',
                'hover:text-white hover:bg-white/10',
                'transition-colors duration-150',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500'
              )}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Body – scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-white/10 shrink-0 bg-white/5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
