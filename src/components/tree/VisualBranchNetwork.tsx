import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  GitBranch,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Move,
  Search,
  Layers,
} from 'lucide-react';
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom & Pan State
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [branchFilter, setBranchFilter] = useState<string>('');

  const otherBranches = branches.filter((b) => b.name !== defaultBranch);
  const filteredOtherBranches = otherBranches.filter((b) =>
    b.name.toLowerCase().includes(branchFilter.toLowerCase().trim())
  );

  const startX = 60;
  const mainSpineY = 60;
  const trackHeight = 75;
  const svgWidth = Math.max(900, 500 + filteredOtherBranches.length * 50);
  const svgHeight = Math.max(300, (filteredOtherBranches.length + 1) * trackHeight + 80);

  // Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag with left click and not on interactive buttons
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom Handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(2.5, +(prev + 0.15).toFixed(2)));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.4, +(prev - 0.15).toFixed(2)));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 20, y: 20 });
    setBranchFilter('');
  };

  // Wheel Zoom support
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((prev) => Math.min(2.5, Math.max(0.4, +(prev + delta).toFixed(2))));
    } else {
      // Natural trackpad pan
      setPan((prev) => ({
        x: prev.x - e.deltaX * 0.8,
        y: prev.y - e.deltaY * 0.8,
      }));
    }
  };

  // Fullscreen Handlers
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      if (containerRef.current && containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
    } else {
      setIsFullscreen(false);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  return (
    <div
      ref={containerRef}
      className={`relative bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden transition-all select-none shadow-2xl flex flex-col ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none w-screen h-screen'
          : 'h-[460px] w-full'
      }`}
    >
      {/* Top Professional Control Bar */}
      <div className="z-10 bg-[#161b22]/90 backdrop-blur-md border-b border-[#30363d] px-4 py-2.5 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#3fb950]" />
            <span className="font-semibold text-xs text-[#e6edf3]">Visual Branch Network</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-[#0d1117] border border-[#30363d] rounded-md px-2 py-1 text-[11px] text-[#8b949e]">
            <Layers className="w-3 h-3 text-[#58a6ff]" />
            <span>{branches.length} Branches</span>
          </div>

          {/* Quick Branch Search Input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1.5 w-3 h-3 text-[#8b949e]" />
            <input
              type="text"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              placeholder="Find branch in tree..."
              className="bg-[#0d1117] border border-[#30363d] focus:border-[#58a6ff] rounded-md pl-7 pr-2.5 py-1 text-xs text-[#e6edf3] placeholder-[#6e7681] focus:outline-none w-36 sm:w-48 transition-all"
            />
          </div>
        </div>

        {/* Floating Controls HUD: Zoom, Reset, Fullscreen */}
        <div className="flex items-center gap-1.5">
          {/* Zoom Percentage Pill */}
          <span className="font-mono text-[11px] text-[#c9d1d9] bg-[#0d1117] border border-[#30363d] px-2 py-1 rounded-md">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            title="Zoom In (Ctrl + Scroll Up)"
            className="p-1.5 rounded-md bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleZoomOut}
            title="Zoom Out (Ctrl + Scroll Down)"
            className="p-1.5 rounded-md bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleReset}
            title="Reset Pan & Zoom"
            className="p-1.5 rounded-md bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-[#30363d] mx-1" />

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen View'}
            className="p-1.5 rounded-md bg-[#1f6feb]/20 hover:bg-[#1f6feb]/30 text-[#58a6ff] transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Interactive Canvas Viewport (Supports Drag-to-Pan and Zoom) */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={`flex-1 w-full h-full overflow-hidden relative ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Subtle Guidance Floating Watermark */}
        <div className="absolute bottom-3 left-3 pointer-events-none z-10 flex items-center gap-1.5 text-[10px] text-[#8b949e] bg-[#0d1117]/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-[#30363d]/40">
          <Move className="w-3 h-3 text-[#58a6ff]" />
          <span>Click & Drag to pan • Ctrl + Scroll to zoom</span>
        </div>

        {/* Scaled & Panned SVG Layer */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.08s ease-out',
          }}
          className="absolute inset-0 w-max h-max pointer-events-auto"
        >
          <svg width={svgWidth} height={svgHeight} className="font-mono select-none">
            <defs>
              {/* Grid Background Pattern */}
              <pattern id="gridPattern" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="15" cy="15" r="1" fill="#21262d" />
              </pattern>

              <linearGradient id="mainSpineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#238636" />
                <stop offset="100%" stopColor="#3fb950" />
              </linearGradient>
            </defs>

            {/* Background Grid */}
            <rect width={svgWidth} height={svgHeight} fill="url(#gridPattern)" />

            {/* --- Main Spine Track (Default Branch) --- */}
            <line
              x1={startX}
              y1={mainSpineY}
              x2={svgWidth - 60}
              y2={mainSpineY}
              stroke="url(#mainSpineGrad)"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Main Branch Base Anchor Node */}
            <circle cx={startX} cy={mainSpineY} r="7" fill="#238636" stroke="#0d1117" strokeWidth="2.5" />
            <circle cx={startX} cy={mainSpineY} r="3" fill="#ffffff" />

            {/* Default Branch Label Badge */}
            <g
              onClick={() => onSelectBranch(defaultBranch)}
              className="cursor-pointer transition-opacity hover:opacity-90"
            >
              <rect
                x={startX + 25}
                y={mainSpineY - 14}
                width={defaultBranch.length * 8 + 75}
                height="28"
                rx="7"
                fill={selectedBranch === defaultBranch ? '#238636' : '#161b22'}
                stroke={selectedBranch === defaultBranch ? '#3fb950' : '#30363d'}
                strokeWidth="1.5"
              />
              <text
                x={startX + 37}
                y={mainSpineY + 4}
                fill="#ffffff"
                fontSize="11"
                fontWeight="bold"
              >
                {defaultBranch} (default)
              </text>
            </g>

            {/* Milestone Nodes on Default Branch */}
            {[200, 320, 440, 560, 680, 800].map((cx, idx) => (
              <circle
                key={idx}
                cx={cx}
                cy={mainSpineY}
                r="4.5"
                fill="#3fb950"
                stroke="#0d1117"
                strokeWidth="2"
                className="transition-transform hover:scale-150"
              />
            ))}

            {/* --- Diverging Branches with Curved Bézier Tracks --- */}
            {filteredOtherBranches.map((branch, index) => {
              const trackY = mainSpineY + (index + 1) * trackHeight;
              const branchColor = TRACK_COLORS[index % TRACK_COLORS.length];
              const isSelected = selectedBranch === branch.name;
              const forkStartX = 140 + index * 40;
              const curveMidX = forkStartX + 50;
              const trackEndX = svgWidth - 80;

              return (
                <g
                  key={branch.name}
                  onClick={() => onSelectBranch(branch.name)}
                  className="cursor-pointer group"
                >
                  {/* Divergence Fork Curve */}
                  <path
                    d={`M ${forkStartX} ${mainSpineY} C ${curveMidX} ${mainSpineY}, ${curveMidX - 10} ${trackY}, ${curveMidX + 35} ${trackY} L ${trackEndX} ${trackY}`}
                    fill="none"
                    stroke={branchColor}
                    strokeWidth={isSelected ? '3.5' : '2'}
                    strokeDasharray={isSelected ? 'none' : '4 2'}
                    className="transition-all"
                  />

                  {/* Fork Divergence Anchor Node */}
                  <circle
                    cx={forkStartX}
                    cy={mainSpineY}
                    r="4.5"
                    fill={branchColor}
                    stroke="#0d1117"
                    strokeWidth="1.5"
                  />

                  {/* Branch Commit Track Nodes */}
                  {[curveMidX + 70, curveMidX + 160, curveMidX + 250].map((cx, cIdx) => (
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

                  {/* Branch Terminal Pill Button */}
                  <rect
                    x={curveMidX + 45}
                    y={trackY - 14}
                    width={Math.max(100, branch.name.length * 8 + 40)}
                    height="26"
                    rx="7"
                    fill={isSelected ? `${branchColor}30` : '#161b22'}
                    stroke={isSelected ? branchColor : '#30363d'}
                    strokeWidth={isSelected ? '2' : '1'}
                    className="transition-all group-hover:stroke-white"
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

                  {/* Protected Branch Shield Dot */}
                  {branch.protected && (
                    <circle cx={curveMidX + 48} cy={trackY - 8} r="3" fill="#388bfd" />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
