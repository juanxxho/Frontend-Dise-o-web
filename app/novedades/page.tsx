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
import { Camera, MapPin, Plus, Search } from "lucide-react"
import { useAppStore, generateId, formatDate } from "@/lib/store"

export default function NovedadesPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false)

  // Estados para el formulario
  const [issueTitle, setIssueTitle] = useState("")
  const [issueType, setIssueType] = useState("")
  const [issuePriority, setIssuePriority] = useState("")
  const [issueLocation, setIssueLocation] = useState("")
  const [issueDescription, setIssueDescription] = useState("")

  const { state, dispatch } = useAppStore()
  const { issues, currentUser } = state

  const filteredIssues = issues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleRegisterIssue = () => {
    if (!issueTitle || !issueType || !issuePriority || !issueLocation) {
      toast({
        title: "Error al registrar novedad",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    const newIssue = {
      id: generateId("NOV"),
      title: issueTitle,
      type: issueType,
      priority: issuePriority as "Baja" | "Media" | "Alta" | "Crítica",
      location: issueLocation,
      reporter: currentUser?.name || "Usuario Actual",
      date: formatDate(new Date()),
      status: "Pendiente" as const,
      description: issueDescription,
    }

    dispatch({ type: "ADD_ISSUE", payload: newIssue })

    toast({
      title: "Novedad registrada",
      description: "La novedad ha sido registrada exitosamente",
    })

    // Limpiar formulario
    setIssueTitle("")
    setIssueType("")
    setIssuePriority("")
    setIssueLocation("")
    setIssueDescription("")
    setOpenRegisterDialog(false)
  }

  return (
    <DashboardLayout role="jefe">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Registro de Novedades</h1>
          <p className="text-muted-foreground">Gestione las novedades e incidencias durante el trabajo de campo.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar novedades..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog open={openRegisterDialog} onOpenChange={setOpenRegisterDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-700 hover:bg-green-800">
                <Plus className="mr-2 h-4 w-4" /> Registrar Novedad
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Registrar Nueva Novedad</DialogTitle>
                <DialogDescription>Complete la información de la novedad o incidencia.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="issue-title">Título</Label>
                  <Input
                    id="issue-title"
                    placeholder="Descripción breve de la novedad"
                    value={issueTitle}
                    onChange={(e) => setIssueTitle(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="issue-type">Tipo</Label>
                    <Select value={issueType} onValueChange={setIssueType}>
                      <SelectTrigger id="issue-type">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equipo">Equipo</SelectItem>
                        <SelectItem value="acceso">Acceso</SelectItem>
                        <SelectItem value="seguridad">Seguridad</SelectItem>
                        <SelectItem value="clima">Clima</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="issue-priority">Prioridad</Label>
                    <Select value={issuePriority} onValueChange={setIssuePriority}>
                      <SelectTrigger id="issue-priority">
                        <SelectValue placeholder="Seleccionar prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baja">Baja</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Crítica">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="issue-location">Ubicación</Label>
                  <div className="flex gap-2">
                    <Input
                      id="issue-location"
                      placeholder="Descripción de la ubicación"
                      value={issueLocation}
                      onChange={(e) => setIssueLocation(e.target.value)}
                    />
                    <Button variant="outline" size="icon" title="Usar GPS">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="issue-description">Descripción Detallada</Label>
                  <Textarea
                    id="issue-description"
                    placeholder="Describa la novedad con el mayor detalle posible"
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Fotografía (opcional)</Label>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Camera className="h-4 w-4" />
                    Adjuntar Fotografía
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenRegisterDialog(false)}>
                  Cancelar
                </Button>
                <Button className="bg-green-700 hover:bg-green-800" onClick={handleRegisterIssue}>
                  Registrar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Novedades Registradas</CardTitle>
            <CardDescription>Listado de todas las novedades e incidencias reportadas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Reportado por</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className="font-medium">{issue.id}</TableCell>
                    <TableCell>{issue.title}</TableCell>
                    <TableCell>{issue.type}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          issue.priority === "Alta" || issue.priority === "Crítica"
                            ? "bg-red-100 text-red-800"
                            : issue.priority === "Media"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {issue.priority}
                      </span>
                    </TableCell>
                    <TableCell>{issue.reporter}</TableCell>
                    <TableCell>{issue.date}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          issue.status === "Pendiente"
                            ? "bg-amber-100 text-amber-800"
                            : issue.status === "Reportado"
                              ? "bg-blue-100 text-blue-800"
                              : issue.status === "Resuelto"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {issue.status}
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
