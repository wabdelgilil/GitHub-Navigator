import React from 'react';
import {
  FolderGit2,
  GitBranch,
  Activity,
  Tags,
  Settings,
  ShieldAlert,
  FolderLock,
  Globe2,
} from 'lucide-react';
import { ViewFilter } from '../../types/app';
import { cn } from '../../lib/utils/formatters';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  activeFilter: ViewFilter;
  onFilterChange: (filter: ViewFilter) => void;
  counts: {
    total: number;
    public: number;
    private: number;
    forks: number;
    stale: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  activeFilter,
  onFilterChange,
  counts,
}) => {
  const mainNavItems = [
    { id: 'repositories', label: 'Repository Catalog', icon: FolderGit2 },
    { id: 'tree', label: 'Git Tree & Commits', icon: GitBranch },
    { id: 'radar', label: 'Workspace Radar', icon: Activity },
    { id: 'tags', label: 'Custom Tags', icon: Tags },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const filterItems: Array<{ id: ViewFilter; label: string; icon: React.ComponentType<{ className?: string }>; count: number; color?: string }> = [
    { id: 'all', label: 'All Repositories', icon: FolderGit2, count: counts.total },
    { id: 'public', label: 'Public Repos', icon: Globe2, count: counts.public, color: 'text-[#3fb950]' },
    { id: 'private', label: 'Private Repos', icon: FolderLock, count: counts.private, color: 'text-[#e3b341]' },
    { id: 'forks', label: 'Forked Repos', icon: GitBranch, count: counts.forks, color: 'text-[#bc8cff]' },
    { id: 'stale', label: 'Stale (> 6 mo)', icon: ShieldAlert, count: counts.stale, color: 'text-[#f85149]' },
  ];

  return (
    <aside className="w-64 bg-[#161b22]/50 border-r border-[#30363d] flex flex-col shrink-0 min-h-[calc(100vh-4rem)] p-4">
      {/* Navigation Sections */}
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider px-2">
            Main Views
          </span>
          <nav className="mt-2 space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left',
                    isActive
                      ? 'bg-[#1f6feb] text-white shadow-sm'
                      : 'text-[#c9d1d9] hover:bg-[#21262d] hover:text-white'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* View Segmentation Filters */}
        {currentTab === 'repositories' && (
          <div>
            <span className="text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider px-2">
              Catalog Filters
            </span>
            <div className="mt-2 space-y-1">
              {filterItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeFilter === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onFilterChange(item.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors text-left',
                      isSelected
                        ? 'bg-[#21262d] text-white font-medium border border-[#30363d]'
                        : 'text-[#8b949e] hover:bg-[#21262d]/50 hover:text-[#c9d1d9]'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={cn('w-3.5 h-3.5 shrink-0', item.color)} />
                      <span>{item.label}</span>
                    </div>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#0d1117] text-[#8b949e]">
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-auto pt-4 border-t border-[#30363d]/60 text-[11px] text-[#8b949e] flex items-center justify-between">
        <span>GitNavigator v1.1.0</span>
        <span className="font-mono text-[#3fb950]">Client-Only</span>
      </div>
    </aside>
  );
};
