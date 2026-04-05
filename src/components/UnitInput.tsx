import React from 'react';
import { Unit, UnitValue } from '../types';

interface Props {
  label: string;
  value: UnitValue;
  onChange: (value: UnitValue) => void;
  className?: string;
  inputClassName?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
}

export const UnitInput: React.FC<Props> = ({ 
  label, 
  value, 
  onChange, 
  className = '', 
  inputClassName = '',
  icon,
  size = 'md'
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2 px-1">
        {icon && <span className="text-slate-300">{icon}</span>}
        <label className={`font-bold text-slate-400 uppercase tracking-[0.15em] ${size === 'sm' ? 'text-[9px]' : 'text-[10px]'}`}>
          {label}
        </label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value.value || ''}
          onChange={(e) => onChange({ ...value, value: parseFloat(e.target.value) || 0 })}
          className={`flex-1 px-5 rounded-2xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 outline-none transition-all text-sm font-medium placeholder:text-slate-200 cursor-pointer ${size === 'sm' ? 'py-2.5' : 'py-3.5'} ${inputClassName}`}
          placeholder="0"
        />
        <select
          value={value.unit}
          onChange={(e) => onChange({ ...value, unit: e.target.value as Unit })}
          className={`bg-slate-100/50 px-3 rounded-xl border border-slate-100 outline-none font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer ${size === 'sm' ? 'py-2.5 text-[10px]' : 'py-3.5 text-xs'}`}
        >
          <option value="cm">cm</option>
          <option value="inch">in</option>
          <option value="ft">ft</option>
        </select>
      </div>
    </div>
  );
};
