import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  Zap,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { DbStatus } from '../services/api';

interface MongoStatusBannerProps {
  status: DbStatus | null;
  onRefresh: () => Promise<void>;
  isDarkMode: boolean;
}

export const MongoStatusBanner: React.FC<MongoStatusBannerProps> = ({
  status,
  onRefresh,
  isDarkMode,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  const isConnected = status?.connected === true;
  const isFallback = status?.isUsingFallback ?? true;

  return (
    <div
      id="mongo-status-card"
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isConnected
          ? isDarkMode
            ? 'bg-[#18231c]/90 border-[#10B981]/30 shadow-md shadow-[#10B981]/5'
            : 'bg-[#F0FDF4] border-[#BBF7D0] shadow-xs'
          : isDarkMode
          ? 'bg-[#221f1b]/90 border-[#F59E0B]/30 shadow-md shadow-[#F59E0B]/5'
          : 'bg-[#FFFBEB] border-[#FEF3C7] shadow-xs'
      }`}
    >
      {/* Main Bar */}
      <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Status Icon */}
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold shadow-xs ${
              isConnected
                ? 'bg-[#10B981] text-white'
                : 'bg-[#F59E0B] text-white'
            }`}
          >
            <Database className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                  isConnected
                    ? 'bg-[#10B981]/15 text-[#047857] dark:text-[#34D399]'
                    : 'bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24]'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isConnected ? 'bg-[#10B981] animate-pulse' : 'bg-[#F59E0B]'
                  }`}
                />
                {isConnected ? 'MongoDB Atlas Connected' : 'Local In-Memory Mode'}
              </span>

              {isConnected && status?.pingMs && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#059669] dark:text-[#34D399]">
                  <Zap className="h-3 w-3" />
                  {status.pingMs}ms latency
                </span>
              )}
            </div>

            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA] mt-0.5">
              {isConnected ? (
                <>
                  Live connection verified to database{' '}
                  <strong className="text-[#1F1F23] dark:text-white font-mono">
                    "{status?.database || 'blazestore'}"
                  </strong>{' '}
                  {status?.cluster && <span className="opacity-75">on {status.cluster}</span>}
                </>
              ) : (
                <>
                  Running with automatic local persistence. Add{' '}
                  <code className="font-mono font-semibold text-[#B45309] dark:text-[#FBBF24]">MONGODB_URI</code> in
                  Settings to connect your live cluster.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            id="mongo-ping-refresh-btn"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-xs ${
              isConnected
                ? 'bg-white dark:bg-[#1E293B] text-[#047857] dark:text-[#34D399] border border-[#BBF7D0] dark:border-[#334155] hover:bg-[#F0FDF4]'
                : 'bg-white dark:bg-[#1E293B] text-[#B45309] dark:text-[#FBBF24] border border-[#FEF3C7] dark:border-[#334155] hover:bg-[#FFFBEB]'
            }`}
            title="Test connection and ping database"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Testing Ping...' : 'Check Connection'}</span>
          </button>

          <button
            id="mongo-details-toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 rounded-xl p-1.5 text-xs font-semibold text-[#71717A] hover:bg-black/5 dark:hover:bg-white/5 transition"
            aria-label="Toggle details"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Technical Details & Live Stats */}
      {isExpanded && (
        <div className="border-t border-black/5 dark:border-white/10 p-3.5 sm:p-4 bg-white/50 dark:bg-black/20 text-xs space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl p-2.5 bg-white dark:bg-[#1F1F23] border border-[#EDEDF2] dark:border-[#333]">
              <span className="text-[#8A8A94] text-[10px] uppercase font-bold block">Status</span>
              <span className="font-extrabold text-sm text-[#10B981] flex items-center gap-1 mt-0.5">
                {isConnected ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5 text-[#F59E0B]" />}
                {isConnected ? 'Active & Verified' : 'Awaiting URI'}
              </span>
            </div>

            <div className="rounded-xl p-2.5 bg-white dark:bg-[#1F1F23] border border-[#EDEDF2] dark:border-[#333]">
              <span className="text-[#8A8A94] text-[10px] uppercase font-bold block">Products in DB</span>
              <span className="font-extrabold text-sm text-[#1F1F23] dark:text-white mt-0.5 block">
                {status?.stats?.products ?? 0} items
              </span>
            </div>

            <div className="rounded-xl p-2.5 bg-white dark:bg-[#1F1F23] border border-[#EDEDF2] dark:border-[#333]">
              <span className="text-[#8A8A94] text-[10px] uppercase font-bold block">Cart Records</span>
              <span className="font-extrabold text-sm text-[#7C6FE0] mt-0.5 block">
                {status?.stats?.cart ?? 0} saved
              </span>
            </div>

            <div className="rounded-xl p-2.5 bg-white dark:bg-[#1F1F23] border border-[#EDEDF2] dark:border-[#333]">
              <span className="text-[#8A8A94] text-[10px] uppercase font-bold block">Orders Logged</span>
              <span className="font-extrabold text-sm text-[#1F1F23] dark:text-white mt-0.5 block">
                {status?.stats?.orders ?? 0} placed
              </span>
            </div>
          </div>

          {!isConnected && (
            <div className="rounded-xl p-3 bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200">
              <strong className="font-bold block mb-1">To connect your live MongoDB Atlas cluster:</strong>
              <ol className="list-decimal list-inside space-y-1 text-[11px] opacity-90">
                <li>Click <strong>Settings</strong> in the AI Studio header.</li>
                <li>Go to <strong>Environment Variables / Secrets</strong>.</li>
                <li>Set <code className="font-mono">MONGODB_URI</code> to your connection string.</li>
                <li>Ensure Network Access in Atlas allows traffic (<code className="font-mono">0.0.0.0/0</code>).</li>
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
