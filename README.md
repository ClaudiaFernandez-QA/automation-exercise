# 🧪 Automatización UI con Playwright – Automation Exercise

Este proyecto fue desarrollado como ejercicio práctico para reforzar conocimientos en automatización UI utilizando Playwright, sobre el sitio Automation Exercise.

El enfoque está puesto en la calidad, buenas prácticas y simulación de casos reales de testing funcional.

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
  - Validación de texto, despliegue y navegación
  - Validación de comportamiento tipo acordeón
  - Redirección al hacer clic en subcategorías o marcas
- ✅ Recommended Items
  - Validación de título y productos visibles
  - Navegación entre slides con verificación dinámica
- ✅ Footer
  - Visualización de la sección "Subscription"
  - Ingreso de email y envío del formulario
  - Confirmación con mensaje de suscripción exitosa

### 🔹 Products
-✅ Navegación desde Home
-✅ Visualización general de productos
-✅ Validación de estructura del producto (imagen, título, precio, botón)
-✅ Búsqueda de productos por nombre
-✅ Visualización del detalle del producto
-✅ Campo cantidad (valor por defecto, tipo y mínimo)
-✅ Modal de confirmación al agregar al carrito
-✅ Cierre correcto del modal con el botón "Continue Shopping"
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
