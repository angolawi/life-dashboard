import { BiblePlanDay, BiblePlanProgress } from '../types';

export const BIBLE_BOOKS_DATA: { name: string; chapters: number; testament: 'OT' | 'NT' }[] = [
  // Antigo Testamento (39 livros, 929 capítulos)
  { name: 'Gênesis', chapters: 50, testament: 'OT' },
  { name: 'Êxodo', chapters: 40, testament: 'OT' },
  { name: 'Levítico', chapters: 27, testament: 'OT' },
  { name: 'Números', chapters: 36, testament: 'OT' },
  { name: 'Deuteronômio', chapters: 34, testament: 'OT' },
  { name: 'Josué', chapters: 24, testament: 'OT' },
  { name: 'Juízes', chapters: 21, testament: 'OT' },
  { name: 'Rute', chapters: 4, testament: 'OT' },
  { name: '1 Samuel', chapters: 31, testament: 'OT' },
  { name: '2 Samuel', chapters: 24, testament: 'OT' },
  { name: '1 Reis', chapters: 22, testament: 'OT' },
  { name: '2 Reis', chapters: 25, testament: 'OT' },
  { name: '1 Crônicas', chapters: 29, testament: 'OT' },
  { name: '2 Crônicas', chapters: 36, testament: 'OT' },
  { name: 'Esdras', chapters: 10, testament: 'OT' },
  { name: 'Neemias', chapters: 13, testament: 'OT' },
  { name: 'Ester', chapters: 10, testament: 'OT' },
  { name: 'Jó', chapters: 42, testament: 'OT' },
  { name: 'Salmos', chapters: 150, testament: 'OT' },
  { name: 'Provérbios', chapters: 31, testament: 'OT' },
  { name: 'Eclesiastes', chapters: 12, testament: 'OT' },
  { name: 'Cantares', chapters: 8, testament: 'OT' },
  { name: 'Isaías', chapters: 66, testament: 'OT' },
  { name: 'Jeremias', chapters: 52, testament: 'OT' },
  { name: 'Lamentações', chapters: 5, testament: 'OT' },
  { name: 'Ezequiel', chapters: 48, testament: 'OT' },
  { name: 'Daniel', chapters: 12, testament: 'OT' },
  { name: 'Oseias', chapters: 14, testament: 'OT' },
  { name: 'Joel', chapters: 3, testament: 'OT' },
  { name: 'Amós', chapters: 9, testament: 'OT' },
  { name: 'Obadias', chapters: 1, testament: 'OT' },
  { name: 'Jonas', chapters: 4, testament: 'OT' },
  { name: 'Miqueias', chapters: 7, testament: 'OT' },
  { name: 'Naum', chapters: 3, testament: 'OT' },
  { name: 'Habacuque', chapters: 3, testament: 'OT' },
  { name: 'Sofonias', chapters: 3, testament: 'OT' },
  { name: 'Ageu', chapters: 2, testament: 'OT' },
  { name: 'Zacarias', chapters: 14, testament: 'OT' },
  { name: 'Malaquias', chapters: 4, testament: 'OT' },

  // Novo Testamento (27 livros, 260 capítulos)
  { name: 'Mateus', chapters: 28, testament: 'NT' },
  { name: 'Marcos', chapters: 16, testament: 'NT' },
  { name: 'Lucas', chapters: 24, testament: 'NT' },
  { name: 'João', chapters: 21, testament: 'NT' },
  { name: 'Atos', chapters: 28, testament: 'NT' },
  { name: 'Romanos', chapters: 16, testament: 'NT' },
  { name: '1 Coríntios', chapters: 16, testament: 'NT' },
  { name: '2 Coríntios', chapters: 13, testament: 'NT' },
  { name: 'Gálatas', chapters: 6, testament: 'NT' },
  { name: 'Efésios', chapters: 6, testament: 'NT' },
  { name: 'Filipenses', chapters: 4, testament: 'NT' },
  { name: 'Colossenses', chapters: 4, testament: 'NT' },
  { name: '1 Tessalonicenses', chapters: 5, testament: 'NT' },
  { name: '2 Tessalonicenses', chapters: 3, testament: 'NT' },
  { name: '1 Timóteo', chapters: 6, testament: 'NT' },
  { name: '2 Timóteo', chapters: 4, testament: 'NT' },
  { name: 'Tito', chapters: 3, testament: 'NT' },
  { name: 'Filemom', chapters: 1, testament: 'NT' },
  { name: 'Hebreus', chapters: 13, testament: 'NT' },
  { name: 'Tiago', chapters: 5, testament: 'NT' },
  { name: '1 Pedro', chapters: 5, testament: 'NT' },
  { name: '2 Pedro', chapters: 3, testament: 'NT' },
  { name: '1 João', chapters: 5, testament: 'NT' },
  { name: '2 João', chapters: 1, testament: 'NT' },
  { name: '3 João', chapters: 1, testament: 'NT' },
  { name: 'Judas', chapters: 1, testament: 'NT' },
  { name: 'Apocalipse', chapters: 22, testament: 'NT' },
];

export const TOTAL_BIBLE_CHAPTERS = 1189; // 929 AT + 260 NT

interface FlatChapter {
  book: string;
  chapter: number;
  testament: 'OT' | 'NT';
}

function buildAllChapters(): FlatChapter[] {
  const chapters: FlatChapter[] = [];
  for (const book of BIBLE_BOOKS_DATA) {
    for (let c = 1; c <= book.chapters; c++) {
      chapters.push({ book: book.name, chapter: c, testament: book.testament });
    }
  }
  return chapters;
}

const ALL_FLAT_CHAPTERS = buildAllChapters();

/**
 * Gera exatamente 365 metas de leitura canônicas distribuindo os 1.189 capítulos.
 * ~3.25 capítulos/dia (dias alternando 3 e 4 capítulos).
 */
export function generateAnnualBiblePlan(): BiblePlanDay[] {
  const plan: BiblePlanDay[] = [];
  const totalDays = 365;
  const totalChapters = ALL_FLAT_CHAPTERS.length; // 1189

  let chapterCursor = 0;

  for (let day = 1; day <= totalDays; day++) {
    const remainingDays = totalDays - day + 1;
    const remainingChapters = totalChapters - chapterCursor;
    // Quantidade de capítulos para este dia de modo a distribuir exatamente até o dia 365
    const count = Math.round(remainingChapters / remainingDays);
    const dayChapters = ALL_FLAT_CHAPTERS.slice(chapterCursor, chapterCursor + count);
    chapterCursor += count;

    if (dayChapters.length === 0) continue;

    const first = dayChapters[0];
    const last = dayChapters[dayChapters.length - 1];

    let chaptersText = '';
    if (first.book === last.book) {
      if (first.chapter === last.chapter) {
        chaptersText = `${first.book} ${first.chapter}`;
      } else {
        chaptersText = `${first.book} ${first.chapter}-${last.chapter}`;
      }
    } else {
      chaptersText = `${first.book} ${first.chapter} — ${last.book} ${last.chapter}`;
    }

    plan.push({
      dayNumber: day,
      book: first.book === last.book ? first.book : `${first.book} / ${last.book}`,
      chaptersText,
      chaptersCount: dayChapters.length,
      testament: first.testament
    });
  }

  return plan;
}

export const ANNUAL_BIBLE_PLAN: BiblePlanDay[] = generateAnnualBiblePlan();

export const DEFAULT_BIBLE_PLAN_PROGRESS: BiblePlanProgress = {
  completedDayNumbers: [],
  startDate: new Date().getFullYear() + '-01-01',
  notesByDay: {}
};

/**
 * Calcula estatísticas do plano: capítulos lidos, percentual, dia esperado vs dia atual.
 */
export function calculateBiblePlanStats(
  progress: BiblePlanProgress,
  targetDateStr?: string
) {
  const completedSet = new Set(progress.completedDayNumbers || []);
  const completedDaysCount = completedSet.size;

  let chaptersRead = 0;
  for (const day of ANNUAL_BIBLE_PLAN) {
    if (completedSet.has(day.dayNumber)) {
      chaptersRead += day.chaptersCount;
    }
  }

  const percentageChapters = Math.min(100, (chaptersRead / TOTAL_BIBLE_CHAPTERS) * 100);
  const percentageDays = Math.min(100, (completedDaysCount / 365) * 100);

  // Determinar o dia esperado baseado na data de início do plano e a data atual
  const start = new Date((progress.startDate || `${new Date().getFullYear()}-01-01`) + 'T00:00:00');
  const target = targetDateStr ? new Date(targetDateStr + 'T00:00:00') : new Date();
  
  const diffTime = target.getTime() - start.getTime();
  const diffDays = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);
  const expectedDay = Math.min(365, Math.max(1, diffDays));

  // O maior dia completo para saber a frente de leitura
  const maxCompletedDay = completedDaysCount > 0 ? Math.max(...Array.from(completedSet)) : 0;

  // Próximo dia não lido
  let nextPendingDay: BiblePlanDay | undefined;
  for (const day of ANNUAL_BIBLE_PLAN) {
    if (!completedSet.has(day.dayNumber)) {
      nextPendingDay = day;
      break;
    }
  }

  // Ritmo: quantos dias adiantado ou atrasado
  // Se você completou 20 dias e o dia esperado é 15, você está +5 dias adiantado.
  const paceDelta = completedDaysCount - expectedDay;

  return {
    completedDaysCount,
    totalDays: 365,
    chaptersRead,
    totalChapters: TOTAL_BIBLE_CHAPTERS,
    percentageChapters,
    percentageDays,
    expectedDay,
    maxCompletedDay,
    nextPendingDay: nextPendingDay || ANNUAL_BIBLE_PLAN[ANNUAL_BIBLE_PLAN.length - 1],
    paceDelta,
    isAhead: paceDelta > 0,
    isBehind: paceDelta < 0,
    isOnTrack: paceDelta === 0,
    isCompleted: completedDaysCount >= 365
  };
}
