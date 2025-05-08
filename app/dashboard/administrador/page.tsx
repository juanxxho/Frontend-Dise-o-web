"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, AlertTriangle, FileText, Users, Leaf, PackageOpen } from "lucide-react"

export default function AdminDashboard() {
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
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Brigadas Activas</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Investigaciones en Curso</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">+1 desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Novedades Reportadas</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+5 desde la semana pasada</p>
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
              <CardHeader>
                <CardTitle>Brigadas Activas</CardTitle>
                <CardDescription>Listado de brigadas actualmente en operación</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="font-medium">Brigada Amazonas</div>
                    <div className="text-sm text-muted-foreground">ID: BRG-001</div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Miembros:</span> 3 expertos
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Investigación:</span> Estudio de Biodiversidad Zona Norte
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Estado:</span> <span className="text-green-600">En Proceso</span>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="font-medium">Brigada Sierra Central</div>
                    <div className="text-sm text-muted-foreground">ID: BRG-002</div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Miembros:</span> 3 expertos
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Investigación:</span> Monitoreo de Especies Endémicas
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Estado:</span> <span className="text-green-600">En Proceso</span>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="font-medium">Brigada Costa Pacífica</div>
                    <div className="text-sm text-muted-foreground">ID: BRG-003</div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Miembros:</span> 3 expertos
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Investigación:</span> Inventario Manglar Costero
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Estado:</span> <span className="text-green-600">En Proceso</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investigations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Investigaciones Activas</CardTitle>
                <CardDescription>Listado de investigaciones en curso</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="font-medium">Estudio de Biodiversidad Zona Norte</div>
                    <div className="text-sm text-muted-foreground">ID: INV-001</div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Brigada Asignada:</span> Amazonas
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Fecha Inicio:</span> 15/03/2024
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Estado:</span> <span className="text-green-600">En Proceso</span>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="font-medium">Monitoreo de Especies Endémicas</div>
                    <div className="text-sm text-muted-foreground">ID: INV-002</div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Brigada Asignada:</span> Sierra Central
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Fecha Inicio:</span> 02/04/2024
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Estado:</span> <span className="text-green-600">En Proceso</span>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="font-medium">Inventario Manglar Costero</div>
                    <div className="text-sm text-muted-foreground">ID: INV-003</div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Brigada Asignada:</span> Costa Pacífica
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Fecha Inicio:</span> 10/04/2024
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Estado:</span> <span className="text-green-600">En Proceso</span>
                    </div>
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
