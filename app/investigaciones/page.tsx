"use client"

import { useState } from "react"
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
import { Plus, Search } from "lucide-react"
import { useAppStore, generateId } from "@/lib/store"

export default function InvestigacionesPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [openCreateDialog, setOpenCreateDialog] = useState(false)

  // Estados para el formulario
  const [investigationName, setInvestigationName] = useState("")
  const [investigationType, setInvestigationType] = useState("")
  const [investigationDescription, setInvestigationDescription] = useState("")
  const [investigationLocation, setInvestigationLocation] = useState("")

  const { state, dispatch } = useAppStore()
  const { investigations } = state

  const filteredInvestigations = investigations.filter(
    (investigation) =>
      investigation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investigation.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateInvestigation = () => {
    if (!investigationName || !investigationType || !investigationLocation) {
      toast({
        title: "Error al crear investigación",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    const newInvestigation = {
      id: generateId("INV"),
      name: investigationName,
      status: "Pendiente" as const,
      type: investigationType,
      description: investigationDescription,
      location: investigationLocation,
    }

    // Actualizar el estado global
    const updatedInvestigations = [...investigations, newInvestigation]
    dispatch({
      type: "ADD_INVESTIGATION",
      payload: newInvestigation,
    })

    toast({
      title: "Investigación creada",
      description: "La investigación ha sido creada exitosamente",
    })

    // Limpiar formulario
    setInvestigationName("")
    setInvestigationType("")
    setInvestigationDescription("")
    setInvestigationLocation("")
    setOpenCreateDialog(false)
  }

  return (
    <DashboardLayout role="administrador">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Investigaciones</h1>
          <p className="text-muted-foreground">Administre las investigaciones del Inventario Forestal Nacional.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar investigaciones..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-700 hover:bg-green-800">
                <Plus className="mr-2 h-4 w-4" /> Crear Investigación
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Investigación</DialogTitle>
                <DialogDescription>Complete la información para crear una nueva investigación.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="investigation-name">Nombre de la Investigación</Label>
                  <Input
                    id="investigation-name"
                    placeholder="Ej: Estudio de Biodiversidad Zona Norte"
                    value={investigationName}
                    onChange={(e) => setInvestigationName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="investigation-type">Tipo de Investigación</Label>
                  <Select value={investigationType} onValueChange={setInvestigationType}>
                    <SelectTrigger id="investigation-type">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="biodiversidad">Estudio de Biodiversidad</SelectItem>
                      <SelectItem value="monitoreo">Monitoreo de Especies</SelectItem>
                      <SelectItem value="inventario">Inventario Forestal</SelectItem>
                      <SelectItem value="conservacion">Conservación</SelectItem>
                      <SelectItem value="deforestacion">Deforestación</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="investigation-location">Ubicación</Label>
                  <Input
                    id="investigation-location"
                    placeholder="Ej: Zona Norte, Región Amazónica"
                    value={investigationLocation}
                    onChange={(e) => setInvestigationLocation(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="investigation-description">Descripción</Label>
                  <Textarea
                    id="investigation-description"
                    placeholder="Descripción detallada de la investigación"
                    value={investigationDescription}
                    onChange={(e) => setInvestigationDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button className="bg-green-700 hover:bg-green-800" onClick={handleCreateInvestigation}>
                  Crear Investigación
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Investigaciones</CardTitle>
            <CardDescription>Listado de todas las investigaciones registradas en el sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Brigada Asignada</TableHead>
                  <TableHead>Fecha Inicio</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvestigations.map((investigation) => {
                  const assignedBrigade = state.brigades.find((b) => b.id === investigation.brigadeId)
                  return (
                    <TableRow key={investigation.id}>
                      <TableCell className="font-medium">{investigation.id}</TableCell>
                      <TableCell>{investigation.name}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            investigation.status === "En Proceso"
                              ? "bg-green-100 text-green-800"
                              : investigation.status === "Completada"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {investigation.status}
                        </span>
                      </TableCell>
                      <TableCell>{assignedBrigade ? assignedBrigade.name : "No asignada"}</TableCell>
                      <TableCell>{investigation.startDate || "No iniciada"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Ver Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
