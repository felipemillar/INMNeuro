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
    renderBenchmarkControlChart();
    renderBenchmarkPrimingChart();
    renderSemanticDumbbellChart();

    iatChartsInitialized = true;
}

// Configuración común de layout para radar
const commonRadarLayout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    polar: {
        radialaxis: {
            visible: true,
            range: [0, 70],
            color: '#64748b',
            gridcolor: 'rgba(255,255,255,0.1)',
            tickfont: { family: 'JetBrains Mono', size: 9 },
            angle: 90
        },
        angularaxis: {
            tickfont: { family: 'JetBrains Mono', size: 10, color: '#f8fafc' },
            gridcolor: 'rgba(255,255,255,0.1)',
            linecolor: 'rgba(255,255,255,0.2)'
        },
        bgcolor: 'rgba(15, 23, 42, 0.4)'
    },
    showlegend: true,
    legend: {
        font: { family: 'JetBrains Mono', size: 11, color: '#94a3b8' },
        orientation: 'h',
        y: -0.1,
        x: 0.5,
        xanchor: 'center'
    },
    margin: { l: 40, r: 40, t: 30, b: 40 }
};

function renderMonadicChart() {
    const attributes = ['Tecnológico', 'Barato', 'Calidad', 'Futbol', 'Ecológico', 'Variedad', 'Demanda', 'Premium'];
    
    // Para cerrar el círculo en radar, se duplica el primer elemento al final
    const attrsClosed = [...attributes, attributes[0]];
    
    const controlVals = [29.3, 42.5, 42.7, 25.6, 31.2, 27.2, 9.0, 18.0];
    const controlClosed = [...controlVals, controlVals[0]];
    
    const primingVals = [51.4, 48.6, 52.4, 54.1, 49.0, 49.9, 24.0, 28.9];
    const primingClosed = [...primingVals, primingVals[0]];

    const traceControl = {
        type: 'scatterpolar',
        r: controlClosed,
        theta: attrsClosed,
        fill: 'toself',
        name: 'Charly (Sin Estímulo)',
        line: { color: '#64748b', width: 2 },
        fillcolor: 'rgba(100, 116, 139, 0.2)'
    };

    const tracePriming = {
        type: 'scatterpolar',
        r: primingClosed,
        theta: attrsClosed,
        fill: 'toself',
        name: 'Charly (Post-Priming)',
        line: { color: '#2563eb', width: 2.5 },
        fillcolor: 'rgba(37, 99, 235, 0.4)'
    };

    Plotly.newPlot('iatMonadicChart', [traceControl, tracePriming], commonRadarLayout, { displayModeBar: false, responsive: true });
}

function renderBenchmarkControlChart() {
    const attributes = ['Comodidad', 'Diseño', 'Durabilidad', 'Ecológico', 'Futbol', 'Premium', 'Rendimiento', 'Tecnología'];
    const attrsClosed = [...attributes, attributes[0]];
    
    const charlyVals = [20.8, 17.1, 20.5, 32.9, 19.0, 5.4, 15.4, 15.9];
    const charlyClosed = [...charlyVals, charlyVals[0]];
    
    const pumaVals = [35.0, 57.8, 48.6, 22.6, 42.9, 66.3, 49.3, 46.9];
    const pumaClosed = [...pumaVals, pumaVals[0]];

    const traceCharly = {
        type: 'scatterpolar',
        r: charlyClosed,
        theta: attrsClosed,
        fill: 'toself',
        name: 'Charly (Control)',
        line: { color: '#64748b', width: 2 },
        fillcolor: 'rgba(100, 116, 139, 0.3)'
    };

    const tracePuma = {
        type: 'scatterpolar',
        r: pumaClosed,
        theta: attrsClosed,
        fill: 'toself',
        name: 'Puma (Control)',
        line: { color: '#10b981', width: 2 },
        fillcolor: 'rgba(16, 185, 129, 0.2)'
    };

    const layout = JSON.parse(JSON.stringify(commonRadarLayout));
    layout.margin = { l: 20, r: 20, t: 20, b: 30 };
    
    Plotly.newPlot('iatBenchmarkControlChart', [traceCharly, tracePuma], layout, { displayModeBar: false, responsive: true });
}

function renderBenchmarkPrimingChart() {
    const attributes = ['Comodidad', 'Diseño', 'Durabilidad', 'Ecológico', 'Futbol', 'Premium', 'Rendimiento', 'Tecnología'];
    const attrsClosed = [...attributes, attributes[0]];
    
    const charlyVals = [29.6, 23.6, 26.3, 38.3, 35.1, 16.4, 15.0, 29.7];
    const charlyClosed = [...charlyVals, charlyVals[0]];
    
    const pumaVals = [30.8, 45.2, 44.2, 22.0, 32.9, 56.7, 52.5, 53.8];
    const pumaClosed = [...pumaVals, pumaVals[0]];

    const traceCharly = {
        type: 'scatterpolar',
        r: charlyClosed,
        theta: attrsClosed,
        fill: 'toself',
        name: 'Charly (Priming)',
        line: { color: '#2563eb', width: 2.5 },
        fillcolor: 'rgba(37, 99, 235, 0.4)'
    };

    const tracePuma = {
        type: 'scatterpolar',
        r: pumaClosed,
        theta: attrsClosed,
        fill: 'toself',
        name: 'Puma (Priming)',
        line: { color: '#10b981', width: 2 },
        fillcolor: 'rgba(16, 185, 129, 0.2)'
    };

    const layout = JSON.parse(JSON.stringify(commonRadarLayout));
    layout.margin = { l: 20, r: 20, t: 20, b: 30 };
    
    Plotly.newPlot('iatBenchmarkPrimingChart', [traceCharly, tracePuma], layout, { displayModeBar: false, responsive: true });
}

function renderSemanticDumbbellChart() {
    const leftPoles = ['Tecnológico', 'Barato', 'Calidad', 'Futbol', 'Ecológico', 'Variedad', 'Demanda', 'Premium'];
    const rightPoles = ['Artesanal', 'Caro', 'Deficiencia', 'Maratón', 'Contaminante', 'Demanda', 'Oferta', 'Comun'];
    
    const controlVals = [13.0, 29.0, 35.2, 1.6, 10.4, 6.7, -27.0, -20.0];
    const primingVals = [29.7, 21.3, 30.2, 36.9, 30.4, 31.7, -10.8, -23.0];
    const yVals = [0, 1, 2, 3, 4, 5, 6, 7];

    const shiftData = [];
    
    // Dummy invisible trace to force yaxis2 (right poles) to render
    shiftData.push({
        x: Array(leftPoles.length).fill(50),
        y: yVals,
        yaxis: 'y2',
        mode: 'markers',
        marker: { color: 'rgba(0,0,0,0)', size: 1 },
        showlegend: false,
        hoverinfo: 'none'
    });
    
    for (let i = 0; i < leftPoles.length; i++) {
        const c_val = controlVals[i];
        
        // Halo trace (Init: from 0 to c_val)
        shiftData.push({
            x: [0, c_val],
            y: [yVals[i], yVals[i]],
            mode: 'lines',
            line: { color: 'rgba(100, 116, 139, 0.15)', width: 16 }, // Thick transparent grey halo
            showlegend: false,
            hoverinfo: 'none'
        });

        // Trace 0,3,6...: Line connecting dots (Init: C_VAL to C_VAL, invisible)
        shiftData.push({
            x: [c_val, c_val],
            y: [yVals[i], yVals[i]],
            mode: 'lines',
            line: { color: 'rgba(0, 0, 0, 0)', width: 4 },
            showlegend: false,
            hoverinfo: 'none'
        });
        
        // Trace 1,4,7...: Control Dot (Init: Opacity 1.0)
        shiftData.push({
            x: [c_val], y: [yVals[i]],
            mode: 'markers+text', name: i===0 ? 'Control (Sin Estímulo)' : '',
            marker: { color: '#64748b', size: 16, line: {color: '#0f172a', width: 2}, opacity: 1.0 },
            showlegend: i === 0, text: c_val.toFixed(1), textposition: 'bottom center',
            textfont: { family: 'JetBrains Mono', color: '#475569', size: 10 },
            hoverinfo: 'text',
            hovertext: `${leftPoles[i]} vs ${rightPoles[i]}<br>Control: ${c_val.toFixed(1)}`
        });
        
        // Trace 2,5,8...: Priming Dot (Init: at C_VAL, Opacity 0)
        shiftData.push({
            x: [c_val], y: [yVals[i]],
            mode: 'markers+text', name: i===0 ? 'Priming (Post-Estímulo)' : '',
            marker: { color: '#2563eb', size: 16, opacity: 0, line: { color: '#ffffff', width: 2 } },
            showlegend: i === 0, text: c_val.toFixed(1), textposition: 'top center',
            textfont: { color: 'rgba(0,0,0,0)' },
            hoverinfo: 'text',
            hovertext: `${leftPoles[i]} vs ${rightPoles[i]}<br>Priming: ${primingVals[i].toFixed(1)}`
        });
    }

    const layout = {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        margin: { l: 150, r: 150, t: 30, b: 50 },
        showlegend: true,
        legend: {
            font: { family: 'JetBrains Mono', size: 11, color: '#475569' },
            orientation: 'h',
            y: -0.1,
            x: 0.5,
            xanchor: 'center'
        },
        xaxis: {
            range: [50, -50], // Eje X simétrico (50 a -50) para que el cero quede exactamente en el centro
            showgrid: true,
            gridcolor: 'rgba(0,0,0,0.05)', // Darker grid for light bg
            zeroline: true,
            zerolinecolor: '#334155', // Solid dark vertical line for zero
            zerolinewidth: 2,
            tickfont: { family: 'JetBrains Mono', color: '#475569' },
            title: { text: 'Puntaje IAT (Fuerza de Asociación)', font: { family: 'JetBrains Mono', color: '#475569', size: 10 } }
        },
        yaxis: {
            tickvals: yVals,
            ticktext: leftPoles,
            tickfont: { family: 'JetBrains Mono', color: '#334155', size: 11 }, // Darker font
            showgrid: false,
            zeroline: false
        },
        yaxis2: {
            tickvals: yVals,
            ticktext: rightPoles,
            tickfont: { family: 'JetBrains Mono', color: '#334155', size: 11 }, // Darker font
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
            
            const updateFrames = [];
            const traceIndices = [];
            
            for (let i = 0; i < leftPoles.length; i++) {
                const c_val = controlVals[i];
                const p_val = primingVals[i];
                
                // +1 is for the dummy trace we added at index 0
                // Now each attribute has 4 traces (Halo, Line, Control, Priming)
                const baseIdx = (i * 4) + 1;
                
                if (isPrimingOn) {
                    // Update Line (Halo from Control to Priming)
                    updateFrames.push({ x: [c_val, p_val], line: {color: 'rgba(37, 99, 235, 0.4)', width: 14} });
                    traceIndices.push(baseIdx + 1); // +1 to skip the zero-halo trace which is at baseIdx
                    
                    // Update Control Dot (Ghost)
                    updateFrames.push({ marker: {opacity: 0.3, size: 16, color: '#64748b', line: {color: 'rgba(15,23,42,0.3)', width: 2}} });
                    traceIndices.push(baseIdx + 2);
                    
                    // Update Priming Dot
                    updateFrames.push({ 
                        x: [p_val], 
                        marker: {opacity: 1.0, size: 16, color: '#2563eb', line: {color: '#ffffff', width: 2}}, 
                        text: [p_val.toFixed(1)],
                        textfont: { family: 'JetBrains Mono', color: '#60a5fa', size: 10 }
                    });
                    traceIndices.push(baseIdx + 3);
                    
                } else {
                    // Revert Line
                    updateFrames.push({ x: [c_val, c_val], line: {color: 'rgba(0, 0, 0, 0)', width: 4} });
                    traceIndices.push(baseIdx + 1);
                    
                    // Revert Control Dot
                    updateFrames.push({ marker: {opacity: 1.0, size: 16, color: '#64748b', line: {color: '#0f172a', width: 2}} });
                    traceIndices.push(baseIdx + 2);
                    
                    // Revert Priming Dot
                    updateFrames.push({ 
                        x: [c_val], 
                        marker: {opacity: 0, size: 16, color: '#2563eb', line: {color: '#ffffff', width: 2}}, 
                        text: [c_val.toFixed(1)],
                        textfont: {color: 'rgba(0,0,0,0)'}
                    });
                    traceIndices.push(baseIdx + 3);
                }
            }
            
            Plotly.animate('iatSemanticDumbbellChart', {
                data: updateFrames,
                traces: traceIndices
            }, {
                transition: { duration: 800, easing: 'cubic-in-out' },
                frame: { duration: 800 }
            });
        });
    }
}
