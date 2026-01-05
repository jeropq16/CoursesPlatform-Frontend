
---

## 📘 Backend – `README.md`

# Plataforma de Cursos Online - Backend

Este proyecto implementa una API REST en **.NET 8** siguiendo principios básicos de **Clean Architecture**, con separación de capas y aplicación de reglas de negocio para la gestión de cursos y lecciones.

---

## 🚀 Tecnologías utilizadas
- .NET 8
- Entity Framework Core
- PostgreSQL (puede adaptarse a MySQL)
- Identity + JWT para autenticación
- Migraciones con EF Core
- XUnit para tests unitarios

---

## 📂 Estructura del proyecto
- **Domain** → Entidades y reglas de negocio  
- **Application** → Casos de uso y servicios  
- **Infrastructure** → Persistencia (EF Core, migraciones, repositorios)  
- **WebApi** → Controladores y configuración de la API  

---

## 🗄️ Modelo de Datos

### Course
- Id (GUID)
- Title (string)
- Status (Draft | Published)
- IsDeleted (bool)
- CreatedAt (DateTime)
- UpdatedAt (DateTime)

### Lesson
- Id (GUID)
- CourseId (GUID)
- Title (string)
- Order (int)
- IsDeleted (bool)
- CreatedAt (DateTime)
- UpdatedAt (DateTime)

Relación:  
- Un **Course** puede tener muchas **Lesson**  
- Una **Lesson** pertenece a un solo **Course**

---

## 🔑 Autenticación
- Registro: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- JWT devuelto debe incluirse en el header:  
  ```
  Authorization: Bearer <token>
  ```

---

## 📌 Endpoints principales
- `PATCH /api/courses/{id}/publish` → Publicar curso (si cumple reglas)  
- `PATCH /api/courses/{id}/unpublish` → Despublicar curso  
- `GET /api/courses/search?q=&status=&page=&pageSize=` → Buscar cursos con filtros y paginación  
- `GET /api/courses/{id}/summary` → Resumen del curso (info básica, total lecciones, última modificación)  

---

## 📜 Reglas de negocio implementadas
- Un curso solo puede publicarse si tiene al menos una lección activa.  
- El campo **Order** de las lecciones es único dentro del mismo curso.  
- Eliminación lógica (**soft delete**) con `IsDeleted`.  
- Reordenamiento de lecciones sin duplicados.  
- `/summary` devuelve:
  - Información básica del curso  
  - Total de lecciones  
  - Fecha de última modificación  

---

## 🧪 Tests unitarios
Se implementan al menos 5 tests con XUnit:
1. `PublishCourse_WithLessons_ShouldSucceed`
2. `PublishCourse_WithoutLessons_ShouldFail`
3. `CreateLesson_WithUniqueOrder_ShouldSucceed`
4. `CreateLesson_WithDuplicateOrder_ShouldFail`
5. `DeleteCourse_ShouldBeSoftDelete`

---

## ⚙️ Configuración

### 1. Base de datos
Configurar cadena de conexión en `appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=coursesdb;Username=postgres;Password=yourpassword"
}
```

### 2. Migraciones
```bash
dotnet ef migrations add InitialCreate -p Infrastructure -s WebApi
dotnet ef database update -p Infrastructure -s WebApi
```

### 3. Usuario de prueba (Seed)
- Email: `testuser@example.com`  
- Password: `Test123!`  

---

## ▶️ Ejecución
```bash
dotnet run --project WebApi
```

La API estará disponible en:  
`https://localhost:5001` o `http://localhost:5000`
```

---

## 🌐 Frontend – `README.md`

```markdown
# Plataforma de Cursos Online - Frontend

Este proyecto implementa un **frontend desacoplado** que consume la API REST desarrollada en el backend.  
Se puede implementar en **React**, **Vue**, **Angular** o con **HTML/CSS/JS puro**.

---

## 🚀 Tecnologías utilizadas
- React 18 (ejemplo, puede adaptarse a otro framework)
- Axios para consumo de API
- React Router para navegación
- JWT almacenado en `localStorage`

---

## 📂 Estructura del proyecto
- **src/components** → Componentes reutilizables  
- **src/pages** → Pantallas principales (Cursos, Lecciones, Login)  
- **src/services** → Lógica de consumo de API  
- **src/context** → Manejo de autenticación y estado global  

---

## 🔑 Autenticación
- Pantalla de **Login**  
- Al iniciar sesión se guarda el **JWT** en `localStorage`  
- Todas las llamadas autenticadas incluyen el header:  
  ```
  Authorization: Bearer <token>
  ```

---

## 📌 Funcionalidades

### Cursos
- Listar cursos con:
  - Paginación
  - Filtro por estado (Draft / Published)
- Crear curso
- Editar curso
- Eliminar curso (soft delete)
- Publicar / despublicar curso

### Lecciones
- Listar lecciones por curso (ordenadas por `Order`)
- Crear lección
- Editar lección
- Eliminar lección (soft delete)
- Reordenar lecciones (subir/bajar posición)

---

## ▶️ Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar API base URL
En `src/services/api.js`:
```js
export const API_URL = "http://localhost:5000/api";
```

### 3. Levantar el proyecto
```bash
npm run dev
```

El frontend estará disponible en:  
`http://localhost:5173` (Vite) o `http://localhost:3000` (CRA)

---

## 👤 Usuario de prueba
- Email: `testuser@example.com`  
- Password: `Test123!`  

---

