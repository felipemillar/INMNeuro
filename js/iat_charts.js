/**
 * IMNeuro Digital Predict - IAT Radar Charts
 * Handles the rendering of Monadic and Benchmark Implicit Association Tests
 */

document.addEventListener('DOMContentLoaded', () => {
    // Escuchar cambios de pestaña para redibujar si es necesario
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (link.dataset.view === 'iat') {
                setTimeout(initIATCharts, 100); // Pequeño delay para que el contenedor sea visible
            }
        });
    });
});

let iatChartsInitialized = false;

function initIATCharts() {
    if (iatChartsInitialized) return;
    
    // Solo inicializar si los contenedores existen
    if (!document.getElementById('iatMonadicChart')) return;

    renderMonadicChart();
    initUnifiedBenchmark();
    renderSemanticDumbbellChart();

    iatChartsInitialized = true;
}

// Configuración común de layout para radar (Light Tech Theme - Alta Legibilidad)
const commonRadarLayout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    polar: {
        radialaxis: {
            visible: true,
            range: [0, 70],
            dtick: 10,
            color: '#64748b',
            gridcolor: '#e2e8f0',
            linecolor: '#cbd5e1',
            tickfont: { family: 'JetBrains Mono', size: 9.5, color: '#64748b' },
            angle: 90
        },
        angularaxis: {
            tickfont: { family: 'Inter', size: 11.5, color: '#0f172a' },
            gridcolor: '#e2e8f0',
            linecolor: '#cbd5e1'
        },
        bgcolor: 'rgba(248, 250, 252, 0.7)'
    },
    showlegend: true,
    legend: {
        font: { family: 'JetBrains Mono', size: 11, color: '#334155' },
        orientation: 'h',
        y: -0.15,
        x: 0.5,
        xanchor: 'center'
    },
    margin: { l: 50, r: 50, t: 50, b: 45 }
};

function renderMonadicChart() {
    const attributes = ['Tecnológico', 'Barato', 'Calidad', 'Futbol', 'Ecológico', 'Variedad', 'Demanda', 'Premium'];
    const attrsClosed = [...attributes, attributes[0]];
    
    const controlVals = [29.3, 42.5, 42.7, 25.6, 31.2, 27.2, 9.0, 18.0];
    const controlClosed = [...controlVals, controlVals[0]];
    
    const primingVals = [51.4, 48.6, 52.4, 54.1, 49.0, 49.9, 24.0, 28.9];
    const primingClosed = [...primingVals, primingVals[0]];

    const traceControl = {
        type: 'scatterpolar',
        mode: 'lines+markers',
        r: controlClosed,
        theta: attrsClosed,
        fill: 'toself',
        name: 'Charly (Control)',
        line: { color: '#64748b', width: 2 },
        marker: { size: 6, color: '#64748b' },
        fillcolor: 'rgba(100, 116, 139, 0.15)'
    };

    const tracePriming = {
        type: 'scatterpolar',
        mode: 'lines+markers',
        r: primingClosed,
        theta: attrsClosed,
        fill: 'toself',
        name: 'Charly (Post-Priming)',
        line: { color: '#2563eb', width: 2.5 },
        marker: { size: 6, color: '#2563eb' },
        fillcolor: 'rgba(37, 99, 235, 0.25)'
    };

    const layout = JSON.parse(JSON.stringify(commonRadarLayout));
    layout.margin = { l: 50, r: 50, t: 50, b: 45 };

    Plotly.newPlot('iatMonadicChart', [traceControl, tracePriming], layout, { displayModeBar: false, responsive: true });
}

// ==========================================================================
// UNIFIED BENCHMARK CONTROLLER (Radar Morphing + Number Ticker Odometers)
// ==========================================================================

const benchmarkData = {
    attributes: ['Comodidad', 'Diseño', 'Durabilidad', 'Ecológico', 'Futbol', 'Premium', 'Rendimiento', 'Tecnología'],
    control: {
        charly: [20.8, 17.1, 20.5, 32.9, 19.0, 5.4, 15.4, 15.9],
        puma:   [35.0, 57.8, 48.6, 22.6, 42.9, 66.3, 49.3, 46.9],
        leaders: ['puma', 'puma', 'puma', 'charly', 'puma', 'puma', 'puma', 'puma'],
        insight: "<strong>Hallazgo Control (Sin Estímulo):</strong> Puma lidera en 7 de los 8 atributos (comodidad, durabilidad, diseño y calidad). Charly supera a Puma exclusivamente en el atributo <strong>Ecológico (32.9 vs 22.6)</strong>, convirtiéndose en su principal vector de diferenciación natural."
    },
    priming: {
        charly: [29.6, 23.6, 26.3, 38.3, 35.1, 16.4, 15.0, 29.7],
        puma:   [30.8, 45.2, 44.2, 22.0, 32.9, 56.7, 52.5, 53.8],
        deltasCharly: [8.8, 6.5, 5.8, 5.4, 16.1, 11.0, -0.4, 13.8],
        deltasPuma:   [-4.2, -12.6, -4.4, -0.6, -10.0, -9.6, 3.2, 6.9],
        leaders: ['puma', 'puma', 'puma', 'charly', 'charly', 'puma', 'puma', 'puma'],
        insight: "<strong>Hallazgo Priming (Post-Campaña):</strong> Tras la exposición publicitaria, Puma mantiene liderazgo en diseño y tecnología, mientras que <strong>Charly consolida su ventaja en Ecológico (38.3 vs 22.0) y revierte el atributo Fútbol (35.1 vs 32.9)</strong> pasando a liderar la categoría deportiva."
    }
};

let currentBenchmarkMode = 'control';

function initUnifiedBenchmark() {
    renderUnifiedBenchmarkChart('control');
    setupBenchmarkToggle();
}

let currentRadarAnimation = null;

function animateRadarChart(fromMode, toMode, duration = 600) {
    const targetElem = document.getElementById('iatUnifiedBenchmarkChart');
    if (!targetElem || !targetElem.data || targetElem.data.length < 2) return;

    const fromCharly = benchmarkData[fromMode].charly;
    const toCharly = benchmarkData[toMode].charly;
    const fromPuma = benchmarkData[fromMode].puma;
    const toPuma = benchmarkData[toMode].puma;

    const startTime = performance.now();

    if (currentRadarAnimation) {
        cancelAnimationFrame(currentRadarAnimation);
    }

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);

        const currentCharly = fromCharly.map((v, i) => v + (toCharly[i] - v) * ease);
        const currentPuma = fromPuma.map((v, i) => v + (toPuma[i] - v) * ease);

        const charlyClosed = [...currentCharly, currentCharly[0]];
        const pumaClosed = [...currentPuma, currentPuma[0]];

        targetElem.data[0].r = charlyClosed;
        targetElem.data[1].r = pumaClosed;
        Plotly.redraw('iatUnifiedBenchmarkChart');

        if (progress < 1) {
            currentRadarAnimation = requestAnimationFrame(step);
        } else {
            currentRadarAnimation = null;
        }
    }

    currentRadarAnimation = requestAnimationFrame(step);
}

function renderUnifiedBenchmarkChart(mode) {
    const targetElem = document.getElementById('iatUnifiedBenchmarkChart');
    if (!targetElem) return;

    const attrs = benchmarkData.attributes;
    const attrsClosed = [...attrs, attrs[0]];

    const charlyVals = benchmarkData[mode].charly;
    const charlyClosed = [...charlyVals, charlyVals[0]];

    const pumaVals = benchmarkData[mode].puma;
    const pumaClosed = [...pumaVals, pumaVals[0]];

    const traceCharly = {
        type: 'scatterpolar',
        mode: 'lines+markers',
        r: charlyClosed,
        theta: attrsClosed,
        fill: 'toself',
        name: 'Charly',
        line: { color: '#ea580c', width: 2.5 },
        marker: { size: 6, color: '#ea580c' },
        fillcolor: 'rgba(234, 88, 12, 0.18)'
    };

    const tracePuma = {
        type: 'scatterpolar',
        mode: 'lines+markers',
        r: pumaClosed,
        theta: attrsClosed,
        fill: 'toself',
        name: 'Puma',
        line: { color: '#0284c7', width: 2.5 },
        marker: { size: 6, color: '#0284c7' },
        fillcolor: 'rgba(2, 132, 199, 0.18)'
    };

    const layout = JSON.parse(JSON.stringify(commonRadarLayout));
    layout.margin = { l: 55, r: 55, t: 55, b: 45 };

    Plotly.newPlot('iatUnifiedBenchmarkChart', [traceCharly, tracePuma], layout, { displayModeBar: false, responsive: true });
}

// Odómetro / Ticker para números animados
function animateNumberTicker(elem, startVal, endVal, duration, deltaStr = null, deltaClass = 'pos') {
    const startTime = performance.now();
    const valElem = elem.querySelector('.bm-val');
    const deltaElem = elem.querySelector('.bm-delta');

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = startVal + (endVal - startVal) * easeProgress;
        
        if (valElem) {
            valElem.textContent = currentVal.toFixed(1);
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (valElem) valElem.textContent = endVal.toFixed(1);
            if (deltaElem) {
                if (deltaStr) {
                    deltaElem.textContent = deltaStr;
                    deltaElem.className = 'bm-delta ' + deltaClass;
                    deltaElem.style.display = 'inline-block';
                } else {
                    deltaElem.style.display = 'none';
                }
            }
        }
    }
    requestAnimationFrame(update);
}

function updateBenchmarkTable(fromMode, toMode) {
    const fromCharly = benchmarkData[fromMode].charly;
    const toCharly = benchmarkData[toMode].charly;
    const fromPuma = benchmarkData[fromMode].puma;
    const toPuma = benchmarkData[toMode].puma;
    const leaders = benchmarkData[toMode].leaders;
    const isPriming = (toMode === 'priming');

    // Insight text
    const insightElem = document.getElementById('benchmarkInsightText');
    if (insightElem) {
        insightElem.style.opacity = '0.3';
        insightElem.style.transition = 'opacity 0.2s ease';
        setTimeout(() => {
            insightElem.innerHTML = benchmarkData[toMode].insight;
            insightElem.style.opacity = '1';
        }, 200);
    }

    benchmarkData.attributes.forEach((_, i) => {
        const charlyElem = document.getElementById(`bmCharly-${i}`);
        const pumaElem = document.getElementById(`bmPuma-${i}`);
        const leaderElem = document.getElementById(`bmLeader-${i}`);
        const rowElem = document.getElementById(`bmRow-${i}`);

        // Charly delta
        let charlyDeltaStr = null;
        let charlyDeltaClass = 'pos';
        if (isPriming) {
            const deltaVal = benchmarkData.priming.deltasCharly[i];
            charlyDeltaStr = `(${deltaVal > 0 ? '+' : ''}${deltaVal.toFixed(1)})`;
            charlyDeltaClass = deltaVal >= 0 ? 'pos' : 'neg';
        }

        // Puma delta
        let pumaDeltaStr = null;
        let pumaDeltaClass = 'pos';
        if (isPriming) {
            const deltaVal = benchmarkData.priming.deltasPuma[i];
            pumaDeltaStr = `(${deltaVal > 0 ? '+' : ''}${deltaVal.toFixed(1)})`;
            pumaDeltaClass = deltaVal >= 0 ? 'pos' : 'neg';
        }

        if (charlyElem) {
            animateNumberTicker(charlyElem, fromCharly[i], toCharly[i], 600, charlyDeltaStr, charlyDeltaClass);
        }
        if (pumaElem) {
            animateNumberTicker(pumaElem, fromPuma[i], toPuma[i], 600, pumaDeltaStr, pumaDeltaClass);
        }

        // Leader badge & Row highlights
        if (leaderElem) {
            const leader = leaders[i];
            if (leader === 'charly') {
                leaderElem.innerHTML = `<span class="winner-badge charly">Charly ★</span>`;
                if (charlyElem) charlyElem.classList.add('highlight-win');
                if (rowElem) rowElem.classList.add('charly-win-row');
            } else {
                leaderElem.innerHTML = `<span class="winner-badge puma">Puma</span>`;
                if (charlyElem) charlyElem.classList.remove('highlight-win');
                if (rowElem) rowElem.classList.remove('charly-win-row');
            }
        }
    });
}

function setupBenchmarkToggle() {
    const toggle = document.getElementById('benchmarkToggle');
    const lblControl = document.getElementById('lblBmControl');
    const lblPriming = document.getElementById('lblBmPriming');

    if (!toggle) return;

    toggle.addEventListener('change', (e) => {
        const newMode = e.target.checked ? 'priming' : 'control';
        const prevMode = currentBenchmarkMode;
        if (newMode === prevMode) return;

        currentBenchmarkMode = newMode;

        if (newMode === 'priming') {
            lblControl.classList.remove('active');
            lblPriming.classList.add('active');
        } else {
            lblPriming.classList.remove('active');
            lblControl.classList.add('active');
        }

        animateRadarChart(prevMode, newMode, 600);
        updateBenchmarkTable(prevMode, newMode);
    });

    if (lblControl) {
        lblControl.addEventListener('click', () => {
            if (toggle.checked) {
                toggle.checked = false;
                toggle.dispatchEvent(new Event('change'));
            }
        });
    }

    if (lblPriming) {
        lblPriming.addEventListener('click', () => {
            if (!toggle.checked) {
                toggle.checked = true;
                toggle.dispatchEvent(new Event('change'));
            }
        });
    }
}

let currentSemanticDumbbellAnimation = null;

function renderSemanticDumbbellChart() {
    const leftPoles = ['Tecnológico', 'Barato', 'Calidad', 'Futbol', 'Ecológico', 'Variedad', 'Demanda', 'Premium'];
    const rightPoles = ['Artesanal', 'Caro', 'Deficiencia', 'Maratón', 'Contaminante', 'Demanda', 'Oferta', 'Comun'];
    
    const controlVals = [13.0, 29.0, 35.2, 1.6, 10.4, 6.7, -27.0, -20.0];
    const primingVals = [29.7, 21.3, 30.2, 36.9, 30.4, 31.7, -10.8, -23.0];
    const yVals = [7, 6, 5, 4, 3, 2, 1, 0]; // Orden de arriba a abajo idéntico a la tabla de impacto

    const shiftData = [];
    
    // Trace 0: Dummy invisible trace to force yaxis2 (right poles) to render
    shiftData.push({
        x: Array(leftPoles.length).fill(50),
        y: yVals,
        yaxis: 'y2',
        mode: 'markers',
        marker: { color: 'rgba(0,0,0,0)', size: 1 },
        showlegend: false,
        hoverinfo: 'none'
    });

    // Trace 1: Legend item - Control
    shiftData.push({
        x: [null],
        y: [null],
        mode: 'markers',
        name: 'Control (Sin Estímulo)',
        marker: { color: '#64748b', size: 14, line: { color: '#0f172a', width: 2 } },
        showlegend: true
    });

    // Trace 2: Legend item - Priming Positivo (Hacia la Izquierda)
    shiftData.push({
        x: [null],
        y: [null],
        mode: 'lines+markers',
        name: 'Priming (+) Desplazamiento a Favor (Izquierda)',
        line: { color: 'rgba(37, 99, 235, 0.7)', width: 6 },
        marker: { color: '#2563eb', size: 14, line: { color: '#ffffff', width: 2 } },
        showlegend: true
    });

    // Trace 3: Legend item - Priming Negativo (Hacia la Derecha)
    shiftData.push({
        x: [null],
        y: [null],
        mode: 'lines+markers',
        name: 'Priming (-) Desplazamiento en Contra (Derecha)',
        line: { color: 'rgba(239, 68, 68, 0.7)', width: 6 },
        marker: { color: '#ef4444', size: 14, line: { color: '#ffffff', width: 2 } },
        showlegend: true
    });
    
    for (let i = 0; i < leftPoles.length; i++) {
        const c_val = controlVals[i];
        const p_val = primingVals[i];
        const isPositiveShift = p_val >= c_val;
        const shiftColor = isPositiveShift ? '#2563eb' : '#ef4444';
        const shiftLineColor = isPositiveShift ? 'rgba(37, 99, 235, 0.45)' : 'rgba(239, 68, 68, 0.45)';
        const shiftTextColor = isPositiveShift ? '#2563eb' : '#dc2626';
        
        // Halo trace (Init: from 0 to c_val)
        shiftData.push({
            x: [0, c_val],
            y: [yVals[i], yVals[i]],
            mode: 'lines',
            line: { color: 'rgba(100, 116, 139, 0.15)', width: 16 },
            showlegend: false,
            hoverinfo: 'none'
        });

        // Trace for Shift Line connecting dots
        shiftData.push({
            x: [c_val, c_val],
            y: [yVals[i], yVals[i]],
            mode: 'lines',
            line: { color: shiftLineColor, width: 0 },
            showlegend: false,
            hoverinfo: 'none'
        });
        
        // Trace for Control Dot (Init: Opacity 1.0)
        shiftData.push({
            x: [c_val], y: [yVals[i]],
            mode: 'markers+text',
            showlegend: false,
            marker: { color: '#64748b', size: 16, line: { color: '#0f172a', width: 2 }, opacity: 1.0 },
            text: [c_val.toFixed(1)],
            textposition: 'bottom center',
            textfont: { family: 'JetBrains Mono', color: '#475569', size: 10 },
            hoverinfo: 'text',
            hovertext: `${leftPoles[i]} vs ${rightPoles[i]}<br>Control: ${c_val.toFixed(1)}`
        });
        
        // Trace for Priming Dot (Init: at C_VAL, Opacity 0, No text in Control mode)
        shiftData.push({
            x: [c_val], y: [yVals[i]],
            mode: 'markers+text',
            showlegend: false,
            marker: { color: shiftColor, size: 16, opacity: 0, line: { color: '#ffffff', width: 2 } },
            text: [''],
            textposition: 'top center',
            textfont: { family: 'JetBrains Mono', color: 'rgba(0,0,0,0)', size: 10.5 },
            hoverinfo: 'text',
            hovertext: `${leftPoles[i]} vs ${rightPoles[i]}<br>Priming: ${p_val.toFixed(1)} (${isPositiveShift ? '+' : ''}${(p_val - c_val).toFixed(1)})`
        });
    }

    const layout = {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        margin: { l: 150, r: 150, t: 30, b: 60 },
        showlegend: true,
        legend: {
            font: { family: 'JetBrains Mono', size: 10.5, color: '#475569' },
            orientation: 'h',
            y: -0.14,
            x: 0.5,
            xanchor: 'center'
        },
        xaxis: {
            range: [50, -50], // Eje X simétrico (50 a -50) para que el cero quede exactamente en el centro
            showgrid: true,
            gridcolor: 'rgba(0,0,0,0.05)',
            zeroline: true,
            zerolinecolor: '#334155',
            zerolinewidth: 2,
            tickfont: { family: 'JetBrains Mono', color: '#475569' },
            title: { text: 'Puntaje IAT (Fuerza de Asociación)', font: { family: 'JetBrains Mono', color: '#475569', size: 10 } }
        },
        yaxis: {
            tickvals: yVals,
            ticktext: leftPoles,
            tickfont: { family: 'JetBrains Mono', color: '#334155', size: 11 },
            showgrid: false,
            zeroline: false
        },
        yaxis2: {
            tickvals: yVals,
            ticktext: rightPoles,
            tickfont: { family: 'JetBrains Mono', color: '#334155', size: 11 },
            overlaying: 'y',
            side: 'right',
            showgrid: false,
            zeroline: false
        },
        hovermode: 'closest'
    };

    Plotly.newPlot('iatSemanticDumbbellChart', shiftData, layout, { displayModeBar: false, responsive: true });

    // Toggle Animation Logic
    const toggle = document.getElementById('iatSemanticToggle');
    if (toggle) {
        toggle.addEventListener('change', function(e) {
            const isPrimingOn = e.target.checked;
            
            // Update labels
            const labels = document.querySelectorAll('.priming-toggle-container .toggle-label');
            if (isPrimingOn) {
                labels[0].classList.remove('active');
                labels[1].classList.add('active');
            } else {
                labels[1].classList.remove('active');
                labels[0].classList.add('active');
            }
            
            animateSemanticDumbbellChart(isPrimingOn, 650);
        });
    }
}

function animateSemanticDumbbellChart(isPrimingOn, duration = 650) {
    const targetElem = document.getElementById('iatSemanticDumbbellChart');
    if (!targetElem || !targetElem.data) return;

    const leftPoles = ['Tecnológico', 'Barato', 'Calidad', 'Futbol', 'Ecológico', 'Variedad', 'Demanda', 'Premium'];
    const controlVals = [13.0, 29.0, 35.2, 1.6, 10.4, 6.7, -27.0, -20.0];
    const primingVals = [29.7, 21.3, 30.2, 36.9, 30.4, 31.7, -10.8, -23.0];

    if (currentSemanticDumbbellAnimation) {
        cancelAnimationFrame(currentSemanticDumbbellAnimation);
    }

    const startTime = performance.now();

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);

        for (let i = 0; i < leftPoles.length; i++) {
            const c_val = controlVals[i];
            const p_val = primingVals[i];
            const isPositiveShift = p_val >= c_val;
            
            const lineColor = isPositiveShift ? 'rgba(37, 99, 235, 0.45)' : 'rgba(239, 68, 68, 0.45)';
            const dotColor = isPositiveShift ? '#2563eb' : '#ef4444';
            const textFontColor = isPositiveShift ? '#2563eb' : '#dc2626';
            
            const baseIdx = 4 + (i * 4);
            const lineTrace = targetElem.data[baseIdx + 1];
            const controlTrace = targetElem.data[baseIdx + 2];
            const primingTrace = targetElem.data[baseIdx + 3];

            if (!lineTrace || !controlTrace || !primingTrace) continue;

            if (isPrimingOn) {
                const currentX = c_val + (p_val - c_val) * ease;
                
                // Shift Line
                lineTrace.x = [c_val, currentX];
                lineTrace.line.color = lineColor;
                lineTrace.line.width = 14;
                
                // Control Dot (Fade out slightly to 0.35)
                controlTrace.marker.opacity = 1.0 - (0.65 * ease);
                
                // Priming Dot (Fade in to 1.0 at currentX with exact color)
                primingTrace.x = [currentX];
                primingTrace.marker.opacity = ease;
                primingTrace.marker.color = dotColor;
                primingTrace.text = [currentX.toFixed(1)];
                primingTrace.textfont.color = textFontColor;
            } else {
                const currentX = p_val + (c_val - p_val) * ease;
                
                // Shift Line
                lineTrace.x = [c_val, currentX];
                lineTrace.line.color = lineColor;
                lineTrace.line.width = 14 * (1 - ease);
                
                // Control Dot (Fade in back to 1.0)
                controlTrace.marker.opacity = 0.35 + (0.65 * ease);
                
                // Priming Dot (Fade out back to 0 and remove text)
                primingTrace.x = [currentX];
                primingTrace.marker.opacity = 1.0 - ease;
                primingTrace.marker.color = dotColor;
                if (progress >= 1) {
                    primingTrace.text = [''];
                    primingTrace.textfont.color = 'rgba(0,0,0,0)';
                } else {
                    primingTrace.text = [currentX.toFixed(1)];
                    primingTrace.textfont.color = textFontColor;
                }
            }
        }

        Plotly.redraw('iatSemanticDumbbellChart');

        if (progress < 1) {
            currentSemanticDumbbellAnimation = requestAnimationFrame(step);
        } else {
            currentSemanticDumbbellAnimation = null;
        }
    }

    currentSemanticDumbbellAnimation = requestAnimationFrame(step);
}

