"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore, generateId, formatDate } from "@/lib/store"
import { AlertTriangle, CheckCircle2, Leaf, PackageOpen, Search, Plus, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function InventarioPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { state, dispatch } = useAppStore()
  const { samples, equipment, currentUser, brigades, users, experts } = state
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false)
  const [isEditEquipmentOpen, setIsEditEquipmentOpen] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null)
  const [newEquipment, setNewEquipment] = useState({
    id: "",
    name: "",
    type: "",
    status: "Funcional",
    assignedTo: "",
    condition: "Bueno",
    notes: "",
    acquisitionDate: formatDate(new Date()),
    lastMaintenanceDate: formatDate(new Date()),
  })

  // Estado para el formulario de edición
  const [editEquipment, setEditEquipment] = useState({
    id: "",
    name: "",
    type: "",
    status: "Funcional",
    assignedTo: "",
    condition: "Bueno",
    notes: "",
    acquisitionDate: "",
    lastMaintenanceDate: "",
  })

  // Obtener la brigada del usuario actual
  const userBrigade = brigades.find((brigade) => {
    if (currentUser?.role === "jefe") {
      return brigade.leaderId === currentUser.id
    } else if (currentUser?.brigadeId) {
      return brigade.id === currentUser.brigadeId
    }
    return false
  })

  // Obtener miembros de la brigada para asignación
  const brigadeMembers = userBrigade
    ? [
        ...users.filter((user) => user.brigadeId === userBrigade.id),
        ...experts.filter((expert) => expert.brigadeId === userBrigade.id),
      ]
    : []

  // Filtrar equipos según el término de búsqueda
  const filteredSamples = samples.filter(
    (sample) =>
      sample.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filtrar equipos según el término de búsqueda y la brigada del usuario
  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())

    // Si es administrador, mostrar todos los equipos
    if (currentUser?.role === "administrador") {
      return matchesSearch
    }

    // Si es jefe de brigada o miembro, mostrar solo los equipos de su brigada
    const assignedMember = brigadeMembers.find((member) => member.name === item.assignedTo)
    const isAssignedToBrigade = assignedMember || item.assignedTo.includes("Brigada")

    return matchesSearch && isAssignedToBrigade
  })

  // Manejar la adición de nuevo equipo
  const handleAddEquipment = () => {
    const equipmentId = generateId("EQ")

    const newEquipmentItem = {
      ...newEquipment,
      id: equipmentId,
    }

    // Actualizar el estado global
    dispatch({
      type: "ADD_EQUIPMENT",
      payload: newEquipmentItem,
    })

    // Limpiar el formulario y cerrar el diálogo
    setNewEquipment({
      id: "",
      name: "",
      type: "",
      status: "Funcional",
      assignedTo: "",
      condition: "Bueno",
      notes: "",
      acquisitionDate: formatDate(new Date()),
      lastMaintenanceDate: formatDate(new Date()),
    })

    setIsAddEquipmentOpen(false)

    toast({
      title: "Equipo agregado",
      description: `El equipo ${newEquipmentItem.name} ha sido agregado al inventario.`,
    })
  }

  // Manejar la edición de equipo
  const handleEditEquipment = () => {
    // Actualizar el estado global
    dispatch({
      type: "UPDATE_EQUIPMENT_FULL",
      payload: editEquipment,
    })

    // Cerrar el diálogo
    setIsEditEquipmentOpen(false)
    setSelectedEquipment(null)

    toast({
      title: "Equipo actualizado",
      description: `El equipo ${editEquipment.name} ha sido actualizado.`,
    })
  }

  // Manejar la eliminación de equipo
  const handleDeleteEquipment = (id: string) => {
    if (confirm("¿Está seguro que desea eliminar este equipo del inventario?")) {
      dispatch({
        type: "DELETE_EQUIPMENT",
        payload: { id },
      })

      toast({
        title: "Equipo eliminado",
        description: "El equipo ha sido eliminado del inventario.",
      })
    }
  }

  // Abrir el diálogo de edición con los datos del equipo seleccionado
  const openEditDialog = (equipment: any) => {
    setEditEquipment({
      ...equipment,
      acquisitionDate: equipment.acquisitionDate || formatDate(new Date()),
      lastMaintenanceDate: equipment.lastMaintenanceDate || formatDate(new Date()),
      notes: equipment.notes || "",
    })
    setSelectedEquipment(equipment)
    setIsEditEquipmentOpen(true)
  }

  return (
    <DashboardLayout role={currentUser?.role || "jefe"}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground">Gestión del inventario de muestras y equipos.</p>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar en inventario..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {(currentUser?.role === "administrador" || currentUser?.role === "jefe") && (
            <Dialog open={isAddEquipmentOpen} onOpenChange={setIsAddEquipmentOpen}>
              <DialogTrigger asChild>
                <Button className="ml-4">
                  <Plus className="mr-2 h-4 w-4" /> Agregar Equipo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Equipo</DialogTitle>
                  <DialogDescription>
                    Complete los detalles del nuevo equipo para agregarlo al inventario.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Nombre del Equipo</Label>
                      <Input
                        id="name"
                        placeholder="GPS Garmin eTrex"
                        value={newEquipment.name}
                        onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="type">Tipo de Equipo</Label>
                      <Select
                        value={newEquipment.type}
                        onValueChange={(value) => setNewEquipment({ ...newEquipment, type: value })}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Tipos de Equipo</SelectLabel>
                            <SelectItem value="GPS">GPS</SelectItem>
                            <SelectItem value="Cámara">Cámara</SelectItem>
                            <SelectItem value="Kit">Kit de Recolección</SelectItem>
                            <SelectItem value="Tablet">Tablet</SelectItem>
                            <SelectItem value="Computadora">Computadora</SelectItem>
                            <SelectItem value="Medición">Equipo de Medición</SelectItem>
                            <SelectItem value="Comunicación">Equipo de Comunicación</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="status">Estado</Label>
                      <Select
                        value={newEquipment.status}
                        onValueChange={(value) => setNewEquipment({ ...newEquipment, status: value })}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Estados</SelectLabel>
                            <SelectItem value="Funcional">Funcional</SelectItem>
                            <SelectItem value="Batería Baja">Batería Baja</SelectItem>
                            <SelectItem value="Requiere Mantenimiento">Requiere Mantenimiento</SelectItem>
                            <SelectItem value="Dañado">Dañado</SelectItem>
                            <SelectItem value="Fuera de Servicio">Fuera de Servicio</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="condition">Condición</Label>
                      <Select
                        value={newEquipment.condition}
                        onValueChange={(value) => setNewEquipment({ ...newEquipment, condition: value })}
                      >
                        <SelectTrigger id="condition">
                          <SelectValue placeholder="Seleccionar condición" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Condiciones</SelectLabel>
                            <SelectItem value="Excelente">Excelente</SelectItem>
                            <SelectItem value="Bueno">Bueno</SelectItem>
                            <SelectItem value="Regular">Regular</SelectItem>
                            <SelectItem value="Malo">Malo</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="assignedTo">Asignado a</Label>
                    <Select
                      value={newEquipment.assignedTo}
                      onValueChange={(value) => setNewEquipment({ ...newEquipment, assignedTo: value })}
                    >
                      <SelectTrigger id="assignedTo">
                        <SelectValue placeholder="Seleccionar asignación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Brigada</SelectLabel>
                          <SelectItem value={`Brigada ${userBrigade?.name || ""} (Compartido)`}>
                            Brigada {userBrigade?.name || ""} (Compartido)
                          </SelectItem>
                          <SelectLabel>Miembros</SelectLabel>
                          {brigadeMembers.map((member) => (
                            <SelectItem key={member.id} value={member.name}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="acquisitionDate">Fecha de Adquisición</Label>
                      <Input
                        id="acquisitionDate"
                        type="text"
                        placeholder="DD/MM/AAAA"
                        value={newEquipment.acquisitionDate}
                        onChange={(e) => setNewEquipment({ ...newEquipment, acquisitionDate: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="lastMaintenanceDate">Último Mantenimiento</Label>
                      <Input
                        id="lastMaintenanceDate"
                        type="text"
                        placeholder="DD/MM/AAAA"
                        value={newEquipment.lastMaintenanceDate}
                        onChange={(e) => setNewEquipment({ ...newEquipment, lastMaintenanceDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="notes">Notas</Label>
                    <Textarea
                      id="notes"
                      placeholder="Información adicional sobre el equipo..."
                      value={newEquipment.notes}
                      onChange={(e) => setNewEquipment({ ...newEquipment, notes: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddEquipmentOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAddEquipment}
                    disabled={!newEquipment.name || !newEquipment.type || !newEquipment.assignedTo}
                  >
                    Agregar al Inventario
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Muestras</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredSamples.length}</div>
              <p className="text-xs text-muted-foreground">Muestras recolectadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Equipos</CardTitle>
              <PackageOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredEquipment.length}</div>
              <p className="text-xs text-muted-foreground">Equipos registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipos Funcionales</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredEquipment.filter((e) => e.status === "Funcional").length}
              </div>
              <p className="text-xs text-muted-foreground">En buen estado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipos con Problemas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredEquipment.filter((e) => e.status !== "Funcional").length}
              </div>
              <p className="text-xs text-muted-foreground">Requieren atención</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="equipos" className="space-y-4">
          <TabsList>
            <TabsTrigger value="equipos">Equipos</TabsTrigger>
            <TabsTrigger value="muestras">Muestras</TabsTrigger>
          </TabsList>

          <TabsContent value="equipos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventario de Equipos</CardTitle>
                <CardDescription>
                  {currentUser?.role === "administrador"
                    ? "Listado de todos los equipos registrados en el sistema."
                    : `Listado de todos los equipos asignados a la brigada ${userBrigade?.name || ""}.`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredEquipment.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Asignado a</TableHead>
                        <TableHead>Condición</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEquipment.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                item.status === "Funcional"
                                  ? "bg-green-100 text-green-800"
                                  : item.status === "Batería Baja" ||
                                      item.status === "Batería baja" ||
                                      item.status === "Requiere Mantenimiento"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.status}
                            </span>
                          </TableCell>
                          <TableCell>{item.assignedTo}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                item.condition === "Excelente" || item.condition === "Bueno"
                                  ? "bg-green-100 text-green-800"
                                  : item.condition === "Regular"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.condition}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              {(currentUser?.role === "administrador" || currentUser?.role === "jefe") && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-500"
                                  onClick={() => handleDeleteEquipment(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>No hay equipos</AlertTitle>
                    <AlertDescription>
                      No se encontraron equipos en el inventario.{" "}
                      {(currentUser?.role === "administrador" || currentUser?.role === "jefe") &&
                        "Utilice el botón 'Agregar Equipo' para registrar nuevos equipos."}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="muestras" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventario de Muestras</CardTitle>
                <CardDescription>Listado de todas las muestras recolectadas.</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredSamples.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Especie</TableHead>
                        <TableHead>Nombre Común</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead>Recolector</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSamples.map((sample) => (
                        <TableRow key={sample.id}>
                          <TableCell className="font-medium">{sample.id}</TableCell>
                          <TableCell>
                            <span className="italic">{sample.species}</span>
                          </TableCell>
                          <TableCell>{sample.commonName}</TableCell>
                          <TableCell>{sample.location}</TableCell>
                          <TableCell>{sample.collector}</TableCell>
                          <TableCell>{sample.date}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              {sample.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Ver Detalles
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>No hay muestras</AlertTitle>
                    <AlertDescription>
                      No se encontraron muestras en el inventario. Utilice la sección de "Colección de Muestras" para
                      registrar nuevas muestras.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Diálogo de edición de equipo */}
      <Dialog open={isEditEquipmentOpen} onOpenChange={setIsEditEquipmentOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Editar Equipo</DialogTitle>
            <DialogDescription>Actualice los detalles del equipo seleccionado.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="edit-name">Nombre del Equipo</Label>
                <Input
                  id="edit-name"
                  value={editEquipment.name}
                  onChange={(e) => setEditEquipment({ ...editEquipment, name: e.target.value })}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="edit-type">Tipo de Equipo</Label>
                <Select
                  value={editEquipment.type}
                  onValueChange={(value) => setEditEquipment({ ...editEquipment, type: value })}
                >
                  <SelectTrigger id="edit-type">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tipos de Equipo</SelectLabel>
                      <SelectItem value="GPS">GPS</SelectItem>
                      <SelectItem value="Cámara">Cámara</SelectItem>
                      <SelectItem value="Kit">Kit de Recolección</SelectItem>
                      <SelectItem value="Tablet">Tablet</SelectItem>
                      <SelectItem value="Computadora">Computadora</SelectItem>
                      <SelectItem value="Medición">Equipo de Medición</SelectItem>
                      <SelectItem value="Comunicación">Equipo de Comunicación</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="edit-status">Estado</Label>
                <Select
                  value={editEquipment.status}
                  onValueChange={(value) => setEditEquipment({ ...editEquipment, status: value })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Estados</SelectLabel>
                      <SelectItem value="Funcional">Funcional</SelectItem>
                      <SelectItem value="Batería Baja">Batería Baja</SelectItem>
                      <SelectItem value="Requiere Mantenimiento">Requiere Mantenimiento</SelectItem>
                      <SelectItem value="Dañado">Dañado</SelectItem>
                      <SelectItem value="Fuera de Servicio">Fuera de Servicio</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="edit-condition">Condición</Label>
                <Select
                  value={editEquipment.condition}
                  onValueChange={(value) => setEditEquipment({ ...editEquipment, condition: value })}
                >
                  <SelectTrigger id="edit-condition">
                    <SelectValue placeholder="Seleccionar condición" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Condiciones</SelectLabel>
                      <SelectItem value="Excelente">Excelente</SelectItem>
                      <SelectItem value="Bueno">Bueno</SelectItem>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="Malo">Malo</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="edit-assignedTo">Asignado a</Label>
              <Select
                value={editEquipment.assignedTo}
                onValueChange={(value) => setEditEquipment({ ...editEquipment, assignedTo: value })}
              >
                <SelectTrigger id="edit-assignedTo">
                  <SelectValue placeholder="Seleccionar asignación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Brigada</SelectLabel>
                    <SelectItem value={`Brigada ${userBrigade?.name || ""} (Compartido)`}>
                      Brigada {userBrigade?.name || ""} (Compartido)
                    </SelectItem>
                    <SelectLabel>Miembros</SelectLabel>
                    {brigadeMembers.map((member) => (
                      <SelectItem key={member.id} value={member.name}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="edit-acquisitionDate">Fecha de Adquisición</Label>
                <Input
                  id="edit-acquisitionDate"
                  type="text"
                  value={editEquipment.acquisitionDate}
                  onChange={(e) => setEditEquipment({ ...editEquipment, acquisitionDate: e.target.value })}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="edit-lastMaintenanceDate">Último Mantenimiento</Label>
                <Input
                  id="edit-lastMaintenanceDate"
                  type="text"
                  value={editEquipment.lastMaintenanceDate}
                  onChange={(e) => setEditEquipment({ ...editEquipment, lastMaintenanceDate: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="edit-notes">Notas</Label>
              <Textarea
                id="edit-notes"
                value={editEquipment.notes}
                onChange={(e) => setEditEquipment({ ...editEquipment, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditEquipmentOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditEquipment}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
