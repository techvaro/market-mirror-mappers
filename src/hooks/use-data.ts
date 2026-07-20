import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService, vendorService, profileService, notificationService } from '../services/mockData';
import { TaskStatus } from '../types';

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.getTasks,
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => taskService.getTaskById(id),
    enabled: !!id,
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) => 
      taskService.updateTaskStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['tasks'], (old: any) => 
        old?.map((t: any) => t.id === variables.id ? { ...t, status: variables.status } : t)
      );
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] });
    },
  });
}

export function useVendors() {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: vendorService.getVendors,
  });
}

export function useVendor(id: string) {
  return useQuery({
    queryKey: ['vendors', id],
    queryFn: () => vendorService.getVendorById(id),
    enabled: !!id,
  });
}

export function useCreateVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: vendorService.createVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
}

export function useUpdateVendorStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: 'approved' | 'rejected'; notes?: string }) =>
      vendorService.updateVendorStatus(id, status, notes),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['vendors'], (old: any) =>
        old?.map((v: any) => v.id === variables.id ? { ...v, status: variables.status } : v)
      );
      queryClient.invalidateQueries({ queryKey: ['vendors', variables.id] });
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: (data, id) => {
      queryClient.setQueryData(['notifications'], (old: any) => 
        old?.map((n: any) => n.id === id ? { ...n, read: true } : n)
      );
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.setQueryData(['notifications'], (old: any) =>
        old?.map((n: any) => ({ ...n, read: true }))
      );
    },
  });
}
