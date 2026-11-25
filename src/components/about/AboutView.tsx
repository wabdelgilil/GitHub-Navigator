import React from 'react';
import {
  ExternalLink,
  ShieldCheck,
  Star,
  GitFork,
  Bug,
  Code2,
  Layers,
  Heart,
  Search,
  Table,
  GitBranch,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const AboutView: React.FC = () => {
  const REPO_URL = 'https://github.com/wabdelgilil/GitHub-Navigator';
  const ISSUES_URL = `${REPO_URL}/issues`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Hero Header */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 text-center space-y-5 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#38bdf8]/10 via-[#1f6feb]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-center">
          <Logo size={84} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              GitHub-Navigator
            </h1>
            <Badge variant="success" size="md">v1.1.0</Badge>
          </div>
          <p className="text-sm text-[#8b949e] max-w-xl mx-auto leading-relaxed">
            The Executive Dashboard & Navigation Center for GitHub. A local-first workspace manager
            designed for developers to organize repositories, visualize branches, and navigate accounts without friction.
          </p>
        </div>

        {/* GitHub Direct Links Row */}
        <div className="flex items-center justify-center flex-wrap gap-3 pt-2">
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="md" leftIcon={<Star className="w-4 h-4 fill-current" />}>
              Star on GitHub
            </Button>
          </a>

          <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" size="md" leftIcon={<GitFork className="w-4 h-4" />}>
              Fork Repository
            </Button>
          </a>

          <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="md" leftIcon={<Bug className="w-4 h-4" />}>
              Report an Issue
            </Button>
          </a>
        </div>
      </div>

      {/* Why GitHub-Navigator? Problem & Solution */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-[#e6edf3] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#58a6ff]" />
          <span>Why GitHub-Navigator?</span>
        </h3>
        <p className="text-xs text-[#8b949e] leading-relaxed">
          GitHub’s default repository interface is structured for social browsing and basic listings,
          often leaving developers overwhelmed when managing tens or hundreds of repositories.
          Finding private repos, tracking stale projects, comparing diverging branches, and creating personal
          groupings requires repetitive navigation.
        </p>
        <p className="text-xs text-[#8b949e] leading-relaxed">
          <strong className="text-[#c9d1d9]">GitHub-Navigator</strong> bridges this gap by providing an executive
          command center that runs entirely in your browser with instantaneous client-side search, multi-mode catalog views,
          interactive branch divergence trees, and workspace hygiene audits.
        </p>
      </div>

      {/* Core Architectural Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/15 text-[#38bdf8] flex items-center justify-center">
            <Table className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-white">Default Table & Multi-Mode Views</h4>
          <p className="text-xs text-[#8b949e] leading-relaxed">
            Sort repositories effortlessly by name, stars, disk size, and last active date. Switch anytime
            between Data Table, Compact List, or Rich Cards.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#3fb950]/15 text-[#3fb950] flex items-center justify-center">
            <GitBranch className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-white">Visual Branch Divergence</h4>
          <p className="text-xs text-[#8b949e] leading-relaxed">
            Interactive SVG tree displaying how each branch departs from the main trunk, calculating exact
            ahead and behind commit counts with real-time commit flows.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#a855f7]/15 text-[#a855f7] flex items-center justify-center">
            <Search className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-white">Multi-Vector Fuzzy Search</h4>
          <p className="text-xs text-[#8b949e] leading-relaxed">
            Sub-millisecond instant search across repository titles, descriptions, programming languages,
            and custom tags with zero page reload latency.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#e3b341]/15 text-[#e3b341] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-white">100% Local-First Security</h4>
          <p className="text-xs text-[#8b949e] leading-relaxed">
            Your Personal Access Token resides strictly in your browser’s localStorage. Zero intermediary servers,
            zero analytics, and zero data leakage.
          </p>
        </div>
      </div>

      {/* Tech Stack & Specification */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-[#e6edf3] flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#58a6ff]" />
          <span>Technology & Open Source Standards</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] space-y-1">
            <span className="text-[#8b949e] text-[10px] uppercase font-mono">Framework</span>
            <p className="font-semibold text-white">React 18 & Vite</p>
          </div>
          <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] space-y-1">
            <span className="text-[#8b949e] text-[10px] uppercase font-mono">Language</span>
            <p className="font-semibold text-white">TypeScript (Strict)</p>
          </div>
          <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] space-y-1">
            <span className="text-[#8b949e] text-[10px] uppercase font-mono">Styling</span>
            <p className="font-semibold text-white">Tailwind CSS</p>
          </div>
          <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] space-y-1">
            <span className="text-[#8b949e] text-[10px] uppercase font-mono">License</span>
            <p className="font-semibold text-[#3fb950]">MIT Open Source</p>
          </div>
        </div>
      </div>

      {/* Footer Community Banner */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-[#161b22] to-[#1a2332] border border-[#30363d] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-semibold text-white flex items-center gap-1.5 justify-center sm:justify-start">
            <span>Built for the Developer Community</span>
            <Heart className="w-3.5 h-3.5 text-[#f85149] fill-current" />
          </h4>
          <p className="text-xs text-[#8b949e]">
            GitHub-Navigator is free and open-source. Contributions, PRs, and suggestions are welcome.
          </p>
        </div>

        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-semibold border border-[#30363d] hover:border-[#58a6ff] transition-all shrink-0"
        >
          <span>github.com/wabdelgilil/GitHub-Navigator</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#58a6ff]" />
        </a>
      </div>
    </div>
  );
};
