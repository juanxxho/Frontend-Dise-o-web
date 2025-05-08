"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

// Tipos de datos
export type User = {
  id: string
  name: string
  email: string
  role: "administrador" | "jefe" | "auxiliar" | "botanico" | "coinvestigador"
  password?: string
  brigadeId?: string // ID de la brigada a la que pertenece
}

export type Brigade = {
  id: string
  name: string
  members: number
  status: "Activa" | "Inactiva"
  investigation: string
  leaderId?: string // ID del jefe de brigada
  memberIds?: string[] // IDs de los miembros
}

export type Investigation = {
  id: string
  name: string
  status: "Pendiente" | "En Proceso" | "Completada"
  brigadeId?: string
  startDate?: string
  type?: string
  description?: string
  location?: string
}

export type Task = {
  id: string
  title: string
  assignedTo: string
  assignedToId?: string // ID del usuario asignado
  brigadeId?: string // ID de la brigada a la que pertenece la tarea
  dueDate: string
  status: "Pendiente" | "En Proceso" | "Completada"
  description: string
}

export type Sample = {
  id: string
  species: string
  commonName: string
  location: string
  collector: string
  date: string
  status: "Registrada" | "Procesada"
  type?: string
  conservationStatus?: string
  observations?: string
  image?: string // URL o base64 de la imagen
}

export type Equipment = {
  id: string
  name: string
  type: string
  status: string
  assignedTo: string
  condition: string
  notes?: string
  acquisitionDate?: string
  lastMaintenanceDate?: string
}

export type Issue = {
  id: string
  title: string
  type: string
  priority: "Baja" | "Media" | "Alta" | "Crítica"
  location: string
  reporter: string
  date: string
  status: "Pendiente" | "Reportado" | "Resuelto"
  description?: string
}

export type Photo = {
  id: string
  title: string
  location: string
  date: string
  photographer: string
  thumbnail: string
  type?: string
  notes?: string
  image?: string // URL o base64 de la imagen
}

export type Expert = {
  id: string
  name: string
  role: string
  email: string
  phone?: string
  brigadeId?: string // ID de la brigada a la que pertenece
}

export type Observation = {
  id: string
  type: string
  location: string
  date: string
  observer: string
  notes: string
}

// Estado global
type AppState = {
  currentUser: User | null
  loginError: string | null
  users: User[]
  brigades: Brigade[]
  investigations: Investigation[]
  tasks: Task[]
  samples: Sample[]
  equipment: Equipment[]
  issues: Issue[]
  photos: Photo[]
  experts: Expert[]
  observations: Observation[]
}

// Acciones
type AppAction =
  | { type: "LOGIN"; payload: { email: string; role: string; password: string } }
  | { type: "LOGOUT" }
  | { type: "ADD_BRIGADE"; payload: Brigade }
  | { type: "ASSIGN_BRIGADE"; payload: { brigadeId: string; investigationId: string } }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: { id: string; status: string } }
  | { type: "ADD_SAMPLE"; payload: Sample }
  | { type: "UPDATE_SAMPLE"; payload: Sample }
  | { type: "ADD_ISSUE"; payload: Issue }
  | { type: "ADD_PHOTO"; payload: Photo }
  | { type: "UPDATE_EQUIPMENT"; payload: { id: string; status: string; condition: string } }
  | { type: "ADD_INVESTIGATION"; payload: Investigation }
  | { type: "ADD_USER"; payload: User }
  | { type: "ADD_OBSERVATION"; payload: Observation }
  | { type: "ADD_EQUIPMENT"; payload: Equipment }
  | { type: "UPDATE_EQUIPMENT_FULL"; payload: Equipment }
  | { type: "DELETE_EQUIPMENT"; payload: { id: string } }

// Contexto
type AppContextType = {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

// Datos iniciales
const initialExperts: Expert[] = [
  {
    id: "USR-001",
    name: "Juan Pérez",
    role: "Jefe de Brigada",
    email: "juan.perez@ejemplo.com",
    phone: "+123 456 7890",
    brigadeId: "BRG-001",
  },
  {
    id: "USR-002",
    name: "María López",
    role: "Botánico",
    email: "maria.lopez@ejemplo.com",
    phone: "+123 456 7891",
    brigadeId: "BRG-001",
  },
  {
    id: "USR-003",
    name: "Carlos Mendoza",
    role: "Botánico",
    email: "carlos.mendoza@ejemplo.com",
    phone: "+123 456 7892",
    brigadeId: "BRG-001",
  },
  {
    id: "USR-004",
    name: "Pedro Suárez",
    role: "Auxiliar Técnico",
    email: "pedro.suarez@ejemplo.com",
    phone: "+123 456 7893",
    brigadeId: "BRG-001",
  },
  {
    id: "USR-005",
    name: "Ana Gómez",
    role: "Botánico",
    email: "ana.gomez@ejemplo.com",
    phone: "+123 456 7894",
    brigadeId: "BRG-002",
  },
  {
    id: "USR-006",
    name: "Luis Torres",
    role: "Auxiliar Técnico",
    email: "luis.torres@ejemplo.com",
    phone: "+123 456 7895",
    brigadeId: "BRG-002",
  },
  {
    id: "USR-007",
    name: "Elena Ruiz",
    role: "Jefe de Brigada",
    email: "elena.ruiz@ejemplo.com",
    phone: "+123 456 7896",
    brigadeId: "BRG-002",
  },
  {
    id: "USR-008",
    name: "Roberto Díaz",
    role: "Botánico",
    email: "roberto.diaz@ejemplo.com",
    phone: "+123 456 7897",
    brigadeId: "BRG-003",
  },
  {
    id: "USR-009",
    name: "Sofía Martínez",
    role: "Jefe de Brigada",
    email: "sofia.martinez@ejemplo.com",
    phone: "+123 456 7899",
    brigadeId: "BRG-003",
  },
]

const initialBrigades: Brigade[] = [
  {
    id: "BRG-001",
    name: "Brigada Amazonas",
    members: 3,
    status: "Activa",
    investigation: "Estudio de Biodiversidad Zona Norte",
    leaderId: "USR-001",
    memberIds: ["USR-001", "USR-002", "USR-003", "USR-004"],
  },
  {
    id: "BRG-002",
    name: "Brigada Sierra Central",
    members: 3,
    status: "Activa",
    investigation: "Monitoreo de Especies Endémicas",
    leaderId: "USR-007",
    memberIds: ["USR-005", "USR-006", "USR-007"],
  },
  {
    id: "BRG-003",
    name: "Brigada Costa Pacífica",
    members: 3,
    status: "Activa",
    investigation: "Inventario Manglar Costero",
    leaderId: "USR-009",
    memberIds: ["USR-008", "USR-009"],
  },
  {
    id: "BRG-004",
    name: "Brigada Galápagos",
    members: 3,
    status: "Inactiva",
    investigation: "Ninguna",
  },
]

const initialInvestigations: Investigation[] = [
  {
    id: "INV-001",
    name: "Estudio de Biodiversidad Zona Norte",
    status: "En Proceso",
    brigadeId: "BRG-001",
    startDate: "2024-03-15",
  },
  {
    id: "INV-002",
    name: "Monitoreo de Especies Endémicas",
    status: "En Proceso",
    brigadeId: "BRG-002",
    startDate: "2024-04-02",
  },
  {
    id: "INV-003",
    name: "Inventario Manglar Costero",
    status: "En Proceso",
    brigadeId: "BRG-003",
    startDate: "2024-04-10",
  },
  { id: "INV-004", name: "Estudio de Especies Invasoras", status: "Pendiente" },
  { id: "INV-005", name: "Monitoreo de Deforestación", status: "Pendiente" },
]

const initialTasks: Task[] = [
  {
    id: "TASK-001",
    title: "Recolectar muestras en la zona norte",
    assignedTo: "María López",
    assignedToId: "USR-002",
    brigadeId: "BRG-001",
    dueDate: "2024-04-25",
    status: "En Proceso",
    description: "Recolectar muestras de especies arbóreas en el sector A-3 de la zona norte.",
  },
  {
    id: "TASK-002",
    title: "Documentar especies encontradas en sector A-3",
    assignedTo: "Carlos Mendoza",
    assignedToId: "USR-003",
    brigadeId: "BRG-001",
    dueDate: "2024-04-26",
    status: "En Proceso",
    description:
      "Documentar todas las especies encontradas en el sector A-3, incluyendo fotografías y notas detalladas.",
  },
  {
    id: "TASK-003",
    title: "Registro fotográfico de la zona de estudio",
    assignedTo: "Pedro Suárez",
    assignedToId: "USR-004",
    brigadeId: "BRG-001",
    dueDate: "2024-04-24",
    status: "Completada",
    description:
      "Realizar un registro fotográfico completo de la zona de estudio, incluyendo vistas panorámicas y detalles.",
  },
  {
    id: "TASK-004",
    title: "Recolectar muestras en la sierra central",
    assignedTo: "Ana Gómez",
    assignedToId: "USR-005",
    brigadeId: "BRG-002",
    dueDate: "2024-04-28",
    status: "Pendiente",
    description: "Recolectar muestras de especies endémicas en la sierra central.",
  },
  {
    id: "TASK-005",
    title: "Documentar especies en manglar costero",
    assignedTo: "Roberto Díaz",
    assignedToId: "USR-008",
    brigadeId: "BRG-003",
    dueDate: "2024-04-30",
    status: "En Proceso",
    description: "Documentar especies en el manglar costero, con énfasis en especies amenazadas.",
  },
]

const initialSamples: Sample[] = [
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

const initialEquipment: Equipment[] = [
  {
    id: "EQ-001",
    name: "GPS Garmin eTrex 30x",
    type: "GPS",
    status: "Funcional",
    assignedTo: "Juan Pérez",
    condition: "Bueno",
    acquisitionDate: "15/01/2024",
    lastMaintenanceDate: "10/04/2024",
  },
  {
    id: "EQ-002",
    name: "Cámara Digital Canon EOS",
    type: "Cámara",
    status: "Funcional",
    assignedTo: "Pedro Suárez",
    condition: "Bueno",
    acquisitionDate: "20/01/2024",
    lastMaintenanceDate: "05/04/2024",
  },
  {
    id: "EQ-003",
    name: "Kit de Recolección Botánica",
    type: "Kit",
    status: "Funcional",
    assignedTo: "María López",
    condition: "Bueno",
    acquisitionDate: "10/02/2024",
    lastMaintenanceDate: "01/04/2024",
  },
  {
    id: "EQ-004",
    name: "Kit de Recolección Botánica",
    type: "Kit",
    status: "Funcional",
    assignedTo: "Carlos Mendoza",
    condition: "Bueno",
    acquisitionDate: "10/02/2024",
    lastMaintenanceDate: "01/04/2024",
  },
  {
    id: "EQ-005",
    name: "Tablet Samsung Galaxy Tab",
    type: "Tablet",
    status: "Batería baja",
    assignedTo: "Brigada Amazonas (Compartido)",
    condition: "Regular",
    acquisitionDate: "05/03/2024",
    lastMaintenanceDate: "15/04/2024",
  },
]

const initialIssues: Issue[] = [
  {
    id: "NOV-001",
    title: "Fallo en GPS",
    type: "Equipo",
    priority: "Alta",
    location: "Zona Norte, Sector A-3",
    reporter: "Juan Pérez",
    date: "22/04/2024",
    status: "Pendiente",
  },
  {
    id: "NOV-002",
    title: "Área inaccesible por derrumbe",
    type: "Acceso",
    priority: "Alta",
    location: "Zona Norte, Sector B-1",
    reporter: "Juan Pérez",
    date: "21/04/2024",
    status: "Reportado",
  },
  {
    id: "NOV-003",
    title: "Batería baja en tablet",
    type: "Equipo",
    priority: "Media",
    location: "Zona Norte, Sector A-2",
    reporter: "Pedro Suárez",
    date: "22/04/2024",
    status: "Pendiente",
  },
]

const initialPhotos: Photo[] = [
  {
    id: "FOTO-001",
    title: "Vista general del área de estudio",
    location: "Zona Norte, Sector A-1",
    date: "22/04/2024",
    photographer: "Pedro Suárez",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "FOTO-002",
    title: "Detalle de vegetación en ribera",
    location: "Zona Norte, Sector A-2",
    date: "22/04/2024",
    photographer: "Pedro Suárez",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "FOTO-003",
    title: "Panorámica del bosque",
    location: "Zona Norte, Sector A-3",
    date: "21/04/2024",
    photographer: "Pedro Suárez",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "FOTO-004",
    title: "Área de claros en el bosque",
    location: "Zona Norte, Sector B-1",
    date: "21/04/2024",
    photographer: "Pedro Suárez",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
]

const initialUsers: User[] = [
  { id: "1", name: "Admin", email: "admin@ejemplo.com", role: "administrador", password: "password123" },
  {
    id: "2",
    name: "Juan Pérez",
    email: "juan@ejemplo.com",
    role: "jefe",
    password: "password123",
    brigadeId: "BRG-001",
  },
  {
    id: "3",
    name: "Pedro Suárez",
    email: "pedro@ejemplo.com",
    role: "auxiliar",
    password: "password123",
    brigadeId: "BRG-001",
  },
  {
    id: "4",
    name: "María López",
    email: "maria@ejemplo.com",
    role: "botanico",
    password: "password123",
    brigadeId: "BRG-001",
  },
  { id: "5", name: "Carlos Mendoza", email: "carlos@ejemplo.com", role: "coinvestigador", password: "password123" },
  {
    id: "6",
    name: "Elena Ruiz",
    email: "elena@ejemplo.com",
    role: "jefe",
    password: "password123",
    brigadeId: "BRG-002",
  },
  {
    id: "7",
    name: "Sofía Martínez",
    email: "sofia@ejemplo.com",
    role: "jefe",
    password: "password123",
    brigadeId: "BRG-003",
  },
]

const initialObservations: Observation[] = []

const initialState: AppState = {
  currentUser: null,
  loginError: null,
  users: initialUsers,
  brigades: initialBrigades,
  investigations: initialInvestigations,
  tasks: initialTasks,
  samples: initialSamples,
  equipment: initialEquipment,
  issues: initialIssues,
  photos: initialPhotos,
  experts: initialExperts,
  observations: initialObservations,
}

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "LOGIN":
      const user = state.users.find(
        (u) =>
          u.email === action.payload.email && u.role === action.payload.role && u.password === action.payload.password,
      )

      if (!user) {
        return {
          ...state,
          loginError: "Credenciales incorrectas. Por favor verifique su email, rol y contraseña.",
        }
      }

      return {
        ...state,
        currentUser: user,
        loginError: null,
      }
    case "LOGOUT":
      return {
        ...state,
        currentUser: null,
      }
    case "ADD_BRIGADE":
      return {
        ...state,
        brigades: [...state.brigades, action.payload],
      }
    case "ASSIGN_BRIGADE":
      return {
        ...state,
        brigades: state.brigades.map((brigade) =>
          brigade.id === action.payload.brigadeId
            ? {
                ...brigade,
                investigation: state.investigations.find((i) => i.id === action.payload.investigationId)?.name || "",
                status: "Activa",
              }
            : brigade,
        ),
        investigations: state.investigations.map((investigation) =>
          investigation.id === action.payload.investigationId
            ? {
                ...investigation,
                brigadeId: action.payload.brigadeId,
                status: "En Proceso",
              }
            : investigation,
        ),
      }
    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      }
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, status: action.payload.status } : task,
        ),
      }
    case "ADD_SAMPLE":
      return {
        ...state,
        samples: [...state.samples, action.payload],
      }
    case "UPDATE_SAMPLE":
      return {
        ...state,
        samples: state.samples.map((sample) =>
          sample.id === action.payload.id ? { ...sample, ...action.payload } : sample,
        ),
      }
    case "ADD_ISSUE":
      return {
        ...state,
        issues: [...state.issues, action.payload],
      }
    case "ADD_PHOTO":
      return {
        ...state,
        photos: [...state.photos, action.payload],
      }
    case "UPDATE_EQUIPMENT":
      return {
        ...state,
        equipment: state.equipment.map((item) =>
          item.id === action.payload.id
            ? { ...item, status: action.payload.status, condition: action.payload.condition }
            : item,
        ),
      }
    case "ADD_INVESTIGATION":
      return {
        ...state,
        investigations: [...state.investigations, action.payload],
      }
    case "ADD_USER":
      return {
        ...state,
        users: [...state.users, action.payload],
      }
    case "ADD_OBSERVATION":
      return {
        ...state,
        observations: [...state.observations, action.payload],
      }
    case "ADD_EQUIPMENT":
      return {
        ...state,
        equipment: [...state.equipment, action.payload],
      }
    case "UPDATE_EQUIPMENT_FULL":
      return {
        ...state,
        equipment: state.equipment.map((item) => (item.id === action.payload.id ? { ...action.payload } : item)),
      }
    case "DELETE_EQUIPMENT":
      return {
        ...state,
        equipment: state.equipment.filter((item) => item.id !== action.payload.id),
      }
    default:
      return state
  }
}

// Crear contexto
const AppContext = createContext<AppContextType | undefined>(undefined)

// Provider
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useState<AppState>(initialState)

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedState = localStorage.getItem("forestInventoryState")
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        // Solo restauramos el estado, no el usuario actual (para forzar login)
        const { currentUser, ...rest } = parsedState
        Object.keys(rest).forEach((key) => {
          if (rest[key as keyof typeof rest]) {
            state[key as keyof typeof state] = rest[key as keyof typeof rest]
          }
        })
      } catch (error) {
        console.error("Error al cargar datos del localStorage:", error)
      }
    }
  }, [])

  // Guardar datos en localStorage cuando cambia el estado
  useEffect(() => {
    if (state.currentUser) {
      localStorage.setItem("forestInventoryState", JSON.stringify(state))
    }
  }, [state])

  // Función de despacho personalizada que también aplica el reducer
  const dispatchAction = (action: AppAction) => {
    const newState = appReducer(state, action)
    dispatch(newState)
  }

  return <AppContext.Provider value={{ state, dispatch: dispatchAction }}>{children}</AppContext.Provider>
}

// Hook para usar el contexto
export function useAppStore() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppStore debe ser usado dentro de un AppProvider")
  }
  return context
}

// Funciones de utilidad para generar IDs
export function generateId(prefix: string): string {
  const existingIds: Record<string, number> = {
    BRG: 4, // Brigadas
    INV: 5, // Investigaciones
    TASK: 5, // Tareas
    MUE: 4, // Muestras
    EQ: 5, // Equipos
    NOV: 3, // Novedades
    FOTO: 4, // Fotos
  }

  const currentCount = existingIds[prefix] || 0
  const newCount = currentCount + 1
  const paddedCount = newCount.toString().padStart(3, "0")
  return `${prefix}-${paddedCount}`
}

// Función para formatear fecha
export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

// Función para obtener los miembros de una brigada
export function getBrigadeMembers(state: AppState, brigadeId: string): (User | Expert)[] {
  if (!brigadeId) return []

  const users = state.users.filter((user) => user.brigadeId === brigadeId)
  const experts = state.experts.filter((expert) => expert.brigadeId === brigadeId)

  return [...users, ...experts]
}

// Función para obtener la brigada de un usuario
export function getUserBrigade(state: AppState, userId: string): Brigade | undefined {
  if (!userId) return undefined

  const user = state.users.find((u) => u.id === userId)
  const expert = state.experts.find((e) => e.id === userId)

  const brigadeId = user?.brigadeId || expert?.brigadeId
  if (!brigadeId) return undefined

  return state.brigades.find((b) => b.id === brigadeId)
}
