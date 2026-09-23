import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from './Toast.jsx';

export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}
