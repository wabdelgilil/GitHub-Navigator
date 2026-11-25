import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  Lock,
  Globe,
  Check,
  Star,
  FolderGit2,
  X,
} from 'lucide-react';
import { GitHubRepo } from '../../types/github';
import { getLanguageColor } from '../../lib/utils/formatters';

interface SearchableRepoSelectProps {
  repositories: GitHubRepo[];
  selectedRepo: GitHubRepo | null;
  onSelectRepo: (repo: GitHubRepo) => void;
  placeholder?: string;
  className?: string;
  width?: string;
}

export const SearchableRepoSelect: React.FC<SearchableRepoSelectProps> = ({
  repositories,
  selectedRepo,
  onSelectRepo,
  placeholder = 'Select a repository...',
  className = '',
  width = 'w-72',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  const filtered = repositories.filter((repo) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    const nameMatch = repo.name.toLowerCase().includes(term);
    const descMatch = (repo.description || '').toLowerCase().includes(term);
    const langMatch = (repo.language || '').toLowerCase().includes(term);
    return nameMatch || descMatch || langMatch;
  });

  return (
    <div ref={containerRef} className={`relative inline-block ${width} ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 bg-[#0d1117] hover:bg-[#161b22] border border-[#30363d] focus:border-[#58a6ff] rounded-lg px-3 py-2 text-xs text-[#e6edf3] font-medium transition-colors shadow-sm text-left"
      >
        <div className="flex items-center gap-2 truncate">
          {selectedRepo ? (
            <>
              {selectedRepo.private ? (
                <Lock className="w-3.5 h-3.5 text-[#e3b341] shrink-0" />
              ) : (
                <Globe className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
              )}
              <span className="font-semibold truncate">{selectedRepo.name}</span>
            </>
          ) : (
            <>
              <FolderGit2 className="w-3.5 h-3.5 text-[#8b949e] shrink-0" />
              <span className="text-[#8b949e]">{placeholder}</span>
            </>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#8b949e] shrink-0 transition-transform ${
            isOpen ? 'rotate-180 text-[#58a6ff]' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown with Instant Search */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-80 sm:w-96 max-w-[90vw] bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col">
          {/* Search Header */}
          <div className="p-2.5 border-b border-[#30363d] bg-[#0d1117]">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 w-3.5 h-3.5 text-[#8b949e]" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search repositories by name, language..."
                className="w-full bg-[#161b22] border border-[#30363d] focus:border-[#58a6ff] rounded-lg pl-8 pr-7 py-1.5 text-xs text-[#e6edf3] placeholder-[#6e7681] focus:outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 p-0.5 text-[#8b949e] hover:text-[#c9d1d9]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* List of Repositories */}
          <div className="max-h-64 overflow-y-auto divide-y divide-[#21262d] p-1">
            {filtered.length === 0 ? (
              <div className="py-8 px-4 text-center text-xs text-[#8b949e]">
                No repositories match <span className="text-[#e6edf3]">"{searchTerm}"</span>
              </div>
            ) : (
              filtered.map((repo) => {
                const isSelected = selectedRepo?.id === repo.id;
                return (
                  <div
                    key={repo.id}
                    onClick={() => {
                      onSelectRepo(repo);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors text-xs ${
                      isSelected
                        ? 'bg-[#1f6feb]/15 text-[#58a6ff]'
                        : 'text-[#c9d1d9] hover:bg-[#21262d] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                      {repo.private ? (
                        <Lock className="w-3.5 h-3.5 text-[#e3b341] shrink-0" />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="font-semibold truncate flex items-center gap-1.5">
                          <span className="truncate">{repo.name}</span>
                          {repo.fork && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#21262d] text-[#bc8cff]">
                              fork
                            </span>
                          )}
                        </div>
                        {repo.description && (
                          <p className="text-[11px] text-[#8b949e] truncate">{repo.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-[11px] text-[#8b949e]">
                      {repo.language && (
                        <div className="flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getLanguageColor(repo.language) }}
                          />
                          <span className="font-mono text-[10px]">{repo.language}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-[#e3b341]" />
                        <span className="font-mono text-[10px]">{repo.stargazers_count}</span>
                      </div>

                      {isSelected && <Check className="w-4 h-4 text-[#58a6ff]" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Count */}
          <div className="px-3 py-1.5 bg-[#0d1117] border-t border-[#30363d] text-[10px] text-[#8b949e] flex items-center justify-between">
            <span>Showing {filtered.length} of {repositories.length} repositories</span>
            <span className="font-mono">Esc to close</span>
          </div>
        </div>
      )}
    </div>
  );
};
