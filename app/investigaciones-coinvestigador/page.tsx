// Crear una página específica para que el coinvestigador vea las investigaciones
// Esta es una nueva página

"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"
import { Search } from "lucide-react"

export default function InvestigacionesCoinvestigadorPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { state } = useAppStore()
  const { investigations, brigades } = state

  const filteredInvestigations = investigations.filter(
    (investigation) =>
      investigation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investigation.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout role="coinvestigador">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Investigaciones</h1>
          <p className="text-muted-foreground">Seguimiento de investigaciones en curso.</p>
        </div>

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

        <Card>
          <CardHeader>
            <CardTitle>Investigaciones en Curso</CardTitle>
            <CardDescription>Listado de investigaciones activas</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Brigada</TableHead>
                  <TableHead>Fecha Inicio</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvestigations
                  .filter((inv) => inv.status === "En Proceso")
                  .map((investigation) => {
                    const assignedBrigade = brigades.find((b) => b.id === investigation.brigadeId)
                    // Generar un progreso aleatorio para demostración
                    const progress = investigation.name.includes("Biodiversidad")
                      ? 45
                      : investigation.name.includes("Especies")
                        ? 30
                        : investigation.name.includes("Manglar")
                          ? 60
                          : 20

                    return (
                      <TableRow key={investigation.id}>
                        <TableCell className="font-medium">{investigation.id}</TableCell>
                        <TableCell>{investigation.name}</TableCell>
                        <TableCell>{assignedBrigade ? assignedBrigade.name : "No asignada"}</TableCell>
                        <TableCell>{investigation.startDate || "No iniciada"}</TableCell>
                        <TableCell>
                          <div className="w-full">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        </TableCell>
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
