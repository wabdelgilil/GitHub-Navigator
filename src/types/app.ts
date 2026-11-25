export type ViewFilter = 
  | 'all' 
  | 'public' 
  | 'private' 
  | 'forks' 
  | 'sources' 
  | 'archived' 
  | 'active'
  | 'stale';

export type SortField = 'pushed_at' | 'updated_at' | 'name' | 'stars' | 'size';
export type SortOrder = 'asc' | 'desc';

export interface CustomTag {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface RepoMetadataStore {
  customTags: Record<number, string[]>; // repoId -> tagIds[]
  pinnedRepoIds: number[];
  notes: Record<number, string>; // repoId -> custom user note
}

export interface WorkspaceStats {
  totalRepos: number;
  publicCount: number;
  privateCount: number;
  forkCount: number;
  archivedCount: number;
  staleCount: number;
  totalStars: number;
  totalSizeKB: number;
  languageDistribution: Record<string, number>;
}
