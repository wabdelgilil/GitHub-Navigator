import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Terminal,
  Monitor,
  Clock,
  Star,
  FolderSync,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const LocalSyncView: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [workspacePath, setWorkspacePath] = useState<string>('C:\\Projects');

  const SYNC_HUB_REPO = 'https://github.com/wabdelgilil/GitHub-Sync-Hub';
  const RAW_BASE = 'https://raw.githubusercontent.com/wabdelgilil/GitHub-Sync-Hub/main/tools';

  const tools = [
    {
      id: 'multi-gui',
      name: 'Sync_All_Projects_GUI.bat',
      category: 'Multi-Project Workspace',
      interface: 'WPF Dark GUI + System Tray',
      description:
        'Drop into any parent workspace folder. Discovers all Git repositories, shows live progress bars, minimizes to the Windows System Tray with right-click menu, and delivers native notifications.',
      downloadUrl: `${RAW_BASE}/Sync_All_Projects_GUI.bat`,
      icon: Monitor,
      highlight: true,
      tag: 'Recommended for Desktop',
    },
    {
      id: 'multi-cli',
      name: 'Sync_All_Projects.bat',
      category: 'Multi-Project Workspace',
      interface: 'Interactive Terminal + Animated Spinner',
      description:
        'Keyboard-driven bulk synchronizer with animated spinners. Supports unattended automation via the --auto flag for Windows Task Scheduler.',
      downloadUrl: `${RAW_BASE}/Sync_All_Projects.bat`,
      icon: Terminal,
      highlight: false,
      tag: 'CLI & Automation',
    },
    {
      id: 'single-gui',
      name: 'sync_github_gui.bat',
      category: 'Single Repository',
      interface: 'Compact WPF Window',
      description:
        'Drop directly into an individual repository folder. Pulls remote updates with autostash, commits local changes, and pushes with a single click.',
      downloadUrl: `${RAW_BASE}/sync_github_gui.bat`,
      icon: Monitor,
      highlight: false,
      tag: 'Single Repo GUI',
    },
    {
      id: 'single-cli',
      name: 'sync_github.bat',
      category: 'Single Repository',
      interface: 'Lightweight Terminal',
      description:
        'Ultra-fast double-click sync utility for a single Git project. Ideal for quick commit-and-push routines.',
      downloadUrl: `${RAW_BASE}/sync_github.bat`,
      icon: Terminal,
      highlight: false,
      tag: 'Single Repo CLI',
    },
  ];

  const handleCopyCmd = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const psOneLiner = `Invoke-WebRequest -Uri "${RAW_BASE}/Sync_All_Projects_GUI.bat" -OutFile "${workspacePath}\\Sync_All_Projects_GUI.bat"`;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#38bdf8]/10 via-[#238636]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#238636]/20 border border-[#238636]/40 flex items-center justify-center text-[#3fb950]">
                <FolderSync className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Local Sync Companion
              </h1>
              <Badge variant="success" size="sm">Zero Dependency</Badge>
            </div>

            <p className="text-xs text-[#8b949e] leading-relaxed">
              Bridge your local hard drive and remote GitHub universe. Powered by{' '}
              <a
                href={SYNC_HUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#58a6ff] hover:underline font-semibold"
              >
                GitHub-Sync-Hub
              </a>
              : native Windows portable utilities with Dark Mode WPF, System Tray, and safe two-way sync
              (<code>pull --rebase --autostash</code>, commit & push).
            </p>
          </div>

          <a href={SYNC_HUB_REPO} target="_blank" rel="noopener noreferrer" className="shrink-0">
            <Button variant="outline" size="sm" leftIcon={<Star className="w-3.5 h-3.5 text-[#e3b341] fill-current" />}>
              Star GitHub-Sync-Hub
            </Button>
          </a>
        </div>
      </div>

      {/* 1-Click Quick Setup Generator */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#58a6ff]" />
              <span>One-Click PowerShell Installer</span>
            </h3>
            <p className="text-xs text-[#8b949e] mt-0.5">
              Enter your local projects folder to generate an instant download command.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={workspacePath}
            onChange={(e) => setWorkspacePath(e.target.value)}
            placeholder="e.g. C:\Users\YourUser\Projects"
            className="w-full sm:w-80 bg-[#0d1117] border border-[#30363d] focus:border-[#58a6ff] rounded-lg px-3 py-2 text-xs text-[#e6edf3] font-mono focus:outline-none"
          />

          <div className="flex-1 w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 flex items-center justify-between gap-2 overflow-hidden">
            <code className="text-xs font-mono text-[#3fb950] truncate">{psOneLiner}</code>
            <button
              onClick={() => handleCopyCmd('oneliner', psOneLiner)}
              className="p-1 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-white transition-colors shrink-0"
              title="Copy PowerShell command"
            >
              {copiedId === 'oneliner' ? (
                <Check className="w-4 h-4 text-[#3fb950]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tool Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider px-1">
          Available Desktop Sync Utilities
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className={`p-6 rounded-xl border flex flex-col justify-between space-y-4 transition-all ${
                  tool.highlight
                    ? 'bg-[#161b22] border-[#38bdf8]/50 shadow-md shadow-[#38bdf8]/5'
                    : 'bg-[#161b22] border-[#30363d] hover:border-[#8b949e]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-[#0d1117] border border-[#30363d] text-[#58a6ff]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white font-mono">{tool.name}</h4>
                        <span className="text-[11px] text-[#8b949e]">{tool.interface}</span>
                      </div>
                    </div>

                    <Badge variant={tool.highlight ? 'info' : 'default'} size="sm">
                      {tool.tag}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#8b949e] leading-relaxed">{tool.description}</p>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-[#30363d]/60 flex items-center justify-between gap-2">
                  <a
                    href={tool.downloadUrl}
                    download={tool.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-medium transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .bat</span>
                  </a>

                  <button
                    onClick={() =>
                      handleCopyCmd(
                        tool.id,
                        `Invoke-WebRequest -Uri "${tool.downloadUrl}" -OutFile "${tool.name}"`
                      )
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white text-xs font-mono flex items-center gap-1 transition-colors border border-[#30363d]"
                  >
                    {copiedId === tool.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#3fb950]" />
                        <span className="text-[#3fb950]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unattended Background Sync (Task Scheduler) */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2.5 text-white">
          <Clock className="w-5 h-5 text-[#e3b341]" />
          <h3 className="text-sm font-semibold">Unattended Background Sync Automation</h3>
        </div>

        <p className="text-xs text-[#8b949e] leading-relaxed">
          Keep your repositories in GitNavigator always up to date without manual effort.
          Run <code className="text-[#3fb950] bg-[#0d1117] px-1.5 py-0.5 rounded">Sync_All_Projects.bat --auto</code> via
          Windows Task Scheduler every hour or upon user logon:
        </p>

        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 text-xs font-mono text-[#c9d1d9] space-y-1">
          <div className="text-[#8b949e]"># Command to create a Windows Scheduled Task (Runs silently every hour):</div>
          <div className="text-[#58a6ff]">
            schtasks /create /tn "GitHubSyncHub" /tr "{workspacePath}\Sync_All_Projects.bat --auto" /sc hourly /mo 1
          </div>
        </div>
      </div>
    </div>
  );
};
