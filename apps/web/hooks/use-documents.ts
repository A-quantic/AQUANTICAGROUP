"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { documentsApi, Document } from "@/lib/api-client";
import { toast } from "sonner";

export const documentsKeys = {
  all: ["documents"] as const,
  lists: () => [...documentsKeys.all, "list"] as const,
  list: (filters?: Record<string, any>) =>
    [...documentsKeys.lists(), { filters }] as const,
  details: () => [...documentsKeys.all, "detail"] as const,
  detail: (id: string) => [...documentsKeys.details(), id] as const,
};

export function useDocuments(filters?: {
  projectId?: string;
  expedienteId?: string;
  category?: string;
}) {
  return useQuery({
    queryKey: documentsKeys.list(filters),
    queryFn: async () => {
      const response = await documentsApi.list(filters);
      return response.documents || [];
    },
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      metadata,
    }: {
      file: File;
      metadata?: {
        projectId?: string;
        expedienteId?: string;
        category?: string;
      };
    }) => documentsApi.upload(file, metadata),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: documentsKeys.list({
          projectId: variables.metadata?.projectId,
          expedienteId: variables.metadata?.expedienteId,
        }),
      });
      toast.success("Documento subido exitosamente");
    },
    onError: (error) => {
      console.error("Error uploading document:", error);
      toast.error("Error al subir el documento");
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: documentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentsKeys.lists() });
      toast.success("Documento eliminado");
    },
    onError: (error) => {
      console.error("Error deleting document:", error);
      toast.error("Error al eliminar el documento");
    },
  });
}
