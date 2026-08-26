/**
 * IMNeuro Digital Predict - Módulo Identidad Visual (BrandGuard™ / Brand Book)
 * Simulación interactiva de auditoría de coherencia de marca, objetivos de comunicación y reglas del Brand Book.
 */

const BRANDGUARD_DATA = {
    branding: {
        score: 89,
        status: 'Alineación alta',
        substatus: 'Simulación demo',
        dimensions: [
            {
                id: 'logo',
                name: 'Logo y área de seguridad',
                desc: 'Firma visible y legible en los cortes clave.',
                score: 100,
                iconType: 'frame',
                technicalRule: 'Zona de exclusión mínima del 10% respetada en el 100% de los frames con presencia de marca.',
                biometricInsight: 'Fijación visual inmediata (TTFF < 1.2s) sin oclusión durante transiciones de cámara rápida.',
                brandBookSpec: 'Isotipo + Logotipo horizontal en vector de alta resolución sobre fondo de contraste > 4.5:1.'
            },
            {
                id: 'paleta',
                name: 'Paleta y contrastes',
                desc: 'El naranja conserva su función de señal y acción.',
                score: 92,
                iconType: 'palette',
                technicalRule: 'Uso del Naranja Primario (#EA580C) como ancla atencional en puntos clave del recorrido visual.',
                biometricInsight: 'Mayor saliencia cromática en los primeros 3 segundos, guiando la atención hacia el producto.',
                brandBookSpec: 'Paleta Primaria: Naranja (#EA580C), Slate Dark (#0F172A), Blanco Puro (#FFFFFF).'
            },
            {
                id: 'tipografia',
                name: 'Tipografía y jerarquía',
                desc: 'Lectura clara; reforzar presencia de marca en movimiento.',
                score: 86,
                iconType: 'type',
                technicalRule: 'Jerarquía H1/H2 clara con interletrado óptimo para lectura dinámica en pantalla vertical/horizontal.',
                biometricInsight: 'Carga cognitiva (Demand: 38.3) controlada; lectura fluida de claims principales.',
                brandBookSpec: 'Familia Tipográfica: Inter (cuerpo y títulos) + JetBrains Mono (cifras y badges técnicos).'
            },
            {
                id: 'consistencia',
                name: 'Código visual y consistencia',
                desc: 'Las transiciones pueden sostener mejor la continuidad de identidad.',
                score: 78,
                iconType: 'clock',
                technicalRule: 'Mantenimiento del tono fotográfico, saturación uniforme e iluminación en escenas deportivas.',
                biometricInsight: 'Se detecta una caída temporal de engagement en el frame 2.100 al cambiar el estilo de corte.',
                brandBookSpec: 'Motion Branding: Curva de aceleración continua con persistencia de watermark en esquinas.'
            },
            {
                id: 'objetivo',
                name: 'Objetivo: Branding',
                desc: 'Concordancia entre la pieza y el propósito declarado.',
                score: 92,
                iconType: 'target',
                technicalRule: 'La pieza maximiza la codificación mnemónica (Memory Peak: 74.1) y asociaciones implícitas.',
                biometricInsight: 'Elevado índice de fijación de marca post-exposición (Lift de reconocimiento +22%).',
                brandBookSpec: 'Cierre obligatorio con isotipo animado y claim institucional de 2.0s de duración.'
            }
        ],
        objective: {
            title: 'La pieza sí construye memoria de marca.',
            scoreText: 'Score objetivo: 92%',
            diagnostic: 'Logo, paleta y códigos visuales llegan de forma consistente; falta reforzar la firma durante los picos de acción.',
            actionable: 'Mantener el código de marca durante la secuencia deportiva y cerrar en producto + firma Neurolab.'
        }
    },
    performance: {
        score: 83,
        status: 'Alineación media-alta',
        substatus: 'Simulación demo',
        dimensions: [
            {
                id: 'logo',
                name: 'Logo y área de seguridad',
                desc: 'Firma visible en el primer tercio del anuncio.',
                score: 95,
                iconType: 'frame',
                technicalRule: 'Presencia de logo en los primeros 2 segundos para asegurar atribución antes de scroll.',
                biometricInsight: '94% de retención en primeros 3 segundos con reconocimiento instantáneo de marca.',
                brandBookSpec: 'Logo persistente en esquina superior derecha durante toda la duración del anuncio.'
            },
            {
                id: 'paleta',
                name: 'Paleta y contrastes',
                desc: 'Contraste óptimo en botones y llamados a la acción.',
                score: 88,
                iconType: 'palette',
                technicalRule: 'Botones CTA con ratio de contraste > 5:1 frente al fondo del producto.',
                biometricInsight: 'Foco visual guiado directamente hacia el botón de compra en el segundo 4.2.',
                brandBookSpec: 'Botón de Acción: Naranja (#EA580C) con texto blanco y borde redondeado de 6px.'
            },
            {
                id: 'tipografia',
                name: 'Tipografía y jerarquía',
                desc: 'Legibilidad instantánea de precios, descuentos y claims.',
                score: 90,
                iconType: 'type',
                technicalRule: 'Textos de oferta de alto contraste con tamaño mínimo de 24pt en pantallas móviles.',
                biometricInsight: 'Cero fricción cognitiva en la decodificación del mensaje de descuento principal.',
                brandBookSpec: 'Tipografía bold para números de oferta y descuento destacado en pastilla de color.'
            },
            {
                id: 'consistencia',
                name: 'Código visual y consistencia',
                desc: 'Continuidad visual orientada al embudo de conversión.',
                score: 82,
                iconType: 'clock',
                technicalRule: 'Sincronía entre el producto anunciado y la página de aterrizaje (Landing Page).',
                biometricInsight: 'Flujo visual continuo hacia el botón de acción sin elementos distractores.',
                brandBookSpec: 'Plantilla de performance con formato vertical 9:16 y elementos clave en zona segura.'
            },
            {
                id: 'objetivo',
                name: 'Objetivo: Performance',
                desc: 'Concordancia con objetivos de conversión y ventas.',
                score: 84,
                iconType: 'target',
                technicalRule: 'Claridad en la propuesta de valor y facilidad para iniciar la compra en góndola/eCommerce.',
                biometricInsight: 'Intención de pickup simulada de 97% en la prueba de góndola virtual.',
                brandBookSpec: 'Inclusión explícita de precio, disponibilidad y botón de llamada a la acción claro.'
            }
        ],
        objective: {
            title: 'La pieza orienta eficazmente a la acción y conversión.',
            scoreText: 'Score objetivo: 84%',
            diagnostic: 'La oferta y el producto son altamente visibles; se recomienda adelantar el CTA 1.5 segundos.',
            actionable: 'Reforzar el contraste del botón de compra y asegurar que el precio permanezca en pantalla durante el clímax visual.'
        }
    }
};

let currentIdentidadMode = 'branding'; // 'branding' | 'performance'
let selectedDimensionId = null;
let identidadModuleInitialized = false;

function initIdentidadModule() {
    if (identidadModuleInitialized) {
        renderBrandGuardView();
        return;
    }

    setupCommunicationToggle();
    renderBrandGuardView();
    identidadModuleInitialized = true;
}

function setupCommunicationToggle() {
    const btnBranding = document.getElementById('btnCommBranding');
    const btnPerformance = document.getElementById('btnCommPerformance');

    if (btnBranding) {
        btnBranding.addEventListener('click', () => {
            if (currentIdentidadMode === 'branding') return;
            currentIdentidadMode = 'branding';
            btnBranding.classList.add('active');
            if (btnPerformance) btnPerformance.classList.remove('active');
            renderBrandGuardView();
        });
    }

    if (btnPerformance) {
        btnPerformance.addEventListener('click', () => {
            if (currentIdentidadMode === 'performance') return;
            currentIdentidadMode = 'performance';
            btnPerformance.classList.add('active');
            if (btnBranding) btnBranding.classList.remove('active');
            renderBrandGuardView();
        });
    }
}

function renderBrandGuardView() {
    const data = BRANDGUARD_DATA[currentIdentidadMode];
    if (!data) return;

    // 1. Renderizar Header Gauge & Scores
    const scoreVal = document.getElementById('bgScoreVal');
    const scoreStatus = document.getElementById('bgScoreStatus');
    const scoreSubstatus = document.getElementById('bgScoreSubstatus');
    const gaugeCircle = document.getElementById('bgGaugeCircle');

    if (scoreVal) scoreVal.textContent = `${data.score}%`;
    if (scoreStatus) scoreStatus.textContent = data.status;
    if (scoreSubstatus) scoreSubstatus.textContent = data.substatus;

    // Animar círculo SVG (dashoffset)
    if (gaugeCircle) {
        const radius = 38;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (data.score / 100) * circumference;
        gaugeCircle.style.strokeDasharray = `${circumference}`;
        gaugeCircle.style.strokeDashoffset = `${offset}`;
    }

    // 2. Renderizar 5 Tarjetas de Dimensión
    const gridContainer = document.getElementById('brandguardGrid');
    if (gridContainer) {
        gridContainer.innerHTML = '';
        data.dimensions.forEach((dim, idx) => {
            const card = document.createElement('div');
            card.className = `brandguard-card glass-panel ${selectedDimensionId === dim.id ? 'active' : ''}`;
            card.style.animationDelay = `${idx * 40}ms`;
            card.setAttribute('data-dim-id', dim.id);

            card.innerHTML = `
                <div class="card-top-row">
                    <div class="dim-icon-wrapper ${dim.iconType}">
                        ${getDimensionIcon(dim.iconType)}
                    </div>
                    <div class="dim-score-kpi">${dim.score}%</div>
                </div>
                <div class="card-content">
                    <h4 class="dim-title">${dim.name}</h4>
                    <p class="dim-desc">${dim.desc}</p>
                </div>
            `;

            card.addEventListener('click', () => {
                toggleDimensionDetail(dim.id);
            });

            gridContainer.appendChild(card);
        });
    }

    // 3. Renderizar Panel Deep-Dive si hay una tarjeta seleccionada
    updateDimensionDetailPanel();

    // 4. Renderizar Panel Inferior (Objetivo & Diagnóstico)
    const objTitle = document.getElementById('bgObjTitle');
    const objScoreText = document.getElementById('bgObjScoreText');
    const diagText = document.getElementById('bgDiagText');
    const actionText = document.getElementById('bgActionText');

    if (objTitle) {
        objTitle.style.opacity = '0';
        setTimeout(() => {
            objTitle.textContent = data.objective.title;
            objTitle.style.transition = 'opacity 0.25s ease';
            objTitle.style.opacity = '1';
        }, 50);
    }
    if (objScoreText) objScoreText.textContent = data.objective.scoreText;

    if (diagText) {
        diagText.style.opacity = '0';
        setTimeout(() => {
            diagText.textContent = data.objective.diagnostic;
            diagText.style.transition = 'opacity 0.25s ease';
            diagText.style.opacity = '1';
        }, 60);
    }

    if (actionText) {
        actionText.style.opacity = '0';
        setTimeout(() => {
            actionText.innerHTML = data.objective.actionable;
            actionText.style.transition = 'opacity 0.25s ease';
            actionText.style.opacity = '1';
        }, 70);
    }
}

function toggleDimensionDetail(dimId) {
    if (selectedDimensionId === dimId) {
        selectedDimensionId = null; // Colapsar si ya estaba abierto
    } else {
        selectedDimensionId = dimId;
    }

    // Actualizar clase active en tarjetas
    const cards = document.querySelectorAll('.brandguard-card');
    cards.forEach(c => {
        if (c.getAttribute('data-dim-id') === selectedDimensionId) {
            c.classList.add('active');
        } else {
            c.classList.remove('active');
        }
    });

    updateDimensionDetailPanel();
}

function updateDimensionDetailPanel() {
    const detailPanel = document.getElementById('dimensionDetailPanel');
    if (!detailPanel) return;

    if (!selectedDimensionId) {
        detailPanel.style.display = 'none';
        return;
    }

    const data = BRANDGUARD_DATA[currentIdentidadMode];
    const dim = data.dimensions.find(d => d.id === selectedDimensionId);
    if (!dim) {
        detailPanel.style.display = 'none';
        return;
    }

    detailPanel.style.display = 'block';
    detailPanel.innerHTML = `
        <div class="detail-card-inner glass-panel">
            <div class="detail-header">
                <div class="detail-title-wrap">
                    <span class="detail-badge">${dim.name.toUpperCase()}</span>
                    <h4>Auditoría Técnica del Brand Book & Neurométricas</h4>
                </div>
                <button class="detail-close-btn" onclick="toggleDimensionDetail('${dim.id}')">✕ Cerrar</button>
            </div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">REGLA DEL BRAND BOOK</span>
                    <p class="detail-value">${dim.technicalRule}</p>
                </div>
                <div class="detail-item">
                    <span class="detail-label">HALLAZGO BIOMÉTRICO (INMNEURO)</span>
                    <p class="detail-value">${dim.biometricInsight}</p>
                </div>
                <div class="detail-item full-width">
                    <span class="detail-label">ESPECIFICACIÓN TÉCNICA</span>
                    <p class="detail-value highlight font-mono">${dim.brandBookSpec}</p>
                </div>
            </div>
        </div>
    `;
}

function getDimensionIcon(type) {
    switch(type) {
        case 'frame':
            return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#ea580c" stroke-width="2"><path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>`;
        case 'palette':
            return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#ea580c" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5" fill="#ea580c"/><circle cx="17.5" cy="10.5" r=".5" fill="#ea580c"/><circle cx="8.5" cy="7.5" r=".5" fill="#ea580c"/><circle cx="6.5" cy="12.5" r=".5" fill="#ea580c"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.5-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6H16c3.3 0 6-2.7 6-6 0-5.5-4.5-10-10-10z"/></svg>`;
        case 'type':
            return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#ea580c" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`;
        case 'clock':
            return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#ea580c" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
        case 'target':
            return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#ea580c" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`;
        default:
            return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#ea580c" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`;
    }
}
