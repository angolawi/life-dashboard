import {
  UserProfile,
  BJJSession,
  ConditioningSession,
  HabitItem,
  HabitsMonthState,
  WeightEntry,
  BloodMarker,
  BibleReadingEntry,
  PrayerItem,
  FinanceConfig,
  ContributionEntry
} from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'user-default',
  name: 'Samuel Saraiva',
  currentRank: 'Faixa Azul (3º grau)',
  targetRank: 'Faixa Roxa',
  currentBeltColor: 'BLUE',
  currentDegrees: 3,
  targetBeltColor: 'PURPLE',
  startDate: '2024-01-01',
  targetDate: '2026-12-31',
  targetWeightKg: 82.5
};

export const DEFAULT_HABITS: HabitItem[] = [
  { id: 'h1', name: 'Leitura Bíblica & Oração', color: '#6366f1', targetDaysPerMonth: 30 },
  { id: 'h2', name: 'Jiu Jitsu Tatame', color: '#9333ea', targetDaysPerMonth: 16 },
  { id: 'h3', name: 'Musculação S&C / Mobilidade', color: '#0ea5e9', targetDaysPerMonth: 14 },
  { id: 'h4', name: 'Dieta & Proteína Alinhada', color: '#10b981', targetDaysPerMonth: 28 },
  { id: 'h5', name: 'Controle de Peso & Hidratação 3L', color: '#14b8a6', targetDaysPerMonth: 30 },
  { id: 'h6', name: 'Sono 7h30+ / Rotina Noturna', color: '#8b5cf6', targetDaysPerMonth: 26 },
  { id: 'h7', name: 'Aporte Financeiro / Gestão', color: '#f59e0b', targetDaysPerMonth: 4 },
  { id: 'h8', name: 'Estudo Teológico / Leitura', color: '#ec4899', targetDaysPerMonth: 20 },
];

export const DEFAULT_WEIGHT_LOGS: WeightEntry[] = [
  { id: 'w1', date: '2026-10-01', weightKg: 85.8, heightCm: 178, notes: 'Início do mês' },
  { id: 'w2', date: '2026-10-08', weightKg: 85.1, heightCm: 178, notes: 'Pós treinos fortes de BJJ' },
  { id: 'w3', date: '2026-10-15', weightKg: 84.4, heightCm: 178, notes: 'Dieta batendo 2g/kg proteína' },
  { id: 'w4', date: '2026-10-22', weightKg: 83.9, heightCm: 178, notes: 'Excelente disposição no rola' },
];

export const DEFAULT_BLOOD_MARKERS: BloodMarker[] = [
  { id: 'b1', name: 'Glicemia de Jejum', category: 'Metabólico', unit: 'mg/dL', value: 86, minOptimal: 70, maxOptimal: 99, status: 'OPTIMAL', date: '2026-09-15' },
  { id: 'b2', name: 'HbA1c (Hemoglobina Glicada)', category: 'Metabólico', unit: '%', value: 5.2, minOptimal: 4.0, maxOptimal: 5.6, status: 'OPTIMAL', date: '2026-09-15' },
  { id: 'b3', name: 'Colesterol Total', category: 'Lipídico', unit: 'mg/dL', value: 172, minOptimal: 120, maxOptimal: 190, status: 'OPTIMAL', date: '2026-09-15' },
  { id: 'b4', name: 'HDL (Colesterol Bom)', category: 'Lipídico', unit: 'mg/dL', value: 58, minOptimal: 40, maxOptimal: 80, status: 'OPTIMAL', date: '2026-09-15' },
  { id: 'b5', name: 'Triglicerídeos', category: 'Lipídico', unit: 'mg/dL', value: 94, minOptimal: 40, maxOptimal: 150, status: 'OPTIMAL', date: '2026-09-15' },
  { id: 'b6', name: 'Testosterona Total', category: 'Hormonal', unit: 'ng/dL', value: 680, minOptimal: 450, maxOptimal: 900, status: 'OPTIMAL', date: '2026-09-15' },
  { id: 'b7', name: 'Vitamina D3 (25-OH)', category: 'Vitaminas', unit: 'ng/mL', value: 46, minOptimal: 30, maxOptimal: 60, status: 'OPTIMAL', date: '2026-09-15' },
  { id: 'b8', name: 'Creatinina', category: 'Hepático/Renal', unit: 'mg/dL', value: 1.05, minOptimal: 0.7, maxOptimal: 1.3, status: 'OPTIMAL', date: '2026-09-15' },
  { id: 'b9', name: 'TGO / AST', category: 'Hepático/Renal', unit: 'U/L', value: 24, minOptimal: 10, maxOptimal: 40, status: 'OPTIMAL', date: '2026-09-15' },
  { id: 'b10', name: 'PCR Ultrassensível', category: 'Metabólico', unit: 'mg/L', value: 0.8, minOptimal: 0.1, maxOptimal: 1.0, status: 'OPTIMAL', date: '2026-09-15' },
];

export const DEFAULT_PRAYERS: PrayerItem[] = [
  { id: 'p1', title: 'Santificação diária, sabedoria no casamento e paciência', category: 'Família', status: 'ACTIVE', createdAt: '2026-10-01' },
  { id: 'p2', title: 'Preservação física no Jiu Jitsu contra lesões articulares', category: 'Santificação', status: 'ACTIVE', createdAt: '2026-10-01' },
  { id: 'p3', title: 'Sabedoria na administração financeira e foco na meta de 100k', category: 'Trabalho/Metas', status: 'ACTIVE', createdAt: '2026-10-05' },
  { id: 'p4', title: 'Abertura de portas e disciplina consistente nos estudos diários', category: 'Gratidão', status: 'ANSWERED', createdAt: '2026-09-10', answeredAt: '2026-10-18', testimony: 'Disciplina estabelecida com a Roda de Hábitos!' },
];

// Indicadores financeiros zerados por padrão
export const DEFAULT_FINANCE_CONFIG: FinanceConfig = {
  emergencyTargetAmount: 0,
  emergencyCurrentAmount: 0,
  fourYearTargetAmount: 100000,
  startDate: new Date().toISOString().split('T')[0],
  targetEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 4)).toISOString().split('T')[0],
  monthlyContributionTarget: 0
};

export const DEFAULT_CONTRIBUTIONS: ContributionEntry[] = [];

export const DEFAULT_BJJ_SESSIONS: BJJSession[] = [
  {
    id: 'bjj-1',
    date: '2026-10-22',
    startTime: '12:00',
    durationMinutes: 75,
    focusArea: 'GUARD_RETENTION',
    roundsRolled: 6,
    rpe: 8,
    techniqueNotes: 'Trabalho de guarda de laço e De La Riva. Ajuste na pegada cruzada.',
    partnersFeedback: 'Boa pressão e controle de quadril.',
    createdAt: '2026-10-22T13:30:00Z'
  },
  {
    id: 'bjj-2',
    date: '2026-10-20',
    startTime: '12:00',
    durationMinutes: 80,
    focusArea: 'PASSING',
    roundsRolled: 7,
    rpe: 9,
    techniqueNotes: 'Passagem toreando conectada com leg drag.',
    partnersFeedback: 'Graduados comentaram boa evolução da postura.',
    createdAt: '2026-10-20T13:40:00Z'
  }
];
