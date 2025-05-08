"use client"

import type React from "react"

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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Camera, ImageIcon, MapPin } from "lucide-react"
import { useAppStore, generateId, formatDate } from "@/lib/store"

export default function RegistroFotograficoPage() {
  const { toast } = useToast()
  const [openCaptureDialog, setOpenCaptureDialog] = useState(false)

  // Estados para el formulario
  const [photoTitle, setPhotoTitle] = useState("")
  const [photoType, setPhotoType] = useState("")
  const [photoLocation, setPhotoLocation] = useState("")
  const [photoNotes, setPhotoNotes] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const { state, dispatch } = useAppStore()
  const { photos, currentUser } = state

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCapturePhoto = () => {
    if (!photoTitle || !photoType || !photoLocation) {
      toast({
        title: "Error al registrar fotografía",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    if (!previewImage) {
      toast({
        title: "Error al registrar fotografía",
        description: "Por favor seleccione o capture una fotografía",
        variant: "destructive",
      })
      return
    }

    const newPhoto = {
      id: generateId("FOTO"),
      title: photoTitle,
      location: photoLocation,
      date: formatDate(new Date()),
      photographer: currentUser?.name || "Usuario Actual",
      thumbnail: previewImage,
      type: photoType,
      notes: photoNotes,
    }

    dispatch({ type: "ADD_PHOTO", payload: newPhoto })

    toast({
      title: "Fotografía registrada",
      description: "La fotografía ha sido registrada exitosamente",
    })

    // Limpiar formulario
    setPhotoTitle("")
    setPhotoType("")
    setPhotoLocation("")
    setPhotoNotes("")
    setPreviewImage(null)
    setOpenCaptureDialog(false)
  }

  return (
    <DashboardLayout role="auxiliar">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Registro Fotográfico</h1>
          <p className="text-muted-foreground">Capture y gestione fotografías del área de trabajo.</p>
        </div>

        <div className="flex justify-end">
          <Dialog open={openCaptureDialog} onOpenChange={setOpenCaptureDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-700 hover:bg-green-800">
                <Camera className="mr-2 h-4 w-4" /> Capturar Fotografía
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Capturar Nueva Fotografía</DialogTitle>
                <DialogDescription>Complete la información de la fotografía a registrar.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="photo-title">Título</Label>
                  <Input
                    id="photo-title"
                    placeholder="Descripción breve de la fotografía"
                    value={photoTitle}
                    onChange={(e) => setPhotoTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="photo-type">Tipo de Fotografía</Label>
                  <Select value={photoType} onValueChange={setPhotoType}>
                    <SelectTrigger id="photo-type">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="panoramica">Panorámica</SelectItem>
                      <SelectItem value="general">Vista General</SelectItem>
                      <SelectItem value="detalle">Detalle</SelectItem>
                      <SelectItem value="especie">Especie</SelectItem>
                      <SelectItem value="habitat">Hábitat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="photo-location">Ubicación</Label>
                  <div className="flex gap-2">
                    <Input
                      id="photo-location"
                      placeholder="Descripción de la ubicación"
                      value={photoLocation}
                      onChange={(e) => setPhotoLocation(e.target.value)}
                    />
                    <Button variant="outline" size="icon" title="Usar GPS">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="photo-notes">Notas</Label>
                  <Textarea
                    id="photo-notes"
                    placeholder="Observaciones adicionales sobre la fotografía"
                    value={photoNotes}
                    onChange={(e) => setPhotoNotes(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Fotografía</Label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md p-6 text-center">
                    {previewImage ? (
                      <div className="relative w-full aspect-video mb-2">
                        <img
                          src={previewImage || "/placeholder.svg"}
                          alt="Vista previa"
                          className="object-cover w-full h-full rounded-md"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setPreviewImage(null)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">Haga clic para seleccionar una fotografía</p>
                      </>
                    )}
                    <div className="flex gap-2 w-full">
                      <label className="w-full">
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        <Button variant="secondary" className="w-full" asChild>
                          <span>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Seleccionar Imagen
                          </span>
                        </Button>
                      </label>
                      <Button variant="secondary" className="w-full">
                        <Camera className="mr-2 h-4 w-4" />
                        Abrir Cámara
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenCaptureDialog(false)}>
                  Cancelar
                </Button>
                <Button className="bg-green-700 hover:bg-green-800" onClick={handleCapturePhoto}>
                  Guardar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={photo.thumbnail || "/placeholder.svg"}
                  alt={photo.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{photo.title}</CardTitle>
                <CardDescription>
                  ID: {photo.id} | Fecha: {photo.date}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-sm">
                  <p>
                    <span className="font-medium">Ubicación:</span> {photo.location}
                  </p>
                  <p>
                    <span className="font-medium">Fotógrafo:</span> {photo.photographer}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="p-4 flex gap-2">
                <Button variant="outline" className="w-full">
                  Ver Detalles
                </Button>
                <Button variant="outline" className="w-full">
                  Descargar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
