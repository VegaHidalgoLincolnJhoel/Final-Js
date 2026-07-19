# Backend — Sistema de Control Académico

Este es el backend desarrollado con **Spring Boot 3.3.1** y **Java 21** para el control académico de estudiantes, cursos y calificaciones.

## 🚀 Cómo ejecutar el Backend

### Requisitos previos
- **Java 21** instalado en el sistema.
- **Maven** (opcional, ya que incluye el wrapper `./mvnw`).

### Pasos para iniciar el servidor:
1. Navega a la carpeta del backend:
   ```bash
   cd Backend
   ```
2. Ejecuta el servidor en modo desarrollo:
   ```bash
   ./mvnw spring-boot:run
   ```
   *El servidor se iniciará por defecto en `http://localhost:8080`.*

---

## 📂 Base de Datos Local (Persistencia JSON)

Para no requerir configuración externa de base de datos relacionales en la máquina del evaluador, se implementó un sistema de persistencia basado en archivos JSON:
- La base de datos se guarda en `Backend/data/estudiantes.json`.
- Si el archivo no existe al iniciar, el backend lo creará e inicializará automáticamente con los **mismos 5 estudiantes simulados del frontend**, facilitando pruebas inmediatas.
- Cualquier acción de **Registro (POST)**, **Edición (PUT)** o **Eliminación (DELETE)** escribirá y persistirá los cambios de forma automática en este archivo JSON.

---

## 🛣 Endpoints REST Expuestos

La API REST expone los siguientes recursos bajo la ruta `/api/estudiantes`:

| Método HTTP | Ruta | Descripción | Códigos HTTP |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/estudiantes` | Obtiene la lista completa de estudiantes | `200 OK` |
| `GET` | `/api/estudiantes/{id}` | Obtiene el detalle de un estudiante por su ID | `200 OK`, `404 Not Found` |
| `POST` | `/api/estudiantes` | Registra un nuevo estudiante | `201 Created`, `409 Conflict` |
| `PUT` | `/api/estudiantes/{id}` | Actualiza datos o cursos de un estudiante | `200 OK`, `404 Not Found`, `409 Conflict` |
| `DELETE` | `/api/estudiantes/{id}` | Elimina permanentemente a un estudiante | `204 No Content`, `404 Not Found` |

### Validaciones del Backend:
- **CORS habilitado:** Permite llamadas directas desde `http://localhost:4200` u otros orígenes.
- **Códigos duplicados (409):** Si intentas registrar un estudiante con un código académico (`codigo`) o correo electrónico (`correo`) que ya está en uso por otro estudiante, el backend retornará inmediatamente `409 Conflict` con un mensaje descriptivo para evitar duplicidades de acuerdo a las reglas del ejercicio.

---

## 🛠 Estructura del Código

La arquitectura del proyecto sigue el patrón por capas de Spring:
1. **`com.control.academico.backend.model`**: Contiene los POJOs `Estudiante` y `Curso`.
2. **`com.control.academico.backend.repository`**: `EstudianteRepository` maneja la lectura, escritura y el mapeo de datos con Jackson a `estudiantes.json`.
3. **`com.control.academico.backend.service`**: `EstudianteService` implementa las reglas de negocio (búsquedas, saneamiento de entradas como trim/lowercase, control de duplicados y generación de IDs incrementales).
4. **`com.control.academico.backend.controller`**: `EstudianteController` expone los endpoints REST y configura las políticas de CORS.
5. **`com.control.academico.backend.exception`**: `ResourceNotFoundException` (404) y `ConflictException` (409) mapean excepciones de Java directamente a códigos de estado HTTP semánticos.
