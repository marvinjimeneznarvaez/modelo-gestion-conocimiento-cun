/**
 * SIMULATION & ARCHITECTURE ENGINE - CUN MODELO DE GESTIÓN DEL CONOCIMIENTO
 * Corporación Unificada Nacional CUN · Dirección Nacional de Investigación
 * Renderiza fielmente la arquitectura con todos sus recuadros, flujos internos,
 * flechas bidireccionales, colectores y lazo cerrado de retroalimentación.
 */

class KnowledgeSimulationEngine {
  constructor(svgId, liveCardId, isSimulationMode = false) {
    this.svgId = svgId;
    this.svg = document.getElementById(svgId);
    this.liveCard = document.getElementById(liveCardId);
    this.isSimulationMode = isSimulationMode;
    this.pfx = svgId + "-"; // Prefijo único para evitar colisiones de ID entre instancias SVG

    this.currentCase = window.CUN_GC_MODEL.casosSimulacion[0];
    this.currentStepIndex = 0;
    this.isPlaying = false;
    this.animationTimer = null;
    this.stepDuration = 2800; // ms por paso en auto-play

    if (this.svg) {
      this.renderArchitectureSvg();
      this.bindSubnodeClicks();

      if (this.isSimulationMode && this.liveCard) {
        this.updateSimulationStep();
      }
    }
  }

  setCase(caseId) {
    const found = window.CUN_GC_MODEL.casosSimulacion.find(c => c.id === caseId);
    if (found) {
      this.currentCase = found;
      this.reset();
    }
  }

  renderArchitectureSvg() {
    if (!this.svg) return;

    const p = this.pfx;

    this.svg.innerHTML = `
      <defs>
        <!-- Filtros Glow Neón -->
        <filter id="${p}glow-cyan" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="${p}glow-gold" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="${p}glow-emerald" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="${p}glow-purple" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="${p}glow-red" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <!-- Marcadores de Flechas SVG con cabeza pronunciada y nítida -->
        <marker id="${p}arr-cyan" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
          <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#38bdf8" />
        </marker>
        <marker id="${p}arr-cyan-rev" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
          <path d="M 9 1.5 L 0 5 L 9 8.5 z" fill="#38bdf8" />
        </marker>
        <marker id="${p}arr-gold" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
          <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#f59e0b" />
        </marker>
        <marker id="${p}arr-emerald" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
          <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#10b981" />
        </marker>
        <marker id="${p}arr-purple" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
          <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#c084fc" />
        </marker>
        <marker id="${p}arr-red" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
          <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#ef4444" />
        </marker>
        <marker id="${p}arr-gray" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 2 L 8 5 L 0 8 z" fill="#94a3b8" />
        </marker>

        <!-- Gradientes -->
        <linearGradient id="${p}transversalGradTop" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.85"/>
          <stop offset="50%" stop-color="#0284c7" stop-opacity="0.75"/>
          <stop offset="100%" stop-color="#1e3a8a" stop-opacity="0.85"/>
        </linearGradient>

        <linearGradient id="${p}transversalGradBottom" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0f172a" stop-opacity="0.9"/>
          <stop offset="50%" stop-color="#1e293b" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#0f172a" stop-opacity="0.9"/>
        </linearGradient>

        <linearGradient id="${p}stageBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" stop-opacity="0.92"/>
          <stop offset="100%" stop-color="#080d17" stop-opacity="0.96"/>
        </linearGradient>

        <linearGradient id="${p}dokbCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2d1b02" stop-opacity="0.92"/>
          <stop offset="60%" stop-color="#181105" stop-opacity="0.96"/>
          <stop offset="100%" stop-color="#2d1b02" stop-opacity="0.92"/>
        </linearGradient>
      </defs>

      <!-- ===================================================================
           TÍTULO MAESTRO DEL MODELO (Pág. 4 del Documento PDF)
           =================================================================== -->
      <text x="600" y="24" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-weight="800" font-size="16" letter-spacing="0.5">Gestión del Conocimiento de la CUN</text>

      <!-- ===================================================================
           1. EJE TRANSVERSAL SUPERIOR: COMUNICACIÓN ORGANIZACIONAL (Pág. 11 PDF)
           =================================================================== -->
      <g class="svg-transversal-bar" id="${p}svg-bar-comunicacion" transform="translate(25, 34)">
        <rect width="1150" height="36" rx="6" fill="url(#${p}transversalGradTop)" stroke="#38bdf8" stroke-width="1.2" opacity="0.95"/>
        <text x="20" y="23" fill="#ffffff" font-family="'Outfit', sans-serif" font-weight="700" font-size="11.5">
          <tspan fill="#bae6fd" font-weight="800">COMUNICACIÓN ORGANIZACIONAL (Eje Transversal) ·</tspan> Cultura – Liderazgo – Branding – Endomarketing – Indicadores
        </text>
        <text x="1135" y="23" text-anchor="end" fill="#fde68a" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="600">TIC · IA · Redes de Aprendizaje ➔</text>
        
        <!-- Líneas conectoras que descienden con flechas hacia las 4 etapas -->
        <line x1="150" y1="36" x2="150" y2="44" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#${p}arr-cyan)"/>
        <line x1="440" y1="36" x2="440" y2="44" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#${p}arr-cyan)"/>
        <line x1="745" y1="36" x2="745" y2="44" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#${p}arr-cyan)"/>
        <line x1="1040" y1="36" x2="1040" y2="44" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#${p}arr-cyan)"/>
      </g>

      <!-- ===================================================================
           2. ETAPA 1: DIAGNÓSTICO (1:1 con Pág. 6 del Documento PDF)
           Recuadro contenedor + Flecha bidireccional + KC en paralelogramo
           =================================================================== -->
      <g class="svg-stage-container" id="${p}svg-stage-diagnostico" data-stage="diagnostico" transform="translate(25, 78)">
        <rect class="stage-outline" width="255" height="305" rx="10" fill="url(#${p}stageBgGrad)" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.5"/>
        <rect x="0" y="0" width="255" height="26" rx="10" fill="rgba(56, 189, 248, 0.15)"/>
        <text x="12" y="18" fill="#38bdf8" font-family="'Outfit', sans-serif" font-weight="700" font-size="11.5">Diagnósitico</text>
        <text x="245" y="18" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8.5">KC - Reclamos</text>

        <!-- Recuadro Envolvente de Fuentes de Brecha (Pág. 6 PDF) -->
        <rect x="10" y="36" width="108" height="255" rx="6" fill="rgba(255, 255, 255, 0.02)" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="3,3"/>
        
        <!-- Recuadro 1: Brechas de conocimiento (GAP) -->
        <g class="svg-subnode" id="${p}sub-1-1" data-sub="sub-1-1" transform="translate(16, 44)">
          <rect width="96" height="46" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="1.2"/>
          <text x="48" y="19" text-anchor="middle" fill="#f8fafc" font-size="8.5" font-family="'Outfit'" font-weight="600">Brechas de</text>
          <text x="48" y="32" text-anchor="middle" fill="#38bdf8" font-size="8.5" font-family="'Outfit'" font-weight="700">conocimiento (GAP)</text>
        </g>

        <!-- Recuadro 2: Conocimiento disponible -->
        <g class="svg-subnode" id="${p}sub-1-2" data-sub="sub-1-2" transform="translate(16, 122)">
          <rect width="96" height="46" rx="5" fill="#1e293b" stroke="#64748b" stroke-width="1.2"/>
          <text x="48" y="19" text-anchor="middle" fill="#f8fafc" font-size="8.5" font-family="'Outfit'" font-weight="600">Conocimiento</text>
          <text x="48" y="32" text-anchor="middle" fill="#94a3b8" font-size="8.5" font-family="'Outfit'">disponible</text>
        </g>

        <!-- Flecha Bidireccional Vertical (↕) entre Conocimiento disponible y Desafíos (Pág. 6 PDF) -->
        <line x1="64" y1="172" x2="64" y2="202" stroke="#38bdf8" stroke-width="1.8" marker-start="url(#${p}arr-cyan-rev)" marker-end="url(#${p}arr-cyan)"/>

        <!-- Recuadro 3: Desafíos de la organización (necesidades y demandas) -->
        <g class="svg-subnode" id="${p}sub-1-3" data-sub="sub-1-3" transform="translate(16, 206)">
          <rect width="96" height="52" rx="5" fill="#1e293b" stroke="#64748b" stroke-width="1.2"/>
          <text x="48" y="16" text-anchor="middle" fill="#f8fafc" font-size="8" font-family="'Outfit'" font-weight="600">Desafíos de la</text>
          <text x="48" y="28" text-anchor="middle" fill="#94a3b8" font-size="7.5" font-family="'Outfit'">organización</text>
          <text x="48" y="40" text-anchor="middle" fill="#94a3b8" font-size="7.5" font-family="'Outfit'">(necesidades y demandas)</text>
        </g>

        <!-- Entrada Externa desde el lazo de retroalimentación entrando por el borde izquierdo al recuadro -->
        <line x1="-10" y1="150" x2="10" y2="150" stroke="#ef4444" stroke-width="2" marker-end="url(#${p}arr-red)"/>

        <!-- Columna Central: Análisis de Indicadores & Retroalimentación de Stakeholders -->
        <g class="svg-subnode" id="${p}sub-1-4" data-sub="sub-1-4" transform="translate(130, 102)">
          <rect width="80" height="44" rx="5" fill="#0f172a" stroke="#0284c7" stroke-width="1.3"/>
          <text x="40" y="16" text-anchor="middle" fill="#f8fafc" font-size="8" font-family="'Outfit'" font-weight="600">Análisis de</text>
          <text x="40" y="27" text-anchor="middle" fill="#38bdf8" font-size="8" font-family="'Outfit'">indicadores de</text>
          <text x="40" y="38" text-anchor="middle" fill="#94a3b8" font-size="7.5" font-family="'Outfit'">desempeño</text>
        </g>

        <!-- Conexión vertical entre Análisis y Stakeholders -->
        <line x1="170" y1="148" x2="170" y2="170" stroke="#38bdf8" stroke-width="1.5" marker-start="url(#${p}arr-cyan-rev)" marker-end="url(#${p}arr-cyan)"/>

        <g class="svg-subnode" id="${p}sub-1-5" data-sub="sub-1-5" transform="translate(130, 172)">
          <rect width="80" height="44" rx="5" fill="#0f172a" stroke="#0284c7" stroke-width="1.3"/>
          <text x="40" y="18" text-anchor="middle" fill="#f8fafc" font-size="8" font-family="'Outfit'" font-weight="600">Retroalimentación</text>
          <text x="40" y="30" text-anchor="middle" fill="#38bdf8" font-size="8" font-family="'Outfit'">de Stakeholders</text>
        </g>

        <!-- Flecha hacia la IZQUIERDA (⮜) saliendo de la columna central hacia el recuadro (Pág. 6 PDF) -->
        <path d="M 130 124 L 124 124 L 124 194 L 130 194" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
        <line x1="124" y1="150" x2="118" y2="150" stroke="#38bdf8" stroke-width="1.8" marker-end="url(#${p}arr-cyan)"/>

        <!-- Flechas convergiendo hacia el nodo KC a la derecha -->
        <path d="M 210 124 L 216 124 L 216 194 L 210 194" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
        <line x1="216" y1="150" x2="223" y2="150" stroke="#38bdf8" stroke-width="1.8" marker-end="url(#${p}arr-cyan)"/>

        <!-- Nodo KC: PARALELOGRAMO INCLINADO (Pág. 6 PDF) -->
        <g class="svg-subnode" id="${p}sub-1-6" data-sub="sub-1-6">
          <polygon points="224,167 232,133 252,133 244,167" fill="#0369a1" stroke="#38bdf8" stroke-width="2" filter="url(#${p}glow-cyan)"/>
          <text x="238" y="154" text-anchor="middle" fill="#ffffff" font-family="'JetBrains Mono'" font-size="11.5" font-weight="900">KC</text>
        </g>

        <!-- Flecha de salida hacia Etapa 2 cruzando el borde con cabeza visible -->
        <line x1="247" y1="150" x2="270" y2="150" stroke="#38bdf8" stroke-width="2.2" marker-end="url(#${p}arr-cyan)"/>
      </g>

      <!-- ===================================================================
           3. ETAPA 2: PRODUCCIÓN DEL CONOCIMIENTO (1:1 con Pág. 7 del PDF)
           Split 3 vías + Ciclo Aprendizaje-Formulación + Bucle Formulación-Adquisición
           + CKC Paralelogramo + Retorno CKC-Aprendizaje + Retorno Superior Evaluación-Aprendizaje
           =================================================================== -->
      <g class="svg-stage-container" id="${p}svg-stage-produccion" data-stage="produccion" transform="translate(295, 78)">
        <rect class="stage-outline" width="290" height="305" rx="10" fill="url(#${p}stageBgGrad)" stroke="rgba(14, 165, 233, 0.4)" stroke-width="1.5"/>
        <rect x="0" y="0" width="290" height="26" rx="10" fill="rgba(14, 165, 233, 0.15)"/>
        <text x="12" y="18" fill="#38bdf8" font-family="'Outfit', sans-serif" font-weight="700" font-size="11.5">Producción del conocimiento</text>
        <text x="278" y="18" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8.5">CKC - Redes</text>

        <!-- Distribuidor Vertical de Entrada desde KC a las 3 vías (Pág. 7 PDF) -->
        <path d="M 0 150 L 10 150 M 10 68 L 10 232" fill="none" stroke="#38bdf8" stroke-width="1.6"/>
        <line x1="10" y1="68" x2="19" y2="68" stroke="#38bdf8" stroke-width="1.6" marker-end="url(#${p}arr-cyan)"/>
        <line x1="10" y1="150" x2="19" y2="150" stroke="#38bdf8" stroke-width="1.6" marker-end="url(#${p}arr-cyan)"/>
        <line x1="10" y1="232" x2="19" y2="232" stroke="#38bdf8" stroke-width="1.6" marker-end="url(#${p}arr-cyan)"/>

        <!-- Bloque 1: Aprendizaje individual y grupal (redes de conocimiento) -->
        <g class="svg-subnode" id="${p}sub-2-1" data-sub="sub-2-1" transform="translate(20, 46)">
          <rect width="135" height="44" rx="5" fill="#1e293b" stroke="#0284c7" stroke-width="1.2"/>
          <text x="67" y="18" text-anchor="middle" fill="#f8fafc" font-size="8.5" font-family="'Outfit'" font-weight="600">Aprendizaje individual y grupal</text>
          <text x="67" y="31" text-anchor="middle" fill="#38bdf8" font-size="8" font-family="'Outfit'">(redes de conocimiento)</text>
        </g>

        <!-- Bloque 2: Formulación de reclamos del conocimiento -->
        <g class="svg-subnode" id="${p}sub-2-3" data-sub="sub-2-3" transform="translate(20, 128)">
          <rect width="135" height="44" rx="5" fill="#1e293b" stroke="#0284c7" stroke-width="1.4"/>
          <text x="67" y="18" text-anchor="middle" fill="#f8fafc" font-size="8.5" font-family="'Outfit'" font-weight="600">Formulación de reclamos del</text>
          <text x="67" y="31" text-anchor="middle" fill="#38bdf8" font-size="8.5" font-family="'Outfit'">conocimiento</text>
        </g>

        <!-- Bloque 3: Adquisición de información -->
        <g class="svg-subnode" id="${p}sub-2-2" data-sub="sub-2-2" transform="translate(20, 210)">
          <rect width="135" height="44" rx="5" fill="#1e293b" stroke="#64748b" stroke-width="1.2"/>
          <text x="67" y="26" text-anchor="middle" fill="#f8fafc" font-size="8.5" font-family="'Outfit'" font-weight="600">Adquisición de información</text>
        </g>

        <!-- CICLO INTERNO 1: Desde Aprendizaje descendiendo hacia Formulación (Pág. 7 PDF) -->
        <path d="M 140 90 L 140 106 L 14 106 L 14 138 L 19 138" fill="none" stroke="#38bdf8" stroke-width="1.4" marker-end="url(#${p}arr-cyan)"/>

        <!-- CICLO INTERNO 2 (DOBLE SENTIDO): Bucle cerrado entre Formulación y Adquisición (Pág. 7 PDF) -->
        <!-- Rama 2A (Descendente): Formulación hacia Adquisición -->
        <line x1="50" y1="172" x2="50" y2="209" stroke="#38bdf8" stroke-width="1.6" marker-end="url(#${p}arr-cyan)"/>
        <!-- Rama 2B (Ascendente de retorno): Adquisición hacia Formulación -->
        <path d="M 155 224 L 163 224 L 163 186 L 115 186 L 115 173" fill="none" stroke="#38bdf8" stroke-width="1.4" marker-end="url(#${p}arr-cyan)"/>

        <!-- Flecha horizontal desde Formulación hacia CKC -->
        <line x1="155" y1="150" x2="171" y2="150" stroke="#38bdf8" stroke-width="2" marker-end="url(#${p}arr-cyan)"/>

        <!-- Nodo CKC: PARALELOGRAMO INCLINADO (Pág. 7 PDF) -->
        <g class="svg-subnode" id="${p}sub-2-4" data-sub="sub-2-4">
          <polygon points="172,167 180,133 214,133 206,167" fill="#0891b2" stroke="#38bdf8" stroke-width="2" filter="url(#${p}glow-cyan)"/>
          <text x="193" y="154" text-anchor="middle" fill="#ffffff" font-family="'JetBrains Mono'" font-size="11" font-weight="900">CKC</text>
        </g>

        <!-- CICLO INTERNO 3: Lazo de Retorno desde la parte superior de CKC hacia Aprendizaje (Pág. 7 PDF) -->
        <path d="M 197 133 L 197 68 L 156 68" fill="none" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#${p}arr-cyan)"/>

        <!-- Flecha horizontal desde CKC hacia Evaluación de reclamos -->
        <line x1="210" y1="150" x2="224" y2="150" stroke="#38bdf8" stroke-width="2" marker-end="url(#${p}arr-cyan)"/>

        <!-- Bloque Evaluación de reclamos de conocimiento -->
        <g class="svg-subnode" id="${p}sub-2-5" data-sub="sub-2-5" transform="translate(225, 128)">
          <rect width="58" height="44" rx="5" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.3"/>
          <text x="29" y="14" text-anchor="middle" fill="#f8fafc" font-size="7.5" font-family="'Outfit'" font-weight="600">Evaluación de</text>
          <text x="29" y="25" text-anchor="middle" fill="#38bdf8" font-size="7.5" font-family="'Outfit'">reclamos de</text>
          <text x="29" y="36" text-anchor="middle" fill="#94a3b8" font-size="7.5" font-family="'Outfit'">conocimiento</text>
        </g>

        <!-- CICLO INTERNO 4: Retorno Superior Completo desde Evaluación hasta Aprendizaje (Pág. 7 PDF) -->
        <path d="M 254 128 L 254 32 L 88 32 L 88 45" fill="none" stroke="#38bdf8" stroke-width="1.6" marker-end="url(#${p}arr-cyan)"/>

        <!-- Flecha de salida hacia Etapa 3 cruzando el borde -->
        <line x1="283" y1="150" x2="305" y2="150" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#${p}arr-cyan)"/>
      </g>

      <!-- ===================================================================
           4. ETAPA 3: FILTRACIÓN DEL CONOCIMIENTO (1:1 con Pág. 8 del PDF)
           Cartelas inclinadas + 3 Paralelogramos (SKC, UKC, FKC) + Columna intermedia
           + Colector vertical + Nodo OK en paralelogramo
           =================================================================== -->
      <g class="svg-stage-container" id="${p}svg-stage-filtracion" data-stage="filtracion" transform="translate(605, 78)">
        <rect class="stage-outline" width="280" height="305" rx="10" fill="url(#${p}stageBgGrad)" stroke="rgba(168, 85, 247, 0.4)" stroke-width="1.5"/>
        <rect x="0" y="0" width="280" height="26" rx="10" fill="rgba(168, 85, 247, 0.15)"/>
        <text x="12" y="18" fill="#c084fc" font-family="'Outfit', sans-serif" font-weight="700" font-size="11.5">Filtración del conocimiento</text>
        <text x="268" y="18" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8.5">SKC / UKC / FKC</text>

        <!-- Distribuidor Vertical de Entrada a las 3 vías de evaluación (Pág. 8 PDF) -->
        <path d="M 0 150 L 10 150 M 10 68 L 10 232" fill="none" stroke="#c084fc" stroke-width="1.6"/>
        <line x1="10" y1="68" x2="20" y2="68" stroke="#10b981" stroke-width="1.6" marker-end="url(#${p}arr-emerald)"/>
        <line x1="10" y1="150" x2="20" y2="150" stroke="#c084fc" stroke-width="1.6" marker-end="url(#${p}arr-purple)"/>
        <line x1="10" y1="232" x2="20" y2="232" stroke="#ef4444" stroke-width="1.6" marker-end="url(#${p}arr-red)"/>

        <!-- RIEL 1: SKC SUPERVIVENCIA -->
        <!-- Cartela de Información superior: Info sobre SKC -->
        <g class="svg-subnode" id="${p}sub-3-skc-info" data-sub="sub-3-2">
          <polygon points="20,44 26,26 84,26 78,44" fill="#1e293b" stroke="#10b981" stroke-width="1.2"/>
          <text x="52" y="38" text-anchor="middle" fill="#6ee7b7" font-size="7.5" font-family="'JetBrains Mono'">Info sobre SKC</text>
        </g>
        <path d="M 80 35 L 86 35 L 86 58 L 81 58" fill="none" stroke="#10b981" stroke-width="1.2" marker-end="url(#${p}arr-emerald)"/>

        <!-- Paralelogramo SKC Supervivencia -->
        <g class="svg-subnode" id="${p}sub-3-2" data-sub="sub-3-2">
          <polygon points="21,84 29,52 87,52 79,84" fill="#064e3b" stroke="#10b981" stroke-width="1.8"/>
          <text x="54" y="66" text-anchor="middle" fill="#ffffff" font-size="8.5" font-weight="800">SKC</text>
          <text x="54" y="77" text-anchor="middle" fill="#a7f3d0" font-size="7">Supervivencia</text>
        </g>
        <!-- Flecha desde SKC hacia Validación -->
        <line x1="84" y1="68" x2="113" y2="68" stroke="#10b981" stroke-width="1.5" marker-end="url(#${p}arr-emerald)"/>

        <!-- Bloque Validación -->
        <g class="svg-subnode" id="${p}sub-3-val" data-sub="sub-3-2" transform="translate(114, 52)">
          <rect width="72" height="32" rx="5" fill="#0f172a" stroke="#10b981" stroke-width="1.3"/>
          <text x="36" y="20" text-anchor="middle" fill="#10b981" font-size="8" font-family="'Outfit'" font-weight="700">Validación</text>
        </g>
        <!-- Línea desde Validación descendiendo hacia el colector de OK -->
        <path d="M 186 68 L 204 68 L 204 150" fill="none" stroke="#10b981" stroke-width="1.5"/>

        <!-- RIEL 2: UKC INDECISO -->
        <!-- Cartela de Información superior: Info sobre UKC -->
        <g class="svg-subnode" id="${p}sub-3-ukc-info" data-sub="sub-3-3">
          <polygon points="20,126 26,108 84,108 78,126" fill="#1e293b" stroke="#c084fc" stroke-width="1.2"/>
          <text x="52" y="120" text-anchor="middle" fill="#e9d5ff" font-size="7.5" font-family="'JetBrains Mono'">Info sobre UKC</text>
        </g>
        <path d="M 80 117 L 86 117 L 86 140 L 81 140" fill="none" stroke="#c084fc" stroke-width="1.2" marker-end="url(#${p}arr-purple)"/>

        <!-- Paralelogramo UKC Indeciso -->
        <g class="svg-subnode" id="${p}sub-3-3" data-sub="sub-3-3">
          <polygon points="21,166 29,134 87,134 79,166" fill="#581c87" stroke="#c084fc" stroke-width="1.8"/>
          <text x="54" y="148" text-anchor="middle" fill="#ffffff" font-size="8.5" font-weight="800">UKC</text>
          <text x="54" y="159" text-anchor="middle" fill="#f3e8ff" font-size="7">Indeciso</text>
        </g>

        <!-- Bifurcación desde UKC hacia Evaluación Positiva (arriba) y Depuración (abajo) -->
        <path d="M 84 150 L 98 150 M 98 136 L 98 164 M 98 136 L 113 136 M 98 164 L 113 164" fill="none" stroke="#c084fc" stroke-width="1.4"/>

        <!-- Bloque Evaluación positiva -->
        <g class="svg-subnode" id="${p}sub-3-eval-pos" data-sub="sub-3-3" transform="translate(114, 122)">
          <rect width="72" height="26" rx="4" fill="#0f172a" stroke="#10b981" stroke-width="1.2"/>
          <text x="36" y="17" text-anchor="middle" fill="#10b981" font-size="7.5" font-family="'Outfit'">Evaluación positiva</text>
        </g>

        <!-- Bloque Depuración -->
        <g class="svg-subnode" id="${p}sub-3-depuracion" data-sub="sub-3-3" transform="translate(114, 152)">
          <rect width="72" height="26" rx="4" fill="#0f172a" stroke="#c084fc" stroke-width="1.2"/>
          <text x="36" y="17" text-anchor="middle" fill="#c084fc" font-size="7.5" font-family="'Outfit'">Depuración</text>
        </g>

        <!-- Salidas de Evaluación Positiva y Depuración hacia el colector -->
        <line x1="186" y1="135" x2="204" y2="135" stroke="#10b981" stroke-width="1.4"/>
        <line x1="186" y1="165" x2="204" y2="165" stroke="#c084fc" stroke-width="1.4"/>

        <!-- RIEL 3: FKC FALSIFICADO -->
        <!-- Cartela de Información superior: Info sobre FKC -->
        <g class="svg-subnode" id="${p}sub-3-fkc-info" data-sub="sub-3-4">
          <polygon points="20,208 26,190 84,190 78,208" fill="#1e293b" stroke="#ef4444" stroke-width="1.2"/>
          <text x="52" y="202" text-anchor="middle" fill="#fca5a5" font-size="7.5" font-family="'JetBrains Mono'">Info sobre FKC</text>
        </g>
        <path d="M 80 199 L 86 199 L 86 222 L 81 222" fill="none" stroke="#ef4444" stroke-width="1.2" marker-end="url(#${p}arr-red)"/>

        <!-- Paralelogramo FKC Falsificado -->
        <g class="svg-subnode" id="${p}sub-3-4" data-sub="sub-3-4">
          <polygon points="21,248 29,216 87,216 79,248" fill="#7f1d1d" stroke="#ef4444" stroke-width="1.8"/>
          <text x="54" y="230" text-anchor="middle" fill="#ffffff" font-size="8.5" font-weight="800">FKC</text>
          <text x="54" y="241" text-anchor="middle" fill="#fecaca" font-size="7">Falsificado</text>
        </g>
        <!-- Flecha desde FKC hacia Almacenamiento -->
        <line x1="84" y1="232" x2="113" y2="232" stroke="#ef4444" stroke-width="1.5" marker-end="url(#${p}arr-red)"/>

        <!-- Bloque Almacenamiento de Evidencia de Falsación -->
        <g class="svg-subnode" id="${p}sub-3-almacen-fkc" data-sub="sub-3-4" transform="translate(114, 218)">
          <rect width="72" height="32" rx="5" fill="#0f172a" stroke="#ef4444" stroke-width="1.3"/>
          <text x="36" y="20" text-anchor="middle" fill="#ef4444" font-size="7.5" font-family="'Outfit'" font-weight="700">Almacenamiento</text>
        </g>

        <!-- Colector Vertical y Flecha hacia OK (Pág. 8 PDF) -->
        <line x1="204" y1="68" x2="204" y2="165" stroke="#10b981" stroke-width="1.8"/>
        <line x1="204" y1="150" x2="228" y2="150" stroke="#10b981" stroke-width="2" marker-end="url(#${p}arr-emerald)"/>

        <!-- Nodo OK: PARALELOGRAMO INCLINADO (Pág. 8 PDF) -->
        <g class="svg-subnode" id="${p}sub-3-5" data-sub="sub-3-5">
          <polygon points="229,167 237,133 263,133 255,167" fill="#059669" stroke="#10b981" stroke-width="2" filter="url(#${p}glow-emerald)"/>
          <text x="246" y="154" text-anchor="middle" fill="#ffffff" font-family="'JetBrains Mono'" font-size="11" font-weight="900">OK</text>
        </g>

        <!-- Flecha de salida formal desde OK hacia Integración -->
        <line x1="260" y1="150" x2="295" y2="150" stroke="#10b981" stroke-width="2.5" marker-end="url(#${p}arr-emerald)"/>
      </g>

      <!-- ===================================================================
           5. ETAPA 4: INTEGRACIÓN DEL CONOCIMIENTO (1:1 con Pág. 9 del PDF)
           Split 4 vías + 4 Procesos + Colector derecho + Trayectoria a DOKB
           =================================================================== -->
      <g class="svg-stage-container" id="${p}svg-stage-integracion" data-stage="integracion" transform="translate(905, 78)">
        <rect class="stage-outline" width="270" height="305" rx="10" fill="url(#${p}stageBgGrad)" stroke="rgba(245, 158, 11, 0.4)" stroke-width="1.5"/>
        <rect x="0" y="0" width="270" height="26" rx="10" fill="rgba(245, 158, 11, 0.15)"/>
        <text x="12" y="18" fill="#f59e0b" font-family="'Outfit', sans-serif" font-weight="700" font-size="11.5">Integración del conocimiento</text>
        <text x="258" y="18" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8.5">COK ➔ DOKB</text>

        <!-- Distribuidor Vertical de Entrada a los 4 procesos (Pág. 9 PDF) -->
        <path d="M 0 150 L 10 150 M 10 62 L 10 236" fill="none" stroke="#10b981" stroke-width="1.6"/>
        <line x1="10" y1="62" x2="20" y2="62" stroke="#f59e0b" stroke-width="1.5" marker-end="url(#${p}arr-gold)"/>
        <line x1="10" y1="120" x2="20" y2="120" stroke="#f59e0b" stroke-width="1.5" marker-end="url(#${p}arr-gold)"/>
        <line x1="10" y1="178" x2="20" y2="178" stroke="#f59e0b" stroke-width="1.5" marker-end="url(#${p}arr-gold)"/>
        <line x1="10" y1="236" x2="20" y2="236" stroke="#f59e0b" stroke-width="1.5" marker-end="url(#${p}arr-gold)"/>

        <!-- 1. Organizar -->
        <g class="svg-subnode" id="${p}sub-4-1" data-sub="sub-4-1" transform="translate(20, 46)">
          <rect width="100" height="32" rx="5" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2"/>
          <text x="50" y="20" text-anchor="middle" fill="#fef3c7" font-size="8.5" font-family="'Outfit'" font-weight="700">Organizar</text>
        </g>

        <!-- 2. Almacenar -->
        <g class="svg-subnode" id="${p}sub-4-2" data-sub="sub-4-2" transform="translate(20, 104)">
          <rect width="100" height="32" rx="5" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2"/>
          <text x="50" y="20" text-anchor="middle" fill="#fef3c7" font-size="8.5" font-family="'Outfit'" font-weight="700">Almacenar</text>
        </g>

        <!-- 3. Transferencia -->
        <g class="svg-subnode" id="${p}sub-4-3" data-sub="sub-4-3" transform="translate(20, 162)">
          <rect width="100" height="32" rx="5" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2"/>
          <text x="50" y="20" text-anchor="middle" fill="#fef3c7" font-size="8.5" font-family="'Outfit'" font-weight="700">Transferencia</text>
        </g>

        <!-- 4. Divulgación -->
        <g class="svg-subnode" id="${p}sub-4-4" data-sub="sub-4-4" transform="translate(20, 220)">
          <rect width="100" height="32" rx="5" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2"/>
          <text x="50" y="20" text-anchor="middle" fill="#fef3c7" font-size="8.5" font-family="'Outfit'" font-weight="700">Divulgación</text>
        </g>

        <!-- Colector Vertical de Salida a la Derecha de los 4 Procesos (Pág. 9 PDF) -->
        <line x1="120" y1="62" x2="135" y2="62" stroke="#f59e0b" stroke-width="1.4"/>
        <line x1="120" y1="120" x2="135" y2="120" stroke="#f59e0b" stroke-width="1.4"/>
        <line x1="120" y1="178" x2="135" y2="178" stroke="#f59e0b" stroke-width="1.4"/>
        <line x1="120" y1="236" x2="135" y2="236" stroke="#f59e0b" stroke-width="1.4"/>
        <line x1="135" y1="62" x2="135" y2="236" stroke="#f59e0b" stroke-width="1.8"/>

        <!-- Línea de Salida hacia DOKB: Sale a la derecha, baja 90° y dobla hacia la nube DOKB (Pág. 4 y 9 PDF) -->
        <line x1="135" y1="150" x2="210" y2="150" stroke="#f59e0b" stroke-width="2.2"/>
        <line x1="210" y1="150" x2="210" y2="417" stroke="#f59e0b" stroke-width="2.2"/>
        <line x1="210" y1="417" x2="150" y2="417" stroke="#f59e0b" stroke-width="2.2" marker-end="url(#${p}arr-gold)"/>
      </g>

      <!-- ===================================================================
           6. ZONA INFERIOR: LAZO CERRADO SISTÉMICO (Págs. 4 y 10 del PDF)
           Stakeholders + Ambiente Organizacional + Flecha en bloque + Nube DOKB
           =================================================================== -->

      <!-- Ducto Horizontal de Retroalimentación Experiencial -->
      <line x1="640" y1="412" x2="35" y2="412" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="5,5" marker-end="url(#${p}arr-gold)"/>
      
      <!-- Cartela protectora de la leyenda central -->
      <g transform="translate(360, 412)">
        <rect x="-110" y="-10" width="220" height="20" rx="4" fill="#070d17" stroke="rgba(245, 158, 11, 0.3)" stroke-width="1"/>
        <text y="4" text-anchor="middle" fill="#fde68a" font-family="'Outfit'" font-weight="700" font-size="9.5" letter-spacing="0.5">
          Retroalimentación experiencial ·
        </text>
      </g>

      <!-- STAKEHOLDERS (ENTRADAS EXTERNAS - Pág. 10 PDF) -->
      <g class="svg-subnode" id="${p}svg-stakeholders" data-sub="sub-1-5" transform="translate(60, 445)">
        <rect width="230" height="82" rx="10" fill="#0b1120" stroke="#38bdf8" stroke-width="1.4" stroke-dasharray="4,4"/>
        <text x="115" y="19" text-anchor="middle" fill="#38bdf8" font-family="'Outfit'" font-weight="700" font-size="11">Stakeholders</text>
        
        <rect x="12" y="28" width="62" height="42" rx="5" fill="#1e293b" stroke="#64748b" stroke-width="1.2"/>
        <text x="43" y="47" text-anchor="middle" fill="#ffffff" font-size="8.5" font-family="'Outfit'" font-weight="600">Estado</text>
        <text x="43" y="60" text-anchor="middle" fill="#94a3b8" font-size="7.5" font-family="'Outfit'">MEN / CNA</text>

        <rect x="84" y="28" width="62" height="42" rx="5" fill="#1e293b" stroke="#64748b" stroke-width="1.2"/>
        <text x="115" y="47" text-anchor="middle" fill="#ffffff" font-size="8.5" font-family="'Outfit'" font-weight="600">Sociedad</text>
        <text x="115" y="60" text-anchor="middle" fill="#94a3b8" font-size="7.5" font-family="'Outfit'">Estudiantes</text>

        <rect x="156" y="28" width="62" height="42" rx="5" fill="#1e293b" stroke="#64748b" stroke-width="1.2"/>
        <text x="187" y="47" text-anchor="middle" fill="#ffffff" font-size="8.5" font-family="'Outfit'" font-weight="600">Empresas</text>
        <text x="187" y="60" text-anchor="middle" fill="#94a3b8" font-size="7.5" font-family="'Outfit'">Aliadas</text>

        <text x="115" y="96" text-anchor="middle" fill="#38bdf8" font-size="8.5" font-family="'Outfit'" font-weight="700">Entradas externas</text>
      </g>

      <!-- AMBIENTE DE PROCESAMIENTO ORGANIZACIONAL (Pág. 10 PDF) -->
      <g class="svg-subnode" id="${p}svg-ambiente-procesamiento" transform="translate(320, 440)">
        <rect width="440" height="102" rx="10" fill="#0c1424" stroke="rgba(255, 255, 255, 0.25)" stroke-width="1.4"/>
        <text x="220" y="19" text-anchor="middle" fill="#e2e8f0" font-family="'Outfit'" font-weight="700" font-size="11.5">Ambiente de procesamiento organizacional</text>
        
        <!-- Sub-bloque Izquierdo: Comportamiento de agentes -->
        <rect x="15" y="30" width="180" height="58" rx="6" fill="#152037" stroke="rgba(255, 255, 255, 0.12)"/>
        <text x="105" y="48" text-anchor="middle" fill="#f8fafc" font-size="8" font-family="'Outfit'" font-weight="600">Comportamiento de agentes que</text>
        <text x="105" y="60" text-anchor="middle" fill="#94a3b8" font-size="7.5" font-family="'Outfit'">interactúan en los procesos</text>
        <text x="105" y="72" text-anchor="middle" fill="#94a3b8" font-size="7.5" font-family="'Outfit'">organizacionales</text>

        <!-- Flecha hacia la izquierda entre contenedores y comportamiento de agentes -->
        <line x1="225" y1="59" x2="201" y2="59" stroke="#f59e0b" stroke-width="1.8" marker-end="url(#${p}arr-gold)"/>

        <!-- Sub-bloque Derecho: DOKB contenedores -->
        <rect x="225" y="30" width="200" height="58" rx="6" fill="#152037" stroke="rgba(255, 255, 255, 0.12)"/>
        <text x="235" y="48" fill="#fde68a" font-size="8.5" font-family="'Outfit'" font-weight="600">-DOKB "contenedores"</text>
        <text x="235" y="61" fill="#cbd5e1" font-size="7.5" font-family="'Outfit'">-Agentes (indv. Y grups)</text>
        <text x="235" y="74" fill="#cbd5e1" font-size="7.5" font-family="'Outfit'">-Artefactos (DOC, IT,...)</text>

        <!-- Conexión que sube desde el contenedor hacia la línea de retroalimentación experiencial -->
        <line x1="320" y1="30" x2="320" y2="-28" stroke="#f59e0b" stroke-width="1.8"/>
      </g>

      <!-- FLECHA GRUESA EN BLOQUE (⮈) ENTRE DOKB Y AMBIENTE (Pág. 10 PDF) -->
      <polygon points="768,495 808,472 808,485 868,485 868,505 808,505 808,518" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" stroke-width="1.8"/>

      <!-- NUBE DOKB: FORMA DE NUBE VECTORIAL FIEL AL PDF (Pág. 10 PDF) -->
      <g class="svg-dokb-card" id="${p}svg-dokb-node" data-sub="dokb">
        <path d="M 885,495 a 26,26 0 0,1 25,-30 a 30,30 0 0,1 55,-12 a 28,28 0 0,1 52,14 a 26,26 0 0,1 22,28 a 26,26 0 0,1 -15,26 a 28,28 0 0,1 -42,16 a 30,30 0 0,1 -55,-5 a 26,26 0 0,1 -42,-37 z" fill="url(#${p}dokbCloudGrad)" stroke="#f59e0b" stroke-width="2.2" filter="url(#${p}glow-gold)"/>
        
        <text x="965" y="482" text-anchor="middle" fill="#ffffff" font-family="'JetBrains Mono'" font-weight="900" font-size="12" letter-spacing="1">DOKB</text>
        <text x="965" y="497" text-anchor="middle" fill="#fde68a" font-family="'Outfit'" font-weight="600" font-size="8">Conocimiento objetivo</text>
        <text x="965" y="510" text-anchor="middle" fill="#fde68a" font-family="'Outfit'" font-weight="600" font-size="8">Conocimiento subjetivo</text>
      </g>

      <!-- LAZO DE RETROALIMENTACIÓN EXTERNA (INCLUYE DETECCIÓN DE PROBLEMAS) (Págs. 4 y 10 PDF) -->
      <path d="M 60 486 L 15 486 L 15 228 L 25 228" fill="none" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="4,4" marker-end="url(#${p}arr-red)"/>
      <g transform="translate(15, 275) rotate(-90)">
        <text text-anchor="middle" fill="#f87171" font-size="7.5" font-family="'Outfit'" font-weight="700" letter-spacing="0.5">Retroalimentación (Incluye detección de problemas)</text>
      </g>

      <!-- ===================================================================
           7. EJE TRANSVERSAL INFERIOR: EVALUACIÓN CONSTANTE & ISO 30401
           =================================================================== -->
      <g class="svg-transversal-bar" id="${p}svg-bar-evaluacion" transform="translate(25, 580)">
        <rect width="1150" height="42" rx="6" fill="url(#${p}transversalGradBottom)" stroke="rgba(245, 158, 11, 0.4)" stroke-width="1.2"/>
        <text x="20" y="20" fill="#fde68a" font-family="'Outfit', sans-serif" font-weight="800" font-size="10" letter-spacing="1">SEGUNDO EJE TRANSVERSAL · MEJORA CONTINUA</text>
        <text x="20" y="34" fill="#e2e8f0" font-family="'Outfit', sans-serif" font-weight="700" font-size="11.5">LA EVALUACIÓN ES CONSTANTE, NO UNA ETAPA FINAL (ISO 30401:2018 · ISO 9001:2015 · Tablero de Mando)</text>
        <text x="1135" y="27" text-anchor="end" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="600">Ver Matriz de Indicadores ➔</text>
      </g>

      <!-- ===================================================================
           8. CÁPSULA DE CONOCIMIENTO MÓVIL Y MUTANTE (SOLO EN SIMULACIÓN)
           =================================================================== -->
      <g id="${p}knowledgeCapsuleGroup" transform="translate(89, 148)" style="transition: transform 0.8s cubic-bezier(0.2, 0.9, 0.3, 1.2);">
        <g id="${p}capsuleShapeRenderer">
          <polygon points="0,-16 16,0 0,16 -16,0" fill="#f59e0b" stroke="#ffffff" stroke-width="2" filter="url(#${p}glow-cyan)"/>
          <text y="4" text-anchor="middle" fill="#070b14" font-size="8.5" font-weight="900" font-family="'JetBrains Mono'">GAP</text>
        </g>
      </g>

      <!-- Pulso de retorno experiencial activo -->
      <circle id="${p}retroPulseCircle" cx="89" cy="228" r="10" fill="#fbbf24" filter="url(#${p}glow-gold)" opacity="0"/>
    `;

    if (!this.isSimulationMode) {
      const capsule = this.svg.querySelector(`#${p}knowledgeCapsuleGroup`);
      if (capsule) capsule.style.display = "none";
    }
  }

  bindSubnodeClicks() {
    this.svg.querySelectorAll(".svg-subnode, .svg-stage-container, .svg-dokb-card, .svg-transversal-bar").forEach(elem => {
      elem.addEventListener("click", (e) => {
        e.stopPropagation();
        const stageId = elem.getAttribute("data-stage") || elem.id.replace(this.pfx, "").replace("svg-stage-", "");
        const subId = elem.getAttribute("data-sub");

        window.dispatchEvent(new CustomEvent("cun:inspector:open", {
          detail: { stageId, subId, elementId: elem.id.replace(this.pfx, "") }
        }));
      });
    });
  }

  // =========================================================================
  // CONTROLADOR DEL SIMULADOR EN VIVO
  // =========================================================================
  updateSimulationStep() {
    const currentStep = this.currentCase.pasos[this.currentStepIndex];
    if (!currentStep) return;

    // 1. Mover y mutar la cápsula gráfica
    this.moveCapsule(currentStep);

    // 2. Actualizar tarjeta de información en vivo
    if (this.liveCard) {
      const badgeColor = currentStep.particula.color;

      this.liveCard.innerHTML = `
        <div class="claim-type-icon" style="border-color: ${badgeColor}; color: ${badgeColor}">
          ${currentStep.particula.etiqueta}
        </div>
        <div class="claim-info">
          <h4>
            ${this.currentCase.titulo}
            <span style="font-size:0.75rem; background:rgba(255,255,255,0.06); padding:0.2rem 0.5rem; border-radius:4px; font-weight:normal;">
              ${this.currentCase.area}
            </span>
          </h4>

          <div class="claim-meta-tags">
            <span class="tag-time">⏱️ Duración: ${currentStep.duracionDias > 0 ? currentStep.duracionDias + ' días' : 'Inmediato'}</span>
            <span class="tag-time">📅 Acumulado: ${currentStep.acumuladoDias} días</span>
            <span class="tag-actor">👤 Actores: ${currentStep.actores}</span>
            <span class="tag-morph">✨ Estado: ${currentStep.particula.etiqueta}</span>
          </div>

          <div class="claim-decision-box">
            <strong>Subproceso:</strong> ${currentStep.subproceso}<br>
            <strong>Decisión / Veredicto:</strong> ${currentStep.decision}
          </div>
        </div>
        <div>
          <span style="font-family:'JetBrains Mono'; font-size:0.8rem; font-weight:800; background:${badgeColor}; color:#070b14; padding:0.4rem 0.8rem; border-radius:6px; display:inline-block; text-transform:uppercase;">
            Paso ${this.currentStepIndex + 1} / ${this.currentCase.pasos.length}
          </span>
        </div>
      `;
    }

    // 3. Resaltar visualmente el subnodo activo
    this.svg.querySelectorAll(".svg-subnode rect, .svg-subnode polygon").forEach(el => {
      el.style.filter = "none";
    });

    if (currentStep.subnodoId) {
      const activeEl = this.svg.querySelector(`#${this.pfx}${currentStep.subnodoId}`);
      if (activeEl) {
        const shape = activeEl.querySelector("rect, polygon");
        if (shape) shape.style.filter = "drop-shadow(0 0 10px rgba(56, 189, 248, 0.8))";
      }
    }

    // 4. Pulso de retorno experiencial si es el paso final
    const retroPulse = this.svg.querySelector(`#${this.pfx}retroPulseCircle`);
    if (retroPulse) {
      if (currentStep.etapa === "retroalimentacion") {
        retroPulse.setAttribute("opacity", "1");
      } else {
        retroPulse.setAttribute("opacity", "0");
      }
    }
  }

  moveCapsule(step) {
    const group = this.svg.querySelector(`#${this.pfx}knowledgeCapsuleGroup`);
    const renderer = this.svg.querySelector(`#${this.pfx}capsuleShapeRenderer`);
    if (!group || !renderer) return;

    // Animación de posición
    group.setAttribute("transform", `translate(${step.coords.x}, ${step.coords.y})`);

    // Mutación visual de la partícula según el estado
    const p = step.particula;
    let shapeSvg = "";

    switch (p.forma) {
      case "chispa-diamante":
        shapeSvg = `
          <polygon points="0,-16 16,0 0,16 -16,0" fill="${p.color}" stroke="#ffffff" stroke-width="2" filter="url(#${this.pfx}glow-cyan)"/>
          <text y="4" text-anchor="middle" fill="#070b14" font-size="8.5" font-weight="900" font-family="'JetBrains Mono'">${p.etiqueta}</text>
        `;
        break;

      case "hexagono-tecnico":
        shapeSvg = `
          <polygon points="0,-16 14,-8 14,8 0,16 -14,8 -14,-8" fill="${p.color}" stroke="#ffffff" stroke-width="2.2" filter="url(#${this.pfx}glow-cyan)"/>
          <text y="4" text-anchor="middle" fill="#ffffff" font-size="8" font-weight="900" font-family="'JetBrains Mono'">${p.etiqueta}</text>
        `;
        break;

      case "escudo-esmeralda":
        shapeSvg = `
          <circle r="16" fill="#059669" stroke="#34d399" stroke-width="2.5" filter="url(#${this.pfx}glow-emerald)"/>
          <circle r="6" fill="#ffffff" opacity="0.3"/>
          <text y="4" text-anchor="middle" fill="#ffffff" font-size="8" font-weight="900" font-family="'JetBrains Mono'">${p.etiqueta}</text>
        `;
        break;

      case "rombo-purpura":
        shapeSvg = `
          <polygon points="0,-16 16,0 0,16 -16,0" fill="${p.color}" stroke="#f3e8ff" stroke-width="2.5" filter="url(#${this.pfx}glow-purple)"/>
          <text y="4" text-anchor="middle" fill="#ffffff" font-size="7.5" font-weight="900" font-family="'JetBrains Mono'">${p.etiqueta}</text>
        `;
        break;

      case "octagono-carmesi":
      case "archivo-leccion":
        shapeSvg = `
          <polygon points="-7,-16 7,-16 16,-7 16,7 7,16 -7,16 -16,7 -16,-7" fill="${p.color}" stroke="#fecaca" stroke-width="2.5" filter="url(#${this.pfx}glow-red)"/>
          <text y="4" text-anchor="middle" fill="#ffffff" font-size="7.5" font-weight="900" font-family="'JetBrains Mono'">${p.etiqueta}</text>
        `;
        break;

      case "cubo-dorado":
      case "boveda-dorada":
        shapeSvg = `
          <rect x="-14" y="-14" width="28" height="28" rx="6" fill="#d97706" stroke="#fbbf24" stroke-width="3" filter="url(#${this.pfx}glow-gold)"/>
          <text y="4" text-anchor="middle" fill="#070b14" font-size="8" font-weight="900" font-family="'JetBrains Mono'">${p.etiqueta}</text>
        `;
        break;

      default:
        shapeSvg = `
          <circle r="15" fill="${p.color}" stroke="#ffffff" stroke-width="2"/>
          <text y="4" text-anchor="middle" fill="#ffffff" font-size="8" font-weight="800" font-family="'JetBrains Mono'">${p.etiqueta}</text>
        `;
        break;
    }

    renderer.innerHTML = shapeSvg;
  }

  nextStep() {
    if (this.currentStepIndex < this.currentCase.pasos.length - 1) {
      this.currentStepIndex++;
      this.updateSimulationStep();
    } else {
      this.pause();
    }
  }

  prevStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.updateSimulationStep();
    }
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    if (this.currentStepIndex >= this.currentCase.pasos.length - 1) {
      this.currentStepIndex = 0;
      this.updateSimulationStep();
    }

    this.animationTimer = setInterval(() => {
      if (this.currentStepIndex < this.currentCase.pasos.length - 1) {
        this.nextStep();
      } else {
        this.pause();
      }
    }, this.stepDuration);
  }

  pause() {
    this.isPlaying = false;
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
      this.animationTimer = null;
    }
  }

  reset() {
    this.pause();
    this.currentStepIndex = 0;
    this.updateSimulationStep();
  }
}

window.KnowledgeSimulationEngine = KnowledgeSimulationEngine;
