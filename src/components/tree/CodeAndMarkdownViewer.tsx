import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Prism from 'prismjs';

// Import Prism Theme
import 'prismjs/themes/prism-tomorrow.css';

// Import Common Language Grammars
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-go';

import {
  Copy,
  Check,
  Code2,
  WrapText,
  Download,
  BookOpen,
} from 'lucide-react';
import { formatBytes } from '../../lib/utils/formatters';

interface CodeAndMarkdownViewerProps {
  filename: string;
  content: string;
  filesize?: number;
}

export const CodeAndMarkdownViewer: React.FC<CodeAndMarkdownViewerProps> = ({
  filename,
  content,
  filesize,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [wrapLines, setWrapLines] = useState<boolean>(true);

  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const isMarkdown = ['md', 'markdown', 'mdx'].includes(ext);

  // If Markdown, default to rendered view; user can toggle to raw
  const [viewMode, setViewMode] = useState<'rendered' | 'raw'>(
    isMarkdown ? 'rendered' : 'raw'
  );

  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'tsx',
    js: 'javascript',
    jsx: 'jsx',
    py: 'python',
    json: 'json',
    yml: 'yaml',
    yaml: 'yaml',
    sh: 'bash',
    bash: 'bash',
    md: 'markdown',
    markdown: 'markdown',
    sql: 'sql',
    rs: 'rust',
    go: 'go',
    html: 'html',
    css: 'css',
  };

  const detectedLanguage = languageMap[ext] || 'text';

  const lineCount = useMemo(() => {
    return content.split('\n').length;
  }, [content]);

  // Highlight code lines using Prism
  const highlightedCode = useMemo(() => {
    try {
      const grammar = Prism.languages[detectedLanguage] || Prism.languages.text;
      return Prism.highlight(content, grammar, detectedLanguage);
    } catch {
      return content;
    }
  }, [content, detectedLanguage]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] rounded-xl border border-[#30363d] overflow-hidden shadow-inner">
      {/* Viewer Action Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] shrink-0 text-xs">
        {/* Left: Metadata badges */}
        <div className="flex items-center gap-2">
          <span className="font-mono px-2 py-0.5 rounded bg-[#0d1117] border border-[#30363d] text-[#58a6ff] uppercase font-bold text-[10px]">
            {detectedLanguage}
          </span>
          <span className="text-[#8b949e] font-mono text-[11px]">
            {lineCount} lines
          </span>
          {filesize !== undefined && (
            <>
              <span className="text-[#30363d]">•</span>
              <span className="text-[#8b949e] font-mono text-[11px]">
                {formatBytes(filesize)}
              </span>
            </>
          )}
        </div>

        {/* Right: Controls & Toggles */}
        <div className="flex items-center gap-2">
          {/* Markdown Preview vs Raw Toggle */}
          {isMarkdown && (
            <div className="flex bg-[#0d1117] border border-[#30363d] rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('rendered')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  viewMode === 'rendered'
                    ? 'bg-[#1f6feb] text-white shadow-sm'
                    : 'text-[#8b949e] hover:text-[#c9d1d9]'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span>Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('raw')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  viewMode === 'raw'
                    ? 'bg-[#1f6feb] text-white shadow-sm'
                    : 'text-[#8b949e] hover:text-[#c9d1d9]'
                }`}
              >
                <Code2 className="w-3 h-3" />
                <span>Raw</span>
              </button>
            </div>
          )}

          {/* Line Wrapping Toggle for Code */}
          {viewMode === 'raw' && (
            <button
              type="button"
              onClick={() => setWrapLines(!wrapLines)}
              title="Toggle Line Wrap"
              className={`p-1.5 rounded-lg border transition-colors ${
                wrapLines
                  ? 'bg-[#1f6feb]/20 text-[#58a6ff] border-[#1f6feb]/40'
                  : 'bg-[#0d1117] text-[#8b949e] border-[#30363d] hover:text-white'
              }`}
            >
              <WrapText className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            title="Copy file contents"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white border border-[#30363d] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#3fb950]" />
                <span className="text-[#3fb950] text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            title="Download file locally"
            className="p-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white border border-[#30363d] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Viewer Body */}
      <div className="flex-1 overflow-auto max-h-[520px] p-4 text-xs font-mono">
        {viewMode === 'rendered' && isMarkdown ? (
          /* Rendered Markdown View */
          <article className="prose prose-invert max-w-none text-left space-y-4 font-sans text-xs text-[#c9d1d9] leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-xl font-bold text-white border-b border-[#30363d] pb-2 mt-4 mb-2">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base font-semibold text-white border-b border-[#30363d]/60 pb-1.5 mt-4 mb-2">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-semibold text-[#58a6ff] mt-3 mb-1">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="my-2 leading-relaxed text-[#c9d1d9]">{children}</p>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#58a6ff] hover:underline"
                  >
                    {children}
                  </a>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 my-2 space-y-1 text-[#c9d1d9]">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 my-2 space-y-1 text-[#c9d1d9]">{children}</ol>
                ),
                li: ({ children }) => <li className="my-0.5">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[#1f6feb] pl-3 py-1 my-2 bg-[#161b22]/60 rounded-r text-[#8b949e]">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-3 border border-[#30363d] rounded-lg">
                    <table className="w-full text-left text-xs border-collapse">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-[#161b22] border-b border-[#30363d] text-[#e6edf3]">
                    {children}
                  </thead>
                ),
                tr: ({ children }) => (
                  <tr className="border-b border-[#30363d]/50 hover:bg-[#161b22]/40 transition-colors">
                    {children}
                  </tr>
                ),
                th: ({ children }) => (
                  <th className="py-2 px-3 font-semibold text-[#e6edf3]">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="py-2 px-3 text-[#c9d1d9]">{children}</td>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-[#161b22] text-[#e6edf3] px-1.5 py-0.5 rounded border border-[#30363d] font-mono text-[11px]">
                      {children}
                    </code>
                  ) : (
                    <pre className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 overflow-x-auto text-xs font-mono my-2 text-[#e6edf3]">
                      <code>{children}</code>
                    </pre>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        ) : (
          /* Syntax Highlighted Code with Line Numbers */
          <div className="flex font-mono text-xs leading-relaxed select-text">
            {/* Line Number Gutter */}
            <div className="select-none text-right pr-4 text-[#484f58] border-r border-[#21262d] font-mono text-[11px] shrink-0 leading-relaxed">
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i + 1}>{i + 1}</div>
              ))}
            </div>

            {/* Code Content */}
            <pre
              className={`pl-4 flex-1 m-0 bg-transparent overflow-x-auto font-mono text-xs leading-relaxed ${
                wrapLines ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
              }`}
            >
              <code
                className={`language-${detectedLanguage}`}
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
