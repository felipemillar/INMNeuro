/**
 * IMNeuro Digital Predict - Paradigma Charly Module
 * Gestiona la visualización interactiva del estudio de 8 Paradigmas (67 Diapositivas)
 * Integrando IAT/IRT + Eye Tracking en Góndola Simulada (Shelf Test)
 */

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (link.dataset.view === 'paradigma') {
                setTimeout(initParadigmaCharts, 100);
            }
        });
    });
});

let paradigmaChartsInitialized = false;

// Base de Datos Maestra de los 8 Paradigmas (Extracción de las 67 Diapositivas)
const PARADIGMA_DATABASE = {
    economicos: {
        id: 'economicos',
        title: 'Económicos / Accesibilidad',
        isPositive: true,
        tag: '1º LUGAR ABSOLUTO (DOMINANCIA)',
        initialRankingCharly: '1º Lugar (Puntaje 5/5)',
        conclusion: 'El concepto de ECONÓMICOS **SÍ** se asocia de forma contundente e indiscutida a CHARLY. Representa más de la mitad (57%) de la cuota mental del estudio y el 65% de las compras efectivas en góndola.',
        shopperFunnel: { viewed: '100%', pickup: '97%', cart: '97%', avgTime: '4.2s' },
        donutData: {
            labels: ['Charly', 'Asics', 'Puma', 'Adidas', 'Nike'],
            values: [57, 14, 11, 10, 8],
            colors: ['#ea580c', '#10b981', '#0284c7', '#0f172a', '#64748b']
        },
        leaderboard: [
            { rank: 1, brand: 'Charly', score: 60.3, purchase: '65%', pickup: '65%', vai: '32.8%', k: '+0.02', ttff: '2.05s', role: '1st Place / Hidden Gem / Obvious Choice', isCharly: true },
            { rank: 2, brand: 'Asics', score: 14.3, purchase: '11%', pickup: '13%', vai: '38.6%', k: '+0.03', ttff: '1.30s', role: 'Attention Trap', isCharly: false },
            { rank: 3, brand: 'Puma', score: 11.8, purchase: '8%', pickup: '8%', vai: '33.4%', k: '+0.12', ttff: '1.85s', role: '3rd Place', isCharly: false },
            { rank: 4, brand: 'Adidas', score: 11.3, purchase: '8%', pickup: '8%', vai: '30.0%', k: '-0.07', ttff: '2.10s', role: 'Shelf Blind Spot', isCharly: false },
            { rank: 5, brand: 'Nike', score: 8.9, purchase: '5%', pickup: '6%', vai: '31.1%', k: '+0.02', ttff: '2.06s', role: 'Worst Performer', isCharly: false }
        ]
    },
    ecologico: {
        id: 'ecologico',
        title: 'Ecológico / Sostenibilidad',
        isPositive: true,
        tag: '2º LUGAR (VECTOR DIFERENCIAL)',
        initialRankingCharly: '2º Lugar (Puntaje 4/5)',
        conclusion: 'El concepto de ECOLÓGICO **SÍ** se asocia a CHARLY. Registra su segundo mayor volumen de intención de compra (30%) y es catalogada como "Hidden Gem" y "Obvious Choice", superando a Nike, Adidas y Puma.',
        shopperFunnel: { viewed: '100%', pickup: '91%', cart: '91%', avgTime: '5.1s' },
        donutData: {
            labels: ['Asics', 'Charly', 'Nike', 'Adidas', 'Puma'],
            values: [30, 29, 19, 13, 9],
            colors: ['#10b981', '#ea580c', '#64748b', '#0f172a', '#0284c7']
        },
        leaderboard: [
            { rank: 1, brand: 'Asics', score: 31.0, purchase: '28%', pickup: '28%', vai: '41.3%', k: '+0.16', ttff: '—', role: '1st Place / Attention Trap', isCharly: false },
            { rank: 2, brand: 'Charly', score: 30.4, purchase: '30%', pickup: '30%', vai: '32.4%', k: '+0.01', ttff: '—', role: '2nd Place / Hidden Gem / Obvious Choice', isCharly: true },
            { rank: 3, brand: 'Nike', score: 21.1, purchase: '18%', pickup: '13%', vai: '38.0%', k: '+0.22', ttff: '—', role: '3rd Place', isCharly: false },
            { rank: 4, brand: 'Adidas', score: 15.4, purchase: '13%', pickup: '13%', vai: '28.0%', k: '-0.24', ttff: '—', role: 'Shelf Blind Spot', isCharly: false },
            { rank: 5, brand: 'Puma', score: 11.9, purchase: '3%', pickup: '13%', vai: '30.7%', k: '+0.10', ttff: '—', role: 'Worst Performer', isCharly: false }
        ]
    },
    premium: {
        id: 'premium',
        title: 'Premium / Exclusividad',
        isPositive: false,
        tag: 'PUNTO CIEGO',
        initialRankingCharly: '5º Lugar (Puntaje 1/5)',
        conclusion: 'El concepto de PREMIUM **NO** se asocia a la marca CHARLY (Score 6.8 vs Nike 46.6). Nike lidera el 47% de compras y 37% de participación de mente.',
        shopperFunnel: { viewed: '100%', pickup: '87%', cart: '97%', avgTime: '5.1s' },
        donutData: {
            labels: ['Nike', 'Asics', 'Adidas', 'Puma', 'Charly'],
            values: [37, 26, 22, 8, 7],
            colors: ['#0f172a', '#10b981', '#3b82f6', '#0284c7', '#ea580c']
        },
        leaderboard: [
            { rank: 1, brand: 'Nike', score: 46.6, purchase: '47%', pickup: '45%', vai: '40.1%', k: '+0.30', ttff: '—', role: '1st Place / Obvious Choice', isCharly: false },
            { rank: 2, brand: 'Asics', score: 24.9, purchase: '22%', pickup: '22%', vai: '41.6%', k: '+0.17', ttff: '—', role: '2nd Place / Attention Trap', isCharly: false },
            { rank: 3, brand: 'Adidas', score: 19.0, purchase: '17%', pickup: '17%', vai: '30.8%', k: '-0.04', ttff: '—', role: '3rd Place', isCharly: false },
            { rank: 4, brand: 'Puma', score: 12.4, purchase: '10%', pickup: '10%', vai: '26.2%', k: '+0.15', ttff: '—', role: '4th Place', isCharly: false },
            { rank: 5, brand: 'Charly', score: 6.8, purchase: '3%', pickup: '3%', vai: '28.1%', k: '-0.10', ttff: '—', role: 'Shelf Blind Spot / Worst Performer', isCharly: true }
        ]
    },
    tecnologia: {
        id: 'tecnologia',
        title: 'Tecnología / Innovación',
        isPositive: false,
        tag: 'PUNTO CIEGO',
        initialRankingCharly: '5º Lugar (Puntaje 1/5)',
        conclusion: 'El concepto de TECNOLOGÍA **NO** se asocia a la marca CHARLY (Score 7.0 vs Nike 45.3). Nike y Asics concentran el 63% de la recordación.',
        shopperFunnel: { viewed: '100%', pickup: '98%', cart: '97%', avgTime: '5.1s' },
        donutData: {
            labels: ['Nike', 'Asics', 'Adidas', 'Puma', 'Charly'],
            values: [37, 26, 22, 8, 7],
            colors: ['#0f172a', '#10b981', '#3b82f6', '#0284c7', '#ea580c']
        },
        leaderboard: [
            { rank: 1, brand: 'Nike', score: 45.3, purchase: '47%', pickup: '45%', vai: '35.5%', k: '+0.09', ttff: '—', role: '1st Place / Obvious Choice', isCharly: false },
            { rank: 2, brand: 'Asics', score: 25.7, purchase: '23%', pickup: '25%', vai: '41.2%', k: '+0.21', ttff: '—', role: '2nd Place', isCharly: false },
            { rank: 3, brand: 'Adidas', score: 21.7, purchase: '20%', pickup: '23%', vai: '31.5%', k: '+0.05', ttff: '—', role: '3rd Place', isCharly: false },
            { rank: 4, brand: 'Puma', score: 7.9, purchase: '3%', pickup: '5%', vai: '32.4%', k: '-0.20', ttff: '—', role: '4th Place', isCharly: false },
            { rank: 5, brand: 'Charly', score: 7.0, purchase: '3%', pickup: '3%', vai: '29.8%', k: '-0.02', ttff: '—', role: 'Shelf Blind Spot / Worst Performer', isCharly: true }
        ]
    },
    futbol: {
        id: 'futbol',
        title: 'Fútbol / Performance Deportivo',
        isPositive: false,
        tag: 'PUNTO CIEGO',
        initialRankingCharly: '4º Lugar (Puntaje 2/5)',
        conclusion: 'El concepto de FÚTBOL **NO** se asocia a CHARLY en la prueba basal de góndola (Score 5.6 vs Adidas 49.5 y Nike 30.0). Adidas monopoliza el 53% de compras.',
        shopperFunnel: { viewed: '100%', pickup: '98%', cart: '97%', avgTime: '4.5s' },
        donutData: {
            labels: ['Adidas', 'Nike', 'Puma', 'Charly'],
            values: [45, 30, 14, 6],
            colors: ['#0f172a', '#3b82f6', '#0284c7', '#ea580c']
        },
        leaderboard: [
            { rank: 1, brand: 'Adidas', score: 49.5, purchase: '53%', pickup: '55%', vai: '29.9%', k: '+0.06', ttff: '—', role: '1st Place / Obvious Choice', isCharly: false },
            { rank: 2, brand: 'Nike', score: 30.0, purchase: '28%', pickup: '30%', vai: '38.1%', k: '+0.15', ttff: '—', role: '2nd Place / Negative Choice', isCharly: false },
            { rank: 3, brand: 'Puma', score: 13.8, purchase: '12%', pickup: '12%', vai: '24.9%', k: '+0.16', ttff: '—', role: '3rd Place', isCharly: false },
            { rank: 4, brand: 'Charly', score: 5.6, purchase: '3%', pickup: '3%', vai: '20.5%', k: '-0.16', ttff: '—', role: 'Shelf Blind Spot', isCharly: true },
            { rank: 5, brand: 'Asics', score: 4.7, purchase: '0%', pickup: '0%', vai: '31.4%', k: '+0.01', ttff: '—', role: 'Attention Trap / Worst Performer', isCharly: false }
        ]
    },
    diseno: {
        id: 'diseno',
        title: 'Diseño / Estética',
        isPositive: false,
        tag: 'PUNTO CIEGO',
        initialRankingCharly: '5º Lugar (Puntaje 1/5)',
        conclusion: 'El concepto de DISEÑO **NO** se asocia a CHARLY (Score 5.1 vs Adidas 47.7 y Nike 33.1).',
        shopperFunnel: { viewed: '100%', pickup: '97%', cart: '96%', avgTime: '3.9s' },
        donutData: {
            labels: ['Adidas', 'Nike', 'Puma', 'Asics', 'Charly'],
            values: [45, 30, 11, 9, 5],
            colors: ['#0f172a', '#3b82f6', '#0284c7', '#10b981', '#ea580c']
        },
        leaderboard: [
            { rank: 1, brand: 'Adidas', score: 47.7, purchase: '50%', pickup: '52%', vai: '31.3%', k: '-0.22', ttff: '—', role: '1st Place / Obvious Choice', isCharly: false },
            { rank: 2, brand: 'Nike', score: 33.1, purchase: '33%', pickup: '32%', vai: '33.5%', k: '+0.09', ttff: '—', role: '2nd Place', isCharly: false },
            { rank: 3, brand: 'Puma', score: 10.5, purchase: '8%', pickup: '8%', vai: '24.7%', k: '-0.23', ttff: '—', role: '3rd Place', isCharly: false },
            { rank: 4, brand: 'Asics', score: 8.6, purchase: '5%', pickup: '3%', vai: '32.6%', k: '+0.24', ttff: '—', role: 'Attention Trap', isCharly: false },
            { rank: 5, brand: 'Charly', score: 5.1, purchase: '2%', pickup: '2%', vai: '22.4%', k: '-0.41', ttff: '—', role: 'Shelf Blind Spot / Worst Performer', isCharly: true }
        ]
    },
    comodidad: {
        id: 'comodidad',
        title: 'Comodidad / Confort',
        isPositive: false,
        tag: 'PUNTO CIEGO',
        initialRankingCharly: '5º Lugar (Puntaje 1/5)',
        conclusion: 'El concepto de COMODIDAD **NO** se asocia prioritariamente a CHARLY (Score 11.4 vs Adidas 32.0). No obstante, es el atributo negativo donde Charly obtiene su mayor volumen de participación (11% dona / 17% compra).',
        shopperFunnel: { viewed: '100%', pickup: '100%', cart: '100%', avgTime: '3.3s' },
        donutData: {
            labels: ['Adidas', 'Nike', 'Puma', 'Asics', 'Charly'],
            values: [29, 22, 20, 18, 11],
            colors: ['#0f172a', '#3b82f6', '#0284c7', '#10b981', '#ea580c']
        },
        leaderboard: [
            { rank: 1, brand: 'Adidas', score: 32.0, purchase: '33%', pickup: '32%', vai: '26.5%', k: '+0.12', ttff: '—', role: '1st Place / Obvious Choice', isCharly: false },
            { rank: 2, brand: 'Nike', score: 24.4, purchase: '23%', pickup: '22%', vai: '22.8%', k: '+0.25', ttff: '—', role: '2nd Place', isCharly: false },
            { rank: 3, brand: 'Puma', score: 20.7, purchase: '15%', pickup: '18%', vai: '26.7%', k: '+0.10', ttff: '—', role: 'Attention Trap', isCharly: false },
            { rank: 4, brand: 'Asics', score: 18.1, purchase: '15%', pickup: '15%', vai: '32.1%', k: '+0.47', ttff: '—', role: '4th Place', isCharly: false },
            { rank: 5, brand: 'Charly', score: 11.4, purchase: '17%', pickup: '17%', vai: '19.4%', k: '-0.42', ttff: '—', role: 'Shelf Blind Spot / Worst Performer', isCharly: true }
        ]
    },
    durabilidad: {
        id: 'durabilidad',
        title: 'Durabilidad / Resistencia',
        isPositive: false,
        tag: 'PUNTO CIEGO',
        initialRankingCharly: '5º Lugar (Puntaje 1/5)',
        conclusion: 'El concepto de DURABILIDAD **NO** se asocia a CHARLY (Score 5.5 vs Adidas 39.9 y Nike 29.7).',
        shopperFunnel: { viewed: '100%', pickup: '98%', cart: '98%', avgTime: '4.2s' },
        donutData: {
            labels: ['Adidas', 'Nike', 'Puma', 'Asics', 'Charly'],
            values: [38, 28, 18, 10, 6],
            colors: ['#0f172a', '#3b82f6', '#0284c7', '#10b981', '#ea580c']
        },
        leaderboard: [
            { rank: 1, brand: 'Adidas', score: 39.9, purchase: '42%', pickup: '42%', vai: '28.0%', k: '-0.06', ttff: '—', role: '1st Place / Obvious Choice', isCharly: false },
            { rank: 2, brand: 'Nike', score: 29.7, purchase: '23%', pickup: '30%', vai: '36.2%', k: '+0.23', ttff: '—', role: '2nd Place', isCharly: false },
            { rank: 3, brand: 'Puma', score: 20.1, purchase: '18%', pickup: '18%', vai: '31.9%', k: '+0.31', ttff: '—', role: '3rd Place', isCharly: false },
            { rank: 4, brand: 'Asics', score: 12.7, purchase: '9%', pickup: '8%', vai: '38.0%', k: '-0.03', ttff: '—', role: 'Attention Trap', isCharly: false },
            { rank: 5, brand: 'Charly', score: 5.5, purchase: '2%', pickup: '2%', vai: '25.6%', k: '-0.13', ttff: '—', role: 'Worst Performer', isCharly: true }
        ]
    }
};

let activeParadigmId = 'economicos';

function initParadigmaCharts() {
    if (paradigmaChartsInitialized) return;
    if (!document.getElementById('paradigmMacroChart')) return;

    renderParadigmMacroChart();
    renderAttentionKChart();
    setupParadigmPills();
    selectParadigm('economicos');

    paradigmaChartsInitialized = true;
}

// 1. Gráfico Macro Comparativo: Charly vs Líder de Categoría
function renderParadigmMacroChart() {
    const categories = ['Económicos', 'Ecológico', 'Comodidad', 'Tecnología', 'Premium', 'Futbol', 'Durabilidad', 'Diseño'];
    const charlyScores = [60.3, 30.4, 11.4, 7.0, 6.8, 5.6, 5.5, 5.1];
    const leaderScores = [60.3, 31.0, 32.0, 45.3, 46.6, 49.5, 39.9, 47.7];
    const leaderNames = ['Charly (1º)', 'Asics (1º)', 'Adidas (1º)', 'Nike (1º)', 'Nike (1º)', 'Adidas (1º)', 'Adidas (1º)', 'Adidas (1º)'];

    const traceCharly = {
        x: categories,
        y: charlyScores,
        name: 'Charly',
        type: 'bar',
        marker: {
            color: charlyScores.map((val, idx) => idx < 2 ? '#ea580c' : 'rgba(234, 88, 12, 0.45)'),
            line: { color: '#ea580c', width: 2 }
        },
        text: charlyScores.map(v => v.toFixed(1)),
        textposition: 'outside',
        textfont: { family: 'JetBrains Mono, monospace', size: 13, color: '#ea580c' }
    };

    const traceLeader = {
        x: categories,
        y: leaderScores,
        name: 'Líder de Categoría',
        type: 'bar',
        marker: {
            color: 'rgba(30, 41, 59, 0.15)',
            line: { color: '#64748b', width: 1.5 }
        },
        text: leaderNames,
        textposition: 'inside',
        insidetextanchor: 'middle',
        textfont: { family: 'Inter, sans-serif', size: 11.5, color: '#0f172a' }
    };

    const layout = {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        barmode: 'group',
        bargap: 0.25,
        bargroupgap: 0.1,
        showlegend: true,
        legend: {
            font: { family: 'Inter, sans-serif', size: 12.5, color: '#334155' },
            orientation: 'h',
            y: 1.16,
            x: 0.5,
            xanchor: 'center'
        },
        xaxis: {
            tickfont: { family: 'Inter, sans-serif', size: 13, color: '#0f172a' },
            gridcolor: '#e2e8f0',
            linecolor: '#cbd5e1'
        },
        yaxis: {
            title: { text: 'Shelf Score Compuesto (0–100)', font: { family: 'Inter, sans-serif', size: 12, color: '#475569' } },
            range: [0, 72],
            dtick: 10,
            tickfont: { family: 'JetBrains Mono, monospace', size: 11.5, color: '#64748b' },
            gridcolor: '#e2e8f0',
            linecolor: '#cbd5e1'
        },
        margin: { l: 55, r: 35, t: 40, b: 50 }
    };

    Plotly.newPlot('paradigmMacroChart', [traceCharly, traceLeader], layout, { displayModeBar: false, responsive: true });
}

// 1.B Gráfico de Calidad Atencional: Coeficiente K de Charly (Divergente)
function renderAttentionKChart() {
    if (!document.getElementById('paradigmKChart')) return;

    // Paradigmas ordenados de menor a mayor (en Plotly vertical) para que los positivos (Económicos y Ecológico) queden en la cima
    const categories = [
        'Comodidad / Confort',
        'Diseño / Estética',
        'Fútbol / Performance',
        'Durabilidad / Resistencia',
        'Premium / Exclusividad',
        'Tecnología / Innovación',
        'Ecológico / Sostenibilidad ★',
        'Económicos / Accesibilidad ★'
    ];

    const kValues = [-0.42, -0.41, -0.16, -0.13, -0.10, -0.02, 0.01, 0.02];
    const colors = kValues.map(v => v >= 0 ? '#10b981' : '#ef4444');
    const textLabels = kValues.map(v => (v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2)));

    const trace = {
        y: categories,
        x: kValues,
        type: 'bar',
        orientation: 'h',
        marker: {
            color: colors,
            line: {
                color: kValues.map(v => v >= 0 ? '#059669' : '#dc2626'),
                width: 1.5
            }
        },
        text: textLabels,
        textposition: 'outside',
        textfont: { family: 'JetBrains Mono, monospace', size: 13, color: colors }
    };

    const layout = {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        showlegend: false,
        xaxis: {
            title: { text: 'Coeficiente K de Charly (Calidad Atencional)', font: { family: 'Inter, sans-serif', size: 12, color: '#475569' } },
            range: [-0.60, 0.18],
            dtick: 0.1,
            tickfont: { family: 'JetBrains Mono, monospace', size: 11.5, color: '#64748b' },
            gridcolor: '#e2e8f0',
            zeroline: true,
            zerolinecolor: '#0f172a',
            zerolinewidth: 2
        },
        yaxis: {
            tickfont: { family: 'Inter, sans-serif', size: 12.5, color: '#0f172a' },
            gridcolor: '#f1f5f9'
        },
        annotations: [
            {
                x: -0.32,
                y: 7.3,
                xref: 'x',
                yref: 'y',
                text: '🔴 ZONA DE DESCARTE ACTIVO (K < 0)',
                showarrow: false,
                font: { family: 'JetBrains Mono, monospace', size: 11.5, color: '#dc2626' }
            },
            {
                x: 0.07,
                y: 7.3,
                xref: 'x',
                yref: 'y',
                text: '🟢 INTENCIÓN DE COMPRA (K > 0)',
                showarrow: false,
                font: { family: 'JetBrains Mono, monospace', size: 11.5, color: '#059669' }
            }
        ],
        margin: { l: 230, r: 60, t: 40, b: 50 }
    };

    Plotly.newPlot('paradigmKChart', [trace], layout, { displayModeBar: false, responsive: true });
}

// 2. Control de Botonera / Píldoras
function setupParadigmPills() {
    const pills = document.querySelectorAll('.paradigm-pill-btn');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const paradigmKey = pill.getAttribute('data-paradigm');
            selectParadigm(paradigmKey);
        });
    });
}

// 3. Selección y Renderizado del Paradigma Específico
function selectParadigm(paradigmKey) {
    const data = PARADIGMA_DATABASE[paradigmKey];
    if (!data) return;
    activeParadigmId = paradigmKey;

    // Actualizar encabezados y síntesis
    const titleElem = document.getElementById('paradigmActiveTitle');
    const tagElem = document.getElementById('paradigmActiveTag');
    const conclusionElem = document.getElementById('paradigmActiveConclusion');
    const rankingElem = document.getElementById('paradigmActiveRanking');

    if (titleElem) titleElem.textContent = `[ PARADIGMA: ${data.title.toUpperCase()} ]`;
    if (tagElem) {
        tagElem.textContent = data.tag;
        tagElem.className = 'paradigm-badge-status ' + (data.isPositive ? 'positive' : 'negative');
    }
    if (conclusionElem) conclusionElem.innerHTML = data.conclusion;
    if (rankingElem) rankingElem.textContent = data.initialRankingCharly;

    // Actualizar Funnel
    const fViewed = document.getElementById('funnelViewed');
    const fPickup = document.getElementById('funnelPickup');
    const fCart = document.getElementById('funnelCart');
    const fTime = document.getElementById('funnelTime');

    if (fViewed) fViewed.textContent = data.shopperFunnel.viewed;
    if (fPickup) fPickup.textContent = data.shopperFunnel.pickup;
    if (fCart) fCart.textContent = data.shopperFunnel.cart;
    if (fTime) fTime.textContent = data.shopperFunnel.avgTime;

    // Render Donut Chart
    renderParadigmDonut(data.donutData);

    // Render Leaderboard Table
    renderParadigmTable(data.leaderboard);
}

// 4. Donut Chart de Participación de Mente (Share of Mind)
function renderParadigmDonut(donutData) {
    const trace = {
        labels: donutData.labels,
        values: donutData.values,
        type: 'pie',
        hole: 0.58,
        marker: {
            colors: donutData.colors,
            line: { color: '#ffffff', width: 2 }
        },
        textinfo: 'label+percent',
        textposition: 'outside',
        textfont: { family: 'JetBrains Mono', size: 10, color: '#1e293b' },
        hoverinfo: 'label+value+percent'
    };

    const layout = {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        showlegend: false,
        margin: { l: 25, r: 25, t: 25, b: 25 }
    };

    Plotly.newPlot('paradigmDonutChart', [trace], layout, { displayModeBar: false, responsive: true });
}

// 5. Tabla Leaderboard de 5 Marcas
function renderParadigmTable(leaderboard) {
    const tbody = document.getElementById('paradigmLeaderboardBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    leaderboard.forEach(row => {
        const tr = document.createElement('tr');
        if (row.isCharly) {
            tr.className = 'charly-highlight-row';
        }

        tr.innerHTML = `
            <td class="col-rank"><strong>#${row.rank}</strong></td>
            <td class="col-brand">
                <span class="brand-badge ${row.brand.toLowerCase()}">${row.brand}</span>
            </td>
            <td class="col-score">
                <strong>${row.score.toFixed(1)}</strong>
            </td>
            <td class="col-metric">${row.purchase}</td>
            <td class="col-metric">${row.pickup}</td>
            <td class="col-metric">${row.vai}</td>
            <td class="col-metric font-mono">${row.k}</td>
            <td class="col-role">
                <span class="role-pill ${getRoleClass(row.role)}">${row.role}</span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function getRoleClass(role) {
    if (role.includes('1st Place') || role.includes('Obvious Choice') || role.includes('Hidden Gem')) return 'role-gem';
    if (role.includes('Attention Trap')) return 'role-trap';
    if (role.includes('Worst') || role.includes('Blind Spot')) return 'role-worst';
    return 'role-neutral';
}
