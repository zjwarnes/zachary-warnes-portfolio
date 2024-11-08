'use client'

import React, { useEffect } from 'react';

export function cleanupModel() {
  if (typeof window !== 'undefined') {
    // Clear model from memory when component unmounts
    if ('gc' in window) {
      (window as any).gc();
    }
  }
}

export function useModelCleanup() {
  useEffect(() => {
    return () => {
      cleanupModel();
    };
  }, []);
} 