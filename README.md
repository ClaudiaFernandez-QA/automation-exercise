# 🧪 Automatización UI con Playwright – Automation Exercise

Este proyecto está en desarrollo y fue creado como ejercicio práctico para reforzar conocimientos en automatización UI utilizando Playwright, sobre el sitio Automation Exercise.

Tiene como objetivo aplicar buenas prácticas de testing, validar funcionalidades clave de forma progresiva y organizar los casos por flujo funcional.

---

## 🎯 Funcionalidades cubiertas

### 🔹 Login
- ✅ Visualización del link desde Home
- ✅ Redirección al formulario
- ✅ Visualización de campos
- ✅ Validación con credenciales inválidas

### 🔹 Home
- ✅ Validación del header de navegación
- ✅ Validación del carrusel (contenido y navegación entre slides)
- ✅ Sección de productos destacados (Features Items)
  - Estructura de cards: imagen, título, precio y botones
  - Validación de overlay al hacer hover sobre el producto
- ✅ Sidebar: categorías y marcas
  - Validación de texto
- ✅ Recommended Items
  - Validación de título y productos visibles
  - Navegación entre slides con verificación dinámica
- ✅ Footer
  - Visualización de la sección "Subscription"
  - Ingreso de email y envío del formulario
  - Confirmación con mensaje de suscripción exitosa

### 🔹 Sidebar (Categorías y Marcas)
- ✅ Visualización de secciones "Category" y "Brands"
- ✅ Validación del comportamiento tipo acordeón en categorías
- ✅ Redirección correcta al hacer clic en subcategorías
- ✅ Redirección correcta al hacer clic en marcas
- ✅ Validación dinámica de productos listados por subcategoría
- ✅ Validación dinámica de productos listados por marca

### 🔹 Products
- ✅ Navegación desde Home
- ✅ Visualización general de productos
- ✅ Validación de estructura del producto (imagen, título, precio, botón)
- ✅ Búsqueda de productos por nombre
- ✅ Visualización del detalle del producto
- ✅ Campo cantidad (valor por defecto, tipo y mínimo)
- ✅ Modal de confirmación al agregar al carrito
- ✅ Cierre correcto del modal con el botón "Continue Shopping"

### 🔹 Cart
- ✅ Navegación desde Home hasta Cart
- ✅ Visualización del mensaje "Cart is empty" cuando no hay productos
- ✅ Redirección desde Cart a Products con el link "here"
- ✅ Agregar un producto y validar contenido del carrito
  - Cantidad, precio unitario y total
  - Modal de confirmación
- ✅ Visualización del botón "Proceed to Checkout"
- ✅ Eliminar un producto del carrito y validar mensaje de vacío


### 🔹 Place Order
- ✅ Acceso desde el checkout
- ✅ Visualización de datos ingresados en el formulario de registro
- ✅ Ingreso de mensaje adicional
- ✅ Ingreso y validación de datos de tarjeta
- ✅ Confirmación del pedido con mensaje "Order Placed!"
- ✅ Descarga del archivo de factura
- ✅ Redirección al Home al finalizar

### 🔹 Contact Us
- ✅ Navegación desde el header
- ✅ Visualización del formulario y campos requeridos
- ✅ Envío exitoso con archivo adjunto
- ✅ Validación de comportamiento con campo obligatorio vacío
- ✅ Manejo de diálogo emergente

### 🔹 Login / Logout / Delete Account
- ✅ Registro exitoso de nuevo usuario
- ✅ Login con credenciales válidas
- ✅ Logout del usuario autenticado
- ✅ Eliminación de cuenta 
- ✅ Intento de login con cuenta eliminada 

---

## 🔄 Flujos E2E automatizados

### 🔸 Registro de usuario + Agregar al carrito + Checkout

- ✅ Registro de usuario con datos válidos
- ✅ Agregar producto al carrito desde la pantalla de detalle
- ✅ Navegación hacia el carrito y validación de contenido
- ✅ Proceso de checkout (con validación de datos de envío)
- ✅ Ingreso de datos de tarjeta y colocación del pedido
- ✅ Validación del mensaje de éxito ("Order Placed!")
- ✅ Descarga de factura (Invoice) y validación del evento de descarga

### 🔸 Login + Ver detalle de producto + Logout

- ✅ Registro de un nuevo usuario (precondición dentro del test)
- ✅ Logout tras la creación de cuenta
- ✅ Login con credenciales recién creadas
- ✅ Visualización del detalle de un producto desde el listado
- ✅ Validación del nombre, precio y categoría del producto
- ✅ Logout exitoso y redirección al formulario de login


### 🔸 Buscar producto + Agregar al carrito + Checkout
-✅ Registro de nuevo usuario
-✅ Búsqueda de un producto por nombre
-✅ Visualización de resultados y selección de un producto
-✅ Agregado al carrito desde el detalle
-✅ Checkout completo con mensaje personalizado
-✅ Ingreso de datos de tarjeta y confirmación de la orden
-✅ Validación del mensaje final: Order Placed!

---

## ⚙️ Tecnologías y herramientas

- [Playwright](https://playwright.dev/)
- TypeScript
- Node.js
- VS Code

---

## 🚀 Cómo ejecutar los tests

```bash
# Instalación de dependencias
npm install

# Ejecutar todos los tests
npx playwright test

# Ejecutar un test específico
npx playwright test tests/login.spec.ts
