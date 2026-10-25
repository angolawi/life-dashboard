import React from 'react';
import { Droplets, Plus, Minus, CheckCircle, RotateCcw, Sparkles } from 'lucide-react';
import { DailyNutrition } from '../../types';

interface WaterIntakeCardProps {
  selectedDate: string;
  nutritionLog?: DailyNutrition;
  onSaveNutrition: (log: DailyNutrition) => void;
  targetLiters?: number;
  compact?: boolean;
}

export const WaterIntakeCard: React.FC<WaterIntakeCardProps> = ({
  selectedDate,
  nutritionLog,
  onSaveNutrition,
  targetLiters = 3.5,
  compact = false
}) => {
  const currentLiters = nutritionLog?.hydrationLiters ?? 0;
  const progressPct = Math.min(100, Math.round((currentLiters / targetLiters) * 100));
  const isGoalReached = currentLiters >= targetLiters;

  const handleAdjust = (delta: number) => {
    const nextVal = Math.max(0, Math.round((currentLiters + delta) * 10) / 10);
    saveHydration(nextVal);
  };

  const handleReset = () => {
    saveHydration(0);
  };

  const saveHydration = (val: number) => {
    const updated: DailyNutrition = {
      id: nutritionLog?.id || `nutr-${Date.now()}`,
      date: selectedDate,
      protocolType: nutritionLog?.protocolType || 'DIAS_COM_BJJ',
      targetKcal: nutritionLog?.targetKcal || 1702,
      targetCarbsG: nutritionLog?.targetCarbsG || 197.4,
      targetProteinG: nutritionLog?.targetProteinG || 102.7,
      targetFatG: nutritionLog?.targetFatG || 63.5,
      breakfastDone: nutritionLog?.breakfastDone || false,
      snackAmDone: nutritionLog?.snackAmDone || false,
      lunchDone: nutritionLog?.lunchDone || false,
      snackPmDone: nutritionLog?.snackPmDone || false,
      dinnerDone: nutritionLog?.dinnerDone || false,
      hydrationLiters: val,
      notes: nutritionLog?.notes || ''
    };
    onSaveNutrition(updated);
  };

  // 7 copos/garrafas virtuais de 500ml para bater a meta de 3.5L
  const totalSlots = Math.ceil(targetLiters / 0.5);
  const filledSlots = Math.min(totalSlots, Math.floor(currentLiters / 0.5));

  return (
    <div className={`bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 border ${
      isGoalReached ? 'border-emerald-500/50 shadow-emerald-950/20 shadow-lg' : 'border-slate-800'
    } rounded-2xl p-4 sm:p-5 text-white transition-all`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            isGoalReached
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
          }`}>
            <Droplets className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">Controle de Água & Hidratação</h3>
              {isGoalReached && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  <Sparkles size={11} /> Meta Batida
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Meta do Tatame: <span className="font-semibold text-slate-200">{targetLiters}L</span> (lubrificação articular & rendimento)
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-baseline justify-end gap-1">
            <span className={`text-xl sm:text-2xl font-black font-mono transition-colors ${
              isGoalReached ? 'text-emerald-400' : 'text-blue-400'
            }`}>
              {currentLiters.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-semibold">/ {targetLiters}L</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            {progressPct}% concluído
          </span>
        </div>
      </div>

      {/* Progress Bar & Visual Drops */}
      <div className="mt-4 space-y-2">
        <div className="w-full bg-slate-800/90 rounded-full h-2.5 overflow-hidden border border-slate-700/50">
          <div
            className={`h-full transition-all duration-500 ease-out ${
              isGoalReached
                ? 'bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-400 shadow-sm shadow-emerald-500/50'
                : 'bg-gradient-to-r from-blue-600 to-cyan-400'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Visual Slots (Copos / Garrafas de 500ml) */}
        {!compact && (
          <div className="flex items-center justify-between gap-1 pt-1">
            {Array.from({ length: totalSlots }).map((_, idx) => {
              const isFilled = idx < filledSlots;
              const isPartial = !isFilled && idx === filledSlots && (currentLiters % 0.5) > 0;
              return (
                <button
                  key={idx}
                  onClick={() => saveHydration(Math.round((idx + 1) * 0.5 * 10) / 10)}
                  title={`Definir para ${((idx + 1) * 0.5).toFixed(1)}L`}
                  className={`flex-1 py-1.5 px-1 rounded-lg text-[10px] font-mono font-bold transition-all border ${
                    isFilled
                      ? 'bg-blue-600 text-white border-blue-400 shadow-xs'
                      : isPartial
                      ? 'bg-blue-950/70 text-blue-300 border-blue-500/50'
                      : 'bg-slate-800/50 text-slate-500 border-slate-700/60 hover:bg-slate-800 hover:text-slate-300'
                  }`}
                >
                  {((idx + 1) * 0.5).toFixed(1)}L
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/60">
        <button
          onClick={() => handleAdjust(-0.25)}
          disabled={currentLiters <= 0}
          title="Diminuir 250ml"
          className="p-2 sm:px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700 text-slate-300 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="flex-1 grid grid-cols-3 gap-1.5">
          <button
            onClick={() => handleAdjust(0.25)}
            className="py-2 text-xs font-bold rounded-xl bg-blue-950/70 hover:bg-blue-900/80 border border-blue-800/80 text-blue-200 transition-all active:scale-95 flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>250ml</span>
            <span className="text-[10px] opacity-70 hidden sm:inline">(copo)</span>
          </button>

          <button
            onClick={() => handleAdjust(0.5)}
            className="py-2 text-xs font-bold rounded-xl bg-blue-900/60 hover:bg-blue-800/80 border border-blue-700/80 text-blue-100 transition-all active:scale-95 flex items-center justify-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>500ml</span>
            <span className="text-[10px] opacity-70 hidden sm:inline">(garrafa)</span>
          </button>

          <button
            onClick={() => handleAdjust(1.0)}
            className="py-2 text-xs font-bold rounded-xl bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-800/80 text-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>1.0 L</span>
          </button>
        </div>

        {currentLiters > 0 && (
          <button
            onClick={handleReset}
            title="Zerar hidratação do dia"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-800/60 border border-slate-700 text-slate-400 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
