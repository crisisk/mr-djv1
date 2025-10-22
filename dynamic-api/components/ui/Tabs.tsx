'use client';

import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

interface Tab {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultValue?: string;
  className?: string;
}

export default function Tabs({ tabs, defaultValue, className = '' }: TabsProps) {
  return (
    <TabsPrimitive.Root defaultValue={defaultValue || tabs[0]?.value} className={className}>
      <TabsPrimitive.List className="flex gap-spacing-sm border-b border-gray-200 mb-spacing-lg overflow-x-auto">
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.value}
            value={tab.value}
            className="px-spacing-lg py-spacing-md text-sm font-medium text-gray-600 border-b-2 border-transparent hover:text-neutral-dark hover:border-gray-300 data-[state=active]:text-primary data-[state=active]:border-primary transition-colors whitespace-nowrap"
          >
            {tab.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>

      {tabs.map((tab) => (
        <TabsPrimitive.Content
          key={tab.value}
          value={tab.value}
          className="focus:outline-none"
        >
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
