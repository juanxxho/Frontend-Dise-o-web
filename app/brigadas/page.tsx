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
import { useToast } from "@/components/ui/use-toast"
import { Plus, Search } from "lucide-react"
import { useAppStore, generateId } from "@/lib/store"

export default function BrigadasPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openAssignDialog, setOpenAssignDialog] = useState(false)
  const [selectedBrigade, setSelectedBrigade] = useState<string | null>(null)
  const [newBrigadeName, setNewBrigadeName] = useState("")
  const [selectedLeader, setSelectedLeader] = useState("")
  const [selectedBotanist, setSelectedBotanist] = useState("")
  const [selectedAssistant, setSelectedAssistant] = useState("")
  const [selectedCoinvestigator, setSelectedCoinvestigator] = useState("")
  const [selectedInvestigation, setSelectedInvestigation] = useState("")

  const { state, dispatch } = useAppStore()
  const { brigades, investigations, experts, users } = state

  const filteredBrigades = brigades.filter(
    (brigade) =>
      brigade.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brigade.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateBrigade = () => {
    if (!newBrigadeName || !selectedLeader || !selectedBotanist || !selectedAssistant) {
      toast({
        title: "Error al crear brigada",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    const newBrigade = {
      id: generateId("BRG"),
      name: newBrigadeName,
      members: selectedCoinvestigator ? 4 : 3,
      status: "Inactiva" as const,
      investigation: "Ninguna",
      leaderId: selectedLeader,
      memberIds: [
        selectedLeader,
        selectedBotanist,
        selectedAssistant,
        ...(selectedCoinvestigator ? [selectedCoinvestigator] : []),
      ],
    }

    dispatch({ type: "ADD_BRIGADE", payload: newBrigade })

    // Actualizar los usuarios y expertos con el ID de la brigada
    const memberIds = [selectedLeader, selectedBotanist, selectedAssistant]
    if (selectedCoinvestigator) memberIds.push(selectedCoinvestigator)

    // Actualizar brigadeId en usuarios y expertos (esto sería ideal hacerlo en el reducer)
    // Pero como no tenemos una acción específica, lo simulamos actualizando el estado local
    memberIds.forEach((id) => {
      const userIndex = state.users.findIndex((u) => u.id === id)
      if (userIndex >= 0) {
        state.users[userIndex].brigadeId = newBrigade.id
      }

      const expertIndex = state.experts.findIndex((e) => e.id === id)
      if (expertIndex >= 0) {
        state.experts[expertIndex].brigadeId = newBrigade.id
      }
    })

    toast({
      title: "Brigada creada",
      description: "La brigada ha sido creada exitosamente",
    })

    // Limpiar formulario
    setNewBrigadeName("")
    setSelectedLeader("")
    setSelectedBotanist("")
    setSelectedAssistant("")
    setSelectedCoinvestigator("")
    setOpenCreateDialog(false)
  }

  const handleAssignBrigade = () => {
    if (!selectedInvestigation || !selectedBrigade) {
      toast({
        title: "Error al asignar brigada",
        description: "Por favor seleccione una investigación",
        variant: "destructive",
      })
      return
    }

    dispatch({
      type: "ASSIGN_BRIGADE",
      payload: { brigadeId: selectedBrigade, investigationId: selectedInvestigation },
    })

    toast({
      title: "Brigada asignada",
      description: "La brigada ha sido asignada exitosamente a la investigación",
    })

    // Limpiar formulario
    setSelectedInvestigation("")
    setOpenAssignDialog(false)
  }

  // Combinar usuarios y expertos para los selectores
  const getAllByRole = (role: string) => {
    const roleMap: Record<string, string> = {
      jefe: "Jefe de Brigada",
      botanico: "Botánico",
      auxiliar: "Auxiliar Técnico",
      coinvestigador: "Co-investigador",
    }

    const filteredUsers = users
      .filter((user) => user.role === role && !user.brigadeId)
      .map((user) => ({
        id: user.id,
        name: user.name,
        role: roleMap[user.role] || user.role,
      }))

    const filteredExperts = experts
      .filter((expert) => expert.role === roleMap[role] && !expert.brigadeId)
      .map((expert) => ({
        id: expert.id,
        name: expert.name,
        role: expert.role,
      }))

    return [...filteredUsers, ...filteredExperts]
  }

  return (
    <DashboardLayout role="administrador">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Brigadas</h1>
          <p className="text-muted-foreground">Administre las brigadas del Inventario Forestal Nacional.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar brigadas..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-700 hover:bg-green-800">
                <Plus className="mr-2 h-4 w-4" /> Crear Brigada
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Brigada</DialogTitle>
                <DialogDescription>Complete la información para crear una nueva brigada.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="brigade-name">Nombre de la Brigada</Label>
                  <Input
                    id="brigade-name"
                    placeholder="Ej: Brigada Amazonas"
                    value={newBrigadeName}
                    onChange={(e) => setNewBrigadeName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="brigade-leader">Jefe de Brigada</Label>
                  <Select value={selectedLeader} onValueChange={setSelectedLeader}>
                    <SelectTrigger id="brigade-leader">
                      <SelectValue placeholder="Seleccionar jefe de brigada" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAllByRole("jefe").map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          {person.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="brigade-botanist1">Botánico</Label>
                  <Select value={selectedBotanist} onValueChange={setSelectedBotanist}>
                    <SelectTrigger id="brigade-botanist1">
                      <SelectValue placeholder="Seleccionar botánico" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAllByRole("botanico").map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          {person.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="brigade-assistant">Auxiliar Técnico</Label>
                  <Select value={selectedAssistant} onValueChange={setSelectedAssistant}>
                    <SelectTrigger id="brigade-assistant">
                      <SelectValue placeholder="Seleccionar auxiliar técnico" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAllByRole("auxiliar").map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          {person.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="brigade-coinvestigator">Co-investigador (Opcional)</Label>
                  <Select value={selectedCoinvestigator} onValueChange={setSelectedCoinvestigator}>
                    <SelectTrigger id="brigade-coinvestigator">
                      <SelectValue placeholder="Seleccionar co-investigador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Ninguno</SelectItem>
                      {getAllByRole("coinvestigador").map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          {person.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button className="bg-green-700 hover:bg-green-800" onClick={handleCreateBrigade}>
                  Crear Brigada
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Brigadas</CardTitle>
            <CardDescription>Listado de todas las brigadas registradas en el sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Miembros</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Investigación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrigades.map((brigade) => (
                  <TableRow key={brigade.id}>
                    <TableCell className="font-medium">{brigade.id}</TableCell>
                    <TableCell>{brigade.name}</TableCell>
                    <TableCell>{brigade.members}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          brigade.status === "Activa" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {brigade.status}
                      </span>
                    </TableCell>
                    <TableCell>{brigade.investigation}</TableCell>
                    <TableCell className="text-right">
                      <Dialog
                        open={openAssignDialog && selectedBrigade === brigade.id}
                        onOpenChange={(open) => {
                          setOpenAssignDialog(open)
                          if (open) setSelectedBrigade(brigade.id)
                          else setSelectedBrigade(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" disabled={brigade.investigation !== "Ninguna"}>
                            Asignar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Asignar Brigada a Investigación</DialogTitle>
                            <DialogDescription>
                              Seleccione una investigación para asignar la brigada {brigade.name}.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="investigation">Investigación</Label>
                              <Select value={selectedInvestigation} onValueChange={setSelectedInvestigation}>
                                <SelectTrigger id="investigation">
                                  <SelectValue placeholder="Seleccionar investigación" />
                                </SelectTrigger>
                                <SelectContent>
                                  {investigations
                                    .filter((inv) => inv.status === "Pendiente")
                                    .map((inv) => (
                                      <SelectItem key={inv.id} value={inv.id}>
                                        {inv.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setOpenAssignDialog(false)}>
                              Cancelar
                            </Button>
                            <Button className="bg-green-700 hover:bg-green-800" onClick={handleAssignBrigade}>
                              Asignar
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
      </div>
    </DashboardLayout>
  )
}
