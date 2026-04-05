import React from 'react';
import { Wallpaper, CalculationResult, Wall } from '../types';
import { Calculator, Package, Layers, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { fromCm } from '../utils/calculations';

interface Props {
  wallpaper: Wallpaper;
  walls: Wall[];
  result: CalculationResult;
}

export const CalculationSummary: React.FC<Props> = ({ walls, result }) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_8px_40px_rgba(15,23,42,0.08)] border border-slate-100 overflow-hidden">
      <div className="bg-[var(--color-brand-primary)] p-10 text-white relative overflow-hidden">
        <div className="absolute -top-6 -right-6 opacity-10">
          <Calculator className="w-32 h-32" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <h2 className="text-2xl font-serif font-bold">Calculation Results</h2>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Professional Strip Analysis</p>
        </div>
      </div>

      <div className="p-10 space-y-10">
        {/* Main Result */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center justify-center p-12 bg-amber-50/30 rounded-[2rem] border border-amber-100/50 relative group"
        >
          <div className="absolute top-4 right-4 text-amber-200 group-hover:text-amber-400 transition-colors">
            <Package className="w-8 h-8" />
          </div>
          <span className="text-amber-600 font-bold text-[10px] uppercase tracking-[0.25em] mb-4">Total Rolls Needed</span>
          <div className="flex items-baseline gap-3">
            <span className="text-8xl font-serif font-bold text-slate-900 leading-none">{result.totalRolls}</span>
            <span className="text-2xl font-serif font-bold text-slate-400 italic">rolls</span>
          </div>
          <div className="mt-6 px-4 py-1.5 bg-white rounded-full border border-amber-100 shadow-sm">
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Precision Estimate</p>
          </div>
        </motion.div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-4">
          <div className="p-6 rounded-[1.5rem] bg-slate-50/50 border border-slate-100 flex items-center gap-6 group hover:bg-white hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">Total Strips Required</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-serif font-bold text-slate-900">{result.totalStrips}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">strips</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wall Breakdown */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-100" />
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">Wall Breakdown</h3>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          
          <div className="space-y-4">
            {walls.map((wall, idx) => {
              const wallResult = result.stripsPerWall.find(r => r.wallId === wall.id);
              const wallDetail = result.details.find(d => d.wallId === wall.id);
              const stripLengthFt = wallDetail ? fromCm(wallDetail.adjustedStripLength, 'ft') : 0;
              
              return (
                <motion.div 
                  key={wall.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 rounded-[1.5rem] border border-slate-100 bg-white hover:border-amber-200 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-slate-50 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                        {idx + 1}
                      </div>
                      <span className="font-serif font-bold text-slate-900">{wall.name || `Wall ${idx + 1}`}</span>
                    </div>
                    <div className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest">
                      {wallResult?.rollsForThisWall || 0} Rolls
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Strip Length</p>
                      <p className="text-xs font-bold text-slate-700">{stripLengthFt.toFixed(2)} ft</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Per Roll</p>
                      <p className="text-xs font-bold text-slate-700">{wallDetail?.stripsPerRoll} strips</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Total Strips</p>
                      <p className="text-xs font-bold text-slate-700">{wallResult?.strips} needed</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
