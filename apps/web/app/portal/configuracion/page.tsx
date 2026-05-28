"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail, Shield, User } from "lucide-react";

export default function ConfiguracionPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    proyectos: true,
    documentos: false,
    marketing: false,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white">
          Configuración
        </h1>
        <p className="text-muted-foreground mt-1">
          Gestiona tus preferencias y configuración de cuenta
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Notificaciones */}
        <Card className="bg-navy/50 border-gold/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-gold" />
              <CardTitle className="text-white">Notificaciones</CardTitle>
            </div>
            <CardDescription className="text-white/60">
              Elige cómo quieres recibir actualizaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Notificaciones por email</Label>
                <p className="text-sm text-white/60">Recibe resúmenes semanales</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, email: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Actualizaciones de proyectos</Label>
                <p className="text-sm text-white/60">Cambios de estado y avances</p>
              </div>
              <Switch
                checked={notifications.proyectos}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, proyectos: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Nuevos documentos</Label>
                <p className="text-sm text-white/60">Cuando se suban archivos</p>
              </div>
              <Switch
                checked={notifications.documentos}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, documentos: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Seguridad */}
        <Card className="bg-navy/50 border-gold/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold" />
              <CardTitle className="text-white">Seguridad</CardTitle>
            </div>
            <CardDescription className="text-white/60">
              Gestiona la seguridad de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Autenticación de dos factores</Label>
                <p className="text-sm text-white/60">Añade una capa extra de seguridad</p>
              </div>
              <Button variant="outline" size="sm" className="border-gold/30 text-gold hover:bg-gold/10">
                Configurar
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Cambiar contraseña</Label>
                <p className="text-sm text-white/60">Actualiza tu contraseña regularmente</p>
              </div>
              <Button variant="outline" size="sm" className="border-gold/30 text-gold hover:bg-gold/10">
                Cambiar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Perfil */}
        <Card className="bg-navy/50 border-gold/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gold" />
              <CardTitle className="text-white">Información de Perfil</CardTitle>
            </div>
            <CardDescription className="text-white/60">
              Gestiona tus datos personales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Editar perfil</Label>
                <p className="text-sm text-white/60">Actualiza tu información personal</p>
              </div>
              <Button variant="outline" size="sm" className="border-gold/30 text-gold hover:bg-gold/10">
                Editar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
