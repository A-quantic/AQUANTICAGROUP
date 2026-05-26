"use client";

import { useMutation } from "@tanstack/react-query";
import { aiApi } from "@/lib/api-client";
import { toast } from "sonner";

export function useAIChat() {
  return useMutation({
    mutationFn: ({
      message,
      sessionId,
    }: {
      message: string;
      sessionId?: string;
    }) => aiApi.chat(message, sessionId),
    onError: (error) => {
      console.error("AI chat error:", error);
      toast.error("Error al procesar tu mensaje. Intenta de nuevo.");
    },
  });
}

export function useAnalyzeDocument() {
  return useMutation({
    mutationFn: ({
      file,
      documentType,
    }: {
      file: File;
      documentType?: string;
    }) => aiApi.analyzeDocument(file, documentType),
    onSuccess: () => {
      toast.success("Documento analizado exitosamente");
    },
    onError: (error) => {
      console.error("Document analysis error:", error);
      toast.error("Error al analizar el documento");
    },
  });
}

export function useGenerateChecklist() {
  return useMutation({
    mutationFn: ({
      projectType,
      municipality,
    }: {
      projectType: string;
      municipality?: string;
    }) => aiApi.generateChecklist(projectType, municipality),
    onError: (error) => {
      console.error("Checklist generation error:", error);
      toast.error("Error al generar el checklist");
    },
  });
}

export function useDetectMissingDocuments() {
  return useMutation({
    mutationFn: ({
      uploadedDocs,
      projectType,
    }: {
      uploadedDocs: string[];
      projectType: string;
    }) => aiApi.detectMissing(uploadedDocs, projectType),
  });
}
