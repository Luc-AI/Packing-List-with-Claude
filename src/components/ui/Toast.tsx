import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToastStore, type Toast as ToastType } from '../../store/useToastStore';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const styles = {
  success: 'bg-green-500/20 border-green-500/30 text-green-200',
  error: 'bg-red-500/20 border-red-500/30 text-red-200',
  info: 'bg-white/15 border-white/30 text-white',
};

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

function Toast({ toast, onDismiss }: ToastProps) {
  const Icon = icons[toast.type];

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-xl animate-slide-down ${styles[toast.type]}`}
      style={{
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Icon size={20} className="shrink-0" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded hover:bg-white/10 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[90%] max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
}
