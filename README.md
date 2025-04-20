# 🧪 Automatización UI con Playwright – Automation Exercise

Este proyecto fue desarrollado como ejercicio práctico para reforzar conocimientos en automatización UI utilizando Playwright, sobre el sitio Automation Exercise.

El enfoque está puesto en la calidad, buenas prácticas y simulación de casos reales de testing funcional.

---

## 🎯 Funcionalidades cubiertas

### 🔹 Home
- ✅ Validación del header de navegación
- ✅ Validación del carrusel (contenido y navegación entre slides)
- ✅ Sección de productos destacados (`Features Items`)
- ✅ Efecto hover con overlay en cards de producto
- ✅ Sidebar: categorías y marcas
  - Validación de texto, despliegue y navegación
  - Validación de comportamiento tipo acordeón
  - Redirección al hacer clic en subcategorías o marcas

### 🔹 Login
- ✅ Visualización del link desde Home
- ✅ Redirección al formulario
- ✅ Visualización de campos
- ✅ Validación con credenciales inválidas

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
