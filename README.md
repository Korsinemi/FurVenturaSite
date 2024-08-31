# FurVentura

Una asombrosa aventura de animales de pixeles

## Changelog

¡Excelente! Parece que estás avanzando a toda máquina en tu proyecto. Vamos a documentar la nueva versión con base en tus últimas actualizaciones:

### v1.3.0 - 2024-09-10

> **General**
- Se han realizado numerosas correcciones y mejoras en la aplicación.
- El código ahora es más robusto y eficiente.

> **Autenticación y Seguridad**
- Se ha completado la implementación del módulo de autenticación:
  - Los usuarios pueden registrarse y autenticarse correctamente.
  - Se ha solucionado un error en el manejo de las solicitudes POST.
  - Se ha agregado un sistema de validaciones más sólido.
  - Las rutas ahora están protegidas mediante autenticación.
  - Se esta trabajando en la integracionde PeludToken.
  - Se esta trabajando en la integracion futura de Google y Discord.
- Se ha modificado el sistema de verificación de la API para mayor seguridad.

> **Deprecaciones**
- **Type de Events**: Se ha mantenido como deprecado y se eliminará completamente en futuras versiones.
- **Character Routes**: Algunos de los módulos siguen marcados como deprecados. La transición hacia UserRoutes y UserControllers en la API está en curso.

> **Mejoras en la Interfaz**
- Se ha integrado la librería `react-icons` para personalizar aún más el sitio web.
- Se han añadido etiquetas de página utilizando `react-helmet`.
- Se ha incluido un favicon para una mejor experiencia de usuario.

> **Compilación y Privatización de Rutas**
- El programa se ha compilado en el build final.
- Se ha implementado un sistema de privatización de rutas para las funciones de autenticación.


### v1.1.0 - 2024-08-27

> **General**
- Se agregaron los nuevos endpoints `animals` y `events`.
- Las páginas se actualizaron con un diseño nuevo, moderno y elegante.
- Se integró la base de datos para una gestión más eficiente.

> **Animals Endpoint**
- Ahora incluye un selector de rareza para los animales.
- Se corrigió el error que impedía la actualización o eliminación de datos.

> **Events Endpoint**
- Se añadió un selector para marcar eventos como activos o finalizados.

> **Mejoras en la Interfaz**
- Los módulos de creación y edición de datos son más dinámicos y amigables.
- Se implementó una confirmación antes de eliminar registros.
- Se añadió un icono al header para una mejor identificación visual.

> **Funcionalidades en Desarrollo**
- Se está trabajando en la integración de `validator` para verificar URLs.
- Babel se incorporó para una gestión más eficiente de datos.

### v1.0.1 - 2024-08-23
> General
- Se cambio de repositorio debido a problemas de compilacion.
> Novedades
- Nuevo: Integración de la API para gestionar jugadores.
> Funcionalidad
- Funcionalidad para agregar, editar, eliminar y buscar jugadores.
> Mejoras
- Mejora: Manejo de errores mejorado con mensajes de advertencia en la consola.
- Mejora: Enlace del título “FurVentura” en el encabezado para redirigir a la página de inicio.
> Correcciones
- Corrección: Solucionado el problema de rutas en React Router v6, se pasaron todas a v8.
- Corrección: Solucionado el problema de importación de CSS en el componente Header.

### v1.0.0 - 2024-08-20
> lanzamiento
- Lanzamiento inicial: Configuración básica del sitio web.
- Estructura del proyecto con React.
- Componentes iniciales: Header, Footer, PlayerList.
- Configuración de rutas con React Router.

Creado con amor por Korsinemi
- Proyecto final ADSO SENA 2024