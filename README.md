# Simulador de Bases de Datos

Examen de práctica interactivo para la materia **Bases de Datos**. Es una aplicación web estática (HTML + CSS + JavaScript, sin frameworks ni pasos de compilación) que se abre directamente en el navegador.

## Temas que cubre

1. Modelo relacional, llaves y normalización (1FN-3FN)
2. DDL, DML y SQL aplicado
3. Consultas multitabla (JOIN)
4. Programación sobre datos: Stored Procedures, Functions y Triggers
5. Bases de datos distribuidas: fundamentos, paralelismo y distribución (centralizada vs. distribuida, partición horizontal/vertical, replicación)
6. Arquitecturas de almacenamiento distribuido (cliente-servidor, P2P, clúster, multibase/federada, local/nube/híbrido)
7. Teorema CAP y PACELC
8. Consistencia y concurrencia distribuida (fuerte/eventual, 2PL, marcas de tiempo, OCC)
9. Escenarios: dado el negocio, sus clientes o sus datos, elegir la base de datos y la estrategia de distribución adecuadas

72 preguntas en total, repartidas entre los nueve temas. El contenido está construido directamente
sobre `guia_datos.md` (la guía de repaso condensada del curso), sección por sección, para cubrirla
a fondo sin arrastrar temas que esa guía no menciona (por eso no hay preguntas de ACID/BASE,
OLTP/OLAP, 2PC ni detección de deadlocks: no están ahí). El tema 5 se separó en dos (fundamentos y
arquitecturas) porque es la parte más extensa de la guía. El tema 9 (escenarios) agrupa las
preguntas de opción múltiple del tipo "esta empresa maneja estos datos o estos clientes, ¿qué
base de datos o qué distribución usarías?". No todos los temas usan todos los tipos de pregunta,
pero el examen completo sí reparte los siete tipos que soporta el motor (ver abajo).

## Tipos de pregunta

- **Opción múltiple** — elegir una de varias opciones.
- **Verdadero / Falso**
- **Completar** — escribir la palabra que falta (no distingue mayúsculas ni acentos).
- **Relacionar** — unir cada término con su definición usando listas desplegables.
- **Conectar** — unir cada término con su definición tocando primero uno de la izquierda y luego uno de la derecha (con color por pareja); pensado para celular y computadora.
- **Diagrama** — completar una imagen (el triángulo del teorema CAP) eligiendo la etiqueta correcta para cada vértice.
- **Pregunta abierta** — se responde en texto libre; al terminar se muestra una respuesta modelo y tú marcas si la sabías o no.

## Funciones

- Temporizador de 90 minutos, visible en todo momento.
- Retroalimentación inmediata: al responder cada pregunta, se bloquea y muestra si fue correcta, la respuesta correcta y una explicación breve.
- Mapa de preguntas (navegación libre, con color según el estado de cada una).
- Calificación final con porcentaje general y desglose por tema.
- **Reintentar solo las falladas**: crea una nueva ronda solo con las preguntas que no dominaste, las veces que quieras, hasta llegar a cero pendientes.
- Reiniciar el examen completo, con las preguntas y opciones en un orden distinto cada vez.
- Modo claro/oscuro automático (según la preferencia del sistema) y diseño adaptable a celular.

## Cómo ejecutarlo

No requiere instalación ni servidor. Basta con abrir el archivo `index.html` en un navegador:

1. Descarga o clona esta carpeta.
2. Haz doble clic en `index.html` (o ábrelo desde el navegador con `Ctrl+O`).

Si tu navegador bloquea algo al abrir el archivo directamente (poco común, ya que el proyecto no usa `fetch` ni módulos), también puedes servirlo con cualquier servidor estático simple, por ejemplo:

```bash
# Desde la carpeta del proyecto
python -m http.server 8080
# y abre http://localhost:8080 en el navegador
```

**Conexión a internet:** la tipografía (IBM Plex Mono / IBM Plex Sans) se carga desde Google Fonts vía CDN. Sin internet, el sitio funciona igual pero usa la fuente de reserva del sistema.

## Estructura del proyecto

```
examen-seguridad/
├── index.html          # Esqueleto HTML de las 3 pantallas (inicio, examen, resultados)
├── css/
│   └── estilos.css     # Toda la presentación visual (colores, tipografía, layout)
├── js/
│   ├── preguntas.js    # Datos: los temas (TOPICS) y las 72 preguntas (QUESTION_BANK)
│   └── app.js          # Lógica: temporizador, calificación, render de cada tipo, reintentos
├── .gitignore
└── README.md
```

La separación es intencional: **el contenido del examen (`preguntas.js`) es independiente de la lógica (`app.js`)**, así que puedes editar o agregar preguntas sin tocar el motor de la aplicación. `index.html` carga `preguntas.js` antes que `app.js`, porque este último depende de las variables `TOPICS` y `QUESTION_BANK` que el primero define.

## Cómo agregar o editar preguntas

Todo el contenido vive en `js/preguntas.js`, dentro del arreglo `QUESTION_BANK`. Cada pregunta es un objeto con al menos `id` (único), `topic` (debe coincidir con un `id` de `TOPICS`), `type` y `explain` (la explicación de una o dos líneas que se muestra al responder). El resto de los campos depende del `type`:

### Opción múltiple (`mc`)
```js
{id:'q46', topic:'modelo', type:'mc',
  prompt:'¿Cuál de estas es la llave primaria más adecuada para la tabla "productos"?',
  options:['nombre','precio','id_producto','stock'],
  answerIndex:2, // índice (desde 0) de la opción correcta dentro de "options"
  explain:'Un identificador corto, estable y sin significado de negocio es el criterio típico para elegir la llave primaria.'}
```

### Verdadero / Falso (`vf`)
```js
{id:'q47', topic:'ddldml', type:'vf',
  prompt:'TRUNCATE TABLE conserva la estructura de la tabla pero borra todas sus filas.',
  answer:true,
  explain:'A diferencia de DROP TABLE, que también elimina la estructura.'}
```

### Completar (`fill`)
```js
{id:'q48', topic:'consistencia', type:'fill',
  prompt:'El ___ es el protocolo que confirma una transacción distribuida en dos fases: Prepare y Commit/Abort.',
  answers:['2pc','confirmacion en 2 fases'], // una o más respuestas válidas; no importan mayúsculas ni acentos
  explain:'2PC = confirmación en dos fases: todos confirman, o todos abortan.'}
```

### Relacionar (`match`) — listas desplegables
```js
{id:'q49', topic:'joins', type:'match',
  prompt:'Relaciona cada sigla o comando con su función.',
  pairs:[
    {l:'DHT', r:'Tabla hash distribuida: decide en qué nodo P2P se guarda un dato.'},
    {l:'CAP', r:'Teorema que obliga a elegir entre Consistencia y Disponibilidad ante una partición de red.'}
  ],
  explain:'Ambos son conceptos centrales del diseño de sistemas distribuidos.'}
```

### Conectar (`connect`) — tocar izquierda y luego derecha
Usa exactamente la misma forma que `match` (un arreglo `pairs` de `{l, r}`); solo cambia la interacción visual. Se recomienda entre 4 y 6 pares:
```js
{id:'q50', topic:'arquitecturas', type:'connect',
  prompt:'Conecta cada arquitectura con su ejemplo real.',
  pairs:[
    {l:'Cliente-Servidor', r:'Una base de datos relacional en un único servidor central.'},
    {l:'Peer-to-Peer', r:'Cassandra o Dynamo, con un anillo de nodos iguales.'},
    {l:'Clúster', r:'Un conjunto de servidores con un nodo maestro que reparte los bloques.'},
    {l:'Federación', r:'Una capa de mediación que consulta varias fuentes sin copiar sus datos.'}
  ],
  explain:'Cada arquitectura resuelve distinto el mismo problema: dónde viven los datos y quién los administra.'}
```

### Diagrama (`diagram`) — completar una imagen
Hay dos variantes de `diagramKind`: `'triangle'` (3 vértices) y `'layers'` (varias capas apiladas). Cada `slot` necesita una `key` única, y `pool` es la lista de etiquetas para elegir (puede incluir distractores). Esta edición del examen usa `'triangle'` para el teorema CAP (ver `q56` en `preguntas.js`); `'layers'` sigue disponible si se agrega una pregunta que lo necesite:
```js
{id:'q56', topic:'diseno', type:'diagram', diagramKind:'triangle',
  prompt:'Completa el triángulo del teorema CAP: elige la letra correcta para cada vértice.',
  slots:[
    {key:'top', pos:'top', label:'Vértice superior', correct:'Consistencia'},
    {key:'bl', pos:'bl', label:'Vértice inferior izquierdo', correct:'Disponibilidad'},
    {key:'br', pos:'br', label:'Vértice inferior derecho', correct:'Tolerancia a particiones'}
  ],
  pool:['Consistencia','Disponibilidad','Tolerancia a particiones','Latencia','Durabilidad'],
  explain:'CAP: Consistencia, Disponibilidad y Tolerancia a Particiones; ante una partición hay que sacrificar C o A.'}
```
*(Si agregas un `diagramKind` nuevo, también hay que dibujarlo en `app.js`, dentro de la sección `// ---- DIAGRAM ----` de `renderQuestion`.)*

### Pregunta abierta (`open`)
```js
{id:'q52', topic:'progdatos', type:'open',
  prompt:'¿Por qué un trigger no se "llama" desde la aplicación como un stored procedure?',
  model:'Porque un trigger está diseñado para dispararse automáticamente cuando ocurre un evento (INSERT, UPDATE o DELETE) sobre la tabla a la que está asociado; nadie lo invoca directamente, a diferencia de un stored procedure que se ejecuta explícitamente con EXEC o CALL.'}
```
*(Las preguntas abiertas no llevan `explain`: la propia respuesta modelo cumple esa función.)*

### Reglas generales
- El `id` debe ser único en todo `QUESTION_BANK`.
- El `topic` debe existir en el arreglo `TOPICS` (al inicio del mismo archivo); si agregas un tema nuevo, dale también un `color` (variable CSS ya definida en `estilos.css`, o una nueva).
- No hace falta tocar `app.js` para agregar, quitar o editar preguntas de los tipos existentes: el motor las lee dinámicamente desde `QUESTION_BANK`.

## Notas técnicas

- Sin dependencias externas de JavaScript ni CSS: solo se usa la tipografía de Google Fonts por CDN (ver "Cómo ejecutarlo" arriba). No hay `npm`, `build` ni transpiladores.
- El progreso del examen vive únicamente en memoria (variable `state` de `app.js`): al recargar la página se pierde el intento en curso, tal como en la versión original.
