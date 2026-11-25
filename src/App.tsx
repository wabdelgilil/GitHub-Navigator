import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useRepos } from './context/RepoContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { RepoCatalog } from './components/catalog/RepoCatalog';
import { BranchTree } from './components/tree/BranchTree';
import { HygieneRadar } from './components/radar/HygieneRadar';
import { SettingsView } from './components/settings/SettingsView';
import { AboutView } from './components/about/AboutView';
import { LocalSyncView } from './components/sync/LocalSyncView';
import { TokenModal } from './components/auth/TokenModal';
import { Button } from './components/common/Button';
import {
  KeyRound,
  ShieldCheck,
  Zap,
  GitBranch,
} from 'lucide-react';
import { Logo } from './components/common/Logo';
import { GitHubRepo } from './types/github';

export const App: React.FC = () => {
  const { token } = useAuth();
  const {
    searchQuery,
    setSearchQuery,
    refreshRepositories,
    isLoading,
    activeFilter,
    setActiveFilter,
    workspaceStats,
    setSelectedRepo,
  } = useRepos();

  const [currentTab, setCurrentTab] = useState<string>('repositories');
  const [isTokenModalOpen, setIsTokenModalOpen] = useState<boolean>(false);

  const handleSelectRepoForTree = (repo: GitHubRepo) => {
    setSelectedRepo(repo);
    setCurrentTab('tree');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-[#e6edf3]">
      {/* Top Global Navigation Bar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefreshRepos={() => refreshRepositories(true)}
        isRefreshing={isLoading}
      />

      <div className="flex-1 flex">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={{
            total: workspaceStats.totalRepos,
            public: workspaceStats.publicCount,
            private: workspaceStats.privateCount,
            forks: workspaceStats.forkCount,
            stale: workspaceStats.staleCount,
          }}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {currentTab === 'about' ? (
            <AboutView />
          ) : currentTab === 'sync' ? (
            <LocalSyncView />
          ) : !token ? (
            /* Welcome / Onboarding Hero State */
            <div className="py-12 space-y-8 max-w-3xl mx-auto text-center">
              <div className="flex justify-center">
                <Logo size={72} />
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                  Take Control of Your GitHub Universe
                </h1>
                <p className="text-sm text-[#8b949e] max-w-xl mx-auto leading-relaxed">
                  GitNavigator is a local-first personal command center that organizes your repositories,
                  visualizes branch divergence, flags stale projects, and gives you instant search with zero latency.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<KeyRound className="w-4 h-4" />}
                  onClick={() => setIsTokenModalOpen(true)}
                >
                  Connect GitHub Account
                </Button>
              </div>

              {/* Feature Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 text-left">
                <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#58a6ff]/15 text-[#58a6ff] flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Instant Fuzzy Search</h3>
                  <p className="text-xs text-[#8b949e] leading-relaxed">
                    Filter by name, topic, language, and custom labels in milliseconds without pagination.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#bc8cff]/15 text-[#bc8cff] flex items-center justify-center">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Visual Branch Tree</h3>
                  <p className="text-xs text-[#8b949e] leading-relaxed">
                    Interactive divergence radar calculating ahead/behind commits and collapsible file tree.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#3fb950]/15 text-[#3fb950] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">100% Local & Safe</h3>
                  <p className="text-xs text-[#8b949e] leading-relaxed">
                    Your token is stored only in your browser storage. Zero telemetry, zero external servers.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Authenticated Dynamic Views */
            <div>
              {currentTab === 'repositories' && (
                <RepoCatalog onSelectRepoForTree={handleSelectRepoForTree} />
              )}
              {currentTab === 'tree' && <BranchTree />}
              {currentTab === 'radar' && <HygieneRadar />}
              {currentTab === 'tags' && (
                <RepoCatalog onSelectRepoForTree={handleSelectRepoForTree} />
              )}
              {currentTab === 'sync' && <LocalSyncView />}
              {currentTab === 'settings' && <SettingsView />}
            </div>
          )}
        </main>
      </div>

      <TokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
      />
    </div>
  );
};
