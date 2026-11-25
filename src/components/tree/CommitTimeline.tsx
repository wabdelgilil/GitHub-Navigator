import React from 'react';
import { ExternalLink, Calendar, User } from 'lucide-react';
import { GitHubCommit } from '../../types/github';
import { formatRelativeDate } from '../../lib/utils/formatters';

interface CommitTimelineProps {
  commits: GitHubCommit[];
  defaultBranch: string;
  activeBranch: string;
}

export const CommitTimeline: React.FC<CommitTimelineProps> = ({
  commits,
  defaultBranch,
  activeBranch,
}) => {
  if (commits.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-[#8b949e]">
        No commit records found for this branch.
      </div>
    );
  }

  const isDefault = activeBranch === defaultBranch;
  const branchColor = isDefault ? '#3fb950' : '#58a6ff';

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#30363d]">
      {commits.map((commit) => {
        const authorName = commit.commit.author.name;
        const authorAvatar = commit.author?.avatar_url;
        const dateStr = commit.commit.author.date;
        const messageTitle = commit.commit.message.split('\n')[0];
        const shortSha = commit.sha.substring(0, 7);

        return (
          <div key={commit.sha} className="relative group">
            {/* Visual Node on Git Tree Line */}
            <div
              style={{ borderColor: branchColor }}
              className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#0d1117] border-2 group-hover:scale-125 transition-transform shadow-sm"
            />

            {/* Commit Card */}
            <div className="bg-[#0d1117] hover:bg-[#131922] border border-[#30363d] hover:border-[#58a6ff]/50 rounded-lg p-3 transition-all">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-medium text-[#e6edf3] group-hover:text-[#58a6ff] transition-colors leading-relaxed">
                  {messageTitle}
                </p>

                <a
                  href={commit.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-[#58a6ff] bg-[#161b22] px-2 py-0.5 rounded border border-[#30363d] hover:border-[#58a6ff] transition-colors shrink-0"
                >
                  <span>{shortSha}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              {/* Author & Timestamp Row */}
              <div className="flex items-center justify-between text-[11px] text-[#8b949e] mt-2 pt-2 border-t border-[#30363d]/40">
                <div className="flex items-center gap-2">
                  {authorAvatar ? (
                    <img
                      src={authorAvatar}
                      alt={authorName}
                      className="w-4 h-4 rounded-full border border-[#30363d]"
                    />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                  <span className="font-medium text-[#c9d1d9]">{authorName}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#8b949e]" />
                  <span>{formatRelativeDate(dateStr)}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
