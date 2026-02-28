'use client';

import React from 'react';
import {
  Toaster,
  toast as _toast,
  type Toast,
  type ToastOptions,
} from 'react-hot-toast';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';

// ── Toaster wrapper ───────────────────────────────────────────────────────────

/** Drop-in <AppToaster /> into your layout once. */
export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      toastOptions={{
        duration: 4000,
        style: { background: 'transparent', boxShadow: 'none', padding: 0 },
      }}
    >
      {(t) => <CustomToast t={t} />}
    </Toaster>
  );
}

// ── Custom toast body ─────────────────────────────────────────────────────────

interface CustomToastProps {
  t: Toast;
}

const iconMap = {
  success: <CheckCircle size={18} className="text-emerald-400 shrink-0" />,
  error:   <XCircle    size={18} className="text-red-400 shrink-0" />,
  loading: <span className="w-[18px] h-[18px] border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" />,
  blank:   <Info       size={18} className="text-blue-400 shrink-0" />,
  custom:  <Info       size={18} className="text-blue-400 shrink-0" />,
};

const borderMap: Record<string, string> = {
  success: 'border-emerald-700/50',
  error:   'border-red-700/50',
  loading: 'border-indigo-700/50',
  blank:   'border-indigo-700/50',
  custom:  'border-indigo-700/50',
};

function CustomToast({ t }: CustomToastProps) {
  const icon  = iconMap[t.type]  ?? iconMap.blank;
  const border = borderMap[t.type] ?? borderMap.blank;

  return (
    <div
      className={clsx(
        'flex items-start gap-3 w-80 max-w-full',
        'rounded-xl border bg-gray-900/90 backdrop-blur-md shadow-2xl shadow-black/40',
        'px-4 py-3',
        border,
        t.visible ? 'animate-enter' : 'animate-leave'
      )}
    >
      {icon}
      <div className="flex-1 min-w-0">
        {typeof t.message === 'string' ? (
          <p className="text-sm text-gray-100 leading-snug">{t.message}</p>
        ) : (
          // React node messages (e.g. JSX with tx hash link)
          <>{t.message as React.ReactNode}</>
        )}
      </div>
      <button
        onClick={() => _toast.dismiss(t.id)}
        className="shrink-0 text-gray-500 hover:text-gray-300 transition-colors mt-0.5"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ── Convenience helpers ───────────────────────────────────────────────────────

type ToastFn = (message: string, options?: ToastOptions) => string;

export const toast: {
  success: ToastFn;
  error:   ToastFn;
  info:    ToastFn;
  warning: ToastFn;
  loading: (message: string, options?: ToastOptions) => string;
  dismiss: (id?: string) => void;
  txPending: (txHash: string) => string;
  txSuccess: (txHash: string, chainId?: number) => void;
} = {
  success: (msg, opts) => _toast.success(msg, opts),
  error:   (msg, opts) => _toast.error(msg, opts),
  info:    (msg, opts) => _toast(msg, { icon: <Info size={18} className="text-blue-400" />, ...opts }),
  warning: (msg, opts) =>
    _toast(msg, {
      icon: <AlertTriangle size={18} className="text-yellow-400" />,
      ...opts,
    }),
  loading:   (msg, opts) => _toast.loading(msg, opts),
  dismiss:   (id)        => _toast.dismiss(id),

  txPending: (txHash) =>
    _toast.loading(
      <TxMessage
        label="Transaction submitted"
        txHash={txHash}
        chainId={137}
      />,
      { duration: Infinity }
    ),

  txSuccess: (txHash, chainId = 137) =>
    _toast.success(
      <TxMessage label="Transaction confirmed" txHash={txHash} chainId={chainId} /> as unknown as string
    ),
};

// ── Tx hash helper ────────────────────────────────────────────────────────────

function TxMessage({
  label,
  txHash,
  chainId,
}: {
  label: string;
  txHash: string;
  chainId: number;
}) {
  const explorerBase =
    chainId === 137
      ? 'https://polygonscan.com/tx/'
      : 'https://mumbai.polygonscan.com/tx/';

  return (
    <div className="space-y-0.5">
      <p className="text-sm text-gray-100">{label}</p>
      <a
        href={`${explorerBase}${txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-indigo-400 hover:text-indigo-300 font-mono truncate block"
      >
        {txHash.slice(0, 10)}…{txHash.slice(-8)}
      </a>
    </div>
  );
}
