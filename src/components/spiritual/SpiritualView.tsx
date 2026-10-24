import React, { useState } from 'react';
import { 
  BibleReadingEntry, 
  PrayerItem, 
  DevotionalThought 
} from '../../types';
import { 
  BookOpen, 
  HeartHandshake, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Sparkles, 
  Clock, 
  Bookmark, 
  Flame, 
  Feather 
} from 'lucide-react';

interface SpiritualViewProps {
  bibleLogs: BibleReadingEntry[];
  prayers: PrayerItem[];
  devotionals: DevotionalThought[];
  selectedDate: string;
  onSaveReading: (entry: BibleReadingEntry) => void;
  onSavePrayer: (prayer: PrayerItem) => void;
  onToggleAnsweredPrayer: (id: string, testimony?: string) => void;
  onDeletePrayer: (id: string) => void;
  onSaveDevotional: (thought: DevotionalThought) => void;
}

export const SpiritualView: React.FC<SpiritualViewProps> = ({
  bibleLogs,
  prayers,
  devotionals,
  selectedDate,
  onSaveReading,
  onSavePrayer,
  onToggleAnsweredPrayer,
  onDeletePrayer,
  onSaveDevotional
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bible' | 'prayers' | 'devotional'>('bible');

  // Estado Leitura Bíblica Hoje
  const todayReading = bibleLogs.find((l) => l.date === selectedDate);
  const [readingBook, setReadingBook] = useState(todayReading?.book || 'Romanos');
  const [readingChapters, setReadingChapters] = useState(todayReading?.chapters || '8-9');
  const [readingDone, setReadingDone] = useState(todayReading?.completed || false);
  const [readingNotes, setReadingNotes] = useState(todayReading?.notes || '');

  // Estado Novo Pedido de Oração
  const [prayerTitle, setPrayerTitle] = useState('');
  const [prayerCategory, setPrayerCategory] = useState<PrayerItem['category']>('Santificação');

  // Estado Nova Meditação Devocional
  const todayDevotional = devotionals.find((d) => d.date === selectedDate);
  const [devVerse, setDevVerse] = useState(todayDevotional?.verse || 'Romanos 8:28');
  const [devReflection, setDevReflection] = useState(
    todayDevotional?.reflection || 
    'Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.'
  );
  const [devConfession, setDevConfession] = useState(todayDevotional?.confessionReference || 'Breve Catecismo P. 11 (A Providência de Deus)');

  // Salvar Leitura do Dia
  const handleSaveDayReading = () => {
    const entry: BibleReadingEntry = {
      id: todayReading?.id || `bible-${selectedDate}`,
      date: selectedDate,
      book: readingBook,
      chapters: readingChapters,
      completed: true,
      notes: readingNotes
    };
    onSaveReading(entry);
    setReadingDone(true);
  };

  // Salvar Oração
  const handleAddPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerTitle) return;
    const item: PrayerItem = {
      id: `prayer-${Date.now()}`,
      title: prayerTitle,
      category: prayerCategory,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0]
    };
    onSavePrayer(item);
    setPrayerTitle('');
  };

  // Salvar Devocional
  const handleSaveTodayDevotional = () => {
    const item: DevotionalThought = {
      id: todayDevotional?.id || `dev-${selectedDate}`,
      date: selectedDate,
      verse: devVerse,
      reflection: devReflection,
      confessionReference: devConfession
    };
    onSaveDevotional(item);
  };

  // Estatísticas de Oração
  const activePrayers = prayers.filter((p) => p.status === 'ACTIVE');
  const answeredPrayers = prayers.filter((p) => p.status === 'ANSWERED');

  return (
    <div className="space-y-6">
      {/* Banner Teológico Reformado */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
            Soli Deo Gloria • Perspectiva Espiritual Reformada
          </span>
          <h2 className="text-xl font-bold mt-1 text-white">Comunhão Diária com Deus</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            "O fim supremo e principal do homem é glorificar a Deus e alegrar-se nele para sempre." — Breve Catecismo de Westminster, Pergunta 1.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl text-center border border-white/10">
            <span className="text-xs text-slate-300">Orações Ativas</span>
            <div className="text-xl font-bold font-mono text-white">{activePrayers.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl text-center border border-white/10">
            <span className="text-xs text-slate-300">Respondidas</span>
            <div className="text-xl font-bold font-mono text-emerald-400">{answeredPrayers.length}</div>
          </div>
        </div>
      </div>

      {/* Sub-abas */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('bible')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeSubTab === 'bible' ? 'bg-purple-100 text-purple-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen size={14} />
          Leitura Bíblica Diária
        </button>
        <button
          onClick={() => setActiveSubTab('prayers')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeSubTab === 'prayers' ? 'bg-purple-100 text-purple-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HeartHandshake size={14} />
          Caderno de Oração ({prayers.length})
        </button>
        <button
          onClick={() => setActiveSubTab('devotional')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeSubTab === 'devotional' ? 'bg-purple-100 text-purple-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Feather size={14} />
          Meditação & Padrões Reformados
        </button>
      </div>

      {/* 1. LEITURA BÍBLICA */}
      {activeSubTab === 'bible' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Check-in de Leitura ({selectedDate})</h3>
                <p className="text-xs text-slate-500">Mantenha a fidelidade diária nas Sagradas Escrituras.</p>
              </div>
              {readingDone ? (
                <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                  <CheckCircle2 size={14} />
                  Leitura Concluída Hoje
                </span>
              ) : (
                <span className="px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
                  Pendente hoje
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-600">Livro da Bíblia</label>
                <input
                  type="text"
                  value={readingBook}
                  onChange={(e) => setReadingBook(e.target.value)}
                  placeholder="Gênesis, Salmos, Romanos..."
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Capítulos Lidos</label>
                <input
                  type="text"
                  value={readingChapters}
                  onChange={(e) => setReadingChapters(e.target.value)}
                  placeholder="ex: 1 a 3 ou 8-10"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Anotações / Aplicação Pessoal</label>
              <textarea
                rows={3}
                value={readingNotes}
                onChange={(e) => setReadingNotes(e.target.value)}
                placeholder="Qual princípio teológico ou exortação você extraiu deste texto hoje?"
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={handleSaveDayReading}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
            >
              Confirmar Leitura do Dia
            </button>
          </div>

          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bookmark size={16} className="text-purple-600" />
              Meta Anual de Leitura
            </h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Progresso Anual</span>
                <span className="font-mono">1.189 Capítulos</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '42%' }}></div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Meta média: ~3,2 capítulos por dia para leitura completa das Escrituras em 1 ano.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Histórico Recente</div>
              {bibleLogs.slice(-4).reverse().map((log) => (
                <div key={log.id} className="p-2.5 bg-slate-50/70 rounded-lg text-xs flex justify-between items-center">
                  <span className="font-semibold text-slate-800">{log.book} {log.chapters}</span>
                  <span className="text-[11px] text-slate-500">{new Date(log.date + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. CADERNO DE ORAÇÃO */}
      {activeSubTab === 'prayers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <Plus size={16} className="text-purple-600" />
              Novo Motivo de Oração
            </h3>
            <form onSubmit={handleAddPrayer} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-600">Motivo / Intercessão</label>
                <textarea
                  rows={3}
                  value={prayerTitle}
                  onChange={(e) => setPrayerTitle(e.target.value)}
                  placeholder="Ex: Pela santificação da minha mente, sabedoria no trabalho e pastoreio da família..."
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Categoria</label>
                <select
                  value={prayerCategory}
                  onChange={(e) => setPrayerCategory(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Família">Família</option>
                  <option value="Igreja">Igreja</option>
                  <option value="Santificação">Santificação & Luta contra o pecado</option>
                  <option value="Gratidão">Gratidão</option>
                  <option value="Trabalho/Metas">Trabalho / Metas</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
              >
                Registrar no Caderno
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Orações em Andamento ({activePrayers.length})</h3>
              <div className="space-y-2.5">
                {activePrayers.map((prayer) => (
                  <div
                    key={prayer.id}
                    className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80 flex items-start justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {prayer.category}
                      </span>
                      <p className="text-xs font-semibold text-slate-800 mt-1.5 leading-relaxed">{prayer.title}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Iniciado em: {new Date(prayer.createdAt + 'T12:00:00').toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => onToggleAnsweredPrayer(prayer.id, 'Oração respondida pela misericórdia de Deus.')}
                        className="px-2 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg"
                      >
                        Marcar Respondida
                      </button>
                      <button
                        onClick={() => onDeletePrayer(prayer.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {answeredPrayers.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                  <Sparkles size={16} className="text-emerald-600" />
                  Memorial de Fidelidade (Orações Respondidas)
                </h3>
                <div className="space-y-2.5">
                  {answeredPrayers.map((p) => (
                    <div key={p.id} className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-200/60">
                      <div className="text-xs font-bold text-slate-800 line-through opacity-75">{p.title}</div>
                      {p.testimony && (
                        <div className="text-[11px] text-emerald-800 mt-1 font-medium italic">
                          " {p.testimony} "
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. DEVOCIONAL E PADRÕES REFORMADOS */}
      {activeSubTab === 'devotional' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Meditação Teológica & Confessional</h3>
            <p className="text-xs text-slate-500">
              Conexão entre o texto bíblico e os símbolos de fé (Westminster / Heidelberg).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600">Versículo Chave</label>
              <input
                type="text"
                value={devVerse}
                onChange={(e) => setDevVerse(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Referência Confessional / Catecismo</label>
              <input
                type="text"
                value={devConfession}
                onChange={(e) => setDevConfession(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">Reflexão Devocional</label>
            <textarea
              rows={4}
              value={devReflection}
              onChange={(e) => setDevReflection(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 leading-relaxed"
            />
          </div>

          <button
            onClick={handleSaveTodayDevotional}
            className="py-2.5 px-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
          >
            Salvar Meditação do Dia
          </button>
        </div>
      )}
    </div>
  );
};
