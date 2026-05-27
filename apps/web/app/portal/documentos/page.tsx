"use client";

import { useState, useCallback } from "react";
import { useDocuments, useUploadDocument } from "@/hooks/use-documents";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDropzone } from "react-dropzone";
import {
  FileText,
  Upload,
  Loader2,
  File,
  Image,
  Download,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const documentCategories = [
  { value: "IDENTIDAD", label: "Identidad", icon: FileText },
  { value: "REGISTRO", label: "Registro", icon: FileText },
  { value: "SERVICIOS", label: "Servicios", icon: FileText },
  { value: "PLANOS", label: "Planos", icon: Image },
  { value: "DECLARACIONES", label: "Declaraciones", icon: FileText },
  { value: "MUNICIPAL", label: "Municipal", icon: FileText },
  { value: "OTROS", label: "Otros", icon: File },
];

export default function DocumentosPage() {
  const { data: documents, isLoading } = useDocuments();
  const uploadDocument = useUploadDocument();
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        setUploadingFiles((prev) => [...prev, file.name]);
        try {
          await uploadDocument.mutateAsync({
            file,
            metadata: { category: "OTROS" },
          });
        } finally {
          setUploadingFiles((prev) =>
            prev.filter((name) => name !== file.name)
          );
        }
      }
    },
    [uploadDocument]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const getCategoryLabel = (category: string) => {
    return (
      documentCategories.find((c) => c.value === category)?.label || category
    );
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return Image;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white">
          Mis Documentos
        </h1>
        <p className="text-white/50 mt-1">
          Gestiona y sube documentos de tu proyecto
        </p>
      </div>

      {/* Upload Area */}
      <Card className="bg-navy-mid border-gold/10">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-gold bg-gold/5"
                : "border-white/20 hover:border-gold/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gold mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-gold font-medium">Suelta los archivos aquí</p>
            ) : (
              <>
                <p className="text-white font-medium mb-2">
                  Arrastra archivos aquí o haz clic para seleccionar
                </p>
                <p className="text-sm text-white/50">
                  PDF, imágenes, Word (máx. 10MB)
                </p>
              </>
            )}
          </div>

          {uploadingFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadingFiles.map((fileName) => (
                <div
                  key={fileName}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                >
                  <Loader2 className="w-5 h-5 text-gold animate-spin" />
                  <span className="text-sm text-white">{fileName}</span>
                  <span className="text-xs text-white/50">Subiendo...</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card className="bg-navy-mid border-gold/10">
        <CardHeader>
          <CardTitle className="text-white font-serif">
            Documentos Subidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          ) : documents && documents.length > 0 ? (
            <div className="space-y-3">
              {documents.map((doc: any) => {
                const Icon = getFileIcon(doc.mimeType);
                return (
                  <div
                    key={doc.id}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">
                        {doc.name}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-white/50">
                        <span>{getCategoryLabel(doc.category)}</span>
                        <span>•</span>
                        <span>{formatFileSize(doc.fileSize)}</span>
                        <span>•</span>
                        <span>
                          {format(new Date(doc.createdAt), "dd MMM yyyy", {
                            locale: es,
                          })}
                        </span>
                      </div>
                      {doc.aiSummary && (
                        <p className="text-xs text-gold/70 mt-1 line-clamp-1">
                          {doc.aiSummary}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="icon">
                          <Download className="w-4 h-4 text-white/60" />
                        </Button>
                      </a>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <File className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-white mb-1">
                No hay documentos
              </h3>
              <p className="text-white/50 text-sm">
                Sube tus primeros documentos usando el área de carga arriba
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
