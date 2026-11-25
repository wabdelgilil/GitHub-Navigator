import React from 'react';
import { GitBranch } from 'lucide-react';
import { GitHubBranch } from '../../types/github';

interface VisualBranchNetworkProps {
  branches: GitHubBranch[];
  defaultBranch: string;
  selectedBranch: string;
  onSelectBranch: (branchName: string) => void;
}

const TRACK_COLORS = [
  '#38bdf8', // Sky Blue
  '#a855f7', // Purple
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
];

export const VisualBranchNetwork: React.FC<VisualBranchNetworkProps> = ({
  branches,
  defaultBranch,
  selectedBranch,
  onSelectBranch,
}) => {
  const otherBranches = branches.filter((b) => b.name !== defaultBranch);

  const startX = 60;
  const mainSpineY = 50;
  const trackHeight = 65;
  const svgWidth = Math.max(750, 400 + otherBranches.length * 40);
  const svgHeight = Math.max(220, (otherBranches.length + 1) * trackHeight + 60);

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 overflow-x-auto shadow-inner">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#21262d] text-xs">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-[#3fb950]" />
          <span className="font-semibold text-[#e6edf3]">Visual Branching Topology</span>
        </div>
        <span className="text-[11px] text-[#8b949e]">Click any branch track or node to inspect</span>
      </div>

      <svg width={svgWidth} height={svgHeight} className="select-none font-mono">
        <defs>
          <linearGradient id="mainSpineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#238636" />
            <stop offset="100%" stopColor="#3fb950" />
          </linearGradient>
        </defs>

        {/* --- Default Branch Main Spine --- */}
        <line
          x1={startX}
          y1={mainSpineY}
          x2={svgWidth - 40}
          y2={mainSpineY}
          stroke="url(#mainSpineGrad)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Main Branch Base Node */}
        <circle cx={startX} cy={mainSpineY} r="7" fill="#238636" stroke="#0d1117" strokeWidth="2.5" />
        <circle cx={startX} cy={mainSpineY} r="3" fill="#ffffff" />

        {/* Main Branch Label Badge */}
        <g
          onClick={() => onSelectBranch(defaultBranch)}
          className="cursor-pointer transition-opacity hover:opacity-80"
        >
          <rect
            x={startX + 25}
            y={mainSpineY - 14}
            width={defaultBranch.length * 8 + 65}
            height="26"
            rx="6"
            fill={selectedBranch === defaultBranch ? '#238636' : '#161b22'}
            stroke={selectedBranch === defaultBranch ? '#3fb950' : '#30363d'}
            strokeWidth="1.5"
          />
          <text
            x={startX + 35}
            y={mainSpineY + 3}
            fill="#ffffff"
            fontSize="11"
            fontWeight="bold"
          >
            {defaultBranch} (default)
          </text>
        </g>

        {/* Sample Trunk Commits on Main */}
        {[180, 280, 380, 480, 580].map((cx, idx) => (
          <g key={idx} className="group">
            <circle
              cx={cx}
              cy={mainSpineY}
              r="4.5"
              fill="#3fb950"
              stroke="#0d1117"
              strokeWidth="1.5"
              className="transition-transform hover:scale-125"
            />
          </g>
        ))}

        {/* --- Diverging Branches --- */}
        {otherBranches.map((branch, index) => {
          const trackY = mainSpineY + (index + 1) * trackHeight;
          const branchColor = TRACK_COLORS[index % TRACK_COLORS.length];
          const isSelected = selectedBranch === branch.name;
          const forkStartX = 120 + index * 45;
          const curveMidX = forkStartX + 45;
          const trackEndX = svgWidth - 60;

          return (
            <g
              key={branch.name}
              onClick={() => onSelectBranch(branch.name)}
              className="cursor-pointer group"
            >
              {/* Divergence Fork Curve (Bézier Curve branching off from Main) */}
              <path
                d={`M ${forkStartX} ${mainSpineY} C ${curveMidX} ${mainSpineY}, ${curveMidX - 10} ${trackY}, ${curveMidX + 35} ${trackY} L ${trackEndX} ${trackY}`}
                fill="none"
                stroke={branchColor}
                strokeWidth={isSelected ? '3.5' : '2'}
                strokeDasharray={isSelected ? 'none' : '4 2'}
                className="transition-all"
              />

              {/* Divergence Fork Point Node */}
              <circle
                cx={forkStartX}
                cy={mainSpineY}
                r="4.5"
                fill={branchColor}
                stroke="#0d1117"
                strokeWidth="1.5"
              />

              {/* Branch Track Commit Nodes */}
              {[curveMidX + 70, curveMidX + 150, curveMidX + 230].map((cx, cIdx) => (
                <circle
                  key={cIdx}
                  cx={cx}
                  cy={trackY}
                  r={isSelected ? 5 : 3.5}
                  fill={branchColor}
                  stroke="#0d1117"
                  strokeWidth="1.5"
                />
              ))}

              {/* Branch Terminal Pill / Label */}
              <rect
                x={curveMidX + 45}
                y={trackY - 13}
                width={Math.max(90, branch.name.length * 8 + 35)}
                height="24"
                rx="6"
                fill={isSelected ? `${branchColor}25` : '#161b22'}
                stroke={isSelected ? branchColor : '#30363d'}
                strokeWidth={isSelected ? '2' : '1'}
                className="transition-colors group-hover:stroke-white"
              />

              <text
                x={curveMidX + 57}
                y={trackY + 3}
                fill={isSelected ? '#ffffff' : '#c9d1d9'}
                fontSize="11"
                fontWeight={isSelected ? 'bold' : 'normal'}
              >
                {branch.name}
              </text>

              {/* Protected Branch Indicator */}
              {branch.protected && (
                <circle cx={curveMidX + 48} cy={trackY - 8} r="3" fill="#388bfd" />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
