/**
 * MODELO FORMAL DE GESTIÓN DEL CONOCIMIENTO - CUN
 * Corporación Unificada Nacional de Educación Superior (CUN)
 * Dirección Nacional de Investigación
 * 
 * Propuesto por el Equipo de Investigación de Gestión del Conocimiento:
 * - Marvin Luis Jiménez Narváez (Investigador Principal)
 * - Laura Esperanza Gélvez García (Investigadora Principal)
 * - María Edelmira Lesmes Gómez (Investigadora Principal)
 * - Luz Marina Escamilla Fonseca (Investigadora Principal)
 * - Wilson Bonilla Pabón (Investigador Principal)
 * 
 * Normas de Referencia: ISO 30401:2018 (SGC) & ISO 9001:2015 (SGC-Calidad)
 */

window.CUN_GC_MODEL = {
  institution: "Corporación Unificada Nacional CUN",
  institutionFull: "Corporación Unificada Nacional de Educación Superior - CUN",
  direction: "Dirección Nacional de Investigación",
  modelTitle: "Modelo Institucional de Gestión del Conocimiento",
  version: "Edición 2026 - Conforme a ISO 30401 / ISO 9001",

  // =========================================================================
  // EQUIPO DE INVESTIGACIÓN INSTITUCIONAL (CRÉDITOS PERMANENTES)
  // =========================================================================
  equipoInvestigacion: {
    nombre: "Equipo de Investigación de Gestión del Conocimiento",
    descripcion: "Modelo de gestión propuesto y desarrollado por los Investigadores Principales de la Dirección Nacional de Investigación · CUN:",
    integrantes: [
      {
        nombre: "PhD. (c) Marvin Luis Jiménez Narváez",
        cargo: "Docente investigador"
      },
      {
        nombre: "PhD. Laura Esperanza Gélvez García",
        cargo: "Docente investigadora"
      },
      {
        nombre: "Mg. María Edelmira Lesmes Gómez",
        cargo: "Docente investigadora"
      },
      {
        nombre: "Mg. Luz Marina Escamilla Fonseca",
        cargo: "Docente investigadora"
      },
      {
        nombre: "PhD. Wilson Bonilla Pabón",
        cargo: "Docente investigador"
      }
    ]
  },

  // =========================================================================
  // LAS CUATRO ETAPAS PRINCIPALES DEL MODELO CON SUS FLUJOS INTERNOS
  // =========================================================================
  stages: [
    {
      id: "diagnostico",
      number: 1,
      name: "Diagnóstico",
      tag: "GAP & Necesidades",
      tagClass: "tag-gap",
      shortDesc: "La CUN compara lo que sabe con lo que necesita saber para anticipar los desafíos de su entorno.",
      fullDesc: "Identifica brechas de conocimiento (GAP) entre el saber disponible y los retos institucionales. Se alimenta de las demandas del entorno (Estado, Sociedad, Empresas) y de los reportes operativos.",
      flujoInterno: [
        {
          id: "sub-1-1",
          nombre: "Identificación de Brechas de Conocimiento (GAP)",
          desc: "Cálculo de la discrepancia entre las capacidades actuales y las requeridas para metas de docencia, investigación y gestión.",
          nodoBadge: "GAP"
        },
        {
          id: "sub-1-2",
          nombre: "Mapeo de Conocimiento Disponible",
          desc: "Inventario del acervo de saberes y competencias ya existentes en la institución y en sus colaboradores.",
          nodoBadge: "INVENTARIO"
        },
        {
          id: "sub-1-3",
          nombre: "Desafíos de la Organización (Necesidades y Demandas)",
          desc: "Priorización de retos estratégicos planteados por la alta dirección y los planes de desarrollo CUN.",
          nodoBadge: "RETOS"
        },
        {
          id: "sub-1-4",
          nombre: "Análisis de Indicadores de Desempeño",
          desc: "Evaluación cuantitativa y cualitativa de métricas académicas y administrativas para confirmar la brecha.",
          nodoBadge: "KPIS"
        },
        {
          id: "sub-1-5",
          nombre: "Retroalimentación de Stakeholders",
          desc: "Recepción de exigencias del Ministerio de Educación, empleadores, graduados y estudiantes.",
          nodoBadge: "STAKEHOLDERS"
        },
        {
          id: "sub-1-6",
          nombre: "Formulación del Reclamo de Conocimiento (KC)",
          desc: "La brecha detectada se formaliza como una propuesta o hipótesis de solución denominada Knowledge Claim (KC).",
          nodoBadge: "KC"
        }
      ],
      entra: [
        "Conocimiento disponible en la institución",
        "Desafíos estratégicos y operativos",
        "Indicadores de desempeño institucional",
        "Retroalimentación de Stakeholders (Estado, Sociedad, Empresas)",
        "Feedback de problemas y retroalimentación experiencial desde la DOKB"
      ],
      sale: "Reclamo de Conocimiento (KC): La brecha convertida en una propuesta formal estructurada.",
      evaluacion: "¿La brecha es real, prioritaria y alineada con la misión de la CUN?",
      kpis: [
        { name: "% de brechas detectadas (GAP)", meta: "> 85%", freq: "Trimestral" },
        { name: "Tiempo de conversión de brecha a reclamo", meta: "< 15 días", freq: "Mensual" }
      ],
      color: "var(--cun-cyan)"
    },
    {
      id: "produccion",
      number: 2,
      name: "Producción",
      tag: "Redes & Aprendizaje",
      tagClass: "tag-prod",
      shortDesc: "Las ideas se discuten en equipo, se escriben, se someten a prueba y se formalizan como CKC.",
      fullDesc: "Fase de creación dialógica. Integra el modelo SECI de Nonaka (socialización y exteriorización) y la Taxonomía de Bloom. Los colaboradores transforman el saber tácito en documentos y herramientas explícitas.",
      flujoInterno: [
        {
          id: "sub-2-1",
          nombre: "Aprendizaje Individual y Grupal (Redes de Conocimiento)",
          desc: "Socialización entre docentes e investigadores dentro de comunidades de práctica y mesas de trabajo interdisciplinarias.",
          nodoBadge: "REDES"
        },
        {
          id: "sub-2-2",
          nombre: "Adquisición e Investigación de Información",
          desc: "Búsqueda en bases de datos científicas, referentes internacionales y benchmarking universitario.",
          nodoBadge: "VIGILANCIA"
        },
        {
          id: "sub-2-3",
          nombre: "Formulación de Reclamos del Conocimiento",
          desc: "Estructuración de la solución aplicando niveles cognitivos de Bloom (analizar, evaluar, crear).",
          nodoBadge: "BLOOM"
        },
        {
          id: "sub-2-4",
          nombre: "Codificación del Reclamo (CKC)",
          desc: "El conocimiento tácito se convierte en explícito: redacción de manuales, artículos, prototipos o rúbricas.",
          nodoBadge: "CKC"
        },
        {
          id: "sub-2-5",
          nombre: "Evaluación Interna de Reclamos en la Red",
          desc: "Revisión dialógica por pares de la propia red antes de someterlo formalmente al comité institucional.",
          nodoBadge: "PRE-EVAL"
        }
      ],
      entra: [
        "Reclamo de Conocimiento inicial (KC)",
        "Experiencia y saberes tácitos de colaboradores",
        "Evidencias científicas y tecnológicas externas"
      ],
      sale: "Reclamo de Conocimiento Codificado (CKC): Propuesta documentada lista para evaluación institucional.",
      evaluacion: "¿El reclamo resiste la prueba de su dominio temático y aporta valor tangible?",
      kpis: [
        { name: "N° de reclamos codificados generados (CKC)", meta: "> 40 / periodo", freq: "Mensual" },
        { name: "Índice de co-creación en redes de aprendizaje", meta: "> 75%", freq: "Semestral" }
      ],
      color: "var(--cun-blue)"
    },
    {
      id: "filtracion",
      number: 3,
      name: "Filtración",
      tag: "Evaluación Crítica (McElroy)",
      tagClass: "tag-filt",
      shortDesc: "Comité de expertos evalúa cada reclamo: toma uno de tres caminos dejando registro de toda su evidencia.",
      fullDesc: "Inspirado en McElroy (2003). Separa el conocimiento robusto del inviable o erróneo mediante evaluación formal (KCE). Ninguna idea se descarta sin dejar trazabilidad: las falsadas se resguardan como memoria institucional.",
      flujoInterno: [
        {
          id: "sub-3-1",
          nombre: "Recepción y Registro en Cola de Evaluación",
          desc: "Ingreso del CKC a la plataforma de evaluación con asignación de pares evaluadores según especialidad.",
          nodoBadge: "KCE"
        },
        {
          id: "sub-3-2",
          nombre: "Camino 1: SKC · Supervivencia & Validación",
          desc: "El reclamo supera las pruebas metodológicas, técnicas y éticas. Se valida formalmente como superviviente.",
          nodoBadge: "SKC (OK)"
        },
        {
          id: "sub-3-3",
          nombre: "Camino 2: UKC · Indeciso & Depuración con Plazo",
          desc: "Muestra potencial pero requiere ajustes o datos adicionales. Se devuelve a la red con un plazo perentorio.",
          nodoBadge: "UKC (PLAZO)"
        },
        {
          id: "sub-3-4",
          nombre: "Camino 3: FKC · Falsado & Almacenamiento de Evidencia",
          desc: "Se demuestra inviable técnica o financieramente. NO se borra: se almacena con el informe que lo refutó.",
          nodoBadge: "FKC (LECCIÓN)"
        },
        {
          id: "sub-3-5",
          nombre: "Consolidación de Veredicto (OK)",
          desc: "Los reclamos validados (SKC y UKC aprobados tras depuración) pasan al paquete de conocimiento consolidado.",
          nodoBadge: "VEREDICTO"
        }
      ],
      caminos: [
        {
          code: "SKC",
          title: "Reclamo Superviviente (Surviving Knowledge Claim)",
          status: "Aprobado / Prometedor",
          action: "Supera con éxito las pruebas de validación y avanza hacia Integración en la DOKB.",
          badgeClass: "badge-skc",
          color: "var(--color-skc)"
        },
        {
          code: "UKC",
          title: "Reclamo Indeciso (Undecided Knowledge Claim)",
          status: "En Observación con Plazo",
          action: "Se detecta viabilidad parcial pero faltan datos o rúbricas. Se remite a depuración con fecha límite.",
          badgeClass: "badge-ukc",
          color: "var(--color-ukc)"
        },
        {
          code: "FKC",
          title: "Reclamo Falsado (Falsified Knowledge Claim)",
          status: "Refutado / Lección Aprendida",
          action: "Evaluado negativamente por inviabilidad. Se archiva con la evidencia que lo refutó para evitar repetir errores.",
          badgeClass: "badge-fkc",
          color: "var(--color-fkc)"
        }
      ],
      entra: [
        "Reclamo de Conocimiento Codificado (CKC)",
        "Criterios de calidad e impacto institucional",
        "Marco regulatorio ISO 9001 / ISO 30401"
      ],
      sale: "Veredicto Vinculante: SKC (hacia Integración), UKC (a depuración) o FKC (lección archivada).",
      evaluacion: "¿Sobrevive a las pruebas del comité, queda indeciso o se demuestra su falsación?",
      kpis: [
        { name: "Tasa de supervivencia (SKC / Total)", meta: "60% - 70%", freq: "Mensual" },
        { name: "Tiempo promedio hasta veredicto", meta: "< 20 días", freq: "Mensual" },
        { name: "Cola de evaluación de reclamos pendientes", meta: "< 15 casos", freq: "Mensual" }
      ],
      color: "var(--color-ukc)"
    },
    {
      id: "integracion",
      number: 4,
      name: "Integración",
      tag: "DOKB & Diseminación",
      tagClass: "tag-integ",
      shortDesc: "Lo validado se organiza, almacena, transfiere y divulga para que esté disponible donde se necesite.",
      fullDesc: "Los reclamos supervivientes (SKC) se consolidan como Conocimiento Organizacional Codificado (COK) y se integran en la DOKB. El conocimiento se institucionaliza y se pone en circulación continua.",
      flujoInterno: [
        {
          id: "sub-4-1",
          nombre: "Organizar (Catalogación & Taxonomía)",
          desc: "Asignación de metadatos, palabras clave, descriptores temáticos y niveles de confidencialidad.",
          nodoBadge: "ORGANIZAR"
        },
        {
          id: "sub-4-2",
          nombre: "Almacenar (Resguardo en Repositorios Centralizados)",
          desc: "Almacenamiento digital seguro en bases de datos protegidas y respaldadas contra pérdida de información.",
          nodoBadge: "ALMACENAR"
        },
        {
          id: "sub-4-3",
          nombre: "Transferencia (Capacitación & Mentoría)",
          desc: "Programas de formación, inducción, traspaso de mando y talleres prácticos de aplicación.",
          nodoBadge: "TRANSFERIR"
        },
        {
          id: "sub-4-4",
          nombre: "Divulgación (Comunidades, Canales & Branding)",
          desc: "Estrategias de comunicación transmedia, tableros de control y endomarketing del conocimiento.",
          nodoBadge: "DIVULGAR"
        },
        {
          id: "sub-4-5",
          nombre: "Asentamiento en DOKB",
          desc: "Integración formal en la Base de Conocimiento Organizacional Distribuida y activación de la retroalimentación.",
          nodoBadge: "DOKB"
        }
      ],
      entra: [
        "Reclamos de Conocimiento Supervivientes (SKC) validados",
        "Expedientes de lecciones aprendidas (FKC) para memoria",
        "Normas técnicas y procedimientos estándar de la CUN"
      ],
      sale: "Conocimiento Organizacional Codificado (COK) activo en la DOKB y apropiado por la comunidad.",
      evaluacion: "¿El conocimiento se aplica efectivamente y mantiene vigencia operativa?",
      kpis: [
        { name: "Reutilización del COK en procesos institucionales", meta: "> 80%", freq: "Mensual" },
        { name: "Consultas y descargas activas en DOKB", meta: "+25% anual", freq: "Mensual" },
        { name: "Índice de obsolescencia del conocimiento", meta: "< 8%", freq: "Semestral" }
      ],
      color: "var(--cun-gold)"
    }
  ],

  // =========================================================================
  // DOKB (BASE DE CONOCIMIENTO DISTRIBUIDA)
  // =========================================================================
  dokb: {
    name: "DOKB (Distributed Organizational Knowledge Base)",
    definition: "Repositorio institucional dinámico y accesible que salvaguarda el conocimiento explícito y tácito codificado, eliminando la vulnerabilidad institucional cuando un docente o directivo experto se retira de la CUN.",
    contenedores: [
      {
        tipo: "Manuales de Operación Técnica y Pedagógica",
        funcion: "Estandarizar procedimientos técnicos, diseños instruccionales y metodologías formativas.",
        impacto: "Asegura continuidad del servicio académico y reduce en 80% errores operativos."
      },
      {
        tipo: "Bases de Datos Centralizadas & Repositorios Digitales",
        funcion: "Organizar y democratizar el acceso a información de investigación, clientes y métricas.",
        impacto: "Toma de decisiones directivas ágiles sustentadas en evidencia objetiva."
      },
      {
        tipo: "Protocolos de Seguridad y Salud Ocupacional (SST)",
        funcion: "Normativas preventivas obligatorias que garantizan el bienestar de colaboradores.",
        impacto: "Fortalecimiento de la cultura de prevención y cumplimiento legal ante el MEN y MinTrabajo."
      },
      {
        tipo: "Procedimientos Estandarizados de Proyectos (I+D+i)",
        funcion: "Unificar formulación, ejecución ágil y evaluación de iniciativas de investigación.",
        impacto: "Mayor trazabilidad, control presupuestal y replicabilidad de proyectos exitosos."
      },
      {
        tipo: "Políticas Institucionales y Código Ético",
        funcion: "Definir principios axiológicos, valores y directrices de gobernanza universitaria.",
        impacto: "Alineación estratégica de todas las sedes nacionales y coherencia de marca CUN."
      },
      {
        tipo: "Módulo de Lecciones Aprendidas (Reclamos FKC Falsados)",
        funcion: "Conservar informes y evidencias técnicas de hipótesis que no prosperaron.",
        impacto: "Evita que futuros equipos inviertan tiempo y presupuesto en errores ya documentados."
      }
    ]
  },

  // =========================================================================
  // EJES TRANSVERSALES & ENTORNO SISTÉMICO
  // =========================================================================
  ejesTransversales: {
    comunicacion: {
      nombre: "Comunicación Organizacional (Eje Transversal)",
      proposito: "Actúa como engranaje transversal que conecta los procesos de gestión del conocimiento con la cultura universitaria, dinamizando la co-creación y el flujo sin barreras.",
      pilares: [
        { titulo: "Cultura y Liderazgo Transformacional", desc: "Líderes de área que actúan como articuladores y promotores de la confianza colectiva." },
        { titulo: "Endomarketing y Branding del Conocimiento", desc: "Posicionar la producción intelectual de los colaboradores como el principal patrimonio institucional." },
        { titulo: "Ecosistema TIC, IA y Automatización", desc: "Plataformas digitales colaborativas, minería de datos y bots de soporte al aprendizaje." },
        { titulo: "Redes Colaborativas y Diálogo de Saberes", desc: "Comunidades de práctica interdisciplinarias orientadas a la innovación social." }
      ]
    },
    evaluacion: {
      nombre: "Evaluación Constante & Estándar ISO 30401",
      proposito: "La evaluación no es un suceso final: es un principio continuo que revisa cada fase con evidencias antes de avanzar, previniendo retrocesos costosos.",
      niveles: [
        { nivel: "Estratégico", kpi: "Madurez frente a ISO 30401", meta: "Nivel 4 (Optimizado)", freq: "Semestral" },
        { nivel: "Estratégico", kpi: "Conocimiento crítico en riesgo de pérdida", meta: "< 5%", freq: "Trimestral" },
        { nivel: "Táctico", kpi: "Tasa de supervivencia y falsación", meta: "70% SKC / 30% FKC", freq: "Mensual" },
        { nivel: "Táctico", kpi: "Cola de evaluación (cuellos de botella)", meta: "< 10 reclamos", freq: "Mensual" },
        { nivel: "Táctico", kpi: "Índice de capital social y colaboración", meta: "> 85/100", freq: "Semestral" },
        { nivel: "Operativo", kpi: "Reutilización efectiva de COK", meta: "> 75%", freq: "Mensual" },
        { nivel: "Operativo", kpi: "Obsolescencia del conocimiento en DOKB", meta: "< 8%", freq: "Mensual" }
      ]
    }
  },

  // =========================================================================
  // CASOS DE SIMULACIÓN EN VIVO (CON RECORRIDO MICRO-DETALLADO)
  // Cada paso indica: subproceso, duración simulada, decisión, mutación visual
  // =========================================================================
  casosSimulacion: [
    {
      id: "caso-ia-tutoria",
      titulo: "Caso A: Asistentes IA en Aulas Virtuales de Pregrado",
      area: "Vicerrectoría Académica & TI CUN",
      descripcionBreve: "Desarrollo de agentes inteligentes pedagógicos para resolver dudas 24/7 y optimizar la dedicación tutorial docente.",
      caminoPrevisto: "SKC",
      veredictoFinal: "Superviviente Validado ➔ Incorporado en la DOKB como Estándar Institucional CUN",
      pasos: [
        {
          etapa: "diagnostico",
          subnodoId: "sub-1-1",
          subproceso: "1. Diagnóstico ➔ Detección de Brecha de Conocimiento (GAP)",
          duracionDias: 4,
          acumuladoDias: 4,
          actores: "Docentes virtuales y estudiantes",
          decision: "Se constata lentitud en atención a foros virtuales en fines de semana. Se cataloga como brecha prioritaria.",
          particula: {
            forma: "chispa-diamante",
            color: "#f59e0b",
            etiqueta: "GAP",
            descripcionVisual: "Chispa ámbar parpadeante: representa una necesidad no resuelta en el entorno CUN."
          },
          coords: { x: 90, y: 134 }
        },
        {
          etapa: "diagnostico",
          subnodoId: "sub-1-4",
          subproceso: "1. Diagnóstico ➔ Análisis de Indicadores & Stakeholders",
          duracionDias: 3,
          acumuladoDias: 7,
          actores: "Dirección de Calidad Académica",
          decision: "Los datos de retención confirman impacto crítico. Se contrasta con retroalimentación de actores clave.",
          particula: {
            forma: "chispa-diamante",
            color: "#38bdf8",
            etiqueta: "GAP-IND",
            descripcionVisual: "Tránsito por el eje de análisis de indicadores y retroalimentación bidireccional."
          },
          coords: { x: 220, y: 159 }
        },
        {
          etapa: "diagnostico",
          subnodoId: "sub-1-6",
          subproceso: "1. Diagnóstico ➔ Formulación del Reclamo KC",
          duracionDias: 2,
          acumuladoDias: 9,
          actores: "Mesa Técnica de Innovación CUN",
          decision: "Se consolida el Reclamo de Conocimiento KC-2026-01 y se remite a la etapa de Producción.",
          particula: {
            forma: "chispa-diamante",
            color: "#38bdf8",
            etiqueta: "KC",
            descripcionVisual: "Chispa azul cian luminosa: la brecha se convirtió en un Reclamo de Conocimiento (KC)."
          },
          coords: { x: 220, y: 305 }
        },
        {
          etapa: "produccion",
          subnodoId: "sub-2-1",
          subproceso: "2. Producción ➔ Aprendizaje en Redes & Trabajo Colaborativo",
          duracionDias: 6,
          acumuladoDias: 15,
          actores: "Red Docente de Ingeniería y Humanidades CUN",
          decision: "Mesas de co-creación para estructurar el modelo de interacción y límites pedagógicos del asistente.",
          particula: {
            forma: "chispa-diamante",
            color: "#38bdf8",
            etiqueta: "KC",
            descripcionVisual: "Tránsito por redes de aprendizaje individual y grupal."
          },
          coords: { x: 361, y: 133 }
        },
        {
          etapa: "produccion",
          subnodoId: "sub-2-3",
          subproceso: "2. Producción ➔ Formulación de Reclamo (Nivel Bloom)",
          duracionDias: 4,
          acumuladoDias: 19,
          actores: "Docentes Diseñadores Instruccionales",
          decision: "Estructuración de competencias cognitivas y diseño de prompts pedagógicos contextualizados.",
          particula: {
            forma: "chispa-diamante",
            color: "#38bdf8",
            etiqueta: "KC-FORM",
            descripcionVisual: "Formulación sistemática del reclamo para codificación."
          },
          coords: { x: 361, y: 204 }
        },
        {
          etapa: "produccion",
          subnodoId: "sub-2-4",
          subproceso: "2. Producción ➔ Codificación Documental (CKC)",
          duracionDias: 4,
          acumuladoDias: 23,
          actores: "Equipo Técnico de Innovación Educativa",
          decision: "Se redacta el manual operativo, rúbricas pedagógicas y arquitectura de software. Nace el CKC-01.",
          particula: {
            forma: "hexagono-tecnico",
            color: "#06b6d4",
            etiqueta: "CKC",
            descripcionVisual: "MUTACIÓN: La partícula muta en un hexágono cian estructurado (Conocimiento Codificado)."
          },
          coords: { x: 463, y: 204 }
        },
        {
          etapa: "produccion",
          subnodoId: "sub-2-5",
          subproceso: "2. Producción ➔ Evaluación Interna en la Red de Conocimiento",
          duracionDias: 3,
          acumuladoDias: 26,
          actores: "Pares de la Comunidad de Práctica",
          decision: "Validación dialógica interna. Veredicto colegiado favorable para someter a Comité McElroy.",
          particula: {
            forma: "hexagono-tecnico",
            color: "#0284c7",
            etiqueta: "CKC",
            descripcionVisual: "Hexágono cian superando la pre-evaluación interna hacia Filtración."
          },
          coords: { x: 529, y: 204 }
        },
        {
          etapa: "filtracion",
          subnodoId: "sub-3-skc-info",
          subproceso: "3. Filtración ➔ Entrada al Riel SKC de Evaluación (KCE)",
          duracionDias: 8,
          acumuladoDias: 34,
          actores: "Comité de Evaluación de Investigaciones & Pares Externos",
          decision: "El CKC ingresa a la compuerta de evaluación: se auditan privacidad de datos y viabilidad pedagógica.",
          particula: {
            forma: "hexagono-tecnico",
            color: "#818cf8",
            etiqueta: "KCE",
            descripcionVisual: "Reposo en la compuerta del riel superior de filtración mientras el comité delibera."
          },
          coords: { x: 615, y: 126 }
        },
        {
          etapa: "filtracion",
          subnodoId: "sub-3-2",
          subproceso: "3. Filtración ➔ Validación como Superviviente (SKC)",
          duracionDias: 4,
          acumuladoDias: 38,
          actores: "Presidencia del Comité de Evaluación",
          decision: "Dictamen Favorable Unánime: Reclamo Superviviente (SKC). Superó todas las objeciones y avanza a validación formal.",
          particula: {
            forma: "escudo-esmeralda",
            color: "#10b981",
            etiqueta: "SKC",
            descripcionVisual: "MUTACIÓN: Muta en un sello verde esmeralda resplandeciente (Superviviente certificado)."
          },
          coords: { x: 695, y: 126 }
        },
        {
          etapa: "filtracion",
          subnodoId: "sub-3-val",
          subproceso: "3. Filtración ➔ Rúbrica de Validación Institucional",
          duracionDias: 1,
          acumuladoDias: 39,
          actores: "Secretaría Técnica del Comité",
          decision: "Sello de cumplimiento normativo y metodológico. Se autoriza su paso hacia consolidación.",
          particula: {
            forma: "escudo-esmeralda",
            color: "#10b981",
            etiqueta: "SKC-VAL",
            descripcionVisual: "Sello esmeralda validado transitando hacia el nodo OK."
          },
          coords: { x: 780, y: 126 }
        },
        {
          etapa: "filtracion",
          subnodoId: "sub-3-5",
          subproceso: "3. Filtración ➔ Consolidación de Veredicto (OK)",
          duracionDias: 1,
          acumuladoDias: 40,
          actores: "Dirección Nacional de Calidad",
          decision: "El veredicto se consolida como OK institucional para ingresar de inmediato al bus de Integración.",
          particula: {
            forma: "escudo-esmeralda",
            color: "#10b981",
            etiqueta: "OK",
            descripcionVisual: "Sello OK institucional listo para integrarse a la memoria colectiva."
          },
          coords: { x: 843, y: 166 }
        },
        {
          etapa: "integracion",
          subnodoId: "sub-4-1",
          subproceso: "4. Integración ➔ 1. Organizar (Catalogación & Taxonomía)",
          duracionDias: 3,
          acumuladoDias: 43,
          actores: "Gestores Documentales de la DOKB",
          decision: "Catalogación con metadatos normalizados CUN, indexación temática y vinculación con asignaturas afines.",
          particula: {
            forma: "cubo-dorado",
            color: "#f59e0b",
            etiqueta: "COK",
            descripcionVisual: "MUTACIÓN: Muta en un cubo dorado de Conocimiento Organizacional Codificado (COK)."
          },
          coords: { x: 996, y: 128 }
        },
        {
          etapa: "integracion",
          subnodoId: "sub-4-2",
          subproceso: "4. Integración ➔ 2. Almacenar en Bases Centralizadas",
          duracionDias: 2,
          acumuladoDias: 45,
          actores: "Administradores de Infraestructura TI",
          decision: "Alojamiento con alta disponibilidad, control de versiones y permisos de acceso para las sedes de la CUN.",
          particula: {
            forma: "cubo-dorado",
            color: "#f59e0b",
            etiqueta: "COK",
            descripcionVisual: "Cubo dorado resguardado en la infraestructura central."
          },
          coords: { x: 996, y: 174 }
        },
        {
          etapa: "integracion",
          subnodoId: "sub-4-3",
          subproceso: "4. Integración ➔ 3. Transferencia (Mentorías & Talleres)",
          duracionDias: 10,
          acumuladoDias: 55,
          actores: "Líderes de Redes & 450 Docentes Capacitados",
          decision: "Talleres sincrónicos, cápsulas de microlearning y mentorías directas para asegurar la apropiación práctica.",
          particula: {
            forma: "cubo-dorado",
            color: "#fbbf24",
            etiqueta: "COK",
            descripcionVisual: "Cubo dorado emitiendo pulsos de transferencia formativa hacia los docentes."
          },
          coords: { x: 996, y: 220 }
        },
        {
          etapa: "integracion",
          subnodoId: "sub-4-4",
          subproceso: "4. Integración ➔ 4. Divulgación & Endomarketing",
          duracionDias: 4,
          acumuladoDias: 59,
          actores: "Comunicaciones & Branding Institucional",
          decision: "Campaña de difusión interna para incentivar a docentes y estudiantes al uso del asistente.",
          particula: {
            forma: "cubo-dorado",
            color: "#f59e0b",
            etiqueta: "COK",
            descripcionVisual: "Diseminación a través de canales institucionales y bus colector hacia DOKB."
          },
          coords: { x: 996, y: 266 }
        },
        {
          etapa: "integracion",
          subnodoId: "svg-dokb-node",
          subproceso: "4. Integración ➔ Asentamiento Permanente en DOKB",
          duracionDias: 2,
          acumuladoDias: 61,
          actores: "Comité de Gestión del Conocimiento",
          decision: "El COK-IA-01 queda formalmente depositado en el contenedor de Manuales y Tecnologías de la DOKB.",
          particula: {
            forma: "boveda-dorada",
            color: "#f59e0b",
            etiqueta: "DOKB",
            descripcionVisual: "MUTACIÓN FINAL: La partícula se asienta en la DOKB y genera ondas expansivas doradas en el repositorio institucional."
          },
          coords: { x: 1007, y: 417 }
        },
        {
          etapa: "retroalimentacion",
          subnodoId: "retro-experiencial",
          subproceso: "Retroalimentación Sistémica ➔ Flujo Experiencial hacia Diagnóstico",
          duracionDias: 0,
          acumuladoDias: 61,
          actores: "Ecosistema Institucional CUN",
          decision: "¡CICLO CERRADO! El conocimiento acumulado en la DOKB nutre continuamente el Diagnóstico, reduciendo tiempos de respuesta y abriendo nuevas líneas de innovación.",
          particula: {
            forma: "pulso-retorno",
            color: "#fbbf24",
            etiqueta: "RETRO",
            descripcionVisual: "Flujo activo continuo de experiencia retornando desde la DOKB hasta el Diagnóstico por el ducto inferior."
          },
          coords: { x: 85, y: 345 }
        }
      ]
    },
    {
      id: "caso-practicas-flexibles",
      titulo: "Caso B: Homologación de Experiencia Laboral como Práctica Empresarial",
      area: "Dirección de Egresados & Empleabilidad CUN",
      descripcionBreve: "Mecanismo para que estudiantes con contrato laboral formal certifiquen competencias sin cursar la práctica tradicional.",
      caminoPrevisto: "UKC",
      veredictoFinal: "Reclamo Indeciso (UKC) ➔ Requiere Depuración Metodológica con Plazo de 30 Días",
      pasos: [
        {
          etapa: "diagnostico",
          subnodoId: "sub-1-1",
          subproceso: "1. Diagnóstico ➔ Detección de Brecha (GAP)",
          duracionDias: 5,
          acumuladoDias: 5,
          actores: "Estudiantes trabajadores y Coordinadores de Prácticas",
          decision: "Se detecta riesgo de deserción por incompatibilidad de horarios laborales con las prácticas presenciales.",
          particula: {
            forma: "chispa-diamante",
            color: "#f59e0b",
            etiqueta: "GAP",
            descripcionVisual: "Chispa ámbar inicial de brecha detectada."
          },
          coords: { x: 90, y: 134 }
        },
        {
          etapa: "diagnostico",
          subnodoId: "sub-1-5",
          subproceso: "1. Diagnóstico ➔ Retroalimentación de Stakeholders",
          duracionDias: 3,
          acumuladoDias: 8,
          actores: "Empresas aliadas y Dirección de Prácticas",
          decision: "Empresas apoyan validar funciones laborales. Se contrasta con necesidades de acreditación institucional.",
          particula: {
            forma: "chispa-diamante",
            color: "#38bdf8",
            etiqueta: "STAKE",
            descripcionVisual: "Consulta con stakeholders del sector productivo."
          },
          coords: { x: 220, y: 239 }
        },
        {
          etapa: "diagnostico",
          subnodoId: "sub-1-6",
          subproceso: "1. Diagnóstico ➔ Formulación del Reclamo KC",
          duracionDias: 2,
          acumuladoDias: 10,
          actores: "Coordinación de Empleabilidad",
          decision: "Se formula formalmente el Reclamo KC-2026-02 hacia la etapa de Producción.",
          particula: {
            forma: "chispa-diamante",
            color: "#38bdf8",
            etiqueta: "KC",
            descripcionVisual: "Chispa azul cian: Reclamo de conocimiento formulado."
          },
          coords: { x: 220, y: 305 }
        },
        {
          etapa: "produccion",
          subnodoId: "sub-2-3",
          subproceso: "2. Producción ➔ Formulación de Reclamo & Tabla de Equivalencias",
          duracionDias: 9,
          acumuladoDias: 19,
          actores: "Comité de Prácticas y Líderes de Programa",
          decision: "Estructuración de tabla de equivalencias entre perfiles de cargo corporativos y resultados curriculares.",
          particula: {
            forma: "chispa-diamante",
            color: "#38bdf8",
            etiqueta: "KC",
            descripcionVisual: "Tránsito por discusión y formulación pedagógica."
          },
          coords: { x: 361, y: 204 }
        },
        {
          etapa: "produccion",
          subnodoId: "sub-2-4",
          subproceso: "2. Producción ➔ Codificación Documental (CKC)",
          duracionDias: 5,
          acumuladoDias: 24,
          actores: "Coordinación de Empleabilidad",
          decision: "Se formaliza el documento preliminar de equivalencias y procedimiento de validación (CKC-02).",
          particula: {
            forma: "hexagono-tecnico",
            color: "#06b6d4",
            etiqueta: "CKC",
            descripcionVisual: "MUTACIÓN: La partícula muta en un hexágono cian estructurado."
          },
          coords: { x: 463, y: 204 }
        },
        {
          etapa: "filtracion",
          subnodoId: "sub-3-ukc-info",
          subproceso: "3. Filtración ➔ Entrada al Riel UKC de Evaluación",
          duracionDias: 10,
          acumuladoDias: 34,
          actores: "Comité Institucional de Currículo y Calidad",
          decision: "El Comité delibera: existe riesgo de laxitud si la empresa aliada no certifica bajo gravedad de juramento las funciones.",
          particula: {
            forma: "hexagono-tecnico",
            color: "#818cf8",
            etiqueta: "KCE",
            descripcionVisual: "Ingreso al riel intermedio de filtración para reclamos en deliberación."
          },
          coords: { x: 615, y: 191 }
        },
        {
          etapa: "filtracion",
          subnodoId: "sub-3-3",
          subproceso: "3. Filtración ➔ Dictamen Indeciso (UKC) con Plazo",
          duracionDias: 3,
          acumuladoDias: 37,
          actores: "Comité de Gestión del Conocimiento",
          decision: "Dictamen: UKC (Indeciso). Se otorga plazo de 30 días para incorporar rúbricas de verificación in situ con empleadores y auditorías aleatorias.",
          particula: {
            forma: "rombo-purpura",
            color: "#c084fc",
            etiqueta: "UKC",
            descripcionVisual: "MUTACIÓN: Muta en un rombo púrpura pulsante de alerta (Reclamo Indeciso en observación con plazo perentorio)."
          },
          coords: { x: 695, y: 191 }
        },
        {
          etapa: "filtracion",
          subnodoId: "sub-3-depuracion",
          subproceso: "3. Filtración ➔ Bucle de Depuración & Refinamiento",
          duracionDias: 25,
          acumuladoDias: 62,
          actores: "Equipo Proponente y Jurídica CUN",
          decision: "Se subsanan todas las observaciones: se crea la plataforma digital de firma conjunta empresa-docente tutor.",
          particula: {
            forma: "rombo-purpura",
            color: "#a855f7",
            etiqueta: "DEPURA",
            descripcionVisual: "Tránsito por el lazo de depuración metodológica retornando a la red con plazo."
          },
          coords: { x: 783, y: 210 }
        },
        {
          etapa: "filtracion",
          subnodoId: "sub-3-eval-pos",
          subproceso: "3. Filtración ➔ Segunda Evaluación Favorable",
          duracionDias: 3,
          acumuladoDias: 65,
          actores: "Comité de Calidad",
          decision: "Las nuevas salvaguardas satisfacen plenamente al Comité. Dictamen: Evaluación Positiva tras depuración.",
          particula: {
            forma: "escudo-esmeralda",
            color: "#10b981",
            etiqueta: "EV-POS",
            descripcionVisual: "MUTACIÓN: El reclamo depurado supera la prueba y muta a convalidación verde."
          },
          coords: { x: 783, y: 167 }
        },
        {
          etapa: "filtracion",
          subnodoId: "sub-3-5",
          subproceso: "3. Filtración ➔ Consolidación de Veredicto (OK)",
          duracionDias: 1,
          acumuladoDias: 66,
          actores: "Secretaría General CUN",
          decision: "Veredicto formal: APROBADO (OK). Pasa al paquete de conocimiento consolidado para Integración.",
          particula: {
            forma: "escudo-esmeralda",
            color: "#10b981",
            etiqueta: "OK",
            descripcionVisual: "Veredicto consolidado OK hacia Integración."
          },
          coords: { x: 843, y: 166 }
        },
        {
          etapa: "integracion",
          subnodoId: "svg-dokb-node",
          subproceso: "4. Integración ➔ Incorporación en la DOKB",
          duracionDias: 5,
          acumuladoDias: 71,
          actores: "Dirección de Prácticas y Registros",
          decision: "Codificado como Política y Procedimiento Institucional de Homologación Laboral en la DOKB.",
          particula: {
            forma: "cubo-dorado",
            color: "#f59e0b",
            etiqueta: "COK",
            descripcionVisual: "Muta a cubo dorado y se incorpora en el repositorio institucional permanente."
          },
          coords: { x: 1007, y: 417 }
        },
        {
          etapa: "retroalimentacion",
          subnodoId: "retro-experiencial",
          subproceso: "Retroalimentación Sistémica ➔ Retorno al Diagnóstico",
          duracionDias: 0,
          acumuladoDias: 71,
          actores: "Sistema General CUN",
          decision: "La experiencia de homologación nutre el diagnóstico de egresados y abre nuevas alianzas estratégicas empresariales.",
          particula: {
            forma: "pulso-retorno",
            color: "#fbbf24",
            etiqueta: "RETRO",
            descripcionVisual: "Ondas doradas fluyendo por el retorno experiencial hacia el Diagnóstico."
          },
          coords: { x: 85, y: 345 }
        }
      ]
    },
    {
      id: "caso-servidor-onpremise",
      titulo: "Caso C: Desmonte de Servicios Cloud para Volver a Servidores Físicos",
      area: "Infraestructura Tecnológica & Finanzas CUN",
      descripcionBreve: "Iniciativa para adquirir servidores físicos locales con el fin de mitigar el impacto presupuestal del dólar en licencias cloud.",
      caminoPrevisto: "FKC",
      veredictoFinal: "Reclamo Falsado (FKC) ➔ Inviable. Se Archiva con Evidencia en DOKB como Lección Aprendida",
      pasos: [
        {
          etapa: "diagnostico",
          subnodoId: "sub-1-1",
          subproceso: "1. Diagnóstico ➔ Presión Presupuestal y Detección de GAP",
          duracionDias: 4,
          acumuladoDias: 4,
          actores: "Gerencia Financiera",
          decision: "Incremento en facturación de servicios en la nube genera alerta presupuestal.",
          particula: {
            forma: "chispa-diamante",
            color: "#f59e0b",
            etiqueta: "GAP",
            descripcionVisual: "Chispa ámbar: alerta presupuestal detectada."
          },
          coords: { x: 90, y: 134 }
        },
        {
          etapa: "diagnostico",
          subnodoId: "sub-1-6",
          subproceso: "1. Diagnóstico ➔ Formulación del Reclamo KC-2026-03",
          duracionDias: 3,
          acumuladoDias: 7,
          actores: "Coordinación de Infraestructura",
          decision: "Se plantea la hipótesis de comprar datacenter físico on-premise para fijar costos en pesos colombianos.",
          particula: {
            forma: "chispa-diamante",
            color: "#38bdf8",
            etiqueta: "KC",
            descripcionVisual: "Chispa azul cian: reclamo de infraestructura formulado."
          },
          coords: { x: 220, y: 305 }
        },
        {
          etapa: "produccion",
          subnodoId: "sub-2-2",
          subproceso: "2. Producción ➔ Adquisición de Información Técnica & Cotizaciones",
          duracionDias: 8,
          acumuladoDias: 15,
          actores: "Equipo Técnico de TI",
          decision: "Levantamiento de cotizaciones de hardware, servidores en rack y licencias de virtualización locales.",
          particula: {
            forma: "chispa-diamante",
            color: "#38bdf8",
            etiqueta: "KC",
            descripcionVisual: "Tránsito por investigación técnica de mercado y cotizaciones."
          },
          coords: { x: 361, y: 275 }
        },
        {
          etapa: "produccion",
          subnodoId: "sub-2-4",
          subproceso: "2. Producción ➔ Formalización Documental (CKC)",
          duracionDias: 5,
          acumuladoDias: 20,
          actores: "Dirección de TI",
          decision: "Se consolida el anteproyecto técnico y financiero de migración física (CKC-03).",
          particula: {
            forma: "hexagono-tecnico",
            color: "#06b6d4",
            etiqueta: "CKC",
            descripcionVisual: "MUTACIÓN: Muta en hexágono cian estructurado de anteproyecto técnico."
          },
          coords: { x: 463, y: 204 }
        },
        {
          etapa: "filtracion",
          subnodoId: "sub-3-fkc-info",
          subproceso: "3. Filtración ➔ Ingreso al Riel FKC de Evaluación",
          duracionDias: 12,
          acumuladoDias: 32,
          actores: "Comité Técnico de Ciberseguridad & Riesgos CUN",
          decision: "Reposo en auditoría exhaustiva: el comité evalúa contingencias eléctricas, enlaces redundantes y refrigeración 24/7.",
          particula: {
            forma: "hexagono-tecnico",
            color: "#818cf8",
            etiqueta: "KCE",
            descripcionVisual: "Reposo en evaluación rigurosa en el riel inferior de filtración."
          },
          coords: { x: 615, y: 271 }
        },
        {
          etapa: "filtracion",
          subnodoId: "sub-3-4",
          subproceso: "3. Filtración ➔ Dictamen de Falsación (FKC)",
          duracionDias: 4,
          acumuladoDias: 36,
          actores: "Comité de Gestión del Conocimiento",
          decision: "Dictamen Negativo Vinculante: FALSADO (FKC). El costo de mantenimiento, personal 24/7 y riesgo de caída supera en 300% el ahorro previsto.",
          particula: {
            forma: "octagono-carmesi",
            color: "#ef4444",
            etiqueta: "FKC",
            descripcionVisual: "MUTACIÓN: Muta en un octágono carmesí con icono de alerta (Reclamo Falsado / Refutado)."
          },
          coords: { x: 695, y: 271 }
        },
        {
          etapa: "filtracion",
          subnodoId: "sub-3-almacen-fkc",
          subproceso: "3. Filtración ➔ Almacenamiento de Evidencia de Falsación",
          duracionDias: 3,
          acumuladoDias: 39,
          actores: "Auditoría de Procesos",
          decision: "PRINCIPIO MCELROY: NO SE BORRA LA INICIATIVA. Se documenta formalmente la matriz de costos y riesgos.",
          particula: {
            forma: "archivo-leccion",
            color: "#dc2626",
            etiqueta: "LECCIÓN",
            descripcionVisual: "La partícula carmesí se prepara para archivarse en el módulo de Lecciones Aprendidas de la DOKB."
          },
          coords: { x: 785, y: 271 }
        },
        {
          etapa: "integracion",
          subnodoId: "svg-dokb-node",
          subproceso: "Integración / DOKB ➔ Depósito en Módulo de Lecciones Aprendidas",
          duracionDias: 2,
          acumuladoDias: 41,
          actores: "Gestores Documentales DOKB",
          decision: "El reclamo falsado queda archivado en el contenedor FKC de la DOKB para evitar repetir errores costosos en el futuro.",
          particula: {
            forma: "archivo-leccion",
            color: "#dc2626",
            etiqueta: "FKC-DOKB",
            descripcionVisual: "Asentamiento permanente en el repositorio de lecciones refutadas de la DOKB."
          },
          coords: { x: 1092, y: 421 }
        },
        {
          etapa: "retroalimentacion",
          subnodoId: "svg-ambiente-procesamiento",
          subproceso: "Retroalimentación Sistémica ➔ Detección de Problemas hacia Diagnóstico",
          duracionDias: 0,
          acumuladoDias: 41,
          actores: "Ambiente de Procesamiento CUN",
          decision: "La lección aprendida retroalimenta el Diagnóstico: previene futuras compras redundantes y redirige el esfuerzo hacia esquemas multicloud.",
          particula: {
            forma: "pulso-alerta",
            color: "#f87171",
            etiqueta: "ALERTA",
            descripcionVisual: "Flujo de advertencia de lección aprendida retornando al Diagnóstico para evitar tropiezos repetidos."
          },
          coords: { x: 85, y: 345 }
        }
      ]
    }
  ]
};
