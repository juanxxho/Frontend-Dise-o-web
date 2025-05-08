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
import { useAppStore } from "@/lib/store"

export default function UsuariosPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [openCreateDialog, setOpenCreateDialog] = useState(false)

  // Estados para el formulario
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userRole, setUserRole] = useState("")
  const [userPhone, setUserPhone] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [errors, setErrors] = useState<{ name?: string; email?: string; role?: string; password?: string }>({})

  const { state, dispatch } = useAppStore()
  const { users, experts } = state

  // Combinar usuarios y expertos para mostrarlos juntos
  const allUsers = [
    ...users,
    ...experts.map((expert) => ({
      id: expert.id,
      name: expert.name,
      email: expert.email || `${expert.name.toLowerCase().replace(" ", ".")}@ejemplo.com`,
      role:
        expert.role.toLowerCase() === "jefe de brigada"
          ? "jefe"
          : expert.role.toLowerCase() === "botánico"
            ? "botanico"
            : expert.role.toLowerCase() === "auxiliar técnico"
              ? "auxiliar"
              : "coinvestigador",
    })),
  ]

  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; role?: string; password?: string } = {}
    let isValid = true

    // Validar nombre
    if (!userName) {
      newErrors.name = "El nombre es obligatorio"
      isValid = false
    }

    // Validar email
    if (!userEmail) {
      newErrors.email = "El correo electrónico es obligatorio"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(userEmail)) {
      newErrors.email = "Por favor ingrese un correo electrónico válido"
      isValid = false
    } else if (users.some((u) => u.email === userEmail)) {
      newErrors.email = "Este correo electrónico ya está registrado"
      isValid = false
    }

    // Validar rol
    if (!userRole) {
      newErrors.role = "Por favor seleccione un rol"
      isValid = false
    }

    // Validar contraseña
    if (!userPassword) {
      newErrors.password = "La contraseña es obligatoria"
      isValid = false
    } else if (userPassword.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleCreateUser = () => {
    if (!validateForm()) {
      return
    }

    const newUser = {
      id: `USR-${(users.length + 1).toString().padStart(3, "0")}`,
      name: userName,
      email: userEmail,
      role: userRole as any,
      phone: userPhone,
      password: userPassword,
    }

    // Actualizar el estado global
    dispatch({
      type: "ADD_USER",
      payload: newUser,
    })

    toast({
      title: "Usuario creado",
      description: "El usuario ha sido creado exitosamente",
    })

    // Limpiar formulario
    setUserName("")
    setUserEmail("")
    setUserRole("")
    setUserPhone("")
    setUserPassword("")
    setErrors({})
    setOpenCreateDialog(false)
  }

  return (
    <DashboardLayout role="administrador">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administre los usuarios del Inventario Forestal Nacional.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar usuarios..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-700 hover:bg-green-800">
                <Plus className="mr-2 h-4 w-4" /> Crear Usuario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                <DialogDescription>Complete la información para crear un nuevo usuario.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="user-name">Nombre Completo</Label>
                  <Input
                    id="user-name"
                    placeholder="Ej: Juan Pérez"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-email">Correo Electrónico</Label>
                  <Input
                    id="user-email"
                    type="email"
                    placeholder="Ej: juan.perez@ejemplo.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-password">Contraseña</Label>
                  <Input
                    id="user-password"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-role">Rol</Label>
                  <Select value={userRole} onValueChange={setUserRole}>
                    <SelectTrigger id="user-role" className={errors.role ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="administrador">Administrador</SelectItem>
                      <SelectItem value="jefe">Jefe de Brigada</SelectItem>
                      <SelectItem value="botanico">Botánico</SelectItem>
                      <SelectItem value="auxiliar">Auxiliar Técnico</SelectItem>
                      <SelectItem value="coinvestigador">Co-investigador</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-phone">Teléfono (opcional)</Label>
                  <Input
                    id="user-phone"
                    placeholder="Ej: +123 456 7890"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button className="bg-green-700 hover:bg-green-800" onClick={handleCreateUser}>
                  Crear Usuario
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usuarios</CardTitle>
            <CardDescription>Listado de todos los usuarios registrados en el sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo Electrónico</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.role === "administrador"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "jefe"
                              ? "bg-blue-100 text-blue-800"
                              : user.role === "botanico"
                                ? "bg-green-100 text-green-800"
                                : user.role === "auxiliar"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-indigo-100 text-indigo-800"
                        }`}
                      >
                        {user.role === "administrador"
                          ? "Administrador"
                          : user.role === "jefe"
                            ? "Jefe de Brigada"
                            : user.role === "botanico"
                              ? "Botánico"
                              : user.role === "auxiliar"
                                ? "Auxiliar Técnico"
                                : "Co-investigador"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Editar
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
