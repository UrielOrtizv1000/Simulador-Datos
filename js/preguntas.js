/*
  preguntas.js
  Contenido del examen: los 7 temas (TOPICS) y el banco de 45 preguntas (QUESTION_BANK).
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

  Esta edición cubre Bases de Datos: modelo relacional y normalización, DDL/DML,
  consultas multitabla (JOIN), programación sobre datos (SP/Functions/Triggers) y,
  del lado distribuido, arquitecturas de almacenamiento, diseño (requerimientos, CAP,
  ACID/BASE) y consistencia/concurrencia (PACELC, bloqueos, deadlocks, 2PC).
*/

var TOPICS = [
  {id:'modelo', name:'Modelo relacional, llaves y normalización', short:'Modelo relacional', color:'--t-cia'},
  {id:'ddldml', name:'DDL, DML y SQL aplicado', short:'DDL y DML', color:'--t-avr'},
  {id:'joins', name:'Consultas multitabla (JOIN)', short:'JOIN', color:'--t-ia'},
  {id:'progdatos', name:'Programación sobre datos: SP, Functions y Triggers', short:'Programación', color:'--t-hackers'},
  {id:'arquitecturas', name:'Bases de datos distribuidas: fundamentos y arquitecturas', short:'BD distribuidas', color:'--t-leyes'},
  {id:'diseno', name:'Diseño distribuido: requerimientos, CAP y ACID/BASE', short:'Diseño y CAP', color:'--t-eh'},
  {id:'consistencia', name:'Consistencia, concurrencia y 2PC', short:'Consistencia', color:'--t-defensa'}
];

var QUESTION_BANK = [
  // ---------- Modelo relacional, llaves y normalización (8) ----------
  {id:'q1', topic:'modelo', type:'vf',
    prompt:'Edgar F. Codd propuso el modelo relacional en 1970, organizando los datos en tablas formadas por tuplas (renglones) y atributos (columnas).',
    answer:true,
    explain:'Codd publicó "A Relational Model of Data for Large Shared Data Banks" en 1970; es la base teórica de MySQL, PostgreSQL, Oracle y SQL Server.'},
  {id:'q2', topic:'modelo', type:'fill',
    prompt:'En una tabla relacional, el número total de atributos (columnas) de una relación se llama ___ de la relación.',
    answers:['grado'],
    explain:'Grado = número de atributos. Por ejemplo, una tabla clientes con id_cliente, nombre, correo y ciudad tiene grado 4.'},
  {id:'q3', topic:'modelo', type:'connect',
    prompt:'Conecta cada cardinalidad con dónde vive la llave foránea en el esquema de la tienda.',
    pairs:[
      {l:'1:1 (Pedido y Pago)', r:'La llave foránea va en la tabla "pagos", con una restricción UNIQUE sobre id_pedido.'},
      {l:'1:N (Cliente y Pedidos)', r:'La llave foránea va en el lado "N": en la tabla "pedidos" (columna id_cliente).'},
      {l:'1:N (Categoría y Productos)', r:'La llave foránea va en "productos" (columna id_categoria).'},
      {l:'N:M (Pedidos y Productos)', r:'Se resuelve con una tabla intermedia, "detalle_pedido", que guarda ambas llaves foráneas.'}
    ],
    explain:'La llave foránea siempre vive del lado "N"; una relación N:M necesita una tabla asociativa porque el modelo relacional no permite FK "de muchos a muchos" directas.'},
  {id:'q4', topic:'modelo', type:'fill',
    prompt:'La llave candidata que se elige para identificar oficialmente cada renglón de una tabla se llama llave ___.',
    answers:['primaria'],
    explain:'Debe ser única, nunca nula (NOT NULL implícito) e idealmente estable en el tiempo; puede ser simple o compuesta.'},
  {id:'q5', topic:'modelo', type:'vf',
    prompt:'Una llave foránea (foreign key) puede admitir valores NULL cuando la relación que representa es opcional.',
    answer:true,
    explain:'Puede repetirse dentro de su tabla (el lado "N" de una relación 1:N) y puede admitir NULL si la relación es opcional.'},
  {id:'q6', topic:'modelo', type:'open',
    prompt:'Explica la diferencia entre integridad de entidad, integridad referencial e integridad de dominio, y da un ejemplo de violación de cada una.',
    model:'Integridad de entidad: la llave primaria debe ser única y nunca nula (ej. insertar dos productos con el mismo id_producto). Integridad referencial: toda llave foránea debe existir como llave primaria en la tabla referenciada, o ser NULL si se permite (ej. un pedido con un id_cliente que no existe). Integridad de dominio: cada valor debe respetar el tipo de dato y las reglas del atributo (ej. un precio negativo o un texto en un campo numérico). Las tres se declaran con PRIMARY KEY, FOREIGN KEY, tipos de dato y CHECK, y el motor las hace cumplir en cada operación.'},
  {id:'q7', topic:'modelo', type:'fill',
    prompt:'Cuando una tabla en 2FN todavía tiene un atributo que depende de otro atributo que no es llave (por ejemplo, el nombre del cliente depende de id_cliente, que a su vez depende de id_pedido), se dice que existe una dependencia ___, y hace falta llevar la tabla a Tercera Forma Normal.',
    answers:['transitiva'],
    explain:'Dependencia transitiva: A -> B -> C. La solución es mover esos atributos a su propia tabla (ej. "clientes") y dejar solo la llave foránea.'},
  {id:'q8', topic:'modelo', type:'vf',
    prompt:'Una tabla está en Primera Forma Normal (1FN) si alguna de sus columnas guarda listas de valores separadas por comas o por el carácter "|".',
    answer:false,
    explain:'Justo lo contrario: eso viola la 1FN (rompe la atomicidad). Para cumplirla, cada celda debe tener un solo valor, y las listas deben separarse en renglones o en una tabla propia.'},

  // ---------- DDL, DML y SQL aplicado (6) ----------
  {id:'q9', topic:'ddldml', type:'connect',
    prompt:'Conecta cada instrucción con lo que realmente elimina y si se puede deshacer.',
    pairs:[
      {l:'DROP TABLE', r:'Elimina la tabla completa (estructura y datos); no se puede deshacer y no aplica reinicio de autoincremento.'},
      {l:'TRUNCATE TABLE', r:'Elimina todas las filas pero conserva la estructura; es DDL (no se deshace) y sí reinicia el autoincremento.'},
      {l:'DELETE (DML)', r:'Elimina las filas seleccionadas (o todas), conservando la estructura; sí se puede deshacer con ROLLBACK antes del COMMIT.'}
    ],
    explain:'DROP y TRUNCATE no piden confirmación y casi nunca se pueden revertir; por eso conviene respaldar antes de ejecutarlos en producción.'},
  {id:'q10', topic:'ddldml', type:'vf',
    prompt:'DDL hace un commit implícito, por lo que un cambio de estructura no se puede revertir con ROLLBACK como sí ocurre con DML.',
    answer:true,
    explain:'Por eso un DROP TABLE mal ejecutado es uno de los errores más costosos en producción: no hay vuelta atrás.'},
  {id:'q11', topic:'ddldml', type:'fill',
    prompt:'La restricción ___ garantiza que una columna nunca tenga valores repetidos, aunque sí puede admitir un NULL.',
    answers:['unique'],
    explain:'A diferencia de PRIMARY KEY (que no admite NULL ni repetidos), UNIQUE solo prohíbe los valores repetidos.'},
  {id:'q12', topic:'ddldml', type:'vf',
    prompt:'En el esquema gestion_pedidos, la tabla Pedido_Productos usa una llave primaria compuesta por IdPedido e IdProducto.',
    answer:true,
    explain:'PRIMARY KEY (IdPedido, IdProducto): es la combinación mínima que identifica cada renglón de esa tabla intermedia.'},
  {id:'q13', topic:'ddldml', type:'fill',
    prompt:'Antes de ejecutar un UPDATE o DELETE sin estar seguro de qué filas afectará, la buena práctica es correr primero un ___ con la misma condición del WHERE.',
    answers:['select'],
    explain:'Así confirmas exactamente qué filas se van a afectar antes de modificarlas o borrarlas de verdad.'},
  {id:'q14', topic:'ddldml', type:'open',
    prompt:'¿Por qué siempre se enseña y se ejecuta primero el DDL y después el DML? Explica qué pasaría si se intentara al revés.',
    model:'Porque DDL define el contenedor (bases de datos, tablas, columnas) y DML opera sobre el contenido de ese contenedor (filas). No se puede insertar, leer, actualizar ni borrar datos en una tabla que todavía no existe, así que intentar DML antes que DDL simplemente fallaría: el motor no encontraría la tabla o columna referenciada.'},

  // ---------- Consultas multitabla (JOIN) (6) ----------
  {id:'q15', topic:'joins', type:'connect',
    prompt:'Conecta cada tipo de JOIN con lo que conserva de las tablas A y B.',
    pairs:[
      {l:'INNER JOIN', r:'Devuelve solo las filas donde la condición de unión se cumple en ambas tablas.'},
      {l:'LEFT JOIN', r:'Devuelve todas las filas de la tabla izquierda, tengan o no coincidencia; sin coincidencia, la derecha se rellena con NULL.'},
      {l:'RIGHT JOIN', r:'Es el espejo del LEFT JOIN: devuelve todas las filas de la tabla derecha, tengan o no coincidencia.'},
      {l:'FULL OUTER JOIN', r:'Conserva las filas de ambas tablas, tengan o no coincidencia del otro lado.'},
      {l:'CROSS JOIN', r:'Combina cada fila de una tabla con cada fila de la otra, sin condición de coincidencia (producto cartesiano).'}
    ],
    explain:'Cada tipo de JOIN decide qué filas "sobreviven" cuando no hay coincidencia entre las tablas.'},
  {id:'q16', topic:'joins', type:'vf',
    prompt:'MySQL soporta de forma nativa el FULL OUTER JOIN, igual que PostgreSQL.',
    answer:false,
    explain:'PostgreSQL sí lo soporta nativamente; en MySQL hay que simularlo combinando un LEFT JOIN y un RIGHT JOIN con UNION.'},
  {id:'q17', topic:'joins', type:'fill',
    prompt:'Para encontrar los socios que nunca han pedido un préstamo se usa un LEFT JOIN de socios hacia préstamos, filtrando WHERE p.id_prestamo IS ___.',
    answers:['null'],
    explain:'Si no hay coincidencia, las columnas de la tabla de la derecha (préstamos) quedan en NULL; ese filtro aísla a los socios sin préstamos.'},
  {id:'q18', topic:'joins', type:'vf',
    prompt:'Casi cualquier RIGHT JOIN se puede reescribir como un LEFT JOIN invirtiendo el orden de las tablas.',
    answer:true,
    explain:'Por eso en la práctica el RIGHT JOIN se usa poco: el LEFT JOIN invertido es la forma más habitual de escribir la misma consulta.'},
  {id:'q19', topic:'joins', type:'open',
    prompt:'Explica la diferencia entre un INNER JOIN y un LEFT JOIN, usando el ejemplo de libros y préstamos de una biblioteca.',
    model:'Un INNER JOIN entre libros y préstamos devuelve únicamente los libros que sí tienen al menos un préstamo registrado: si un libro nunca se ha prestado, simplemente no aparece en el resultado. Un LEFT JOIN, en cambio, devuelve TODOS los libros (la tabla de la izquierda), tengan o no préstamo; para los libros sin préstamo, las columnas de la tabla de préstamos (fecha_prestamo, etc.) aparecen como NULL.'},
  {id:'q20', topic:'joins', type:'fill',
    prompt:'El JOIN que genera el producto cartesiano entre dos tablas, combinando cada fila de una con cada fila de la otra sin ninguna condición de coincidencia, se llama ___ JOIN.',
    answers:['cross'],
    explain:'Se usa poco en consultas de negocio; su caso típico es generar combinaciones, como una fila por cada par de talla y color.'},

  // ---------- Programación sobre datos: SP, Functions y Triggers (6) ----------
  {id:'q21', topic:'progdatos', type:'connect',
    prompt:'Conecta cada concepto de programación sobre datos con su definición.',
    pairs:[
      {l:'Stored Procedure', r:'Conjunto de instrucciones SQL con nombre que se invoca con EXEC o CALL; no siempre regresa un valor y puede modificar datos.'},
      {l:'Function', r:'Rutina que recibe parámetros y SIEMPRE regresa un valor; se puede usar dentro de un SELECT como si fuera una columna.'},
      {l:'Trigger', r:'Bloque de código asociado a una tabla que se ejecuta automáticamente ante un evento (INSERT, UPDATE o DELETE); nadie lo llama directamente.'},
      {l:'inserted', r:'Tabla temporal de un trigger que contiene los valores nuevos del evento.'},
      {l:'deleted', r:'Tabla temporal de un trigger que contiene los valores anteriores del evento.'}
    ],
    explain:'Los tres viven cerca de los datos para reducir viajes de red, dar consistencia y controlar permisos sobre el objeto en lugar de sobre toda la tabla.'},
  {id:'q22', topic:'progdatos', type:'vf',
    prompt:'Una función (function) puede modificar datos con INSERT, UPDATE o DELETE igual que un stored procedure.',
    answer:false,
    explain:'Las funciones no modifican datos; solo calculan y regresan un valor. Modificar datos sin restricción es propio del stored procedure.'},
  {id:'q23', topic:'progdatos', type:'fill',
    prompt:'Un trigger ___ se ejecuta antes de aplicar el cambio (por ejemplo para validar o corregir datos); uno AFTER se ejecuta después (auditoría, notificaciones, cálculos).',
    answers:['before'],
    explain:'BEFORE / INSTEAD OF actúan antes del cambio; AFTER actúa después. Ambos se disparan por evento: INSERT, UPDATE o DELETE.'},
  {id:'q24', topic:'progdatos', type:'vf',
    prompt:'Un stored procedure se puede usar directamente dentro de una cláusula SELECT, igual que una función.',
    answer:false,
    explain:'La función sí se usa dentro de un SELECT como una expresión; el stored procedure se invoca aparte con EXEC/CALL, nunca dentro de un SELECT.'},
  {id:'q25', topic:'progdatos', type:'open',
    prompt:'¿Por qué conviene usar un stored procedure para registrar una venta y descontar el inventario en el mismo paso, en lugar de hacerlo con dos instrucciones sueltas desde la aplicación?',
    model:'Porque ambas operaciones (insertar la venta y actualizar el stock) deben ocurrir juntas o ninguna debe ocurrir: al envolverlas en una transacción dentro del procedimiento, se evita que una app se quede a medias si falla justo entre las dos instrucciones. Además, cualquier aplicación (web, móvil, POS) llama al mismo procedimiento y obtiene siempre el mismo comportamiento, sin duplicar la lógica ni arriesgarse a que alguna app se salte un paso.'},
  {id:'q26', topic:'progdatos', type:'fill',
    prompt:'Las funciones se invocan escribiendo SELECT fn(...), mientras que los stored procedures se invocan con EXEC o ___.',
    answers:['call'],
    explain:'"EXEC" y "CALL" son las dos formas típicas (según el motor) de invocar un stored procedure; nunca se usan dentro de un SELECT.'},

  // ---------- Bases de datos distribuidas: fundamentos y arquitecturas (6) ----------
  {id:'q27', topic:'arquitecturas', type:'connect',
    prompt:'Conecta cada arquitectura de almacenamiento distribuido con su idea central.',
    pairs:[
      {l:'Cliente-Servidor', r:'Un proveedor central posee y administra los datos; muchos clientes los solicitan mediante un protocolo.'},
      {l:'Peer-to-Peer (P2P)', r:'Todos los nodos son iguales: cada uno consume y a la vez provee almacenamiento; los datos se replican entre ellos.'},
      {l:'Clúster', r:'Muchos servidores administrados como una sola unidad; un nodo maestro guarda metadatos y reparte los bloques entre los nodos de datos.'},
      {l:'Multibase / Federación', r:'Varias bases autónomas se consultan como si fueran una sola, sin mover los datos de su sistema de origen.'},
      {l:'Híbrido (local + nube)', r:'Los datos sensibles quedan locales y el cómputo elástico va a la nube; permite "reventar" a la nube en picos (cloud bursting).'}
    ],
    explain:'Cada arquitectura resuelve distinto el mismo problema: dónde viven los datos y quién los administra.'},
  {id:'q28', topic:'arquitecturas', type:'vf',
    prompt:'En una base de datos distribuida la escalabilidad es horizontal (agregar más nodos), mientras que en una centralizada es vertical (más CPU/RAM al mismo servidor).',
    answer:true,
    explain:'Es una de las diferencias clave: la centralizada crece "hacia arriba" en un solo servidor; la distribuida crece "hacia los lados" agregando nodos.'},
  {id:'q29', topic:'arquitecturas', type:'fill',
    prompt:'En una red P2P estructurada, la tabla ___ (sigla de tabla hash distribuida) decide, mediante un hash, en qué nodo concreto se guarda cada dato.',
    answers:['dht'],
    explain:'DHT = tabla hash distribuida. Ejemplos de este tipo de P2P estructurado: Cassandra, IPFS y Chord.'},
  {id:'q30', topic:'arquitecturas', type:'vf',
    prompt:'El paralelismo y la distribución son exactamente lo mismo: ambos responden a la pregunta de dónde vive físicamente cada dato.',
    answer:false,
    explain:'Son ideas relacionadas, no idénticas: la distribución responde dónde vive el dato; el paralelismo responde cómo varios procesadores trabajan sobre él al mismo tiempo (puede ocurrir hasta en un solo servidor con varios núcleos).'},
  {id:'q31', topic:'arquitecturas', type:'fill',
    prompt:'La estrategia de distribución que divide filas de una misma tabla entre nodos distintos, por ejemplo por rango de ID o por región, se llama partición ___ (o sharding).',
    answers:['horizontal'],
    explain:'Se distingue de la partición vertical (que separa columnas) y de la replicación (que copia el mismo dato en varios nodos).'},
  {id:'q32', topic:'arquitecturas', type:'open',
    prompt:'Menciona una ventaja y una limitación de la arquitectura Peer-to-Peer (P2P), y un ejemplo real donde se use.',
    model:'Ventaja: no tiene un punto único de falla, ya que el sistema sobrevive a la caída de nodos individuales (además escala horizontalmente casi sin límite y a bajo costo). Limitación: la consistencia es eventual, por lo que se puede leer un dato desactualizado, y la seguridad/confianza son difíciles porque los pares son desconocidos. Ejemplos reales: IPFS/Filecoin (almacenamiento por contenido), blockchain (réplica del libro mayor en cada nodo) o Cassandra/Dynamo (anillo de nodos con gossip).'},

  // ---------- Diseño distribuido: requerimientos, CAP y ACID/BASE (6) ----------
  {id:'q33', topic:'diseno', type:'connect',
    prompt:'Conecta cada concepto de diseño distribuido con su definición.',
    pairs:[
      {l:'Consistencia (C)', r:'Todos los nodos responden con el mismo dato.'},
      {l:'Disponibilidad (A)', r:'Cada solicitud recibe una respuesta.'},
      {l:'Tolerancia a partición (P)', r:'El sistema sigue operando aunque la red se corte; en un sistema distribuido real, siempre puede pasar.'},
      {l:'ACID', r:'Prioriza la consistencia; típico de bases relacionales distribuidas (pagos, inventarios, reservas).'},
      {l:'BASE', r:'Prioriza la disponibilidad; típico de bases NoSQL documentales o clave-valor (contadores, feeds, catálogos).'}
    ],
    explain:'C, A y P son las tres letras del teorema CAP; ACID y BASE son las dos filosofías que se acercan, respectivamente, a CP y a AP.'},
  {id:'q34', topic:'diseno', type:'vf',
    prompt:'Un requerimiento funcional describe QUÉ debe hacer el sistema, mientras que uno no funcional describe QUÉ TAN BIEN lo hace (velocidad, disponibilidad, seguridad).',
    answer:true,
    explain:'Ejemplo funcional: "permitir pagar con tarjeta". Ejemplo no funcional: "el pago se procesa en menos de 2 s".'},
  {id:'q35', topic:'diseno', type:'fill',
    prompt:'Un sistema CP prefiere rechazar una operación antes que mostrar un dato desactualizado; un sistema ___ prefiere responder siempre aunque el dato pueda estar un poco desactualizado.',
    answers:['ap'],
    explain:'CP y AP son las dos elecciones posibles ante una partición de red, según el teorema CAP.'},
  {id:'q36', topic:'diseno', type:'vf',
    prompt:'OLTP se caracteriza por muchas filas y agregaciones, mientras que OLAP se caracteriza por pocas filas y consultas muy frecuentes.',
    answer:false,
    explain:'Es al revés: OLTP = pocas filas, muy frecuentes (operar el negocio en tiempo real); OLAP = muchas filas, agregaciones (analizar el negocio en el tiempo).'},
  {id:'q37', topic:'diseno', type:'fill',
    prompt:'En el recordatorio de las propiedades ACID, la letra I corresponde a ___, que garantiza que las transacciones concurrentes no se pisen entre sí.',
    answers:['aislamiento'],
    explain:'A = Atomicidad (todo o nada), C = Consistencia, I = Aislamiento, D = Durabilidad.'},
  {id:'q38', topic:'diseno', type:'open',
    prompt:'Un banco necesita decidir si su sistema de transferencias debe ser CP o AP. Explica qué elegirías y por qué, usando el teorema CAP.',
    model:'Elegiría CP (Consistencia + Partición): en un sistema bancario es preferible rechazar una operación antes que mostrar o aplicar un saldo desactualizado, porque un dato incorrecto en dinero puede causar transferencias duplicadas o saldos inconsistentes. Esto coincide con el perfil ACID (pagos, inventarios, reservas), aunque tenga un costo de latencia y, ante una partición de red, algunas operaciones puedan quedar bloqueadas hasta restaurar la consistencia.'},

  // ---------- Consistencia, concurrencia y 2PC (7) ----------
  {id:'q39', topic:'consistencia', type:'connect',
    prompt:'Conecta cada estrategia o mecanismo de concurrencia/bloqueo con su descripción.',
    pairs:[
      {l:'2PL Distribuido (pesimista)', r:'Pide un candado a todas las réplicas antes de leer o escribir, y no lo suelta hasta terminar.'},
      {l:'Marcas de tiempo (timestamps)', r:'Cada transacción recibe una marca de reloj de Lamport; una operación "vieja" se rechaza y se reintenta.'},
      {l:'Optimista (OCC)', r:'Cada nodo trabaja sobre su copia local y valida justo antes del commit si alguien más modificó ese dato.'},
      {l:'CLM (gestor central de bloqueos)', r:'Un solo servidor decide los candados; si falla, todo el sistema se detiene.'},
      {l:'DLM (gestor distribuido de bloqueos)', r:'Cada nodo guarda una parte de los candados, coordinados por consenso (Raft); si un nodo cae, el resto sigue.'}
    ],
    explain:'Pesimista, por marcas de tiempo y optimista son las tres estrategias para ordenar transacciones que compiten por el mismo dato; CLM y DLM son las dos formas de administrar quién tiene cada candado.'},
  {id:'q40', topic:'consistencia', type:'vf',
    prompt:'El principio PACELC dice que, incluso sin ninguna partición de red, un sistema distribuido debe elegir entre Latencia y Consistencia.',
    answer:true,
    explain:'Esa es la parte "ELC" (Else, operación normal -> elige entre L y C); la parte "PAC" aplica solo cuando sí hay partición (elige entre A y C).'},
  {id:'q41', topic:'consistencia', type:'fill',
    prompt:'En la Confirmación en 2 Fases (2PC), la fase en la que el coordinador pregunta a los participantes si pueden comprometerse, antes de decidir, se llama fase de ___.',
    answers:['prepare'],
    explain:'FASE 1 - PREPARE: ¿pueden comprometerse? FASE 2 - DECISIÓN: si todos votaron "Yes", Commit; basta un solo "No" para Abort en todos.'},
  {id:'q42', topic:'consistencia', type:'vf',
    prompt:'Si el coordinador de un 2PC se cae justo después de recibir todos los votos, los participantes que votaron "Yes" pueden abortar la transacción por su cuenta sin ningún riesgo.',
    answer:false,
    explain:'No pueden: ya prometieron confirmar y tienen los datos bloqueados; no saben qué votó el otro participante ni qué decidió el coordinador antes de caer, así que quedan en un estado de incertidumbre (el sistema deja de responder: es CP en estado puro).'},
  {id:'q43', topic:'consistencia', type:'fill',
    prompt:'El algoritmo que detecta interbloqueos (deadlocks) sin un servidor central, enviando una pequeña "sonda" que viaja de un nodo al siguiente hasta regresar a quien la lanzó, se llama ___.',
    answers:['chandy-misra-haas','chandy misra haas'],
    explain:'Si la sonda regresa a quien la lanzó, el ciclo de espera existe: se aborta una sola transacción (la víctima) y las demás avanzan de inmediato.'},
  {id:'q44', topic:'consistencia', type:'open',
    prompt:'Explica por qué un sistema con Consistencia Fuerte (linearizabilidad) suele tener más latencia que uno con Consistencia Eventual, y da un caso de uso típico para cada uno.',
    model:'La Consistencia Fuerte usa coordinación síncrona: toda lectura debe devolver la escritura más reciente en todo el clúster, lo que requiere bloqueos y consenso antes de confirmar cada operación, y eso cuesta tiempo (viajes de red de ida y vuelta). La Consistencia Eventual usa replicación asíncrona: los nodos responden de inmediato con su copia local y, si no hay nuevas escrituras, van convergiendo con el tiempo, sin bloqueos inmediatos. Caso típico de consistencia fuerte: sistemas transaccionales como banca o mercados de valores. Caso típico de consistencia eventual: redes sociales (contadores de "me gusta"), carritos de compra o microblogging.'},
  {id:'q45', topic:'consistencia', type:'fill',
    prompt:'PostgreSQL, VoltDB, HBase y Bigtable pertenecen al cuadrante de PACELC que prioriza la Consistencia siempre, conocido como ___.',
    answers:['pc/ec','pc ec'],
    explain:'El cuadrante opuesto, PA/EL, prioriza Disponibilidad y Latencia, e incluye motores como Cassandra, DynamoDB y Cosmos DB (por defecto).'}
];
