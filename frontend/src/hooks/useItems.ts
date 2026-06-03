/**
 * EXAMPLE HOOK - Demonstrates React Query patterns.
 * DELETE this file and create your own domain hooks.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemsApi, tagsApi } from '../api/items';
import type { CreateItemRequest, UpdateItemRequest, CreateTagRequest } from '../types/examples';

export const useItems = () => {
  return useQuery({
    queryKey: ['items'],
    queryFn: () => itemsApi.getAll(),
  });
};

export const useItem = (id: string) => {
  return useQuery({
    queryKey: ['items', id],
    queryFn: () => itemsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateItemRequest) => itemsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateItemRequest }) => itemsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => itemsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsApi.getAll(),
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTagRequest) => tagsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};