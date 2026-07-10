# Sistema de creación de usuarios y productos en este proyecto de ecommerce OptiBelleza.

## Guía Completa: Cómo Crear Usuarios y Productos

### Visión General del Proyecto
Este es un proyecto de ecommerce de gafas que tiene:

Backend: API REST con FastAPI (Python) + PostgreSQL
Frontend: Aplicación web con React + Material UI

### PARTE 1: CREACIÓN DE USUARIOS
📍 ¿Dónde se crean los usuarios?
Los usuarios se pueden crear de 2 formas:

Opción 1: Desde el Frontend (Registro Normal) ✅ Recomendado
Paso a paso:

Inicia el frontend:
bash
```
cd frontend
npm run dev
```
Esto abre la aplicación en http://localhost:5173

Ve a la página de registro:
Haz clic en el botón "Registrarse" en el header
O navega directamente a http://localhost:5173/register
Llena el formulario y registra el usuario.

¿Qué pasa internamente?

Frontend (Register.jsx) 
    ↓ envía datos
Backend (auth.py - endpoint /api/auth/register)
    ↓ hashea la contraseña
Base de Datos PostgreSQL (tabla "users")
    ↓ guarda el usuario
Frontend recibe token JWT
    ↓ auto-login
Usuario queda autenticado ✅


## PARTE 2: CREACIÓN DE PRODUCTOS

📍 ¿Dónde se crean los productos?
Los productos SOLO se pueden crear desde el Backend porque requieren permisos de administrador.

Método 1: Usando la API del Backend ✅
Requisitos previos:

Tener el backend corriendo: uvicorn main:app --reload (desde backend/app/)
Tener un token de administrador (necesitas crear un admin primero)

Paso a paso:

Inicia el backend:
´´´
cd backend/app
uvicorn main:app --reload
´´´
Esto inicia la API en http://127.0.0.1:8000

Ve a la documentación interactiva:
Abre http://127.0.0.1:8000/docs en tu navegador

Verás Swagger UI con todos los endpoints
Autentícate como admin (primero necesitas crear un admin):
Busca el endpoint POST /api/auth/admin_login
Haz clic en "Try it out"
Ingresa credenciales de admin
Copia el token que recibes
Autoriza en Swagger:
Haz clic en el botón "Authorize" (candado verde)
Pega el token en el formato: Bearer tu_token_aqui
Haz clic en "Authorize"
Crea un producto:
Busca el endpoint POST /api/admin/products
Haz clic en "Try it out"
Llena el JSON:
json
{
  "name": "Ray-Ban Aviator Clásico",
  "price": 15000,
  "product_image": "https://ejemplo.com/imagen.jpg",
  "shoes_category": "Sol",
  "shoes_type": "Featured",
  "shoes_stock": 50,
  "shoes_description": "Gafas de sol clásicas con protección UV400"
}
Haz clic en "Execute"

Respuesta exitosa ✅
Archivo del backend: backend/app/api/routers/products.py (línea ~90)

Método 2: Usando Postman o cURL
bash
POST http://127.0.0.1:8000/api/admin/products
Authorization: Bearer tu_token_de_admin
Content-Type: application/json

{
  "name": "Oakley Holbrook",
  "price": 18000,
  "product_image": "https://ejemplo.com/oakley.jpg",
  "shoes_category": "Deportivas",
  "shoes_type": "New",
  "shoes_stock": 30,
  "shoes_description": "Gafas deportivas de alto rendimiento"
}
📊 ¿Dónde se guardan los productos?
Base de datos PostgreSQL → Tabla shoes

Estructura de la tabla (definida en backend/app/models/product.py):



##  Crear un Usuario Administrador
Para crear productos, necesitas ser administrador. Aquí te explico cómo:

Opción 1: Crear admin desde la base de datos directamente
Conéctate a PostgreSQL
Crea un usuario admin manualmente en la tabla admin
Opción 2: Modificar el código para crear un admin
Puedes crear un script temporal en backend/app/ llamado create_admin.py:

python
from db.session import SessionLocal
from models.admin import Admin
from core.utils import hash_password

db = SessionLocal()

admin = Admin(
    admin_name="Admin Principal",
    admin_email="admin@optibelleza.com",
    admin_password=hash_password("admin123"),
    admin_phone_no="1234567890"
)

db.add(admin)
db.commit()
print("✅ Admin creado exitosamente!")
Ejecuta: python create_admin.py

📁 Resumen de Archivos Importantes
Frontend:
Registro de usuarios: frontend/src/pages/Register.jsx
Login: frontend/src/pages/Login.jsx
Ver productos: frontend/src/pages/Products.jsx
API client: frontend/src/api/client.js
Backend:
Rutas de auth: backend/app/api/routers/auth.py
Rutas de productos: backend/app/api/routers/products.py
Modelo de usuario: backend/app/models/user.py
Modelo de producto: backend/app/models/product.py
Base de datos: backend/app/db/session.py
🚀 Flujo Completo de Uso
Usuario nuevo → Se registra en /register → Queda autenticado
Usuario autenticado → Ve productos en /products
Usuario → Agrega productos al carrito
Usuario → Hace checkout y crea orden
Admin → Crea/edita/elimina productos desde la API
¿Necesitas que te explique alguna parte más a detalle o que te ayude a crear tu primer usuario/producto de prueba?

Recent actions
la base de datos SQL donde se guardan los usuarios la puedo ver? o debo crearla en local?

¡Excelente pregunta! Déjame explicarte sobre la base de datos y mostrarte cómo verificar su configuración.

Analyzed
session.py#L1-27
Searched
.env*
0 results
Analyzed
config.py#L1-23
¡Perfecto! Te explico la situación de tu base de datos:

🗄️ Base de Datos del Proyecto
📍 Situación Actual
Según la configuración que veo en tu proyecto, ya tienes una base de datos configurada, pero es SQLite local (no PostgreSQL).

Configuración Actual (en 
backend/app/core/config.py
):
python
database_hostname: str = "sqlite"  # ← Está usando SQLite
database_name: str = "./test2.db"  # ← Archivo local
Esto significa que:

✅ SÍ tienes una base de datos
✅ Es un archivo local llamado test2.db
✅ Se crea automáticamente cuando inicias el backend
✅ Está en la carpeta backend/app/
🔍 Cómo Ver la Base de Datos
Opción 1: Verificar si existe el archivo
Searched
*.db
1 result
¡Perfecto! La base de datos ya existe en tu proyecto:

📁 Ubicación: 
backend/app/test2.db

🛠️ Cómo Ver y Gestionar la Base de Datos
Opción 1: DB Browser for SQLite ⭐ Recomendado
Es una herramienta gráfica gratuita y fácil de usar:

Descarga: https://sqlitebrowser.org/dl/
Instala el programa
Abre DB Browser
File → Open Database
Navega a: 
C:\Users\USUARIO\Documents\VS projects\optibelleza-backend\backend\app\test2.db
Podrás ver:

✅ Todas las tablas (users, shoes, cart, orders, etc.)
✅ Los datos de cada tabla
✅ Agregar/editar/eliminar registros manualmente
✅ Ejecutar consultas SQL
Opción 2: VS Code Extension
Si usas VS Code:

Instala la extensión "SQLite Viewer" o "SQLite"
Abre el archivo 
test2.db
 en VS Code
Haz clic derecho → "Open Database"
Opción 3: Línea de Comandos
Si tienes SQLite instalado:

bash
cd "C:\Users\USUARIO\Documents\VS projects\optibelleza-backend\backend\app"
sqlite3 test2.db
Comandos útiles:

sql
-- Ver todas las tablas
.tables

-- Ver estructura de tabla users
.schema users

-- Ver todos los usuarios
SELECT * FROM users;

-- Ver todos los productos
SELECT * FROM shoes;

-- Salir
.quit
📊 Tablas que Deberías Ver
Cuando abras la base de datos, deberías ver estas tablas:

Tabla	Descripción
users	Usuarios registrados
admin	Administradores
shoes	Productos (gafas)
cart	Carritos de compra
orders	Pedidos realizados
🔄 ¿Necesitas PostgreSQL en lugar de SQLite?
Si quieres usar PostgreSQL (más robusto para producción):

Paso 1: Instalar PostgreSQL
Descarga: https://www.postgresql.org/download/windows/
Instala con pgAdmin
Paso 2: Crear base de datos
sql
CREATE DATABASE optibelleza;
Paso 3: Crear archivo .env
Crea un archivo .env en backend/app/:

env
DATABASE_HOSTNAME=localhost
DATABASE_PORT=5432
DATABASE_PASSWORD=tu_password_postgres
DATABASE_NAME=optibelleza
DATABASE_USERNAME=postgres
SECRET_KEY=tu_secret_key_aqui
ALGORITHM=HS256
Paso 4: Reiniciar el backend
El backend detectará automáticamente PostgreSQL y creará las tablas.

🎯 Recomendación
Para desarrollo local, SQLite es perfecto:

✅ No necesitas instalar nada extra
✅ Ya está funcionando
✅ Fácil de ver y editar
✅ Portátil (un solo archivo)
Para producción, usa PostgreSQL:

✅ Más robusto
✅ Mejor rendimiento
✅ Soporta más usuarios concurrentes
📝 Resumen
Tu base de datos actual:

📍 Ubicación: backend/app/test2.db
🗄️ Tipo: SQLite
✅ Estado: Ya existe y funciona
👁️ Ver: Usa DB Browser for SQLite
Para verla ahora mismo:

Descarga DB Browser for SQLite
Abre el archivo test2.db
¡Listo! Verás todos tus usuarios y productos