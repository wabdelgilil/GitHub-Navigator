import React, { useState } from 'react';
import {
  GitFork,
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
  Archive,
  FolderSync,
} from 'lucide-react';
import { GitHubRepo } from '../../types/github';
import { useRepos } from '../../context/RepoContext';
import { formatBytes, formatRelativeDate, getLanguageColor } from '../../lib/utils/formatters';
import { Badge } from '../common/Badge';

interface RepoListRowProps {
  repo: GitHubRepo;
  onOpenTagModal: (repo: GitHubRepo) => void;
  onOpenSyncModal: (repo: GitHubRepo) => void;
  onSelectRepoForTree: (repo: GitHubRepo) => void;
}

export const RepoListRow: React.FC<RepoListRowProps> = ({
  repo,
  onOpenTagModal,
  onOpenSyncModal,
  onSelectRepoForTree,
}) => {
  const { metadata, togglePinRepo, customTags } = useRepos();
  const [copied, setCopied] = useState<boolean>(false);

  const isPinned = metadata.pinnedRepoIds.includes(repo.id);
  const assignedTagIds = metadata.customTags[repo.id] || [];
  const assignedTags = customTags.filter((t) => assignedTagIds.includes(t.id));

  const copyCloneCommand = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`git clone ${repo.clone_url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInVSCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `vscode://vscode.git/clone?url=${encodeURIComponent(repo.clone_url)}`;
  };

  return (
    <div
      onClick={() => onSelectRepoForTree(repo)}
      className="group bg-[#161b22] hover:bg-[#1c232f] border border-[#30363d] hover:border-[#58a6ff]/50 rounded-lg p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors cursor-pointer"
    >
      {/* Left Info: Name, description, badges */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePinRepo(repo.id);
            }}
            title={isPinned ? 'Unpin' : 'Pin to top'}
            className={`p-1 rounded transition-colors ${
              isPinned
                ? 'text-[#e3b341]'
                : 'text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current' : ''}`} />
          </button>

          <h3 className="text-sm font-semibold text-[#e6edf3] group-hover:text-[#58a6ff] transition-colors truncate">
            {repo.name}
          </h3>

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

          {repo.fork && (
            <Badge variant="purple" size="sm" className="gap-1">
              <GitFork className="w-2.5 h-2.5" />
              <span>Fork</span>
            </Badge>
          )}

          {repo.archived && (
            <Badge variant="danger" size="sm" className="gap-1">
              <Archive className="w-2.5 h-2.5" />
              <span>Archived</span>
            </Badge>
          )}

          {assignedTags.map((tag) => (
            <span
              key={tag.id}
              style={{ borderColor: `${tag.color}40`, backgroundColor: `${tag.color}15`, color: tag.color }}
              className="text-[10px] font-medium px-2 py-0.2 rounded-full border"
            >
              {tag.name}
            </span>
          ))}
        </div>

        {repo.description && (
          <p className="text-xs text-[#8b949e] truncate pl-6">{repo.description}</p>
        )}
      </div>

      {/* Right Stats & Actions */}
      <div className="flex items-center flex-wrap gap-4 shrink-0 pl-6 md:pl-0 text-xs text-[#8b949e]">
        {repo.language && (
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: getLanguageColor(repo.language) }}
            />
            <span className="font-mono text-[#c9d1d9]">{repo.language}</span>
          </div>
        )}

        <div className="flex items-center gap-1 font-mono">
          <Star className="w-3.5 h-3.5 text-[#e3b341]" />
          <span>{repo.stargazers_count}</span>
        </div>

        <span className="font-mono">{formatBytes(repo.size)}</span>

        <span className="text-[11px] min-w-[70px] text-right">
          {formatRelativeDate(repo.pushed_at || repo.updated_at)}
        </span>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 border-l border-[#30363d] pl-3">
          <button
            onClick={copyCloneCommand}
            title="Copy clone command"
            className="p-1.5 rounded hover:bg-[#21262d] text-[#c9d1d9] hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#3fb950]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={openInVSCode}
            title="Open in VS Code"
            className="p-1.5 rounded hover:bg-[#21262d] text-[#58a6ff] transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenTagModal(repo);
            }}
            title="Manage Labels"
            className="p-1.5 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-[#58a6ff] transition-colors"
          >
            <Tag className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenSyncModal(repo);
            }}
            title="Local Sync Setup"
            className="p-1.5 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-[#3fb950] transition-colors"
          >
            <FolderSync className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectRepoForTree(repo);
            }}
            title="View Branch Tree"
            className="p-1.5 rounded hover:bg-[#21262d] text-[#58a6ff] transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5" />
          </button>

          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
