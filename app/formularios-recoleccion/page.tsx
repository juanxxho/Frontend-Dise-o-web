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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Camera, Leaf, MapPin, Search } from "lucide-react"

export default function FormulariosRecoleccionPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [openFormDialog, setOpenFormDialog] = useState(false)
  const [selectedSample, setSelectedSample] = useState<string | null>(null)

  // Datos de ejemplo
  const samples = [
    {
      id: "MUE-001",
      species: "Cedrela odorata",
      commonName: "Cedro",
      location: "Zona Norte, Sector A-3",
      collector: "María López",
      date: "22/04/2024",
      status: "Registrada",
    },
    {
      id: "MUE-002",
      species: "Swietenia macrophylla",
      commonName: "Caoba",
      location: "Zona Norte, Sector A-2",
      collector: "María López",
      date: "22/04/2024",
      status: "Registrada",
    },
    {
      id: "MUE-003",
      species: "Ochroma pyramidale",
      commonName: "Balsa",
      location: "Zona Norte, Sector A-4",
      collector: "Carlos Mendoza",
      date: "21/04/2024",
      status: "Registrada",
    },
    {
      id: "MUE-004",
      species: "Cordia alliodora",
      commonName: "Laurel",
      location: "Zona Norte, Sector B-1",
      collector: "Carlos Mendoza",
      date: "21/04/2024",
      status: "Registrada",
    },
  ]

  const filteredSamples = samples.filter(
    (sample) =>
      sample.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCompleteForm = () => {
    toast({
      title: "Formulario completado",
      description: "El formulario de recolección ha sido completado exitosamente",
    })
    setOpenFormDialog(false)
  }

  return (
    <DashboardLayout role="botanico">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Formularios de Recolección</h1>
          <p className="text-muted-foreground">Complete los formularios detallados para las muestras recolectadas.</p>
        </div>

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

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pendientes</TabsTrigger>
            <TabsTrigger value="completed">Completados</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Formularios Pendientes</CardTitle>
                <CardDescription>Muestras que requieren completar el formulario detallado.</CardDescription>
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
                          <div className="text-sm text-muted-foreground">Ubicación: {sample.location}</div>
                          <div className="text-sm text-muted-foreground">Recolector: {sample.collector}</div>
                        </div>
                        <Dialog
                          open={openFormDialog && selectedSample === sample.id}
                          onOpenChange={(open) => {
                            setOpenFormDialog(open)
                            if (open) setSelectedSample(sample.id)
                            else setSelectedSample(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Completar Formulario
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Formulario de Recolección Detallado</DialogTitle>
                              <DialogDescription>
                                Complete la información detallada para la muestra {sample.id}.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="species-scientific">Nombre Científico</Label>
                                    <Input
                                      id="species-scientific"
                                      placeholder="Nombre científico"
                                      defaultValue={sample.species}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="species-common">Nombre Común</Label>
                                    <Input
                                      id="species-common"
                                      placeholder="Nombre común"
                                      defaultValue={sample.commonName}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="species-family">Familia</Label>
                                    <Input id="species-family" placeholder="Familia botánica" />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="species-type">Tipo de Especie</Label>
                                    <Select>
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
                                    <Select>
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
                                <div className="space-y-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="location-detailed">Ubicación Detallada</Label>
                                    <div className="flex gap-2">
                                      <Input
                                        id="location-detailed"
                                        placeholder="Descripción detallada de la ubicación"
                                        defaultValue={sample.location}
                                      />
                                      <Button variant="outline" size="icon" title="Usar GPS">
                                        <MapPin className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="altitude">Altitud (m.s.n.m.)</Label>
                                      <Input id="altitude" type="number" placeholder="Altitud" />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="collection-date">Fecha de Recolección</Label>
                                      <Input
                                        id="collection-date"
                                        type="date"
                                        defaultValue={sample.date.split("/").reverse().join("-")}
                                      />
                                    </div>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="habitat">Hábitat</Label>
                                    <Select>
                                      <SelectTrigger id="habitat">
                                        <SelectValue placeholder="Seleccionar hábitat" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="bosque-humedo">Bosque Húmedo Tropical</SelectItem>
                                        <SelectItem value="bosque-seco">Bosque Seco Tropical</SelectItem>
                                        <SelectItem value="manglar">Manglar</SelectItem>
                                        <SelectItem value="paramo">Páramo</SelectItem>
                                        <SelectItem value="bosque-nublado">Bosque Nublado</SelectItem>
                                        <SelectItem value="bosque-andino">Bosque Andino</SelectItem>
                                        <SelectItem value="otro">Otro</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="phenology">Fenología</Label>
                                    <Select>
                                      <SelectTrigger id="phenology">
                                        <SelectValue placeholder="Seleccionar fenología" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="vegetativo">Vegetativo</SelectItem>
                                        <SelectItem value="floracion">Floración</SelectItem>
                                        <SelectItem value="fructificacion">Fructificación</SelectItem>
                                        <SelectItem value="senescencia">Senescencia</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="abundance">Abundancia</Label>
                                    <Select>
                                      <SelectTrigger id="abundance">
                                        <SelectValue placeholder="Seleccionar abundancia" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="rara">Rara</SelectItem>
                                        <SelectItem value="ocasional">Ocasional</SelectItem>
                                        <SelectItem value="frecuente">Frecuente</SelectItem>
                                        <SelectItem value="abundante">Abundante</SelectItem>
                                        <SelectItem value="dominante">Dominante</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="morphology">Notas Morfológicas</Label>
                                <Textarea
                                  id="morphology"
                                  placeholder="Descripción detallada de las características morfológicas"
                                  className="min-h-[100px]"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="uses">Usos Conocidos</Label>
                                <Textarea
                                  id="uses"
                                  placeholder="Usos tradicionales o conocidos de la especie"
                                  className="min-h-[80px]"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label>Fotografías Adicionales</Label>
                                <Button variant="outline" className="w-full justify-start gap-2">
                                  <Camera className="h-4 w-4" />
                                  Adjuntar Fotografías
                                </Button>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setOpenFormDialog(false)}>
                                Cancelar
                              </Button>
                              <Button className="bg-green-700 hover:bg-green-800" onClick={handleCompleteForm}>
                                Guardar Formulario
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Formularios Completados</CardTitle>
                <CardDescription>Muestras con formularios detallados ya completados.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Leaf className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No hay formularios completados</h3>
                  <p className="text-sm text-muted-foreground mt-2">Los formularios completados aparecerán aquí.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
