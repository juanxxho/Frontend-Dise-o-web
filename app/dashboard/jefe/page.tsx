"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react"

export default function JefeDashboard() {
  return (
    <DashboardLayout role="jefe">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Jefe de Brigada</h1>
          <p className="text-muted-foreground">
            Bienvenido al panel de control de jefe de brigada del Inventario Forestal Nacional.
          </p>
        </div>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-green-800">Investigación Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-bold text-xl">Estudio de Biodiversidad Zona Norte</h3>
                <p className="text-sm text-muted-foreground">ID: INV-001</p>
                <p className="text-sm text-muted-foreground">Brigada: Amazonas</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progreso</span>
                  <span className="font-medium">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="tareas" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tareas">Tareas</TabsTrigger>
            <TabsTrigger value="equipo">Equipo</TabsTrigger>
            <TabsTrigger value="inventario">Inventario</TabsTrigger>
          </TabsList>

          <TabsContent value="tareas" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Novedades Reportadas</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tareas Asignadas</CardTitle>
                <CardDescription>Listado de tareas asignadas a los miembros de la brigada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="font-medium">Recolectar muestras en la zona norte</div>
                    <div className="text-sm text-muted-foreground">ID: TASK-001</div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Asignado a:</span> María López (Botánico)
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Fecha límite:</span> 25/04/2024
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Estado:</span> <span className="text-amber-600">En Proceso</span>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="font-medium">Documentar especies encontradas en sector A-3</div>
                    <div className="text-sm text-muted-foreground">ID: TASK-002</div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Asignado a:</span> Carlos Mendoza (Botánico)
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Fecha límite:</span> 26/04/2024
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Estado:</span> <span className="text-amber-600">En Proceso</span>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="font-medium">Registro fotográfico de la zona de estudio</div>
                    <div className="text-sm text-muted-foreground">ID: TASK-003</div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Asignado a:</span> Pedro Suárez (Auxiliar Técnico)
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Fecha límite:</span> 24/04/2024
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Estado:</span> <span className="text-green-600">Completada</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-green-700 hover:bg-green-800">Asignar Nueva Tarea</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="equipo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Miembros de la Brigada</CardTitle>
                <CardDescription>Integrantes de la Brigada Amazonas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="font-medium">Juan Pérez</div>
                    <div className="text-sm text-muted-foreground">ID: USR-001</div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Rol:</span> Jefe de Brigada
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Email:</span> juan.perez@ejemplo.com
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Teléfono:</span> +123 456 7890
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="font-medium">María López</div>
                    <div className="text-sm text-muted-foreground">ID: USR-002</div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Rol:</span> Botánico
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Email:</span> maria.lopez@ejemplo.com
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Teléfono:</span> +123 456 7891
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="font-medium">Carlos Mendoza</div>
                    <div className="text-sm text-muted-foreground">ID: USR-003</div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Rol:</span> Botánico
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Email:</span> carlos.mendoza@ejemplo.com
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Teléfono:</span> +123 456 7892
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="font-medium">Pedro Suárez</div>
                    <div className="text-sm text-muted-foreground">ID: USR-004</div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Rol:</span> Auxiliar Técnico
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Email:</span> pedro.suarez@ejemplo.com
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Teléfono:</span> +123 456 7893
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventario" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventario de Equipos</CardTitle>
                <CardDescription>Equipos asignados a la brigada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="font-medium">GPS Garmin eTrex 30x</div>
                    <div className="text-sm text-muted-foreground">ID: EQ-001</div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Estado:</span> Funcional
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Asignado a:</span> Juan Pérez
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="font-medium">Cámara Digital Canon EOS</div>
                    <div className="text-sm text-muted-foreground">ID: EQ-002</div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Estado:</span> Funcional
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Asignado a:</span> Pedro Suárez
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="font-medium">Kit de Recolección Botánica</div>
                    <div className="text-sm text-muted-foreground">ID: EQ-003</div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Estado:</span> Funcional
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Asignado a:</span> María López
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="font-medium">Kit de Recolección Botánica</div>
                    <div className="text-sm text-muted-foreground">ID: EQ-004</div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Estado:</span> Funcional
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Asignado a:</span> Carlos Mendoza
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="font-medium">Tablet Samsung Galaxy Tab</div>
                    <div className="text-sm text-muted-foreground">ID: EQ-005</div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Estado:</span> Batería baja
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Asignado a:</span> Brigada (Compartido)
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button className="w-full bg-green-700 hover:bg-green-800">Verificar Inventario</Button>
                <Button variant="outline" className="w-full">
                  Reportar Novedad
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
