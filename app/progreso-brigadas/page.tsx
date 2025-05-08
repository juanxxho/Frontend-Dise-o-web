// Crear una página específica para que el coinvestigador vea el progreso de las brigadas
// Esta es una nueva página

"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"
import { Search, Users } from "lucide-react"

export default function ProgresoBrigadasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { state } = useAppStore()
  const { brigades, investigations } = state

  const filteredBrigades = brigades.filter(
    (brigade) =>
      brigade.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brigade.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout role="coinvestigador">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Progreso de Brigadas</h1>
          <p className="text-muted-foreground">Seguimiento del avance de las brigadas en campo.</p>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrigades
            .filter((brigade) => brigade.status === "Activa")
            .map((brigade) => {
              const investigation = investigations.find((inv) => inv.name === brigade.investigation)

              // Generar un progreso aleatorio para demostración
              const progress = brigade.name.includes("Amazonas")
                ? 45
                : brigade.name.includes("Sierra")
                  ? 30
                  : brigade.name.includes("Pacífica")
                    ? 60
                    : 20

              return (
                <Card key={brigade.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{brigade.name}</CardTitle>
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <CardDescription>ID: {brigade.id}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Investigación:</p>
                        <p className="text-sm text-muted-foreground">{brigade.investigation}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium">Miembros:</p>
                        <p className="text-sm text-muted-foreground">{brigade.members} expertos</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium">Fecha de inicio:</p>
                        <p className="text-sm text-muted-foreground">{investigation?.startDate || "No disponible"}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progreso</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      <Button variant="outline" className="w-full">
                        Ver Detalles
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </div>
      </div>
    </DashboardLayout>
  )
}
