"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAppStore } from "@/lib/store"
import { Briefcase, CheckCircle2, Clock, FileText, MapPin, Users } from "lucide-react"

export default function CoinvestigadorDashboard() {
  const { toast } = useToast()
  const [openObservationDialog, setOpenObservationDialog] = useState(false)
  const [observationType, setObservationType] = useState("")
  const [observationLocation, setObservationLocation] = useState("")
  const [observationNotes, setObservationNotes] = useState("")

  const { state } = useAppStore()
  const { tasks, brigades, investigations } = state

  // Filtrar tareas asignadas al coinvestigador
  const myTasks = tasks.filter((task) => task.assignedTo.includes("Co-investigador"))

  const pendingTasks = myTasks.filter((task) => task.status === "Pendiente")
  const inProgressTasks = myTasks.filter((task) => task.status === "En Proceso")
  const completedTasks = myTasks.filter((task) => task.status === "Completada")

  // Calcular progreso
  const totalTasks = myTasks.length
  const completedPercentage = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0

  const handleSubmitObservation = () => {
    if (!observationType || !observationLocation || !observationNotes) {
      toast({
        title: "Error al registrar observación",
        description: "Por favor complete todos los campos",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Observación registrada",
      description: "La observación ha sido registrada exitosamente",
    })

    // Limpiar formulario
    setObservationType("")
    setObservationLocation("")
    setObservationNotes("")
    setOpenObservationDialog(false)
  }

  return (
    <DashboardLayout role="coinvestigador">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Co-investigador</h1>
          <p className="text-muted-foreground">
            Bienvenido al panel de control de co-investigador del Inventario Forestal Nacional.
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
              <CardTitle className="text-sm font-medium">Brigadas Activas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{brigades.filter((b) => b.status === "Activa").length}</div>
              <p className="text-xs text-muted-foreground">Brigadas en operación</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Investigaciones</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{investigations.filter((i) => i.status === "En Proceso").length}</div>
              <p className="text-xs text-muted-foreground">Investigaciones en curso</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Dialog open={openObservationDialog} onOpenChange={setOpenObservationDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-700 hover:bg-green-800">
                <FileText className="mr-2 h-4 w-4" /> Registrar Observación
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Registrar Nueva Observación</DialogTitle>
                <DialogDescription>
                  Complete la información para registrar una observación del terreno o suelo.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="observation-type">Tipo de Observación</Label>
                  <Select value={observationType} onValueChange={setObservationType}>
                    <SelectTrigger id="observation-type">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="suelo">Características del Suelo</SelectItem>
                      <SelectItem value="terreno">Topografía del Terreno</SelectItem>
                      <SelectItem value="erosion">Erosión</SelectItem>
                      <SelectItem value="humedad">Humedad</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="observation-location">Ubicación</Label>
                  <div className="flex gap-2">
                    <input
                      id="observation-location"
                      placeholder="Descripción de la ubicación"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={observationLocation}
                      onChange={(e) => setObservationLocation(e.target.value)}
                    />
                    <Button variant="outline" size="icon" title="Usar GPS">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="observation-notes">Descripción Detallada</Label>
                  <Textarea
                    id="observation-notes"
                    placeholder="Describa detalladamente sus observaciones"
                    value={observationNotes}
                    onChange={(e) => setObservationNotes(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenObservationDialog(false)}>
                  Cancelar
                </Button>
                <Button className="bg-green-700 hover:bg-green-800" onClick={handleSubmitObservation}>
                  Registrar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="tareas" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tareas">Tareas Asignadas</TabsTrigger>
            <TabsTrigger value="brigadas">Progreso de Brigadas</TabsTrigger>
            <TabsTrigger value="investigaciones">Investigaciones</TabsTrigger>
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

          <TabsContent value="brigadas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Progreso de Brigadas</CardTitle>
                <CardDescription>Estado actual de las brigadas en campo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {brigades
                    .filter((b) => b.status === "Activa")
                    .map((brigade) => (
                      <div key={brigade.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{brigade.name}</h3>
                          <span className="text-sm text-muted-foreground">{brigade.id}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Progreso</span>
                          <span className="font-medium">
                            {brigade.name === "Brigada Amazonas"
                              ? "45%"
                              : brigade.name === "Brigada Sierra Central"
                                ? "30%"
                                : brigade.name === "Brigada Costa Pacífica"
                                  ? "60%"
                                  : "0%"}
                          </span>
                        </div>
                        <Progress
                          value={
                            brigade.name === "Brigada Amazonas"
                              ? 45
                              : brigade.name === "Brigada Sierra Central"
                                ? 30
                                : brigade.name === "Brigada Costa Pacífica"
                                  ? 60
                                  : 0
                          }
                          className="h-2"
                        />
                        <div className="text-sm text-muted-foreground">Investigación: {brigade.investigation}</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investigaciones" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Investigaciones en Curso</CardTitle>
                <CardDescription>Investigaciones activas en las que participa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investigations
                    .filter((i) => i.status === "En Proceso")
                    .map((investigation) => {
                      const assignedBrigade = brigades.find((b) => b.id === investigation.brigadeId)
                      return (
                        <div key={investigation.id} className="rounded-md border p-4">
                          <div className="font-medium">{investigation.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {investigation.id}</div>
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Brigada Asignada:</span>{" "}
                            {assignedBrigade?.name || "No asignada"}
                          </div>
                          <div className="mt-1 text-sm">
                            <span className="font-medium">Fecha Inicio:</span>{" "}
                            {investigation.startDate || "No iniciada"}
                          </div>
                          <div className="mt-1 text-sm">
                            <span className="font-medium">Estado:</span>{" "}
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              {investigation.status}
                            </span>
                          </div>
                          <div className="mt-3">
                            <Button variant="outline" size="sm">
                              Ver Detalles
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
