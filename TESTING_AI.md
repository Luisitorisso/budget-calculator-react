# 🧪 Guía de Testing Rápido - Integración de IA

## 🚀 Setup Rápido (5 minutos)

### 1. Configurar API Key

```bash
# Edita .env y agrega:
VITE_ANTHROPIC_API_KEY=sk-ant-api03-tu-clave-aqui
```

Obtén tu clave en: https://console.anthropic.com/settings/keys

### 2. Reiniciar Servidor

```bash
npm run dev
```

### 3. Abrir la App

Navega a: http://localhost:5173

---

## ✅ Tests Básicos

### TEST 1: Verificar que la API Key funciona

1. Abre la consola del navegador (F12)
2. Ejecuta:
```javascript
// Verifica que la variable existe
console.log(import.meta.env.VITE_ANTHROPIC_API_KEY)
// Debe mostrar: "sk-ant-api03-..."
```

**✅ Esperado:** Ver tu API key (comienza con `sk-ant-api03-`)
**❌ Error:** `undefined` → Revisa tu archivo `.env` y reinicia el servidor

---

### TEST 2: Análisis Financiero Básico

#### Preparación:
1. Asegúrate de tener al menos 5 transacciones en la app
2. Mezcla ingresos y gastos

#### Pasos:
1. Busca el panel morado/azul "🤖 Análisis Financiero con IA"
2. Haz clic en "Analizar mis finanzas"
3. Espera 3-5 segundos

**✅ Esperado:**
- Spinner de carga
- Score de salud (0-100) con color
- Resumen de situación
- 3 patrones identificados
- 3 recomendaciones

**❌ Error común:** "API Key de Anthropic no configurada"
- **Solución:** Revisa que `.env` está en la raíz y tiene la key correcta

**❌ Error común:** "No hay transacciones para analizar"
- **Solución:** Agrega al menos 3-5 transacciones primero

---

### TEST 3: Categorización Automática

#### Pasos:
1. Ve al formulario de gastos
2. En "Descripción", escribe: `Uber al trabajo`
3. Espera 1 segundo
4. Observa el mensaje de sugerencia

**✅ Esperado:**
- Aparece panel morado: "Sugerencia de IA"
- Categoría sugerida: "Transporte"
- Badge de confianza: "Alta confianza"
- Botón "Aplicar"

**Test adicionales:**
- `Netflix` → Entretenimiento
- `Supermercado` → Alimentación
- `Alquiler` → Vivienda
- `Doctor` → Salud

**❌ No aparece sugerencia:**
- Escribe más de 3 caracteres
- Espera 800ms (hay debounce automático)
- Verifica en consola si hay errores

---

### TEST 4: Predicciones de Gastos

#### Preparación:
Necesitas transacciones de al menos 2 meses diferentes.

#### Agregar datos de prueba:
```javascript
// Ejecuta en consola del navegador para agregar transacciones de meses anteriores
// (Esto es temporal, solo para testing)

const testTransactions = [
  { description: 'Salario Oct', amount: 2000, type: 'income', date: '2024-10-01', category: 'Salario' },
  { description: 'Renta Oct', amount: 600, type: 'expense', date: '2024-10-05', category: 'Vivienda' },
  { description: 'Comida Oct', amount: 300, type: 'expense', date: '2024-10-10', category: 'Alimentación' },
  { description: 'Salario Nov', amount: 2000, type: 'income', date: '2024-11-01', category: 'Salario' },
  { description: 'Renta Nov', amount: 600, type: 'expense', date: '2024-11-05', category: 'Vivienda' },
  { description: 'Comida Nov', amount: 350, type: 'expense', date: '2024-11-10', category: 'Alimentación' }
]

// Luego recarga la página
```

#### Pasos:
1. Busca el gráfico "Predicción de Gastos"
2. Debe aparecer automáticamente si tienes 2+ meses de datos

**✅ Esperado:**
- Gráfico con barras/líneas de meses históricos (azul)
- Línea punteada para "Próximo Mes" (morado)
- Área sombreada (rango de confianza)
- Lista de predicciones por categoría
- Advertencias (si aplica)

**❌ No aparece:**
- Mensaje: "No hay datos suficientes"
- **Solución:** Agrega transacciones de diferentes meses

---

### TEST 5: Alertas Inteligentes

#### Pasos:
1. Busca el ícono de campana (🔔) en el header
2. Haz clic
3. Haz clic en "Actualizar" (ícono de refresh)

**✅ Esperado si hay anomalías:**
- Badge rojo/morado con número
- Panel con lista de alertas
- Cada alerta muestra:
  - Tipo (gasto inusual, tendencia alta)
  - Categoría afectada
  - Mensaje descriptivo
  - Acción sugerida

**✅ Esperado si NO hay anomalías:**
- Mensaje: "Todo en orden"
- "No se detectaron gastos inusuales"

#### Forzar una alerta de prueba:
1. Agrega un gasto muy alto: `Emergencia: $5000`
2. Espera que se analice
3. Debería aparecer alerta de "gasto inusual"

---

## 🔍 Tests Avanzados

### TEST 6: Verificar Caché

1. Haz un análisis financiero
2. Nota el tiempo de respuesta (~3-5 segundos)
3. Haz clic en "Actualizar análisis" inmediatamente
4. Nota el tiempo de respuesta (~0.1 segundos)

**✅ Esperado:** 
- Segunda llamada mucho más rápida
- Consola muestra: "✅ Respuesta obtenida desde caché"

### TEST 7: Verificar Rate Limiting

1. Haz clic en "Analizar" 11 veces seguidas muy rápido
2. Observa los errores

**✅ Esperado:**
- Primeras 10 llamadas funcionan
- Llamada 11: "Has excedido el límite de análisis. Espera 1 minuto."

### TEST 8: Costos Estimados

1. Abre el panel de análisis
2. Haz scroll hasta el footer
3. Observa "Tokens usados" y "Costo estimado"

**✅ Esperado:**
- Tokens: ~300-800
- Costo: ~$0.005-$0.015

---

## 📊 Validación de Respuestas

### Calidad del Análisis

**Buena respuesta:**
```json
{
  "resumen": "Tu situación financiera es estable con un balance positivo de $450...",
  "patrones": [
    "Gastas más en fines de semana",
    "Tus compras de supermercado son los jueves",
    "Redujiste transporte en 15%"
  ],
  "recomendaciones": [
    "Establece presupuesto semanal de $100",
    "Considera meal prep para ahorrar $80",
    "Aumenta ahorros aprovechando reducción en transporte"
  ],
  "score": 72,
  "scoreJustificacion": "Buena gestión general con balance positivo..."
}
```

**Mala respuesta (necesita ajustar prompt):**
```json
{
  "resumen": "Tienes transacciones",
  "patrones": ["No identificado"],
  "recomendaciones": ["Administra mejor"],
  "score": 50,
  "scoreJustificacion": "Promedio"
}
```

Si ves respuestas genéricas, reporta en GitHub Issues.

---

## 🐛 Troubleshooting

### Error: "Failed to fetch"

**Posibles causas:**
1. API Key inválida
2. Sin conexión a internet
3. API de Anthropic caída

**Solución:**
```bash
# Verifica API Key
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $VITE_ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json"
```

### Error: "Cannot read property 'content'"

**Causa:** Respuesta de Claude en formato inesperado

**Solución temporal:**
Abre `src/lib/anthropic.js` y agrega más logging:
```javascript
console.log('Respuesta completa de Claude:', data)
```

### Categorización no funciona

**Verificaciones:**
1. ¿Escribiste más de 3 caracteres?
2. ¿Esperaste 800ms?
3. ¿Hay errores en consola?

**Debug:**
```javascript
// En consola
import { suggestCategory } from './lib/anthropic'
const result = await suggestCategory('Uber', ['Transporte', 'Otro'])
console.log(result)
```

---

## 📈 Métricas de Éxito

### Para considerar la integración exitosa:

- ✅ Análisis financiero genera score válido (0-100)
- ✅ Patrones son específicos y relevantes
- ✅ Recomendaciones son accionables
- ✅ Categorización tiene >80% de precisión
- ✅ Predicciones dentro de ±20% de realidad
- ✅ Alertas detectan anomalías reales
- ✅ Costo por usuario <$0.10/mes
- ✅ Tiempo de respuesta <5 segundos
- ✅ Caché reduce llamadas en 50%+
- ✅ Rate limiting previene abuso

---

## 🎯 Siguiente Nivel

Una vez que todos los tests básicos pasen:

1. **Personalización de prompts:** Ajusta en `lib/anthropic.js`
2. **Análisis A/B:** Prueba diferentes versiones de prompts
3. **Métricas detalladas:** Agrega analytics
4. **Feedback loop:** Permite a usuarios calificar respuestas
5. **Entrenamiento:** Usa feedback para mejorar prompts

---

## 📞 Reportar Issues

Si encuentras problemas:

1. Abre GitHub Issues
2. Incluye:
   - Descripción del problema
   - Pasos para reproducir
   - Screenshot de consola
   - Ejemplo de transacciones usadas
   - Respuesta esperada vs obtenida

---

**Happy Testing! 🚀**
