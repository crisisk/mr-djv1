'use client';

import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Dialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  className = '',
}: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}

      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild>
              <motion.div
                className={`fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-gray-200 bg-white p-spacing-xl shadow-2xl ${className}`}
                initial={{ opacity: 0, scale: 0.95, y: '-45%', x: '-50%' }}
                animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
                exit={{ opacity: 0, scale: 0.95, y: '-45%', x: '-50%' }}
                transition={{ duration: 0.2 }}
              >
                <DialogPrimitive.Title className="text-font-size-h3 font-bold text-neutral-dark mb-spacing-sm">
                  {title}
                </DialogPrimitive.Title>

                {description && (
                  <DialogPrimitive.Description className="text-sm text-gray-600 mb-spacing-lg">
                    {description}
                  </DialogPrimitive.Description>
                )}

                <div className="mt-spacing-md">{children}</div>

                <DialogPrimitive.Close className="absolute right-spacing-md top-spacing-md rounded-full p-2 hover:bg-gray-100 transition-colors">
                  <X className="h-5 w-5 text-gray-500" />
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
