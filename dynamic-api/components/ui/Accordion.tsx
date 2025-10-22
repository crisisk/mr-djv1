'use client';

import React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  value: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  className?: string;
}

export default function Accordion({
  items,
  type = 'single',
  defaultValue,
  className = '',
}: AccordionProps) {
  const props = type === 'single'
    ? { type: 'single' as const, defaultValue: defaultValue as string | undefined, collapsible: true }
    : { type: 'multiple' as const, defaultValue: defaultValue as string[] | undefined };

  return (
    <AccordionPrimitive.Root
      {...props}
      className={`space-y-spacing-sm ${className}`}
    >
      {items.map((item) => (
        <AccordionPrimitive.Item
          key={item.value}
          value={item.value}
          className="border border-gray-200 rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow"
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="flex w-full items-center justify-between px-spacing-lg py-spacing-md text-left text-sm font-semibold text-neutral-dark hover:bg-gray-50 transition-colors group">
              {item.title}
              <ChevronDown className="h-5 w-5 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>

          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="px-spacing-lg py-spacing-md text-sm text-gray-600 border-t border-gray-100">
              {item.content}
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
