import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { GamificationStats, Achievement } from '../../utils/gamification';
import { 
  Flame, 
  Trophy, 
  Zap, 
  ChevronRight, 
  Award, 
  X, 
  CheckCircle2, 
  Lock, 
  Footprints, 
  Shield, 
  BookOpen, 
  TrendingUp 
} from 'lucide-react';

interface GamificationBannerProps {
  stats: GamificationStats;
  userName: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Footprints: <Footprints size={18} />,
  Zap: <Zap size={18} />,
  Flame: <Flame size={18} />,
  Award: <Award size={18} />,
  Shield: <Shield size={18} />,
  BookOpen: <BookOpen size={18} />,
  TrendingUp: <TrendingUp size={18} />
};

export const GamificationBanner: React.FC<GamificationBannerProps> = ({ stats, userName }) => {
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);

  const triggerCelebration = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const unlockedCount = stats.achievements.filter(a => a.unlocked).length;

  return (
    <>
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white border border-indigo-900/40 shadow-xl relative overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-16 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Lado Esquerdo: Nível & Título */}
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Award size={13} className="text-amber-400" />
                Nível {stats.level} • {stats.levelTitle}
              </span>

              <button
                onClick={() => {
                  triggerCelebration();
                  setIsAchievementsModalOpen(true);
                }}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 flex items-center gap-1.5 transition-all"
              >
                <Trophy size={13} className="text-amber-400" />
                <span>{unlockedCount}/{stats.achievements.length} Conquistas</span>
                <ChevronRight size={12} className="text-slate-400" />
              </button>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                {userName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                Progresso contínuo de autoliderança. Cada hábito, rola de tatame e oração forja sua excelência.
              </p>
            </div>

            {/* Barra de Progresso de XP */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">
                  XP do Nível: <strong className="text-white font-mono">{stats.totalXp} XP</strong>
                </span>
                <span className="text-indigo-300 font-mono text-[11px]">
                  Próximo nível em {stats.xpNextLevel - stats.totalXp} XP
                </span>
              </div>
              <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden border border-slate-700/60">
                <div 
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 h-full rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${stats.levelProgressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Lado Direito: Cards de Streaks & Ações Rápidas */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full lg:w-auto">
            {/* Streak Global */}
            <div 
              onClick={triggerCelebration}
              className="flex-1 sm:w-44 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Streak Global</span>
                <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
                  <Flame size={16} />
                </div>
              </div>
              <div className="my-2">
                <div className="text-3xl font-black font-mono text-white flex items-baseline gap-1">
                  {stats.currentGlobalStreak}
                  <span className="text-xs font-sans font-medium text-amber-400">dias</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400">
                Recorde: <strong className="text-slate-200">{stats.bestGlobalStreak} dias</strong>
              </span>
            </div>

            {/* Atividades Feitas Hoje */}
            <div className="flex-1 sm:w-44 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Hoje</span>
                <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <Zap size={16} />
                </div>
              </div>
              <div className="my-2">
                <div className="text-3xl font-black font-mono text-white flex items-baseline gap-1">
                  {stats.todayCompletedCount}
                  <span className="text-xs font-sans font-medium text-emerald-400">concluídos</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400">
                Total acumulado: <strong className="text-slate-200">{stats.totalCompletedActivities}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Conquistas / Badges */}
      {isAchievementsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200/60">
                  <Trophy size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Quadro de Conquistas & Marcos</h3>
                  <p className="text-xs text-slate-500">
                    Desbloqueie insígnias conforme desenvolve consistência nos pilares de vida.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAchievementsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {stats.achievements.map((ach) => (
                <div 
                  key={ach.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                    ach.unlocked 
                      ? 'bg-amber-50/40 border-amber-200/80' 
                      : 'bg-slate-50 border-slate-200/80 opacity-75'
                  }`}
                >
                  <div className={`p-3 rounded-2xl shrink-0 ${
                    ach.unlocked 
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' 
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {ach.unlocked ? (ICON_MAP[ach.iconName] || <Award size={18} />) : <Lock size={18} />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        {ach.title}
                        {ach.unlocked && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Desbloqueado
                          </span>
                        )}
                      </h4>
                      <span className="text-xs font-mono font-bold text-slate-600">
                        {ach.currentValue}/{ach.targetValue}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {ach.description}
                    </p>

                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden mt-2">
                      <div 
                        className={`h-full rounded-full ${ach.unlocked ? 'bg-amber-500' : 'bg-slate-400'}`}
                        style={{ width: `${ach.progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsAchievementsModalOpen(false)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
