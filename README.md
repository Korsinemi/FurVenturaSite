## Changelog

### v1.4.0 - 2024-11-23

> **General**
- Se han realizado numerosas correcciones y mejoras en la aplicación.
- El código ahora es más robusto y eficiente.

> **Autenticación y Seguridad**
- Se completó la implementación del módulo de autenticación:
  - Los usuarios pueden registrarse y autenticarse correctamente.
  - Se solucionó un error en el manejo de las solicitudes POST.
  - Se agregó un sistema de validaciones más sólido.
  - Las rutas ahora están protegidas mediante autenticación.
  - Se está trabajando en la integración de PeludToken.
  - Se está trabajando en la integración futura de Google y Discord.
- Se modificó el sistema de verificación de la API para mayor seguridad.
- Se agregó una verificación al token para mejorar la autenticación y aumentar la seguridad.
- Se corrigió un error que almacenaba el token como `undefined`.
- Se mejoró el manejo de errores.

> **Deprecaciones**
- **Type de Events**: Se mantiene como deprecado y se eliminará completamente en futuras versiones.
- **Character Routes**: Se ha marcado como deprecado. La transición hacia UserRoutes y UserControllers en la API está en curso.
- **Character ha sido deprected**: Se ajustó la página de jugadores al nuevo endpoint de la API.
- **Game**: Fue reemplazado por Users ya que Game tendrá otra función en el futuro.

> **Mejoras en la Interfaz**
- Se integró la librería `react-icons` para personalizar aún más el sitio web.
- Se añadieron etiquetas de página utilizando `react-helmet`.
- Se incluyó un favicon para una mejor experiencia de usuario.
- Se mejoró la página de inicio moviéndola a un archivo separado.
- Se está trabajando en un nuevo diseño un poco más moderno y agradable (alfa aun en desarrollo).

> **Compilación y Privatización de Rutas**
- El programa se compiló en el build final.
- Se implementó un sistema de privatización de rutas para las funciones de autenticación.
- Se agregó una verificación de rol y se está trabajando en un sistema de seguridad avanzada para evitar inyecciones o modificaciones.
- Se agregó el manejo de rol para todas las páginas.
- Se agregó la verificación de rol en la página de autenticación.

> **Nuevas Páginas y Funcionalidades**
- Se agregaron las páginas de items y achievements.
- Se está trabajando en una página de anticheat.
- Se mejoró significativamente la velocidad de respuesta.
- Se agregó una opción de almacenar el nombre del usuario actual.
- Se actualizaron todas las librerías y se añadieron los `@types` a algunas para un mejor manejo.
- Se corrigieron errores en la verificación de usuarios.
- Se agregaron módulos de manejo de roles para admin y user.

### v1.3.0 - 2024-09-10

> **General**
- Se han realizado numerosas correcciones y mejoras en la aplicación.
- El código ahora es más robusto y eficiente.

> **Autenticación y Seguridad**
- Se completó la implementación del módulo de autenticación:
  - Los usuarios pueden registrarse y autenticarse correctamente.
  - Se solucionó un error en el manejo de las solicitudes POST.
  - Se agregó un sistema de validaciones más sólido.
  - Las rutas ahora están protegidas mediante autenticación.
  - Se está trabajando en la integración de PeludToken.
  - Se está trabajando en la integración futura de Google y Discord.
- Se modificó el sistema de verificación de la API para mayor seguridad.

> **Deprecaciones**
- **Type de Events**: Se mantiene como deprecado y se eliminará completamente en futuras versiones.
- **Character Routes**: Algunos de los módulos siguen marcados como deprecados. La transición hacia UserRoutes y UserControllers en la API está en curso.

> **Mejoras en la Interfaz**
- Se integró la librería `react-icons` para personalizar aún más el sitio web.
- Se añadieron etiquetas de página utilizando `react-helmet`.
- Se incluyó un favicon para una mejor experiencia de usuario.

> **Compilación y Privatización de Rutas**
- El programa se compiló en el build final.
- Se implementó un sistema de privatización de rutas para las funciones de autenticación.

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

> **General**
- Se cambió de repositorio debido a problemas de compilación.

> **Novedades**
- Integración de la API para gestionar jugadores.

> **Funcionalidad**
- Funcionalidad para agregar, editar, eliminar y buscar jugadores.

> **Mejoras**
- Mejora en el manejo de errores con mensajes de advertencia en la consola.
- Enlace del título “FurVentura” en el encabezado para redirigir a la página de inicio.

> **Correcciones**
- Solucionado el problema de rutas en React Router v6, se pasaron todas a v8.
- Solucionado el problema de importación de CSS en el componente Header.

### v1.0.0 - 2024-08-20

> **Lanzamiento**
- Lanzamiento inicial: Configuración básica del sitio web.
- Estructura del proyecto con React.
- Componentes iniciales: Header, Footer, PlayerList.
- Configuración de rutas con React Router.

Creado con amor por Korsinemi
- Proyecto final ADSO SENA 2024


se integro el uso de Imagekit a favor de un CDN propio personalizable en lugar de subidas de urls, el valor de URL en todos los modulos ha sido deprected, en su lugar se envia la url de Imagekit a la api
se creo el modulo de imagekit, asi como sus funciones
se agregaron etiquetas a las secciones de valor numerico y seleccion de listas
setError y relacionados han sido deprecados, en su lugar se agrego setMessages, que maneja todos los mensajes del sistema al usuario
se remasterizo el sistema de mensajes del sistema
se unificaron todos los css de listas en un solo archivo para mejor rendimiento
react-icons/fa ha sido deprected, se ha remplasado por el CSS oficial para mejor cobertura y mas personalizacion
Despreciado setSuccessMessage y setErrorMessage en favor de setMessages en login
Despreciado handleAddPlayer en favor de la adicion de jugadores solo por registro en el login, se removera totalmente una vez se actualice la api
apiUtils ha sido deprecado, en su lugar se pasaron todas las funciones a fvUtils, ademas, se agregaron validaciones apra todos los formularios
se actualizo todo el codigo de auth para mejor seguridad y respuesta
se elimino la libreria react-icons, ya que se integro la libreria completa de FontAwesome