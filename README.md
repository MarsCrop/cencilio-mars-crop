# Cencilio 

## Interfaz para renderizar archivos Excel 

**Autores: @MarsCrop y @melvin-zaldana**

### Una librería para renderizar archivos en excel y comprobar la correspondencia de datos con una interfaz que permite hacerlo.

### Dependencias

  * El módulo requiere una clave de Cencilio para su uso.
  * **SheetJS**: se utiliza SheetJS para interpretar el excel con las diferentes estructuras de validez de datos
  * **Shim**: algunos navegadores no contienen funciones necesarias para usar SheetJS sin dependencias. En ese caso debe agregarse

### Parametros de API
  Estos parametros sirven solamente si se quiere validar el uso de la app con una base de datos. La respuesta retorna con codigo en PHP :)
  
  * **userId**: alias de respuesta en _mail
  * **apiKey**: alias de respuesta en _id
  
  Integracion por medio de API. Si hubo un error en la peticion, puede retornar un mensaje de carga incorrecta con un **(validationError)**

### Parametros de verificacion
  Estos parametros sirven para comprobar que la informacion en el documento sea la correcta. Hay tres parametros que se agregan como **validators** en **fields** que son los de verificacion obligatoria (el documento no se genera si los datos siguen siendo incorrectos) y un campo extra que se utiliza para especificar los campos donde hayan fechas guardadas en formato de timestamp (como numeros enteros sin expresarse en milisegundos). El usuario debe especificar mediante un mensaje la forma de validacion haciendo uso del subcampo **error** que almacena el mensaje correspondiente.
  
  * **validate: 'required'**: los campos en esas columnas no tienen que estar vacios
  * **validate: 'unique'**: los campos en esas columnas no guardan copia en otros
  * **validate: 'regex_match'**: la expresion de los valores en las columnas tienen el mismo patron

  * **timestamp: []**: las columnas indicadas contienen formato de hora. No se validan dado que su expresion se da por hecha.

### ¿Cómo integro el modulo?

  * **CDN: https://cdn.jsdelivr.net/gh/MarsCrop/cencilio@main/cencilio.js**
  * Se puede cargar como módulo de un tag script de html sin tener que importar directamente :)

### ¿Cómo usar el modulo con NodeJS?

  * Abrir una terminal e ingresar estos comandos para instalacion del paquete:
      * **npm install**
      * **npm run dev**

### ¿Cómo se usa?

  * Puede integrarse con otros servicios siempre y cuando tenga autorizacion desde **app.cencilio.com**
  * Importar el script del modulo o instalar para usar Cencilio en el entorno particular
  * Se puede editar y guardar los datos editados en una interfaz estilizada a gusto para una mejor visibilidad especificando los parametros de validacion de los datos y de visualizacion de la interfaz como argumento del modulo (es indispensable especificar los parametros ya que el renderizador se carga una vez que estan dadas las opciones y genera documentos nuevos solamente si la informacion es correcta).
  * Se puede utilizar el selector de etiquetas para verificar que los datos para cargar cumplan o no con los procesos de validacion
  * Se privilegian documentos con mayor cantidad de informacion asi que se puede agregar y verificar informacion nueva y vieja
  * Si tiene documentos muy grandes y no termina de corregir todos los datos puede elegir los que necesite y guardarlos en un archivo nuevo
  * Se obtiene una respuesta en **JSON** al clickear **CARGAR DATOS** que depende de las celdas seleccionadas para almacenar (tambien deben contener informacion correcta)
  * Toda la informacion se guarda automaticamente mientras los procesos de validez otorgen atributos de calidad a la informacion

### Calidad de datos

  Si un dato es alterado o editado por arbitrariedad, el sistema puede detectarlo con los parametros de validez que usted otorgue a la etiqueta. Eso permite utilizar funciones del modulo con informacion de origenes diferentes permitiendole al modulo saber el origen de los datos y ser estables frente a la edicion de los mismos, garantizando que las ediciones se puedan hacer sobre datos que quedaron sin corregir
