import { useState, useEffect, useRef, useCallback } from 'react';
import {
  UserProfile,
  HabitItem,
  HabitsMonthState,
  WeightEntry,
  BloodMarker,
  BJJSession,
  ConditioningSession,
  DailyNutrition,
  ReadinessCheck,
  BibleReadingEntry,
  PrayerItem,
  DevotionalThought,
  FinanceConfig,
  ContributionEntry
} from '../types';
import {
  CloudBackupPayload,
  findOrCreateSyncGist,
  GistSyncConfig,
  pullFromGist,
  pushToGist,
  SYNC_CONFIG_STORAGE_KEY,
  SyncStatus
} from '../services/gistSync';

interface UseCloudSyncOptions {
  user: UserProfile;
  habits: HabitItem[];
  habitsState: HabitsMonthState;
  weightLogs: WeightEntry[];
  bloodMarkers: BloodMarker[];
  bjjSessions: BJJSession[];
  conditioningSessions: ConditioningSession[];
  nutritionLogs: DailyNutrition[];
  readinessLogs: ReadinessCheck[];
  bibleLogs: BibleReadingEntry[];
  prayers: PrayerItem[];
  devotionals: DevotionalThought[];
  financeConfig: FinanceConfig;
  contributions: ContributionEntry[];
  localUpdatedAt: string | null;
  onApplyRemoteData: (payload: CloudBackupPayload) => void;
}

const DEFAULT_CONFIG: GistSyncConfig = {
  token: '',
  gistId: null,
  autoSync: true,
  lastSyncedAt: null
};

export function useCloudSync({
  user,
  habits,
  habitsState,
  weightLogs,
  bloodMarkers,
  bjjSessions,
  conditioningSessions,
  nutritionLogs,
  readinessLogs,
  bibleLogs,
  prayers,
  devotionals,
  financeConfig,
  contributions,
  localUpdatedAt,
  onApplyRemoteData
}: UseCloudSyncOptions) {
  const [config, setConfig] = useState<GistSyncConfig>(() => {
    try {
      const raw = window.localStorage.getItem(SYNC_CONFIG_STORAGE_KEY);
      return raw ? { ...DEFAULT_CONFIG, ...JSON.parse(raw) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const { token, gistId, autoSync } = config;
  const isConfigured = Boolean(token && gistId);

  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() =>
    token && gistId ? 'idle' : 'unconfigured'
  );
  const [syncError, setSyncError] = useState<string | null>(null);

  const lastKnownRemoteUpdatedAtRef = useRef<string | null>(null);
  const isSyncingRef = useRef<boolean>(false);
  const lastPullTimestampRef = useRef<number>(0);

  // Manter referência aos dados mais recentes
  const latestDataRef = useRef({
    user,
    habits,
    habitsState,
    weightLogs,
    bloodMarkers,
    bjjSessions,
    conditioningSessions,
    nutritionLogs,
    readinessLogs,
    bibleLogs,
    prayers,
    devotionals,
    financeConfig,
    contributions,
    localUpdatedAt
  });

  useEffect(() => {
    latestDataRef.current = {
      user,
      habits,
      habitsState,
      weightLogs,
      bloodMarkers,
      bjjSessions,
      conditioningSessions,
      nutritionLogs,
      readinessLogs,
      bibleLogs,
      prayers,
      devotionals,
      financeConfig,
      contributions,
      localUpdatedAt
    };
  }, [
    user,
    habits,
    habitsState,
    weightLogs,
    bloodMarkers,
    bjjSessions,
    conditioningSessions,
    nutritionLogs,
    readinessLogs,
    bibleLogs,
    prayers,
    devotionals,
    financeConfig,
    contributions,
    localUpdatedAt
  ]);

  const updateConfig = useCallback((updater: (prev: GistSyncConfig) => GistSyncConfig) => {
    setConfig((prev) => {
      const next = updater(prev);
      try {
        window.localStorage.setItem(SYNC_CONFIG_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Erro ao salvar configuração de sync:', e);
      }
      return next;
    });
  }, []);

  const buildCurrentPayload = useCallback((overrideUpdatedAt?: string): CloudBackupPayload => {
    const current = latestDataRef.current;
    return {
      version: '1.0.0',
      updatedAt: overrideUpdatedAt || current.localUpdatedAt || new Date().toISOString(),
      user: current.user,
      habits: current.habits,
      habitsState: current.habitsState,
      weightLogs: current.weightLogs,
      bloodMarkers: current.bloodMarkers,
      bjjSessions: current.bjjSessions,
      conditioningSessions: current.conditioningSessions,
      nutritionLogs: current.nutritionLogs,
      readinessLogs: current.readinessLogs,
      bibleLogs: current.bibleLogs,
      prayers: current.prayers,
      devotionals: current.devotionals,
      financeConfig: current.financeConfig,
      contributions: current.contributions
    };
  }, []);

  // Conectar com Token e Gist ID opcional
  const connectWithToken = useCallback(
    async (rawToken: string, customGistId?: string): Promise<boolean> => {
      const cleanToken = rawToken.trim();
      if (!cleanToken) {
        setSyncError('Informe um Personal Access Token válido.');
        return false;
      }

      isSyncingRef.current = true;
      setSyncStatus('syncing');
      setSyncError(null);

      try {
        const localTime = latestDataRef.current.localUpdatedAt
          ? new Date(latestDataRef.current.localUpdatedAt).getTime()
          : 0;

        let targetGistId = customGistId?.trim() || null;
        let remotePayload: CloudBackupPayload | null = null;
        let wasCreated = false;

        if (targetGistId) {
          remotePayload = await pullFromGist(cleanToken, targetGistId);
        } else {
          const initialPayload = buildCurrentPayload(
            latestDataRef.current.localUpdatedAt || new Date().toISOString()
          );
          const result = await findOrCreateSyncGist(cleanToken, initialPayload);
          targetGistId = result.gistId;
          remotePayload = result.remotePayload;
          wasCreated = result.created;
        }

        if (!wasCreated && remotePayload) {
          const remoteTime = new Date(remotePayload.updatedAt).getTime() || 0;
          if (localTime === 0 || remoteTime >= localTime) {
            lastKnownRemoteUpdatedAtRef.current = remotePayload.updatedAt;
            onApplyRemoteData(remotePayload);
          } else {
            const payloadToPush = buildCurrentPayload();
            await pushToGist(cleanToken, targetGistId, payloadToPush);
            lastKnownRemoteUpdatedAtRef.current = payloadToPush.updatedAt;
          }
        }

        const nowIso = new Date().toISOString();
        updateConfig((prev) => ({
          ...prev,
          token: cleanToken,
          gistId: targetGistId,
          lastSyncedAt: nowIso
        }));

        lastPullTimestampRef.current = Date.now();
        setSyncStatus('synced');
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Falha ao conectar com o GitHub.';
        setSyncError(message);
        setSyncStatus('error');
        return false;
      } finally {
        isSyncingRef.current = false;
      }
    },
    [buildCurrentPayload, onApplyRemoteData, updateConfig]
  );

  // Sincronização sob demanda (Sync Now)
  const syncNow = useCallback(async () => {
    if (!token || !gistId || isSyncingRef.current) return;
    if (!navigator.onLine) {
      setSyncStatus('offline');
      return;
    }

    isSyncingRef.current = true;
    setSyncStatus('syncing');
    setSyncError(null);

    try {
      const remotePayload = await pullFromGist(token, gistId);
      const remoteTime = new Date(remotePayload.updatedAt).getTime() || 0;
      const localTime = latestDataRef.current.localUpdatedAt
        ? new Date(latestDataRef.current.localUpdatedAt).getTime()
        : 0;

      if (remoteTime > localTime) {
        lastKnownRemoteUpdatedAtRef.current = remotePayload.updatedAt;
        onApplyRemoteData(remotePayload);
      } else if (localTime > remoteTime) {
        const payloadToPush = buildCurrentPayload();
        await pushToGist(token, gistId, payloadToPush);
        lastKnownRemoteUpdatedAtRef.current = payloadToPush.updatedAt;
      }

      const nowIso = new Date().toISOString();
      lastPullTimestampRef.current = Date.now();
      updateConfig((prev) => ({
        ...prev,
        lastSyncedAt: nowIso
      }));
      setSyncStatus('synced');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao sincronizar com a nuvem.';
      setSyncError(message);
      setSyncStatus(navigator.onLine ? 'error' : 'offline');
    } finally {
      isSyncingRef.current = false;
    }
  }, [token, gistId, buildCurrentPayload, onApplyRemoteData, updateConfig]);

  // Forçar Download (Pull)
  const forcePull = useCallback(async () => {
    if (!token || !gistId || isSyncingRef.current) return;
    isSyncingRef.current = true;
    setSyncStatus('syncing');
    setSyncError(null);

    try {
      const remotePayload = await pullFromGist(token, gistId);
      lastKnownRemoteUpdatedAtRef.current = remotePayload.updatedAt;
      onApplyRemoteData(remotePayload);
      lastPullTimestampRef.current = Date.now();
      const nowIso = new Date().toISOString();
      updateConfig((prev) => ({
        ...prev,
        lastSyncedAt: nowIso
      }));
      setSyncStatus('synced');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao baixar dados da nuvem.';
      setSyncError(message);
      setSyncStatus('error');
    } finally {
      isSyncingRef.current = false;
    }
  }, [token, gistId, onApplyRemoteData, updateConfig]);

  // Forçar Envio (Push)
  const forcePush = useCallback(async () => {
    if (!token || !gistId || isSyncingRef.current) return;
    isSyncingRef.current = true;
    setSyncStatus('syncing');
    setSyncError(null);

    try {
      const nowIso = new Date().toISOString();
      const payload = buildCurrentPayload(nowIso);
      await pushToGist(token, gistId, payload);
      lastKnownRemoteUpdatedAtRef.current = nowIso;
      onApplyRemoteData(payload);
      lastPullTimestampRef.current = Date.now();
      updateConfig((prev) => ({
        ...prev,
        lastSyncedAt: nowIso
      }));
      setSyncStatus('synced');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao enviar para a nuvem.';
      setSyncError(message);
      setSyncStatus('error');
    } finally {
      isSyncingRef.current = false;
    }
  }, [token, gistId, buildCurrentPayload, onApplyRemoteData, updateConfig]);

  const disconnect = useCallback(() => {
    try {
      window.localStorage.removeItem(SYNC_CONFIG_STORAGE_KEY);
    } catch {
      // ignore
    }
    setConfig(DEFAULT_CONFIG);
    setSyncStatus('unconfigured');
    setSyncError(null);
  }, []);

  // 1. Pareamento multidispositivo com link seguro
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('gist_token=')) {
      const params = new URLSearchParams(hash.replace(/^#/, ''));
      const urlToken = params.get('gist_token');
      const urlGistId = params.get('gist_id') || undefined;

      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );

      if (urlToken) {
        connectWithToken(urlToken, urlGistId);
      }
    }
  }, [connectWithToken]);

  // 2. Auto-sync ao abrir página, ao focar na aba e ao voltar a conexão
  useEffect(() => {
    if (!isConfigured || !autoSync) return;

    syncNow();

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        Date.now() - lastPullTimestampRef.current > 30_000
      ) {
        syncNow();
      }
    };

    const handleOnline = () => {
      syncNow();
    };

    const handleOffline = () => {
      setSyncStatus('offline');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isConfigured, autoSync, syncNow]);

  // 3. Debounce Auto-Push após edições locais
  useEffect(() => {
    if (!isConfigured || !autoSync || !localUpdatedAt) return;
    if (localUpdatedAt === lastKnownRemoteUpdatedAtRef.current) return;

    const timer = window.setTimeout(async () => {
      if (!token || !gistId || isSyncingRef.current) return;
      if (!navigator.onLine) {
        setSyncStatus('offline');
        return;
      }

      isSyncingRef.current = true;
      setSyncStatus('syncing');
      setSyncError(null);

      try {
        const payload = buildCurrentPayload(localUpdatedAt);
        await pushToGist(token, gistId, payload);
        lastKnownRemoteUpdatedAtRef.current = localUpdatedAt;
        updateConfig((prev) => ({
          ...prev,
          lastSyncedAt: new Date().toISOString()
        }));
        setSyncStatus('synced');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao salvar na nuvem.';
        setSyncError(message);
        setSyncStatus(navigator.onLine ? 'error' : 'offline');
      } finally {
        isSyncingRef.current = false;
      }
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [localUpdatedAt, isConfigured, autoSync, token, gistId, buildCurrentPayload, updateConfig]);

  const getPairingUrl = useCallback(() => {
    if (!token) return '';
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const params = new URLSearchParams();
    params.set('gist_token', token);
    if (gistId) {
      params.set('gist_id', gistId);
    }
    return `${baseUrl}#${params.toString()}`;
  }, [token, gistId]);

  return {
    config,
    isConfigured,
    syncStatus,
    syncError,
    connectWithToken,
    syncNow,
    forcePull,
    forcePush,
    disconnect,
    getPairingUrl
  };
}
