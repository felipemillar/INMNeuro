// Global Variables
let appData = null;

// Global Plotly Layout Config (Minimalist Tech Light)
const layoutConfig = {
    font: { family: "'Space Grotesk', 'Inter', monospace", color: '#0f172a' },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 20, r: 20, b: 40, l: 40 },
    colorway: ['#0f172a', '#3b82f6', '#10b981', '#ef4444', '#94a3b8']
};

const axisConfig = {
    gridcolor: '#e2e8f0',
    zerolinecolor: '#cbd5e1',
    linecolor: '#cbd5e1'
};

// Navigation Logic
document.addEventListener('DOMContentLoaded', () => {
    fetchDataAndInitialize();
});

async function fetchDataAndInitialize() {
    try {
        const response = await fetch('./data/data.json');
        if (!response.ok) throw new Error("Failed to load data.json");
        appData = await response.json();
        
        initNavigation();
        updateKPIs();
        initCharts();
        
        // Resize handling for Plotly
        window.addEventListener('resize', () => {
            const chartIds = [
                'ageDistributionChart', 'groupCompositionChart', 'primingShiftChart', 
                'frictionScatterChart', 'audiencePieChart', 'telemetryTimelineChart',
                'iatUnifiedBenchmarkChart', 'iatSemanticDumbbellChart',
                'paradigmMacroChart', 'paradigmKChart', 'paradigmDonutChart'
            ];
            chartIds.forEach(id => {
                if (document.getElementById(id) && typeof Plotly !== 'undefined') Plotly.Plots.resize(id);
            });
        });
    } catch (error) {
        console.error("Error loading dashboard data:", error);
        document.body.innerHTML = `<div style="padding:2rem;color:red;font-family:monospace;">Error loading data: ${error.message}</div>`;
    }
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links li');
    const views = document.querySelectorAll('.view');
    const viewTitle = document.getElementById('view-title');
    const viewSubtitle = document.getElementById('view-subtitle');

    const viewMeta = {
        'telemetry': { title: '[ DIGITAL PREDICT ]', sub: 'BIOMETRIC_TELEMETRY_AND_TIMELINE_SYNC' },
        'eyetracking': { title: '[ EYE TRACKING ]', sub: 'MÓDULO DE ANÁLISIS VISUAL' },
        'iat': { title: '[ ASOCIACIONES IMPLÍCITAS ]', sub: 'DEMO CHARLY VS PUMA' },
        'paradigma': { title: '[ PARADIGMA CHARLY ]', sub: 'ESTUDIO MULTI-MARCA & SHELF TEST GÓNDOLA (67 SLIDES)' },
        'identidad': { title: '[ IDENTIDAD VISUAL ]', sub: 'BRANDGUARD™ & BRAND BOOK AUDIT' },
        'settings': { title: '[ AJUSTES ]', sub: 'CONFIGURACIÓN DEL SISTEMA' },
        'overview': { title: '[ SYS_OVERVIEW ]', sub: 'PIPELINE_METRICS_AND_VALIDATION' },
        'priming': { title: '[ TARGET_AR ]', sub: 'TARGET_VS_CONTROL_DELTA' },
        'friction': { title: '[ FRICTION_MS ]', sub: 'Y: REL_LATENCY | X: ASSOCIATION_RATE' },
        'audience': { title: '[ SEGMENTATION ]', sub: 'POLARIZATION_VS_AMBIVALENCE' }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const targetView = link.getAttribute('data-view');
            views.forEach(v => v.classList.remove('active'));
            const targetElem = document.getElementById(targetView);
            if (targetElem) targetElem.classList.add('active');

            if (viewMeta[targetView]) {
                viewTitle.textContent = viewMeta[targetView].title;
                viewSubtitle.textContent = viewMeta[targetView].sub;
            }
            
            // Plotly redraw when becoming visible
            window.dispatchEvent(new Event('resize'));
            if (targetView === 'iat') {
                setTimeout(() => {
                    if (typeof initIATCharts === 'function') initIATCharts();
                    if (document.getElementById('iatSemanticDumbbellChart')) Plotly.Plots.resize('iatSemanticDumbbellChart');
                    if (document.getElementById('iatUnifiedBenchmarkChart')) Plotly.Plots.resize('iatUnifiedBenchmarkChart');
                }, 80);
            }
            if (targetView === 'paradigma') {
                setTimeout(() => {
                    if (typeof initParadigmaCharts === 'function') initParadigmaCharts();
                    if (document.getElementById('paradigmMacroChart')) Plotly.Plots.resize('paradigmMacroChart');
                    if (document.getElementById('paradigmKChart')) Plotly.Plots.resize('paradigmKChart');
                    if (document.getElementById('paradigmDonutChart')) Plotly.Plots.resize('paradigmDonutChart');
                }, 80);
            }
            if (targetView === 'identidad') {
                setTimeout(() => {
                    if (typeof initIdentidadModule === 'function') initIdentidadModule();
                }, 80);
            }
        });
    });
}

function updateKPIs() {
    const kpiN = document.getElementById('kpi-n');
    const kpiExcl = document.getElementById('kpi-exclusion');
    const kpiMatch = document.getElementById('kpi-match');

    if (kpiN) kpiN.textContent = appData.overview.n_total;
    if (kpiExcl) kpiExcl.textContent = appData.overview.exclusion_rate;
    if (kpiMatch) kpiMatch.textContent = appData.overview.excel_match_rate;
}

function initCharts() {
    // 1. Age Distribution (Treemap)
    if (document.getElementById('ageDistributionChart')) {
        const ageLabels = Object.keys(appData.overview.demographics.age);
        const ageCounts = Object.values(appData.overview.demographics.age);
        
        const ageData = [{
            type: "treemap",
            labels: ageLabels,
            parents: ageLabels.map(() => 'Muestra'),
            values: ageCounts,
            textinfo: "label+value+percent parent",
            marker: {
                colors: ['#0f172a', '#3b82f6', '#10b981', '#94a3b8'],
                line: { width: 2, color: '#ffffff' }
            }
        }];
        Plotly.newPlot('ageDistributionChart', ageData, { ...layoutConfig, margin: {t:0, l:0, r:0, b:0} }, {displayModeBar: false});
    }

    // 2. Group Composition (Stacked Horizontal Bar)
    if (document.getElementById('groupCompositionChart')) {
        const groupLabels = Object.keys(appData.overview.demographics.groups);
        const groupCounts = Object.values(appData.overview.demographics.groups);
        
        const groupDataObj = groupLabels.map((label, index) => ({
            y: ['Grupos'], x: [groupCounts[index]],
            name: label, type: 'bar', orientation: 'h',
            marker: { color: index === 0 ? '#e2e8f0' : '#3b82f6', line: {width: 2, color: '#ffffff'} }
        }));
        
        const groupLayout = { 
            ...layoutConfig, 
            barmode: 'stack', 
            xaxis: { visible: false }, 
            yaxis: { visible: false },
            margin: {t:20, b:20, l:0, r:0},
            showlegend: true,
            legend: { orientation: 'h', y: 1.2 }
        };
        Plotly.newPlot('groupCompositionChart', groupDataObj, groupLayout, {displayModeBar: false});
    }

    // 3. Priming Shift (Dumbbell Plot) - Animatable
    if (document.getElementById('primingShiftChart')) {
        const shiftData = [];
        appData.priming.labels.forEach((label, i) => {
            const c_ar = appData.priming.control_ar[i];
            
            // Trace 0,3,6...: Line connecting dots (Init: C_AR to C_AR, invisible)
            shiftData.push({
                x: [c_ar, c_ar],
                y: [label, label],
                mode: 'lines',
                line: { color: 'rgba(203, 213, 225, 0)', width: 4 },
                showlegend: false
            });
            
            // Trace 1,4,7...: Control Dot (Init: Opacity 1.0)
            shiftData.push({
                x: [c_ar], y: [label],
                mode: 'markers+text', name: i===0 ? 'Control' : '',
                marker: { color: '#e2e8f0', size: 16, line: {color: '#94a3b8', width: 2}, opacity: 1.0 },
                showlegend: i === 0, text: c_ar.toFixed(1)+'%', textposition: 'bottom center'
            });
            
            // Trace 2,5,8...: Priming Dot (Init: at C_AR, Opacity 0)
            shiftData.push({
                x: [c_ar], y: [label],
                mode: 'markers+text', name: i===0 ? 'Priming' : '',
                marker: { color: '#0f172a', size: 16, opacity: 0 },
                showlegend: i === 0, text: c_ar.toFixed(1)+'%', textposition: 'top center',
                textfont: { color: 'rgba(0,0,0,0)' }
            });
        });
        
        const shiftLayout = {
            ...layoutConfig,
            xaxis: { ...axisConfig, title: 'Association Rate (%)', range: [0, 100] },
            yaxis: { ...axisConfig, automargin: true },
            yaxis2: { 
                ...axisConfig, 
                automargin: true, 
                overlaying: 'y', 
                side: 'right',
                tickvals: appData.priming.labels,
                ticktext: appData.priming.labels.map(l => {
                    const ops = {
                        'tecnologico': 'artesanal',
                        'premium': 'común',
                        'barato': 'caro',
                        'futbol': 'maratón',
                        'variedad': 'limitado',
                        'oferta': 'demanda',
                        'calidad': 'deficiencia',
                        'ecologico': 'contaminante'
                    };
                    return ops[l] || l;
                }),
                showgrid: false
            },
            hovermode: 'closest'
        };
        Plotly.newPlot('primingShiftChart', shiftData, shiftLayout, {displayModeBar: false});
    }

    // 3.1 Priming Toggle Animation Logic
    const primingToggle = document.getElementById('primingToggle');
    if (primingToggle) {
        // Set initial label active state
        document.querySelectorAll('.priming-toggle-container .toggle-label')[0].classList.add('active');
        
        primingToggle.addEventListener('change', function(e) {
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
            
            appData.priming.labels.forEach((label, i) => {
                const c_ar = appData.priming.control_ar[i];
                const p_ar = appData.priming.priming_ar[i];
                
                const baseIdx = i * 3;
                
                if (isPrimingOn) {
                    // Update Line
                    updateFrames.push({ x: [c_ar, p_ar], line: {color: '#cbd5e1', width: 4} });
                    traceIndices.push(baseIdx);
                    
                    // Update Control Dot (Ghost)
                    updateFrames.push({ marker: {opacity: 0.3, size: 16, color: '#e2e8f0', line: {color: 'rgba(148, 163, 184, 0.3)', width: 2}} });
                    traceIndices.push(baseIdx + 1);
                    
                    // Update Priming Dot
                    updateFrames.push({ 
                        x: [p_ar], 
                        marker: {opacity: 1.0, size: 16, color: '#0f172a'}, 
                        text: [p_ar.toFixed(1)+'%'],
                        textfont: {color: '#0f172a'}
                    });
                    traceIndices.push(baseIdx + 2);
                    
                } else {
                    // Revert Line
                    updateFrames.push({ x: [c_ar, c_ar], line: {color: 'rgba(203, 213, 225, 0)', width: 4} });
                    traceIndices.push(baseIdx);
                    
                    // Revert Control Dot
                    updateFrames.push({ marker: {opacity: 1.0, size: 16, color: '#e2e8f0', line: {color: '#94a3b8', width: 2}} });
                    traceIndices.push(baseIdx + 1);
                    
                    // Revert Priming Dot
                    updateFrames.push({ 
                        x: [c_ar], 
                        marker: {opacity: 0, size: 16, color: '#0f172a'}, 
                        text: [c_ar.toFixed(1)+'%'],
                        textfont: {color: 'rgba(0,0,0,0)'}
                    });
                    traceIndices.push(baseIdx + 2);
                }
            });
            
            Plotly.animate('primingShiftChart', {
                data: updateFrames,
                traces: traceIndices
            }, {
                transition: { duration: 800, easing: 'cubic-in-out' },
                frame: { duration: 800 }
            });
        });
    }

    // 4. Friction Scatter
    if (document.getElementById('frictionScatterChart')) {
        const scatterData = [
            {
                x: appData.friction.control.ar,
                y: appData.friction.control.latency,
                mode: 'markers',
                type: 'scatter',
                name: 'Control',
                marker: { color: '#94a3b8', size: 12, opacity: 0.8, line: {width: 1, color: '#ffffff'} },
                text: appData.friction.attributes,
                hovertemplate: 'Atributo: %{text}<br>AR: %{x:.1f}%<br>Lat: %{y:.2f}x<extra></extra>'
            },
            {
                x: appData.friction.priming.ar,
                y: appData.friction.priming.latency,
                mode: 'markers',
                type: 'scatter',
                name: 'Priming',
                marker: { color: '#3b82f6', size: 12, opacity: 0.8, line: {width: 1, color: '#ffffff'} },
                text: appData.friction.attributes,
                hovertemplate: 'Atributo: %{text}<br>AR: %{x:.1f}%<br>Lat: %{y:.2f}x<extra></extra>'
            }
        ];

        const scatterLayout = {
            ...layoutConfig,
            showlegend: true,
            xaxis: { ...axisConfig, title: 'Association Rate (%)', range: [0, 100] },
            yaxis: { ...axisConfig, title: 'Rel. Latency (vs Baseline)' },
            legend: { orientation: 'h', y: 1.1 }
        };
        Plotly.newPlot('frictionScatterChart', scatterData, scatterLayout, {displayModeBar: false});
    }

    // 5. Audience Segments (Sunburst)
    if (document.getElementById('audiencePieChart')) {
        const c_vals = appData.audience.control.values;
        const p_vals = appData.audience.priming.values;
        const c_total = c_vals.reduce((a,b)=>a+b, 0);
        const p_total = p_vals.reduce((a,b)=>a+b, 0);
        const total = c_total + p_total;
        
        const audienceData = [{
            type: "sunburst",
            labels: [
                'Audiencia Total', 
                'Control', 'Priming', 
                'C - Polarizado', 'C - Ambivalente', 'C - Distante',
                'P - Polarizado', 'P - Ambivalente', 'P - Distante'
            ],
            parents: [
                '', 
                'Audiencia Total', 'Audiencia Total', 
                'Control', 'Control', 'Control',
                'Priming', 'Priming', 'Priming'
            ],
            values: [
                total,
                c_total, p_total,
                c_vals[0], c_vals[1], c_vals[2],
                p_vals[0], p_vals[1], p_vals[2]
            ],
            outsidetextfont: {size: 20, color: "#0f172a"},
            leaf: {opacity: 0.6},
            marker: {line: {width: 2}},
            branchvalues: "total"
        }];

        const audienceLayout = {
            ...layoutConfig,
            margin: {l: 0, r: 0, b: 0, t: 0},
            sunburstcolorway: ["#e2e8f0", "#3b82f6"]
        };
        Plotly.newPlot('audiencePieChart', audienceData, audienceLayout, {displayModeBar: false});
    }

    // Render Insights Table
    renderPrimingInsights(appData);
}

function renderPrimingInsights(data) {
    const container = document.getElementById('primingInsightsContainer');
    if (!container) return;

    let html = `
    <div class="insights-table-wrapper">
        <table class="insights-table">
            <thead>
                <tr>
                    <th>Atributo</th>
                    <th>Control AR</th>
                    <th>Priming AR</th>
                    <th>Delta Shift</th>
                    <th>Conclusión Neurocientífica</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.priming.labels.forEach((label, i) => {
        const labelPairs = {
            'tecnologico': 'Artesanal / Tecnológico',
            'premium': 'Común / Premium',
            'barato': 'Caro / Barato',
            'futbol': 'Maratón / Fútbol',
            'variedad': 'Limitado / Variedad',
            'oferta': 'Demanda / Oferta',
            'calidad': 'Deficiencia / Calidad',
            'ecologico': 'Contaminante / Ecológico'
        };
        const displayLabel = labelPairs[label] || label;

        const c_ar = data.priming.control_ar[i];
        const p_ar = data.priming.priming_ar[i];
        const delta = p_ar - c_ar;
        const deltaStr = (delta > 0 ? '+' : '') + delta.toFixed(1) + '%';
        
        let badgeClass = 'delta-neutral';
        let conclusionLabel = '';
        let conclusionText = '';

        if (delta > 5.0) {
            badgeClass = 'delta-positive';
            conclusionLabel = 'Fuerte Conexión Inconsciente';
            conclusionText = 'El estímulo logró vincular fuertemente la marca con este atributo en la mente del consumidor de forma automática y natural.';
        } else if (delta > 1.0) {
            badgeClass = 'delta-positive';
            conclusionLabel = 'Conexión Moderada';
            conclusionText = 'El estímulo generó una conexión mental positiva y sutil, pero requiere más exposición para volverse un instinto automático.';
        } else if (delta >= -1.0 && delta <= 1.0) {
            badgeClass = 'delta-neutral';
            conclusionLabel = 'Sin Efecto (Creencia Sólida)';
            conclusionText = 'La percepción de este atributo ya está muy consolidada en el consumidor. El estímulo no logró alterar lo que ya piensan de forma automática.';
        } else if (delta >= -5.0) {
            badgeClass = 'delta-negative';
            conclusionLabel = 'Fricción Leve';
            conclusionText = 'El estímulo generó un ligero choque mental. Confunde sutilmente al consumidor a la hora de asociar la marca con este concepto.';
        } else {
            badgeClass = 'delta-negative';
            conclusionLabel = 'Disonancia o Rechazo';
            conclusionText = 'El estímulo provocó un cortocircuito cognitivo. El consumidor rechaza fuertemente asociar lo que acaba de ver con este atributo.';
        }

        html += `
            <tr>
                <td><strong>${displayLabel}</strong></td>
                <td style="color: var(--text-secondary)">${c_ar.toFixed(1)}%</td>
                <td><strong>${p_ar.toFixed(1)}%</strong></td>
                <td><span class="delta-badge ${badgeClass}">${deltaStr}</span></td>
                <td>
                    <span class="insight-label">${conclusionLabel}</span>
                    <p class="insight-desc">${conclusionText}</p>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    </div>
    `;

    container.innerHTML = html;
}
