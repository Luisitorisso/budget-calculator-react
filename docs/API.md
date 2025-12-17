# Documentación de APIs e Integraciones

Esta guía documenta todas las integraciones externas del proyecto.

---

## Tabla de Contenidos

1. [Supabase - Base de datos y autenticación](#supabase)
2. [Anthropic Claude - IA](#anthropic-claude)
3. [Stripe - Pagos](#stripe)
4. [APIs públicas](#apis-públicas)

---

## Supabase

Supabase proporciona backend completo: base de datos PostgreSQL, autenticación, storage y real-time.

### Configuración

#### 1. Variables de entorno

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 2. Cliente Supabase

```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

### Esquema de Base de Datos

#### Tabla: `transactions`

```sql
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_type ON transactions(type);
```

#### Tabla: `goals`

```sql
CREATE TABLE goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0,
  deadline DATE,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tabla: `credit_cards`

```sql
CREATE TABLE credit_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  limit_amount DECIMAL(10,2) NOT NULL,
  debt DECIMAL(10,2) DEFAULT 0,
  due_date INTEGER CHECK (due_date BETWEEN 1 AND 31),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Row Level Security (RLS)

**Importante:** Configura RLS para proteger los datos de cada usuario.

```sql
-- Habilitar RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;

-- Políticas para transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- Repetir para goals y credit_cards
```

---

### Autenticación

#### Registro de usuario

```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'usuario@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'Jorge Luis',
    }
  }
})
```

#### Login

```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'usuario@example.com',
  password: 'password123',
})
```

#### Logout

```javascript
const { error } = await supabase.auth.signOut()
```

#### Recuperar contraseña

```javascript
const { data, error } = await supabase.auth.resetPasswordForEmail(
  'usuario@example.com',
  { redirectTo: 'https://tu-app.com/reset-password' }
)
```

---

### CRUD de Transacciones

#### Crear transacción

```javascript
const { data, error } = await supabase
  .from('transactions')
  .insert({
    type: 'expense',
    description: 'Supermercado',
    amount: 150.50,
    category: 'Alimentación',
    date: '2024-01-15',
  })
  .select()
```

#### Leer transacciones

```javascript
const { data, error } = await supabase
  .from('transactions')
  .select('*')
  .order('date', { ascending: false })
  .limit(100)
```

#### Actualizar transacción

```javascript
const { data, error } = await supabase
  .from('transactions')
  .update({ amount: 200.00 })
  .eq('id', transactionId)
```

#### Eliminar transacción

```javascript
const { data, error } = await supabase
  .from('transactions')
  .delete()
  .eq('id', transactionId)
```

---

## Anthropic Claude

Integración de IA para análisis financiero inteligente.

### Configuración

```env
VITE_ANTHROPIC_API_KEY=sk-ant-api03-tu_key_aquí
```

### Cliente Anthropic

```javascript
// src/lib/anthropic.js
import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true, // Solo para desarrollo
})
```

Nota de seguridad: En producción, las llamadas a Claude deben hacerse desde un backend para no exponer la API key.

---

### Casos de Uso

#### 1. Análisis de Salud Financiera

```javascript
const analyzeFinancialHealth = async (transactions) => {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Analiza estas transacciones y dame un score de salud financiera (0-100):
      
      Ingresos totales: $${totalIncome}
      Gastos totales: $${totalExpenses}
      Principales categorías: ${topCategories}
      
      Responde en formato JSON:
      {
        "score": 85,
        "analysis": "Tu salud financiera es...",
        "patterns": ["Patrón 1", "Patrón 2"],
        "recommendations": ["Tip 1", "Tip 2"]
      }`
    }]
  })
  
  return JSON.parse(message.content[0].text)
}
```

#### 2. Alertas Inteligentes

```javascript
const generateSmartAlerts = async (transactions) => {
  // Detectar gastos inusuales, patrones de riesgo, etc.
  // Ver src/hooks/useAIInsights.js para implementación completa
}
```

#### 3. Predicciones

```javascript
const predictNextMonth = async (monthlyData) => {
  // Predecir ingresos y gastos del próximo mes
  // Ver src/components/AI/PredictiveChart.jsx
}
```

---

## Stripe

Procesamiento de pagos para suscripciones premium.

### Configuración

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_tu_key_aquí
```

### Inicialización

```javascript
// src/lib/stripe.js
import { loadStripe } from '@stripe/stripe-js'

export const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY
)
```

---

### Planes de Suscripción

| Plan | Precio | Features |
|------|--------|----------|
| **Free** | $0/mes | - Transacciones ilimitadas<br>- Gráficos básicos<br>- 1 meta financiera |
| **Pro** | $4.99/mes | - Todo de Free<br>- Análisis con IA<br>- Exportar PDF/CSV<br>- Metas ilimitadas |
| **Premium** | $9.99/mes | - Todo de Pro<br>- Soporte prioritario<br>- API access |

---

### Crear sesión de Checkout

```javascript
import { stripePromise } from '@/lib/stripe'

const handleSubscribe = async (priceId) => {
  const stripe = await stripePromise
  
  const { error } = await stripe.redirectToCheckout({
    lineItems: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    successUrl: `${window.location.origin}/success`,
    cancelUrl: `${window.location.origin}/canceled`,
    customerEmail: user.email,
  })
  
  if (error) {
    console.error('Error:', error)
  }
}
```

---

## APIs Públicas

### Exchange Rates (Opcional)

Para conversión de monedas:

```javascript
const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD'

const fetchExchangeRates = async () => {
  const response = await fetch(API_URL)
  const data = await response.json()
  return data.rates
}
```

---

## Seguridad

### Mejores Prácticas

1. **Nunca expongas API keys en el código**
   - Usa variables de entorno
   - No las comitees a Git

2. **Valida datos en backend**
   - Row Level Security en Supabase
   - Validación de esquemas

3. **Sanitiza inputs del usuario**
   - Prevenir SQL injection
   - Escapar HTML

4. **HTTPS en producción**
   - Certificado SSL configurado
   - Forzar HTTPS

---

## Rate Limits

| Servicio | Límite | Plan |
|----------|--------|------|
| **Supabase** | 500 req/min | Free |
| **Claude API** | 50 req/min | Tier 1 |
| **Stripe** | 100 req/sec | Estándar |

---

## Debugging

### Ver requests de Supabase

```javascript
const { data, error } = await supabase
  .from('transactions')
  .select('*')

console.log('Data:', data)
console.log('Error:', error)
```

### Ver respuestas de Claude

```javascript
const response = await anthropic.messages.create({ ... })
console.log('AI Response:', JSON.stringify(response, null, 2))
```

---

## Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Anthropic Claude Docs](https://docs.anthropic.com/)
- [Stripe Docs](https://stripe.com/docs)

---

Actualizado: Diciembre 2024
