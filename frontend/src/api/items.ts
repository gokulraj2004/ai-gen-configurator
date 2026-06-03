/**
 * EXAMPLE API - Demonstrates API call patterns with Axios.
 * DELETE this file and create your own domain API calls.
 */
import client from './client';
import type { Item, Tag, CreateItemRequest, UpdateItemRequest, CreateTagRequest } from '../types/examples';

export interface ItemListResponse {
  items: Item[];
  total: number;
}

export const itemsApi = {
  getAll: async (): Promise<ItemListResponse> => {
    const response = await client.get<ItemListResponse>('/items');
    return response.data;
  },

  getById: async (id: string): Promise<Item> => {
    const response = await client.get<Item>(`/items/${id}`);
    return response.data;
  },

  create: async (data: CreateItemRequest): Promise<Item> => {
    const response = await client.post<Item>('/items', data);
    return response.data;
  },

  update: async (id: string, data: UpdateItemRequest): Promise<Item> => {
    const response = await client.put<Item>(`/items/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/items/${id}`);
  },
};

export const tagsApi = {
  getAll: async (): Promise<Tag[]> => {
    const response = await client.get<Tag[]>('/tags');
    return response.data;
  },

  create: async (data: CreateTagRequest): Promise<Tag> => {
    const response = await client.post<Tag>('/tags', data);
    return response.data;
  },
};