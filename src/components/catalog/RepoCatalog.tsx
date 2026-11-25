import React, { useState } from 'react';
import {
  ArrowUpDown,
  FolderGit2,
  Lock,
  Globe2,
  GitBranch,
  ShieldAlert,
  Archive,
  Layers,
  LayoutGrid,
  List,
  Table as TableIcon,
} from 'lucide-react';
import { GitHubRepo } from '../../types/github';
import { SortField, ViewFilter } from '../../types/app';
import { useRepos } from '../../context/RepoContext';
import { RepoCard } from './RepoCard';
import { RepoListRow } from './RepoListRow';
import { RepoTable } from './RepoTable';
import { TagManagerModal } from './TagManagerModal';
import { RepoSyncModal } from '../sync/RepoSyncModal';

interface RepoCatalogProps {
  onSelectRepoForTree: (repo: GitHubRepo) => void;
}

export const RepoCatalog: React.FC<RepoCatalogProps> = ({ onSelectRepoForTree }) => {
  const {
    filteredRepositories,
    isLoading,
    error,
    activeFilter,
    setActiveFilter,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    selectedTagId,
    setSelectedTagId,
    customTags,
    workspaceStats,
  } = useRepos();

  const [tagModalRepo, setTagModalRepo] = useState<GitHubRepo | null>(null);
  const [syncModalRepo, setSyncModalRepo] = useState<GitHubRepo | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('table');

  const filters: Array<{ id: ViewFilter; label: string; icon: React.ComponentType<{ className?: string }>; count: number }> = [
    { id: 'all', label: 'All', icon: Layers, count: workspaceStats.totalRepos },
    { id: 'public', label: 'Public', icon: Globe2, count: workspaceStats.publicCount },
    { id: 'private', label: 'Private', icon: Lock, count: workspaceStats.privateCount },
    { id: 'forks', label: 'Forks', icon: GitBranch, count: workspaceStats.forkCount },
    { id: 'stale', label: 'Stale (> 6 mo)', icon: ShieldAlert, count: workspaceStats.staleCount },
    { id: 'archived', label: 'Archived', icon: Archive, count: workspaceStats.archivedCount },
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls Bar: View Pills & Sort Options */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#161b22] border border-[#30363d] rounded-xl p-3.5 shadow-sm">
        {/* Filter Pills */}
        <div className="flex items-center flex-wrap gap-1.5">
          {filters.map((f) => {
            const Icon = f.icon;
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#1f6feb] text-white shadow-sm'
                    : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{f.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#0d1117] text-[#8b949e]'
                  }`}
                >
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Tag Filter, Sorting & View Mode Switcher */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Custom Tag Filter Pill */}
          {customTags.length > 0 && (
            <select
              value={selectedTagId || ''}
              onChange={(e) => setSelectedTagId(e.target.value ? e.target.value : null)}
              className="bg-[#0d1117] border border-[#30363d] focus:border-[#58a6ff] rounded-lg px-2.5 py-1.5 text-xs text-[#c9d1d9] focus:outline-none"
            >
              <option value="">All Custom Labels</option>
              {customTags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  🏷️ {tag.name}
                </option>
              ))}
            </select>
          )}

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#8b949e]" />
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="bg-transparent text-xs text-[#c9d1d9] focus:outline-none cursor-pointer"
            >
              <option value="pushed_at">Last Pushed</option>
              <option value="updated_at">Last Updated</option>
              <option value="stars">Most Stars</option>
              <option value="size">Disk Size</option>
              <option value="name">Alphabetical</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="text-[10px] uppercase font-mono px-1 rounded hover:bg-[#21262d] text-[#58a6ff]"
              title="Toggle sort direction"
            >
              {sortOrder}
            </button>
          </div>

          {/* View Mode Toggle (Grid / List / Table) */}
          <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              title="Cards Grid View"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-[#1f6feb] text-white shadow-sm' : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="Compact List View"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-[#1f6feb] text-white shadow-sm' : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Data Table View"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-[#1f6feb] text-white shadow-sm' : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area based on View Mode */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-xl bg-[#161b22]/40 border border-[#30363d] animate-pulse p-5 space-y-3"
            >
              <div className="h-5 bg-[#21262d] rounded w-1/3" />
              <div className="h-4 bg-[#21262d] rounded w-2/3" />
              <div className="h-3 bg-[#21262d] rounded w-1/2 mt-4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-[#161b22] border border-[#da3633]/40 rounded-xl space-y-2">
          <p className="text-sm text-[#f85149] font-medium">{error}</p>
          <p className="text-xs text-[#8b949e]">Please check your network connection or Personal Access Token.</p>
        </div>
      ) : filteredRepositories.length === 0 ? (
        <div className="p-12 text-center bg-[#161b22] border border-[#30363d] rounded-xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#21262d] flex items-center justify-center mx-auto text-[#8b949e]">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-[#e6edf3]">No repositories match your criteria</h4>
          <p className="text-xs text-[#8b949e] max-w-sm mx-auto">
            Try adjusting your search terms, clearing custom label filters, or selecting a different tab.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRepositories.map((repo) => (
            <RepoCard
              key={repo.id}
              repo={repo}
              onOpenTagModal={(target) => setTagModalRepo(target)}
              onOpenSyncModal={(target) => setSyncModalRepo(target)}
              onSelectRepoForTree={onSelectRepoForTree}
            />
          ))}
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-2">
          {filteredRepositories.map((repo) => (
            <RepoListRow
              key={repo.id}
              repo={repo}
              onOpenTagModal={(target) => setTagModalRepo(target)}
              onOpenSyncModal={(target) => setSyncModalRepo(target)}
              onSelectRepoForTree={onSelectRepoForTree}
            />
          ))}
        </div>
      ) : (
        <RepoTable
          repositories={filteredRepositories}
          onOpenTagModal={(target) => setTagModalRepo(target)}
          onOpenSyncModal={(target) => setSyncModalRepo(target)}
          onSelectRepoForTree={onSelectRepoForTree}
        />
      )}

      {/* Tag Assignment Modal */}
      <TagManagerModal
        repo={tagModalRepo}
        isOpen={!!tagModalRepo}
        onClose={() => setTagModalRepo(null)}
      />

      {/* Repo Sync Modal */}
      <RepoSyncModal
        repo={syncModalRepo}
        isOpen={!!syncModalRepo}
        onClose={() => setSyncModalRepo(null)}
      />
    </div>
  );
};
