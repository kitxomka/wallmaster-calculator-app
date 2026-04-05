import { useState, useEffect } from 'react';
import { Wallpaper } from '../types';

export const useWallpapers = () => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);

  useEffect(() => {
    const fetchWallpapers = async () => {
      try {
        const response = await fetch('/api/wallpapers');
        if (response.ok) {
          const data = await response.json();
          setWallpapers(data);
        }
      } catch (e) {
        console.error('Failed to fetch wallpapers', e);
      }
    };
    fetchWallpapers();
  }, []);

  const saveToBackend = async (data: Wallpaper[]) => {
    try {
      await fetch('/api/wallpapers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.error('Failed to save to backend', e);
    }
  };

  const saveWallpaper = async (wallpaper: Wallpaper) => {
    const updated = wallpapers.find(w => w.id === wallpaper.id)
      ? wallpapers.map(w => (w.id === wallpaper.id ? wallpaper : w))
      : [...wallpapers, wallpaper];
    
    setWallpapers(updated);
    await saveToBackend(updated);
  };

  const deleteWallpaper = async (id: string) => {
    const updated = wallpapers.filter(w => w.id !== id);
    setWallpapers(updated);
    await saveToBackend(updated);
  };

  const importWallpapers = async (newWallpapers: Wallpaper[]) => {
    const merged = [...wallpapers];
    newWallpapers.forEach(nw => {
      const idx = merged.findIndex(w => w.id === nw.id);
      if (idx > -1) {
        merged[idx] = nw;
      } else {
        merged.push(nw);
      }
    });
    
    setWallpapers(merged);
    await saveToBackend(merged);
  };

  return { wallpapers, saveWallpaper, deleteWallpaper, importWallpapers };
};
