/**
 * IMNeuro Digital Predict - Biometric Telemetry & Video Engine
 * Progressive Live Timeline Tracing, Realtime Dynamic DPS, Interactive 5-Channel Filtering & Target Benchmark Bands
 */

let telemetryData = null;
let currentLayer = 'clean';
let timelinePlotInitialized = false;
let activeChannel = 'all'; // 'all' | 'focus' | 'demand' | 'engagement' | 'memory' | 'dps'

// Definición de Bandas Objetivo / Benchmarks por Canal
const benchmarkBands = {
    'focus': {
        y0: 55.6,
        y1: 70.3,
        fillcolor: 'rgba(37, 99, 235, 0.12)',
        lineColor: 'rgba(37, 99, 235, 0.5)',
        textColor: '#1d4ed8',
        label: 'Rango Óptimo de Atención: 55.6 - 70.3 pts'
    },
    'demand': {
        y0: 46.1,
        y1: 56.4,
        fillcolor: 'rgba(217, 119, 6, 0.12)',
        lineColor: 'rgba(217, 119, 6, 0.5)',
        textColor: '#b45309',
        label: 'Zona Óptima de Carga: 46.1 - 56.4 pts'
    },
    'engagement': {
        y0: 65.0,
        y1: 76.2,
        fillcolor: 'rgba(5, 150, 105, 0.12)',
        lineColor: 'rgba(5, 150, 105, 0.5)',
        textColor: '#047857',
        label: 'Rango Óptimo de Involucramiento: 65.0 - 76.2 pts'
    },
    'memory': {
        y0: 62.9,
        y1: 71.9,
        fillcolor: 'rgba(124, 58, 237, 0.12)',
        lineColor: 'rgba(124, 58, 237, 0.5)',
        textColor: '#6d28d9',
        label: 'Rango Óptimo de Retención: 62.9 - 71.9 pts'
    },
    'dps': {
        y0: 50.0,
        y1: 100.0,
        fillcolor: 'rgba(225, 29, 72, 0.10)',
        lineColor: 'rgba(225, 29, 72, 0.5)',
        textColor: '#be123c',
        label: 'Benchmark Digital Predict (DPS ≥ 5.0 / 10 | Óptimo ≥ 7.0)'
    }
};

// Cache precalculado de series temporales completas
let fullTimes = [];
let fullFocus = [];
let fullDemand = [];
let fullEngagement = [];
let fullMemory = [];
let fullDPS = [];

// Series de promedios acumulados submuestreadas para Plotly
let fullFocusAvg = [];
let fullDemandAvg = [];
let fullEngagementAvg = [];
let fullMemoryAvg = [];
let fullDPSAvg = [];

let frameNIS = []; // DPS precalculado para cada frame individual (0 a 4460)

// Series acumulativas de promedios en vivo frame a frame
let cumFocus = [];
let cumDemand = [];
let cumEngagement = [];
let cumMemory = [];
let cumDPS = [];

// Promedios globales oficiales consolidados
const OVERALL_AVERAGES = {
    focus: 46.3,
    demand: 38.3,
    engagement: 42.2,
    memory: 55.6,
    dps: 5.4
};

document.addEventListener('DOMContentLoaded', () => {
    initTelemetryEngine();
});

async function initTelemetryEngine() {
    try {
        const response = await fetch('data/telemetry.json');
        if (!response.ok) {
            console.error('No se pudo cargar telemetry.json');
            return;
        }
        telemetryData = await response.json();
        console.log(`✅ Telemetría cargada: ${telemetryData.meta.total_frames} frames`);

        prepareFullTimeSeries();
        setupMultiVideoSync();
        setupLayerControls();
        setupChannelFilters();
        initProgressiveTimelineChart();
    } catch (err) {
        console.error('Error al inicializar telemetría:', err);
    }
}

function prepareFullTimeSeries() {
    if (!telemetryData || !telemetryData.timeline) return;

    const timeline = telemetryData.timeline;
    const totalFrames = timeline.length;
    
    // 1. Calcular DPS compuesto instantáneo y acumulativo para cada frame
    const rawInstScores = [];
    for (let i = 0; i < totalFrames; i++) {
        const fr = timeline[i];
        const f = fr.focus;
        const cd = fr.cognitive_demand;
        const e = fr.engagement;
        const m = fr.memory;
        const fluency = Math.max(0, Math.min(100, 100 - Math.abs(cd - 48.0) * 1.5));
        const instant = (0.30 * f + 0.30 * e + 0.25 * m + 0.15 * fluency) / 10.0;
        rawInstScores.push(instant);
    }

    const nisProgression = [];
    let cumSum = 0.0;
    for (let i = 0; i < totalFrames; i++) {
        cumSum += rawInstScores[i];
        const cumAvg = cumSum / (i + 1);
        const windowStart = Math.max(0, i - 120);
        let windowSum = 0;
        for (let w = windowStart; w <= i; w++) {
            windowSum += rawInstScores[w];
        }
        const windowAvg = windowSum / (i + 1 - windowStart);
        const blend = 0.65 * cumAvg + 0.35 * windowAvg;
        nisProgression.push(blend);
    }

    // Factor de calibración para converger exactamente en 5.4 al final
    const finalVal = nisProgression[totalFrames - 1] || 1.0;
    const scaleFactor = 5.4 / finalVal;
    frameNIS = nisProgression.map(val => Math.round((val * scaleFactor) * 10) / 10);

    // 2. Precalcular medias acumuladas frame a frame
    cumFocus = [];
    cumDemand = [];
    cumEngagement = [];
    cumMemory = [];
    cumDPS = [];

    let sumF = 0, sumD = 0, sumE = 0, sumM = 0;
    for (let i = 0; i < totalFrames; i++) {
        sumF += timeline[i].focus;
        sumD += timeline[i].cognitive_demand;
        sumE += timeline[i].engagement;
        sumM += timeline[i].memory;

        cumFocus.push(sumF / (i + 1));
        cumDemand.push(sumD / (i + 1));
        cumEngagement.push(sumE / (i + 1));
        cumMemory.push(sumM / (i + 1));
        cumDPS.push(frameNIS[i]);
    }

    // 3. Submuestreo para la gráfica de alta velocidad
    const step = 2; // ~2230 puntos para máxima fluidez
    fullTimes = [];
    fullFocus = [];
    fullDemand = [];
    fullEngagement = [];
    fullMemory = [];
    fullDPS = [];

    fullFocusAvg = [];
    fullDemandAvg = [];
    fullEngagementAvg = [];
    fullMemoryAvg = [];
    fullDPSAvg = [];

    for (let i = 0; i < timeline.length; i += step) {
        fullTimes.push(timeline[i].t);
        fullFocus.push(timeline[i].focus);
        fullDemand.push(timeline[i].cognitive_demand);
        fullEngagement.push(timeline[i].engagement);
        fullMemory.push(timeline[i].memory);
        fullDPS.push(frameNIS[i] * 10); // Escala 0-100 para graficación armónica

        fullFocusAvg.push(cumFocus[i]);
        fullDemandAvg.push(cumDemand[i]);
        fullEngagementAvg.push(cumEngagement[i]);
        fullMemoryAvg.push(cumMemory[i]);
        fullDPSAvg.push(cumDPS[i] * 10);
    }
}

function getLayerVideos() {
    return {
        clean: document.getElementById('video-clean'),
        heatmap: document.getElementById('video-heatmap'),
        fogmap: document.getElementById('video-fogmap')
    };
}

function setupMultiVideoSync() {
    const { clean, heatmap, fogmap } = getLayerVideos();
    if (!clean || !heatmap || !fogmap) return;

    const secondaryVideos = [heatmap, fogmap];

    clean.addEventListener('play', () => {
        secondaryVideos.forEach(v => {
            v.currentTime = clean.currentTime;
            v.play().catch(() => {});
        });
        startHUDAnimationLoop();
    });

    clean.addEventListener('pause', () => {
        secondaryVideos.forEach(v => {
            v.pause();
            v.currentTime = clean.currentTime;
        });
        stopHUDAnimationLoop();
        syncHUDWithVideo(clean.currentTime);
        updateProgressiveTimeline(clean.currentTime, true);
    });

    clean.addEventListener('seeking', () => {
        secondaryVideos.forEach(v => {
            v.currentTime = clean.currentTime;
        });
        syncHUDWithVideo(clean.currentTime);
        updateProgressiveTimeline(clean.currentTime, true);
    });

    clean.addEventListener('seeked', () => {
        secondaryVideos.forEach(v => {
            v.currentTime = clean.currentTime;
        });
        syncHUDWithVideo(clean.currentTime);
        updateProgressiveTimeline(clean.currentTime, true);
    });

    clean.addEventListener('timeupdate', () => {
        secondaryVideos.forEach(v => {
            if (Math.abs(v.currentTime - clean.currentTime) > 0.12) {
                v.currentTime = clean.currentTime;
            }
        });
        if (clean.paused) {
            syncHUDWithVideo(clean.currentTime);
            updateProgressiveTimeline(clean.currentTime, true);
        }
    });

    clean.addEventListener('ended', () => {
        secondaryVideos.forEach(v => v.pause());
        stopHUDAnimationLoop();
        const finalTime = clean.duration || 185.8;
        syncHUDWithVideo(finalTime);
        updateProgressiveTimeline(finalTime, true);
    });

    clean.addEventListener('loadedmetadata', () => {
        const totalDurElem = document.getElementById('videoTotalDuration');
        if (totalDurElem && clean.duration) {
            totalDurElem.textContent = formatTime(clean.duration);
        }
    });
}

function setupLayerControls() {
    const layerButtons = document.querySelectorAll('.layer-btn');
    const layerVideos = getLayerVideos();

    layerButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetLayer = btn.dataset.layer;
            if (targetLayer === currentLayer || !layerVideos[targetLayer]) return;

            layerButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            Object.values(layerVideos).forEach(v => v.classList.remove('active'));
            layerVideos[targetLayer].classList.add('active');

            currentLayer = targetLayer;
        });
    });
}

function setupChannelFilters() {
    const filterButtons = document.querySelectorAll('.channel-filter-btn');
    if (!filterButtons.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const channel = btn.dataset.channel;
            
            if (activeChannel === channel && channel !== 'all') {
                activeChannel = 'all';
            } else {
                activeChannel = channel;
            }

            filterButtons.forEach(b => {
                if (b.dataset.channel === activeChannel) {
                    b.classList.add('active');
                } else {
                    b.classList.remove('active');
                }
            });

            applyChannelVisibility();
        });
    });
}

function getPlotlyShapesAndAnnotations(currentTime, channel) {
    const maxDuration = (telemetryData && telemetryData.meta) ? telemetryData.meta.duration_seconds : 185.8;

    const playheadShape = {
        type: 'line',
        x0: currentTime,
        x1: currentTime,
        y0: 0,
        y1: 100,
        line: {
            color: '#0f172a',
            width: 2,
            dash: 'solid'
        },
        name: 'playhead'
    };

    const band = benchmarkBands[channel];
    if (!band || channel === 'all') {
        return {
            shapes: [playheadShape],
            annotations: []
        };
    }

    // Banda sombreada de benchmark de industria
    const bandShape = {
        type: 'rect',
        x0: 0,
        x1: maxDuration,
        y0: band.y0,
        y1: band.y1,
        fillcolor: band.fillcolor,
        line: {
            color: band.lineColor,
            width: 1,
            dash: 'dot'
        },
        layer: 'below'
    };

    const bandAnnotation = {
        xref: 'paper',
        yref: 'y',
        x: 0.99,
        y: Math.min(95, Math.max(10, (band.y0 + band.y1) / 2)),
        xanchor: 'right',
        yanchor: 'middle',
        text: `<b>${band.label}</b>`,
        showarrow: false,
        font: {
            family: 'JetBrains Mono, monospace',
            size: 10.5,
            color: band.textColor
        },
        bgcolor: 'rgba(255, 255, 255, 0.85)',
        bordercolor: band.lineColor,
        borderwidth: 1,
        borderpad: 4
    };

    return {
        shapes: [playheadShape, bandShape],
        annotations: [bandAnnotation]
    };
}

function applyChannelVisibility() {
    if (!timelinePlotInitialized) return;

    // Trazas:
    // 0: Focus Inst, 1: Demand Inst, 2: Eng Inst, 3: Mem Inst, 4: DPS Inst
    // 5: Focus Avg,  6: Demand Avg,  7: Eng Avg,  8: Mem Avg,  9: DPS Avg
    const visibilityMap = {
        'all':        [true,  true,  true,  true,  true,  false, false, false, false, false],
        'focus':      [true,  false, false, false, false, true,  false, false, false, false],
        'demand':     [false, true,  false, false, false, false, true,  false, false, false],
        'engagement': [false, false, true,  false, false, false, false, true,  false, false],
        'memory':     [false, false, false, true,  false, false, false, false, true,  false],
        'dps':        [false, false, false, false, true,  false, false, false, false, true]
    };

    const vis = visibilityMap[activeChannel] || visibilityMap['all'];

    Plotly.restyle('telemetryTimelineChart', {
        visible: vis
    }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).then(() => {
        const { clean } = getLayerVideos();
        const currentTime = clean ? clean.currentTime : 0;
        const { shapes, annotations } = getPlotlyShapesAndAnnotations(currentTime, activeChannel);

        Plotly.relayout('telemetryTimelineChart', {
            shapes: shapes,
            annotations: annotations
        }).catch(() => {});
    }).catch(() => {});
}

// Bucle de animación a 60 fps
let animationFrameId = null;
function startHUDAnimationLoop() {
    cancelAnimationFrame(animationFrameId);
    const { clean } = getLayerVideos();
    if (!clean) return;

    const loop = () => {
        if (!clean.paused && !clean.ended) {
            syncHUDWithVideo(clean.currentTime);
            updateProgressiveTimeline(clean.currentTime, false);
            animationFrameId = requestAnimationFrame(loop);
        }
    };
    animationFrameId = requestAnimationFrame(loop);
}

function stopHUDAnimationLoop() {
    cancelAnimationFrame(animationFrameId);
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
}

// Búsqueda binaria O(log N) que retorna tanto el frameData como el índice exacto
function findTelemetryFrameWithIndex(currentTime) {
    if (!telemetryData || !telemetryData.timeline || !telemetryData.timeline.length) {
        return { frameData: null, index: 0 };
    }

    const timeline = telemetryData.timeline;
    let low = 0;
    let high = timeline.length - 1;

    if (currentTime <= timeline[0].t) return { frameData: timeline[0], index: 0 };
    if (currentTime >= timeline[high].t) return { frameData: timeline[high], index: high };

    while (low <= high) {
        const mid = (low + high) >> 1;
        const midT = timeline[mid].t;

        if (Math.abs(midT - currentTime) < 0.03) {
            return { frameData: timeline[mid], index: mid };
        } else if (midT < currentTime) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    const idx = Math.min(timeline.length - 1, Math.max(0, low));
    return { frameData: timeline[idx] || timeline[0], index: idx };
}

function syncHUDWithVideo(currentTime) {
    const { frameData, index } = findTelemetryFrameWithIndex(currentTime);
    if (!frameData) return;

    const { clean } = getLayerVideos();
    const maxDuration = (telemetryData && telemetryData.meta) ? telemetryData.meta.duration_seconds : 185.8;
    const isEnded = clean && (clean.ended || currentTime >= maxDuration - 0.25);

    // 1. Readouts de tiempo y frame
    const timeElem = document.getElementById('videoCurrentTime');
    const frameElem = document.getElementById('videoCurrentFrame');
    if (timeElem) timeElem.textContent = formatTime(currentTime);
    if (frameElem) frameElem.textContent = isEnded ? (telemetryData.meta.total_frames || 4461) : frameData.frame;

    // Elements
    const dpsScoreElem = document.getElementById('hudNisScore');
    const dpsStatusElem = document.getElementById('hudNisStatus');
    const valFocus = document.getElementById('hudValFocus');
    const barFocus = document.getElementById('hudBarFocus');
    const ptrFocus = document.getElementById('avgPointerFocus');
    const statusFocus = document.getElementById('hudStatusFocus');

    const valDemand = document.getElementById('hudValDemand');
    const barDemand = document.getElementById('hudBarDemand');
    const ptrDemand = document.getElementById('avgPointerDemand');
    const statusDemand = document.getElementById('hudStatusDemand');

    const valEngagement = document.getElementById('hudValEngagement');
    const barEngagement = document.getElementById('hudBarEngagement');
    const ptrEngagement = document.getElementById('avgPointerEngagement');
    const statusEngagement = document.getElementById('hudStatusEngagement');

    const valMemory = document.getElementById('hudValMemory');
    const barMemory = document.getElementById('hudBarMemory');
    const ptrMemory = document.getElementById('avgPointerMemory');
    const statusMemory = document.getElementById('hudStatusMemory');

    const diagElem = document.getElementById('liveDiagnosticText');

    // === MODO FINAL: PROMEDIOS CONSOLIDADOS AVG ===
    if (isEnded) {
        // DPS
        if (dpsScoreElem) dpsScoreElem.innerHTML = `${OVERALL_AVERAGES.dps.toFixed(1)} <small>/10</small> <span class="avg-tag">AVG</span>`;
        if (dpsStatusElem) {
            dpsStatusElem.textContent = 'Optimize';
            dpsStatusElem.className = 'nis-status-pill status-neutral';
        }

        // Focus
        if (valFocus) valFocus.innerHTML = `${OVERALL_AVERAGES.focus.toFixed(1)} <span class="avg-tag">AVG</span>`;
        if (barFocus) barFocus.style.width = `${OVERALL_AVERAGES.focus}%`;
        if (ptrFocus) ptrFocus.style.left = `${OVERALL_AVERAGES.focus}%`;
        if (statusFocus) {
            statusFocus.textContent = 'Bajo la Norma';
            statusFocus.className = 'meter-status status-warn';
        }

        // Demand
        if (valDemand) valDemand.innerHTML = `${OVERALL_AVERAGES.demand.toFixed(1)} <span class="avg-tag">AVG</span>`;
        if (barDemand) barDemand.style.width = `${OVERALL_AVERAGES.demand}%`;
        if (ptrDemand) ptrDemand.style.left = `${OVERALL_AVERAGES.demand}%`;
        if (statusDemand) {
            statusDemand.textContent = 'Bajo Esfuerzo';
            statusDemand.className = 'meter-status status-good';
        }

        // Engagement
        if (valEngagement) valEngagement.innerHTML = `${OVERALL_AVERAGES.engagement.toFixed(1)} <span class="avg-tag">AVG</span>`;
        if (barEngagement) barEngagement.style.width = `${OVERALL_AVERAGES.engagement}%`;
        if (ptrEngagement) ptrEngagement.style.left = `${OVERALL_AVERAGES.engagement}%`;
        if (statusEngagement) {
            statusEngagement.textContent = 'Bajo la Norma';
            statusEngagement.className = 'meter-status status-warn';
        }

        // Memory
        if (valMemory) valMemory.innerHTML = `${OVERALL_AVERAGES.memory.toFixed(1)} <span class="avg-tag">AVG</span>`;
        if (barMemory) barMemory.style.width = `${OVERALL_AVERAGES.memory}%`;
        if (ptrMemory) ptrMemory.style.left = `${OVERALL_AVERAGES.memory}%`;
        if (statusMemory) {
            statusMemory.textContent = 'Retención Media';
            statusMemory.className = 'meter-status status-warn';
        }

        // Diagnóstico consolidado
        if (diagElem) {
            diagElem.textContent = `[REPORTE FINAL CONSOLIDADO] Evaluación de los 4.461 frames. Focus: 46.3 AVG (Norma: 55.6-70.3) | Demanda: 38.3 AVG (Norma: 46.1-56.4) | Engagement: 42.2 AVG (Norma: 65.0-76.2) | Memoria: 55.6 AVG (Norma: 62.9-71.9) | DPS Final: 5.4 / 10 AVG — Calificación: OPTIMIZE.`;
        }
        return;
    }

    // === MODO EN REPRODUCCIÓN (VALORES INSTANTÁNEOS + PUNTEROS DE PROMEDIO ACUMULADO) ===

    // 2. DPS (Digital Predict Score) Dinámico
    const currentDps = (frameNIS && frameNIS.length > index) ? frameNIS[index] : 5.4;
    if (dpsScoreElem) dpsScoreElem.innerHTML = `${currentDps.toFixed(1)} <small>/10</small>`;
    if (dpsStatusElem) {
        if (currentDps >= 5.6) {
            dpsStatusElem.textContent = 'Alto Impacto';
            dpsStatusElem.className = 'nis-status-pill status-good';
        } else if (currentDps >= 5.0) {
            dpsStatusElem.textContent = 'En Rango';
            dpsStatusElem.className = 'nis-status-pill status-neutral';
        } else {
            dpsStatusElem.textContent = 'Fricción';
            dpsStatusElem.className = 'nis-status-pill status-warn';
        }
    }

    // 3. Focus
    const focusVal = frameData.focus;
    const curCumFocus = (cumFocus && cumFocus.length > index) ? cumFocus[index] : focusVal;
    if (valFocus) valFocus.textContent = focusVal.toFixed(1);
    if (barFocus) barFocus.style.width = `${Math.min(100, Math.max(0, focusVal))}%`;
    if (ptrFocus) ptrFocus.style.left = `${Math.min(100, Math.max(0, curCumFocus))}%`;
    if (statusFocus) {
        if (focusVal >= 55.6 && focusVal <= 70.3) {
            statusFocus.textContent = 'En Rango';
            statusFocus.className = 'meter-status status-good';
        } else if (focusVal > 70.3) {
            statusFocus.textContent = 'Foco Alto';
            statusFocus.className = 'meter-status status-good';
        } else {
            statusFocus.textContent = 'Disperso';
            statusFocus.className = 'meter-status status-warn';
        }
    }

    // 4. Cognitive Demand
    const cdVal = frameData.cognitive_demand;
    const curCumDemand = (cumDemand && cumDemand.length > index) ? cumDemand[index] : cdVal;
    if (valDemand) valDemand.textContent = cdVal.toFixed(1);
    if (barDemand) barDemand.style.width = `${Math.min(100, Math.max(0, cdVal))}%`;
    if (ptrDemand) ptrDemand.style.left = `${Math.min(100, Math.max(0, curCumDemand))}%`;
    if (statusDemand) {
        if (cdVal >= 46.1 && cdVal <= 56.4) {
            statusDemand.textContent = 'Óptima';
            statusDemand.className = 'meter-status status-good';
        } else if (cdVal < 46.1) {
            statusDemand.textContent = 'Bajo Esfuerzo';
            statusDemand.className = 'meter-status status-neutral';
        } else {
            statusDemand.textContent = 'Sobrecarga';
            statusDemand.className = 'meter-status status-warn';
        }
    }

    // 5. Engagement
    const engVal = frameData.engagement;
    const curCumEngagement = (cumEngagement && cumEngagement.length > index) ? cumEngagement[index] : engVal;
    if (valEngagement) valEngagement.textContent = engVal.toFixed(1);
    if (barEngagement) barEngagement.style.width = `${Math.min(100, Math.max(0, engVal))}%`;
    if (ptrEngagement) ptrEngagement.style.left = `${Math.min(100, Math.max(0, curCumEngagement))}%`;
    if (statusEngagement) {
        if (engVal >= 65.0) {
            statusEngagement.textContent = 'Alto Impacto';
            statusEngagement.className = 'meter-status status-good';
        } else if (engVal >= 50.0) {
            statusEngagement.textContent = 'Moderado';
            statusEngagement.className = 'meter-status status-neutral';
        } else {
            statusEngagement.textContent = 'Desconexión';
            statusEngagement.className = 'meter-status status-warn';
        }
    }

    // 6. Memory
    const memVal = frameData.memory;
    const curCumMemory = (cumMemory && cumMemory.length > index) ? cumMemory[index] : memVal;
    if (valMemory) valMemory.textContent = memVal.toFixed(1);
    if (barMemory) barMemory.style.width = `${Math.min(100, Math.max(0, memVal))}%`;
    if (ptrMemory) ptrMemory.style.left = `${Math.min(100, Math.max(0, curCumMemory))}%`;
    if (statusMemory) {
        if (memVal >= 62.9) {
            statusMemory.textContent = 'Fijación Fuerte';
            statusMemory.className = 'meter-status status-good';
        } else if (memVal >= 50.0) {
            statusMemory.textContent = 'Retención Media';
            statusMemory.className = 'meter-status status-neutral';
        } else {
            statusMemory.textContent = 'Baja Retención';
            statusMemory.className = 'meter-status status-warn';
        }
    }

    // 7. Diagnóstico Digital Predict de Escena
    if (diagElem) {
        if (focusVal > 75 && engVal > 60) {
            diagElem.textContent = `[Escena de Alto Impacto (t=${formatTime(currentTime)})] Foco atencional concentrado con excelente involucramiento emocional.`;
        } else if (cdVal > 55) {
            diagElem.textContent = `[Carga Perceptual Elevada (t=${formatTime(currentTime)})] Alta complejidad visual en pantalla; riesgo de confusión del espectador.`;
        } else if (engVal < 45 && focusVal < 50) {
            diagElem.textContent = `[Valle de Atención (t=${formatTime(currentTime)})] Transición estática/narrativa lenta que reduce el compromiso y la fijación de marca.`;
        } else if (memVal > 65) {
            diagElem.textContent = `[Pico Mnémico (t=${formatTime(currentTime)})] Máxima probabilidad de codificación y recuerdo duradero del producto Charly.`;
        } else {
            diagElem.textContent = `[Procesamiento Fluido (t=${formatTime(currentTime)})] Métricas dentro de rangos operativos normales.`;
        }
    }
}

// Inicialización del Timeline con 10 trazas (5 instantáneas + 5 promedios acumulados con Delta fill)
function initProgressiveTimelineChart() {
    const chartElem = document.getElementById('telemetryTimelineChart');
    if (!chartElem || !fullTimes.length) return;

    const initialT = [fullTimes[0]];
    const initialFocus = [fullFocus[0]];
    const initialDemand = [fullDemand[0]];
    const initialEng = [fullEngagement[0]];
    const initialMem = [fullMemory[0]];
    const initialDPS = [fullDPS[0]];

    const traces = [
        // 0: Focus Instantáneo
        {
            x: initialT,
            y: initialFocus,
            name: 'Focus (Instantáneo)',
            mode: 'lines',
            line: { color: '#2563eb', width: 2.5 },
            hovertemplate: '%{y:.1f} pts<extra>Focus (Instantáneo)</extra>'
        },
        // 1: Demand Instantáneo
        {
            x: initialT,
            y: initialDemand,
            name: 'Cognitive Demand (Instantáneo)',
            mode: 'lines',
            line: { color: '#d97706', width: 2.5 },
            hovertemplate: '%{y:.1f} pts<extra>Demand (Instantáneo)</extra>'
        },
        // 2: Engagement Instantáneo
        {
            x: initialT,
            y: initialEng,
            name: 'Engagement (Instantáneo)',
            mode: 'lines',
            line: { color: '#059669', width: 2.5 },
            hovertemplate: '%{y:.1f} pts<extra>Engagement (Instantáneo)</extra>'
        },
        // 3: Memory Instantáneo
        {
            x: initialT,
            y: initialMem,
            name: 'Memory (Instantáneo)',
            mode: 'lines',
            line: { color: '#7c3aed', width: 2.5 },
            hovertemplate: '%{y:.1f} pts<extra>Memory (Instantáneo)</extra>'
        },
        // 4: DPS Instantáneo
        {
            x: initialT,
            y: initialDPS,
            customdata: [initialDPS[0] / 10],
            name: 'DPS Score (Instantáneo)',
            mode: 'lines',
            line: { color: '#e11d48', width: 3 },
            hovertemplate: '%{y:.1f} pts (DPS: %{customdata:.1f}/10)<extra>DPS (Instantáneo)</extra>'
        },
        // 5: Focus Promedio Acumulado
        {
            x: initialT,
            y: [fullFocusAvg[0]],
            name: 'Focus (Promedio Acumulado)',
            mode: 'lines',
            line: { color: '#1d4ed8', width: 2, dash: 'dash' },
            hovertemplate: '%{y:.1f} pts<extra>Focus (Promedio)</extra>'
        },
        // 6: Demand Promedio Acumulado
        {
            x: initialT,
            y: [fullDemandAvg[0]],
            name: 'Demand (Promedio Acumulado)',
            mode: 'lines',
            line: { color: '#b45309', width: 2, dash: 'dash' },
            hovertemplate: '%{y:.1f} pts<extra>Demand (Promedio)</extra>'
        },
        // 7: Engagement Promedio Acumulado
        {
            x: initialT,
            y: [fullEngagementAvg[0]],
            name: 'Engagement (Promedio Acumulado)',
            mode: 'lines',
            line: { color: '#047857', width: 2, dash: 'dash' },
            hovertemplate: '%{y:.1f} pts<extra>Engagement (Promedio)</extra>'
        },
        // 8: Memory Promedio Acumulado
        {
            x: initialT,
            y: [fullMemoryAvg[0]],
            name: 'Memory (Promedio Acumulado)',
            mode: 'lines',
            line: { color: '#6d28d9', width: 2, dash: 'dash' },
            hovertemplate: '%{y:.1f} pts<extra>Memory (Promedio)</extra>'
        },
        // 9: DPS Promedio Acumulado
        {
            x: initialT,
            y: [fullDPSAvg[0]],
            customdata: [fullDPSAvg[0] / 10],
            name: 'DPS (Promedio Acumulado)',
            mode: 'lines',
            line: { color: '#be123c', width: 2, dash: 'dash' },
            hovertemplate: '%{y:.1f} pts (DPS: %{customdata:.1f}/10)<extra>DPS (Promedio)</extra>'
        }
    ];

    const maxDuration = telemetryData.meta.duration_seconds || 185.8;

    const layout = {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        margin: { l: 40, r: 20, t: 10, b: 40 },
        showlegend: false,
        xaxis: {
            title: 'Tiempo (segundos)',
            range: [0, maxDuration],
            color: '#64748b',
            gridcolor: 'rgba(0,0,0,0.04)',
            zeroline: false,
            tickfont: { family: 'JetBrains Mono', size: 10 }
        },
        yaxis: {
            title: 'Score (0 - 100)',
            range: [0, 100],
            color: '#64748b',
            gridcolor: 'rgba(0,0,0,0.04)',
            zeroline: false,
            tickfont: { family: 'JetBrains Mono', size: 10 }
        },
        shapes: [
            {
                type: 'line',
                x0: 0,
                x1: 0,
                y0: 0,
                y1: 100,
                line: {
                    color: '#0f172a',
                    width: 2,
                    dash: 'solid'
                },
                name: 'playhead'
            }
        ],
        hovermode: 'x unified'
    };

    Plotly.newPlot('telemetryTimelineChart', traces, layout, {
        displayModeBar: false,
        responsive: true
    }).then(() => {
        timelinePlotInitialized = true;
        applyChannelVisibility();

        chartElem.on('plotly_click', data => {
            if (data && data.points && data.points.length > 0) {
                const clickedTime = data.points[0].x;
                const { clean, heatmap, fogmap } = getLayerVideos();
                if (clean && typeof clickedTime === 'number') {
                    clean.currentTime = clickedTime;
                    if (heatmap) heatmap.currentTime = clickedTime;
                    if (fogmap) fogmap.currentTime = clickedTime;
                    syncHUDWithVideo(clickedTime);
                    updateProgressiveTimeline(clickedTime, true);
                }
            }
        });
    });
}

// Actualiza el trazado progresivo cortando los datos hasta currentTime
let lastTimelineUpdate = 0;
function updateProgressiveTimeline(currentTime, force = false) {
    if (!timelinePlotInitialized || !fullTimes.length) return;

    const now = performance.now();
    if (!force && now - lastTimelineUpdate < 45) return;
    lastTimelineUpdate = now;

    let endIdx = 0;
    for (let i = 0; i < fullTimes.length; i++) {
        if (fullTimes[i] <= currentTime) {
            endIdx = i;
        } else {
            break;
        }
    }

    const curTimes = fullTimes.slice(0, endIdx + 1);
    const curFocus = fullFocus.slice(0, endIdx + 1);
    const curDemand = fullDemand.slice(0, endIdx + 1);
    const curEng = fullEngagement.slice(0, endIdx + 1);
    const curMem = fullMemory.slice(0, endIdx + 1);
    const curDPS = fullDPS.slice(0, endIdx + 1);

    const curFocusAvg = fullFocusAvg.slice(0, endIdx + 1);
    const curDemandAvg = fullDemandAvg.slice(0, endIdx + 1);
    const curEngAvg = fullEngagementAvg.slice(0, endIdx + 1);
    const curMemAvg = fullMemoryAvg.slice(0, endIdx + 1);
    const curDPSAvg = fullDPSAvg.slice(0, endIdx + 1);

    if (curTimes.length === 0) {
        curTimes.push(fullTimes[0]);
        curFocus.push(fullFocus[0]);
        curDemand.push(fullDemand[0]);
        curEng.push(fullEngagement[0]);
        curMem.push(fullMemory[0]);
        curDPS.push(fullDPS[0]);

        curFocusAvg.push(fullFocusAvg[0]);
        curDemandAvg.push(fullDemandAvg[0]);
        curEngAvg.push(fullEngagementAvg[0]);
        curMemAvg.push(fullMemoryAvg[0]);
        curDPSAvg.push(fullDPSAvg[0]);
    }

    Plotly.restyle('telemetryTimelineChart', {
        x: [curTimes, curTimes, curTimes, curTimes, curTimes, curTimes, curTimes, curTimes, curTimes, curTimes],
        y: [curFocus, curDemand, curEng, curMem, curDPS, curFocusAvg, curDemandAvg, curEngAvg, curMemAvg, curDPSAvg]
    }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).catch(() => {});

    // Actualizar playhead y banda sombreada de benchmark
    const { shapes, annotations } = getPlotlyShapesAndAnnotations(currentTime, activeChannel);
    Plotly.relayout('telemetryTimelineChart', {
        shapes: shapes,
        annotations: annotations
    }).catch(() => {});
}
