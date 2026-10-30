/**
 * MAIN APPLICATION CONTROLLER · MODELO GC CUN
 * Corporación Unificada Nacional CUN · Dirección Nacional de Investigación
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Inicializar Motores de Arquitectura y Simulación
  const macroEngine = new KnowledgeSimulationEngine("macroSvg", null, false);
  const simEngine = new KnowledgeSimulationEngine("simulationSvg", "liveClaimCard", true);
  const whatIfEngine = new WhatIfSimulationEngine("whatIfCanvas");

  // Redimensionar Canvas Retina para el Cockpit
  function resizeCanvas() {
    const canvas = document.getElementById("whatIfCanvas");
    if (canvas && canvas.parentElement) {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 240;
      whatIfEngine.render();
    }
  }
  window.addEventListener("resize", resizeCanvas);
  setTimeout(resizeCanvas, 120);

  // =========================================================================
  // NAVEGACIÓN ENTRE MODOS DE LA APP
  // =========================================================================
  const modeButtons = document.querySelectorAll(".mode-btn");
  const viewSections = document.querySelectorAll(".view-section");

  modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetViewId = btn.getAttribute("data-view");

      modeButtons.forEach(b => b.classList.remove("active"));
      viewSections.forEach(v => v.classList.remove("active-view"));

      btn.classList.add("active");
      const targetView = document.getElementById(targetViewId);
      if (targetView) {
        targetView.classList.add("active-view");

        // Si cambia a simulación, asegurar paso activo sincronizado
        if (targetViewId === "view-simulator") {
          simEngine.updateSimulationStep();
        } else if (targetViewId === "view-cockpit") {
          setTimeout(resizeCanvas, 60);
        }
      }
    });
  });

  // =========================================================================
  // DRAWER LATERAL DE INSPECCIÓN Y EVENTOS CUSTOM
  // =========================================================================
  const drawer = document.getElementById("inspectorDrawer");
  const drawerTitle = document.getElementById("drawerTitle");
  const drawerContent = document.getElementById("drawerContent");
  const closeDrawerBtn = document.getElementById("closeDrawerBtn");

  function openDrawer(title, htmlContent) {
    if (!drawer) return;
    drawerTitle.textContent = title;
    drawerContent.innerHTML = htmlContent;
    drawer.classList.add("open");
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove("open");
  }

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener("click", closeDrawer);
  }

  // Escuchar clics sobre elementos SVG del mapa
  window.addEventListener("cun:inspector:open", (e) => {
    const { stageId, subId, elementId } = e.detail;

    // Caso 1: Clic en DOKB
    if (subId === "dokb" || elementId === "svg-dokb-node") {
      const dokb = window.CUN_GC_MODEL.dokb;
      const content = `
        <div class="info-block">
          <h4>Definición y Misión Institucional</h4>
          <p>${dokb.definition}</p>
        </div>

        <div class="info-block">
          <h4>Contenedores de Conocimiento Institucional CUN</h4>
          <div style="display:flex; flex-direction:column; gap:0.6rem; margin-top:0.4rem;">
            ${dokb.contenedores.map(c => `
              <div style="background:rgba(245,158,11,0.06); border:1px solid rgba(245,158,11,0.25); padding:0.65rem; border-radius:6px;">
                <strong style="color:var(--cun-gold); font-size:0.85rem;">${c.tipo}</strong>
                <p style="font-size:0.75rem; color:#fef3c7; margin-top:0.2rem;"><strong>Función Operativa:</strong> ${c.funcion}</p>
                <p style="font-size:0.75rem; color:#cbd5e1; margin-top:0.2rem;"><strong>Impacto Estratégico:</strong> ${c.impacto}</p>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="info-block">
          <h4>Cierre del Ciclo: Retroalimentación Experiencial</h4>
          <p style="color:#fde68a;">La DOKB no es un depósito estático: a través de la línea de retorno experiencial transfiere aprendizajes de regreso al Diagnóstico para guiar nuevas decisiones institucionales.</p>
        </div>
      `;
      openDrawer("DOKB · Base de Conocimiento Distribuida", content);
      return;
    }

    // Caso 2: Clic en Eje Superior de Comunicación
    if (elementId === "svg-bar-comunicacion") {
      const comms = window.CUN_GC_MODEL.ejesTransversales.comunicacion;
      const content = `
        <div class="info-block">
          <h4>Propósito Estratégico</h4>
          <p>${comms.proposito}</p>
        </div>

        <div class="info-block">
          <h4>Pilares del Ecosistema Comunicativo CUN</h4>
          <div style="display:flex; flex-direction:column; gap:0.6rem; margin-top:0.4rem;">
            ${comms.pilares.map(p => `
              <div style="background:rgba(56,189,248,0.06); border:1px solid rgba(56,189,248,0.25); padding:0.65rem; border-radius:6px;">
                <strong style="color:var(--cun-cyan); font-size:0.85rem;">${p.titulo}</strong>
                <p style="font-size:0.78rem; color:#cbd5e1; margin-top:0.2rem;">${p.desc}</p>
              </div>
            `).join("")}
          </div>
        </div>
      `;
      openDrawer(comms.nombre, content);
      return;
    }

    // Caso 3: Clic en Eje Inferior de Evaluación Constante
    if (elementId === "svg-bar-evaluacion") {
      const ev = window.CUN_GC_MODEL.ejesTransversales.evaluacion;
      const content = `
        <div class="info-block">
          <h4>Principio Rector</h4>
          <p>${ev.proposito}</p>
        </div>

        <div class="info-block">
          <h4>Matriz de Indicadores Clave de Control (ISO 30401 / ISO 9001)</h4>
          <table class="detail-table">
            <thead>
              <tr>
                <th>Nivel</th>
                <th>Indicador</th>
                <th>Meta Institucional</th>
                <th>Frecuencia</th>
              </tr>
            </thead>
            <tbody>
              ${ev.niveles.map(n => `
                <tr>
                  <td><span style="font-size:0.65rem; background:rgba(255,255,255,0.08); padding:0.15rem 0.4rem; border-radius:3px;">${n.nivel}</span></td>
                  <td><strong>${n.kpi}</strong></td>
                  <td style="color:var(--cun-gold)">${n.meta}</td>
                  <td>${n.freq}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
      openDrawer(ev.nombre, content);
      return;
    }

    // Caso 4: Clic en una Etapa o en un Subnodo Interno
    let stageData = window.CUN_GC_MODEL.stages.find(s => s.id === stageId);
    let subnodoData = null;

    if (!stageData && subId) {
      // Buscar la etapa que contiene este subnodo
      for (const st of window.CUN_GC_MODEL.stages) {
        const found = st.flujoInterno?.find(sn => sn.id === subId);
        if (found) {
          stageData = st;
          subnodoData = found;
          break;
        }
      }
    } else if (stageData && subId) {
      subnodoData = stageData.flujoInterno?.find(sn => sn.id === subId);
    }

    if (stageData) {
      let subnodoHighlightHtml = "";
      if (subnodoData) {
        subnodoHighlightHtml = `
          <div style="background:rgba(56,189,248,0.12); border:1px solid var(--cun-cyan); padding:0.85rem; border-radius:8px; margin-bottom:1rem;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-family:'JetBrains Mono'; font-size:0.75rem; color:var(--cun-cyan); font-weight:700;">Subproceso Seleccionado</span>
              <span style="background:var(--cun-cyan); color:#070b14; font-size:0.68rem; font-weight:800; padding:0.15rem 0.45rem; border-radius:3px;">${subnodoData.nodoBadge}</span>
            </div>
            <h4 style="font-size:0.95rem; color:#ffffff; margin-top:0.3rem;">${subnodoData.nombre}</h4>
            <p style="font-size:0.8rem; color:#e2e8f0; margin-top:0.25rem;">${subnodoData.desc}</p>
          </div>
        `;
      }

      let caminosHtml = "";
      if (stageData.caminos) {
        caminosHtml = `
          <div class="info-block">
            <h4>Tres Caminos de Veredicto (Marco McElroy)</h4>
            <div style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.3rem;">
              ${stageData.caminos.map(c => `
                <div style="background:rgba(255,255,255,0.04); border-left:3px solid ${c.color}; padding:0.6rem; border-radius:4px;">
                  <strong style="color:${c.color}; font-size:0.82rem;">${c.code} · ${c.title}</strong>
                  <p style="font-size:0.75rem; color:#cbd5e1; margin-top:0.2rem;">${c.action}</p>
                </div>
              `).join("")}
            </div>
          </div>
        `;
      }

      const content = `
        ${subnodoHighlightHtml}

        <div class="info-block">
          <h4>Descripción Operativa de la Etapa</h4>
          <p>${stageData.fullDesc}</p>
        </div>

        <div class="info-block">
          <h4>Flujo Interno de Procesos (Recuadros del Modelo)</h4>
          <div style="display:flex; flex-direction:column; gap:0.45rem; margin-top:0.3rem;">
            ${stageData.flujoInterno?.map((fn, idx) => `
              <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); padding:0.5rem 0.7rem; border-radius:5px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <strong style="color:#ffffff; font-size:0.8rem;">${idx + 1}. ${fn.nombre}</strong>
                  <div style="font-size:0.72rem; color:#94a3b8; margin-top:0.15rem;">${fn.desc}</div>
                </div>
                <span style="font-family:'JetBrains Mono'; font-size:0.65rem; color:var(--cun-cyan); background:rgba(56,189,248,0.1); padding:0.2rem 0.4rem; border-radius:3px; flex-shrink:0; margin-left:0.5rem;">
                  ${fn.nodoBadge}
                </span>
              </div>
            `).join("") || ""}
          </div>
        </div>

        ${caminosHtml}

        <div class="info-block">
          <h4>¿Qué entra?</h4>
          <ul style="padding-left:1.2rem; font-size:0.8rem; color:#cbd5e1; line-height:1.6;">
            ${stageData.entra.map(item => `<li>${item}</li>`).join("")}
          </ul>
        </div>

        <div class="info-block">
          <h4>¿Qué sale?</h4>
          <div style="background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.3); padding:0.65rem; border-radius:6px; font-size:0.82rem; color:#bae6fd;">
            ${stageData.sale}
          </div>
        </div>

        <div class="info-block">
          <h4>Criterio de Evaluación y Control</h4>
          <p style="font-style:italic; color:#fde68a; font-size:0.82rem;">"${stageData.evaluacion}"</p>
        </div>

        <div class="info-block">
          <h4>Indicadores de Gestión (KPIs)</h4>
          <table class="detail-table">
            <thead>
              <tr>
                <th>Indicador</th>
                <th>Meta</th>
                <th>Frecuencia</th>
              </tr>
            </thead>
            <tbody>
              ${stageData.kpis.map(k => `
                <tr>
                  <td><strong>${k.name}</strong></td>
                  <td style="color:var(--cun-cyan)">${k.meta}</td>
                  <td>${k.freq}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;

      openDrawer(`Etapa ${stageData.number}: ${stageData.name}`, content);
    }
  });

  // =========================================================================
  // BOTÓN Y MODAL PERMANENTE DEL EQUIPO DE INVESTIGACIÓN
  // =========================================================================
  const teamBtn = document.getElementById("teamTriggerBtn");
  if (teamBtn) {
    teamBtn.addEventListener("click", () => {
      const eq = window.CUN_GC_MODEL.equipoInvestigacion;
      const content = `
        <div class="info-block">
          <h4>Dirección Nacional de Investigación · CUN</h4>
          <p>${eq.descripcion}</p>
        </div>

        <div class="info-block">
          <h4>Investigadores Principales</h4>
          <div style="display:flex; flex-direction:column; gap:0.55rem; margin-top:0.4rem;">
            ${eq.integrantes.map(inv => `
              <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(245,158,11,0.25); border-left:4px solid var(--cun-gold); padding:0.65rem 0.85rem; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
                <h4 style="color:#ffffff; font-size:0.92rem; text-transform:none; margin:0;">${inv.nombre}</h4>
                <span style="font-size:0.75rem; color:var(--cun-cyan); font-family:'JetBrains Mono'; background:rgba(56,189,248,0.1); padding:0.2rem 0.5rem; border-radius:4px;">${inv.cargo}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="info-block">
          <h4>Compromiso Institucional CUN</h4>
          <p style="font-size:0.8rem; color:#94a3b8;">
            Este modelo articula el capital intelectual, el capital social y los estándares internacionales ISO 30401 e ISO 9001 para garantizar que el saber institucional trascienda a las personas, impulse la acreditación y proteja la memoria colectiva de la Corporación Unificada Nacional.
          </p>
        </div>
      `;
      openDrawer("Equipo de Investigación · Gestión del Conocimiento", content);
    });
  }

  // =========================================================================
  // CONTROLES DE LA SIMULACIÓN EN VIVO
  // =========================================================================
  const caseSelect = document.getElementById("caseSelect");
  if (caseSelect) {
    caseSelect.addEventListener("change", (e) => {
      simEngine.setCase(e.target.value);
    });
  }

  const btnPlay = document.getElementById("btnPlay");
  const btnPause = document.getElementById("btnPause");
  const btnStepNext = document.getElementById("btnStepNext");
  const btnStepPrev = document.getElementById("btnStepPrev");
  const btnReset = document.getElementById("btnReset");

  if (btnPlay) btnPlay.addEventListener("click", () => simEngine.play());
  if (btnPause) btnPause.addEventListener("click", () => simEngine.pause());
  if (btnStepNext) btnStepNext.addEventListener("click", () => simEngine.nextStep());
  if (btnStepPrev) btnStepPrev.addEventListener("click", () => simEngine.prevStep());
  if (btnReset) btnReset.addEventListener("click", () => simEngine.reset());

  // =========================================================================
  // CONTROLES DEL COCKPIT "WHAT-IF"
  // =========================================================================
  function bindSlider(sliderId, key, badgeId, suffix = "") {
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    slider.addEventListener("input", (e) => {
      const val = e.target.value;
      const badge = document.getElementById(badgeId);
      if (badge) badge.textContent = `${val}${suffix}`;
      whatIfEngine.updateParam(key, val);
    });
  }

  bindSlider("slider-comite", "capacidadComite", "badge-val-comite", " casos/mes");
  bindSlider("slider-entrada", "tasaEntradaReclamos", "badge-val-entrada", " casos/mes");
  bindSlider("slider-rotacion", "rotacionPersonal", "badge-val-rotacion", "% anual");
  bindSlider("slider-dokb", "adopcionDOKB", "badge-val-dokb", "%");

  // Botón de Ayuda y Guía
  const helpBtn = document.getElementById("helpBtn");
  if (helpBtn) {
    helpBtn.addEventListener("click", () => {
      const guideContent = `
        <div class="info-block">
          <h4>Guía Oficial del Simulador · CUN</h4>
          <p>Esta plataforma interactiva permite explorar y simular integralmente el Modelo de Gestión del Conocimiento desarrollado por el Equipo de Investigación de la Corporación Unificada Nacional CUN:</p>
        </div>

        <div class="info-block">
          <h4>1. Vista Macro-Arquitectura (Flujos Internos)</h4>
          <p>Muestra el mapa conceptual completo con sus 4 etapas (Diagnóstico, Producción, Filtración e Integración) y todos sus subrecuadros y flechas internas, junto a la DOKB, los Stakeholders y las dos retroalimentaciones. Haz clic en cualquier elemento para inspeccionar sus datos.</p>
        </div>

        <div class="info-block">
          <h4>2. Vista Simulador de Flujo en Vivo</h4>
          <p>Permite observar cómo un caso institucional real avanza paso a paso por cada subnodo interno. La partícula sufre mutaciones visuales de forma y color a medida que progresa (GAP ➔ KC ➔ CKC ➔ SKC/UKC/FKC ➔ COK ➔ DOKB) y muestra los días simulados de proceso y las decisiones colegiadas.</p>
        </div>

        <div class="info-block">
          <h4>3. Vista Cockpit Directivo "What-If"</h4>
          <p>Permite a la alta gerencia simular escenarios organizacionales en tiempo real respondiendo a preguntas clave: ¿Qué pasa si duplicamos la capacidad del comité? ¿Qué ocurre con la fuga de saberes si sube la rotación docente? ¿Cómo impacta la adopción de la DOKB?</p>
        </div>
      `;
      openDrawer("Guía y Manual del Simulador", guideContent);
    });
  }
});
