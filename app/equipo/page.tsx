"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAppStore } from "@/lib/store"
import { Mail, Phone, User } from "lucide-react"

export default function EquipoPage() {
  const { state } = useAppStore()
  const { experts } = state

  // Filtrar expertos por rol para mostrarlos organizados
  const jefes = experts.filter((expert) => expert.role === "Jefe de Brigada")
  const botanicos = experts.filter((expert) => expert.role === "Botánico")
  const auxiliares = experts.filter((expert) => expert.role === "Auxiliar Técnico")

  return (
    <DashboardLayout role="jefe">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Equipo de Trabajo</h1>
          <p className="text-muted-foreground">Miembros del equipo asignados a la brigada.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Miembros de la Brigada</CardTitle>
            <CardDescription>Integrantes actuales de la brigada y sus roles</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {experts.map((expert) => (
                  <TableRow key={expert.id}>
                    <TableCell className="font-medium">{expert.id}</TableCell>
                    <TableCell>{expert.name}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          expert.role === "Jefe de Brigada"
                            ? "bg-blue-100 text-blue-800"
                            : expert.role === "Botánico"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {expert.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      {expert.email || `${expert.name.toLowerCase().replace(" ", ".")}@ejemplo.com`}
                    </TableCell>
                    <TableCell>{expert.phone || "No disponible"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Ver Perfil
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Jefe de Brigada</CardTitle>
              <CardDescription>Líder del equipo de trabajo</CardDescription>
            </CardHeader>
            <CardContent>
              {jefes.map((jefe) => (
                <div key={jefe.id} className="rounded-md border p-4 mb-4 last:mb-0">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{jefe.name}</h3>
                      <p className="text-sm text-muted-foreground">{jefe.id}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{jefe.email || `${jefe.name.toLowerCase().replace(" ", ".")}@ejemplo.com`}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{jefe.phone || "No disponible"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Botánicos</CardTitle>
              <CardDescription>Especialistas en identificación de especies</CardDescription>
            </CardHeader>
            <CardContent>
              {botanicos.map((botanico) => (
                <div key={botanico.id} className="rounded-md border p-4 mb-4 last:mb-0">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{botanico.name}</h3>
                      <p className="text-sm text-muted-foreground">{botanico.id}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{botanico.email || `${botanico.name.toLowerCase().replace(" ", ".")}@ejemplo.com`}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{botanico.phone || "No disponible"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Auxiliares Técnicos</CardTitle>
              <CardDescription>Apoyo técnico y logístico</CardDescription>
            </CardHeader>
            <CardContent>
              {auxiliares.map((auxiliar) => (
                <div key={auxiliar.id} className="rounded-md border p-4 mb-4 last:mb-0">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{auxiliar.name}</h3>
                      <p className="text-sm text-muted-foreground">{auxiliar.id}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{auxiliar.email || `${auxiliar.name.toLowerCase().replace(" ", ".")}@ejemplo.com`}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{auxiliar.phone || "No disponible"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
