import { CustomTag, RepoMetadataStore } from '../../types/app';

const TOKEN_STORAGE_KEY = 'octodeck_github_token';
const METADATA_STORAGE_KEY = 'octodeck_metadata_store';
const TAGS_STORAGE_KEY = 'octodeck_custom_tags';
const REPO_CACHE_KEY = 'octodeck_repo_cache';

const DEFAULT_TAGS: CustomTag[] = [
  { id: 'client', name: 'Client Project', color: '#38bdf8', description: 'Commercial or freelance client deliverables' },
  { id: 'internal', name: 'Core Internal', color: '#4ade80', description: 'Internal tools and shared utilities' },
  { id: 'learning', name: 'Learning & Labs', color: '#facc15', description: 'Prototypes, experiments and study repos' },
  { id: 'archive-ready', name: 'Archive Candidate', color: '#f87171', description: 'Ready for historical archival' },
];

export const tokenStorage = {
  getToken: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token.trim());
  },

  clearToken: (): void => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REPO_CACHE_KEY);
  },

  getMetadataStore: (): RepoMetadataStore => {
    try {
      const raw = localStorage.getItem(METADATA_STORAGE_KEY);
      if (!raw) {
        return { customTags: {}, pinnedRepoIds: [], notes: {} };
      }
      return JSON.parse(raw);
    } catch {
      return { customTags: {}, pinnedRepoIds: [], notes: {} };
    }
  },

  saveMetadataStore: (store: RepoMetadataStore): void => {
    localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(store));
  },

  getCustomTags: (): CustomTag[] => {
    try {
      const raw = localStorage.getItem(TAGS_STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(DEFAULT_TAGS));
        return DEFAULT_TAGS;
      }
      return JSON.parse(raw);
    } catch {
      return DEFAULT_TAGS;
    }
  },

  saveCustomTags: (tags: CustomTag[]): void => {
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags));
  },

  getCachedRepos: <T>(): { data: T; timestamp: number } | null => {
    try {
      const raw = localStorage.getItem(REPO_CACHE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCachedRepos: <T>(data: T): void => {
    try {
      localStorage.setItem(
        REPO_CACHE_KEY,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch {
      // Storage quota exceeded fallback
    }
  }
};
