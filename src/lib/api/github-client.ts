import {
  GitHubBranch,
  GitHubBranchComparison,
  GitHubCommit,
  GitHubRateLimit,
  GitHubRepo,
  GitHubTreeItem,
  GitHubUser,
} from '../../types/github';

const API_BASE = 'https://api.github.com';

export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public remainingRateLimit?: number
  ) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

async function request<T>(endpoint: string, token: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  const remaining = response.headers.get('x-ratelimit-remaining');

  if (!response.ok) {
    if (response.status === 401) {
      throw new GitHubAPIError(
        'Invalid or expired GitHub Personal Access Token. Please re-authenticate.',
        401,
        remaining ? parseInt(remaining, 10) : undefined
      );
    }
    if (response.status === 403 && remaining === '0') {
      throw new GitHubAPIError(
        'GitHub API rate limit exceeded. Please wait for quota refresh or use an authenticated token.',
        403,
        0
      );
    }
    const errorBody = await response.json().catch(() => ({}));
    throw new GitHubAPIError(
      errorBody.message || `Request failed with status ${response.status}`,
      response.status,
      remaining ? parseInt(remaining, 10) : undefined
    );
  }

  return response.json();
}

export const githubClient = {
  async getAuthenticatedUser(token: string): Promise<GitHubUser> {
    return request<GitHubUser>('/user', token);
  },

  async getRateLimit(token: string): Promise<GitHubRateLimit> {
    const res = await request<{ rate: GitHubRateLimit }>('/rate_limit', token);
    return res.rate;
  },

  async getAllRepositories(token: string): Promise<GitHubRepo[]> {
    let page = 1;
    const perPage = 100;
    const allRepos: GitHubRepo[] = [];

    while (true) {
      const repos = await request<GitHubRepo[]>(
        `/user/repos?per_page=${perPage}&page=${page}&sort=pushed&affiliation=owner,collaborator,organization_member`,
        token
      );
      if (!repos || repos.length === 0) break;
      allRepos.push(...repos);
      if (repos.length < perPage) break;
      page++;
      // Guard against runaway API requests
      if (page > 10) break;
    }

    return allRepos;
  },

  async getBranches(owner: string, repo: string, token: string): Promise<GitHubBranch[]> {
    return request<GitHubBranch[]>(`/repos/${owner}/${repo}/branches?per_page=100`, token);
  },

  async getCommits(
    owner: string,
    repo: string,
    token: string,
    branch?: string,
    limit: number = 30
  ): Promise<GitHubCommit[]> {
    const branchParam = branch ? `&sha=${encodeURIComponent(branch)}` : '';
    return request<GitHubCommit[]>(
      `/repos/${owner}/${repo}/commits?per_page=${limit}${branchParam}`,
      token
    );
  },

  async compareBranches(
    owner: string,
    repo: string,
    base: string,
    head: string,
    token: string
  ): Promise<GitHubBranchComparison> {
    return request<GitHubBranchComparison>(
      `/repos/${owner}/${repo}/compare/${encodeURIComponent(base)}...${encodeURIComponent(head)}`,
      token
    );
  },

  async getRepoTree(
    owner: string,
    repo: string,
    defaultBranch: string,
    token: string
  ): Promise<GitHubTreeItem[]> {
    const response = await request<{ tree: GitHubTreeItem[] }>(
      `/repos/${owner}/${repo}/git/trees/${encodeURIComponent(defaultBranch)}?recursive=1`,
      token
    );
    return response.tree || [];
  },

  async getFileRawContent(
    owner: string,
    repo: string,
    path: string,
    token: string
  ): Promise<string> {
    const response = await fetch(
      `${API_BASE}/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3.raw',
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to load file contents: ${response.statusText}`);
    }
    return response.text();
  }
};
