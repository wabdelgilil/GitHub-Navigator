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
} from 'lucide-react';
import { GitHubRepo } from '../../types/github';
import { useRepos } from '../../context/RepoContext';
import { formatBytes, formatRelativeDate, getLanguageColor } from '../../lib/utils/formatters';
import { Badge } from '../common/Badge';

interface RepoCardProps {
  repo: GitHubRepo;
  onOpenTagModal: (repo: GitHubRepo) => void;
  onSelectRepoForTree: (repo: GitHubRepo) => void;
}

export const RepoCard: React.FC<RepoCardProps> = ({
  repo,
  onOpenTagModal,
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
      className="group relative bg-[#161b22] hover:bg-[#1a212d] border border-[#30363d] hover:border-[#58a6ff]/50 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
    >
      <div>
        {/* Header Badges & Actions */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center flex-wrap gap-1.5">
            {repo.private ? (
              <Badge variant="warning" size="sm" className="gap-1">
                <Lock className="w-3 h-3" />
                <span>Private</span>
              </Badge>
            ) : (
              <Badge variant="success" size="sm" className="gap-1">
                <Globe className="w-3 h-3" />
                <span>Public</span>
              </Badge>
            )}

            {repo.fork && (
              <Badge variant="purple" size="sm" className="gap-1">
                <GitFork className="w-3 h-3" />
                <span>Fork</span>
              </Badge>
            )}

            {repo.archived && (
              <Badge variant="danger" size="sm" className="gap-1">
                <Archive className="w-3 h-3" />
                <span>Archived</span>
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePinRepo(repo.id);
              }}
              title={isPinned ? 'Unpin repository' : 'Pin to top of catalog'}
              className={`p-1.5 rounded-lg transition-colors ${
                isPinned
                  ? 'text-[#e3b341] bg-[#e3b341]/10'
                  : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenTagModal(repo);
              }}
              title="Manage custom labels"
              className="p-1.5 rounded-lg text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#21262d] transition-colors"
            >
              <Tag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Repo Title & Description */}
        <div className="mb-3">
          <h3 className="text-base font-semibold text-[#e6edf3] group-hover:text-[#58a6ff] transition-colors truncate">
            {repo.name}
          </h3>
          <p className="text-xs text-[#8b949e] line-clamp-2 mt-1.5 min-h-[2rem]">
            {repo.description || 'No description provided.'}
          </p>
        </div>

        {/* Assigned Custom Tags */}
        {assignedTags.length > 0 && (
          <div className="flex items-center flex-wrap gap-1.5 mb-3">
            {assignedTags.map((tag) => (
              <span
                key={tag.id}
                style={{ borderColor: `${tag.color}40`, backgroundColor: `${tag.color}15`, color: tag.color }}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Metadata & Shortcuts */}
      <div className="pt-3 border-t border-[#30363d]/60 mt-2">
        <div className="flex items-center justify-between text-xs text-[#8b949e] mb-3">
          <div className="flex items-center gap-3">
            {repo.language && (
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: getLanguageColor(repo.language) }}
                />
                <span className="font-mono text-[#c9d1d9]">{repo.language}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#e3b341]" />
              <span>{repo.stargazers_count}</span>
            </div>
            <span>{formatBytes(repo.size)}</span>
          </div>

          <span title={repo.pushed_at}>Pushed {formatRelativeDate(repo.pushed_at || repo.updated_at)}</span>
        </div>

        {/* Quick Operations Row */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#30363d]/40">
          <div className="flex items-center gap-1.5">
            <button
              onClick={copyCloneCommand}
              title="Copy git clone command"
              className="px-2 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white text-[11px] font-mono flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-[#3fb950]" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Clone'}</span>
            </button>

            <button
              onClick={openInVSCode}
              title="Clone & Open in VS Code (Local protocol)"
              className="px-2 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white text-[11px] flex items-center gap-1 transition-colors"
            >
              <Code2 className="w-3 h-3 text-[#58a6ff]" />
              <span>VS Code</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectRepoForTree(repo);
              }}
              title="View Interactive Git Branch Tree"
              className="px-2.5 py-1 rounded bg-[#1f6feb]/20 hover:bg-[#1f6feb]/30 text-[#58a6ff] text-[11px] font-medium flex items-center gap-1 transition-colors"
            >
              <GitBranch className="w-3 h-3" />
              <span>Tree</span>
            </button>

            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Open repository on GitHub"
              className="p-1 rounded text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
