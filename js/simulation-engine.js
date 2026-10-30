/**
 * SIMULATION & ARCHITECTURE ENGINE - CUN MODELO DE GESTIÓN DEL CONOCIMIENTO
 * Renderiza el mapa arquitectónico completo con todos sus recuadros, flujos internos,
 * conectores, retroalimentaciones y anima el tránsito de reclamos con mutación visual.
 */

class KnowledgeSimulationEngine {
  constructor(svgId, liveCardId, isSimulationMode = false) {
    this.svgId = svgId;
    this.svg = document.getElementById(svgId);
    this.liveCard = document.getElementById(liveCardId);
    this.isSimulationMode = isSimulationMode;
    this.pfx = svgId + "-"; // Prefijo único para evitar colisiones de ID entre SVGs

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

    this.svg.innerHTML = `
      <defs>
        <!-- Filtros Glow Neón -->
        <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <!-- Marcadores de Flechas SVG -->
        <marker id="arr-cyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
        </marker>
        <marker id="arr-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
        </marker>
        <marker id="arr-gold" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
        </marker>
        <marker id="arr-emerald" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
        </marker>
        <marker id="arr-purple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#c084fc" />
        </marker>
        <marker id="arr-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
        </marker>
        <marker id="arr-gray" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
        </marker>

        <!-- Gradientes de Fondo -->
        <linearGradient id="transversalGradTop" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.8"/>
          <stop offset="50%" stop-color="#0284c7" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="#1e3a8a" stop-opacity="0.8"/>
        </linearGradient>

        <linearGradient id="transversalGradBottom" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0f172a" stop-opacity="0.9"/>
          <stop offset="50%" stop-color="#1e293b" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#0f172a" stop-opacity="0.9"/>
        </linearGradient>

        <linearGradient id="stageBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="#090d16" stop-opacity="0.9"/>
        </linearGradient>

        <linearGradient id="dokbCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2d1b02" stop-opacity="0.9"/>
          <stop offset="60%" stop-color="#181105" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#2d1b02" stop-opacity="0.9"/>
        </linearGradient>
      </defs>

      <!-- ===================================================================
           1. EJE TRANSVERSAL SUPERIOR: COMUNICACIÓN ORGANIZACIONAL
           =================================================================== -->
      <g class="svg-transversal-bar" id="svg-bar-comunicacion" transform="translate(30, 15)">
        <rect width="1140" height="48" rx="8" fill="url(#transversalGradTop)" stroke="#38bdf8" stroke-width="1.2" opacity="0.95"/>
        <text x="25" y="24" fill="#bae6fd" font-family="'Outfit', sans-serif" font-weight="800" font-size="11" letter-spacing="1">EJE TRANSVERSAL</text>
        <text x="25" y="39" fill="#ffffff" font-family="'Outfit', sans-serif" font-weight="700" font-size="13">COMUNICACIÓN ORGANIZACIONAL (Cultura · Liderazgo · Branding · Endomarketing · Indicadores)</text>
        <text x="1115" y="30" text-anchor="end" fill="#fde68a" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="600">TIC · IA · Redes de Aprendizaje ➔</text>
        <!-- Líneas conectoras que bajan hacia las 4 etapas -->
        <line x1="125" y1="48" x2="125" y2="65" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#arr-cyan)"/>
        <line x1="400" y1="48" x2="400" y2="65" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#arr-cyan)"/>
        <line x1="685" y1="48" x2="685" y2="65" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#arr-cyan)"/>
        <line x1="975" y1="48" x2="975" y2="65" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#arr-cyan)"/>
      </g>

      <!-- ===================================================================
           2. ETAPA 1: DIAGNÓSTICO (GAP)
           =================================================================== -->
      <g class="svg-stage-container" id="svg-stage-diagnostico" data-stage="diagnostico" transform="translate(30, 75)">
        <rect class="stage-outline" width="245" height="255" rx="12" fill="url(#stageBgGrad)" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1.5"/>
        <rect x="0" y="0" width="245" height="28" rx="12" fill="rgba(56, 189, 248, 0.15)"/>
        <text x="12" y="19" fill="#38bdf8" font-family="'Outfit', sans-serif" font-weight="700" font-size="11.5">1. DIAGNÓSTICO (GAP)</text>
        <text x="233" y="19" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="9">KC - Reclamo</text>

        <!-- Columna Izquierda: Fuentes de Brecha -->
        <g class="svg-subnode" id="sub-1-1" data-sub="sub-1-1" transform="translate(10, 36)">
          <rect width="100" height="36" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
          <text x="8" y="15" fill="#f8fafc" font-size="9.5" font-family="'Outfit'" font-weight="600">Brechas de</text>
          <text x="8" y="27" fill="#38bdf8" font-size="9" font-family="'Outfit'">conocimiento (GAP)</text>
        </g>

        <g class="svg-subnode" id="sub-1-2" data-sub="sub-1-2" transform="translate(10, 80)">
          <rect width="100" height="36" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
          <text x="8" y="15" fill="#f8fafc" font-size="9.5" font-family="'Outfit'" font-weight="600">Conocimiento</text>
          <text x="8" y="27" fill="#94a3b8" font-size="9" font-family="'Outfit'">disponible</text>
        </g>

        <g class="svg-subnode" id="sub-1-3" data-sub="sub-1-3" transform="translate(10, 124)">
          <rect width="100" height="38" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
          <text x="8" y="15" fill="#f8fafc" font-size="9" font-family="'Outfit'" font-weight="600">Desafíos CUN</text>
          <text x="8" y="27" fill="#94a3b8" font-size="8.5" font-family="'Outfit'">(necesidades)</text>
        </g>

        <!-- Conectores hacia Columna Central -->
        <path d="M 110 54 L 126 54 L 126 85 L 134 85" fill="none" stroke="#64748b" stroke-width="1.2" marker-end="url(#arr-gray)"/>
        <path d="M 110 98 L 134 98" fill="none" stroke="#64748b" stroke-width="1.2" marker-end="url(#arr-gray)"/>
        <path d="M 110 143 L 126 143 L 126 150 L 134 150" fill="none" stroke="#64748b" stroke-width="1.2" marker-end="url(#arr-gray)"/>

        <!-- Columna Central: Análisis & Retroalimentación -->
        <g class="svg-subnode" id="sub-1-4" data-sub="sub-1-4" transform="translate(136, 68)">
          <rect width="98" height="44" rx="6" fill="#0f172a" stroke="#0284c7" stroke-width="1.2"/>
          <text x="8" y="16" fill="#f8fafc" font-size="8.5" font-family="'Outfit'" font-weight="600">Análisis indicadores</text>
          <text x="8" y="28" fill="#38bdf8" font-size="8.5" font-family="'Outfit'">de desempeño</text>
        </g>

        <g class="svg-subnode" id="sub-1-5" data-sub="sub-1-5" transform="translate(136, 124)">
          <rect width="98" height="44" rx="6" fill="#0f172a" stroke="#0284c7" stroke-width="1.2"/>
          <text x="8" y="16" fill="#f8fafc" font-size="8.5" font-family="'Outfit'" font-weight="600">Retroalimentación</text>
          <text x="8" y="28" fill="#38bdf8" font-size="8.5" font-family="'Outfit'">de Stakeholders</text>
        </g>

        <!-- Flecha Bidireccional entre Análisis y Retroalimentación -->
        <path d="M 185 112 L 185 124" fill="none" stroke="#38bdf8" stroke-width="1.2"/>

        <!-- Salida hacia el nodo KC -->
        <g class="svg-subnode" id="sub-1-6" data-sub="sub-1-6" transform="translate(160, 185)">
          <rect width="52" height="26" rx="6" fill="#0369a1" stroke="#38bdf8" stroke-width="1.5" filter="url(#glow-cyan)"/>
          <text x="26" y="17" text-anchor="middle" fill="#ffffff" font-family="'JetBrains Mono'" font-size="11" font-weight="800">KC</text>
        </g>

        <path d="M 185 168 L 185 185" fill="none" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arr-cyan)"/>
        
        <!-- Flecha de salida hacia Etapa 2 -->
        <path d="M 212 198 L 260 198" fill="none" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-cyan)"/>
        <text x="235" y="222" text-anchor="middle" fill="#38bdf8" font-size="8" font-family="'JetBrains Mono'">Reclamo KC ➔</text>
      </g>

      <!-- Conector Etapa 1 -> Etapa 2 -->
      <line x1="275" y1="185" x2="295" y2="185" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arr-cyan)"/>

      <!-- ===================================================================
           3. ETAPA 2: PRODUCCIÓN DEL CONOCIMIENTO (SECI & BLOOM)
           =================================================================== -->
      <g class="svg-stage-container" id="svg-stage-produccion" data-stage="produccion" transform="translate(295, 75)">
        <rect class="stage-outline" width="260" height="255" rx="12" fill="url(#stageBgGrad)" stroke="rgba(14, 165, 233, 0.3)" stroke-width="1.5"/>
        <rect x="0" y="0" width="260" height="28" rx="12" fill="rgba(14, 165, 233, 0.15)"/>
        <text x="12" y="19" fill="#38bdf8" font-family="'Outfit', sans-serif" font-weight="700" font-size="11.5">2. PRODUCCIÓN DEL CONOCIMIENTO</text>
        <text x="248" y="19" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="9">CKC - Redes</text>

        <!-- Subnodo 2.1: Aprendizaje en Redes -->
        <g class="svg-subnode" id="sub-2-1" data-sub="sub-2-1" transform="translate(10, 36)">
          <rect width="125" height="42" rx="6" fill="#1e293b" stroke="#0284c7" stroke-width="1"/>
          <text x="8" y="15" fill="#f8fafc" font-size="8.5" font-family="'Outfit'" font-weight="600">Aprendizaje individual</text>
          <text x="8" y="27" fill="#38bdf8" font-size="8.5" font-family="'Outfit'">y grupal (redes)</text>
        </g>

        <!-- Subnodo 2.2: Adquisición de Información -->
        <g class="svg-subnode" id="sub-2-2" data-sub="sub-2-2" transform="translate(10, 92)">
          <rect width="125" height="38" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
          <text x="8" y="15" fill="#f8fafc" font-size="8.5" font-family="'Outfit'" font-weight="600">Adquisición de</text>
          <text x="8" y="27" fill="#94a3b8" font-size="8.5" font-family="'Outfit'">información técnica</text>
        </g>

        <!-- Subnodo 2.3: Formulación de Reclamos -->
        <g class="svg-subnode" id="sub-2-3" data-sub="sub-2-3" transform="translate(10, 146)">
          <rect width="125" height="42" rx="6" fill="#1e293b" stroke="#0284c7" stroke-width="1"/>
          <text x="8" y="15" fill="#f8fafc" font-size="8.5" font-family="'Outfit'" font-weight="600">Formulación de</text>
          <text x="8" y="27" fill="#38bdf8" font-size="8.5" font-family="'Outfit'">reclamos (Bloom)</text>
        </g>

        <!-- Conexión hacia CKC -->
        <path d="M 135 57 L 152 57 L 152 110 L 160 110" fill="none" stroke="#38bdf8" stroke-width="1.2" marker-end="url(#arr-cyan)"/>
        <path d="M 135 110 L 160 110" fill="none" stroke="#38bdf8" stroke-width="1.2" marker-end="url(#arr-cyan)"/>
        <path d="M 135 167 L 152 167 L 152 110 L 160 110" fill="none" stroke="#38bdf8" stroke-width="1.2" marker-end="url(#arr-cyan)"/>

        <!-- Subnodo 2.4: El CKC Codificado -->
        <g class="svg-subnode" id="sub-2-4" data-sub="sub-2-4" transform="translate(165, 96)">
          <polygon points="0,-14 16,-8 16,8 0,14 -16,8 -16,-8" fill="#0891b2" stroke="#38bdf8" stroke-width="2" filter="url(#glow-cyan)" transform="translate(24, 15)"/>
          <text x="24" y="19" text-anchor="middle" fill="#ffffff" font-family="'JetBrains Mono'" font-size="8.5" font-weight="800">CKC</text>
        </g>

        <!-- Flecha CKC -> Evaluación Interna -->
        <path d="M 189 126 L 189 150" fill="none" stroke="#38bdf8" stroke-width="1.2" marker-end="url(#arr-cyan)"/>

        <!-- Subnodo 2.5: Evaluación de Reclamos -->
        <g class="svg-subnode" id="sub-2-5" data-sub="sub-2-5" transform="translate(142, 150)">
          <rect width="105" height="42" rx="6" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.2"/>
          <text x="8" y="15" fill="#f8fafc" font-size="8.5" font-family="'Outfit'" font-weight="600">Evaluación interna</text>
          <text x="8" y="27" fill="#38bdf8" font-size="8.5" font-family="'Outfit'">en la red de pares</text>
        </g>

        <!-- Lazo de Retroalimentación Interna desde Evaluación a Aprendizaje -->
        <path d="M 142 171 L 130 171 L 130 198 L 72 198 L 72 188" fill="none" stroke="rgba(56, 189, 248, 0.6)" stroke-width="1.2" stroke-dasharray="3,3" marker-end="url(#arr-cyan)"/>

        <!-- Salida hacia Etapa 3 -->
        <path d="M 212 110 L 255 110" fill="none" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-cyan)"/>
        <text x="235" y="132" text-anchor="middle" fill="#38bdf8" font-size="8" font-family="'JetBrains Mono'">CKC ➔</text>
      </g>

      <!-- Conector Etapa 2 -> Etapa 3 -->
      <line x1="555" y1="185" x2="575" y2="185" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arr-cyan)"/>

      <!-- ===================================================================
           4. ETAPA 3: FILTRACIÓN DEL CONOCIMIENTO (MCELROY)
           =================================================================== -->
      <g class="svg-stage-container" id="svg-stage-filtracion" data-stage="filtracion" transform="translate(575, 75)">
        <rect class="stage-outline" width="280" height="255" rx="12" fill="url(#stageBgGrad)" stroke="rgba(168, 85, 247, 0.35)" stroke-width="1.5"/>
        <rect x="0" y="0" width="280" height="28" rx="12" fill="rgba(168, 85, 247, 0.15)"/>
        <text x="12" y="19" fill="#c084fc" font-family="'Outfit', sans-serif" font-weight="700" font-size="11.5">3. FILTRACIÓN (KCE · McElroy)</text>
        <text x="268" y="19" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="9">SKC/UKC/FKC</text>

        <!-- FILA 1: SUPERVIVIENTE (SKC) -->
        <g class="svg-subnode" id="sub-3-skc-info" data-sub="sub-3-2" transform="translate(10, 36)">
          <rect width="58" height="26" rx="4" fill="#1e293b" stroke="#10b981" stroke-width="1"/>
          <text x="29" y="16" text-anchor="middle" fill="#6ee7b7" font-size="8" font-family="'JetBrains Mono'">Info SKC</text>
        </g>
        <path d="M 68 49 L 80 49" fill="none" stroke="#10b981" stroke-width="1.2" marker-end="url(#arr-emerald)"/>
        <g class="svg-subnode" id="sub-3-2" data-sub="sub-3-2" transform="translate(82, 34)">
          <rect width="78" height="30" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
          <text x="39" y="14" text-anchor="middle" fill="#ffffff" font-size="8.5" font-family="'Outfit'" font-weight="700">SKC</text>
          <text x="39" y="24" text-anchor="middle" fill="#a7f3d0" font-size="7.5" font-family="'Outfit'">Superviviente</text>
        </g>
        <path d="M 160 49 L 174 49" fill="none" stroke="#10b981" stroke-width="1.2" marker-end="url(#arr-emerald)"/>
        <g class="svg-subnode" id="sub-3-val" data-sub="sub-3-2" transform="translate(176, 34)">
          <rect width="56" height="30" rx="5" fill="#0f172a" stroke="#10b981" stroke-width="1.2"/>
          <text x="28" y="19" text-anchor="middle" fill="#10b981" font-size="8" font-family="'Outfit'" font-weight="700">Validación</text>
        </g>

        <!-- FILA 2: INDECISO (UKC) -->
        <g class="svg-subnode" id="sub-3-ukc-info" data-sub="sub-3-3" transform="translate(10, 96)">
          <rect width="58" height="26" rx="4" fill="#1e293b" stroke="#c084fc" stroke-width="1"/>
          <text x="29" y="16" text-anchor="middle" fill="#e9d5ff" font-size="8" font-family="'JetBrains Mono'">Info UKC</text>
        </g>
        <path d="M 68 109 L 80 109" fill="none" stroke="#c084fc" stroke-width="1.2" marker-end="url(#arr-purple)"/>
        <g class="svg-subnode" id="sub-3-3" data-sub="sub-3-3" transform="translate(82, 94)">
          <rect width="78" height="30" rx="6" fill="#581c87" stroke="#c084fc" stroke-width="1.5"/>
          <text x="39" y="14" text-anchor="middle" fill="#ffffff" font-size="8.5" font-family="'Outfit'" font-weight="700">UKC</text>
          <text x="39" y="24" text-anchor="middle" fill="#f3e8ff" font-size="7.5" font-family="'Outfit'">Indeciso (Plazo)</text>
        </g>
        <path d="M 160 102 Q 170 85 176 85" fill="none" stroke="#10b981" stroke-width="1" marker-end="url(#arr-emerald)"/>
        <g class="svg-subnode" id="sub-3-eval-pos" data-sub="sub-3-3" transform="translate(176, 74)">
          <rect width="60" height="22" rx="4" fill="#0f172a" stroke="#10b981" stroke-width="1"/>
          <text x="30" y="14" text-anchor="middle" fill="#10b981" font-size="7" font-family="'Outfit'">Eval. positiva</text>
        </g>
        <path d="M 160 116 Q 170 128 176 128" fill="none" stroke="#c084fc" stroke-width="1" marker-end="url(#arr-purple)"/>
        <g class="svg-subnode" id="sub-3-depuracion" data-sub="sub-3-3" transform="translate(176, 117)">
          <rect width="60" height="22" rx="4" fill="#0f172a" stroke="#c084fc" stroke-width="1"/>
          <text x="30" y="14" text-anchor="middle" fill="#c084fc" font-size="7" font-family="'Outfit'">Depuración</text>
        </g>

        <!-- FILA 3: FALSADO (FKC) -->
        <g class="svg-subnode" id="sub-3-fkc-info" data-sub="sub-3-4" transform="translate(10, 156)">
          <rect width="58" height="26" rx="4" fill="#1e293b" stroke="#ef4444" stroke-width="1"/>
          <text x="29" y="16" text-anchor="middle" fill="#fca5a5" font-size="8" font-family="'JetBrains Mono'">Info FKC</text>
        </g>
        <path d="M 68 169 L 80 169" fill="none" stroke="#ef4444" stroke-width="1.2" marker-end="url(#arr-red)"/>
        <g class="svg-subnode" id="sub-3-4" data-sub="sub-3-4" transform="translate(82, 154)">
          <rect width="78" height="30" rx="6" fill="#7f1d1d" stroke="#ef4444" stroke-width="1.5"/>
          <text x="39" y="14" text-anchor="middle" fill="#ffffff" font-size="8.5" font-family="'Outfit'" font-weight="700">FKC</text>
          <text x="39" y="24" text-anchor="middle" fill="#fecaca" font-size="7.5" font-family="'Outfit'">Falsado (Lección)</text>
        </g>
        <path d="M 160 169 L 174 169" fill="none" stroke="#ef4444" stroke-width="1.2" marker-end="url(#arr-red)"/>
        <g class="svg-subnode" id="sub-3-almacen-fkc" data-sub="sub-3-4" transform="translate(176, 154)">
          <rect width="65" height="30" rx="5" fill="#0f172a" stroke="#ef4444" stroke-width="1.2"/>
          <text x="32" y="14" text-anchor="middle" fill="#ef4444" font-size="7.5" font-family="'Outfit'">Almacén de</text>
          <text x="32" y="24" text-anchor="middle" fill="#fca5a5" font-size="7.5" font-family="'Outfit'">lección (DOKB)</text>
        </g>

        <!-- Nodo de Consolidación OK (Salida formal de SKC e UKC aprobado) -->
        <g class="svg-subnode" id="sub-3-5" data-sub="sub-3-5" transform="translate(244, 49)">
          <rect width="28" height="46" rx="5" fill="#059669" stroke="#10b981" stroke-width="1.5" filter="url(#glow-emerald)"/>
          <text x="14" y="27" text-anchor="middle" fill="#ffffff" font-family="'JetBrains Mono'" font-size="11" font-weight="800">OK</text>
        </g>
        <path d="M 232 49 L 244 65" fill="none" stroke="#10b981" stroke-width="1.2"/>
        <path d="M 236 85 L 244 80" fill="none" stroke="#10b981" stroke-width="1.2"/>

        <!-- Salida desde OK hacia Integración -->
        <path d="M 272 72 L 295 72" fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#arr-emerald)"/>
        <text x="260" y="112" text-anchor="middle" fill="#10b981" font-size="8" font-family="'JetBrains Mono'">Validado ➔</text>
      </g>

      <!-- Conector Etapa 3 -> Etapa 4 -->
      <line x1="855" y1="147" x2="875" y2="147" stroke="#10b981" stroke-width="2.5" marker-end="url(#arr-emerald)"/>

      <!-- ===================================================================
           5. ETAPA 4: INTEGRACIÓN DEL CONOCIMIENTO (COK)
           =================================================================== -->
      <g class="svg-stage-container" id="svg-stage-integracion" data-stage="integracion" transform="translate(875, 75)">
        <rect class="stage-outline" width="295" height="255" rx="12" fill="url(#stageBgGrad)" stroke="rgba(245, 158, 11, 0.35)" stroke-width="1.5"/>
        <rect x="0" y="0" width="295" height="28" rx="12" fill="rgba(245, 158, 11, 0.15)"/>
        <text x="12" y="19" fill="#f59e0b" font-family="'Outfit', sans-serif" font-weight="700" font-size="11.5">4. INTEGRACIÓN DEL CONOCIMIENTO</text>
        <text x="283" y="19" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="9">COK ➔ DOKB</text>

        <!-- Pila de Procesos de Integración (Vertical Conectada) -->
        <g class="svg-subnode" id="sub-4-1" data-sub="sub-4-1" transform="translate(50, 36)">
          <rect width="180" height="28" rx="5" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2"/>
          <text x="12" y="18" fill="#fef3c7" font-size="9" font-family="'Outfit'" font-weight="700">1. Organizar (Metadatos & Taxonomía)</text>
        </g>
        <line x1="140" y1="64" x2="140" y2="76" stroke="#f59e0b" stroke-width="1.5" marker-end="url(#arr-gold)"/>

        <g class="svg-subnode" id="sub-4-2" data-sub="sub-4-2" transform="translate(50, 78)">
          <rect width="180" height="28" rx="5" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2"/>
          <text x="12" y="18" fill="#fef3c7" font-size="9" font-family="'Outfit'" font-weight="700">2. Almacenar (Bases Centralizadas)</text>
        </g>
        <line x1="140" y1="106" x2="140" y2="118" stroke="#f59e0b" stroke-width="1.5" marker-end="url(#arr-gold)"/>

        <g class="svg-subnode" id="sub-4-3" data-sub="sub-4-3" transform="translate(50, 120)">
          <rect width="180" height="28" rx="5" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2"/>
          <text x="12" y="18" fill="#fef3c7" font-size="9" font-family="'Outfit'" font-weight="700">3. Transferencia (Mentorías & Talleres)</text>
        </g>
        <line x1="140" y1="148" x2="140" y2="160" stroke="#f59e0b" stroke-width="1.5" marker-end="url(#arr-gold)"/>

        <g class="svg-subnode" id="sub-4-4" data-sub="sub-4-4" transform="translate(50, 162)">
          <rect width="180" height="28" rx="5" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2"/>
          <text x="12" y="18" fill="#fef3c7" font-size="9" font-family="'Outfit'" font-weight="700">4. Divulgación (Comunidades & Transmedia)</text>
        </g>

        <!-- Flecha de salida formal directa hacia la DOKB -->
        <path d="M 140 190 L 140 235 L 140 260" fill="none" stroke="#f59e0b" stroke-width="3" marker-end="url(#arr-gold)"/>
        <text x="145" y="222" fill="#fbbf24" font-size="8.5" font-family="'JetBrains Mono'" font-weight="700">COK hacia DOKB 🠗</text>
      </g>

      <!-- ===================================================================
           6. ZONA INFERIOR: STAKEHOLDERS, AMBIENTE Y DOKB
           =================================================================== -->
      
      <!-- STAKEHOLDERS (ENTRADAS EXTERNAS) -->
      <g class="svg-subnode" id="svg-stakeholders" data-sub="sub-1-5" transform="translate(30, 345)">
        <rect width="245" height="85" rx="10" fill="#0b1120" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="4,4"/>
        <text x="15" y="18" fill="#38bdf8" font-family="'Outfit'" font-weight="700" font-size="10.5">Stakeholders (Entradas Externas CUN)</text>
        
        <rect x="12" y="30" width="65" height="38" rx="5" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
        <text x="44" y="47" text-anchor="middle" fill="#ffffff" font-size="8" font-family="'Outfit'" font-weight="600">Estado</text>
        <text x="44" y="58" text-anchor="middle" fill="#94a3b8" font-size="7" font-family="'Outfit'">MEN / CNA</text>

        <rect x="86" y="30" width="70" height="38" rx="5" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
        <text x="121" y="47" text-anchor="middle" fill="#ffffff" font-size="8" font-family="'Outfit'" font-weight="600">Sociedad</text>
        <text x="121" y="58" text-anchor="middle" fill="#94a3b8" font-size="7" font-family="'Outfit'">Estudiantes</text>

        <rect x="165" y="30" width="68" height="38" rx="5" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
        <text x="199" y="47" text-anchor="middle" fill="#ffffff" font-size="8" font-family="'Outfit'" font-weight="600">Empresas</text>
        <text x="199" y="58" text-anchor="middle" fill="#94a3b8" font-size="7" font-family="'Outfit'">Aliadas</text>

        <!-- Flecha hacia Diagnóstico -->
        <path d="M 125 0 L 125 -15" fill="none" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-cyan)"/>
      </g>

      <!-- AMBIENTE DE PROCESAMIENTO ORGANIZACIONAL -->
      <g class="svg-subnode" id="svg-ambiente-procesamiento" transform="translate(295, 345)">
        <rect width="540" height="90" rx="10" fill="#0c1424" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1.2"/>
        <text x="20" y="20" fill="#e2e8f0" font-family="'Outfit'" font-weight="700" font-size="11">Ambiente de Procesamiento Organizacional</text>
        
        <rect x="15" y="32" width="245" height="46" rx="6" fill="#152037" stroke="rgba(255, 255, 255, 0.08)"/>
        <text x="25" y="50" fill="#f8fafc" font-size="8.5" font-family="'Outfit'" font-weight="600">Comportamiento de Agentes Institucionales</text>
        <text x="25" y="65" fill="#94a3b8" font-size="7.5" font-family="'Outfit'">Docentes, investigadores y administrativos interactúan</text>

        <rect x="275" y="32" width="245" height="46" rx="6" fill="#152037" stroke="rgba(255, 255, 255, 0.08)"/>
        <text x="285" y="50" fill="#fde68a" font-size="8.5" font-family="'Outfit'" font-weight="600">DOKB "Contenedores Activos"</text>
        <text x="285" y="65" fill="#cbd5e1" font-size="7.5" font-family="'Outfit'">Agentes (Indiv. y Grupos) · Artefactos (DOC, IT, SST)</text>

        <!-- Flecha de Detección de Problemas hacia Diagnóstico -->
        <path d="M 0 55 C -15 55, -20 20, -20 -15" fill="none" stroke="#f87171" stroke-width="1.5" stroke-dasharray="4,4" marker-end="url(#arr-red)"/>
        <text x="-20" y="70" text-anchor="end" fill="#f87171" font-size="7.5" font-family="'Outfit'">Detección de problemas</text>
      </g>

      <!-- DOKB (BASE DE CONOCIMIENTO DISTRIBUIDA) -->
      <g class="svg-dokb-card" id="svg-dokb-node" data-sub="dokb" transform="translate(855, 340)">
        <rect width="315" height="135" rx="12" fill="url(#dokbCardGrad)" stroke="#f59e0b" stroke-width="2" filter="url(#glow-gold)"/>
        <rect x="15" y="12" width="60" height="20" rx="4" fill="#f59e0b"/>
        <text x="45" y="26" text-anchor="middle" fill="#070b14" font-family="'JetBrains Mono'" font-weight="800" font-size="10">DOKB</text>
        <text x="85" y="26" fill="#ffffff" font-family="'Outfit'" font-weight="800" font-size="11.5">Base Distribuida CUN</text>
        
        <text x="18" y="48" fill="#fde68a" font-size="8.5" font-family="'Outfit'" font-weight="600">Conocimiento Objetivo y Subjetivo Institucional</text>
        
        <!-- Bloques de Contenedores en DOKB -->
        <g transform="translate(15, 56)">
          <rect width="85" height="28" rx="4" fill="#3b2403" stroke="#f59e0b" stroke-width="1"/>
          <text x="42" y="14" text-anchor="middle" fill="#ffffff" font-size="7.5" font-family="'Outfit'" font-weight="600">Manuales &</text>
          <text x="42" y="23" text-anchor="middle" fill="#fde68a" font-size="7" font-family="'Outfit'">Tecnología</text>

          <rect x="95" y="0" width="85" height="28" rx="4" fill="#3b2403" stroke="#f59e0b" stroke-width="1"/>
          <text x="137" y="14" text-anchor="middle" fill="#ffffff" font-size="7.5" font-family="'Outfit'" font-weight="600">Bases de Datos</text>
          <text x="137" y="23" text-anchor="middle" fill="#fde68a" font-size="7" font-family="'Outfit'">Centralizadas</text>

          <rect x="190" y="0" width="88" height="28" rx="4" fill="#4c0519" stroke="#ef4444" stroke-width="1"/>
          <text x="234" y="14" text-anchor="middle" fill="#ffffff" font-size="7.5" font-family="'Outfit'" font-weight="700">Lecciones FKC</text>
          <text x="234" y="23" text-anchor="middle" fill="#fca5a5" font-size="7" font-family="'Outfit'">(Falsados)</text>
        </g>

        <text x="18" y="112" fill="#94a3b8" font-size="8" font-family="'Outfit'">Elimina la pérdida de saberes por rotación o jubilación.</text>
      </g>

      <!-- ===================================================================
           7. RETROALIMENTACIÓN EXPERIENCIAL SISTÉMICA (Línea de Retorno)
           =================================================================== -->
      <path id="experientialReturnPath" d="M 855 450 C 620 515, 260 515, 95 340" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="6,6" marker-end="url(#arr-gold)"/>
      <path id="experientialFlowAnim" d="M 855 450 C 620 515, 260 515, 95 340" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-dasharray="6,12" opacity="0.8">
        <animate attributeName="stroke-dashoffset" values="36;0" dur="1.4s" repeatCount="indefinite" />
      </path>
      <text x="470" y="492" text-anchor="middle" fill="#f59e0b" font-family="'Outfit'" font-weight="700" font-size="10.5" letter-spacing="0.5">
        ⮜ RETROALIMENTACIÓN EXPERIENCIAL SISTÉMICA (La memoria en DOKB nutre continuamente el Diagnóstico)
      </text>

      <!-- ===================================================================
           8. EJE TRANSVERSAL INFERIOR: EVALUACIÓN CONSTANTE & ISO 30401
           =================================================================== -->
      <g class="svg-transversal-bar" id="svg-bar-evaluacion" transform="translate(30, 520)">
        <rect width="1140" height="48" rx="8" fill="url(#transversalGradBottom)" stroke="rgba(245, 158, 11, 0.4)" stroke-width="1.2"/>
        <text x="25" y="24" fill="#fde68a" font-family="'Outfit', sans-serif" font-weight="800" font-size="11" letter-spacing="1">SEGUNDO EJE TRANSVERSAL · MEJORA CONTINUA</text>
        <text x="25" y="39" fill="#e2e8f0" font-family="'Outfit', sans-serif" font-weight="700" font-size="12.5">LA EVALUACIÓN ES CONSTANTE, NO UNA ETAPA (ISO 30401:2018 · ISO 9001:2015 · Tablero de Mando)</text>
        <text x="1115" y="30" text-anchor="end" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="600">Ver Indicadores de Madurez ➔</text>
      </g>

      <!-- ===================================================================
           9. CÁPSULA DE CONOCIMIENTO MÓVIL Y MUTANTE (SOLO EN SIMULACIÓN)
           =================================================================== -->
      <g id="knowledgeCapsuleGroup" transform="translate(90, 155)" style="transition: transform 0.8s cubic-bezier(0.2, 0.9, 0.3, 1.2);">
        <!-- Forma inyectada dinámicamente -->
        <g id="capsuleShapeRenderer">
          <polygon points="0,-14 14,0 0,14 -14,0" fill="#f59e0b" stroke="#38bdf8" stroke-width="2.5" filter="url(#glow-cyan)"/>
          <text y="4" text-anchor="middle" fill="#070b14" font-size="8" font-weight="900" font-family="'JetBrains Mono'">GAP</text>
        </g>
      </g>

      <!-- Partícula de retorno experiencial activa -->
      <circle id="retroPulseCircle" cx="95" cy="340" r="8" fill="#fbbf24" filter="url(#glow-gold)" opacity="0"/>
    `;

    if (!this.isSimulationMode) {
      const capsule = this.svg.querySelector("#knowledgeCapsuleGroup");
      if (capsule) capsule.style.display = "none";
    }
  }

  bindSubnodeClicks() {
    // Al hacer clic en cualquier subnodo o tarjeta, notificar al drawer
    this.svg.querySelectorAll(".svg-subnode, .svg-stage-container, .svg-dokb-card, .svg-transversal-bar").forEach(elem => {
      elem.addEventListener("click", (e) => {
        e.stopPropagation();
        const stageId = elem.getAttribute("data-stage") || elem.id.replace("svg-stage-", "");
        const subId = elem.getAttribute("data-sub");

        window.dispatchEvent(new CustomEvent("cun:inspector:open", {
          detail: { stageId, subId, elementId: elem.id }
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

    // 1. Mover la cápsula física en el mapa
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
      const activeEl = this.svg.querySelector("#" + currentStep.subnodoId);
      if (activeEl) {
        const shape = activeEl.querySelector("rect, polygon");
        if (shape) shape.style.filter = "drop-shadow(0 0 10px rgba(56, 189, 248, 0.8))";
      }
    }

    // 4. Si es el paso de retroalimentación experiencial, activar pulso de retorno
    const retroPulse = this.svg.querySelector("#retroPulseCircle");
    if (retroPulse) {
      if (currentStep.etapa === "retroalimentacion") {
        retroPulse.setAttribute("opacity", "1");
      } else {
        retroPulse.setAttribute("opacity", "0");
      }
    }
  }

  moveCapsule(step) {
    const group = this.svg.querySelector("#knowledgeCapsuleGroup");
    const renderer = this.svg.querySelector("#capsuleShapeRenderer");
    if (!group || !renderer) return;

    // Animación de posición
    group.setAttribute("transform", `translate(${step.coords.x}, ${step.coords.y})`);

    // Mutación visual de la partícula según el estado
    const p = step.particula;
    let shapeSvg = "";

    switch (p.forma) {
      case "chispa-diamante":
        shapeSvg = `
          <polygon points="0,-16 16,0 0,16 -16,0" fill="${p.color}" stroke="#ffffff" stroke-width="2" filter="url(#glow-cyan)"/>
          <text y="4" text-anchor="middle" fill="#070b14" font-size="8.5" font-weight="900" font-family="'JetBrains Mono'">${p.etiqueta}</text>
        `;
        break;

      case "hexagono-tecnico":
        shapeSvg = `
          <polygon points="0,-16 14,-8 14,8 0,16 -14,8 -14,-8" fill="${p.color}" stroke="#ffffff" stroke-width="2.2" filter="url(#glow-cyan)"/>
          <text y="4" text-anchor="middle" fill="#ffffff" font-size="8" font-weight="900" font-family="'JetBrains Mono'">${p.etiqueta}</text>
        `;
        break;

      case "escudo-esmeralda":
        shapeSvg = `
          <circle r="16" fill="#059669" stroke="#34d399" stroke-width="2.5" filter="url(#glow-emerald)"/>
          <circle r="6" fill="#ffffff" opacity="0.3"/>
          <text y="4" text-anchor="middle" fill="#ffffff" font-size="8" font-weight="900" font-family="'JetBrains Mono'">${p.etiqueta}</text>
        `;
        break;

      case "rombo-purpura":
        shapeSvg = `
          <polygon points="0,-16 16,0 0,16 -16,0" fill="${p.color}" stroke="#f3e8ff" stroke-width="2.5" filter="url(#glow-purple)"/>
          <text y="4" text-anchor="middle" fill="#ffffff" font-size="7.5" font-weight="900" font-family="'JetBrains Mono'">${p.etiqueta}</text>
        `;
        break;

      case "octagono-carmesi":
      case "archivo-leccion":
        shapeSvg = `
          <polygon points="-7,-16 7,-16 16,-7 16,7 7,16 -7,16 -16,7 -16,-7" fill="${p.color}" stroke="#fecaca" stroke-width="2.5" filter="url(#glow-red)"/>
          <text y="4" text-anchor="middle" fill="#ffffff" font-size="7.5" font-weight="900" font-family="'JetBrains Mono'">${p.etiqueta}</text>
        `;
        break;

      case "cubo-dorado":
      case "boveda-dorada":
        shapeSvg = `
          <rect x="-14" y="-14" width="28" height="28" rx="6" fill="#d97706" stroke="#fbbf24" stroke-width="3" filter="url(#glow-gold)"/>
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
