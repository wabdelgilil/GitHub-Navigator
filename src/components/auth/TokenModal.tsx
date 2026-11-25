import React, { useState } from 'react';
import { KeyRound, ShieldCheck, AlertCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TokenModal: React.FC<TokenModalProps> = ({ isOpen, onClose }) => {
  const { setToken, token } = useAuth();
  const [inputVal, setInputVal] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) {
      setFormError('Please provide a valid GitHub Personal Access Token.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const success = await setToken(inputVal.trim());
    setSubmitting(false);

    if (success) {
      setInputVal('');
      onClose();
    } else {
      setFormError('Authentication failed. Please verify the token permissions and try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Connect GitHub Account"
      description="Authorize OctoDeck with your GitHub Personal Access Token (PAT)"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3.5 text-xs text-[#8b949e] space-y-2">
          <div className="flex items-center gap-2 text-[#58a6ff] font-medium">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>100% Local-First Security Protocol</span>
          </div>
          <p>
            Your token never leaves your browser. It communicates directly with the GitHub API
            and is saved exclusively in your local browser storage.
          </p>
          <div className="flex items-center gap-1.5 pt-1">
            <span>Required Token Scopes:</span>
            <code className="text-[#3fb950] bg-[#161b22] px-1 py-0.5 rounded">repo</code>
            <code className="text-[#3fb950] bg-[#161b22] px-1 py-0.5 rounded">read:user</code>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#c9d1d9] mb-1.5">
            Personal Access Token
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-[#8b949e]" />
            <input
              type="password"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or github_pat_..."
              className="w-full bg-[#0d1117] border border-[#30363d] focus:border-[#58a6ff] rounded-lg pl-9 pr-3 py-2 text-sm text-[#e6edf3] placeholder-[#6e7681] focus:outline-none"
            />
          </div>
          {formError && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-[#f85149]">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <a
            href="https://github.com/settings/tokens/new?scopes=repo,read:user&description=OctoDeck%20Portal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#58a6ff] hover:underline"
          >
            <span>Generate New Token on GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-2">
            {token && (
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              Connect
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
