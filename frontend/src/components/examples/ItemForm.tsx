/**
 * EXAMPLE COMPONENT - Demonstrates form with validation patterns.
 * DELETE this file and create your own domain components.
 */
import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Item, Tag, CreateItemRequest } from '../../types/examples';
import { useTags } from '../../hooks/useItems';

interface ItemFormProps {
  item?: Item;
  onSubmit: (data: CreateItemRequest) => Promise<void>;
  onCancel?: () => void;
}

export const ItemForm: React.FC<ItemFormProps> = ({ item, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(item?.tags.map((t) => t.id) || []);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data: tags } = useTags();

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description || '');
      setSelectedTags(item.tags.map((t) => t.id));
    }
  }, [item]);

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        tag_ids: selectedTags.length > 0 ? selectedTags : undefined,
      });
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter item title"
        required
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter item description (optional)"
          rows={4}
          className="input-field resize-none"
        />
      </div>
      {tags && tags.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: Tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag.id)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex space-x-3">
        <Button type="submit" isLoading={isLoading}>
          {item ? 'Update' : 'Create'} Item
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};