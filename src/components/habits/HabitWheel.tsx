import React, { useState } from 'react';
import { HabitItem } from '../../types';
import { calculateHabitStreaks } from '../../utils/habitStreaks';
import { 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Edit3, 
  Sparkles, 
  Save, 
  Plus, 
  Trash2, 
  Palette 
} from 'lucide-react';

interface HabitWheelProps {
  habits: HabitItem[];
  currentMonth: string; // YYYY-MM
  onMonthChange: (month: string) => void;
  cells: boolean[][]; // [habitIdx][dayIdx]
  onToggleCell: (habitIdx: number, dayIdx: number) => void;
  onUpdateHabit: (index: number, updated: HabitItem) => void;
  onUpdateAllHabits: (habits: HabitItem[]) => void;
}

export const HabitWheel: React.FC<HabitWheelProps> = ({
  habits,
  currentMonth,
  onMonthChange,
  cells,
  onToggleCell,
  onUpdateHabit,
  onUpdateAllHabits
}) => {
  const [hoveredHabitIdx, setHoveredHabitIdx] = useState<number | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [editingHabitsList, setEditingHabitsList] = useState<HabitItem[]>(habits);

  const HABITS_COUNT = habits.length;
  const CENTER_X = 640;
  const CENTER_Y = 410;
  const INNER_RADIUS = 120;
  const RING_WIDTH = 30;
  const TOTAL_ANGLE_DEG = 270;
  const LINE_LEFT_EDGE = 40;

  // Dias no mês
  const [yearStr, monthStr] = currentMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const daysInMonth = new Date(year, month, 0).getDate();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const currentMonthName = monthNames[month - 1];

  const handlePrevMonth = () => {
    let newYear = year;
    let newMonth = month - 1;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    onMonthChange(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    let newYear = year;
    let newMonth = month + 1;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    onMonthChange(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  // Helper para os arcos das células
  const createCellPath = (rInner: number, rOuter: number, startAngle: number, endAngle: number) => {
    const deg2rad = Math.PI / 180;
    const a1 = (startAngle - 90) * deg2rad;
    const a2 = (endAngle - 90) * deg2rad;

    const p1 = { x: CENTER_X + rInner * Math.cos(a1), y: CENTER_Y + rInner * Math.sin(a1) };
    const p2 = { x: CENTER_X + rOuter * Math.cos(a1), y: CENTER_Y + rOuter * Math.sin(a1) };
    const p3 = { x: CENTER_X + rOuter * Math.cos(a2), y: CENTER_Y + rOuter * Math.sin(a2) };
    const p4 = { x: CENTER_X + rInner * Math.cos(a2), y: CENTER_Y + rInner * Math.sin(a2) };

    const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;

    return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${rInner} ${rInner} 0 ${largeArc} 0 ${p1.x} ${p1.y} Z`;
  };

  const angleStep = TOTAL_ANGLE_DEG / daysInMonth;

  // Cálculos de Streaks e Conclusão
  let totalPossible = HABITS_COUNT * daysInMonth;
  let totalDone = 0;
  let bestStreakOverall = 0;
  let bestHabitName = '';

  const habitStats = habits.map((h, idx) => {
    const row = cells[idx] || [];
    let done = 0;
    for (let d = 0; d < daysInMonth; d++) {
      if (row[d]) done++;
    }
    totalDone += done;

    const { currentStreak, bestStreak } = calculateHabitStreaks(row, daysInMonth);
    if (bestStreak > bestStreakOverall) {
      bestStreakOverall = bestStreak;
      bestHabitName = h.name;
    }

    return {
      habit: h,
      done,
      target: h.targetDaysPerMonth || daysInMonth,
      currentStreak,
      bestStreak
    };
  });

  const overallPercentage = Math.round((totalDone / (totalPossible || 1)) * 100);

  const handleOpenManageModal = () => {
    setEditingHabitsList([...habits]);
    setIsManageModalOpen(true);
  };

  const handleSaveManagedHabits = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAllHabits(editingHabitsList);
    setIsManageModalOpen(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-clean space-y-6">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Roda de Hábitos Executiva</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {overallPercentage}% Concluído
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Defina o nome de cada hábito livremente. Cada linha horizontal conecta o nome diretamente à sua raia circular.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenManageModal}
            className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100/80 border border-purple-200 text-purple-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Edit3 size={14} />
            Nomear Hábitos & Metas
          </button>

          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-white rounded-lg text-slate-600 transition-colors shadow-none hover:shadow-xs"
              title="Mês anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-slate-800 px-3">
              {currentMonthName} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-white rounded-lg text-slate-600 transition-colors shadow-none hover:shadow-xs"
              title="Próximo mês"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Interativo com inputs/rótulos nas linhas */}
        <div className="lg:col-span-8 flex justify-center items-center overflow-x-auto no-scrollbar">
          <div className="relative w-full max-w-[780px] aspect-[1050/820] flex items-center justify-center">
            <svg
              viewBox="0 0 1050 820"
              className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.03)] select-none"
            >
              {/* Centro da Roda */}
              <circle
                cx={CENTER_X}
                cy={CENTER_Y}
                r={INNER_RADIUS - 10}
                fill="#ffffff"
                stroke="#e2e8f0"
                strokeWidth="2"
              />
              <text
                x={CENTER_X}
                y={CENTER_Y - 14}
                textAnchor="middle"
                className="fill-slate-900 font-extrabold"
                style={{ fontSize: '34px', fontFamily: 'Inter' }}
              >
                {overallPercentage}%
              </text>
              <text
                x={CENTER_X}
                y={CENTER_Y + 14}
                textAnchor="middle"
                className="fill-slate-500 font-semibold"
                style={{ fontSize: '13px', fontFamily: 'Inter' }}
              >
                {totalDone} / {totalPossible} ações
              </text>
              <text
                x={CENTER_X}
                y={CENTER_Y + 34}
                textAnchor="middle"
                className="fill-purple-600 font-bold"
                style={{ fontSize: '12px', fontFamily: 'Inter' }}
              >
                {currentMonthName}
              </text>

              {/* 1. LINHAS HORIZONTAIS COM NOMES EDITÁVEIS VIA FOREIGNOBJECT */}
              {habits.map((habit, hIdx) => {
                const rInner = INNER_RADIUS + hIdx * RING_WIDTH;
                const rOuter = rInner + RING_WIDTH;
                const yTop = CENTER_Y - rOuter;
                const isHovered = hoveredHabitIdx === hIdx;
                const stats = habitStats[hIdx];

                return (
                  <g
                    key={`label-group-${habit.id}`}
                    onMouseEnter={() => setHoveredHabitIdx(hIdx)}
                    onMouseLeave={() => setHoveredHabitIdx(null)}
                  >
                    {/* Linha guia superior */}
                    <line
                      x1={LINE_LEFT_EDGE}
                      y1={yTop}
                      x2={CENTER_X}
                      y2={yTop}
                      stroke={isHovered ? habit.color : '#e2e8f0'}
                      strokeWidth={isHovered ? 1.5 : 1}
                      strokeDasharray={isHovered ? 'none' : '2,2'}
                    />

                    {/* Elemento Interativo com Input de Nome incorporado na linha */}
                    <foreignObject
                      x={LINE_LEFT_EDGE}
                      y={yTop + 1}
                      width={CENTER_X - LINE_LEFT_EDGE - 10}
                      height={RING_WIDTH - 2}
                    >
                      <div className="w-full h-full flex items-center justify-between px-2 gap-2 rounded-lg transition-colors hover:bg-slate-100/50">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: habit.color }}
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            #{hIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={habit.name}
                            onChange={(e) => {
                              onUpdateHabit(hIdx, {
                                ...habit,
                                name: e.target.value
                              });
                            }}
                            placeholder={`Hábito #${hIdx + 1}`}
                            className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-400 rounded px-1.5 py-0.5 flex-1 min-w-0 truncate"
                            title="Clique para renomear este hábito"
                          />
                        </div>

                        {stats.currentStreak > 0 && (
                          <span className="flex-shrink-0 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Flame size={10} className="text-amber-600 fill-amber-500" />
                            {stats.currentStreak}d
                          </span>
                        )}
                      </div>
                    </foreignObject>
                  </g>
                );
              })}

              {/* Linha base inferior da última raia */}
              <line
                x1={LINE_LEFT_EDGE}
                y1={CENTER_Y - INNER_RADIUS}
                x2={CENTER_X}
                y2={CENTER_Y - INNER_RADIUS}
                stroke="#e2e8f0"
                strokeWidth="1"
              />

              {/* 2. CÉLULAS CONCÊNTRICAS DOS DIAS */}
              {habits.map((habit, hIdx) => {
                const rInner = INNER_RADIUS + hIdx * RING_WIDTH;
                const rOuter = rInner + RING_WIDTH - 3;
                const isRowHovered = hoveredHabitIdx === hIdx;

                return (
                  <g key={`cells-${habit.id}`}>
                    {Array.from({ length: daysInMonth }).map((_, dIdx) => {
                      const startAngle = dIdx * angleStep;
                      const endAngle = (dIdx + 1) * angleStep - 1.2;
                      const isDone = !!cells[hIdx]?.[dIdx];

                      const pathD = createCellPath(rInner, rOuter, startAngle, endAngle);

                      return (
                        <path
                          key={dIdx}
                          d={pathD}
                          onClick={() => onToggleCell(hIdx, dIdx)}
                          onMouseEnter={() => setHoveredHabitIdx(hIdx)}
                          onMouseLeave={() => setHoveredHabitIdx(null)}
                          className="cursor-pointer transition-all duration-150 hover:opacity-80"
                          fill={isDone ? habit.color : '#f1f5f9'}
                          stroke={isDone ? '#ffffff' : isRowHovered ? habit.color : '#e2e8f0'}
                          strokeWidth={isRowHovered ? 1.5 : 1}
                        >
                          <title>{`Raia #${hIdx + 1} (${habit.name || 'Hábito'}) - Dia ${dIdx + 1}: ${isDone ? 'Concluído' : 'Pendente'}`}</title>
                        </path>
                      );
                    })}
                  </g>
                );
              })}

              {/* 3. MARCADORES DE DIAS AO REDOR DA RODA */}
              {Array.from({ length: daysInMonth }).map((_, dIdx) => {
                if ((dIdx + 1) % 5 === 0 || dIdx === 0 || dIdx === daysInMonth - 1) {
                  const midAngle = (dIdx + 0.5) * angleStep;
                  const deg2rad = Math.PI / 180;
                  const rad = (midAngle - 90) * deg2rad;
                  const labelRadius = INNER_RADIUS + HABITS_COUNT * RING_WIDTH + 18;
                  const lx = CENTER_X + labelRadius * Math.cos(rad);
                  const ly = CENTER_Y + labelRadius * Math.sin(rad);

                  return (
                    <text
                      key={dIdx}
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-slate-500 font-bold font-mono"
                      style={{ fontSize: '11px' }}
                    >
                      {dIdx + 1}
                    </text>
                  );
                }
                return null;
              })}
            </svg>
          </div>
        </div>

        {/* Lista Lateral com Edição Direta & Streaks */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            <span>Hábitos & Streaks</span>
            <button
              onClick={handleOpenManageModal}
              className="text-purple-600 hover:text-purple-800 lowercase font-medium flex items-center gap-1"
            >
              <Edit3 size={11} /> editar todos
            </button>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {habitStats.map((item, hIdx) => {
              const { habit, done, target, currentStreak, bestStreak } = item;
              const habitPct = Math.round((done / target) * 100);
              const isHovered = hoveredHabitIdx === hIdx;

              return (
                <div
                  key={habit.id}
                  onMouseEnter={() => setHoveredHabitIdx(hIdx)}
                  onMouseLeave={() => setHoveredHabitIdx(null)}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isHovered
                      ? 'border-purple-300 bg-purple-50/40 shadow-xs'
                      : 'border-slate-200/90 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <span
                        className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: habit.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            #{hIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={habit.name}
                            onChange={(e) => {
                              onUpdateHabit(hIdx, {
                                ...habit,
                                name: e.target.value
                              });
                            }}
                            className="bg-transparent border-none text-xs font-bold text-slate-900 focus:outline-none focus:bg-slate-50 rounded px-1 flex-1 min-w-0"
                            placeholder={`Hábito #${hIdx + 1}`}
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Meta: {target}d • Concluído: {done}d
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      {currentStreak > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Flame size={11} className="text-amber-600 fill-amber-500" />
                          {currentStreak}d
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">0d</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>Melhor streak: <strong>{bestStreak} dias</strong></span>
                    <span className="font-bold text-slate-700">{habitPct}%</span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, habitPct)}%`,
                        backgroundColor: habit.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Dedicado para Gerenciar / Nomear Todos os Hábitos e Metas */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
                  <Edit3 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Personalizar Hábitos & Metas</h3>
                  <p className="text-xs text-slate-500">Dê o nome que desejar para as raias da sua roda.</p>
                </div>
              </div>
              <button
                onClick={() => setIsManageModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveManagedHabits} className="space-y-3.5">
              <div className="space-y-3">
                {editingHabitsList.map((habit, idx) => (
                  <div
                    key={habit.id}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3"
                  >
                    <span className="text-xs font-bold font-mono text-slate-400 w-5">
                      #{idx + 1}
                    </span>

                    <input
                      type="color"
                      value={habit.color}
                      onChange={(e) => {
                        const copy = [...editingHabitsList];
                        copy[idx] = { ...copy[idx], color: e.target.value };
                        setEditingHabitsList(copy);
                      }}
                      className="w-7 h-7 rounded-lg cursor-pointer border border-slate-200 p-0.5 bg-white"
                      title="Alterar cor da raia"
                    />

                    <div className="flex-1">
                      <input
                        type="text"
                        value={habit.name}
                        onChange={(e) => {
                          const copy = [...editingHabitsList];
                          copy[idx] = { ...copy[idx], name: e.target.value };
                          setEditingHabitsList(copy);
                        }}
                        placeholder={`Nome do Hábito #${idx + 1}`}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-purple-500 bg-white"
                        required
                      />
                    </div>

                    <div className="w-24">
                      <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Meta (dias)</label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={habit.targetDaysPerMonth}
                        onChange={(e) => {
                          const copy = [...editingHabitsList];
                          copy[idx] = { ...copy[idx], targetDaysPerMonth: parseInt(e.target.value, 10) || 30 };
                          setEditingHabitsList(copy);
                        }}
                        className="w-full px-2 py-1 border border-slate-200 rounded-xl text-xs font-mono font-bold text-center bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsManageModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <Save size={14} />
                  Salvar Hábitos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
