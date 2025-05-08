"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/lib/store"
import { CheckCircle2, Clock, Leaf } from "lucide-react"

export default function BotanicoDashboard() {
  const { state } = useAppStore()
  const { tasks, samples, currentUser } = state

  // Filtrar tareas asignadas al botánico
  const myTasks = tasks.filter((task) => {
    if (currentUser && currentUser.name) {
      return task.assignedTo.toLowerCase().includes(currentUser.name.toLowerCase())
    }
    return (
      task.assignedTo.includes("María") || task.assignedTo.includes("Carlos") || task.assignedTo.includes("Botánico")
    )
  })

  const pendingTasks = myTasks.filter((task) => task.status === "Pendiente")
  const inProgressTasks = myTasks.filter((task) => task.status === "En Proceso")
  const completedTasks = myTasks.filter((task) => task.status === "Completada")

  // Calcular progreso
  const totalTasks = myTasks.length
  const completedPercentage = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0

  // Filtrar muestras recolectadas por el botánico
  const mySamples = samples.filter(
    (sample) => sample.collector.includes("María") || sample.collector.includes("Carlos"),
  )

  return (
    <DashboardLayout role="botanico">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Botánico</h1>
          <p className="text-muted-foreground">
            Bienvenido al panel de control de botánico del Inventario Forestal Nacional.
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
              <CardTitle className="text-sm font-medium">Muestras Recolectadas</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mySamples.length}</div>
              <p className="text-xs text-muted-foreground">Muestras registradas por usted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Formularios Completados</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Formularios detallados completados</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tareas" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tareas">Tareas Asignadas</TabsTrigger>
            <TabsTrigger value="muestras">Muestras</TabsTrigger>
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

          <TabsContent value="muestras" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mis Muestras</CardTitle>
                <CardDescription>Muestras recolectadas por usted</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mySamples.length > 0 ? (
                    mySamples.map((sample) => (
                      <div key={sample.id} className="rounded-md border p-4">
                        <div className="font-medium">
                          <span className="italic">{sample.species}</span> ({sample.commonName})
                        </div>
                        <div className="text-sm text-muted-foreground">ID: {sample.id}</div>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Ubicación:</span> {sample.location}
                        </div>
                        <div className="mt-1 text-sm">
                          <span className="font-medium">Fecha:</span> {sample.date}
                        </div>
                        <div className="mt-1 text-sm">
                          <span className="font-medium">Estado:</span>{" "}
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {sample.status}
                          </span>
                        </div>
                        <div className="mt-3">
                          <Button variant="outline" size="sm">
                            Completar Formulario
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Leaf className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No hay muestras registradas</h3>
                      <p className="text-sm text-muted-foreground mt-2">No ha registrado muestras en el sistema.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
