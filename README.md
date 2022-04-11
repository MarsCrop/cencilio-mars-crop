# Cencilio  (Mars Crop branch)

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
  Estos parametros sirven para comprobar que la informacion en el documento sea la correcta. Hay tres parametros que se agregan como **validators** en **fields** que sirven para verificacion obligatoria (en cada edicion y verificacion nuevas) de valores segun criterios establecidos por el usuario. El usuario debe especificar mediante un mensaje la forma de validacion haciendo uso del subcampo **error** que almacena el mensaje correspondiente.
  
  * **validate: 'required'**: los campos en esas columnas no tienen que estar vacios
  * **validate: 'unique'**: los campos en esas columnas no guardan copia en otros
  * **validate: 'regex_match'**: los valores en las columnas siguen expresiones regulares. Soportar la expresion regular completa en un valor de diccionario es imposible ya que el uso de operadores para formar cadenas de texto deriva unicamente en nuevas operaciones imprevistas, rompiendo de esa forma la ejecucion de todo el modulo. Debido a esto hay dos formas de errar posibles que hacen que el modulo se interrumpa debido a la forma en que un usuario quiere validar sus datos:
           a) Usando el objeto directamente como valor en el diccionario, lo cual quiere decir tomar el objeto de busqueda como una definicion y de esa forma intentar construir un objeto con otro subyacente que comienza a utilizarse para procesar texto.
           b) Usando los argumentos validos como string dentro de las definiciones de usuario sin tomar en cuenta que eso implica convertir el argumento en un string en el momento de la definicion de las opciones, dejando asi la opcion como un valor que no es el argumento constructor de dicha opcion si no que se convierte en argumento de otro patron. Sintaxis cada vez mas complejas que requieren el uso de doble barra invertida (gracias a la argumentacion de la expresion) que incluyan la doble barra invertida como argumentacion de un objeto de busqueda solamente son utiles si se aplican en el contexto de construccion de las expresiones regulares. Si las mismas se usan como opciones se omite el hecho de que la doble barra va a transcribirse en la definicion de las opciones y por ende el valor de la opcion no va a servir como argumento para construir una busqueda de dicha expresion.
      Es por estas dos formas posibles de que cualquiera pueda intentar construir un patron de busqueda de expresiones regulares que la solucion estable es utilizar sintaxis sin operadores que el sistema asocie a los argumentos constructores para construir las expresiones despues de que el usuario de las sintaxis soportadas por el sistema. Las opciones por lo tanto para las diferentes expresiones regulares soportadas son las siguientes:
           * **Fecha en formato de barras: regex: 'd{1,2}/d{1,2})/d{2})'**
           * **Numeros enteros: regex: 'd+'**
           * **Numeros decimales positivos y negativos: regex: '-+d'**
           * **Secuencias alfanumericas espaciadas: regex: '[A-Za-z0-9s]'**
           * **Secuencias alfanumericas sin espacio: regex: '[A-Za-z0-9]'**
           * **Fecha en formato de guiones: regex: 'd{1,2}-d{1,2})-d{2})'**
           * **Secuencias de rango fijo de 8 a 16 caracteres: regex: '^(?=.{8,16}$)[a-zA-Z0-9._]'**
           * **Codigo postal de Argentina: regex: '^([A-HJ-NP-Z])?d{4}([A-Z]{3})?'**
           * **Codigo postal de Mexico: regex: 'd5'**
           * **Codigo postal de Colombia: regex: 'd{6}'**
           * **Correo electronico: regex: '^w+@+w.+w-{2,4}'**
      Las opciones dadas de esa manera no incluyen operadores y ademas son soportadas para construir patrones de busqueda, por ende son aceptados por el modulo para utilizar los RegExp en las columnas deseadas. 

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
  * Se puede editar y guardar los datos editados con o sin errores en una interfaz estilizada a gusto para una mejor visibilidad especificando los parametros de validacion de los datos y de visualizacion de la interfaz como argumento del modulo (es indispensable especificar los parametros ya que el renderizador se carga una vez que estan dadas las opciones y genera documentos nuevos solamente si la informacion es correcta).
  * Se puede utilizar el selector de etiquetas para verificar que los datos para cargar cumplan o no con los procesos de validacion
  * Se privilegian documentos con mayor cantidad de informacion asi que se puede agregar y verificar informacion nueva y vieja
  * Se obtiene una respuesta en **JSON** al clickear **CARGAR DATOS** que depende de las celdas seleccionadas para almacenar (tambien deben contener informacion correcta)
  * Los documentos generados contienen info de las filas elegidas.

### Calidad de datos

  Si un dato es alterado o editado por arbitrariedad, el sistema puede detectarlo con los parametros de validez que usted otorgue a la etiqueta sin necesidad de ver donde esta el error. Eso permite utilizar funciones del modulo con informacion de origenes diferentes permitiendole al modulo saber el origen de los datos y ser estables frente a la edicion de los mismos, garantizando que las correcciones siempre se puedan hacer despues de la carga del documento.
