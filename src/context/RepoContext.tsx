import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GitHubRepo } from '../types/github';
import { CustomTag, RepoMetadataStore, SortField, SortOrder, ViewFilter, WorkspaceStats } from '../types/app';
import { githubClient } from '../lib/api/github-client';
import { tokenStorage } from '../lib/storage/token-storage';
import { useAuth } from './AuthContext';

interface RepoContextType {
  repositories: GitHubRepo[];
  filteredRepositories: GitHubRepo[];
  isLoading: boolean;
  error: string | null;
  refreshRepositories: (force?: boolean) => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: ViewFilter;
  setActiveFilter: (filter: ViewFilter) => void;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  selectedTagId: string | null;
  setSelectedTagId: (tagId: string | null) => void;
  customTags: CustomTag[];
  metadata: RepoMetadataStore;
  assignTagsToRepo: (repoId: number, tagIds: string[]) => void;
  createCustomTag: (tag: Omit<CustomTag, 'id'>) => void;
  deleteCustomTag: (tagId: string) => void;
  togglePinRepo: (repoId: number) => void;
  saveRepoNote: (repoId: number, note: string) => void;
  workspaceStats: WorkspaceStats;
  selectedRepo: GitHubRepo | null;
  setSelectedRepo: (repo: GitHubRepo | null) => void;
}

const RepoContext = createContext<RepoContextType | undefined>(undefined);

export const RepoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, refreshRateLimit } = useAuth();
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<ViewFilter>('all');
  const [sortField, setSortField] = useState<SortField>('pushed_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);

  const [customTags, setCustomTags] = useState<CustomTag[]>(tokenStorage.getCustomTags());
  const [metadata, setMetadata] = useState<RepoMetadataStore>(tokenStorage.getMetadataStore());

  const fetchRepos = useCallback(
    async (force: boolean = false) => {
      if (!token) {
        setRepositories([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      // Check client-side cache unless force refresh
      if (!force) {
        const cached = tokenStorage.getCachedRepos<GitHubRepo[]>();
        if (cached && Date.now() - cached.timestamp < 1000 * 60 * 15) {
          setRepositories(cached.data);
          setIsLoading(false);
          return;
        }
      }

      try {
        const data = await githubClient.getAllRepositories(token);
        setRepositories(data);
        tokenStorage.setCachedRepos(data);
        await refreshRateLimit();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to retrieve repository data';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [token, refreshRateLimit]
  );

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  const handleAssignTags = (repoId: number, tagIds: string[]) => {
    const updated: RepoMetadataStore = {
      ...metadata,
      customTags: {
        ...metadata.customTags,
        [repoId]: tagIds,
      },
    };
    setMetadata(updated);
    tokenStorage.saveMetadataStore(updated);
  };

  const handleCreateTag = (tag: Omit<CustomTag, 'id'>) => {
    const newTag: CustomTag = {
      ...tag,
      id: `tag-${Date.now()}`,
    };
    const updated = [...customTags, newTag];
    setCustomTags(updated);
    tokenStorage.saveCustomTags(updated);
  };

  const handleDeleteTag = (tagId: string) => {
    const updated = customTags.filter((t) => t.id !== tagId);
    setCustomTags(updated);
    tokenStorage.saveCustomTags(updated);
  };

  const handleTogglePin = (repoId: number) => {
    const exists = metadata.pinnedRepoIds.includes(repoId);
    const updatedPins = exists
      ? metadata.pinnedRepoIds.filter((id) => id !== repoId)
      : [...metadata.pinnedRepoIds, repoId];

    const updated: RepoMetadataStore = {
      ...metadata,
      pinnedRepoIds: updatedPins,
    };
    setMetadata(updated);
    tokenStorage.saveMetadataStore(updated);
  };

  const handleSaveNote = (repoId: number, note: string) => {
    const updated: RepoMetadataStore = {
      ...metadata,
      notes: {
        ...metadata.notes,
        [repoId]: note,
      },
    };
    setMetadata(updated);
    tokenStorage.saveMetadataStore(updated);
  };

  // Filter & Search Engine
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const filteredRepositories = repositories
    .filter((repo) => {
      // Segmentation filter
      if (activeFilter === 'public' && repo.private) return false;
      if (activeFilter === 'private' && !repo.private) return false;
      if (activeFilter === 'forks' && !repo.fork) return false;
      if (activeFilter === 'sources' && repo.fork) return false;
      if (activeFilter === 'archived' && !repo.archived) return false;
      if (activeFilter === 'stale') {
        const lastPush = new Date(repo.pushed_at || repo.updated_at);
        if (lastPush >= sixMonthsAgo || repo.archived) return false;
      }

      // Tag filter
      if (selectedTagId) {
        const repoTags = metadata.customTags[repo.id] || [];
        if (!repoTags.includes(selectedTagId)) return false;
      }

      // Multi-Vector Search (name, description, language, topics)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = repo.name.toLowerCase().includes(q);
        const matchesDesc = (repo.description || '').toLowerCase().includes(q);
        const matchesLang = (repo.language || '').toLowerCase().includes(q);
        const matchesTopic = repo.topics?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesLang && !matchesTopic) return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Pinned repos always come first
      const aPinned = metadata.pinnedRepoIds.includes(a.id);
      const bPinned = metadata.pinnedRepoIds.includes(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;

      let comparison = 0;
      if (sortField === 'pushed_at') {
        comparison = new Date(b.pushed_at || 0).getTime() - new Date(a.pushed_at || 0).getTime();
      } else if (sortField === 'updated_at') {
        comparison = new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime();
      } else if (sortField === 'stars') {
        comparison = b.stargazers_count - a.stargazers_count;
      } else if (sortField === 'size') {
        comparison = b.size - a.size;
      } else if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      }

      return sortOrder === 'asc' ? -comparison : comparison;
    });

  // Calculate High-Level Metrics
  const workspaceStats: WorkspaceStats = repositories.reduce(
    (acc, repo) => {
      acc.totalRepos += 1;
      if (repo.private) acc.privateCount += 1;
      else acc.publicCount += 1;
      if (repo.fork) acc.forkCount += 1;
      if (repo.archived) acc.archivedCount += 1;
      acc.totalStars += repo.stargazers_count;
      acc.totalSizeKB += repo.size;

      const lastPush = new Date(repo.pushed_at || repo.updated_at);
      if (lastPush < sixMonthsAgo && !repo.archived) {
        acc.staleCount += 1;
      }

      if (repo.language) {
        acc.languageDistribution[repo.language] =
          (acc.languageDistribution[repo.language] || 0) + 1;
      }

      return acc;
    },
    {
      totalRepos: 0,
      publicCount: 0,
      privateCount: 0,
      forkCount: 0,
      archivedCount: 0,
      staleCount: 0,
      totalStars: 0,
      totalSizeKB: 0,
      languageDistribution: {} as Record<string, number>,
    }
  );

  return (
    <RepoContext.Provider
      value={{
        repositories,
        filteredRepositories,
        isLoading,
        error,
        refreshRepositories: fetchRepos,
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        sortField,
        setSortField,
        sortOrder,
        setSortOrder,
        selectedTagId,
        setSelectedTagId,
        customTags,
        metadata,
        assignTagsToRepo: handleAssignTags,
        createCustomTag: handleCreateTag,
        deleteCustomTag: handleDeleteTag,
        togglePinRepo: handleTogglePin,
        saveRepoNote: handleSaveNote,
        workspaceStats,
        selectedRepo,
        setSelectedRepo,
      }}
    >
      {children}
    </RepoContext.Provider>
  );
};

export const useRepos = (): RepoContextType => {
  const context = useContext(RepoContext);
  if (!context) {
    throw new Error('useRepos must be used within a RepoProvider');
  }
  return context;
};
