import React, { useState } from 'react';
import {
  KeyRound,
  Download,
  RefreshCw,
  HardDrive,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRepos } from '../../context/RepoContext';
import { Button } from '../common/Button';
import { TokenModal } from '../auth/TokenModal';

export const SettingsView: React.FC = () => {
  const { user, logout } = useAuth();
  const { customTags, metadata } = useRepos();
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleClearCache = () => {
    localStorage.removeItem('octodeck_repo_cache');
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 2500);
  };

  const handleExportData = () => {
    const backup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      customTags,
      metadata,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `octodeck-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Account & Token Section */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[#e6edf3] flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#58a6ff]" />
          <span>Authentication & API Credentials</span>
        </h3>

        {user ? (
          <div className="flex items-center justify-between p-4 bg-[#0d1117] border border-[#30363d] rounded-lg">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-10 h-10 rounded-full border border-[#30363d]"
              />
              <div>
                <p className="text-sm font-semibold text-[#e6edf3]">{user.name || user.login}</p>
                <p className="text-xs text-[#8b949e] font-mono">@{user.login} • Authenticated via Local PAT</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setIsTokenModalOpen(true)}>
                Change Token
              </Button>
              <Button variant="danger" size="sm" onClick={logout}>
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-lg flex items-center justify-between">
            <p className="text-xs text-[#8b949e]">No Personal Access Token connected.</p>
            <Button variant="primary" size="sm" onClick={() => setIsTokenModalOpen(true)}>
              Connect GitHub Token
            </Button>
          </div>
        )}
      </div>

      {/* Local Storage & Cache Controls */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[#e6edf3] flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-[#bc8cff]" />
          <span>Local Cache & Performance</span>
        </h3>

        <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#c9d1d9]">Repository Metadata Cache</p>
            <p className="text-[11px] text-[#8b949e] mt-0.5">
              Cached locally in browser memory to preserve GitHub API rate limits.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleClearCache}
            leftIcon={clearedNotice ? <Check className="w-3.5 h-3.5 text-[#3fb950]" /> : <RefreshCw className="w-3.5 h-3.5" />}
          >
            {clearedNotice ? 'Cache Purged' : 'Clear Cache'}
          </Button>
        </div>
      </div>

      {/* Backup & Export Section */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[#e6edf3] flex items-center gap-2">
          <Download className="w-4 h-4 text-[#3fb950]" />
          <span>Data Portability & Backup</span>
        </h3>

        <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#c9d1d9]">Export Labels & Custom Groupings</p>
            <p className="text-[11px] text-[#8b949e] mt-0.5">
              Download your custom tags, pinned repositories, and notes as a portable JSON file.
            </p>
          </div>

          <Button variant="secondary" size="sm" onClick={handleExportData} leftIcon={<Download className="w-3.5 h-3.5" />}>
            Export JSON
          </Button>
        </div>
      </div>

      <TokenModal isOpen={isTokenModalOpen} onClose={() => setIsTokenModalOpen(false)} />
    </div>
  );
};
