"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/utils/cn";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message?: string;
}

let toastListener: ((toast: ToastMessage) => void) | null = null;

export function showToast(title: string, message?: string, type: ToastMessage["type"] = "success") {
  if (toastListener) {
    toastListener({
      id: Math.random().toString(36).substring(2, 9),
      type,
      title,
      message,
    });
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    toastListener = (toast) => {
      setToasts((prev) => [...prev, toast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 4000);
    };

    return () => {
      toastListener = null;
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-20 md:bottom-6 right-4 z-[var(--z-toast)] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto flex items-start gap-3 p-4 rounded-md border shadow-modal bg-white transition-all duration-micro animate-[slide-up_0.2s_ease-out]",
            toast.type === "success" && "border-green-200 text-green-950",
            toast.type === "error" && "border-red-200 text-red-950",
            toast.type === "info" && "border-blue-200 text-blue-950"
          )}
        >
          {toast.type === "success" && (
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          )}
          {toast.type === "error" && (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          {toast.type === "info" && (
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          )}

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-tight">{toast.title}</p>
            {toast.message && (
              <p className="text-xs text-[#6B7280] mt-0.5 leading-normal">{toast.message}</p>
            )}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 text-[#9CA3AF] hover:text-[#111318] rounded-sm transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
