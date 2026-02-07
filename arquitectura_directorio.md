# Arquitectura del Directorio Profesional y SaaS para Negocios

## 1. Visión General
Este sistema está diseñado como una plataforma dual:
- **Directorio Público:** Una aplicación web optimizada para SEO y descubrimiento de negocios.
- **Panel SaaS Privado:** Una herramienta de gestión para dueños de negocios con utilidades integradas (promociones, notas, inventario).

## 2. Roles y Permisos
| Rol | Acceso | Responsabilidades |
| :--- | :--- | :--- |
| **Público (Anónimo)** | Directorio | Buscar, filtrar, ver perfiles de negocios. |
| **Usuario Registrado** | Directorio + Perfil | Guardar favoritos, dejar reseñas, gestionar su perfil. |
| **Dueño de Negocio** | Dashboard Privado | Gestionar perfiles de negocio, usar herramientas SaaS, ver estadísticas. |
| **Administrador** | Todo el sistema | Moderar contenido, gestionar categorías, administrar usuarios. |

## 3. Flujos de Usuario
### A. Usuario Público (Buscador)
1. **Home:** Buscador inteligente por palabra clave y ubicación.
2. **Resultados:** Lista de negocios con filtros avanzados (categoría, cercanía, calificación).
3. **Perfil de Negocio:** Información detallada, galería, contacto directo (WhatsApp/Llamada).

### B. Dueño de Negocio (SaaS)
1. **Registro/Login:** Acceso seguro vía Supabase Auth.
2. **Onboarding:** Creación o reclamo de su negocio.
3. **Dashboard:** Resumen de visitas y accesos rápidos a herramientas.
4. **Herramientas:** Gestión de promociones (juegos), inventario y archivos.

## 4. Diseño UX/UI
- **Enfoque Mobile-First:** Diseñado para ser usado en la calle (PWA).
- **Interfaz SaaS Limpia:** Uso de Cards, Sidebar colapsable y estados de carga (Skeletons).
- **Consistencia:** Paleta de colores profesional, tipografías legibles y feedback visual en cada acción.
- **Gamificación:** La sección de herramientas incluye juegos (Ruleta/Rasca y Gana) para fomentar la retención de clientes finales.

## 5. Implementación PWA (Progressive Web App)
Para convertir la web en una aplicación instalable:
- **Manifest.json:** Definición de iconos, colores de tema y modo de visualización (standalone).
- **Service Worker:** Estrategias de caché (Stale-while-revalidate) para permitir el acceso offline a datos básicos y assets.
- **Instalabilidad:** Prompt nativo para añadir a la pantalla de inicio en Android e iOS.

## 6. Estructura de Archivos (Frontend)
El proyecto base incluye:
- **`index.html`**: Estructura principal, landing page y shell del dashboard.
- **`style.css`**: Estilos personalizados, animaciones y soporte para modo PWA.
- **`app.js`**: Lógica de interacción, manejo de modales y registro del Service Worker.
- **`manifest.json`**: Configuración de la aplicación para su instalación.
- **`sw.js`**: Service Worker para gestión de caché y soporte offline.

## 7. Stack Tecnológico Recomendado
- **Frontend:** HTML5, CSS3 (Tailwind CSS para agilidad y responsividad), JavaScript ES6+.
- **Backend/Base de Datos:** Supabase (PostgreSQL).
- **Autenticación:** Supabase Auth (Email/Password, Social Login).
- **Almacenamiento:** Supabase Storage para logos, banners y documentos.

## 7. Escalabilidad y Futuro
- **Planes Premium:** Implementar un sistema de suscripciones (Stripe) para desbloquear herramientas avanzadas o destacar negocios.
- **Multi-negocio:** La arquitectura permite que un usuario gestione múltiples establecimientos desde un solo panel.
- **API First:** El esquema permite que en el futuro se desarrollen aplicaciones nativas (Flutter/React Native) consumiendo la misma base de datos.

## 8. Wireframes Conceptuales (Estructura)

### A. Vista de Inicio (Directorio)
```
[ Header: Logo | Iniciar Sesión ]
[ Hero: "Encuentra el profesional que necesitas" ]
[ Buscador: [ ¿Qué buscas? ] [ Ubicación ] [ Botón Buscar ] ]
[ Categorías: (Icono) Comida | (Icono) Hogar | (Icono) Oficios ]
[ Destacados: (Card Negocio) | (Card Negocio) | (Card Negocio) ]
[ Footer ]
```

### B. Dashboard del Dueño (SaaS)
```
[ Sidebar: Resumen | Mi Negocio | Promociones | Notas | Inventario | Ajustes ]
[ Topbar: Nombre del Negocio | Perfil Usuario ]
[ Contenido Principal:
  (Card: Visitas Hoy) (Card: Nuevas Reseñas)
  [ Sección: Tus Herramientas ]
  (Card: Crear Promo) (Card: Notas Rápidas)
]
```

## 9. Buenas Prácticas de Seguridad
- **RLS (Row Level Security):** Ya implementado en el SQL para asegurar que solo los dueños vean sus notas y datos privados.
- **Validación de Datos:** Uso de triggers y constraints en PostgreSQL para mantener la integridad.
- **Sesiones Seguras:** Manejo de JWT por parte de Supabase.
