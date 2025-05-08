"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAppStore } from "@/lib/store"
import { CheckCircle2, Clock, Search } from "lucide-react"

export default function TareasAsignadasPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [taskStatus, setTaskStatus] = useState("")

  const { state, dispatch } = useAppStore()
  const { tasks, currentUser } = state

  // Filtrar tareas asignadas al usuario actual
  const myTasks = tasks.filter((task) => {
    if (!currentUser) return false

    const userRole = currentUser.role
    const userName = currentUser.name

    // Filtrar por nombre específico si está disponible
    if (userName && task.assignedTo.toLowerCase().includes(userName.toLowerCase())) {
      return true
    }

    // Filtrar por rol como respaldo
    if (
      userRole === "botanico" &&
      (task.assignedTo.includes("María") || task.assignedTo.includes("Carlos") || task.assignedTo.includes("Botánico"))
    ) {
      return true
    }
    if (userRole === "auxiliar" && (task.assignedTo.includes("Pedro") || task.assignedTo.includes("Auxiliar"))) {
      return true
    }
    if (userRole === "coinvestigador" && task.assignedTo.includes("Co-investigador")) {
      return true
    }

    return false
  })

  const filteredTasks = myTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const pendingTasks = filteredTasks.filter((task) => task.status === "Pendiente")
  const inProgressTasks = filteredTasks.filter((task) => task.status === "En Proceso")
  const completedTasks = filteredTasks.filter((task) => task.status === "Completada")

  const handleUpdateTask = () => {
    if (!selectedTask || !taskStatus) {
      toast({
        title: "Error al actualizar tarea",
        description: "Por favor seleccione un estado",
        variant: "destructive",
      })
      return
    }

    dispatch({
      type: "UPDATE_TASK",
      payload: {
        id: selectedTask,
        status: taskStatus,
      },
    })

    toast({
      title: "Tarea actualizada",
      description: "El estado de la tarea ha sido actualizado exitosamente",
    })

    // Limpiar formulario
    setTaskStatus("")
    setSelectedTask(null)
    setOpenUpdateDialog(false)
  }

  return (
    <DashboardLayout role={currentUser?.role || "botanico"}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Tareas Asignadas</h1>
          <p className="text-muted-foreground">Gestione las tareas que le han sido asignadas.</p>
        </div>

        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar tareas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks.length}</div>
              <p className="text-xs text-muted-foreground">Tareas que aún no han sido iniciadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tareas En Proceso</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressTasks.length}</div>
              <p className="text-xs text-muted-foreground">Tareas que están siendo ejecutadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks.length}</div>
              <p className="text-xs text-muted-foreground">Tareas que han sido finalizadas</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="todas" className="space-y-4">
          <TabsList>
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
            <TabsTrigger value="en-proceso">En Proceso</TabsTrigger>
            <TabsTrigger value="completadas">Completadas</TabsTrigger>
          </TabsList>

          <TabsContent value="todas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Todas las Tareas</CardTitle>
                <CardDescription>Listado de todas las tareas asignadas a usted</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Fecha Límite</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.id}</TableCell>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog
                            open={openUpdateDialog && selectedTask === task.id}
                            onOpenChange={(open) => {
                              setOpenUpdateDialog(open)
                              if (open) {
                                setSelectedTask(task.id)
                                setTaskStatus(task.status)
                              } else {
                                setSelectedTask(null)
                              }
                            }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedTask(task.id)
                                setTaskStatus(task.status)
                                setOpenUpdateDialog(true)
                              }}
                            >
                              Actualizar Estado
                            </Button>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Actualizar Estado de Tarea</DialogTitle>
                                <DialogDescription>Actualice el estado de la tarea: {task.title}</DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="task-status">Estado</Label>
                                  <Select value={taskStatus} onValueChange={setTaskStatus}>
                                    <SelectTrigger id="task-status">
                                      <SelectValue placeholder="Seleccionar estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                                      <SelectItem value="En Proceso">En Proceso</SelectItem>
                                      <SelectItem value="Completada">Completada</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setOpenUpdateDialog(false)}>
                                  Cancelar
                                </Button>
                                <Button className="bg-green-700 hover:bg-green-800" onClick={handleUpdateTask}>
                                  Actualizar
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pendientes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tareas Pendientes</CardTitle>
                <CardDescription>Tareas que aún no han sido iniciadas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Fecha Límite</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.id}</TableCell>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTask(task.id)
                              setTaskStatus("En Proceso")
                              setOpenUpdateDialog(true)
                            }}
                          >
                            Iniciar Tarea
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="en-proceso" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tareas En Proceso</CardTitle>
                <CardDescription>Tareas que están siendo ejecutadas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Fecha Límite</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inProgressTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.id}</TableCell>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTask(task.id)
                              setTaskStatus("Completada")
                              setOpenUpdateDialog(true)
                            }}
                          >
                            Completar Tarea
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completadas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tareas Completadas</CardTitle>
                <CardDescription>Tareas que han sido finalizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Fecha Límite</TableHead>
                      <TableHead>Fecha Completada</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.id}</TableCell>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                        <TableCell>Hoy</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
