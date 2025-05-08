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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Camera, MapPin, Plus, Search } from "lucide-react"
import { useAppStore, generateId, formatDate } from "@/lib/store"

export default function ColeccionMuestrasPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false)

  // Estados para el formulario
  const [speciesType, setSpeciesType] = useState("")
  const [conservationStatus, setConservationStatus] = useState("")
  const [species, setSpecies] = useState("")
  const [commonName, setCommonName] = useState("")
  const [location, setLocation] = useState("")
  const [observations, setObservations] = useState("")

  const { state, dispatch } = useAppStore()
  const { samples, currentUser } = state

  const filteredSamples = samples.filter(
    (sample) =>
      sample.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleRegisterSample = () => {
    if (!species || !commonName || !location) {
      toast({
        title: "Error al registrar muestra",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    const newSample = {
      id: generateId("MUE"),
      species,
      commonName,
      location,
      collector: currentUser?.name || "Usuario Actual",
      date: formatDate(new Date()),
      status: "Registrada" as const,
      type: speciesType,
      conservationStatus,
      observations,
    }

    dispatch({ type: "ADD_SAMPLE", payload: newSample })

    toast({
      title: "Muestra registrada",
      description: "La muestra ha sido registrada exitosamente",
    })

    // Limpiar formulario
    setSpeciesType("")
    setConservationStatus("")
    setSpecies("")
    setCommonName("")
    setLocation("")
    setObservations("")
    setOpenRegisterDialog(false)
  }

  return (
    <DashboardLayout role="botanico">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Colección de Muestras</h1>
          <p className="text-muted-foreground">Gestione las muestras recolectadas durante el trabajo de campo.</p>
        </div>

        <Tabs defaultValue="samples" className="space-y-4">
          <TabsList>
            <TabsTrigger value="samples">Muestras</TabsTrigger>
            <TabsTrigger value="forms">Formularios</TabsTrigger>
          </TabsList>

          <TabsContent value="samples" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar muestras..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Dialog open={openRegisterDialog} onOpenChange={setOpenRegisterDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-green-700 hover:bg-green-800">
                    <Plus className="mr-2 h-4 w-4" /> Registrar Muestra
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Registrar Nueva Muestra</DialogTitle>
                    <DialogDescription>Complete la información básica de la muestra recolectada.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="species-type">Tipo de Especie</Label>
                        <Select value={speciesType} onValueChange={setSpeciesType}>
                          <SelectTrigger id="species-type">
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="arbol">Árbol</SelectItem>
                            <SelectItem value="arbusto">Arbusto</SelectItem>
                            <SelectItem value="hierba">Hierba</SelectItem>
                            <SelectItem value="liana">Liana</SelectItem>
                            <SelectItem value="epifita">Epífita</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="conservation-status">Estado de Conservación</Label>
                        <Select value={conservationStatus} onValueChange={setConservationStatus}>
                          <SelectTrigger id="conservation-status">
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lc">Preocupación Menor (LC)</SelectItem>
                            <SelectItem value="nt">Casi Amenazada (NT)</SelectItem>
                            <SelectItem value="vu">Vulnerable (VU)</SelectItem>
                            <SelectItem value="en">En Peligro (EN)</SelectItem>
                            <SelectItem value="cr">En Peligro Crítico (CR)</SelectItem>
                            <SelectItem value="unknown">Desconocido</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="species">Especie (si se conoce)</Label>
                      <Input
                        id="species"
                        placeholder="Nombre científico"
                        value={species}
                        onChange={(e) => setSpecies(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="common-name">Nombre Común</Label>
                      <Input
                        id="common-name"
                        placeholder="Nombre común local"
                        value={commonName}
                        onChange={(e) => setCommonName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Ubicación</Label>
                      <div className="flex gap-2">
                        <Input
                          id="location"
                          placeholder="Descripción de la ubicación"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                        <Button variant="outline" size="icon" title="Usar GPS">
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="observations">Observaciones Preliminares</Label>
                      <Textarea
                        id="observations"
                        placeholder="Características observadas, condiciones del hábitat, etc."
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Fotografía</Label>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Camera className="h-4 w-4" />
                        Tomar Fotografía
                      </Button>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenRegisterDialog(false)}>
                      Cancelar
                    </Button>
                    <Button className="bg-green-700 hover:bg-green-800" onClick={handleRegisterSample}>
                      Registrar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Muestras Recolectadas</CardTitle>
                <CardDescription>Listado de todas las muestras registradas en el sistema.</CardDescription>
              </CardHeader>
              <CardContent>
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
                            Completar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Formularios de Recolección</CardTitle>
                <CardDescription>Complete los formularios detallados para las muestras recolectadas.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredSamples.map((sample) => (
                    <div key={sample.id} className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Muestra: {sample.id}</div>
                          <div className="text-sm text-muted-foreground">
                            Especie: <span className="italic">{sample.species}</span> ({sample.commonName})
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Completar Formulario
                        </Button>
                      </div>
                    </div>
                  ))}

                  {filteredSamples.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay muestras registradas que coincidan con la búsqueda.
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
