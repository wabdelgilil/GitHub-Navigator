import React, { useState } from 'react';
import {
  Search,
  KeyRound,
  RefreshCw,
  LogOut,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { TokenModal } from '../auth/TokenModal';
import { Logo } from '../common/Logo';

interface NavbarProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
  onRefreshRepos: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchChange,
  searchQuery,
  onRefreshRepos,
  isRefreshing,
}) => {
  const { user, rateLimit, logout, token } = useAuth();
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-[#161b22]/90 backdrop-blur-md border-b border-[#30363d] px-6 flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <Logo size={36} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base">GitNavigator</span>
              <Badge variant="success" size="sm">Local-First</Badge>
            </div>
            <p className="text-[10px] text-[#8b949e] font-mono leading-none">Executive Command Center</p>
          </div>
        </div>

        {/* Global Instant Search */}
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#8b949e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Instant Search across repositories, languages, topics, or descriptions... (Press '/' to focus)"
              className="w-full bg-[#0d1117] border border-[#30363d] focus:border-[#58a6ff] rounded-lg pl-10 pr-4 py-2 text-xs text-[#e6edf3] placeholder-[#6e7681] focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-2.5 text-xs text-[#8b949e] hover:text-[#c9d1d9]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions & Account State */}
        <div className="flex items-center gap-3 shrink-0">
          {rateLimit && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0d1117] border border-[#30363d] text-xs text-[#8b949e]">
              <Zap className="w-3.5 h-3.5 text-[#e3b341]" />
              <span>Quota:</span>
              <span className="font-mono text-[#c9d1d9] font-medium">
                {rateLimit.remaining} / {rateLimit.limit}
              </span>
            </div>
          )}

          {token && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onRefreshRepos}
              isLoading={isRefreshing}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
              title="Refresh repository cache"
            >
              Sync
            </Button>
          )}

          {user ? (
            <div className="flex items-center gap-2.5 pl-2 border-l border-[#30363d]">
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group"
              >
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-8 h-8 rounded-full border border-[#30363d] group-hover:border-[#58a6ff] transition-colors"
                />
                <div className="hidden md:block text-left">
                  <div className="text-xs font-medium text-[#c9d1d9] group-hover:text-white flex items-center gap-1">
                    {user.name || user.login}
                    <ExternalLink className="w-2.5 h-2.5 text-[#8b949e]" />
                  </div>
                  <div className="text-[10px] text-[#8b949e] font-mono">@{user.login}</div>
                </div>
              </a>

              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                title="Disconnect Account"
                className="text-[#f85149] hover:bg-[#da3633]/15"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<KeyRound className="w-3.5 h-3.5" />}
              onClick={() => setIsTokenModalOpen(true)}
            >
              Connect Token
            </Button>
          )}
        </div>
      </header>

      <TokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
      />
    </>
  );
};
