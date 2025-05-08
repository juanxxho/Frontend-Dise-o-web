"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, CheckCircle2, Users, FileText, ClipboardList } from "lucide-react"

export default function GuiaUsoPage() {
  return (
    <DashboardLayout role="administrador">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Guía de Uso del Sistema</h1>
          <p className="text-muted-foreground">
            Aprende a utilizar todas las funcionalidades del Inventario Forestal Nacional.
          </p>
        </div>

        <Tabs defaultValue="usuarios" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto">
            <TabsTrigger
              value="usuarios"
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900"
            >
              Usuarios
            </TabsTrigger>
            <TabsTrigger
              value="brigadas"
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900"
            >
              Brigadas
            </TabsTrigger>
            <TabsTrigger
              value="investigaciones"
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900"
            >
              Investigaciones
            </TabsTrigger>
            <TabsTrigger value="tareas" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900">
              Tareas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="usuarios" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" /> Gestión de Usuarios
                </CardTitle>
                <CardDescription>Cómo crear y gestionar usuarios en el sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="font-medium text-lg mb-2">Crear un nuevo usuario</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      Inicia sesión como <span className="font-medium">Administrador</span>
                    </li>
                    <li>
                      Ve a la sección <span className="font-medium">Usuarios</span> en el menú lateral
                    </li>
                    <li>
                      Haz clic en el botón <span className="font-medium">Crear Usuario</span>
                    </li>
                    <li>
                      Completa el formulario con:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Nombre completo</li>
                        <li>Correo electrónico</li>
                        <li>Rol (Administrador, Jefe de Brigada, Botánico, etc.)</li>
                        <li>Teléfono (opcional)</li>
                      </ul>
                    </li>
                    <li>
                      Haz clic en <span className="font-medium">Crear Usuario</span>
                    </li>
                  </ol>
                  <div className="mt-4 bg-amber-50 p-3 rounded-md border border-amber-200">
                    <p className="text-amber-800 text-sm">
                      <strong>Nota:</strong> Los usuarios creados se almacenan localmente en tu navegador y estarán
                      disponibles para iniciar sesión inmediatamente.
                    </p>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="font-medium text-lg mb-2">Iniciar sesión con un usuario creado</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Cierra sesión si estás dentro del sistema</li>
                    <li>
                      En la pantalla de inicio de sesión, ingresa:
                      <ul className="list-disc pl-5 mt-1">
                        <li>El correo electrónico del usuario creado</li>
                        <li>Cualquier contraseña (en esta demo no se validan contraseñas)</li>
                        <li>Selecciona el rol correcto del usuario</li>
                      </ul>
                    </li>
                    <li>
                      Haz clic en <span className="font-medium">Iniciar Sesión</span>
                    </li>
                    <li>Verás el dashboard correspondiente al rol del usuario</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brigadas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" /> Gestión de Brigadas
                </CardTitle>
                <CardDescription>Cómo crear brigadas y asignarlas a investigaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="font-medium text-lg mb-2">Crear una nueva brigada</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      Inicia sesión como <span className="font-medium">Administrador</span>
                    </li>
                    <li>
                      Ve a la sección <span className="font-medium">Brigadas</span> en el menú lateral
                    </li>
                    <li>
                      Haz clic en el botón <span className="font-medium">Crear Brigada</span>
                    </li>
                    <li>
                      Completa el formulario con:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Nombre de la brigada (ej: "Brigada Amazonas")</li>
                        <li>Selecciona un Jefe de Brigada</li>
                        <li>Selecciona un Botánico</li>
                        <li>Selecciona un Auxiliar Técnico</li>
                      </ul>
                    </li>
                    <li>
                      Haz clic en <span className="font-medium">Crear Brigada</span>
                    </li>
                  </ol>
                  <div className="mt-4 flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle2 className="h-4 w-4" /> La brigada se crea en estado "Inactiva" hasta que sea asignada
                    a una investigación.
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="font-medium text-lg mb-2">Asignar una brigada a una investigación</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>En la lista de brigadas, busca la brigada que deseas asignar</li>
                    <li>
                      Haz clic en el botón <span className="font-medium">Asignar</span> junto a la brigada
                    </li>
                    <li>En el diálogo que aparece, selecciona la investigación a la que quieres asignar la brigada</li>
                    <li>
                      Haz clic en <span className="font-medium">Asignar</span>
                    </li>
                  </ol>
                  <div className="mt-4 flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle2 className="h-4 w-4" /> La brigada cambiará a estado "Activa" y la investigación a "En
                    Proceso".
                  </div>
                </div>

                <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-200">
                  <p className="text-blue-800 text-sm">
                    <strong>Consejo:</strong> Primero crea las investigaciones antes de asignar brigadas. Una brigada
                    solo puede estar asignada a una investigación a la vez.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investigaciones" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" /> Gestión de Investigaciones
                </CardTitle>
                <CardDescription>Cómo crear y gestionar investigaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="font-medium text-lg mb-2">Crear una nueva investigación</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      Inicia sesión como <span className="font-medium">Administrador</span>
                    </li>
                    <li>
                      Ve a la sección <span className="font-medium">Investigaciones</span> en el menú lateral
                    </li>
                    <li>
                      Haz clic en el botón <span className="font-medium">Crear Investigación</span>
                    </li>
                    <li>
                      Completa el formulario con:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Nombre de la investigación</li>
                        <li>Tipo de investigación</li>
                        <li>Ubicación</li>
                        <li>Descripción detallada</li>
                      </ul>
                    </li>
                    <li>
                      Haz clic en <span className="font-medium">Crear Investigación</span>
                    </li>
                  </ol>
                  <div className="mt-4 flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle2 className="h-4 w-4" /> La investigación se crea en estado "Pendiente" hasta que se le
                    asigne una brigada.
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="font-medium text-lg mb-2">Flujo completo de una investigación</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                        1
                      </div>
                      <div>
                        Crear investigación <ArrowRight className="inline h-4 w-4" /> Estado:{" "}
                        <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800">Pendiente</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                        2
                      </div>
                      <div>
                        Asignar brigada <ArrowRight className="inline h-4 w-4" /> Estado:{" "}
                        <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">En Proceso</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                        3
                      </div>
                      <div>Crear tareas para los miembros de la brigada</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                        4
                      </div>
                      <div>Monitorear progreso y completar tareas</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tareas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-green-600" /> Gestión de Tareas
                </CardTitle>
                <CardDescription>Cómo crear y asignar tareas a los miembros de las brigadas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="font-medium text-lg mb-2">Crear y asignar tareas</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      Inicia sesión como <span className="font-medium">Jefe de Brigada</span>
                    </li>
                    <li>
                      Ve a la sección <span className="font-medium">Tareas</span> en el menú lateral
                    </li>
                    <li>
                      Haz clic en el botón <span className="font-medium">Crear Tarea</span>
                    </li>
                    <li>
                      Completa el formulario con:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Título de la tarea</li>
                        <li>Asignar a: selecciona cualquier miembro de la brigada</li>
                        <li>Fecha límite</li>
                        <li>Descripción detallada</li>
                      </ul>
                    </li>
                    <li>
                      Haz clic en <span className="font-medium">Crear Tarea</span>
                    </li>
                  </ol>
                  <div className="mt-4 flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle2 className="h-4 w-4" /> La tarea se crea en estado "Pendiente" y aparecerá en el
                    dashboard del usuario asignado.
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="font-medium text-lg mb-2">Actualizar estado de tareas</h3>
                  <p className="mb-3">Cada usuario puede actualizar el estado de sus tareas asignadas:</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Inicia sesión con el usuario al que se le asignó la tarea</li>
                    <li>
                      Ve a la sección <span className="font-medium">Tareas Asignadas</span>
                    </li>
                    <li>Busca la tarea que deseas actualizar</li>
                    <li>
                      Haz clic en <span className="font-medium">Actualizar Estado</span>
                    </li>
                    <li>
                      Selecciona el nuevo estado:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Pendiente</li>
                        <li>En Proceso</li>
                        <li>Completada</li>
                      </ul>
                    </li>
                    <li>
                      Haz clic en <span className="font-medium">Actualizar</span>
                    </li>
                  </ol>
                </div>

                <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-200">
                  <p className="text-blue-800 text-sm">
                    <strong>Importante:</strong> Todas las tareas, brigadas, investigaciones y usuarios se almacenan
                    localmente en tu navegador. Esto significa que puedes crear un flujo de trabajo completo y probar
                    todas las funcionalidades sin necesidad de una base de datos externa.
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
