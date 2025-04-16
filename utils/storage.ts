export const storage = {
  getViewType: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('viewType');
  },
  
  setViewType: (viewType: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('viewType', viewType);
    localStorage.setItem('viewTypeTimestamp', Date.now().toString());
  },
  
  getViewTypeTimestamp: () => {
    if (typeof window === 'undefined') return null;
    const timestamp = localStorage.getItem('viewTypeTimestamp');
    return timestamp ? Number(timestamp) : null;
  }
};
