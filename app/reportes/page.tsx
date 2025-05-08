"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Download, FileText, Filter } from "lucide-react"
import { useAppStore } from "@/lib/store"

export default function ReportesPage() {
  const { toast } = useToast()
  const [reportType, setReportType] = useState("muestras")
  const [timeFrame, setTimeFrame] = useState("mensual")

  const { state } = useAppStore()
  const { samples, brigades, investigations, issues } = state

  // Datos para gráficos
  const samplesByType = [
    { name: "Árboles", value: samples.filter((s) => s.type === "arbol").length || 2 },
    { name: "Arbustos", value: samples.filter((s) => s.type === "arbusto").length || 1 },
    { name: "Hierbas", value: samples.filter((s) => s.type === "hierba").length || 1 },
    { name: "Lianas", value: samples.filter((s) => s.type === "liana").length || 0 },
    { name: "Epífitas", value: samples.filter((s) => s.type === "epifita").length || 0 },
  ]

  const issuesByType = [
    { name: "Equipo", value: issues.filter((i) => i.type === "equipo" || i.type === "Equipo").length || 2 },
    { name: "Acceso", value: issues.filter((i) => i.type === "acceso" || i.type === "Acceso").length || 1 },
    { name: "Seguridad", value: issues.filter((i) => i.type === "seguridad" || i.type === "Seguridad").length || 0 },
    { name: "Clima", value: issues.filter((i) => i.type === "clima" || i.type === "Clima").length || 0 },
    { name: "Personal", value: issues.filter((i) => i.type === "personal" || i.type === "Personal").length || 0 },
  ]

  const investigationsByStatus = [
    { name: "Pendiente", value: investigations.filter((i) => i.status === "Pendiente").length },
    { name: "En Proceso", value: investigations.filter((i) => i.status === "En Proceso").length },
    { name: "Completada", value: investigations.filter((i) => i.status === "Completada").length || 0 },
  ]

  const brigadeActivity = [
    { name: "Amazonas", muestras: 12, novedades: 3, tareas: 8 },
    { name: "Sierra Central", muestras: 8, novedades: 2, tareas: 6 },
    { name: "Costa Pacífica", muestras: 10, novedades: 1, tareas: 7 },
    { name: "Galápagos", muestras: 0, novedades: 0, tareas: 0 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  const handleGenerateReport = () => {
    toast({
      title: "Reporte generado",
      description: "El reporte ha sido generado exitosamente",
    })
  }

  return (
    <DashboardLayout role="administrador">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Reportes y Estadísticas</h1>
          <p className="text-muted-foreground">Visualice y genere reportes del Inventario Forestal Nacional.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Filtros de Reporte</CardTitle>
              <CardDescription>Seleccione los parámetros para generar reportes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/3">
                  <label className="text-sm font-medium mb-2 block">Tipo de Reporte</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="muestras">Muestras Recolectadas</SelectItem>
                      <SelectItem value="brigadas">Actividad de Brigadas</SelectItem>
                      <SelectItem value="investigaciones">Investigaciones</SelectItem>
                      <SelectItem value="novedades">Novedades Reportadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-1/3">
                  <label className="text-sm font-medium mb-2 block">Período</label>
                  <Select value={timeFrame} onValueChange={setTimeFrame}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="mensual">Mensual</SelectItem>
                      <SelectItem value="trimestral">Trimestral</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-1/3 flex items-end">
                  <Button className="w-full bg-green-700 hover:bg-green-800" onClick={handleGenerateReport}>
                    <Filter className="mr-2 h-4 w-4" /> Aplicar Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="graficos" className="space-y-4">
          <TabsList>
            <TabsTrigger value="graficos">Gráficos</TabsTrigger>
            <TabsTrigger value="tablas">Tablas</TabsTrigger>
          </TabsList>

          <TabsContent value="graficos" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Muestras por Tipo</CardTitle>
                  <CardDescription>Distribución de muestras recolectadas por tipo de especie</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={samplesByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {samplesByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Novedades por Tipo</CardTitle>
                  <CardDescription>Distribución de novedades reportadas por tipo</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={issuesByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {issuesByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Investigaciones por Estado</CardTitle>
                  <CardDescription>Distribución de investigaciones por estado actual</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={investigationsByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {investigationsByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actividad por Brigada</CardTitle>
                  <CardDescription>Comparación de actividad entre brigadas</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={brigadeActivity}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="muestras" name="Muestras" fill="#8884d8" />
                      <Bar dataKey="novedades" name="Novedades" fill="#82ca9d" />
                      <Bar dataKey="tareas" name="Tareas" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tablas" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Reporte Detallado</CardTitle>
                  <CardDescription>Datos tabulares para análisis detallado</CardDescription>
                </div>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" /> Exportar
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Reporte generado</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                    El reporte ha sido generado y está listo para ser descargado. Haga clic en el botón "Exportar" para
                    descargar el archivo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
