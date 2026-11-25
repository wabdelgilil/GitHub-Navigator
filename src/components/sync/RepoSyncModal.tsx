import React, { useState } from 'react';
import {
  FolderSync,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { GitHubRepo } from '../../types/github';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface RepoSyncModalProps {
  repo: GitHubRepo | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RepoSyncModal: React.FC<RepoSyncModalProps> = ({
  repo,
  isOpen,
  onClose,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!repo) return null;

  const defaultBranch = repo.default_branch || 'main';

  // 1-Click PowerShell Command for this repo
  const quickSyncCommand = `git pull --rebase --autostash origin ${defaultBranch}; if ((git status --porcelain)) { git add -A; git commit -m "chore: sync workspace updates"; git push origin ${defaultBranch} }`;

  // Dynamic Batch script generator tailored for this exact repo
  const generatedBatScript = `@echo off
chcp 65001 >nul
title Syncing ${repo.name} with GitHub
echo [*] Fetching and syncing ${repo.name} (${defaultBranch})...
git pull --rebase --autostash origin ${defaultBranch}
if %ERRORLEVEL% NEQ 0 (
    echo [X] Pull failed or conflicts detected.
    pause
    exit /b 1
)
git status --porcelain | findstr /R "." >nul
if %ERRORLEVEL% EQU 0 (
    echo [*] Staging and committing local modifications...
    git add -A
    git commit -m "chore: workspace auto-sync"
    git push origin ${defaultBranch}
    echo [V] Successfully synced with GitHub!
) else (
    echo [V] Working tree is clean. Everything up to date.
)
timeout /t 3 >nul
exit /b 0
`;

  const handleCopy = (type: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadBat = () => {
    const blob = new Blob([generatedBatScript], { type: 'application/bat' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sync_${repo.name}.bat`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Local Sync Setup — ${repo.name}`}
      description="Keep your local working directory and remote GitHub repository synchronized."
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Intro Banner */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3.5 flex items-start gap-3 text-xs text-[#8b949e]">
          <FolderSync className="w-4 h-4 text-[#3fb950] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-[#c9d1d9] font-medium">Safe Two-Way Synchronization</p>
            <p>
              Pulls changes using <code className="text-[#3fb950]">--rebase --autostash</code> to protect unstaged work,
              then commits and pushes local updates cleanly to <code className="text-[#58a6ff]">{defaultBranch}</code>.
            </p>
          </div>
        </div>

        {/* 1-Click Tailored .bat Script */}
        <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">
              Tailored Single-Click Sync Script (<code className="text-[#58a6ff]">sync_{repo.name}.bat</code>)
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadBat}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download Script
            </Button>
          </div>
          <p className="text-[11px] text-[#8b949e]">
            Save this file into your local <code className="text-[#c9d1d9]">{repo.name}</code> directory and double-click anytime to sync.
          </p>
        </div>

        {/* Terminal Command Snippet */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
            Quick Terminal Command (PowerShell)
          </span>
          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 flex items-center justify-between gap-2 overflow-hidden">
            <code className="text-xs font-mono text-[#3fb950] truncate">{quickSyncCommand}</code>
            <button
              onClick={() => handleCopy('cmd', quickSyncCommand)}
              className="p-1 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-white transition-colors shrink-0"
              title="Copy command"
            >
              {copiedType === 'cmd' ? (
                <Check className="w-4 h-4 text-[#3fb950]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Download Standalone Companion Link */}
        <div className="pt-3 border-t border-[#30363d] flex items-center justify-between text-xs text-[#8b949e]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#58a6ff]" />
            <span>Need workspace-wide bulk synchronization?</span>
          </div>
          <a
            href="https://github.com/wabdelgilil/GitHub-Sync-Hub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#58a6ff] hover:underline flex items-center gap-1 font-medium"
          >
            <span>GitHub-Sync-Hub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </Modal>
  );
};
