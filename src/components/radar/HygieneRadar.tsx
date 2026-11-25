import React from 'react';
import {
  ShieldAlert,
  Star,
  HardDrive,
  Code2,
  Layers,
} from 'lucide-react';
import { useRepos } from '../../context/RepoContext';
import { formatBytes, formatRelativeDate, getLanguageColor } from '../../lib/utils/formatters';
import { Badge } from '../common/Badge';

export const HygieneRadar: React.FC = () => {
  const { repositories, workspaceStats, setSelectedRepo } = useRepos();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const staleRepos = repositories.filter((r) => {
    const last = new Date(r.pushed_at || r.updated_at);
    return last < sixMonthsAgo && !r.archived;
  });

  return (
    <div className="space-y-6">
      {/* High-Level Executive Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8b949e]">
            <span>Total Repositories</span>
            <Layers className="w-4 h-4 text-[#58a6ff]" />
          </div>
          <p className="text-2xl font-bold font-mono text-[#e6edf3]">{workspaceStats.totalRepos}</p>
          <div className="text-[11px] text-[#8b949e] flex gap-2 pt-1">
            <span className="text-[#3fb950]">{workspaceStats.publicCount} Public</span>
            <span>•</span>
            <span className="text-[#e3b341]">{workspaceStats.privateCount} Private</span>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8b949e]">
            <span>Total Stars</span>
            <Star className="w-4 h-4 text-[#e3b341]" />
          </div>
          <p className="text-2xl font-bold font-mono text-[#e6edf3]">{workspaceStats.totalStars}</p>
          <p className="text-[11px] text-[#8b949e] pt-1">Across all public repos</p>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8b949e]">
            <span>Workspace Size</span>
            <HardDrive className="w-4 h-4 text-[#bc8cff]" />
          </div>
          <p className="text-2xl font-bold font-mono text-[#e6edf3]">
            {formatBytes(workspaceStats.totalSizeKB)}
          </p>
          <p className="text-[11px] text-[#8b949e] pt-1">{workspaceStats.forkCount} Forked projects</p>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8b949e]">
            <span>Stale Projects</span>
            <ShieldAlert className="w-4 h-4 text-[#f85149]" />
          </div>
          <p className="text-2xl font-bold font-mono text-[#f85149]">{workspaceStats.staleCount}</p>
          <p className="text-[11px] text-[#8b949e] pt-1">&gt; 6 months without commits</p>
        </div>
      </div>

      {/* Language Distribution Radar */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4">
        <h4 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#58a6ff]" />
          <span>Technology & Language Stack Breakdown</span>
        </h4>

        {/* Visual Language Bar */}
        <div className="h-3 rounded-full overflow-hidden flex bg-[#0d1117] border border-[#30363d]">
          {Object.entries(workspaceStats.languageDistribution).map(([lang, count]) => {
            const percentage = (count / (workspaceStats.totalRepos || 1)) * 100;
            return (
              <div
                key={lang}
                title={`${lang}: ${count} repos (${percentage.toFixed(1)}%)`}
                style={{
                  width: `${percentage}%`,
                  backgroundColor: getLanguageColor(lang),
                }}
                className="h-full transition-all hover:opacity-80"
              />
            );
          })}
        </div>

        {/* Legend Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          {Object.entries(workspaceStats.languageDistribution)
            .sort((a, b) => b[1] - a[1])
            .map(([lang, count]) => (
              <div key={lang} className="flex items-center gap-2 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: getLanguageColor(lang) }}
                />
                <span className="text-[#c9d1d9] truncate font-medium">{lang}</span>
                <span className="text-[#8b949e] font-mono text-[10px]">({count})</span>
              </div>
            ))}
        </div>
      </div>

      {/* Stale Repositories Action Radar */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#30363d]">
          <div>
            <h4 className="text-xs font-semibold text-[#f85149] uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Stale Repositories Radar</span>
            </h4>
            <p className="text-xs text-[#8b949e] mt-1">
              Repositories inactive for more than 6 months. Consider archiving them on GitHub to keep your profile clean.
            </p>
          </div>
          <Badge variant="danger" size="sm">{staleRepos.length} Stale</Badge>
        </div>

        {staleRepos.length === 0 ? (
          <p className="text-xs text-[#3fb950] py-4 text-center">
            🎉 Great hygiene! You have zero stale unarchived repositories.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {staleRepos.slice(0, 9).map((repo) => (
              <div
                key={repo.id}
                onClick={() => setSelectedRepo(repo)}
                className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] hover:border-[#f85149]/50 transition-colors cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#e6edf3] truncate">{repo.name}</span>
                  <Badge variant={repo.private ? 'warning' : 'success'} size="sm">
                    {repo.private ? 'Private' : 'Public'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#8b949e]">
                  <span>Last active:</span>
                  <span className="font-mono text-[#f85149]">
                    {formatRelativeDate(repo.pushed_at || repo.updated_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
