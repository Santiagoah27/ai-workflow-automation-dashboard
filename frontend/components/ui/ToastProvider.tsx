"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Toast, type ToastMessage, type ToastType } from "@/components/ui/Toast";

type ShowToastInput = {
  message: string;
  type?: ToastType;
};

type ToastContextValue = {
  showToast: (toast: ShowToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const toastDurations: Record<ToastType, number> = {
  success: 2500,
  info: 3000,
  error: 4000,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(({ message, type = "info" }: ShowToastInput) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type };

    setToasts((currentToasts) => [...currentToasts, toast]);

    window.setTimeout(() => {
      setToasts((currentToasts) =>
        currentToasts.filter((currentToast) => currentToast.id !== id),
      );
    }, toastDurations[type]);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-label="Notifications">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return context;
}
