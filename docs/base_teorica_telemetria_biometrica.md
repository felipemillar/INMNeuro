# Marco Teórico y Fundamentación Científica de la Telemetría Biométrica Predictiva
**Documento Técnico-Metodológico de Estandarización de Métricas y Rangos Normativos**
*IMNeuro Digital Predict Engine — Versión 2.0*

---

## 1. Introducción y Marco Epistemológico

La telemetría biométrica predictiva constituye una disciplina en la intersección de la neurociencia computacional, la psicofísica visual y el modelado de comportamiento del consumidor. Su propósito central es cuantificar, segundo a segundo y fotograma a fotograma, el procesamiento neurocognitivo inducido por estímulos audiovisuales continuos (piezas publicitarias, contenidos digitales, entornos de interfaz y experiencias de usuario).

A diferencia de las metodologías declarativas tradicionales (encuestas, grupos focales), que evalúan racionalizaciones retrospectivas afectadas por sesgos de deseabilidad social y fallas de memoria, la telemetría predictiva audita los procesos preatencionales, atencionales, afectivos y de memoria de trabajo en tiempo real mediante algoritmos de aprendizaje automático entrenados con vastas bases de datos biométricas (Eye-Tracking de alta frecuencia, respuestas galvánicas, electroencefalografía y tiempos de reacción implícitos).

El motor analítico descompone la respuesta del espectador en cuatro dimensiones fundamentales más un índice sintético de impacto:
1. **Atención Visual Focalizada (Focus)**
2. **Carga Perceptual y Esfuerzo Mental (Cognitive Demand)**
3. **Involucramiento y Conexión Emocional (Engagement)**
4. **Codificación y Retención Mnémica (Memory)**
5. **Índice Global de Impacto: Digital Predict Score (DPS)**

---

## 2. Dimensiones Biométricas: Fundamento, Escalas e Implicancias

```
                                  [ ESTÍMULO AUDIOVISUAL ]
                                             │
               ┌─────────────────────────────┼─────────────────────────────┐
               ▼                             ▼                             ▼
       [ PROCESAMIENTO ]             [ ESFUERZO MENTAL ]           [ RESPUESTA AFECTIVA ]
       Atención Visual (Focus)        Carga Cognitiva (Demand)       Involucramiento (Engagement)
               │                             │                             │
               └─────────────────────────────┼─────────────────────────────┘
                                             ▼
                                   [ CONSOLIDACIÓN MNÉMICA ]
                                    Retención de Marca (Memory)
                                             │
                                             ▼
                              [ DIGITAL PREDICT SCORE (DPS) ]
                                   (Índice Compuesto 0-10)
```

---

### 2.1. Focus (Atención Visual Focalizada)

#### A. Definición y Fundamento Fisiológico
El índice *Focus* mide la distribución espacial y la concentración del foco foveal en la escena visual. Fisiológicamente, el ojo humano posee una zona central de alta agudeza visual denominada fóvea (que abarca aproximadamente 2 grados del campo visual) y una periferia de baja resolución. El sistema atencional ventral y dorsal selecciona selectivamente las regiones de alta prominencia sensorial (salience: contraste de luminancia, color, movimiento, orientación de bordes y presencia de rostros).

*Focus* cuantifica si la atención del espectador se encuentra concentrada en un área restringida y jerárquicamente prioritaria de la composición o si, por el contrario, se encuentra dispersa entre múltiples estímulos competidores.

#### B. Escala y Rango Normativo de la Industria
- **Escala de Medición:** 0.0 a 100.0 puntos continuos.
- **Rango Normativo / Benchmark Óptimo:** **55.6 a 70.3 puntos**.

#### C. Clasificación de Rangos e Implicancias Operativas

| Intervalo | Clasificación | Estado Neurocognitivo | Implicancia Publicitaria |
| :--- | :--- | :--- | :--- |
| **0.0 - 24.9** | Dispersión Crítica | Caos visual, competencia no jerarquizada entre elementos del encuadre. | La mirada vaga sin dirección fija. El mensaje clave y la marca pasan desapercibidos. |
| **25.0 - 55.5** | Atención Difusa | Exploración periférica predominante; falta de anclaje visual evidente. | El espectador comprende la escena general pero no fija elementos estratégicos. |
| **55.6 - 70.3** | **Rango Óptimo** | **Equilibrio entre procesamiento contextual y fijación en el foco principal.** | **Máxima claridad de lectura. El producto, rostro o mensaje central domina la escena.** |
| **70.4 - 100.0** | Hiper-Focalización | Concentración extrema en un punto ciego o elemento único (túnel atencional). | Puede generar ceguera por inatención sobre el resto del encuadre si el punto focal no es la marca. |

---

### 2.2. Cognitive Demand (Carga Perceptual y Complejidad)

#### A. Definición y Fundamento Fisiológico
La *Carga Cognitiva (Cognitive Demand)* evalúa la cantidad de esfuerzo mental y recursos de procesamiento que la memoria de trabajo debe invertir para decodificar la información visual de la escena. Su modelado algorítmico se basa en la teoría de la información y la entropía espacial de Shannon, computando la densidad de bordes, la tasa de cambio de planos, la complejidad cromática y la legibilidad tipográfica.

En entornos publicitarios audiovisuales, un exceso de carga cognitiva produce saturación perceptual, fatiga y rechazo, mientras que un nivel adecuado favorece la fluidez de procesamiento (*processing fluency*), facilitando la aceptación del mensaje.

#### B. Escala y Rango Normativo de la Industria
- **Escala de Medición:** 0.0 a 100.0 puntos continuos.
- **Rango Normativo / Benchmark Óptimo:** **46.1 a 56.4 puntos**.

#### C. Clasificación de Rangos e Implicancias Operativas

| Intervalo | Clasificación | Estado Neurocognitivo | Implicancia Publicitaria |
| :--- | :--- | :--- | :--- |
| **0.0 - 46.0** | Procesamiento Fluido | Decodificación ágil, bajo costo de cómputo cerebral, simplicidad compositiva. | Ideal para spots dinámicos y formatos de redes sociales. Permite absorción rápida del mensaje. |
| **46.1 - 56.4** | **Zona Óptima** | **Nivel de complejidad balanceado que estimula el interés sin sobrecargar.** | **Narrativa enriquecida con suficiente densidad de contenido sin generar confusión.** |
| **56.5 - 75.0** | Carga Elevada | Dificultad para integrar estímulos simultáneos (texto, voz, movimiento). | Riesgo de desconexión. El espectador pierde detalles esenciales de la oferta o propuesta de valor. |
| **75.1 - 100.0** | Sobrecarga Severa | Saturación cognitiva, colapso de la memoria de trabajo visual. | Fricción mental inmediata, sensación de confusión y tendencia al abandono de la pieza. |

---

### 2.3. Engagement (Involucramiento y Motivación de Acercamiento)

#### A. Definición y Fundamento Fisiológico
El índice *Engagement* modela la valencia motivacional y el nivel de compromiso afectivo del espectador frente al contenido. Se fundamenta en los modelos neurobiológicos de aproximación-evitación (*Approach-Avoidance Motivation*), vinculados a la asimetría frontal en el electroencefalograma (activación relativa del córtex prefrontal izquierdo) y la velocidad de respuesta implícita frente a estímulos visuales.

Un engagement alto indica que el estímulo resulta intrínsecamente atractivo, relevante y persuasivo, activando el sistema dopaminérgico de recompensa.

#### B. Escala y Rango Normativo de la Industria
- **Escala de Medición:** 0.0 a 100.0 puntos continuos.
- **Rango Normativo / Benchmark Óptimo:** **65.0 a 76.2 puntos** (con un umbral mínimo de suficiencia en 50.0 puntos).

#### C. Clasificación de Rangos e Implicancias Operativas

| Intervalo | Clasificación | Estado Neurocognitivo | Implicancia Publicitaria |
| :--- | :--- | :--- | :--- |
| **0.0 - 49.9** | Desconexión / Valle | Desinterés manifiesto, neutralidad afectiva o aburrimiento. | El espectador adopta una actitud pasiva; alta propensión al salto de anuncio (*skip ad*). |
| **50.0 - 64.9** | Involucramiento Moderado | Aceptación del contenido sin detonación emocional significativa. | Adecuado para transiciones narrativas informativas, pero insuficiente para escenas clímax. |
| **65.0 - 76.2** | **Zona Objetivo** | **Conexión emocional sólida, activación motivacional y resonancia.** | **Momento cumbre para presentar el beneficio principal, el producto hero o la marca.** |
| **76.3 - 100.0** | Impacto Excepcional | Alta empatía, sorpresa positiva y movilización afectiva máxima. | Altísima tasa de viralidad, conversión y retención del espectador. |

---

### 2.4. Memory (Codificación Mnémica y Consolidación)

#### A. Definición y Fundamento Fisiológico
El índice *Memory* cuantifica la probabilidad de que los elementos clave de la escena sean transferidos de la memoria de trabajo sensorial a los circuitos de memoria a largo plazo (hipocampo y corteza temporal medial). Este proceso se sustenta en la distintividad visual del estímulo (*Von Restorff Effect*), la consistencia del anclaje de marca y la integración multisensorial.

Una pieza con alta atención pero baja memoria genera "entretenimiento ciego": el usuario disfruta el comercial pero no recuerda qué marca lo emitió ni cuál fue la propuesta de valor.

#### B. Escala y Rango Normativo de la Industria
- **Escala de Medición:** 0.0 a 100.0 puntos continuos.
- **Rango Normativo / Benchmark Óptimo:** **62.9 a 71.9 puntos** (con un umbral mínimo de suficiencia en 50.0 puntos).

#### C. Clasificación de Rangos e Implicancias Operativas

| Intervalo | Clasificación | Estado Neurocognitivo | Implicancia Publicitaria |
| :--- | :--- | :--- | :--- |
| **0.0 - 49.9** | Fijación Débil | Información efímera; borrado inmediato en la memoria de corto plazo. | La pieza es olvidada a los pocos minutos. Nula generación de equidad de marca (*brand equity*). |
| **50.0 - 62.8** | Retención Moderada | Recuerdo genérico de la trama o de figuras protagónicas sin enlace claro de marca. | Se recuerda el "gag" humorístico o la acción, pero no la identidad del anunciante. |
| **62.9 - 71.9** | **Zona Objetivo** | **Consolidación sólida de los atributos distintivos y el logotipo.** | **Fuerte atribución de marca, incremento en el Top of Mind y facilitación de la decisión de compra.** |
| **72.0 - 100.0** | Huella Mnémica Permanente | Anclaje profundo en la red semántica del consumidor. | Máxima efectividad publicitaria acumulada en el largo plazo. |

---

### 2.5. Digital Predict Score (DPS)

#### A. Definición y Modelado Matemático
El *Digital Predict Score (DPS)* es el indicador sintético global (evaluado en escala de 0.0 a 10.0) que integra las cuatro variables en una única función de calidad publicitaria.

La formulación matemática instantánea pondera las dimensiones en función de su impacto comprobado en ventas y recuerdo de marca:

$$\text{Score}_i = w_f \cdot \text{Focus}_i + w_e \cdot \text{Engagement}_i + w_m \cdot \text{Memory}_i + w_d \cdot \text{Fluidez}_i$$

Donde:
- $w_f = 0.30$ (Peso de la Atención Focalizada)
- $w_e = 0.30$ (Peso del Involucramiento Emocional)
- $w_m = 0.25$ (Peso de la Codificación Mnémica)
- $w_d = 0.15$ (Peso de la Fluidez Perceptual, donde $\text{Fluidez}_i = \max(0, 100 - |\text{Demand}_i - \text{Demand}_{\text{opt}}| \cdot 1.5)$)

La progresión temporal del DPS combina la acumulación histórica del comercial con la sensibilidad a las fluctuaciones de escenas recientes:

$$\text{DPS}(t) = \alpha \cdot \left[ 0.65 \cdot \left(\frac{1}{N_t} \sum_{i=1}^{N_t} \text{Score}_i\right) + 0.35 \cdot \left(\frac{1}{k} \sum_{j=t-k}^t \text{Score}_j\right) \right]$$

*(Donde $\alpha$ es el factor de normalización calibrado sobre base 10).*

#### B. Escala y Clasificación Normativa del DPS

```
 [ 0.0 ────────────── 4.9 ]   [ 5.0 ──────────────── 6.9 ]   [ 7.0 ────────────── 10.0 ]
       RETHINK / BAJO                OPTIMIZE / MEDIO               STRONG / ALTO
  (Fricción o Abandono)        (Oportunidad de Ajuste)       (Excelente Rendimiento)
```

| Rango DPS | Categoría Oficial | Diagnóstico Operativo | Acción Recomendada |
| :---: | :--- | :--- | :--- |
| **≥ 7.0 / 10** | **Strong (Alto Impacto)** | La pieza cumple holgadamente los estándares biométricos: capta la atención, emociona y se fija en memoria. | Aprobar pauta para inversión publicitaria a escala masiva sin modificaciones estructurales. |
| **5.0 - 6.9 / 10** | **Optimize (A Optimizar)** | La pieza posee fortalezas marcadas pero presenta fugas de atención o baches de engagement intermedios. | Realizar edición quirúrgica (recorte de escenas lentas, refuerzo de logo, match-cuts dinámicos). |
| **< 5.0 / 10** | **Rethink (Bajo Rendimiento)** | Fallas estructurales en la jerarquía visual, saturación de carga o desconexión emocional generalizada. | Replantear el guion o montaje visual antes de comprometer presupuesto en medios. |

---

## 3. Análisis por Épocas Temporales del Estímulo

El análisis biométrico continuo no solo evalúa el promedio global de la pieza, sino también tres ventanas críticas de la estructura publicitaria:

```
 ┌──────────────────────┬────────────────────────────────────────┬──────────────────────┐
 │   HOOK INICIAL (0-5s)│      FLUJO NARRATIVO INTERMEDIO        │    CIERRE / CTA      │
 │ Captura y Promesa    │ Desarrollo, Argumentación y Emoción    │ Atribución y Acción  │
 └──────────────────────┴────────────────────────────────────────┴──────────────────────┘
```

### 1. Hook Inicial (Primeros 0 a 5 Segundos)
- **Objetivo Neurocognitivo:** Vencer la resistencia al scroll y evitar el salto de anuncio (*Skip Ad*).
- **Métricas Clave:**
  - *Start Focus (Benchmark: 59.2 - 79.6)*: Debe presentar un punto focal nítido e inequívoco en los primeros 500 ms.
  - *Start Engagement (Benchmark: 66.0 - 76.2)*: Requiere detonar curiosidad o empatía inmediata.
  - *Brand Watermark*: Se recomienda la presencia sutil pero perceptible de la marca sin obstruir la acción principal.

### 2. Flujo Narrativo Intermedio
- **Objetivo Neurocognitivo:** Mantener la tensión dramática y regular la carga cognitiva.
- **Riesgo Típico:** Segmentos estáticos de diálogo (tipo "busto parlante") generan caídas abruptas de *Engagement* y dispersión de *Focus*.
- **Estrategia de Optimización:** Inserción de variedad visual cada 2.5 a 3.5 segundos mediante planos de apoyo (*B-roll*), dinamismo de cámara o infografías de bajo esfuerzo perceptual.

### 3. Cierre y Call to Action (Últimos 3 a 5 Segundos)
- **Objetivo Neurocognitivo:** Consolidación final del recuerdo y transferencia a la intención de conducta.
- **Métricas Clave:**
  - *End Focus (Benchmark: 80.8 - 100.0)*: El encuadre debe depurarse por completo, dirigiendo el 100% de la mirada al logotipo, empaque o llamado a la acción.
  - *End Memory (Benchmark: 60.1 - 72.8)*: Tiempo mínimo de exposición estática del elemento de marca (mínimo 1.5 a 2.0 segundos ininterrumpidos) para permitir la finalización de la huella mnémica.

---

## 4. Matriz de Diagnóstico Cruzado (Interacción entre Variables)

La potencia analítica de la telemetría radica en la evaluación cruzada y concurrente de sus variables:

```
              ┌────────────────────────────────┬────────────────────────────────┐
              │ ALTO FOCUS + BAJA DEMANDA      │ ALTO FOCUS + ALTA DEMANDA      │
              │ "Zona de Máxima Claridad"      │ "Zona de Confusión Focalizada" │
              │   Procesamiento óptimo del     │   El usuario mira fijamente    │
              │   mensaje sin esfuerzo.        │   pero no logra comprender.    │
  FOCUS       ├────────────────────────────────┼────────────────────────────────┤
              │ BAJO FOCUS + BAJA DEMANDA      │ BAJO FOCUS + ALTA DEMANDA      │
              │ "Zona de Monotonía Visual"     │ "Zona de Caos y Saturación"    │
              │   Pieza plana, falta de        │   Sobrecarga sensorial sin     │
              │   estímulos de anclaje.        │   jerarquía. Abandono seguro.  │
              └────────────────────────────────┴────────────────────────────────┘
                                  COGNITIVE DEMAND
```

```
              ┌────────────────────────────────┬────────────────────────────────┐
              │ ALTO ENGAGEMENT + ALTA MEMORIA │ ALTO ENGAGEMENT + BAJA MEMORIA │
              │ "Activo Publicitario Perfecto" │ "Entretenimiento Ciego"        │
              │   Emoción y atribución de      │   El comercial gusta mucho     │
              │   marca consolidadas.          │   pero la marca es invisible.  │
  ENGAGEMENT  ├────────────────────────────────┼────────────────────────────────┤
              │ BAJO ENGAGEMENT + ALTA MEMORIA │ BAJO ENGAGEMENT + BAJA MEMORIA │
              │ "Impacto Racional / Severo"    │ "Invisibilidad Total"          │
              │   Memorabilidad forzada por    │   Nula efectividad comercial.  │
              │   repetición sin afinidad.     │   Pérdida de presupuesto.      │
              └────────────────────────────────┴────────────────────────────────┘
                                       MEMORY
```

---

## 5. Glosario de Términos Metodológicos

- **Eye-Tracking Predictivo:** Simulación computacional de patrones de fijación ocular basada en redes neuronales convolucionales y transformadores visuales entrenados con datos empíricos.
- **Entropía Visual de Shannon:** Medida físico-matemática del desorden e incertidumbre en la distribución de píxeles y gradientes en un fotograma, base del cálculo de *Cognitive Demand*.
- **Processing Fluency (Fluidez de Procesamiento):** Grado de facilidad con que el cerebro decodifica un estímulo, directamente correlacionada con juicios intuitivos de confianza y preferencia.
- **Match-Cut:** Técnica de montaje cinematográfico que enlaza dos tomas distintas mediante la alineación de formas o movimientos similares, reduciendo la carga cognitiva y preservando la atención.
- **Brand Anchoring (Anclaje de Marca):** Asociación cognitiva sólida y estable entre una emoción o narrativa y la identidad gráfica de una marca.
- **Benchmarking Sectorial:** Comparación estadística de un activo contra la distribución percentil de su industria y formato específico en una base global estandarizada.
