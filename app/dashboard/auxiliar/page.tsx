"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/lib/store"
import { Camera, CheckCircle2, Clock, PackageOpen } from "lucide-react"

export default function AuxiliarDashboard() {
  const { state } = useAppStore()
  const { tasks, equipment, photos, currentUser } = state

  // Filtrar tareas asignadas al auxiliar técnico
  const myTasks = tasks.filter((task) => {
    if (currentUser && currentUser.name) {
      return task.assignedTo.toLowerCase().includes(currentUser.name.toLowerCase())
    }
    return task.assignedTo.includes("Pedro") || task.assignedTo.includes("Auxiliar")
  })

  const pendingTasks = myTasks.filter((task) => task.status === "Pendiente")
  const inProgressTasks = myTasks.filter((task) => task.status === "En Proceso")
  const completedTasks = myTasks.filter((task) => task.status === "Completada")

  // Calcular progreso
  const totalTasks = myTasks.length
  const completedPercentage = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0

  return (
    <DashboardLayout role="auxiliar">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Auxiliar Técnico</h1>
          <p className="text-muted-foreground">
            Bienvenido al panel de control de auxiliar técnico del Inventario Forestal Nacional.
          </p>
        </div>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-green-800">Progreso de Tareas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Progreso General</span>
                <span className="font-medium">{Math.round(completedPercentage)}%</span>
              </div>
              <Progress value={completedPercentage} className="h-2" />
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Pendientes: {pendingTasks.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm">En Proceso: {inProgressTasks.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Completadas: {completedTasks.length}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tareas Asignadas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myTasks.length}</div>
              <p className="text-xs text-muted-foreground">Total de tareas asignadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fotografías Registradas</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{photos.length}</div>
              <p className="text-xs text-muted-foreground">Fotografías en el sistema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipos a Cargo</CardTitle>
              <PackageOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {equipment.filter((e) => e.assignedTo.includes("Pedro") || e.assignedTo.includes("Auxiliar")).length}
              </div>
              <p className="text-xs text-muted-foreground">Equipos bajo su responsabilidad</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tareas" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tareas">Tareas Asignadas</TabsTrigger>
            <TabsTrigger value="equipos">Equipos</TabsTrigger>
            <TabsTrigger value="fotos">Registro Fotográfico</TabsTrigger>
          </TabsList>

          <TabsContent value="tareas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mis Tareas</CardTitle>
                <CardDescription>Listado de tareas asignadas a usted</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myTasks.length > 0 ? (
                    myTasks.map((task) => (
                      <div key={task.id} className="rounded-md border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-muted-foreground">ID: {task.id}</div>
                            <div className="mt-2 text-sm">
                              <span className="font-medium">Fecha límite:</span> {task.dueDate}
                            </div>
                            <div className="mt-1 text-sm">
                              <span className="font-medium">Estado:</span>{" "}
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  task.status === "Completada"
                                    ? "bg-green-100 text-green-800"
                                    : task.status === "En Proceso"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {task.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {task.status !== "Completada" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Actualizar estado de la tarea
                                }}
                              >
                                Marcar como Completada
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No hay tareas pendientes</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Todas las tareas han sido completadas o no tiene tareas asignadas.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equipos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Equipos Asignados</CardTitle>
                <CardDescription>Equipos bajo su responsabilidad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {equipment
                    .filter((e) => e.assignedTo.includes("Pedro") || e.assignedTo.includes("Auxiliar"))
                    .map((item) => (
                      <div key={item.id} className="rounded-md border p-4">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {item.id}</div>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Tipo:</span> {item.type}
                        </div>
                        <div className="mt-1 text-sm">
                          <span className="font-medium">Estado:</span>{" "}
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              item.status === "Funcional"
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <div className="mt-1 text-sm">
                          <span className="font-medium">Condición:</span>{" "}
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              item.condition === "Bueno" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {item.condition}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fotos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Registro Fotográfico</CardTitle>
                <CardDescription>Fotografías registradas por usted</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="rounded-md border overflow-hidden">
                      <div className="aspect-video relative">
                        <img
                          src={photo.thumbnail || "/placeholder.svg"}
                          alt={photo.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium">{photo.title}</h3>
                        <p className="text-sm text-muted-foreground">ID: {photo.id}</p>
                        <p className="text-sm mt-2">
                          <span className="font-medium">Ubicación:</span> {photo.location}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Fecha:</span> {photo.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
