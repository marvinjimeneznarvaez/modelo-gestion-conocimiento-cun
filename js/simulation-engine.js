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
          <stop offset="0%" stop-color="#0f172a" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#080d17" stop-opacity="0.95"/>
        </linearGradient>

        <linearGradient id="${p}dokbCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2d1b02" stop-opacity="0.9"/>
          <stop offset="60%" stop-color="#181105" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#2d1b02" stop-opacity="0.9"/>
        </linearGradient>
      </defs>

      <!-- ===================================================================
           1. EJE TRANSVERSAL SUPERIOR: COMUNICACIÓN ORGANIZACIONAL
           =================================================================== -->
      <g class="svg-transversal-bar" id="${p}svg-bar-comunicacion" transform="translate(30, 12)">
        <rect width="1140" height="46" rx="8" fill="url(#${p}transversalGradTop)" stroke="#38bdf8" stroke-width="1.2" opacity="0.95"/>
        <text x="25" y="22" fill="#bae6fd" font-family="'Outfit', sans-serif" font-weight="800" font-size="10.5" letter-spacing="1">EJE TRANSVERSAL</text>
        <text x="25" y="37" fill="#ffffff" font-family="'Outfit', sans-serif" font-weight="700" font-size="12.5">COMUNICACIÓN ORGANIZACIONAL (Cultura · Liderazgo Transformacional · Branding · Endomarketing · Indicadores)</text>
        <text x="1115" y="29" text-anchor="end" fill="#fde68a" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="600">TIC · IA · Redes de Aprendizaje ➔</text>
        
        <!-- Líneas conectoras que descienden con flechas hacia las 4 etapas -->
        <line x1="155" y1="46" x2="155" y2="70" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#${p}arr-cyan)"/>
        <line x1="430" y1="46" x2="430" y2="70" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#${p}arr-cyan)"/>
        <line x1="720" y1="46" x2="720" y2="70" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#${p}arr-cyan)"/>
        <line x1="1025" y1="46" x2="1025" y2="70" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#${p}arr-cyan)"/>
      </g>

      <!-- ===================================================================
           2. ETAPA 1: DIAGNÓSTICO (GAP)
           =================================================================== -->
      <g class="svg-stage-container" id="${p}svg-stage-diagnostico" data-stage="diagnostico" transform="translate(30, 72)">
        <rect class="stage-outline" width="250" height="273" rx="12" fill="url(#${p}stageBgGrad)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1.5"/>
        <rect x="0" y="0" width="250" height="28" rx="12" fill="rgba(56, 189, 248, 0.15)"/>
        <text x="12" y="19" fill="#38bdf8" font-family="'Outfit', sans-serif" font-weight="700" font-size="11.5">1. DIAGNÓSTICO</text>
        <text x="238" y="19" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8.5">KC - Reclamo</text>

        <!-- Sub-bloque Izquierdo: Fuentes de Brecha (Agrupador) -->
        <rect x="10" y="36" width="100" height="150" rx="8" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255, 255, 255, 0.1)" stroke-dasharray="3,3"/>
        
        <!-- Recuadro 1: Brechas de conocimiento (GAP) -->
        <g class="svg-subnode" id="${p}sub-1-1" data-sub="sub-1-1" transform="translate(14, 42)">
          <rect width="92" height="40" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1.2"/>
          <text x="6" y="17" fill="#f8fafc" font-size="8.5" font-family="'Outfit'" font-weight="600">Brechas de</text>
          <text x="6" y="30" fill="#38bdf8" font-size="8.5" font-family="'Outfit'" font-weight="700">conocimiento (GAP)</text>
        </g>

        <!-- Recuadro 2: Conocimiento disponible -->
        <g class="svg-subnode" id="${p}sub-1-2" data-sub="sub-1-2" transform="translate(14, 89)">
          <rect width="92" height="40" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="1.2"/>
          <text x="6" y="17" fill="#f8fafc" font-size="8.5" font-family="'Outfit'" font-weight="600">Conocimiento</text>
          <text x="6" y="30" fill="#94a3b8" font-size="8.5" font-family="'Outfit'">disponible</text>
        </g>

        <!-- Recuadro 3: Desafíos de la organización -->
        <g class="svg-subnode" id="${p}sub-1-3" data-sub="sub-1-3" transform="translate(14, 136)">
          <rect width="92" height="44" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="1.2"/>
          <text x="6" y="16" fill="#f8fafc" font-size="8.5" font-family="'Outfit'" font-weight="600">Desafíos CUN</text>
          <text x="6" y="28" fill="#94a3b8" font-size="8" font-family="'Outfit'">(necesidades y)</text>
          <text x="6" y="39" fill="#94a3b8" font-size="8" font-family="'Outfit'">demandas</text>
        </g>

        <!-- Flechas desde fuentes hacia columna central (con cabezas visibles) -->
        <path d="M 106 62 L 132 62 L 132 85 L 140 85" fill="none" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#${p}arr-cyan)"/>
        <path d="M 106 109 L 140 109" fill="none" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#${p}arr-cyan)"/>
        <path d="M 106 158 L 132 158 L 132 170 L 140 170" fill="none" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#${p}arr-cyan)"/>

        <!-- Columna Central: Análisis de Indicadores & Retroalimentación de Stakeholders -->
        <g class="svg-subnode" id="${p}sub-1-4" data-sub="sub-1-4" transform="translate(142, 65)">
          <rect width="96" height="44" rx="6" fill="#0f172a" stroke="#0284c7" stroke-width="1.4"/>
          <text x="7" y="17" fill="#f8fafc" font-size="8.5" font-family="'Outfit'" font-weight="600">Análisis indicadores</text>
          <text x="7" y="31" fill="#38bdf8" font-size="8.5" font-family="'Outfit'">de desempeño</text>
        </g>

        <!-- Conexión Recíproca / Bidireccional Explícita entre Análisis y Stakeholders -->
        <line x1="190" y1="112" x2="190" y2="142" stroke="#38bdf8" stroke-width="2" marker-start="url(#${p}arr-cyan-rev)" marker-end="url(#${p}arr-cyan)"/>

        <g class="svg-subnode" id="${p}sub-1-5" data-sub="sub-1-5" transform="translate(142, 145)">
          <rect width="96" height="44" rx="6" fill="#0f172a" stroke="#0284c7" stroke-width="1.4"/>
          <text x="7" y="17" fill="#f8fafc" font-size="8.5" font-family="'Outfit'" font-weight="600">Retroalimentación</text>
          <text x="7" y="31" fill="#38bdf8" font-size="8.5" font-family="'Outfit'">de Stakeholders</text>
        </g>

        <!-- Flechas que convergen hacia el nodo KC -->
        <path d="M 190 191 L 190 216" fill="none" stroke="#38bdf8" stroke-width="1.8" marker-end="url(#${p}arr-cyan)"/>

        <!-- Nodo KC: Reclamo de Conocimiento -->
        <g class="svg-subnode" id="${p}sub-1-6" data-sub="sub-1-6" transform="translate(164, 218)">
          <rect width="52" height="30" rx="6" fill="#0369a1" stroke="#38bdf8" stroke-width="1.8" filter="url(#${p}glow-cyan)"/>
          <text x="26" y="19" text-anchor="middle" fill="#ffffff" font-family="'JetBrains Mono'" font-size="12" font-weight="800">KC</text>
        </g>

        <!-- Flecha de salida hacia Etapa 2 con cabeza visible -->
        <path d="M 218 233 L 260 233" fill="none" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#${p}arr-cyan)"/>
        <text x="238" y="258" text-anchor="middle" fill="#38bdf8" font-size="8" font-family="'JetBrains Mono'" font-weight="700">Reclamo KC ➔</text>
      </g>

      <!-- Conector entre Etapa 1 y Etapa 2 -->
      <line x1="280" y1="205" x2="295" y2="205" stroke="#38bdf8" stroke-width="3" marker-end="url(#${p}arr-cyan)"/>

      <!-- ===================================================================
           3. ETAPA 2: PRODUCCIÓN DEL CONOCIMIENTO (SECUENCIA HORIZONTAL REAL)
           Columna Izq (Fuentes) ➔ CKC (Centro) ➔ Evaluación (Derecha) ➔ Loop Superior
           =================================================================== -->
      <g class="svg-stage-container" id="${p}svg-stage-produccion" data-stage="produccion" transform="translate(295, 72)">
        <rect class="stage-outline" width="270" height="273" rx="12" fill="url(#${p}stageBgGrad)" stroke="rgba(14, 165, 233, 0.35)" stroke-width="1.5"/>
        <rect x="0" y="0" width="270" height="28" rx="12" fill="rgba(14, 165, 233, 0.15)"/>
        <text x="12" y="19" fill="#38bdf8" font-family="'Outfit', sans-serif" font-weight="700" font-size="11.5">2. PRODUCCIÓN DEL CONOCIMIENTO</text>
        <text x="258" y="19" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8.5">CKC - Redes</text>

        <!-- Columna Izquierda: Aprendizaje, Formulación, Adquisición -->
        <g class="svg-subnode" id="${p}sub-2-1" data-sub="sub-2-1" transform="translate(10, 40)">
          <rect width="112" height="42" rx="6" fill="#1e293b" stroke="#0284c7" stroke-width="1.2"/>
          <text x="6" y="16" fill="#f8fafc" font-size="8.5" font-family="'Outfit'" font-weight="600">Aprendizaje individual</text>
          <text x="6" y="29" fill="#38bdf8" font-size="8.5" font-family="'Outfit'">y grupal (redes)</text>
        </g>

        <!-- Flecha descendente desde Aprendizaje hacia Formulación -->
        <line x1="66" y1="83" x2="66" y2="108" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#${p}arr-cyan)"/>

        <g class="svg-subnode" id="${p}sub-2-3" data-sub="sub-2-3" transform="translate(10, 110)">
          <rect width="112" height="44" rx="6" fill="#1e293b" stroke="#0284c7" stroke-width="1.4"/>
          <text x="6" y="17" fill="#f8fafc" font-size="8.5" font-family="'Outfit'" font-weight="600">Formulación de</text>
          <text x="6" y="30" fill="#38bdf8" font-size="8.5" font-family="'Outfit'">reclamos (Bloom)</text>
        </g>

        <!-- Flecha ascendente desde Adquisición hacia Formulación -->
        <line x1="66" y1="180" x2="66" y2="157" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#${p}arr-cyan)"/>

        <g class="svg-subnode" id="${p}sub-2-2" data-sub="sub-2-2" transform="translate(10, 182)">
          <rect width="112" height="42" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="1.2"/>
          <text x="6" y="16" fill="#f8fafc" font-size="8.5" font-family="'Outfit'" font-weight="600">Adquisición de</text>
          <text x="6" y="29" fill="#94a3b8" font-size="8.5" font-family="'Outfit'">información técnica</text>
        </g>

        <!-- Flecha horizontal desde Formulación hacia CKC -->
        <line x1="124" y1="132" x2="144" y2="132" stroke="#38bdf8" stroke-width="2" marker-end="url(#${p}arr-cyan)"/>

        <!-- Centro: Bloque CKC (Reclamo Codificado) -->
        <g class="svg-subnode" id="${p}sub-2-4" data-sub="sub-2-4" transform="translate(146, 114)">
          <rect width="44" height="36" rx="6" fill="#0891b2" stroke="#38bdf8" stroke-width="2" filter="url(#${p}glow-cyan)"/>
          <text x="22" y="23" text-anchor="middle" fill="#ffffff" font-family="'JetBrains Mono'" font-size="10" font-weight="900">CKC</text>
        </g>

        <!-- Flecha horizontal desde CKC hacia Evaluación de reclamos (A LA MISMA ALTURA A LA DERECHA) -->
        <line x1="192" y1="132" x2="204" y2="132" stroke="#38bdf8" stroke-width="2" marker-end="url(#${p}arr-cyan)"/>

        <!-- Derecha: Evaluación de reclamos de conocimiento -->
        <g class="svg-subnode" id="${p}sub-2-5" data-sub="sub-2-5" transform="translate(206, 110)">
          <rect width="56" height="44" rx="6" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.4"/>
          <text x="4" y="16" fill="#f8fafc" font-size="8" font-family="'Outfit'" font-weight="600">Evaluación</text>
          <text x="4" y="27" fill="#38bdf8" font-size="8" font-family="'Outfit'">reclamos</text>
          <text x="4" y="38" fill="#94a3b8" font-size="7.5" font-family="'Outfit'">(pares red)</text>
        </g>

        <!-- Lazo de Retroalimentación Superior: Desde Evaluación hasta Aprendizaje (como en el PDF Pág. 7) -->
        <path d="M 234 108 L 234 26 L 66 26 L 66 38" fill="none" stroke="#38bdf8" stroke-width="1.6" stroke-dasharray="3,3" marker-end="url(#${p}arr-cyan)"/>

        <!-- Salida hacia Etapa 3 (Filtración) -->
        <path d="M 234 156 L 234 205 L 268 205" fill="none" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#${p}arr-cyan)"/>
        <text x="238" y="228" text-anchor="middle" fill="#38bdf8" font-size="8" font-family="'JetBrains Mono'" font-weight="700">CKC ➔</text>
      </g>

      <!-- Conector entre Etapa 2 y Etapa 3 -->
      <line x1="565" y1="205" x2="580" y2="205" stroke="#38bdf8" stroke-width="3" marker-end="url(#${p}arr-cyan)"/>

      <!-- ===================================================================
           4. ETAPA 3: FILTRACIÓN DEL CONOCIMIENTO (MCELROY)
           Tres rieles horizontales paralelos con cabezas de flecha explícitas
           =================================================================== -->
      <g class="svg-stage-container" id="${p}svg-stage-filtracion" data-stage="filtracion" transform="translate(580, 72)">
        <rect class="stage-outline" width="285" height="273" rx="12" fill="url(#${p}stageBgGrad)" stroke="rgba(168, 85, 247, 0.35)" stroke-width="1.5"/>
        <rect x="0" y="0" width="285" height="28" rx="12" fill="rgba(168, 85, 247, 0.15)"/>
        <text x="12" y="19" fill="#c084fc" font-family="'Outfit', sans-serif" font-weight="700" font-size="11.5">3. FILTRACIÓN (KCE · McElroy)</text>
        <text x="273" y="19" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8.5">SKC/UKC/FKC</text>

        <!-- RIEL 1: SUPERVIVIENTE (SKC - Verde Esmeralda) -->
        <g class="svg-subnode" id="${p}sub-3-skc-info" data-sub="sub-3-2" transform="translate(8, 40)">
          <rect width="54" height="28" rx="4" fill="#1e293b" stroke="#10b981" stroke-width="1.2"/>
          <text x="27" y="18" text-anchor="middle" fill="#6ee7b7" font-size="8" font-family="'JetBrains Mono'">Info SKC</text>
        </g>
        <line x1="64" y1="54" x2="74" y2="54" stroke="#10b981" stroke-width="1.5" marker-end="url(#${p}arr-emerald)"/>

        <g class="svg-subnode" id="${p}sub-3-2" data-sub="sub-3-2" transform="translate(76, 38)">
          <rect width="78" height="32" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="1.6"/>
          <text x="39" y="15" text-anchor="middle" fill="#ffffff" font-size="8.5" font-family="'Outfit'" font-weight="800">SKC</text>
          <text x="39" y="26" text-anchor="middle" fill="#a7f3d0" font-size="7.5" font-family="'Outfit'">Superviviente</text>
        </g>
        <line x1="156" y1="54" x2="168" y2="54" stroke="#10b981" stroke-width="1.5" marker-end="url(#${p}arr-emerald)"/>

        <g class="svg-subnode" id="${p}sub-3-val" data-sub="sub-3-2" transform="translate(170, 38)">
          <rect width="60" height="32" rx="5" fill="#0f172a" stroke="#10b981" stroke-width="1.4"/>
          <text x="30" y="20" text-anchor="middle" fill="#10b981" font-size="8" font-family="'Outfit'" font-weight="700">Validación</text>
        </g>
        <!-- Flecha desde Validación hacia el bloque OK -->
        <path d="M 232 54 L 248 70" fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#${p}arr-emerald)"/>

        <!-- RIEL 2: INDECISO (UKC - Púrpura) -->
        <g class="svg-subnode" id="${p}sub-3-ukc-info" data-sub="sub-3-3" transform="translate(8, 105)">
          <rect width="54" height="28" rx="4" fill="#1e293b" stroke="#c084fc" stroke-width="1.2"/>
          <text x="27" y="18" text-anchor="middle" fill="#e9d5ff" font-size="8" font-family="'JetBrains Mono'">Info UKC</text>
        </g>
        <line x1="64" y1="119" x2="74" y2="119" stroke="#c084fc" stroke-width="1.5" marker-end="url(#${p}arr-purple)"/>

        <g class="svg-subnode" id="${p}sub-3-3" data-sub="sub-3-3" transform="translate(76, 103)">
          <rect width="78" height="32" rx="6" fill="#581c87" stroke="#c084fc" stroke-width="1.6"/>
          <text x="39" y="15" text-anchor="middle" fill="#ffffff" font-size="8.5" font-family="'Outfit'" font-weight="800">UKC</text>
          <text x="39" y="26" text-anchor="middle" fill="#f3e8ff" font-size="7.5" font-family="'Outfit'">Indeciso (Plazo)</text>
        </g>

        <!-- Bifurcación desde UKC: hacia Evaluación Positiva (arriba) y Depuración (abajo) -->
        <path d="M 156 114 Q 164 96 170 96" fill="none" stroke="#10b981" stroke-width="1.5" marker-end="url(#${p}arr-emerald)"/>
        <g class="svg-subnode" id="${p}sub-3-eval-pos" data-sub="sub-3-3" transform="translate(172, 83)">
          <rect width="62" height="24" rx="4" fill="#0f172a" stroke="#10b981" stroke-width="1.2"/>
          <text x="31" y="16" text-anchor="middle" fill="#10b981" font-size="7.5" font-family="'Outfit'">Eval. positiva</text>
        </g>
        <!-- Flecha desde Eval. Positiva hacia OK -->
        <path d="M 236 95 L 248 95" fill="none" stroke="#10b981" stroke-width="1.8" marker-end="url(#${p}arr-emerald)"/>

        <path d="M 156 124 Q 164 138 170 138" fill="none" stroke="#c084fc" stroke-width="1.5" marker-end="url(#${p}arr-purple)"/>
        <g class="svg-subnode" id="${p}sub-3-depuracion" data-sub="sub-3-3" transform="translate(172, 126)">
          <rect width="62" height="24" rx="4" fill="#0f172a" stroke="#c084fc" stroke-width="1.2"/>
          <text x="31" y="16" text-anchor="middle" fill="#c084fc" font-size="7.5" font-family="'Outfit'">Depuración</text>
        </g>
        <!-- Lazo de depuración que retorna a la red con plazo -->
        <path d="M 203 152 L 203 166 L 115 166 L 115 137" fill="none" stroke="#c084fc" stroke-width="1.2" stroke-dasharray="2.5,2.5" marker-end="url(#${p}arr-purple)"/>

        <!-- RIEL 3: FALSADO (FKC - Rojo Carmesí) -->
        <g class="svg-subnode" id="${p}sub-3-fkc-info" data-sub="sub-3-4" transform="translate(8, 185)">
          <rect width="54" height="28" rx="4" fill="#1e293b" stroke="#ef4444" stroke-width="1.2"/>
          <text x="27" y="18" text-anchor="middle" fill="#fca5a5" font-size="8" font-family="'JetBrains Mono'">Info FKC</text>
        </g>
        <line x1="64" y1="199" x2="74" y2="199" stroke="#ef4444" stroke-width="1.5" marker-end="url(#${p}arr-red)"/>

        <g class="svg-subnode" id="${p}sub-3-4" data-sub="sub-3-4" transform="translate(76, 183)">
          <rect width="78" height="32" rx="6" fill="#7f1d1d" stroke="#ef4444" stroke-width="1.6"/>
          <text x="39" y="15" text-anchor="middle" fill="#ffffff" font-size="8.5" font-family="'Outfit'" font-weight="800">FKC</text>
          <text x="39" y="26" text-anchor="middle" fill="#fecaca" font-size="7.5" font-family="'Outfit'">Falsado (Lección)</text>
        </g>
        <line x1="156" y1="199" x2="168" y2="199" stroke="#ef4444" stroke-width="1.5" marker-end="url(#${p}arr-red)"/>

        <g class="svg-subnode" id="${p}sub-3-almacen-fkc" data-sub="sub-3-4" transform="translate(170, 183)">
          <rect width="70" height="32" rx="5" fill="#0f172a" stroke="#ef4444" stroke-width="1.4"/>
          <text x="35" y="15" text-anchor="middle" fill="#ef4444" font-size="7.5" font-family="'Outfit'" font-weight="700">Almacenamiento</text>
          <text x="35" y="25" text-anchor="middle" fill="#fca5a5" font-size="7" font-family="'Outfit'">(Evidencia DOKB)</text>
        </g>

        <!-- Flecha desde Almacenamiento FKC que desciende a la DOKB -->
        <path d="M 205 217 L 205 275 L 265 275" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#${p}arr-red)"/>

        <!-- Bloque OK de Consolidación (Extremo Derecho) -->
        <g class="svg-subnode" id="${p}sub-3-5" data-sub="sub-3-5" transform="translate(250, 68)">
          <rect width="26" height="52" rx="6" fill="#059669" stroke="#10b981" stroke-width="2" filter="url(#${p}glow-emerald)"/>
          <text x="13" y="32" text-anchor="middle" fill="#ffffff" font-family="'JetBrains Mono'" font-size="11" font-weight="900">OK</text>
        </g>

        <!-- Salida formal desde OK hacia Integración -->
        <path d="M 278 94 L 295 94" fill="none" stroke="#10b981" stroke-width="2.8" marker-end="url(#${p}arr-emerald)"/>
        <text x="265" y="142" text-anchor="middle" fill="#10b981" font-size="8" font-family="'JetBrains Mono'" font-weight="700">Validado ➔</text>
      </g>

      <!-- Conector entre Etapa 3 y Etapa 4 -->
      <line x1="865" y1="166" x2="880" y2="166" stroke="#10b981" stroke-width="3" marker-end="url(#${p}arr-emerald)"/>

      <!-- ===================================================================
           5. ETAPA 4: INTEGRACIÓN DEL CONOCIMIENTO (BUS COLECTOR VERTICAL REAL)
           Entrada desde OK ➔ Pila Vertical ➔ Colector Saliente a la Derecha ➔ DOKB
           =================================================================== -->
      <g class="svg-stage-container" id="${p}svg-stage-integracion" data-stage="integracion" transform="translate(880, 72)">
        <rect class="stage-outline" width="290" height="273" rx="12" fill="url(#${p}stageBgGrad)" stroke="rgba(245, 158, 11, 0.35)" stroke-width="1.5"/>
        <rect x="0" y="0" width="290" height="28" rx="12" fill="rgba(245, 158, 11, 0.15)"/>
        <text x="12" y="19" fill="#f59e0b" font-family="'Outfit', sans-serif" font-weight="700" font-size="11.5">4. INTEGRACIÓN DEL CONOCIMIENTO</text>
        <text x="278" y="19" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8.5">COK ➔ DOKB</text>

        <!-- Línea distribuidora de entrada desde OK a los 4 procesos -->
        <path d="M 0 94 L 18 94 L 18 56 L 30 56" fill="none" stroke="#10b981" stroke-width="1.8" marker-end="url(#${p}arr-emerald)"/>
        <path d="M 18 94 L 30 102" fill="none" stroke="#10b981" stroke-width="1.8" marker-end="url(#${p}arr-emerald)"/>
        <path d="M 18 94 L 18 148 L 30 148" fill="none" stroke="#10b981" stroke-width="1.8" marker-end="url(#${p}arr-emerald)"/>
        <path d="M 18 148 L 18 194 L 30 194" fill="none" stroke="#10b981" stroke-width="1.8" marker-end="url(#${p}arr-emerald)"/>

        <!-- Pila de Procesos de Integración -->
        <g class="svg-subnode" id="${p}sub-4-1" data-sub="sub-4-1" transform="translate(32, 40)">
          <rect width="168" height="32" rx="5" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2"/>
          <text x="10" y="20" fill="#fef3c7" font-size="8.5" font-family="'Outfit'" font-weight="700">1. Organizar (Metadatos & Taxonomía)</text>
        </g>

        <g class="svg-subnode" id="${p}sub-4-2" data-sub="sub-4-2" transform="translate(32, 86)">
          <rect width="168" height="32" rx="5" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2"/>
          <text x="10" y="20" fill="#fef3c7" font-size="8.5" font-family="'Outfit'" font-weight="700">2. Almacenar (Bases Centralizadas)</text>
        </g>

        <g class="svg-subnode" id="${p}sub-4-3" data-sub="sub-4-3" transform="translate(32, 132)">
          <rect width="168" height="32" rx="5" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2"/>
          <text x="10" y="20" fill="#fef3c7" font-size="8.5" font-family="'Outfit'" font-weight="700">3. Transferencia (Mentorías & Talleres)</text>
        </g>

        <g class="svg-subnode" id="${p}sub-4-4" data-sub="sub-4-4" transform="translate(32, 178)">
          <rect width="168" height="32" rx="5" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2"/>
          <text x="10" y="20" fill="#fef3c7" font-size="8.5" font-family="'Outfit'" font-weight="700">4. Divulgación (Comunidades & Redes)</text>
        </g>

        <!-- Bus Colector de Salida a la Derecha de los 4 Bloques (según Pág. 9 del PDF) -->
        <line x1="202" y1="56" x2="225" y2="56" stroke="#f59e0b" stroke-width="1.6" marker-end="url(#${p}arr-gold)"/>
        <line x1="202" y1="102" x2="225" y2="102" stroke="#f59e0b" stroke-width="1.6" marker-end="url(#${p}arr-gold)"/>
        <line x1="202" y1="148" x2="225" y2="148" stroke="#f59e0b" stroke-width="1.6" marker-end="url(#${p}arr-gold)"/>
        <line x1="202" y1="194" x2="225" y2="194" stroke="#f59e0b" stroke-width="1.6" marker-end="url(#${p}arr-gold)"/>

        <!-- Línea colectora vertical común -->
        <path d="M 225 56 L 225 220 L 225 260" fill="none" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#${p}arr-gold)"/>
        <text x="215" y="240" text-anchor="end" fill="#fbbf24" font-size="8.5" font-family="'JetBrains Mono'" font-weight="700">COK hacia DOKB 🠗</text>
      </g>

      <!-- ===================================================================
           6. ZONA INFERIOR: STAKEHOLDERS, AMBIENTE Y DOKB
           =================================================================== -->
      
      <!-- STAKEHOLDERS (ENTRADAS EXTERNAS - Pág. 10 del PDF) -->
      <g class="svg-subnode" id="${p}svg-stakeholders" data-sub="sub-1-5" transform="translate(30, 360)">
        <rect width="250" height="85" rx="10" fill="#0b1120" stroke="#38bdf8" stroke-width="1.4" stroke-dasharray="4,4"/>
        <text x="15" y="18" fill="#38bdf8" font-family="'Outfit'" font-weight="700" font-size="10.5">Stakeholders (Entradas Externas CUN)</text>
        
        <rect x="12" y="28" width="68" height="42" rx="5" fill="#1e293b" stroke="#64748b" stroke-width="1.2"/>
        <text x="46" y="47" text-anchor="middle" fill="#ffffff" font-size="8.5" font-family="'Outfit'" font-weight="600">Estado</text>
        <text x="46" y="60" text-anchor="middle" fill="#94a3b8" font-size="7.5" font-family="'Outfit'">MEN / CNA</text>

        <rect x="88" y="28" width="74" height="42" rx="5" fill="#1e293b" stroke="#64748b" stroke-width="1.2"/>
        <text x="125" y="47" text-anchor="middle" fill="#ffffff" font-size="8.5" font-family="'Outfit'" font-weight="600">Sociedad</text>
        <text x="125" y="60" text-anchor="middle" fill="#94a3b8" font-size="7.5" font-family="'Outfit'">Estudiantes</text>

        <rect x="170" y="28" width="70" height="42" rx="5" fill="#1e293b" stroke="#64748b" stroke-width="1.2"/>
        <text x="205" y="47" text-anchor="middle" fill="#ffffff" font-size="8.5" font-family="'Outfit'" font-weight="600">Empresas</text>
        <text x="205" y="60" text-anchor="middle" fill="#94a3b8" font-size="7.5" font-family="'Outfit'">Aliadas</text>

        <!-- Flecha Ascendente Explícita hacia Diagnóstico -->
        <line x1="125" y1="0" x2="125" y2="-15" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#${p}arr-cyan)"/>
        <text x="135" y="-6" fill="#38bdf8" font-size="8" font-family="'JetBrains Mono'" font-weight="700">Entradas externas 🠕</text>
      </g>

      <!-- AMBIENTE DE PROCESAMIENTO ORGANIZACIONAL (Pág. 10 del PDF) -->
      <g class="svg-subnode" id="${p}svg-ambiente-procesamiento" transform="translate(295, 360)">
        <rect width="530" height="92" rx="10" fill="#0c1424" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.4"/>
        <text x="18" y="19" fill="#e2e8f0" font-family="'Outfit'" font-weight="700" font-size="11">Ambiente de Procesamiento Organizacional</text>
        
        <rect x="15" y="30" width="240" height="50" rx="6" fill="#152037" stroke="rgba(255, 255, 255, 0.1)"/>
        <text x="25" y="48" fill="#f8fafc" font-size="8.5" font-family="'Outfit'" font-weight="600">Comportamiento de Agentes CUN</text>
        <text x="25" y="62" fill="#94a3b8" font-size="7.5" font-family="'Outfit'">Docentes, investigadores y administrativos</text>
        <text x="25" y="73" fill="#64748b" font-size="7" font-family="'Outfit'">interactúan en procesos organizacionales</text>

        <rect x="270" y="30" width="245" height="50" rx="6" fill="#152037" stroke="rgba(255, 255, 255, 0.1)"/>
        <text x="280" y="48" fill="#fde68a" font-size="8.5" font-family="'Outfit'" font-weight="600">DOKB "Contenedores Activos"</text>
        <text x="280" y="62" fill="#cbd5e1" font-size="7.5" font-family="'Outfit'">Agentes (Indiv. y Grupos)</text>
        <text x="280" y="73" fill="#cbd5e1" font-size="7.5" font-family="'Outfit'">Artefactos (DOC, IT, Procedimientos)</text>

        <!-- Flecha de Entrada desde DOKB al Ambiente de Procesamiento -->
        <path d="M 550 55 L 515 55" fill="none" stroke="#f59e0b" stroke-width="2" marker-end="url(#${p}arr-gold)"/>

        <!-- Flecha de Detección de Problemas hacia Diagnóstico -->
        <path d="M 0 55 C -15 55, -20 20, -15 -12" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4" marker-end="url(#${p}arr-red)"/>
        <text x="-20" y="30" text-anchor="end" fill="#f87171" font-size="7.5" font-family="'Outfit'" font-weight="600">Retroalimentación (detección problemas) ➔</text>
      </g>

      <!-- DOKB (BASE DE CONOCIMIENTO DISTRIBUIDA) -->
      <g class="svg-dokb-card" id="${p}svg-dokb-node" data-sub="dokb" transform="translate(845, 350)">
        <rect width="325" height="135" rx="12" fill="url(#${p}dokbCardGrad)" stroke="#f59e0b" stroke-width="2" filter="url(#${p}glow-gold)"/>
        <rect x="15" y="12" width="60" height="20" rx="4" fill="#f59e0b"/>
        <text x="45" y="26" text-anchor="middle" fill="#070b14" font-family="'JetBrains Mono'" font-weight="900" font-size="10">DOKB</text>
        <text x="85" y="26" fill="#ffffff" font-family="'Outfit'" font-weight="800" font-size="11.5">Base Distribuida CUN</text>
        
        <text x="18" y="47" fill="#fde68a" font-size="8.5" font-family="'Outfit'" font-weight="600">Conocimiento Objetivo y Subjetivo Institucional</text>
        
        <!-- Bloques de Contenedores en DOKB -->
        <g transform="translate(14, 56)">
          <rect width="90" height="30" rx="4" fill="#3b2403" stroke="#f59e0b" stroke-width="1.2"/>
          <text x="45" y="15" text-anchor="middle" fill="#ffffff" font-size="7.5" font-family="'Outfit'" font-weight="600">Manuales &</text>
          <text x="45" y="25" text-anchor="middle" fill="#fde68a" font-size="7" font-family="'Outfit'">Tecnología</text>

          <rect x="98" y="0" width="94" height="30" rx="4" fill="#3b2403" stroke="#f59e0b" stroke-width="1.2"/>
          <text x="145" y="15" text-anchor="middle" fill="#ffffff" font-size="7.5" font-family="'Outfit'" font-weight="600">Bases de Datos</text>
          <text x="145" y="25" text-anchor="middle" fill="#fde68a" font-size="7" font-family="'Outfit'">Centralizadas</text>

          <rect x="200" y="0" width="94" height="30" rx="4" fill="#4c0519" stroke="#ef4444" stroke-width="1.4"/>
          <text x="247" y="15" text-anchor="middle" fill="#ffffff" font-size="7.5" font-family="'Outfit'" font-weight="700">Lecciones FKC</text>
          <text x="247" y="25" text-anchor="middle" fill="#fca5a5" font-size="7" font-family="'Outfit'">(Falsados)</text>
        </g>

        <text x="18" y="114" fill="#94a3b8" font-size="8" font-family="'Outfit'">Elimina la vulnerabilidad por rotación docente o de expertos.</text>
      </g>

      <!-- Flecha desde Integración (COK) entrando por arriba a la DOKB -->
      <path d="M 1105 345 L 1105 350" fill="none" stroke="#f59e0b" stroke-width="3" marker-end="url(#${p}arr-gold)"/>

      <!-- ===================================================================
           7. RETROALIMENTACIÓN EXPERIENCIAL SISTÉMICA (Lazo de Retorno DOKB ➔ GAP)
           =================================================================== -->
      <path id="${p}experientialReturnPath" d="M 845 470 C 600 520, 240 520, 85 345" fill="none" stroke="#f59e0b" stroke-width="2.6" stroke-dasharray="6,6" marker-end="url(#${p}arr-gold)"/>
      <path id="${p}experientialFlowAnim" d="M 845 470 C 600 520, 240 520, 85 345" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-dasharray="6,12" opacity="0.8">
        <animate attributeName="stroke-dashoffset" values="36;0" dur="1.3s" repeatCount="indefinite" />
      </path>

      <!-- Cartela protectora para la leyenda de retroalimentación (para no tapar la línea) -->
      <g transform="translate(470, 480)">
        <rect x="-240" y="-12" width="480" height="22" rx="4" fill="rgba(10, 16, 30, 0.85)" stroke="rgba(245, 158, 11, 0.3)" stroke-width="1"/>
        <text y="3" text-anchor="middle" fill="#f59e0b" font-family="'Outfit'" font-weight="700" font-size="10" letter-spacing="0.5">
          ⮜ RETROALIMENTACIÓN EXPERIENCIAL SISTÉMICA (La memoria en DOKB nutre continuamente el Diagnóstico)
        </text>
      </g>

      <!-- ===================================================================
           8. EJE TRANSVERSAL INFERIOR: EVALUACIÓN CONSTANTE & ISO 30401
           =================================================================== -->
      <g class="svg-transversal-bar" id="${p}svg-bar-evaluacion" transform="translate(30, 535)">
        <rect width="1140" height="48" rx="8" fill="url(#${p}transversalGradBottom)" stroke="rgba(245, 158, 11, 0.4)" stroke-width="1.2"/>
        <text x="25" y="23" fill="#fde68a" font-family="'Outfit', sans-serif" font-weight="800" font-size="10.5" letter-spacing="1">SEGUNDO EJE TRANSVERSAL · MEJORA CONTINUA</text>
        <text x="25" y="38" fill="#e2e8f0" font-family="'Outfit', sans-serif" font-weight="700" font-size="12">LA EVALUACIÓN ES CONSTANTE, NO UNA ETAPA FINAL (ISO 30401:2018 · ISO 9001:2015 · Tablero de Mando)</text>
        <text x="1115" y="29" text-anchor="end" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="600">Ver Matriz de Indicadores ➔</text>
      </g>

      <!-- ===================================================================
           9. CÁPSULA DE CONOCIMIENTO MÓVIL Y MUTANTE (SOLO EN SIMULACIÓN)
           =================================================================== -->
      <g id="${p}knowledgeCapsuleGroup" transform="translate(60, 155)" style="transition: transform 0.8s cubic-bezier(0.2, 0.9, 0.3, 1.2);">
        <g id="${p}capsuleShapeRenderer">
          <polygon points="0,-16 16,0 0,16 -16,0" fill="#f59e0b" stroke="#ffffff" stroke-width="2" filter="url(#${p}glow-cyan)"/>
          <text y="4" text-anchor="middle" fill="#070b14" font-size="8.5" font-weight="900" font-family="'JetBrains Mono'">GAP</text>
        </g>
      </g>

      <!-- Pulso de retorno experiencial activo -->
      <circle id="${p}retroPulseCircle" cx="85" cy="345" r="9" fill="#fbbf24" filter="url(#${p}glow-gold)" opacity="0"/>
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
