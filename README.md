# Cencilio

## Interfaz para renderizar archivos Excel (Beta version)

### Una librería para renderizar archivos en excel y comprobar la correspondencia de datos con una interfaz que permite hacerlo.

### Dependencias

  * El módulo permite el uso de APIs, por lo que se necesita SQL para algunas de las funciones
  * SheetJS: se utiliza SheetJS para interpretar el excel con las diferentes estructuras de validez de datos
  * Shim: algunos navegadores no contienen funciones necesarias para usar SheetJS sin dependencias. En ese caso debe agregarse Shim como dependencia 
  * fs: utilizada para guardar los datos cargados una vez creada la estructura en JSON

### ¿Cómo integro el modulo?

  ### * CDN: https://cdn.jsdelivr.net/gh/MarsCrop/cencilio@main/cencilio.js
  * Se puede cargar como módulo de un tag script de html sin tener que importar directamente :)

### ¿Cómo usar el modulo con NodeJS?

  * Abrir una terminal e ingresar estos comandos para instalacion del paquete:
      * *npm install
      * *npm run dev

### ¿Cómo se usa?

  * Importamos el script del modulo para integrar Cencilio al documento
  * Se puede editar, verificar datos y estilizar la interfaz para una mejor visibilidad con especificando los parametros de validacion de los datos
  y de visualizacion de la interfaz como argumento del modulo (es indispensable especificar los parametros ya que el renderizador se carga una vez que estan 
  dadas las opciones).
  * Con eso ya se puede cargar el documento y subir un archivo al contenedor que se carga en el documento para empezar a usar el editor :)
