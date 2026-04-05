import React, { useState } from 'react';
import { Wallpaper } from '../types';
import { Trash2, Hash, Search, Sparkles, ArrowRight, Layers } from 'lucide-react';
import { formatValue } from '../utils/calculations';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  wallpapers: Wallpaper[];
  onSelect: (wallpaper: Wallpaper) => void;
  onDelete: (id: string) => void;
}

export const WallpaperLibrary: React.FC<Props> = ({ wallpapers, onSelect, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWallpapers = wallpapers.filter(wp => 
    wp.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900">Wallpaper Library</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Your Saved Collections</p>
          </div>
        </div>
        
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by SKU or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-[1.5rem] border border-slate-100 bg-white shadow-sm focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 outline-none transition-all text-sm font-medium cursor-pointer"
          />
        </div>
      </div>

      {filteredWallpapers.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100"
        >
          <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
            <Layers className="w-10 h-10 text-slate-200" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-serif font-bold text-slate-900">Library Empty</h4>
            <p className="text-sm text-slate-400 max-w-xs mx-auto">
              {searchQuery ? 'No wallpapers match your search.' : 'Your library is empty. Save a wallpaper to see it here.'}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredWallpapers.sort((a, b) => b.updatedAt - a.updatedAt).map((wp, idx) => (
              <motion.div
                key={wp.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-amber-200 hover:shadow-[0_20px_50px_rgba(197,160,89,0.08)] transition-all cursor-pointer relative overflow-hidden"
                onClick={() => onSelect(wp)}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/30 rounded-bl-[3rem] -translate-y-12 translate-x-12 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-500" />
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
                      <Hash className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-slate-900 truncate pr-8">{wp.sku || 'Unnamed Wallpaper'}</h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(wp.id);
                    }}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all relative z-20 cursor-pointer"
                    title="Delete from Library"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-6 relative z-10">
                  <div className="space-y-1">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Width</p>
                    <p className="text-xs font-bold text-slate-700">{formatValue(wp.width)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Length</p>
                    <p className="text-xs font-bold text-slate-700">{formatValue(wp.length)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Repeat</p>
                    <p className="text-xs font-bold text-slate-700">{formatValue(wp.patternRepeat)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Match</p>
                    <p className="text-xs font-bold text-slate-700 capitalize italic">{wp.match}</p>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    Last updated {new Date(wp.updatedAt).toLocaleDateString()}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
