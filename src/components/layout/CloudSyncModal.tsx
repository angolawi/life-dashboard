import React, { useRef, useState } from 'react';
import {
  X,
  Download,
  Upload,
  RefreshCw,
  Cloud,
  Check,
  ExternalLink,
  Copy,
  LogOut,
  AlertCircle,
  KeyRound,
  ArrowDownToLine,
  ArrowUpFromLine,
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { GistSyncConfig, SyncStatus, CloudBackupPayload } from '../../services/gistSync';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncConfig: GistSyncConfig;
  isSyncConfigured: boolean;
  syncStatus: SyncStatus;
  syncError: string | null;
  onConnectToken: (token: string, customGistId?: string) => Promise<boolean>;
  onSyncNow: () => Promise<void>;
  onForcePull: () => Promise<void>;
  onForcePush: () => Promise<void>;
  onDisconnectSync: () => void;
  getPairingUrl: () => string;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  syncConfig,
  isSyncConfigured,
  syncStatus,
  syncError,
  onConnectToken,
  onSyncNow,
  onForcePull,
  onForcePush,
  onDisconnectSync,
  getPairingUrl,
  onExportJson,
  onImportJson
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [customGistIdInput, setCustomGistIdInput] = useState('');
  const [showAdvancedGistId, setShowAdvancedGistId] = useState(false);
  const [copiedPairingLink, setCopiedPairingLink] = useState(false);

  if (!isOpen) return null;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    const ok = await onConnectToken(tokenInput, customGistIdInput || undefined);
    if (ok) {
      setTokenInput('');
      setCustomGistIdInput('');
    }
  };

  const handleCopyPairingLink = async () => {
    const url = getPairingUrl();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedPairingLink(true);
      setTimeout(() => setCopiedPairingLink(false), 3000);
    } catch {
      prompt('Copie o link abaixo para abrir no celular ou tablet:', url);
    }
  };

  const formatLastSynced = (iso: string | null) => {
    if (!iso) return 'Nunca sincronizado';
    try {
      const d = new Date(iso);
      return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJson(file);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Cloud size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Sincronização em Nuvem & Dispositivos</h3>
              <p className="text-xs text-slate-500">GitHub Gist Secreto • Multi-Device Sync</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                {syncStatus === 'synced' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    syncStatus === 'synced'
                      ? 'bg-emerald-500'
                      : syncStatus === 'syncing'
                      ? 'bg-purple-500'
                      : syncStatus === 'error'
                      ? 'bg-rose-500'
                      : syncStatus === 'offline'
                      ? 'bg-amber-500'
                      : 'bg-slate-300'
                  }`}
                />
              </span>
              <span className="text-xs font-bold text-slate-800">
                {syncStatus === 'synced' && 'Nuvem Conectada e Atualizada'}
                {syncStatus === 'syncing' && 'Sincronizando com GitHub...'}
                {syncStatus === 'idle' && 'Pronto para sincronizar'}
                {syncStatus === 'error' && 'Erro de Conexão'}
                {syncStatus === 'offline' && 'Modo Offline'}
                {syncStatus === 'unconfigured' && 'Nuvem Não Configurada'}
              </span>
            </div>

            {isSyncConfigured && (
              <button
                onClick={() => onSyncNow()}
                disabled={syncStatus === 'syncing'}
                className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 hover:bg-purple-50 hover:text-purple-700 text-slate-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <RefreshCw size={13} className={syncStatus === 'syncing' ? 'animate-spin text-purple-600' : ''} />
                Sincronizar
              </button>
            )}
          </div>

          {isSyncConfigured && (
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 flex items-center justify-between">
              <span>Última sincronização:</span>
              <span className="font-mono font-medium text-slate-700">{formatLastSynced(syncConfig.lastSyncedAt)}</span>
            </div>
          )}

          {syncError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              <span>{syncError}</span>
            </div>
          )}
        </div>

        {/* Formulário de Conexão se NÃO configurado */}
        {!isSyncConfigured ? (
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="bg-purple-50/60 border border-purple-200/70 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                <KeyRound size={16} />
                Como Conectar seu GitHub Gist Secreto
              </div>
              <p className="text-[11px] text-purple-950/80 leading-relaxed">
                Seus dados são salvos em um Gist 100% privado na sua conta do GitHub. Gere um <strong>Personal Access Token (classic)</strong> com a permissão <code>gist</code>.
              </p>
              <a
                href="https://github.com/settings/tokens/new?scopes=gist&description=Life+Nexus+Dashboard"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 underline pt-1"
              >
                Criar Token no GitHub <ExternalLink size={12} />
              </a>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Token do GitHub (Personal Access Token)</label>
              <input
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full mt-1 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowAdvancedGistId(!showAdvancedGistId)}
                className="text-[11px] text-slate-500 hover:text-purple-600 font-medium"
              >
                {showAdvancedGistId ? '▲ Ocultar Gist ID existente' : '▼ Já possui um Gist ID existente? (Opcional)'}
              </button>

              {showAdvancedGistId && (
                <input
                  type="text"
                  placeholder="ID do Gist (ex: 8f4b2c1a...)"
                  value={customGistIdInput}
                  onChange={(e) => setCustomGistIdInput(e.target.value)}
                  className="w-full mt-2 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-purple-500"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={syncStatus === 'syncing'}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              {syncStatus === 'syncing' ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Conectando...
                </>
              ) : (
                <>
                  <Cloud size={14} /> Conectar e Sincronizar Nuvem
                </>
              )}
            </button>
          </form>
        ) : (
          /* Se JÁ configurado: Opções de Pareamento e Ações Avançadas */
          <div className="space-y-4">
            {/* Pareamento com Celular/Tablet */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <Smartphone size={16} />
                  Parear com Celular ou Tablet (1 Clique)
                </span>
                {copiedPairingLink && (
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <Check size={12} /> Copiado!
                  </span>
                )}
              </div>
              <p className="text-[11px] text-purple-950/80 leading-relaxed">
                Copie o link seguro de pareamento e abra-o no navegador do seu smartphone. Ele se conectará à mesma nuvem instantaneamente.
              </p>
              <button
                onClick={handleCopyPairingLink}
                className="w-full py-2 bg-white hover:bg-purple-100/60 border border-purple-300 text-purple-800 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Copy size={13} />
                {copiedPairingLink ? 'Link Copiado para a Área de Transferência!' : 'Copiar Link de Pareamento'}
              </button>
            </div>

            {/* Ações Manuais Nuvem */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={onForcePull}
                disabled={syncStatus === 'syncing'}
                className="py-2 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1"
                title="Puxar dados mais recentes da nuvem"
              >
                <ArrowDownToLine size={13} className="text-indigo-600" />
                Baixar Nuvem
              </button>
              <button
                onClick={onForcePush}
                disabled={syncStatus === 'syncing'}
                className="py-2 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1"
                title="Forçar envio dos dados locais para a nuvem"
              >
                <ArrowUpFromLine size={13} className="text-purple-600" />
                Enviar Nuvem
              </button>
              <button
                onClick={() => {
                  if (confirm('Deseja desconectar a sincronização automática neste dispositivo?')) {
                    onDisconnectSync();
                  }
                }}
                className="py-2 px-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-[11px] font-semibold text-rose-700 flex items-center justify-center gap-1"
              >
                <LogOut size={13} />
                Desconectar
              </button>
            </div>
          </div>
        )}

        {/* Backup Manual em Arquivo (Offline) */}
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
            Backup Manual em Arquivo (Offline)
          </span>
          <div className="flex gap-2">
            <button
              onClick={onExportJson}
              className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Download size={14} />
              Exportar Backup JSON
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Upload size={14} />
              Restaurar Arquivo
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
