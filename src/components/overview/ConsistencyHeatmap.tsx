import React, { useState } from 'react';
import { DayActivityData } from '../../utils/gamification';
import { Calendar, Info, Activity, Flame } from 'lucide-react';

interface ConsistencyHeatmapProps {
  data: DayActivityData[];
  selectedDate: string;
}

const INTENSITY_COLORS = [
  'bg-slate-100 border-slate-200/80 hover:border-slate-300', // 0
  'bg-emerald-200 border-emerald-300 hover:border-emerald-400', // 1
  'bg-emerald-400 border-emerald-500 hover:border-emerald-600', // 2
  'bg-emerald-600 border-emerald-700 hover:border-emerald-800 text-white', // 3
  'bg-emerald-800 border-emerald-900 hover:border-black text-white' // 4
];

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const ConsistencyHeatmap: React.FC<ConsistencyHeatmapProps> = ({ data, selectedDate }) => {
  const [hoveredDay, setHoveredDay] = useState<DayActivityData | null>(null);

  // Organizar dias em colunas de semanas (cada coluna tem até 7 dias)
  const weeks: DayActivityData[][] = [];
  let currentWeek: DayActivityData[] = [];

  data.forEach((day, idx) => {
    currentWeek.push(day);
    if (day.dayOfWeek === 6 || idx === data.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Estatísticas rápidas do período
  const activeDaysCount = data.filter(d => d.totalScore > 0).length;
  const consistencyRate = Math.round((activeDaysCount / (data.length || 1)) * 100);
  const totalActions = data.reduce((acc, d) => acc + d.habitsDone + (d.bjjDone ? 1 : 0) + (d.conditioningDone ? 1 : 0) + (d.bibleDone ? 1 : 0) + (d.contributionDone ? 1 : 0), 0);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-clean space-y-5">
      {/* Cabeçalho do Heatmap */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200/60">
              <Activity size={18} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Heatmap de Consistência
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Matriz de ações diárias (hábitos, tatame BJJ, condicionamento e fé) nos últimos {data.length} dias.
          </p>
        </div>

        {/* Mini stats */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500">Consistência</span>
            <div className="text-sm font-black font-mono text-emerald-700">{consistencyRate}%</div>
          </div>
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500">Ações Totais</span>
            <div className="text-sm font-black font-mono text-slate-900">{totalActions}</div>
          </div>
        </div>
      </div>

      {/* Grid Heatmap Estilo GitHub */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-2 min-w-full justify-between items-center">
          <div className="flex gap-1.5">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {/* Se a primeira semana começar no meio da semana, adiciona placeholders */}
                {wIdx === 0 && Array.from({ length: week[0].dayOfWeek }).map((_, emptyIdx) => (
                  <div key={`empty-${emptyIdx}`} className="w-4 h-4 rounded-md bg-transparent" />
                ))}

                {week.map((day) => {
                  const isToday = day.date === selectedDate;
                  return (
                    <div
                      key={day.date}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-4 h-4 rounded-md border transition-all cursor-pointer relative group ${
                        INTENSITY_COLORS[day.intensityLevel]
                      } ${isToday ? 'ring-2 ring-purple-600 ring-offset-1' : ''}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detalhe do Hover ou Resumo do Dia Selecionado */}
      <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-slate-500" />
          <span className="font-bold text-slate-800">
            {hoveredDay ? hoveredDay.date : `Data em foco: ${selectedDate}`}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-600 font-medium">
            {hoveredDay ? (
              hoveredDay.totalScore === 0 
                ? 'Nenhuma atividade registrada neste dia.' 
                : `${hoveredDay.habitsDone} hábitos, ${hoveredDay.bjjDone ? 'Tatame BJJ ✓, ' : ''}${hoveredDay.conditioningDone ? 'Condicionamento ✓, ' : ''}${hoveredDay.bibleDone ? 'Leitura Bíblica ✓' : ''}`
            ) : (
              'Passe o mouse pelos quadradinhos para inspecionar os detalhes de cada data.'
            )}
          </span>
        </div>

        {/* Legenda de Intensidade */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 self-end sm:self-auto">
          <span>Menos</span>
          <div className="flex gap-1">
            {INTENSITY_COLORS.map((cls, idx) => (
              <div key={idx} className={`w-3 h-3 rounded-sm border ${cls}`} />
            ))}
          </div>
          <span>Mais</span>
        </div>
      </div>
    </div>
  );
};
