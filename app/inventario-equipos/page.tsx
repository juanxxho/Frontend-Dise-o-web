"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { AlertTriangle, CheckCircle2, PackageOpen, Search } from "lucide-react"
import { useAppStore } from "@/lib/store"

export default function InventarioEquiposPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false)

  // Estados para el formulario
  const [selectedEquipment, setSelectedEquipment] = useState("")
  const [equipmentStatus, setEquipmentStatus] = useState("")
  const [equipmentCondition, setEquipmentCondition] = useState("")
  const [equipmentNotes, setEquipmentNotes] = useState("")

  const { state, dispatch } = useAppStore()
  const { equipment } = state

  const filteredEquipment = equipment.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleRegisterStatus = () => {
    if (!selectedEquipment || !equipmentStatus || !equipmentCondition) {
      toast({
        title: "Error al registrar estado",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    dispatch({
      type: "UPDATE_EQUIPMENT",
      payload: {
        id: selectedEquipment,
        status: equipmentStatus,
        condition: equipmentCondition,
      },
    })

    toast({
      title: "Estado registrado",
      description: "El estado del equipo ha sido registrado exitosamente",
    })

    // Limpiar formulario
    setSelectedEquipment("")
    setEquipmentStatus("")
    setEquipmentCondition("")
    setEquipmentNotes("")
    setOpenRegisterDialog(false)
  }

  return (
    <DashboardLayout role="auxiliar">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Inventario de Equipos</h1>
          <p className="text-muted-foreground">Gestione y verifique el estado de los equipos asignados a la brigada.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar equipos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog open={openRegisterDialog} onOpenChange={setOpenRegisterDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-700 hover:bg-green-800">
                <CheckCircle2 className="mr-2 h-4 w-4" /> Verificar Equipos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Verificar Estado de Equipos</DialogTitle>
                <DialogDescription>Registre el estado actual de los equipos asignados.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="equipment-id">Equipo</Label>
                  <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                    <SelectTrigger id="equipment-id">
                      <SelectValue placeholder="Seleccionar equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipment.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} ({item.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="equipment-status">Estado</Label>
                  <Select value={equipmentStatus} onValueChange={setEquipmentStatus}>
                    <SelectTrigger id="equipment-status">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Funcional">Funcional</SelectItem>
                      <SelectItem value="Batería Baja">Batería Baja</SelectItem>
                      <SelectItem value="Requiere Mantenimiento">Requiere Mantenimiento</SelectItem>
                      <SelectItem value="Dañado">Dañado</SelectItem>
                      <SelectItem value="Perdido">Perdido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="equipment-condition">Condición</Label>
                  <Select value={equipmentCondition} onValueChange={setEquipmentCondition}>
                    <SelectTrigger id="equipment-condition">
                      <SelectValue placeholder="Seleccionar condición" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excelente">Excelente</SelectItem>
                      <SelectItem value="Bueno">Bueno</SelectItem>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="Malo">Malo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="equipment-notes">Observaciones</Label>
                  <Textarea
                    id="equipment-notes"
                    placeholder="Detalles adicionales sobre el estado del equipo"
                    value={equipmentNotes}
                    onChange={(e) => setEquipmentNotes(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenRegisterDialog(false)}>
                  Cancelar
                </Button>
                <Button className="bg-green-700 hover:bg-green-800" onClick={handleRegisterStatus}>
                  Registrar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Equipos Asignados</CardTitle>
            <CardDescription>Listado de todos los equipos asignados a la brigada.</CardDescription>
          </CardHeader>
          <CardContent>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedEquipment(item.id)
                          setOpenRegisterDialog(true)
                        }}
                      >
                        Actualizar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="flex w-full justify-between">
              <div className="flex items-center gap-2">
                <PackageOpen className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total de equipos: {equipment.length}</span>
              </div>
              <Button variant="outline">
                <AlertTriangle className="mr-2 h-4 w-4" /> Reportar Problema
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}
