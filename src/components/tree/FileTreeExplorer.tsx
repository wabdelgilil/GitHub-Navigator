import React, { useState, useEffect, useMemo } from 'react';
import {
  Folder,
  FileCode,
  FileText,
  ChevronRight,
  ChevronDown,
  Search,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { GitHubRepo, GitHubTreeItem } from '../../types/github';
import { githubClient } from '../../lib/api/github-client';
import { useAuth } from '../../context/AuthContext';
import { formatBytes } from '../../lib/utils/formatters';
import { CodeAndMarkdownViewer } from './CodeAndMarkdownViewer';

interface FileTreeExplorerProps {
  repo: GitHubRepo;
  defaultBranch: string;
}

interface TreeNode {
  name: string;
  path: string;
  type: 'blob' | 'tree';
  size?: number;
  children?: Record<string, TreeNode>;
}

export const FileTreeExplorer: React.FC<FileTreeExplorerProps> = ({
  repo,
  defaultBranch,
}) => {
  const { token } = useAuth();
  const [treeItems, setTreeItems] = useState<GitHubTreeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<GitHubTreeItem | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loadingFile, setLoadingFile] = useState<boolean>(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    githubClient
      .getRepoTree(repo.owner.login, repo.name, defaultBranch, token)
      .then((items) => {
        setTreeItems(items);
        // Expand root level by default
        const initialExpanded = new Set<string>();
        items.forEach((item) => {
          if (item.type === 'tree' && !item.path.includes('/')) {
            initialExpanded.add(item.path);
          }
        });
        setExpandedFolders(initialExpanded);
      })
      .catch((err: Error) => {
        setError(err.message || 'Failed to retrieve repository file structure');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [repo, defaultBranch, token]);

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const handleSelectFile = async (item: GitHubTreeItem) => {
    if (!token) return;
    setSelectedFile(item);
    setLoadingFile(true);
    try {
      const content = await githubClient.getFileRawContent(
        repo.owner.login,
        repo.name,
        item.path,
        token
      );
      setFileContent(content);
    } catch {
      setFileContent('Unable to display file content preview (binary or unavailable).');
    } finally {
      setLoadingFile(false);
    }
  };

  // Build hierarchical tree structure
  const rootTree = useMemo(() => {
    const root: Record<string, TreeNode> = {};

    treeItems.forEach((item) => {
      if (searchFilter && !item.path.toLowerCase().includes(searchFilter.toLowerCase())) {
        return;
      }

      const parts = item.path.split('/');
      let currentLevel = root;

      parts.forEach((part, index) => {
        const isLeaf = index === parts.length - 1;
        const currentPath = parts.slice(0, index + 1).join('/');

        if (!currentLevel[part]) {
          currentLevel[part] = {
            name: part,
            path: currentPath,
            type: isLeaf ? item.type : 'tree',
            size: isLeaf ? item.size : undefined,
            children: isLeaf && item.type === 'blob' ? undefined : {},
          };
        }
        if (!isLeaf && currentLevel[part].children) {
          currentLevel = currentLevel[part].children!;
        }
      });
    });

    return root;
  }, [treeItems, searchFilter]);

  const renderNodes = (nodes: Record<string, TreeNode>, depth: number = 0) => {
    return Object.values(nodes).map((node) => {
      const isFolder = node.type === 'tree';
      const isExpanded = expandedFolders.has(node.path);
      const isSelected = selectedFile?.path === node.path;

      return (
        <div key={node.path}>
          <div
            onClick={() => {
              if (isFolder) toggleFolder(node.path);
              else handleSelectFile({ path: node.path, mode: '', type: 'blob', sha: '', size: node.size, url: '' });
            }}
            style={{ paddingLeft: `${depth * 14 + 10}px` }}
            className={`flex items-center justify-between py-1.5 pr-3 rounded-md text-xs cursor-pointer transition-colors ${
              isSelected
                ? 'bg-[#1f6feb]/20 text-[#58a6ff] font-medium'
                : 'text-[#c9d1d9] hover:bg-[#21262d] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              {isFolder ? (
                <>
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-[#8b949e] shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-[#8b949e] shrink-0" />
                  )}
                  <Folder className="w-4 h-4 text-[#58a6ff] fill-current/20 shrink-0" />
                </>
              ) : (
                <>
                  <span className="w-3.5 h-3.5 shrink-0" />
                  <FileCode className="w-3.5 h-3.5 text-[#8b949e] shrink-0" />
                </>
              )}
              <span className="truncate">{node.name}</span>
            </div>

            {node.size !== undefined && (
              <span className="text-[10px] font-mono text-[#8b949e]">
                {formatBytes(node.size)}
              </span>
            )}
          </div>

          {isFolder && isExpanded && node.children && (
            <div>{renderNodes(node.children, depth + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
      {/* File Tree Left Pane */}
      <div className="border-r border-[#30363d] p-3 flex flex-col">
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-[#8b949e]" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter files by name..."
            className="w-full bg-[#0d1117] border border-[#30363d] focus:border-[#58a6ff] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#e6edf3] placeholder-[#6e7681] focus:outline-none"
          />
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-[#8b949e]">Loading repository files...</div>
        ) : error ? (
          <div className="p-4 text-xs text-[#f85149]">{error}</div>
        ) : (
          <div className="flex-1 overflow-y-auto max-h-[550px] space-y-0.5">
            {renderNodes(rootTree)}
          </div>
        )}
      </div>

      {/* File Content Preview Right Pane */}
      <div className="md:col-span-2 p-4 flex flex-col bg-[#0d1117]">
        {selectedFile ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 border-b border-[#30363d] mb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#e6edf3]">
                <Code2 className="w-4 h-4 text-[#58a6ff]" />
                <span>{selectedFile.path}</span>
              </div>
              <a
                href={`${repo.html_url}/blob/${defaultBranch}/${selectedFile.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#58a6ff] hover:underline flex items-center gap-1"
              >
                <span>View on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {loadingFile ? (
              <div className="p-12 text-center text-xs text-[#8b949e]">Loading file preview...</div>
            ) : (
              <div className="flex-1 overflow-hidden">
                <CodeAndMarkdownViewer
                  filename={selectedFile.path}
                  content={fileContent || ''}
                  filesize={selectedFile.size}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#8b949e] space-y-2">
            <FileText className="w-10 h-10 stroke-1" />
            <p className="text-xs">Select any file from the tree to preview its contents instantly.</p>
          </div>
        )}
      </div>
    </div>
  );
};
