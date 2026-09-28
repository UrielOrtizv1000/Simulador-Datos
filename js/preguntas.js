/*
  preguntas.js
  Contenido del examen: los 9 temas (TOPICS) y el banco de preguntas (QUESTION_BANK).
  Este archivo NO tiene lógica de la aplicación: solo datos. Para agregar, quitar o editar
  preguntas, este es el único archivo que necesitas tocar (ver README.md para ejemplos
  de cada tipo). Debe cargarse en index.html ANTES de js/app.js, porque app.js usa estas
  dos variables globales.

  Forma de cada pregunta según su "type":
  - mc / vf   : { options:[...], answerIndex } o { answer: true/false }
  - fill      : { answers:[...] } (una o más respuestas válidas, sin acentos/mayúsculas)
  - match     : { pairs:[{l,r}, ...] } (relacionar con listas desplegables)
  - connect   : { pairs:[{l,r}, ...] } (relacionar tocando: izquierda y luego derecha)
  - diagram   : { diagramKind:'triangle'|'layers', slots:[{key,label,correct}], pool:[...] }
  - open      : { model } (respuesta modelo; el usuario se autoevalúa)

  Este banco está construido directamente sobre guia_datos.md (la guía de repaso
  condensada del curso), sección por sección, para cubrirla a fondo sin arrastrar temas
  que esa guía no menciona (por eso no hay preguntas de ACID/BASE, OLTP/OLAP, 2PC ni
  detección de deadlocks: no están en la guía). No todos los temas usan todos los tipos
  de pregunta, pero el examen completo sí reparte los siete tipos que soporta el motor:
  opción múltiple, verdadero/falso, completar, relacionar (match y connect), diagrama y
  pregunta abierta -- varias de las abiertas son justo el tipo de ejemplo práctico
  ("tienes esta tabla/este escenario, ¿qué harías?"). El tema final "escenarios" agrupa
  las preguntas de opción múltiple del estilo "esta empresa maneja estos datos o estos
  clientes, ¿qué base de datos o qué distribución usarías?".
*/

var TOPICS = [
  {id:'modelo', name:'Modelo relacional, llaves y normalización', short:'Modelo relacional', color:'--t-cia'},
  {id:'ddldml', name:'DDL, DML y SQL aplicado', short:'DDL y DML', color:'--t-avr'},
  {id:'joins', name:'Consultas multitabla (JOIN)', short:'JOIN', color:'--t-ia'},
  {id:'progdatos', name:'Programación sobre datos: SP, Functions y Triggers', short:'Programación', color:'--t-hackers'},
  {id:'fundamentos', name:'Bases de datos distribuidas: fundamentos, paralelismo y distribución', short:'Fundamentos BD dist.', color:'--t-fundamentos'},
  {id:'arquitecturas', name:'Arquitecturas de almacenamiento distribuido', short:'Arquitecturas', color:'--t-leyes'},
  {id:'diseno', name:'Teorema CAP y PACELC', short:'CAP / PACELC', color:'--t-eh'},
  {id:'consistencia', name:'Consistencia y concurrencia distribuida', short:'Consistencia', color:'--t-defensa'},
  {id:'escenarios', name:'Escenarios: qué base de datos y qué distribución usar', short:'Escenarios', color:'--t-escenarios'}
];

var QUESTION_BANK = [
  // ========== 1. Modelo relacional, llaves y normalización (9) ==========
  {id:'q1', topic:'modelo', type:'connect',
    prompt:'Conecta cada término básico del modelo relacional con su definición.',
    pairs:[
      {l:'Relación', r:'Es la tabla: un conjunto de tuplas que comparten los mismos atributos.'},
      {l:'Tupla', r:'Cada renglón o fila de la tabla; también se llama registro.'},
      {l:'Atributo', r:'Cada columna de la tabla; describe una característica de la entidad.'},
      {l:'Grado', r:'El número total de atributos (columnas) que tiene una relación.'},
      {l:'Entidad', r:'Objeto o concepto del negocio del cual se guarda información, por ejemplo "cliente".'}
    ],
    explain:'Estos cinco términos son el vocabulario base del modelo relacional: cliente(id_cliente, nombre, correo) es una entidad "cliente" con grado 3.'},
  {id:'q2', topic:'modelo', type:'fill',
    prompt:'En una relación 1:N, la llave foránea siempre se coloca en el lado ___ de la relación.',
    answers:['n'],
    explain:'En 1:N cada registro de A se relaciona con muchos de B, pero cada B pertenece a un solo A; por eso la FK vive del lado "N".'},
  {id:'q3', topic:'modelo', type:'vf',
    prompt:'En una relación N:M basta con agregar una llave foránea en cualquiera de las dos tablas, igual que en una relación 1:N.',
    answer:false,
    explain:'N:M necesita una tabla intermedia con dos llaves foráneas, una hacia cada tabla; el modelo relacional no permite una FK "de muchos a muchos" directa.'},
  {id:'q4', topic:'modelo', type:'match',
    prompt:'Relaciona cada tipo de integridad de datos con lo que protege.',
    pairs:[
      {l:'Integridad de identidad', r:'La llave primaria debe ser única y no nula; protege que cada registro se identifique sin ambigüedad.'},
      {l:'Integridad referencial', r:'Una llave foránea debe apuntar a un registro existente en la tabla referenciada, o ser NULL si la relación es opcional.'},
      {l:'Integridad de dominio', r:'Cada valor debe respetar el tipo de dato y las reglas del atributo: NOT NULL, CHECK, DEFAULT, rango o lista permitida.'}
    ],
    explain:'Las tres reglas de integridad se hacen cumplir con PRIMARY KEY, FOREIGN KEY, tipos de dato y restricciones como CHECK.'},
  {id:'q5', topic:'modelo', type:'fill',
    prompt:'Cuando un atributo no llave depende de otro atributo que tampoco es llave (por ejemplo, la ciudad depende del código postal, y el código postal depende de la llave primaria), existe una dependencia ___, y hace falta pasar a Tercera Forma Normal.',
    answers:['transitiva'],
    explain:'La 3FN exige que ningún atributo no llave dependa de otro atributo no llave; esas dependencias transitivas deben separarse en su propia tabla.'},
  {id:'q6', topic:'modelo', type:'connect',
    prompt:'Conecta cada tipo de llave con su definición.',
    pairs:[
      {l:'Llave candidata', r:'Cualquier atributo (o conjunto de atributos) que podría identificar de forma única cada registro; no se repite.'},
      {l:'Llave primaria (PK)', r:'La llave candidata elegida para identificar oficialmente cada registro: única, no nula y estable en el tiempo.'},
      {l:'Llave foránea (FK)', r:'Apunta a la PK de otra tabla; es la base de la integridad referencial y puede admitir NULL si la relación es opcional.'}
    ],
    explain:'Una llave primaria puede tener varios atributos (llave compuesta); una foránea siempre "mira hacia" la primaria de otra tabla.'},
  {id:'q7', topic:'modelo', type:'vf',
    prompt:'Una tabla cumple la Primera Forma Normal (1FN) cuando cada columna guarda un solo valor atómico (indivisible) y no hay grupos de valores repetidos en una misma celda.',
    answer:true,
    explain:'Justo lo contrario (por ejemplo, guardar varios teléfonos separados por comas en una sola celda) viola la 1FN.'},
  {id:'q8', topic:'modelo', type:'vf',
    prompt:'La dependencia parcial que viola la Segunda Forma Normal (2FN) solo puede ocurrir cuando la tabla tiene una llave primaria compuesta.',
    answer:true,
    explain:'Si la PK es simple (un solo atributo), ningún atributo puede depender "solo de una parte" de la llave; el problema aparece únicamente con llaves compuestas.'},
  {id:'q9', topic:'modelo', type:'open',
    prompt:'Tienes una tabla "matriculas" con columnas: id_matricula, id_alumno, nombre_alumno, id_curso, nombre_curso, calificacion (la llave primaria es id_matricula). El nombre del alumno y el del curso se repiten en cada fila donde aparecen. ¿Qué anomalía puede ocurrir y cómo lo resolverías aplicando normalización?',
    model:'Puede ocurrir una anomalía de actualización: si un alumno cambia de nombre, hay que corregirlo en todas las filas donde aparece, y si se olvida alguna, los datos quedan inconsistentes. El problema de fondo es una dependencia transitiva: nombre_alumno depende de id_alumno (no de la llave completa) y nombre_curso depende de id_curso. La solución es sacar "alumnos" (id_alumno, nombre_alumno) y "cursos" (id_curso, nombre_curso) a sus propias tablas, y dejar en "matriculas" solo id_alumno, id_curso (como llaves foráneas) y calificacion.'},

  // ========== 2. DDL, DML y SQL aplicado (8) ==========
  {id:'q10', topic:'ddldml', type:'connect',
    prompt:'Conecta cada sublenguaje de SQL con lo que hace.',
    pairs:[
      {l:'DDL', r:'Define la estructura de la base de datos: CREATE, ALTER, DROP, TRUNCATE.'},
      {l:'DML', r:'Manipula el contenido de las tablas: INSERT, SELECT, UPDATE, DELETE.'},
      {l:'DCL', r:'Controla el acceso: GRANT, REVOKE.'},
      {l:'TCL', r:'Administra transacciones: COMMIT, ROLLBACK, SAVEPOINT.'}
    ],
    explain:'Primero se ejecuta DDL (crear la tabla) y después DML (operar sobre su contenido): no se puede insertar en una tabla que aún no existe.'},
  {id:'q11', topic:'ddldml', type:'vf',
    prompt:'DDL hace un commit implícito, por lo que una operación como DROP TABLE o TRUNCATE TABLE no se puede revertir con ROLLBACK.',
    answer:true,
    explain:'A diferencia de DML, que sí se puede revertir con ROLLBACK antes del COMMIT, los cambios de estructura (DDL) quedan confirmados de inmediato.'},
  {id:'q12', topic:'ddldml', type:'match',
    prompt:'Relaciona cada instrucción con lo que borra y si se puede deshacer.',
    pairs:[
      {l:'DROP TABLE', r:'Elimina la tabla completa (estructura y datos); es DDL, no se puede deshacer.'},
      {l:'TRUNCATE TABLE', r:'Borra todas las filas pero conserva la estructura; es DDL, no se puede deshacer.'},
      {l:'DELETE', r:'Borra filas (todas o las que cumplan el WHERE) conservando la estructura; es DML, sí se puede deshacer con ROLLBACK antes del COMMIT.'}
    ],
    explain:'Los tres "borran" algo distinto: DROP la tabla entera, TRUNCATE solo las filas sin poder deshacerlo, DELETE las filas pudiendo deshacerlo.'},
  {id:'q13', topic:'ddldml', type:'fill',
    prompt:'Antes de ejecutar un UPDATE o DELETE sin estar seguro de qué filas se van a afectar, conviene correr primero un ___ con la misma condición del WHERE.',
    answers:['select'],
    explain:'Así se confirma exactamente qué filas cambiarán antes de modificarlas o borrarlas de verdad.'},
  {id:'q14', topic:'ddldml', type:'vf',
    prompt:'Las restricciones (NOT NULL, UNIQUE, CHECK, DEFAULT, PRIMARY KEY, FOREIGN KEY) se definen al crear o alterar la tabla, es decir, son DDL.',
    answer:true,
    explain:'Las restricciones forman parte de la estructura de la tabla; DDL las define y el motor las hace cumplir en cada operación DML posterior.'},
  {id:'q15', topic:'ddldml', type:'connect',
    prompt:'Conecta cada tipo de dato con lo que almacena.',
    pairs:[
      {l:'INT AUTO_INCREMENT', r:'Entero autoincremental, típico para llaves primarias.'},
      {l:'VARCHAR(n)', r:'Texto corto de longitud variable, hasta n caracteres.'},
      {l:'DECIMAL(p,s)', r:'Número decimal exacto (p = dígitos totales, s = decimales); ideal para dinero.'},
      {l:'DATETIME', r:'Fecha y hora.'},
      {l:'TINYINT(1) / BOOLEAN', r:'Verdadero o falso.'}
    ],
    explain:'Elegir el tipo de dato correcto también es una forma de integridad de dominio: evita, por ejemplo, guardar texto en una columna de dinero.'},
  {id:'q16', topic:'ddldml', type:'fill',
    prompt:'El sublenguaje de SQL que controla el acceso a los datos con las instrucciones GRANT y REVOKE se llama ___.',
    answers:['dcl'],
    explain:'DCL (Data Control Language) controla permisos; los otros tres sublenguajes son DDL (estructura), DML (contenido) y TCL (transacciones).'},
  {id:'q17', topic:'ddldml', type:'open',
    prompt:'Quieres cambiar el nombre del cliente con id_cliente = 1 a "Silverhand". Escribe la sentencia SQL y explica qué pasaría si olvidas el WHERE.',
    model:'UPDATE clientes SET nombre = \'Silverhand\' WHERE id_cliente = 1; Si se olvida el WHERE, el UPDATE afecta a TODAS las filas de la tabla clientes: el nombre de todos los clientes cambiaría a "Silverhand" en vez de solo el del cliente 1. Por eso conviene probar antes la misma condición con un SELECT, para confirmar qué filas se van a modificar.'},

  // ========== 3. Consultas multitabla (JOIN) (6) ==========
  {id:'q18', topic:'joins', type:'connect',
    prompt:'Conecta cada tipo de JOIN con lo que conserva de las tablas A y B.',
    pairs:[
      {l:'INNER JOIN', r:'Devuelve solo las filas donde la condición de unión se cumple en ambas tablas.'},
      {l:'LEFT JOIN', r:'Devuelve todo lo de la izquierda más las coincidencias de la derecha.'},
      {l:'RIGHT JOIN', r:'Devuelve todo lo de la derecha más las coincidencias de la izquierda; se usa poco, es el espejo del LEFT JOIN.'},
      {l:'FULL OUTER JOIN', r:'Devuelve todo de ambas tablas, coincida o no.'},
      {l:'CROSS JOIN', r:'Producto cartesiano: cada fila de A se combina con cada fila de B.'}
    ],
    explain:'Cada tipo de JOIN decide qué filas "sobreviven" cuando no hay coincidencia entre las tablas.'},
  {id:'q19', topic:'joins', type:'vf',
    prompt:'Cuando un motor no soporta FULL OUTER JOIN de forma nativa, se puede simular combinando LEFT JOIN, RIGHT JOIN y UNION.',
    answer:true,
    explain:'Es la forma estándar de simular un FULL OUTER JOIN cuando el motor no lo ofrece directamente.'},
  {id:'q20', topic:'joins', type:'fill',
    prompt:'El JOIN que combina cada fila de una tabla con cada fila de la otra sin ninguna condición de coincidencia, generando un producto cartesiano, se llama ___ JOIN.',
    answers:['cross'],
    explain:'Se usa poco en consultas de negocio; su caso típico es generar combinaciones, como una fila por cada par de talla y color.'},
  {id:'q21', topic:'joins', type:'vf',
    prompt:'Casi cualquier RIGHT JOIN se puede reescribir como un LEFT JOIN invirtiendo el orden de las tablas.',
    answer:true,
    explain:'Por eso en la práctica el RIGHT JOIN se usa poco: el LEFT JOIN invertido es la forma más habitual de escribir la misma consulta.'},
  {id:'q22', topic:'joins', type:'fill',
    prompt:'Si la tabla A tiene 3 filas y la tabla B tiene 4 filas, un CROSS JOIN entre A y B produce ___ filas.',
    answers:['12'],
    explain:'CROSS JOIN es un producto cartesiano: combina cada fila de A con cada fila de B, así que el resultado tiene 3×4 = 12 filas.'},
  {id:'q23', topic:'joins', type:'open',
    prompt:'Tienes las tablas socios y prestamos (con id_socio como llave foránea en prestamos). ¿Qué tipo de JOIN usarías, y con qué condición extra en el WHERE, para encontrar los socios que nunca han pedido un préstamo?',
    model:'Un LEFT JOIN de socios hacia préstamos (FROM socios LEFT JOIN prestamos ON socios.id_socio = prestamos.id_socio), porque hay que conservar TODOS los socios aunque no tengan préstamo. Después se filtra con WHERE prestamos.id_prestamo IS NULL, porque esa columna solo queda en NULL cuando no hubo coincidencia, es decir, cuando el socio nunca pidió un préstamo.'},

  // ========== 4. Programación sobre datos: SP, Functions y Triggers (7) ==========
  {id:'q24', topic:'progdatos', type:'connect',
    prompt:'Conecta cada concepto de programación sobre datos con su definición.',
    pairs:[
      {l:'Stored Procedure', r:'Conjunto de instrucciones SQL con nombre, guardado en la BD; recibe parámetros, puede modificar datos, no siempre regresa un valor y se invoca con EXEC/CALL.'},
      {l:'Function', r:'Recibe parámetros, hace un cálculo y siempre regresa un valor; se usa dentro de un SELECT o WHERE.'},
      {l:'Trigger', r:'Se ejecuta automáticamente cuando ocurre un evento (INSERT, UPDATE o DELETE); nunca se llama directamente.'}
    ],
    explain:'Programar sobre la base de datos reduce viajes de red y mejora la reutilización, la consistencia y la seguridad.'},
  {id:'q25', topic:'progdatos', type:'vf',
    prompt:'Una función siempre regresa un valor, mientras que un stored procedure no siempre lo hace.',
    answer:true,
    explain:'Esa es la diferencia clave: la función se define para calcular y devolver algo; el stored procedure puede solo ejecutar acciones.'},
  {id:'q26', topic:'progdatos', type:'fill',
    prompt:'Un trigger ___ (o INSTEAD OF) se ejecuta antes de que el cambio ocurra; uno AFTER se ejecuta después.',
    answers:['before'],
    explain:'Un trigger puede dispararse BEFORE/INSTEAD OF (antes del cambio) o AFTER (después), y siempre por evento: INSERT, UPDATE o DELETE.'},
  {id:'q27', topic:'progdatos', type:'match',
    prompt:'Relaciona cada tipo de función con lo que devuelve.',
    pairs:[
      {l:'Función escalar', r:'Devuelve un solo valor.'},
      {l:'Función de tabla', r:'Devuelve una tabla completa.'},
      {l:'Función agregada', r:'Resume varias filas en un solo valor (por ejemplo, una suma o un conteo).'}
    ],
    explain:'Los tres tipos de función se distinguen por lo que devuelven, no por cómo se invocan.'},
  {id:'q28', topic:'progdatos', type:'fill',
    prompt:'Los stored procedures se invocan explícitamente con la instrucción EXEC o ___.',
    answers:['call'],
    explain:'"EXEC" y "CALL" son las dos formas típicas (según el motor) de invocar un stored procedure; una función, en cambio, se usa directamente dentro de un SELECT.'},
  {id:'q29', topic:'progdatos', type:'vf',
    prompt:'Un trigger se ejecuta automáticamente cuando ocurre un evento (INSERT, UPDATE o DELETE) sobre su tabla; nadie lo invoca directamente como a un stored procedure.',
    answer:true,
    explain:'Esa es la diferencia clave frente a un stored procedure: el trigger reacciona a un evento, no se "llama" desde la aplicación.'},
  {id:'q30', topic:'progdatos', type:'open',
    prompt:'¿Por qué conviene usar un stored procedure para registrar una venta y descontar el inventario en el mismo paso, en lugar de hacerlo con dos instrucciones sueltas desde la aplicación?',
    model:'Porque ambas operaciones deben ocurrir juntas o ninguna debe ocurrir: al envolverlas en una transacción dentro del procedimiento, se evita que la aplicación quede a medias si falla justo entre las dos instrucciones. Además, cualquier aplicación (web, móvil, POS) llama al mismo procedimiento y obtiene siempre el mismo comportamiento, lo que reduce viajes de red y duplicación de lógica, y mejora la consistencia y la seguridad: justo las razones por las que conviene programar sobre la base de datos.'},

  // ========== 5. Bases de datos distribuidas: fundamentos, paralelismo y distribución (10) ==========
  {id:'q31', topic:'fundamentos', type:'connect',
    prompt:'Conecta cada modelo con su descripción.',
    pairs:[
      {l:'Centralizada', r:'Todos los datos y la lógica están en un único servidor o clúster; es sencilla y con consistencia fácil, pero escala solo verticalmente.'},
      {l:'Distribuida', r:'Los datos viven en varios nodos separados que cooperan como un solo sistema; no tiene un punto único de falla, pero exige protocolos de consistencia y más complejidad operativa.'}
    ],
    explain:'La centralizada crece "hacia arriba" en un solo servidor; la distribuida crece "hacia los lados" agregando nodos.'},
  {id:'q32', topic:'fundamentos', type:'fill',
    prompt:'La estrategia de distribución en la que filas distintas de una misma tabla viven en nodos distintos se llama partición ___ (o sharding).',
    answers:['horizontal'],
    explain:'Se distingue de la partición vertical (que separa columnas entre nodos) y de la replicación (que copia el mismo dato completo en varios nodos).'},
  {id:'q33', topic:'fundamentos', type:'vf',
    prompt:'La partición vertical separa columnas de una misma tabla entre distintos nodos, mientras que la replicación crea copias redundantes del mismo dato en varios nodos.',
    answer:true,
    explain:'Partición horizontal = filas distintas en nodos distintos. Partición vertical = columnas distintas en nodos distintos. Replicación = copias del mismo dato para disponibilidad y lecturas rápidas.'},
  {id:'q34', topic:'fundamentos', type:'connect',
    prompt:'Conecta cada ventaja de distribuir datos con lo que significa.',
    pairs:[
      {l:'Escalabilidad horizontal', r:'Se agregan más nodos para crecer, en lugar de un servidor más grande.'},
      {l:'Alta disponibilidad', r:'Si un nodo falla, otros siguen respondiendo.'},
      {l:'Menor latencia local', r:'Los datos están más cerca del usuario que los consulta.'},
      {l:'Aislamiento de fallos', r:'La falla de un nodo no tumba al resto del sistema.'}
    ],
    explain:'La guía también menciona mayor throughput y crecimiento incremental como ventajas de distribuir.'},
  {id:'q35', topic:'fundamentos', type:'connect',
    prompt:'Conecta cada reto de distribuir datos con lo que implica.',
    pairs:[
      {l:'Consistencia difícil', r:'Coordinar nodos que no comparten memoria ni reloj hace más difícil que todos vean el mismo dato.'},
      {l:'Teorema CAP', r:'Ante una partición de red, hay que elegir entre Consistencia y Disponibilidad.'},
      {l:'Complejidad operativa', r:'Administrar, monitorear y depurar muchos nodos es más difícil que administrar uno solo.'},
      {l:'Costo de coordinación', r:'Poner de acuerdo a varios nodos (candados, consenso, réplicas) toma tiempo y recursos de red.'}
    ],
    explain:'La guía agrega también la depuración compleja y la seguridad ampliada como retos de un sistema distribuido.'},
  {id:'q36', topic:'fundamentos', type:'vf',
    prompt:'El escenario típico de un sistema centralizado es una PyME administrativa; el de un sistema distribuido, un e-commerce global o streaming; y el de un sistema híbrido, la banca.',
    answer:true,
    explain:'Son los tres escenarios de aplicación que menciona la guía; el tema de "Escenarios" del examen los pone en práctica con más ejemplos.'},
  {id:'q37', topic:'fundamentos', type:'connect',
    prompt:'Conecta cada tipo de paralelismo con lo que ejecuta al mismo tiempo.',
    pairs:[
      {l:'Paralelismo de datos', r:'La misma operación corre a la vez sobre distintos fragmentos de datos.'},
      {l:'Paralelismo de consulta', r:'Una consulta se descompone en subtareas que corren simultáneamente.'},
      {l:'Paralelismo entre transacciones', r:'Varias transacciones independientes se ejecutan al mismo tiempo.'}
    ],
    explain:'El objetivo del paralelismo siempre es velocidad: usar varios procesadores o núcleos a la vez.'},
  {id:'q38', topic:'fundamentos', type:'vf',
    prompt:'La distribución y el paralelismo son exactamente lo mismo, porque ambos responden a la pregunta de dónde vive físicamente cada dato.',
    answer:false,
    explain:'Son ideas relacionadas, no idénticas: la distribución responde dónde vive el dato; el paralelismo responde cómo varios procesadores trabajan sobre él al mismo tiempo (puede darse incluso en un solo servidor con varios núcleos).'},
  {id:'q39', topic:'fundamentos', type:'fill',
    prompt:'Los objetivos de la distribución de datos son escalabilidad, disponibilidad y cercanía ___.',
    answers:['geografica'],
    explain:'Distribuir busca acercar los datos al usuario (cercanía geográfica), además de escalar y estar siempre disponible.'},
  {id:'q40', topic:'fundamentos', type:'open',
    prompt:'Una aplicación de analítica ejecuta la misma agregación (por ejemplo, sumar ventas) sobre 4 fragmentos distintos de una misma tabla, repartidos en 4 nodos, todos al mismo tiempo. ¿Qué tipo de paralelismo es este, y por qué no es exactamente lo mismo que "distribuir" los datos?',
    model:'Es paralelismo de datos: la misma operación (la suma) se ejecuta sobre distintos fragmentos de datos al mismo tiempo. No es lo mismo que distribuir, porque la distribución responde a dónde vive físicamente cada dato (en qué nodo o centro de datos), mientras que el paralelismo responde a cómo varios procesadores o nodos trabajan sobre esos datos al mismo tiempo; de hecho, el paralelismo puede darse incluso dentro de un solo servidor con varios núcleos, sin que los datos estén distribuidos en absoluto.'},

  // ========== 6. Arquitecturas de almacenamiento distribuido (12) ==========
  {id:'q41', topic:'arquitecturas', type:'connect',
    prompt:'Conecta cada arquitectura de almacenamiento distribuido con su idea central.',
    pairs:[
      {l:'Cliente-servidor', r:'Roles fijos: el cliente solicita (SQL, HTTP, NFS, SMB) y el servidor almacena, administra y responde; control centralizado, pero el servidor es cuello de botella.'},
      {l:'Peer-to-peer (P2P)', r:'No hay jerarquía central; cada nodo puede ser cliente y servidor a la vez (puro, con supernodos, o estructurado con DHT).'},
      {l:'Clúster', r:'Muchas máquinas coordinadas se presentan como un solo sistema; un nodo maestro guarda metadatos y reparte los bloques entre los nodos de datos.'},
      {l:'Multibase / federada', r:'Varias bases autónomas se consultan mediante una capa de mediación que traduce una consulta única en subconsultas y une los resultados.'}
    ],
    explain:'Cada arquitectura resuelve distinto el mismo problema: dónde viven los datos y quién los administra.'},
  {id:'q42', topic:'arquitecturas', type:'fill',
    prompt:'En un P2P estructurado, una tabla ___ (sigla de tabla hash distribuida) usa un hash consistente para asignar cada clave a un nodo; ejemplos de este modelo son IPFS/Filecoin, blockchain y Cassandra/Dynamo.',
    answers:['dht'],
    explain:'DHT: una clave determina qué nodo guarda el dato. Se complementa con gossip (los nodos se avisan entre sí quién está vivo y qué cambió) y direccionamiento por contenido (el contenido se identifica por su hash).'},
  {id:'q43', topic:'arquitecturas', type:'vf',
    prompt:'El modelo híbrido combina infraestructura local y en la nube: los datos sensibles quedan locales y se usa "cloud bursting" para aumentar la capacidad en picos de demanda.',
    answer:true,
    explain:'Local = infraestructura propia, control total, inversión inicial alta. Nube = infraestructura rentada, paga por uso, crece y decrece según demanda. Híbrido combina ambos.'},
  {id:'q44', topic:'arquitecturas', type:'connect',
    prompt:'Conecta cada razón para distribuir el almacenamiento con su explicación.',
    pairs:[
      {l:'Volumen', r:'Los datos ya no caben en un solo servidor.'},
      {l:'Disponibilidad', r:'Si una máquina falla, el servicio debe seguir funcionando.'},
      {l:'Velocidad', r:'Varios nodos pueden leer o procesar al mismo tiempo.'},
      {l:'Cercanía', r:'Acercar los datos al usuario para reducir la latencia.'}
    ],
    explain:'Estas cuatro razones son las que la guía da para justificar por qué distribuir el almacenamiento.'},
  {id:'q45', topic:'arquitecturas', type:'connect',
    prompt:'Conecta cada subtipo de red P2P con su forma de organizarse.',
    pairs:[
      {l:'P2P puro / no estructurado', r:'No hay índice ni coordinador central.'},
      {l:'P2P con supernodos', r:'Algunos nodos especiales mantienen el índice del resto.'},
      {l:'P2P estructurado (DHT)', r:'Un hash consistente asigna cada clave a un nodo concreto.'}
    ],
    explain:'Los tres subtipos son formas distintas de resolver el mismo problema: encontrar quién tiene un dato sin un servidor central fijo.'},
  {id:'q46', topic:'arquitecturas', type:'match',
    prompt:'Relaciona cada concepto de P2P con su definición.',
    pairs:[
      {l:'Gossip', r:'Los nodos se cuentan entre sí quién está vivo y qué cambió.'},
      {l:'Direccionamiento por contenido', r:'El contenido se identifica mediante su propio hash.'},
      {l:'Consistencia eventual', r:'Las copias de un dato terminan convergiendo, aunque no de inmediato.'}
    ],
    explain:'Estos tres conceptos aparecen juntos al describir cómo funciona una red P2P estructurada por dentro.'},
  {id:'q47', topic:'arquitecturas', type:'fill',
    prompt:'En un clúster, el nodo ___ (o coordinador) guarda los metadatos y decide en qué nodo va cada bloque de datos, mientras que los nodos de datos los almacenan y los replican entre sí.',
    answers:['maestro'],
    explain:'El nodo maestro/coordinador es el "cerebro" del clúster; si falla, el sistema necesita un mecanismo de recuperación automática para seguir funcionando.'},
  {id:'q48', topic:'arquitecturas', type:'vf',
    prompt:'Escalar un clúster implica particionar (dividir la tabla en fragmentos y repartirlos), replicar (tener varias copias de cada fragmento) y coordinar (elegir un líder y detectar caídas).',
    answer:true,
    explain:'Estas son las tres tareas que la guía asocia con escalar un clúster de almacenamiento distribuido.'},
  {id:'q49', topic:'arquitecturas', type:'connect',
    prompt:'Conecta cada forma de integrar varias bases de datos con su descripción.',
    pairs:[
      {l:'Multibase', r:'Las fuentes son independientes y no comparten un esquema; la aplicación resuelve las diferencias.'},
      {l:'Virtualización de datos', r:'No hay copia: se consulta en el origen y se integra al vuelo.'},
      {l:'Federada', r:'Existe un esquema global que da una vista unificada de varias fuentes.'}
    ],
    explain:'Las tres son variantes del mismo problema: dar una sola vista de datos que en realidad viven en fuentes distintas.'},
  {id:'q50', topic:'arquitecturas', type:'vf',
    prompt:'En la arquitectura cliente-servidor, el servidor puede convertirse en un cuello de botella y en un punto único de falla, aunque a cambio ofrece control y seguridad centralizados.',
    answer:true,
    explain:'Es el trade-off típico de cliente-servidor: fácil de controlar y asegurar, pero escala solo verticalmente y depende de un único servidor.'},
  {id:'q51', topic:'arquitecturas', type:'fill',
    prompt:'Los sistemas ERP, las aplicaciones departamentales y los servidores de archivos NAS son usos típicos de la arquitectura ___.',
    answers:['cliente-servidor','cliente servidor'],
    explain:'Son los tres usos que la guía asocia directamente con cliente-servidor, donde el cliente solicita y el servidor almacena, administra y responde.'},
  {id:'q52', topic:'arquitecturas', type:'open',
    prompt:'Explica con un ejemplo real la diferencia entre un clúster y una red P2P estructurada.',
    model:'Un clúster tiene un nodo maestro que decide dónde va cada bloque y coordina la replicación y la recuperación (por ejemplo, un sistema de almacenamiento distribuido con un nodo coordinador y varios nodos de datos); si el maestro falla, el sistema necesita elegir uno nuevo. Una red P2P estructurada, en cambio, no tiene ningún nodo especial: todos son iguales, y un hash consistente (DHT) decide en qué nodo se guarda cada clave, como en Cassandra/Dynamo o en una blockchain. La diferencia central es la jerarquía: el clúster tiene un coordinador (aunque sea reemplazable); el P2P estructurado no tiene ninguno.'},

  // ========== 7. Teorema CAP y PACELC (5) ==========
  {id:'q53', topic:'diseno', type:'connect',
    prompt:'Conecta cada elección del teorema CAP con lo que sacrifica.',
    pairs:[
      {l:'CP (Consistencia + tolerancia a Partición)', r:'Prioriza que los datos estén correctos aunque algunas solicitudes no puedan responderse; sacrifica disponibilidad.'},
      {l:'AP (Disponibilidad + tolerancia a Partición)', r:'Sigue respondiendo siempre, aunque los datos estén desactualizados; sacrifica consistencia.'}
    ],
    explain:'Ante una partición de red, el teorema CAP obliga a elegir entre Consistencia (C) y Disponibilidad (A); la Tolerancia a Partición (P) se asume inevitable en un sistema distribuido real.'},
  {id:'q54', topic:'diseno', type:'fill',
    prompt:'Según PACELC, cuando NO hay ninguna partición de red, un sistema distribuido todavía debe elegir entre Latencia y ___.',
    answers:['consistencia'],
    explain:'PACELC extiende CAP: "PAC" aplica cuando hay partición (elige entre A y C); "ELC" aplica en operación normal, sin partición (Else, elige entre Latencia y Consistencia).'},
  {id:'q55', topic:'diseno', type:'vf',
    prompt:'El teorema CAP obliga a elegir entre Consistencia y Disponibilidad únicamente cuando ocurre una partición de red.',
    answer:true,
    explain:'Fuera de una partición de red, un sistema podría intentar ofrecer ambas; el trade-off de CAP se activa justo cuando la red se corta.'},
  {id:'q56', topic:'diseno', type:'diagram', diagramKind:'triangle',
    prompt:'Completa el triángulo del teorema CAP: elige la etiqueta correcta para cada vértice.',
    slots:[
      {key:'top', pos:'top', label:'Vértice superior', correct:'Consistencia'},
      {key:'bl', pos:'bl', label:'Vértice inferior izquierdo', correct:'Disponibilidad'},
      {key:'br', pos:'br', label:'Vértice inferior derecho', correct:'Tolerancia a particiones'}
    ],
    pool:['Consistencia','Disponibilidad','Tolerancia a particiones','Latencia','Durabilidad'],
    explain:'CAP: Consistencia, Disponibilidad y Tolerancia a Particiones; ante una partición de red, hay que sacrificar C o A.'},
  {id:'q57', topic:'diseno', type:'open',
    prompt:'Un servicio de streaming en vivo debe decidir entre CP y AP para su chat y su contador de espectadores (no para el video en sí). ¿Qué elegirías y por qué, usando el teorema CAP?',
    model:'Elegiría AP: en un chat en vivo o un contador de espectadores, es mucho peor dejar de responder (que el chat se congele) que mostrar un dato ligeramente desactualizado (un mensaje con un segundo de retraso, o un contador que no es exacto al milisegundo). Sacrificar disponibilidad ahí arruinaría la experiencia; sacrificar algo de consistencia casi no se nota. Es distinto de, por ejemplo, un banco, donde sí conviene elegir CP.'},

  // ========== 8. Consistencia y concurrencia distribuida (5) ==========
  {id:'q58', topic:'consistencia', type:'connect',
    prompt:'Conecta cada tipo de consistencia con su descripción y un caso de uso.',
    pairs:[
      {l:'Consistencia fuerte', r:'Una lectura siempre obtiene la escritura más reciente; requiere coordinación síncrona. Más costosa y lenta, pero con datos actualizados. Casos: banca, mercado de valores.'},
      {l:'Consistencia eventual', r:'Replicación asíncrona: las réplicas se actualizan después de que el nodo primario ya confirmó. Más velocidad y disponibilidad, a costa de la consistencia. Casos: likes, carritos, microblogging.'}
    ],
    explain:'La elección depende de cuánto cuesta mostrar un dato desactualizado: en banca es inaceptable; en un contador de "me gusta" casi no importa.'},
  {id:'q59', topic:'consistencia', type:'connect',
    prompt:'Conecta cada mecanismo de concurrencia distribuida con su forma de operar.',
    pairs:[
      {l:'2PL distribuido (two-phase locking)', r:'Pide permiso (candado) antes de tocar el dato y no lo libera hasta terminar la transacción; implica más viajes de red y riesgo de interbloqueo.'},
      {l:'Marcas de tiempo', r:'Cada transacción recibe un orden mediante una marca temporal (reloj de Lamport); si llega una operación vieja, se rechaza o reintenta.'},
      {l:'OCC (control de concurrencia optimista)', r:'Cada nodo trabaja primero y valida hasta el final, justo antes del commit, si alguien más modificó el dato; si hay conflicto, aborta o reintenta.'}
    ],
    explain:'Las tres estrategias resuelven el mismo problema —dos transacciones que intentan modificar el mismo dato desde nodos distintos al mismo tiempo— con distinto costo en bloqueos, latencia y reintentos.'},
  {id:'q60', topic:'consistencia', type:'vf',
    prompt:'El 2PL distribuido usa candados y no los libera hasta que termina la transacción, lo que puede generar interbloqueos (deadlocks).',
    answer:true,
    explain:'Es uno de los problemas típicos del 2PL, junto con los viajes de red y la latencia adicional que implica pedir permiso a cada nodo antes de tocar el dato.'},
  {id:'q61', topic:'consistencia', type:'fill',
    prompt:'En el mecanismo de marcas de tiempo, cada transacción recibe un orden mediante un reloj de ___; si llega una operación "vieja", se rechaza o se reintenta, como el ticket de un banco.',
    answers:['lamport'],
    explain:'El reloj de Lamport da un orden lógico a las transacciones sin necesitar un reloj físico compartido entre nodos.'},
  {id:'q62', topic:'consistencia', type:'open',
    prompt:'Explica por qué un sistema con Consistencia Fuerte suele tener más latencia que uno con Consistencia Eventual, y da un caso de uso típico para cada uno.',
    model:'La Consistencia Fuerte usa coordinación síncrona: toda lectura debe devolver la escritura más reciente, lo que exige esperar la confirmación de los nodos involucrados antes de responder, y eso cuesta tiempo (viajes de red de ida y vuelta). La Consistencia Eventual usa replicación asíncrona: los nodos responden de inmediato con su copia local y, con el tiempo, van convergiendo. Caso típico de consistencia fuerte: banca o mercado de valores. Caso típico de consistencia eventual: likes, carritos de compra o microblogging.'},

  // ========== 9. Escenarios: qué base de datos y qué distribución usar (10) ==========
  {id:'q63', topic:'escenarios', type:'mc',
    prompt:'Una PyME con un solo local y pocos empleados necesita un sistema para administrar inventario y ventas, sin presupuesto para infraestructura compleja. ¿Qué arquitectura conviene?',
    options:['Base de datos centralizada en un único servidor','Base de datos distribuida con particionamiento horizontal en 5 nodos','Arquitectura P2P estructurada con DHT','Base de datos federada que combine 3 fuentes externas'],
    answerIndex:0,
    explain:'La guía marca a la PyME administrativa como el escenario típico de sistema centralizado: es más sencilla, con consistencia fácil y administración central; no justifica la complejidad de distribuir.'},
  {id:'q64', topic:'escenarios', type:'mc',
    prompt:'Una empresa de e-commerce global, con millones de usuarios y catálogos regionales, necesita que la caída de un servidor no tumbe todo el sitio, y quiere baja latencia en cada región. ¿Qué arquitectura conviene?',
    options:['Centralizada en un único servidor','Distribuida, con nodos en varias regiones','Cliente-servidor puro con un solo punto de acceso','Ninguna: basta con una sola base de datos más grande'],
    answerIndex:1,
    explain:'El e-commerce global y el streaming son el ejemplo típico de escenario distribuido en la guía: alta disponibilidad, menor latencia local y aislamiento de fallos.'},
  {id:'q65', topic:'escenarios', type:'mc',
    prompt:'Un banco maneja datos sensibles de cuentas, que por regulación deben quedar en infraestructura propia, pero también necesita escalar su app móvil en campañas de alta demanda. ¿Qué modelo de infraestructura conviene?',
    options:['100% en la nube','100% local (on-premise)','Híbrido: datos sensibles locales, cómputo elástico en la nube (cloud bursting)','Peer-to-peer sin servidor central'],
    answerIndex:2,
    explain:'La guía marca a la banca como el escenario típico de arquitectura híbrida: los datos sensibles quedan locales y la nube absorbe los picos de demanda (cloud bursting).'},
  {id:'q66', topic:'escenarios', type:'mc',
    prompt:'Una red social muestra un contador de "me gusta" en cada publicación. Si tarda un par de segundos en actualizarse para todos, no pasa nada grave, pero el sitio debe responder siempre aunque un nodo falle. ¿Qué tipo de consistencia conviene priorizar?',
    options:['Consistencia fuerte (linearizabilidad)','Consistencia eventual, aceptando algo de desactualización a cambio de disponibilidad','Ninguna: el sitio no necesita replicar datos','2PL distribuido con candados en cada lectura'],
    answerIndex:1,
    explain:'Likes, carritos y microblogging son justo los ejemplos de la guía para consistencia eventual: prioriza disponibilidad y velocidad, y tolera que el dato tarde en converger.'},
  {id:'q67', topic:'escenarios', type:'mc',
    prompt:'Un sistema de transferencias bancarias no puede mostrar saldos distintos en dos sucursales ni aplicar una transferencia con datos desactualizados, aunque eso implique rechazar alguna operación durante una falla de red. ¿Qué elección del teorema CAP describe mejor este sistema?',
    options:['AP: prioriza disponibilidad aunque el dato esté desactualizado','CP: prioriza consistencia aunque algunas solicitudes no puedan responderse','Ninguna de las dos: CAP no aplica a bancos','Elegir siempre latencia sobre consistencia'],
    answerIndex:1,
    explain:'Un banco es el ejemplo clásico de sistema CP: prefiere no responder (o rechazar la operación) antes que mostrar un saldo inconsistente.'},
  {id:'q68', topic:'escenarios', type:'mc',
    prompt:'Una empresa de streaming tiene una tabla de "reproducciones" con miles de millones de filas. Quiere repartir las filas más recientes (últimos 30 días) en nodos rápidos y las antiguas en nodos más baratos, sin tocar el resto de las columnas. ¿Qué estrategia de distribución es esta?',
    options:['Partición vertical','Partición horizontal (sharding) por rango de fecha','Replicación total en cada nodo','Arquitectura P2P sin coordinador'],
    answerIndex:1,
    explain:'Repartir filas distintas (por fecha) de la misma tabla entre nodos distintos es partición horizontal / sharding; la vertical repartiría columnas, no filas.'},
  {id:'q69', topic:'escenarios', type:'mc',
    prompt:'Varias filiales de un grupo empresarial tienen cada una su propia base de datos, con esquemas distintos, sin intención de fusionarlos físicamente; pero la dirección quiere una sola consulta que junte las ventas de todas. ¿Qué solución encaja mejor?',
    options:['Migrar todo a una sola base de datos centralizada','Una capa de mediación (multibase / federada) que traduzca la consulta en subconsultas y una los resultados','Replicación total de cada filial hacia las demás','Particionamiento horizontal de una tabla única'],
    answerIndex:1,
    explain:'Ese es el escenario de multibase/federación de la guía: fuentes autónomas con esquemas distintos, unidas por una capa de mediación sin copiar los datos.'},
  {id:'q70', topic:'escenarios', type:'mc',
    prompt:'Una aplicación tipo blockchain no confía en ningún servidor central; cada nodo debe poder guardar y validar datos, y el sistema debe seguir funcionando aunque muchos nodos se desconecten. ¿Qué arquitectura describe mejor esto?',
    options:['Cliente-servidor clásico','Clúster con un único nodo maestro','Peer-to-peer estructurado (DHT), como Cassandra o blockchain','Base de datos centralizada con una réplica de respaldo'],
    answerIndex:2,
    explain:'La guía menciona blockchain, IPFS/Filecoin y Cassandra/Dynamo como ejemplos reales de P2P estructurado con DHT: no hay jerarquía central y cada nodo participa como cliente y servidor.'},
  {id:'q71', topic:'escenarios', type:'mc',
    prompt:'En una app de documentos colaborativos, dos usuarios en distintas regiones editan el mismo documento al mismo tiempo. El sistema prefiere dejar trabajar a ambos y validar conflictos justo antes de guardar, en lugar de bloquear el documento desde el inicio. ¿Qué mecanismo de concurrencia describe esto?',
    options:['2PL distribuido con candados desde el inicio','Marcas de tiempo con reloj de Lamport','OCC (control de concurrencia optimista)','Consistencia fuerte con bloqueo síncrono en cada tecla'],
    answerIndex:2,
    explain:'OCC deja trabajar primero a cada nodo y solo valida los conflictos justo antes del commit; si hubo conflicto, aborta o reintenta.'},
  {id:'q72', topic:'escenarios', type:'mc',
    prompt:'Una empresa quiere separar los datos de contacto de sus clientes (nombre, correo) de sus datos de facturación (tarjetas, historial de pagos) en servidores distintos, por seguridad y por patrones de acceso distintos, sin dividir las filas entre nodos. ¿Qué estrategia de distribución es esta?',
    options:['Partición horizontal','Partición vertical','Replicación total','Arquitectura P2P'],
    answerIndex:1,
    explain:'Separar columnas (no filas) de la misma tabla lógica entre nodos distintos es partición vertical.'}
];
