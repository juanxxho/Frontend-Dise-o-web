"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAppStore } from "@/lib/store"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string; role?: string }>({})
  const { toast } = useToast()
  const router = useRouter()
  const { state, dispatch } = useAppStore()

  // Limpiar errores cuando cambian los campos
  useEffect(() => {
    setErrors({})
  }, [email, password, role])

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; role?: string } = {}
    let isValid = true

    // Validar email
    if (!email) {
      newErrors.email = "El correo electrónico es obligatorio"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Por favor ingrese un correo electrónico válido"
      isValid = false
    }

    // Validar contraseña
    if (!password) {
      newErrors.password = "La contraseña es obligatoria"
      isValid = false
    } else if (password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres"
      isValid = false
    }

    // Validar rol
    if (!role) {
      newErrors.role = "Por favor seleccione un rol"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Intentar iniciar sesión
    dispatch({ type: "LOGIN", payload: { email, role, password } })

    // Verificar si hubo error de inicio de sesión
    if (state.loginError) {
      toast({
        title: "Error de inicio de sesión",
        description: state.loginError,
        variant: "destructive",
      })
      return
    }

    // Si no hay error, el usuario debería estar autenticado
    if (state.currentUser) {
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido al Sistema de Inventario Forestal Nacional, ${state.currentUser.name}`,
      })
      router.push(`/dashboard/${role}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16">
              <Image
                src="/placeholder.svg?height=64&width=64"
                alt="Logo Inventario Forestal"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">Inventario Forestal Nacional</CardTitle>
          <CardDescription>Ingrese sus credenciales para acceder al sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {state.loginError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{state.loginError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role" className={errors.role ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccione su rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="administrador">Administrador</SelectItem>
                  <SelectItem value="jefe">Jefe de Brigada</SelectItem>
                  <SelectItem value="auxiliar">Auxiliar Técnico</SelectItem>
                  <SelectItem value="botanico">Botánico</SelectItem>
                  <SelectItem value="coinvestigador">Co-investigador</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
            </div>

            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                <strong>Usuarios de prueba:</strong> admin@ejemplo.com, juan@ejemplo.com, pedro@ejemplo.com,
                maria@ejemplo.com, carlos@ejemplo.com
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Contraseña:</strong> password123
              </p>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-green-700 hover:bg-green-800" onClick={handleLogin}>
            Iniciar Sesión
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
