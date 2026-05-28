"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi, Project } from "@/lib/api-client";
import { toast } from "sonner";

export const projectsKeys = {
  all: ["projects"] as const,
  lists: () => [...projectsKeys.all, "list"] as const,
  list: (filters?: Record<string, any>) =>
    [...projectsKeys.lists(), { filters }] as const,
  details: () => [...projectsKeys.all, "detail"] as const,
  detail: (id: string) => [...projectsKeys.details(), id] as const,
  documents: (id: string) =>
    [...projectsKeys.detail(id), "documents"] as const,
  timeline: (id: string) =>
    [...projectsKeys.detail(id), "timeline"] as const,
};

export function useProjects() {
  return useQuery({
    queryKey: projectsKeys.lists(),
    queryFn: async () => {
      console.log("[useProjects] Fetching projects...");
      try {
        const response = await projectsApi.list();
        console.log("[useProjects] Response:", response);
        return response.projects || [];
      } catch (error) {
        console.error("[useProjects] Error:", error);
        throw error;
      }
    },
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectsKeys.detail(id),
    queryFn: async () => {
      const response = await projectsApi.get(id);
      return response;
    },
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
      toast.success("Proyecto creado exitosamente");
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      toast.error("Error al crear el proyecto");
    },
  });
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Project>) => projectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
      toast.success("Proyecto actualizado");
    },
    onError: (error) => {
      console.error("Error updating project:", error);
      toast.error("Error al actualizar el proyecto");
    },
  });
}

export function useProjectDocuments(id: string) {
  return useQuery({
    queryKey: projectsKeys.documents(id),
    queryFn: async () => {
      const response = await projectsApi.getDocuments(id);
      return response.documents || [];
    },
    enabled: !!id,
  });
}

export function useProjectTimeline(id: string) {
  return useQuery({
    queryKey: projectsKeys.timeline(id),
    queryFn: async () => {
      const response = await projectsApi.getTimeline(id);
      return response.events || [];
    },
    enabled: !!id,
  });
}
