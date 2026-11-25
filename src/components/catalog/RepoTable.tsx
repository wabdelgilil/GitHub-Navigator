import React, { useState } from 'react';
import {
  Star,
  Lock,
  Globe,
  Pin,
  Tag,
  Copy,
  Check,
  ExternalLink,
  Code2,
  GitBranch,
  ArrowUpDown,
} from 'lucide-react';
import { GitHubRepo } from '../../types/github';
import { useRepos } from '../../context/RepoContext';
import { formatBytes, formatRelativeDate, getLanguageColor } from '../../lib/utils/formatters';
import { Badge } from '../common/Badge';

interface RepoTableProps {
  repositories: GitHubRepo[];
  onOpenTagModal: (repo: GitHubRepo) => void;
  onSelectRepoForTree: (repo: GitHubRepo) => void;
}

export const RepoTable: React.FC<RepoTableProps> = ({
  repositories,
  onOpenTagModal,
  onSelectRepoForTree,
}) => {
  const { metadata, togglePinRepo, customTags, sortField, setSortField, sortOrder, setSortOrder } = useRepos();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const copyClone = (e: React.MouseEvent, repo: GitHubRepo) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`git clone ${repo.clone_url}`);
    setCopiedId(repo.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openVSCode = (e: React.MouseEvent, repo: GitHubRepo) => {
    e.stopPropagation();
    window.location.href = `vscode://vscode.git/clone?url=${encodeURIComponent(repo.clone_url)}`;
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0d1117] border-b border-[#30363d] text-[#8b949e] uppercase font-semibold text-[11px]">
              <th className="py-3 px-4 w-10 text-center">Pin</th>
              <th
                onClick={() => handleSort('name')}
                className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Repository</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Visibility</th>
              <th className="py-3 px-4">Language</th>
              <th
                onClick={() => handleSort('stars')}
                className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Stars</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('size')}
                className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Disk Size</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('pushed_at')}
                className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Last Active</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#30363d]/60 text-[#c9d1d9]">
            {repositories.map((repo) => {
              const isPinned = metadata.pinnedRepoIds.includes(repo.id);
              const assignedTagIds = metadata.customTags[repo.id] || [];
              const assignedTags = customTags.filter((t) => assignedTagIds.includes(t.id));

              return (
                <tr
                  key={repo.id}
                  onClick={() => onSelectRepoForTree(repo)}
                  className="hover:bg-[#1c232f] cursor-pointer transition-colors group"
                >
                  {/* Pin Column */}
                  <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => togglePinRepo(repo.id)}
                      className={`p-1 rounded ${
                        isPinned ? 'text-[#e3b341]' : 'text-[#8b949e] hover:text-[#c9d1d9]'
                      }`}
                    >
                      <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current' : ''}`} />
                    </button>
                  </td>

                  {/* Repository Name & Tags */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#e6edf3] group-hover:text-[#58a6ff] transition-colors">
                      {repo.name}
                    </div>
                    {repo.description && (
                      <p className="text-[11px] text-[#8b949e] truncate max-w-xs">{repo.description}</p>
                    )}
                    {assignedTags.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        {assignedTags.map((tag) => (
                          <span
                            key={tag.id}
                            style={{ borderColor: `${tag.color}40`, backgroundColor: `${tag.color}15`, color: tag.color }}
                            className="text-[9px] font-medium px-1.5 py-0.2 rounded-full border"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Visibility Badge */}
                  <td className="py-3 px-4">
                    {repo.private ? (
                      <Badge variant="warning" size="sm" className="gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Private</span>
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm" className="gap-1">
                        <Globe className="w-2.5 h-2.5" />
                        <span>Public</span>
                      </Badge>
                    )}
                  </td>

                  {/* Language */}
                  <td className="py-3 px-4">
                    {repo.language ? (
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: getLanguageColor(repo.language) }}
                        />
                        <span className="font-mono text-[11px]">{repo.language}</span>
                      </div>
                    ) : (
                      <span className="text-[#8b949e] text-[11px]">—</span>
                    )}
                  </td>

                  {/* Stars */}
                  <td className="py-3 px-4 font-mono">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#e3b341]" />
                      <span>{repo.stargazers_count}</span>
                    </div>
                  </td>

                  {/* Disk Size */}
                  <td className="py-3 px-4 font-mono text-[11px]">{formatBytes(repo.size)}</td>

                  {/* Last Active */}
                  <td className="py-3 px-4 text-[11px] text-[#8b949e]">
                    {formatRelativeDate(repo.pushed_at || repo.updated_at)}
                  </td>

                  {/* Quick Action Icons */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => copyClone(e, repo)}
                        title="Copy Clone Command"
                        className="p-1 rounded hover:bg-[#21262d] text-[#c9d1d9]"
                      >
                        {copiedId === repo.id ? (
                          <Check className="w-3.5 h-3.5 text-[#3fb950]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={(e) => openVSCode(e, repo)}
                        title="Open in VS Code"
                        className="p-1 rounded hover:bg-[#21262d] text-[#58a6ff]"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onOpenTagModal(repo)}
                        title="Custom Labels"
                        className="p-1 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-[#58a6ff]"
                      >
                        <Tag className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onSelectRepoForTree(repo)}
                        title="Branch Tree"
                        className="p-1 rounded hover:bg-[#21262d] text-[#58a6ff]"
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open in GitHub"
                        className="p-1 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-white"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
