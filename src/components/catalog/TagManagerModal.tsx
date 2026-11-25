import React, { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { GitHubRepo } from '../../types/github';
import { useRepos } from '../../context/RepoContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface TagManagerModalProps {
  repo: GitHubRepo | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TagManagerModal: React.FC<TagManagerModalProps> = ({
  repo,
  isOpen,
  onClose,
}) => {
  const { customTags, metadata, assignTagsToRepo, createCustomTag, deleteCustomTag } = useRepos();
  const [newTagName, setNewTagName] = useState<string>('');
  const [newTagColor, setNewTagColor] = useState<string>('#38bdf8');

  if (!repo) return null;

  const currentAssigned = metadata.customTags[repo.id] || [];

  const handleToggleTag = (tagId: string) => {
    const isAssigned = currentAssigned.includes(tagId);
    const updated = isAssigned
      ? currentAssigned.filter((id) => id !== tagId)
      : [...currentAssigned, tagId];
    assignTagsToRepo(repo.id, updated);
  };

  const handleCreateNewTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    createCustomTag({
      name: newTagName.trim(),
      color: newTagColor,
    });
    setNewTagName('');
  };

  const PRESET_COLORS = ['#38bdf8', '#4ade80', '#facc15', '#f87171', '#c084fc', '#fb923c'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Custom Labels for ${repo.name}`}
      description="Organize your repositories with personal local-first tags and groupings."
    >
      <div className="space-y-6">
        {/* Existing Tags Toggle */}
        <div>
          <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2.5">
            Assign Labels
          </label>
          <div className="grid grid-cols-2 gap-2">
            {customTags.map((tag) => {
              const isSelected = currentAssigned.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => handleToggleTag(tag.id)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition-all text-left ${
                    isSelected
                      ? 'border-[#58a6ff] bg-[#1f6feb]/15 text-[#e6edf3]'
                      : 'border-[#30363d] bg-[#0d1117] text-[#8b949e] hover:border-[#8b949e]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="truncate">{tag.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#58a6ff] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Create New Custom Tag */}
        <form onSubmit={handleCreateNewTag} className="pt-4 border-t border-[#30363d] space-y-3">
          <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
            Create New Custom Label
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="e.g., Client Work, Study, Tools..."
              className="flex-1 bg-[#0d1117] border border-[#30363d] focus:border-[#58a6ff] rounded-lg px-3 py-1.5 text-xs text-[#e6edf3] placeholder-[#6e7681] focus:outline-none"
            />
            <Button type="submit" variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Add
            </Button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-[#8b949e]">Color:</span>
            {PRESET_COLORS.map((color) => (
              <button
                type="button"
                key={color}
                onClick={() => setNewTagColor(color)}
                style={{ backgroundColor: color }}
                className={`w-5 h-5 rounded-full transition-transform ${
                  newTagColor === color ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </form>

        {/* Manage & Delete Existing Tags */}
        <div className="pt-4 border-t border-[#30363d] space-y-2">
          <span className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
            Manage Custom Labels
          </span>
          <div className="space-y-1 max-h-36 overflow-y-auto">
            {customTags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
                  <span className="text-[#c9d1d9]">{tag.name}</span>
                </div>
                <button
                  onClick={() => deleteCustomTag(tag.id)}
                  className="text-[#8b949e] hover:text-[#f85149] p-1 transition-colors"
                  title="Delete tag"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
