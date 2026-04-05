import React from 'react';
import { Wall, Opening } from '../types';
import { Plus, Trash2, Layout, DoorOpen, Ruler, Square, ChevronRight } from 'lucide-react';
import { UnitInput } from './UnitInput';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  walls: Wall[];
  onChange: (walls: Wall[]) => void;
}

export const WallManager: React.FC<Props> = ({ walls, onChange }) => {
  const addWall = () => {
    const newWall: Wall = {
      id: crypto.randomUUID(),
      name: '',
      width: { value: 0, unit: 'ft' },
      height: { value: 0, unit: 'ft' },
      openings: [],
    };
    onChange([...walls, newWall]);
  };

  const removeWall = (id: string) => {
    onChange(walls.filter(w => w.id !== id));
  };

  const updateWall = (id: string, updates: Partial<Wall>) => {
    onChange(walls.map(w => (w.id === id ? { ...w, ...updates } : w)));
  };

  const addOpening = (wallId: string) => {
    const wall = walls.find(w => w.id === wallId);
    if (!wall) return;
    const newOpening: Opening = {
      id: crypto.randomUUID(),
      width: { value: 0, unit: 'ft' },
      height: { value: 0, unit: 'ft' },
    };
    updateWall(wallId, { openings: [...wall.openings, newOpening] });
  };

  const removeOpening = (wallId: string, openingId: string) => {
    const wall = walls.find(w => w.id === wallId);
    if (!wall) return;
    updateWall(wallId, {
      openings: wall.openings.filter(o => o.id !== openingId),
    });
  };

  const updateOpening = (wallId: string, openingId: string, updates: Partial<Opening>) => {
    const wall = walls.find(w => w.id === wallId);
    if (!wall) return;
    updateWall(wallId, {
      openings: wall.openings.map(o => (o.id === openingId ? { ...o, ...updates } : o)),
    });
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 self-start sm:self-center">
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
            <Layout className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-serif font-bold text-slate-900">Wall Configurations</h3>
        </div>
        <button
          onClick={addWall}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all font-bold text-xs uppercase tracking-widest cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Wall
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <AnimatePresence initial={false}>
          {walls.map((wall, index) => (
            <motion.div 
              key={wall.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden group hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all"
            >
              <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400 shadow-sm">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={wall.name}
                    placeholder={`Wall ${index + 1}`}
                    onChange={e => updateWall(wall.id, { name: e.target.value })}
                    className="text-sm font-bold text-slate-700 uppercase tracking-[0.1em] bg-transparent border-none focus:ring-0 p-0 w-48 placeholder:text-slate-300 cursor-pointer"
                  />
                </div>
                <button
                  onClick={() => removeWall(wall.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                  title="Remove Wall"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-8 space-y-10">
                {/* Wall Dimensions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <UnitInput
                    label="Wall Width"
                    value={wall.width}
                    onChange={val => updateWall(wall.id, { width: val })}
                    icon={<Ruler className="w-4 h-4" />}
                  />
                  <UnitInput
                    label="Wall Height"
                    value={wall.height}
                    onChange={val => updateWall(wall.id, { height: val })}
                    icon={<Square className="w-4 h-4" />}
                  />
                </div>

                {/* Openings Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center">
                        <DoorOpen className="w-4 h-4 text-slate-400" />
                      </div>
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Openings (Doors/Windows)</h4>
                    </div>
                    <button
                      onClick={() => addOpening(wall.id)}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-[0.15em] flex items-center gap-2 transition-colors bg-blue-50/50 px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      Add Opening
                    </button>
                  </div>

                  {wall.openings.length === 0 ? (
                    <div className="py-10 border-2 border-dashed border-slate-50 rounded-[2rem] text-center">
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">No openings added</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <AnimatePresence initial={false}>
                        {wall.openings.map((opening, oIndex) => (
                          <motion.div 
                            key={opening.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 relative group/opening hover:bg-white hover:shadow-md transition-all"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-blue-600 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-blue-100">
                                  {oIndex + 1}
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Opening</span>
                              </div>
                              <button
                                onClick={() => removeOpening(wall.id, opening.id)}
                                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                title="Remove Opening"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                              <UnitInput
                                label="Width"
                                value={opening.width}
                                onChange={val => updateOpening(wall.id, opening.id, { width: val })}
                                size="sm"
                              />
                              <UnitInput
                                label="Height"
                                value={opening.height}
                                onChange={val => updateOpening(wall.id, opening.id, { height: val })}
                                size="sm"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {walls.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 text-center space-y-6"
        >
          <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto">
            <Layout className="w-10 h-10 text-slate-200" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-serif font-bold text-slate-900">No Walls Added</h4>
            <p className="text-sm text-slate-400">Add your first wall to start calculating.</p>
          </div>
          <button
            onClick={addWall}
            className="inline-flex items-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold text-sm shadow-xl shadow-blue-100 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Add First Wall
          </button>
        </motion.div>
      )}
    </section>
  );
};
