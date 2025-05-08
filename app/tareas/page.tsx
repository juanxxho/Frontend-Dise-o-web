"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon, CheckCircle2, Clock, Plus, Search } from "lucide-react"
import { useAppStore, generateId } from "@/lib/store"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function TareasPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [userBrigade, setUserBrigade] = useState<any>(null)
  const [brigadeMembers, setBrigadeMembers] = useState<any[]>([])

  // Estados para el formulario de creación
  const [taskTitle, setTaskTitle] = useState("")
  const [taskAssignee, setTaskAssignee] = useState("")
  const [taskDueDate, setTaskDueDate] = useState<Date>()
  const [taskDescription, setTaskDescription] = useState("")

  // Estados para el formulario de actualización
  const [taskStatus, setTaskStatus] = useState("")

  const { state, dispatch } = useAppStore()
  const { tasks, currentUser, brigades, users, experts } = state

  // Obtener la brigada del usuario actual y sus miembros
  useEffect(() => {
    if (currentUser) {
      // Buscar la brigada del usuario actual
      const brigade = brigades.find((b) => {
        // Si el usuario es jefe, verificar si es el líder de la brigada
        if (currentUser.role === "jefe") {
          return b.leaderId === currentUser.id || b.memberIds?.includes(currentUser.id)
        }
        return false
      })

      setUserBrigade(brigade)

      if (brigade) {
        // Obtener todos los miembros de la brigada
        const members = []

        // Buscar usuarios que pertenecen a esta brigada
        for (const user of users) {
          if (user.brigadeId === brigade.id) {
            members.push(user)
          }
        }

        // Buscar expertos que pertenecen a esta brigada
        for (const expert of experts) {
          if (expert.brigadeId === brigade.id) {
            members.push(expert)
          }
        }

        // También incluir miembros por memberIds
        if (brigade.memberIds) {
          for (const memberId of brigade.memberIds) {
            const user = users.find((u) => u.id === memberId)
            const expert = experts.find((e) => e.id === memberId)

            if (user && !members.some((m) => m.id === user.id)) {
              members.push(user)
            } else if (expert && !members.some((m) => m.id === expert.id)) {
              members.push(expert)
            }
          }
        }

        setBrigadeMembers(members)
      }
    }
  }, [state, currentUser, brigades, users, experts])

  // Filtrar tareas según la brigada del jefe
  const filteredTasks = tasks.filter((task) => {
    // Si hay un término de búsqueda, aplicarlo primero
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.id.toLowerCase().includes(searchTerm.toLowerCase())

    // Si no es un jefe de brigada o no tiene brigada asignada, mostrar todas las tareas que coincidan con la búsqueda
    if (!currentUser || currentUser.role !== "jefe" || !userBrigade) {
      return matchesSearch
    }

    // Si es un jefe de brigada, mostrar solo las tareas de su brigada
    return matchesSearch && task.brigadeId === userBrigade.id
  })

  const handleCreateTask = () => {
    if (!taskTitle || !taskAssignee || !taskDueDate) {
      toast({
        title: "Error al crear tarea",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    // Obtener el ID del usuario asignado
    const assignedMember = brigadeMembers.find(
      (member) => member.name === taskAssignee || `${member.name} (${member.role})` === taskAssignee,
    )

    const formattedDate = format(taskDueDate, "yyyy-MM-dd")

    const newTask = {
      id: generateId("TASK"),
      title: taskTitle,
      assignedTo: taskAssignee,
      assignedToId: assignedMember?.id,
      brigadeId: userBrigade?.id,
      dueDate: formattedDate,
      status: "Pendiente" as const,
      description: taskDescription,
    }

    dispatch({
      type: "ADD_TASK",
      payload: newTask,
    })

    toast({
      title: "Tarea creada",
      description: "La tarea ha sido creada exitosamente",
    })

    // Limpiar formulario
    setTaskTitle("")
    setTaskAssignee("")
    setTaskDueDate(undefined)
    setTaskDescription("")
    setOpenCreateDialog(false)
  }

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
    <DashboardLayout role="jefe">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Tareas</h1>
          <p className="text-muted-foreground">Administre las tareas asignadas a los miembros de la brigada.</p>
        </div>

        {!userBrigade && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Atención</AlertTitle>
            <AlertDescription>
              No tiene una brigada asignada. Por favor contacte al administrador para ser asignado a una brigada.
            </AlertDescription>
          </Alert>
        )}

        {userBrigade && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-800">Brigada: {userBrigade.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-700">
                Investigación: <span className="font-medium">{userBrigade.investigation}</span>
              </p>
              <p className="text-sm text-green-700">
                Miembros: <span className="font-medium">{brigadeMembers.length}</span>
              </p>
              {brigadeMembers.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-green-700 font-medium">Integrantes:</p>
                  <ul className="text-sm text-green-700 mt-1 space-y-1">
                    {brigadeMembers.map((member) => (
                      <li key={member.id}>
                        • {member.name} - {member.role}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
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

          <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
            <DialogTrigger asChild>
              <Button
                className="bg-green-700 hover:bg-green-800"
                disabled={!userBrigade || brigadeMembers.length === 0}
              >
                <Plus className="mr-2 h-4 w-4" /> Crear Tarea
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Tarea</DialogTitle>
                <DialogDescription>Complete la información para crear una nueva tarea.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="task-title">Título de la Tarea</Label>
                  <Input
                    id="task-title"
                    placeholder="Ej: Recolectar muestras en la zona norte"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-assignee">Asignar a</Label>
                  <Select value={taskAssignee} onValueChange={setTaskAssignee}>
                    <SelectTrigger id="task-assignee">
                      <SelectValue placeholder="Seleccionar miembro" />
                    </SelectTrigger>
                    <SelectContent>
                      {brigadeMembers
                        .filter((member) => {
                          // Excluir al jefe de brigada actual
                          if (currentUser && member.id === currentUser.id) return false

                          // Incluir a todos los demás miembros
                          return true
                        })
                        .map((member) => (
                          <SelectItem key={member.id} value={member.name}>
                            {member.name} ({member.role})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-due-date">Fecha Límite</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !taskDueDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {taskDueDate ? format(taskDueDate, "PPP") : <span>Seleccionar fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={taskDueDate} onSelect={setTaskDueDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-description">Descripción</Label>
                  <Textarea
                    id="task-description"
                    placeholder="Descripción detallada de la tarea"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button className="bg-green-700 hover:bg-green-800" onClick={handleCreateTask}>
                  Crear Tarea
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tareas Asignadas</CardTitle>
            <CardDescription>Listado de todas las tareas asignadas a los miembros de la brigada.</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTasks.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Asignado a</TableHead>
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
                      <TableCell>{task.assignedTo}</TableCell>
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
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Actualizar Estado
                            </Button>
                          </DialogTrigger>
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
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No hay tareas asignadas a los miembros de esta brigada.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredTasks.filter((t) => t.status === "Pendiente").length}</div>
              <p className="text-xs text-muted-foreground">Tareas que aún no han sido iniciadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tareas En Proceso</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredTasks.filter((t) => t.status === "En Proceso").length}</div>
              <p className="text-xs text-muted-foreground">Tareas que están siendo ejecutadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredTasks.filter((t) => t.status === "Completada").length}</div>
              <p className="text-xs text-muted-foreground">Tareas que han sido finalizadas</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
