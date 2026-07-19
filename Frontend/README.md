# Guía para el Backend — Integrante 4

Este documento explica **qué debe construir el backend** para reemplazar la API REST simulada que usa el frontend Angular. Mientras no exista, el frontend funciona con `angular-in-memory-web-api` (ver `src/app/services/in-memory-data.service.ts`), que imita exactamente este mismo contrato.

## 1. Resumen

El frontend consume una API REST en la ruta base `/api/estudiantes` a través de `src/app/services/academic.service.ts`. El backend debe exponer los mismos endpoints, con el mismo formato de datos, para que el frontend funcione sin cambios (solo se actualiza la URL base).

## 2. Modelo de datos

```ts
interface Curso {
  id: string;
  nombre: string;
  calificacion: number;   // 0 a 20
}

interface Estudiante {
  id: string;
  codigo: string;          // Ej. "U202310452" -> formato: U + 8-9 dígitos
  nombres: string;
  apellidos: string;
  correo: string;          // Correo institucional: usuario@institucion.edu.pe
  carrera: string;
  ciclo: string;           // "I" a "X"
  cursos: Curso[];
}
```

Ejemplo de JSON de un estudiante:

```json
{
  "id": "1",
  "codigo": "U202310452",
  "nombres": "María Elena",
  "apellidos": "Flores Ruiz",
  "correo": "mfloresr@institucion.edu.pe",
  "carrera": "Ingeniería de Sistemas",
  "ciclo": "V",
  "cursos": [
    { "id": "c1", "nombre": "Base de Datos I", "calificacion": 15 }
  ]
}
```

> El cálculo de promedio y la condición (Aprobado/Desaprobado/Sin calificación) **no se guardan en la base de datos**: el frontend los calcula en el momento a partir de `cursos`. El backend solo necesita persistir y devolver los `cursos` tal cual.

## 3. Endpoints requeridos

Base URL sugerida: `/api/estudiantes`

| Método | Ruta | Body (request) | Respuesta (200/201) | Uso en el frontend |
|---|---|---|---|---|
| `GET` | `/api/estudiantes` | — | `Estudiante[]` | Listado y dashboard |
| `GET` | `/api/estudiantes/:id` | — | `Estudiante` | Página de detalle |
| `POST` | `/api/estudiantes` | `Estudiante` sin `id` (con `cursos: []`) | `Estudiante` creado (con `id` generado) | Registrar estudiante |
| `PUT` | `/api/estudiantes/:id` | `Estudiante` completo o parcial (incluye `id`) | `Estudiante` actualizado | Editar datos o actualizar `cursos` |
| `DELETE` | `/api/estudiantes/:id` | — | `204 No Content` o `{}` | Eliminar estudiante |

Notas importantes:
- `PUT` se usa tanto para editar los datos del estudiante como para actualizar su lista de `cursos` (cuando se agrega/elimina un curso, el frontend manda el arreglo `cursos` completo dentro del `PUT`).
- Los `id` de `Curso` los genera el frontend (string aleatorio); el backend solo debe guardarlos tal cual vienen.

## 4. Códigos de error esperados

El frontend interpreta estos códigos específicamente (ver `handleError` en `academic.service.ts`):

| Código HTTP | Cuándo usarlo | Mensaje que verá el usuario |
|---|---|---|
| `404` | El `id` del estudiante no existe | "El estudiante solicitado no existe." |
| `409` | El `codigo` o `correo` ya están registrados | "Ya existe un registro con ese código o correo." |
| `500` (o superior) | Error interno del servidor | "Error interno del servidor. Intente más tarde." |
| Sin respuesta / caído | — | "No se pudo conectar con el servidor." |

Para `409`, idealmente el backend valida antes de insertar/actualizar:
- Código duplicado (excluyendo al propio estudiante si es una edición).
- Correo institucional duplicado (excluyendo al propio estudiante si es una edición).

## 5. CORS

El frontend Angular corre en `http://localhost:4200`. El backend debe habilitar CORS para ese origen (o para `*` en desarrollo), permitiendo los métodos `GET, POST, PUT, DELETE` y el header `Content-Type: application/json`.

## 6. Validaciones que ya hace el frontend (no es necesario duplicarlas todas, pero ayuda si el backend también valida)

- `codigo`: formato `U` + 8 o 9 dígitos.
- `correo`: debe terminar en `@institucion.edu.pe`.
- `calificacion` de curso: entre 0 y 20.

## 7. Cómo conectar el backend real cuando esté listo

En `src/app/app.config.ts`, quitar (o condicionar) este bloque que activa el mock:

```ts
importProvidersFrom(
  HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { delay: 300, apiBase: 'api/' })
)
```

Y configurar la URL real del backend en `academic.service.ts` (variable `API_URL`), por ejemplo apuntando a `http://localhost:3000/api/estudiantes` o usando un `environment.ts` con la URL de producción.

## 8. Stack sugerido

La rúbrica no exige una tecnología específica de backend para este ejercicio (a diferencia de los ejercicios 3 y 4, que piden Node.js + Express). Se recomienda **Node.js + Express** por rapidez de desarrollo y porque coincide con el resto del curso, pero cualquier stack que cumpla el contrato de arriba (Spring Boot, NestJS, etc.) es válido — lo único que importa es que las rutas, formatos de datos y códigos de error coincidan con lo que espera el frontend.
