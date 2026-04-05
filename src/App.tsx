import { useState, useEffect } from 'react';
import { Wallpaper, Wall, CalculationResult } from './types';
import { useWallpapers } from './hooks/useWallpapers';
import { calculateWallpaper as runCalculation } from './utils/calculations';
import { WallManager } from './components/WallManager';
import { CalculationSummary } from './components/CalculationSummary';
import { WallpaperLibrary } from './components/WallpaperLibrary';
import { UnitInput } from './components/UnitInput';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Save, 
  RotateCcw, 
  Layout, 
  Info,
  Hash,
  Layers,
  Calculator,
  Library,
  Ruler,
  Sparkles,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const getInitialWallpaper = (): Wallpaper => ({
  id: crypto.randomUUID(),
  sku: '',
  width: { value: 0, unit: 'ft' },
  length: { value: 0, unit: 'ft' },
  patternRepeat: { value: 0, unit: 'ft' },
  match: 'straight',
  updatedAt: Date.now(),
});

export default function App() {
  const { wallpapers, saveWallpaper, deleteWallpaper, importWallpapers } = useWallpapers();
  const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper>(getInitialWallpaper());
  const [walls, setWalls] = useState<Wall[]>([]);
  const [activeTab, setActiveTab] = useState<'calculator' | 'library'>('calculator');
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [skuNote, setSkuNote] = useState<{ message: string; type: 'info' | 'success' } | null>(null);

  useEffect(() => {
    if (skuNote) {
      const timer = setTimeout(() => setSkuNote(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [skuNote]);

  const handleCalculate = () => {
    const result = runCalculation(currentWallpaper, walls);
    setCalculationResult(result);
    setSkuNote({ message: 'Calculation completed.', type: 'success' });
  };

  const handleSaveWallpaper = () => {
    if (!currentWallpaper.sku.trim()) {
      setSkuNote({ message: 'Please enter a SKU or Name before saving.', type: 'info' });
      return;
    }

    const wpToSave = {
      ...currentWallpaper,
      updatedAt: Date.now(),
    };
    saveWallpaper(wpToSave);
    setCurrentWallpaper(wpToSave);
    setSkuNote({ message: `Wallpaper "${wpToSave.sku}" saved to library.`, type: 'success' });
  };

  const handleReset = () => {
    setCurrentWallpaper(getInitialWallpaper());
    setWalls([]);
    setCalculationResult(null);
    setSkuNote({ message: 'Calculator reset.', type: 'info' });
  };

  const updateWallpaper = (updates: Partial<Wallpaper>) => {
    setCurrentWallpaper(prev => {
      const next = { ...prev, ...updates };
      
      // Check if SKU exists when SKU is updated
      if (updates.sku !== undefined) {
        if (updates.sku.trim() === '') {
          setSkuNote(null);
        } else {
          const existing = wallpapers.find(w => w.sku.toLowerCase() === updates.sku?.toLowerCase());
          if (existing && existing.id !== prev.id) {
            setSkuNote({ message: `Found existing wallpaper: ${existing.sku}. Data loaded.`, type: 'success' });
            return { ...existing, id: prev.id }; // Keep current session ID but load data
          }
        }
      }
      
      return next;
    });
    setCalculationResult(null);
  };

  const handleDeleteWallpaper = (id: string) => {
    const wp = wallpapers.find(w => w.id === id);
    if (wp) {
      deleteWallpaper(id);
      setSkuNote({ message: `Wallpaper "${wp.sku}" removed from library.`, type: 'info' });
    }
  };

  const handleSelectFromLibrary = (wp: Wallpaper) => {
    setCurrentWallpaper(wp);
    setActiveTab('calculator');
    setCalculationResult(null);
    setSkuNote({ message: `Loaded wallpaper: ${wp.sku}`, type: 'success' });
  };

  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] text-[var(--color-brand-primary)] font-sans selection:bg-amber-100">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-[var(--color-brand-primary)] rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200">
              <Layout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold tracking-tight text-slate-900 leading-none">WallMaster</h1>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Professional Edition</span>
            </div>
          </motion.div>
          
          <div className="flex p-1.5 bg-slate-100/50 rounded-2xl border border-slate-100">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'calculator' 
                  ? 'bg-white text-[var(--color-brand-primary)] shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Calculator className="w-4 h-4" />
              Calculator
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'library' 
                  ? 'bg-white text-[var(--color-brand-primary)] shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Library className="w-4 h-4" />
              Library
            </button>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all text-xs font-bold cursor-pointer"
            title="Reset All Inputs"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">Reset All</span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {skuNote && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-xs font-bold shadow-2xl border backdrop-blur-md ${
              skuNote.type === 'success' 
                ? 'bg-emerald-50/90 text-emerald-600 border-emerald-100' 
                : 'bg-blue-50/90 text-blue-600 border-blue-100'
            }`}>
              {skuNote.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {skuNote.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'calculator' ? (
            <motion.div 
              key="calculator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              
              {/* Left Column: Inputs */}
              <div className="lg:col-span-7 space-y-12">
                
                {/* Wallpaper Specs Card */}
                <section className="bg-white p-8 rounded-[2.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-amber-600" />
                      </div>
                      <h3 className="text-xl font-serif font-bold text-slate-900">Wallpaper Specifications</h3>
                    </div>
                    <button
                      onClick={handleSaveWallpaper}
                      className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 text-xs font-bold cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      Save to Library
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Wallpaper SKU / Name</label>
                        <input
                          type="text"
                          value={currentWallpaper.sku}
                          onChange={e => updateWallpaper({ sku: e.target.value })}
                          placeholder="e.g. Blue Floral WP-102"
                          className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 outline-none transition-all text-sm font-medium cursor-pointer"
                        />
                      </div>
                    
                    <UnitInput
                      label="Pattern Repeat"
                      value={currentWallpaper.patternRepeat}
                      onChange={val => updateWallpaper({ patternRepeat: val })}
                      icon={<Layers className="w-4 h-4" />}
                    />
                    <UnitInput
                      label="Roll Width"
                      value={currentWallpaper.width}
                      onChange={val => updateWallpaper({ width: val })}
                      icon={<Ruler className="w-4 h-4" />}
                    />
                    <UnitInput
                      label="Roll Length"
                      value={currentWallpaper.length}
                      onChange={val => updateWallpaper({ length: val })}
                      icon={<Ruler className="w-4 h-4" />}
                    />
                  </div>
                </section>

                {/* Wall Manager */}
                <WallManager
                  walls={walls}
                  onChange={(newWalls) => {
                    setWalls(newWalls);
                    setCalculationResult(null);
                  }}
                />

                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleCalculate}
                    className="flex items-center gap-4 px-16 py-5 bg-[var(--color-brand-primary)] text-white rounded-[2rem] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 font-bold text-xl group cursor-pointer"
                  >
                    <Calculator className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    Calculate Rolls
                  </button>
                </div>
              </div>

              {/* Right Column: Results Sticky */}
              <div className="lg:col-span-5">
                <div className="sticky top-32 space-y-8">
                  {calculationResult ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <CalculationSummary 
                        wallpaper={currentWallpaper} 
                        walls={walls}
                        result={calculationResult} 
                      />
                    </motion.div>
                  ) : (
                    <div className="bg-white rounded-[2.5rem] p-16 border-2 border-dashed border-slate-100 text-center space-y-6">
                      <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto">
                        <Calculator className="w-10 h-10 text-slate-200" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-serif font-bold text-slate-900">Ready to Calculate</h4>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-[240px] mx-auto">Enter your wallpaper and wall dimensions, then click "Calculate Rolls" to see the results.</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-[var(--color-brand-primary)] rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-200 relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 p-4 opacity-5">
                      <Layers className="w-48 h-48" />
                    </div>
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                      <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
                        <Info className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-serif font-bold text-lg">Strip-Based Logic</h4>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed relative z-10">
                      We calculate how many full strips fit on each wall. 
                      Each strip is adjusted for pattern repeat and includes a 
                      standard 10cm trimming allowance.
                    </p>
                  </div>
                </div>
              </div>

            </motion.div>
          ) : (
            <motion.div 
              key="library"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto"
            >
              <WallpaperLibrary
                wallpapers={wallpapers}
                onSelect={handleSelectFromLibrary}
                onDelete={handleDeleteWallpaper}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-16 mt-[250px]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
              <Layout className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif font-bold text-xl text-slate-900">WallMaster</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} WallMaster Calculator. Crafted for precision.
          </p>
        </div>
      </footer>
    </div>
  );
}
