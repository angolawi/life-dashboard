import React, { useState } from 'react';
import { 
  Flame, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  RotateCcw, 
  ShieldAlert, 
  Sparkles, 
  Skull, 
  Pin,
  Cookie,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AccountabilityNote, MirrorNoteType } from '../../types';

interface AccountabilityMirrorProps {
  notes: AccountabilityNote[];
  onSaveNote: (note: AccountabilityNote) => void;
  onDeleteNote: (id: string) => void;
  onToggleCrushNote: (id: string) => void;
}

const GOGGINS_QUOTES = [
  "Você está em perigo de viver uma vida tão confortável que morrerá sem nunca saber o seu verdadeiro potencial.",
  "Não pare quando estiver cansado. Pare quando tiver terminado.",
  "O espelho da responsabilidade não mente. Ele te olha nos olhos e pergunta: o que você fez hoje?",
  "A mente desiste 40% antes do corpo. É aí que o treino de verdade começa.",
  "Cole seus defeitos no espelho. Encare suas fraquezas todos os dias até elas se tornarem suas maiores armas.",
  "Eles não sabem quem é você. Não sabem o que você aguentou. Continue firme!",
  "Taking souls: quando a dor bater mais forte, sorria e acelere o ritmo."
];

export const AccountabilityMirror: React.FC<AccountabilityMirrorProps> = ({
  notes,
  onSaveNote,
  onDeleteNote,
  onToggleCrushNote
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | MirrorNoteType>('ALL');

  // Form State
  const [title, setTitle] = useState('');
  const [brutalTruth, setBrutalTruth] = useState('');
  const [actionPlan, setActionPlan] = useState('');
  const [noteType, setNoteType] = useState<MirrorNoteType>('HARD_TRUTH');
  const [color, setColor] = useState<AccountabilityNote['color']>('yellow');

  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * GOGGINS_QUOTES.length));

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % GOGGINS_QUOTES.length);
  };

  const handleCrush = (id: string, currentlyCrushed: boolean) => {
    if (!currentlyCrushed) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
    onToggleCrushNote(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !brutalTruth.trim()) return;

    const newNote: AccountabilityNote = {
      id: `goggins-${Date.now()}`,
      type: noteType,
      title: title.trim(),
      brutalTruth: brutalTruth.trim(),
      actionPlan: actionPlan.trim(),
      status: 'PENDING',
      color,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onSaveNote(newNote);
    setTitle('');
    setBrutalTruth('');
    setActionPlan('');
    setIsAddModalOpen(false);
  };

  const filteredNotes = notes.filter((n) => filterType === 'ALL' || n.type === filterType);
  const crushedCount = notes.filter((n) => n.status === 'CRUSHED').length;
  const pendingCount = notes.filter((n) => n.status === 'PENDING').length;

  const colorStyles: Record<AccountabilityNote['color'], { bg: string; border: string; text: string; pin: string }> = {
    yellow: {
      bg: 'bg-amber-100',
      border: 'border-amber-300',
      text: 'text-amber-950',
      pin: 'bg-amber-500'
    },
    rose: {
      bg: 'bg-rose-100',
      border: 'border-rose-300',
      text: 'text-rose-950',
      pin: 'bg-rose-500'
    },
    amber: {
      bg: 'bg-orange-100',
      border: 'border-orange-300',
      text: 'text-orange-950',
      pin: 'bg-orange-500'
    },
    blue: {
      bg: 'bg-sky-100',
      border: 'border-sky-300',
      text: 'text-sky-950',
      pin: 'bg-sky-500'
    },
    emerald: {
      bg: 'bg-emerald-100',
      border: 'border-emerald-300',
      text: 'text-emerald-950',
      pin: 'bg-emerald-500'
    }
  };

  return (
    <div className="space-y-4">
      {/* Moldura do Espelho (Mirror Simulation) */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-zinc-900 to-black p-6 sm:p-7 border-4 border-zinc-700/80 shadow-2xl overflow-hidden">
        {/* Efeito reflexivo do espelho */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-zinc-700/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header do Espelho */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
                <Skull size={18} />
              </span>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                Accountability Mirror
                <span className="text-[10px] bg-red-950 text-red-400 font-bold px-2 py-0.5 rounded border border-red-800/80">
                  David Goggins
                </span>
              </h3>
            </div>
            <p className="text-xs text-zinc-400 max-w-xl">
              Cole a verdade nua e crua na sua cara. Sem filtros, sem desculpas, com missões de contra-ataque.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              <Plus size={14} />
              Colar Post-It no Espelho
            </button>
          </div>
        </div>

        {/* Quote Goggins Interativo */}
        <div 
          onClick={nextQuote}
          title="Clique para alternar frase"
          className="relative z-10 mt-4 p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/90 text-zinc-300 text-xs flex items-center justify-between gap-3 cursor-pointer hover:border-zinc-700 transition-colors"
        >
          <div className="flex items-center gap-2 italic">
            <Flame size={14} className="text-red-500 flex-shrink-0 animate-pulse" />
            <span>"{GOGGINS_QUOTES[quoteIndex]}"</span>
          </div>
          <span className="text-[10px] text-zinc-500 uppercase font-mono flex-shrink-0">
            [Trocar Frase]
          </span>
        </div>

        {/* Filtros e Métricas */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mt-5">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                filterType === 'ALL'
                  ? 'bg-zinc-200 text-black shadow-xs'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
              }`}
            >
              Todos ({notes.length})
            </button>
            <button
              onClick={() => setFilterType('HARD_TRUTH')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                filterType === 'HARD_TRUTH'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
              }`}
            >
              <ShieldAlert size={12} />
              Verdades Duras
            </button>
            <button
              onClick={() => setFilterType('COOKIE_JAR')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                filterType === 'COOKIE_JAR'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
              }`}
            >
              <Cookie size={12} />
              Pote de Cookies
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
              Pendentes: <strong className="text-amber-400">{pendingCount}</strong>
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
              Superados: <strong className="text-emerald-400">{crushedCount}</strong>
            </span>
          </div>
        </div>

        {/* Quadro de Post-Its (Sticky Notes Board) */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredNotes.length === 0 ? (
            <div className="col-span-full py-12 text-center text-zinc-500 space-y-2">
              <Skull className="w-8 h-8 mx-auto opacity-30" />
              <p className="text-xs">O espelho está limpo. Cole seus post-its de confronto aqui.</p>
            </div>
          ) : (
            filteredNotes.map((note, index) => {
              const isCrushed = note.status === 'CRUSHED';
              const style = colorStyles[note.color] || colorStyles.yellow;
              // Efeito de inclinação leve para simular post-it real
              const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-0'];
              const rotationClass = rotations[index % rotations.length];

              return (
                <div
                  key={note.id}
                  className={`relative p-5 rounded-xl border-2 transition-all duration-200 transform ${rotationClass} hover:rotate-0 hover:scale-[1.02] shadow-lg ${
                    style.bg
                  } ${style.border} ${style.text} flex flex-col justify-between`}
                >
                  {/* Pin vermelho no topo */}
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 shadow-md border-2 border-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                  </div>

                  <div className="space-y-3 pt-1">
                    {/* Header do Post-it */}
                    <div className="flex items-start justify-between gap-2 border-b border-black/10 pb-2">
                      <div className="flex items-center gap-1.5">
                        {note.type === 'COOKIE_JAR' ? (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-black/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Cookie size={11} /> Cookie Jar
                          </span>
                        ) : (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-black/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Target size={11} /> Verdade Nua
                          </span>
                        )}
                        <h4 className="text-xs font-black uppercase">{note.title}</h4>
                      </div>

                      <button
                        onClick={() => onDeleteNote(note.id)}
                        title="Arrancar Post-It"
                        className="text-black/40 hover:text-red-700 transition-colors p-0.5"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* A Verdade Nua e Crua */}
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-black/60 block">
                        A Verdade Sem Filtro:
                      </span>
                      <p className={`text-xs font-bold mt-0.5 leading-snug ${isCrushed ? 'line-through opacity-60' : ''}`}>
                        "{note.brutalTruth}"
                      </p>
                    </div>

                    {/* Missão de Contra-ataque */}
                    {note.actionPlan && (
                      <div className="bg-black/5 p-2.5 rounded-lg border border-black/10">
                        <span className="text-[9px] font-black uppercase tracking-wider text-black/70 flex items-center gap-1">
                          <Flame size={11} className="text-red-600" /> Missão de Ataque:
                        </span>
                        <p className="text-xs font-semibold mt-0.5 leading-tight">
                          {note.actionPlan}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Rodapé: Ação de Superação (Crush It) */}
                  <div className="pt-3 mt-3 border-t border-black/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-black/50">
                      {new Date(note.createdAt + 'T12:00:00').toLocaleDateString('pt-BR')}
                    </span>

                    <button
                      onClick={() => handleCrush(note.id, isCrushed)}
                      className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg transition-all flex items-center gap-1 shadow-xs ${
                        isCrushed
                          ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                          : 'bg-black text-white hover:bg-zinc-800 active:scale-95'
                      }`}
                    >
                      {isCrushed ? (
                        <>
                          <CheckCircle2 size={13} /> Superado!
                        </>
                      ) : (
                        <>
                          <Skull size={13} /> Conquistar (Crush)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal para Colar Novo Post-It */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Skull size={18} className="text-red-500" />
                <h3 className="text-sm font-black uppercase tracking-wider">
                  Novo Post-It de Responsabilidade
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Tipo de Post-It
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNoteType('HARD_TRUTH');
                      setColor('yellow');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      noteType === 'HARD_TRUTH'
                        ? 'bg-red-600/30 border-red-500 text-red-200'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    Verdade Nua & Crua
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNoteType('COOKIE_JAR');
                      setColor('emerald');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      noteType === 'COOKIE_JAR'
                        ? 'bg-amber-600/30 border-amber-500 text-amber-200'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    Pote de Cookies (Vitória)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Título da Fraqueza ou Desculpa
                </label>
                <input
                  type="text"
                  placeholder="Ex: Procrastinação do Sono, Fuga de Rolas Duros..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  A Verdade Sem Filtro (O que você fala para si mesmo no espelho)
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Você está inventando desculpa de dor leve para não ir no treino das 12h..."
                  value={brutalTruth}
                  onChange={(e) => setBrutalTruth(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white focus:outline-none focus:border-red-500 leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Missão de Ataque (Ação imediata)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Colocar o kimono agora e ser o primeiro a pisar no tatame."
                  value={actionPlan}
                  onChange={(e) => setActionPlan(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Cor do Post-It
                </label>
                <div className="flex gap-2">
                  {(['yellow', 'rose', 'amber', 'blue', 'emerald'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-lg border-2 transition-all ${
                        color === c ? 'scale-110 border-white' : 'border-transparent opacity-70'
                      } ${
                        c === 'yellow' ? 'bg-amber-300' :
                        c === 'rose' ? 'bg-rose-300' :
                        c === 'amber' ? 'bg-orange-300' :
                        c === 'blue' ? 'bg-sky-300' : 'bg-emerald-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md active:scale-95"
                >
                  Pregar no Espelho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
