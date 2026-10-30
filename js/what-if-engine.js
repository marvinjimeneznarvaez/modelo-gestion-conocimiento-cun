/**
 * WHAT-IF ENGINE: MOTOR DE SIMULACIÓN DE ESCENARIOS DIRECTIVOS
 * Responde a las preguntas estratégicas de la alta gerencia (Diapositiva 13 del Modelo CUN):
 * - ¿Qué pasa si se duplica la capacidad del comité de evaluación?
 * - ¿Qué ocurre si aumenta la rotación de colaboradores?
 * - ¿Cómo impacta la adopción de la DOKB en el riesgo de conocimiento crítico?
 */

class WhatIfSimulationEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;

    // Parámetros de entrada interactivos (Sliders)
    this.params = {
      capacidadComite: 25,       // Reclamos evaluados por mes
      tasaEntradaReclamos: 32,   // Reclamos generados por mes
      rotacionPersonal: 12,      // % de rotación anual de docentes/colaboradores
      adopcionDOKB: 68           // % de adopción y consulta de la base distribuida
    };

    this.results = {};
    this.compute();
  }

  updateParam(key, value) {
    if (this.params[key] !== undefined) {
      this.params[key] = parseFloat(value);
      this.compute();
      this.render();
    }
  }

  compute() {
    const { capacidadComite, tasaEntradaReclamos, rotacionPersonal, adopcionDOKB } = this.params;

    // 1. Cola de Evaluación (Teoría de Colas y Cuellos de Botella)
    const balanceMensual = tasaEntradaReclamos - capacidadComite;
    // Acumulado proyectado a 3 meses si no hay ajuste
    const colaEvaluacion = Math.max(2, Math.round(balanceMensual > 0 ? (balanceMensual * 3.2) : (tasaEntradaReclamos * 0.15)));
    const diasEsperaVeredicto = Math.min(90, Math.max(5, Math.round((colaEvaluacion / Math.max(10, capacidadComite)) * 30)));

    // 2. Conocimiento Crítico en Riesgo de Pérdida (%)
    // Si hay alta rotación pero alto uso de DOKB, el conocimiento tácito se preservó como explícito
    const factorProteccionDOKB = adopcionDOKB / 100;
    const riesgoConocimiento = Math.min(100, Math.max(2, (rotacionPersonal * (1 - factorProteccionDOKB * 0.85) * 1.8).toFixed(1)));

    // 3. Índice de Madurez ISO 30401 (Escala 1.0 a 5.0)
    let scoreMadurez = 2.0;
    if (colaEvaluacion < 12) scoreMadurez += 0.8;
    else if (colaEvaluacion < 25) scoreMadurez += 0.4;

    if (adopcionDOKB > 75) scoreMadurez += 1.2;
    else if (adopcionDOKB > 50) scoreMadurez += 0.7;

    if (riesgoConocimiento < 10) scoreMadurez += 1.0;
    else if (riesgoConocimiento < 20) scoreMadurez += 0.5;

    scoreMadurez = Math.min(5.0, Math.max(1.0, scoreMadurez)).toFixed(1);

    // 4. Reutilización efectiva de COK (%)
    const reutilizacionCOK = Math.min(98, Math.max(15, Math.round(adopcionDOKB * 1.08)));

    // 5. Tasa de Falsación Saludable (%)
    // Un sistema saludable debe falsar cerca del 25-35% de ideas inviables para evitar acumulación de basura
    const tasaFalsacion = (28 + (tasaEntradaReclamos > 45 ? 8 : 0)).toFixed(0);
    const tasaSupervivencia = (100 - tasaFalsacion).toFixed(0);

    this.results = {
      colaEvaluacion,
      diasEsperaVeredicto,
      riesgoConocimiento,
      scoreMadurez,
      reutilizacionCOK,
      tasaFalsacion,
      tasaSupervivencia
    };

    this.updateDomCards();
  }

  updateDomCards() {
    const elMadurez = document.getElementById("kpi-madurez");
    const elRiesgo = document.getElementById("kpi-riesgo");
    const elCola = document.getElementById("kpi-cola");
    const elReutilizacion = document.getElementById("kpi-reutilizacion");
    const elDias = document.getElementById("kpi-dias-espera");

    if (elMadurez) elMadurez.textContent = `${this.results.scoreMadurez} / 5.0`;
    if (elRiesgo) {
      elRiesgo.textContent = `${this.results.riesgoConocimiento}%`;
      elRiesgo.style.color = this.results.riesgoConocimiento > 20 ? "var(--color-fkc)" : (this.results.riesgoConocimiento > 10 ? "var(--cun-gold)" : "var(--color-skc)");
    }
    if (elCola) {
      elCola.textContent = `${this.results.colaEvaluacion} casos`;
      elCola.style.color = this.results.colaEvaluacion > 25 ? "var(--color-fkc)" : "var(--text-main)";
    }
    if (elReutilizacion) elReutilizacion.textContent = `${this.results.reutilizacionCOK}%`;
    if (elDias) elDias.textContent = `${this.results.diasEsperaVeredicto} días`;
  }

  render() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Gráfico de Barras Comparativo en Canvas
    const metrics = [
      { label: "Capacidad Comité", val: this.params.capacidadComite, max: 70, color: "#38bdf8" },
      { label: "Entrada Reclamos", val: this.params.tasaEntradaReclamos, max: 70, color: "#818cf8" },
      { label: "Adopción DOKB %", val: this.params.adopcionDOKB, max: 100, color: "#f59e0b" },
      { label: "Riesgo Pérdida %", val: parseFloat(this.results.riesgoConocimiento), max: 100, color: "#ef4444" },
      { label: "Reutilización %", val: this.results.reutilizacionCOK, max: 100, color: "#10b981" }
    ];

    const barWidth = 42;
    const spacing = (width - (metrics.length * barWidth)) / (metrics.length + 1);
    const chartBottom = height - 35;
    const chartHeight = height - 60;

    // Líneas guía de fondo
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = chartBottom - (chartHeight * (i / 4));
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    metrics.forEach((m, idx) => {
      const x = spacing + idx * (barWidth + spacing);
      const normalizedHeight = (m.val / m.max) * chartHeight;
      const y = chartBottom - normalizedHeight;

      // Sombra Neón
      ctx.shadowColor = m.color;
      ctx.shadowBlur = 10;
      ctx.fillStyle = m.color;

      // Barra con esquinas superiores redondeadas
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, normalizedHeight, [6, 6, 0, 0]);
      ctx.fill();

      // Reset sombra para texto
      ctx.shadowBlur = 0;

      // Valor numérico arriba de la barra
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${m.val}`, x + barWidth / 2, y - 6);

      // Etiqueta abajo de la barra
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px 'Outfit', sans-serif";
      ctx.fillText(m.label, x + barWidth / 2, chartBottom + 18);
    });
  }
}

window.WhatIfSimulationEngine = WhatIfSimulationEngine;
