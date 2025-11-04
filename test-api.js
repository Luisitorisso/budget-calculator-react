// Test rápido de API Key de Anthropic
// Este archivo temporal verifica que la configuración funciona

import { callClaude } from './src/lib/anthropic.js'

console.log('🔍 Verificando API Key de Anthropic...')

// Test simple
const messages = [
  {
    role: 'user',
    content: 'Responde solo con: "API configurada correctamente"'
  }
]

try {
  const response = await callClaude(messages, 50, false)
  console.log('✅ SUCCESS:', response.content[0].text)
  console.log('📊 Tokens usados:', response.usage.input_tokens + response.usage.output_tokens)
} catch (error) {
  console.error('❌ ERROR:', error.message)
}
