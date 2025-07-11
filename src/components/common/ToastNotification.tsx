
import { toast as originalToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'error':
      return <XCircle className="h-4 w-4 text-red-600" />;
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-orange-600" />;
    case 'info':
      return <Info className="h-4 w-4 text-blue-600" />;
    default:
      return null;
  }
};

const getToastStyles = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'border-green-200 bg-green-50';
    case 'error':
      return 'border-red-200 bg-red-50';
    case 'warning':
      return 'border-orange-200 bg-orange-50';
    case 'info':
      return 'border-blue-200 bg-blue-50';
    default:
      return '';
  }
};

export const toast = {
  success: (options: Omit<ToastOptions, 'type'>) => {
    originalToast({
      title: (
        <div className="flex items-center gap-2">
          {getToastIcon('success')}
          {options.title}
        </div>
      ) as any,
      description: options.description,
      duration: options.duration || 4000,
      className: getToastStyles('success'),
    });
  },

  error: (options: Omit<ToastOptions, 'type'>) => {
    originalToast({
      title: (
        <div className="flex items-center gap-2">
          {getToastIcon('error')}
          {options.title}
        </div>
      ) as any,
      description: options.description,
      duration: options.duration || 5000,
      className: getToastStyles('error'),
      variant: 'destructive',
    });
  },

  warning: (options: Omit<ToastOptions, 'type'>) => {
    originalToast({
      title: (
        <div className="flex items-center gap-2">
          {getToastIcon('warning')}
          {options.title}
        </div>
      ) as any,
      description: options.description,
      duration: options.duration || 4500,
      className: getToastStyles('warning'),
    });
  },

  info: (options: Omit<ToastOptions, 'type'>) => {
    originalToast({
      title: (
        <div className="flex items-center gap-2">
          {getToastIcon('info')}
          {options.title}
        </div>
      ) as any,
      description: options.description,
      duration: options.duration || 4000,
      className: getToastStyles('info'),
    });
  },
};

export default toast;
