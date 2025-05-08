"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, FileText, Users, Leaf, PackageOpen, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"

export default function AdminDashboard() {
  const router = useRouter()
  const { state } = useAppStore()
  const { brigades, investigations, equipment, samples } = state

  return (
    <DashboardLayout role="administrador">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrador</h1>
          <p className="text-muted-foreground">
            Bienvenido al panel de administración del Inventario Forestal Nacional.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="brigades">Brigadas</TabsTrigger>
            <TabsTrigger value="investigations">Investigaciones</TabsTrigger>
            <TabsTrigger value="inventory">Inventario</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Brigadas Activas</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{brigades.filter((b) => b.status === "Activa").length}</div>
                  <p className="text-xs text-muted-foreground">+2 desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Investigaciones en Curso</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {investigations.filter((i) => i.status === "En Proceso").length}
                  </div>
                  <p className="text-xs text-muted-foreground">+1 desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Equipos Registrados</CardTitle>
                  <PackageOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{equipment.length}</div>
                  <p className="text-xs text-muted-foreground">+3 desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Muestras Recolectadas</CardTitle>
                  <Leaf className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{samples.length}</div>
                  <p className="text-xs text-muted-foreground">+12 desde la semana pasada</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>Últimas actividades registradas en el sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Activity className="h-5 w-5 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Brigada "Amazonas" asignada a investigación "Estudio de Biodiversidad Zona Norte"
                        </p>
                        <p className="text-sm text-muted-foreground">Hace 2 horas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Activity className="h-5 w-5 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Nuevo usuario "Carlos Mendoza" registrado como Botánico
                        </p>
                        <p className="text-sm text-muted-foreground">Hace 5 horas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Activity className="h-5 w-5 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Reporte de novedades generado para la investigación "Monitoreo de Especies Endémicas"
                        </p>
                        <p className="text-sm text-muted-foreground">Hace 1 día</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas</CardTitle>
                  <CardDescription>Resumen de actividades del mes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Muestras Recolectadas</span>
                    </div>
                    <span className="font-medium">342</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Usuarios Activos</span>
                    </div>
                    <span className="font-medium">48</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PackageOpen className="h-4 w-4 text-amber-600" />
                      <span className="text-sm">Equipos en Campo</span>
                    </div>
                    <span className="font-medium">156</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="brigades" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Brigadas Activas</CardTitle>
                  <CardDescription>Listado de brigadas actualmente en operación</CardDescription>
                </div>
                <Button onClick={() => router.push("/brigadas")}>
                  Gestionar Brigadas <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {brigades
                    .filter((b) => b.status === "Activa")
                    .slice(0, 3)
                    .map((brigade) => (
                      <div key={brigade.id} className="rounded-md border p-4">
                        <div className="font-medium">{brigade.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {brigade.id}</div>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Miembros:</span> {brigade.members} expertos
                        </div>
                        <div className="mt-1 text-sm">
                          <span className="font-medium">Investigación:</span> {brigade.investigation}
                        </div>
                        <div className="mt-1 text-sm">
                          <span className="font-medium">Estado:</span>{" "}
                          <span className="text-green-600">En Proceso</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investigations" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Investigaciones Activas</CardTitle>
                  <CardDescription>Listado de investigaciones en curso</CardDescription>
                </div>
                <Button onClick={() => router.push("/investigaciones")}>
                  Gestionar Investigaciones <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investigations
                    .filter((i) => i.status === "En Proceso")
                    .slice(0, 3)
                    .map((investigation) => (
                      <div key={investigation.id} className="rounded-md border p-4">
                        <div className="font-medium">{investigation.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {investigation.id}</div>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Brigada Asignada:</span>{" "}
                          {brigades.find((b) => b.id === investigation.brigadeId)?.name || "No asignada"}
                        </div>
                        <div className="mt-1 text-sm">
                          <span className="font-medium">Fecha Inicio:</span>{" "}
                          {investigation.startDate?.split("-").reverse().join("/") || "No iniciada"}
                        </div>
                        <div className="mt-1 text-sm">
                          <span className="font-medium">Estado:</span>{" "}
                          <span className="text-green-600">{investigation.status}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Gestión de Inventario</CardTitle>
                  <CardDescription>Administración de equipos y muestras</CardDescription>
                </div>
                <Button onClick={() => router.push("/inventario")}>
                  Gestionar Inventario <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Equipos Registrados</CardTitle>
                      <PackageOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{equipment.length}</div>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Funcionales:</span>
                          <span className="font-medium">
                            {equipment.filter((e) => e.status === "Funcional").length}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Requieren atención:</span>
                          <span className="font-medium">
                            {equipment.filter((e) => e.status !== "Funcional").length}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Muestras Recolectadas</CardTitle>
                      <Leaf className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{samples.length}</div>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Registradas:</span>
                          <span className="font-medium">{samples.filter((s) => s.status === "Registrada").length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Procesadas:</span>
                          <span className="font-medium">{samples.filter((s) => s.status === "Procesada").length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-4">
                  <h3 className="mb-2 font-medium">Equipos por Brigada</h3>
                  <div className="space-y-2">
                    {brigades
                      .filter((b) => b.status === "Activa")
                      .map((brigade) => {
                        const brigadeEquipment = equipment.filter(
                          (e) =>
                            e.assignedTo.includes(brigade.name) ||
                            brigade.memberIds?.some((memberId) => {
                              const member =
                                state.users.find((u) => u.id === memberId) ||
                                state.experts.find((e) => e.id === memberId)
                              return member && e.assignedTo.includes(member.name)
                            }),
                        )

                        return (
                          <div key={brigade.id} className="flex justify-between rounded-md border p-3">
                            <span>{brigade.name}</span>
                            <span className="font-medium">{brigadeEquipment.length} equipos</span>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
