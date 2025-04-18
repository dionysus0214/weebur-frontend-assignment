import { useState, useEffect } from 'react';
import { storage } from '@/utils/storage';
import type { ViewType } from '@/types/product';

export function useViewType() {
  const [viewType, setViewType] = useState<ViewType>('grid');

  useEffect(() => {
    const savedView = storage.getViewType();
    const savedTime = storage.getViewTypeTimestamp();
    
    const shouldResetView = () => {
      if (!savedTime) return true;
      const timeDiff = Date.now() - savedTime;
      return timeDiff > 24 * 60 * 60 * 1000;
    };

    if (!savedView || shouldResetView()) {
      const newView = Math.random() < 0.5 ? 'grid' : 'list';
      storage.setViewType(newView);
      setViewType(newView as ViewType);
    } else {
      setViewType(savedView as ViewType);
    }
  }, []);

  return viewType;
}
