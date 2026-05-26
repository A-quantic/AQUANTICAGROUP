"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leadsApi } from "@/lib/api-client";
import { toast } from "sonner";

export const leadsKeys = {
  all: ["leads"] as const,
  lists: () => [...leadsKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...leadsKeys.lists(), { filters }] as const,
  details: () => [...leadsKeys.all, "detail"] as const,
  detail: (id: string) => [...leadsKeys.details(), id] as const,
};

export function useLeads() {
  return useQuery({
    queryKey: leadsKeys.lists(),
    queryFn: async () => {
      const response = await leadsApi.list();
      return response.leads || [];
    },
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leadsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadsKeys.lists() });
      toast.success("¡Mensaje enviado! Te contactaremos pronto.");
    },
    onError: (error) => {
      console.error("Error creating lead:", error);
      toast.error("Hubo un error al enviar tu mensaje. Intenta de nuevo.");
    },
  });
}
