import React, { useState, useEffect, useCallback } from 'react';
import {
  GitBranch,
  GitCommit,
  ShieldCheck,
  RefreshCw,
  FolderTree,
  ListTree,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { GitHubBranch, GitHubBranchComparison, GitHubCommit } from '../../types/github';
import { useAuth } from '../../context/AuthContext';
import { useRepos } from '../../context/RepoContext';
import { githubClient } from '../../lib/api/github-client';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CommitTimeline } from './CommitTimeline';
import { FileTreeExplorer } from './FileTreeExplorer';
import { VisualBranchNetwork } from './VisualBranchNetwork';

export const BranchTree: React.FC = () => {
  const { token } = useAuth();
  const { repositories, selectedRepo, setSelectedRepo } = useRepos();

  const [branches, setBranches] = useState<GitHubBranch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [comparison, setComparison] = useState<GitHubBranchComparison | null>(null);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'graph' | 'files'>('graph');

  // Load branches when selectedRepo changes
  const loadRepoData = useCallback(async () => {
    if (!token || !selectedRepo) return;
    setLoading(true);
    try {
      const branchList = await githubClient.getBranches(
        selectedRepo.owner.login,
        selectedRepo.name,
        token
      );
      setBranches(branchList);
      const defaultB = selectedRepo.default_branch || branchList[0]?.name || 'main';
      setSelectedBranch(defaultB);

      // Load initial commits
      const commitList = await githubClient.getCommits(
        selectedRepo.owner.login,
        selectedRepo.name,
        token,
        defaultB,
        25
      );
      setCommits(commitList);
    } catch {
      // Error handled silently or shown via UI
    } finally {
      setLoading(false);
    }
  }, [token, selectedRepo]);

  useEffect(() => {
    loadRepoData();
  }, [loadRepoData]);

  // Load branch comparison & commits when selectedBranch changes
  useEffect(() => {
    if (!token || !selectedRepo || !selectedBranch) return;

    const fetchBranchDetails = async () => {
      setLoading(true);
      try {
        const commitList = await githubClient.getCommits(
          selectedRepo.owner.login,
          selectedRepo.name,
          token,
          selectedBranch,
          25
        );
        setCommits(commitList);

        if (selectedBranch !== selectedRepo.default_branch) {
          const comp = await githubClient.compareBranches(
            selectedRepo.owner.login,
            selectedRepo.name,
            selectedRepo.default_branch,
            selectedBranch,
            token
          );
          setComparison(comp);
        } else {
          setComparison(null);
        }
      } catch {
        setComparison(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBranchDetails();
  }, [token, selectedRepo, selectedBranch]);

  if (!selectedRepo) {
    return (
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-12 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#1f6feb]/10 text-[#58a6ff] flex items-center justify-center mx-auto">
          <GitBranch className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-[#e6edf3]">Select a Repository for Git Tree Analysis</h3>
        <p className="text-xs text-[#8b949e] max-w-md mx-auto">
          Choose a repository from your catalog to visualize branch divergence, ahead/behind commits, and file tree structure.
        </p>
        <div className="max-w-xs mx-auto pt-2">
          <select
            onChange={(e) => {
              const target = repositories.find((r) => r.id === Number(e.target.value));
              if (target) setSelectedRepo(target);
            }}
            defaultValue=""
            className="w-full bg-[#0d1117] border border-[#30363d] text-xs text-[#c9d1d9] rounded-lg p-2.5 focus:border-[#58a6ff] focus:outline-none"
          >
            <option value="" disabled>Choose a repository...</option>
            {repositories.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} {r.private ? '🔒' : '🌐'}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  const defaultBranch = selectedRepo.default_branch || 'main';

  return (
    <div className="space-y-6">
      {/* Top Header: Repo Switcher & Branch Bar */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1f6feb]/15 border border-[#1f6feb]/30 flex items-center justify-center text-[#58a6ff]">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <select
                value={selectedRepo.id}
                onChange={(e) => {
                  const target = repositories.find((r) => r.id === Number(e.target.value));
                  if (target) setSelectedRepo(target);
                }}
                className="bg-[#0d1117] border border-[#30363d] text-sm font-semibold text-[#e6edf3] rounded-lg px-2.5 py-1 focus:border-[#58a6ff] focus:outline-none cursor-pointer"
              >
                {repositories.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <Badge variant={selectedRepo.private ? 'warning' : 'success'} size="sm">
                {selectedRepo.private ? 'Private' : 'Public'}
              </Badge>
            </div>
            <p className="text-xs text-[#8b949e] mt-0.5">
              Default branch: <code className="text-[#3fb950] font-mono">{defaultBranch}</code> • {branches.length} active branches
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex bg-[#0d1117] border border-[#30363d] rounded-lg p-1">
            <button
              onClick={() => setViewMode('graph')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'graph' ? 'bg-[#1f6feb] text-white' : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              <ListTree className="w-3.5 h-3.5" />
              <span>Branch & Commits</span>
            </button>
            <button
              onClick={() => setViewMode('files')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'files' ? 'bg-[#1f6feb] text-white' : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>File Tree</span>
            </button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={loadRepoData}
            isLoading={loading}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {viewMode === 'files' ? (
        <FileTreeExplorer repo={selectedRepo} defaultBranch={defaultBranch} />
      ) : (
        <div className="space-y-6">
          {/* Interactive SVG Branch Network Tree */}
          <VisualBranchNetwork
            branches={branches}
            defaultBranch={defaultBranch}
            selectedBranch={selectedBranch}
            onSelectBranch={setSelectedBranch}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Branch Topology & Divergence */}
          <div className="space-y-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
              <h4 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Branch Divergence Radar</span>
                <span className="text-[10px] font-mono text-[#58a6ff]">{branches.length} branches</span>
              </h4>

              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {branches.map((b) => {
                  const isDefault = b.name === defaultBranch;
                  const isSelected = b.name === selectedBranch;

                  return (
                    <div
                      key={b.name}
                      onClick={() => setSelectedBranch(b.name)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-[#1f6feb]/15 border-[#58a6ff] text-white shadow-sm'
                          : 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9] hover:border-[#8b949e]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 truncate">
                          <GitBranch className={`w-4 h-4 shrink-0 ${isDefault ? 'text-[#3fb950]' : 'text-[#bc8cff]'}`} />
                          <span className="text-xs font-mono font-medium truncate">{b.name}</span>
                          {isDefault && (
                            <span className="text-[9px] bg-[#238636]/20 text-[#3fb950] px-1.5 py-0.5 rounded border border-[#238636]/40">
                              default
                            </span>
                          )}
                        </div>

                        {b.protected && (
                          <span title="Protected Branch">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#388bfd] shrink-0" />
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#8b949e] font-mono pt-1">
                        <span>SHA: {b.commit.sha.substring(0, 7)}</span>
                        {isSelected && <ChevronRight className="w-3.5 h-3.5 text-[#58a6ff]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Differential Status Card */}
            {comparison && (
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#58a6ff]" />
                  <span>Branch Differential vs {defaultBranch}</span>
                </h4>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg">
                    <span className="text-xl font-bold font-mono text-[#3fb950]">+{comparison.ahead_by}</span>
                    <p className="text-[10px] text-[#8b949e] mt-0.5 uppercase font-medium">Commits Ahead</p>
                  </div>
                  <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg">
                    <span className="text-xl font-bold font-mono text-[#f85149]">-{comparison.behind_by}</span>
                    <p className="text-[10px] text-[#8b949e] mt-0.5 uppercase font-medium">Commits Behind</p>
                  </div>
                </div>

                <div className="text-xs text-[#8b949e] flex items-center justify-between pt-1">
                  <span>Status:</span>
                  <span className="font-mono text-[#c9d1d9] capitalize font-medium">{comparison.status}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (2 cols): Interactive Commit Graph & Timeline */}
          <div className="lg:col-span-2 space-y-4">
            {/* Visual SVG Branch Graph */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#30363d]">
                <div className="flex items-center gap-2">
                  <GitCommit className="w-4 h-4 text-[#58a6ff]" />
                  <h4 className="text-xs font-semibold text-[#e6edf3] uppercase tracking-wider">
                    Visual Commit Flow for <code className="text-[#58a6ff] lowercase font-mono">{selectedBranch}</code>
                  </h4>
                </div>
                <span className="text-xs text-[#8b949e]">Displaying latest 25 commits</span>
              </div>

              {/* Commit Timeline Component */}
              <CommitTimeline commits={commits} defaultBranch={defaultBranch} activeBranch={selectedBranch} />
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
