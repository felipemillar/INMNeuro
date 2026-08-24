# INMNeuro — Digital Predict Biometric Telemetry Dashboard

Plataforma analítica y visor interactivo de telemetría biométrica y neurocognitiva para evaluación publicitaria y predictiva de piezas audiovisuales.

---

## Descripcion General

El **INMNeuro Digital Predict Dashboard** permite reproducir y auditar piezas audiovisuales en sincronía frame a frame (60 fps) con sus modelos de atención visual y sus dimensiones neurobiológicas:

1. **Focus (Atención Visual & Focalización Espacial):**
   - Rastreo de la fijación ocular en áreas de interés (AOI).
   - Rango Normativo Benchmark: `55.6% - 70.3%`.
2. **Cognitive Demand (Carga Perceptual & Esfuerzo Mental):**
   - Complejidad visual de decodificación y procesamiento semántico.
   - Rango Normativo Benchmark: `46.1% - 56.4%`.
3. **Engagement (Involucramiento Afectivo & Relevancia):**
   - Conexión emocional y activación neuroafectiva del espectador.
   - Rango Normativo Benchmark: `65.0% - 76.2%`.
4. **Memory (Fijación Mnémica & Retención de Marca):**
   - Probabilidad de codificación en memoria de largo plazo.
   - Rango Normativo Benchmark: `62.9% - 71.9%`.
5. **DPS (Digital Predict Score):**
   - Índice compuesto estandarizado de efectividad global (Escala 0 - 10).
   - Umbrales de Calificación: `≥ 7.0` (Strong), `5.0 - 6.9` (Optimize), `< 5.0` (Rethink).

---

## Caracteristicas Principales

- **Reproducción Multi-Capa con Cambio de Vista Instantáneo:**
  - `Original`: Comercial limpio en alta definición.
  - `Heatmap`: Mapa de calor térmico de atención visual acumulada.
  - `Focus / Fogmap`: Aislamiento foveal de contraste y atención.
  - *Cambio en caliente sin pérdida de sincronía temporal.*
- **HUD Biométrico Dinámico:**
  - Medidores en tiempo real con barras de progreso, marcadores de rango objetivo y punteros luminosos de promedio acumulado.
  - Sello final en **`AVG` (Overall Average)** al concluir la reproducción.
- **Timeline Interactivo de Plotly a 60 fps:**
  - Visualización multicanal (`ALL (5)`) o por canal individual (`Focus`, `Demand`, `Engagement`, `Memory`, `DPS`).
  - Curva de valor instantáneo (sólida) + **Curva de Promedio Acumulado $\bar{x}(t)$** (punteada).
  - Bandas sombreadas de benchmark de industria.
  - Playhead sincronizado con capacidad de salto temporal (scrubbing & click-to-seek).
- **Diagnóstico Digital Predict Dinámico:**
  - Detección automática de momentos clave: Escenas de Alto Impacto, Picos Mnémicos, Valles de Atención y Carga Perceptual Elevada.

---

## Estructura del Proyecto

```
INMNeuro/
├── index.html                   # Interfaz interactiva principal del dashboard
├── css/
│   └── styles.css               # Sistema de diseño, HUD y componentes UI
├── js/
│   ├── telemetry.js             # Motor de telemetría, trazado Plotly y sincronización multi-video
│   └── app.js                   # Lógica de navegación general
├── data/
│   ├── telemetry.json           # Matriz temporal de 4.461 fotogramas
│   └── Hugo_Sanchez_overall_scores.csv # Métricas consolidadas oficiales
├── assets/
│   └── video/
│       ├── Hugo_Sanchez.mp4     # Video comercial original
│       ├── Hugo_Sanchez_total_attention_heatmap.mp4 # Video con Heatmap
│       └── Hugo_Sanchez_total_attention_fogmap.mp4  # Video con Fogmap
├── docs/
│   └── base_teorica_telemetria_biometrica.md # Fundamentación científica y fórmulas
└── README.md                    # Documentación oficial
```

---

## Ejecucion en Local

Puedes correr el dashboard con cualquier servidor HTTP estático:

```bash
# Con Python 3
python3 -m http.server 8080

# Con Node.js (npx serve)
npx serve .
```

Luego abre tu navegador en `http://localhost:8080`.

---

## Documentacion Cientifica

Para conocer el modelo matemático, la base neurobiológica y los intervalos normativos de referencia, consulta [docs/base_teorica_telemetria_biometrica.md](docs/base_teorica_telemetria_biometrica.md).

---

## Licencia

© 2026 INMNeuro. Todos los derechos reservados.
