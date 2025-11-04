# ✅ PRÓXIMOS PASOS - Configuración Supabase

## Estado Actual:
- ✅ Proyecto creado: `budget-calculator`
- ✅ Archivo `.env` creado con credenciales
- ✅ `.gitignore` actualizado
- ✅ Instalando `@supabase/supabase-js`

---

## 📋 PASOS SIGUIENTES (HAZ ESTO AHORA):

### PASO 1: Ejecutar el Script SQL en Supabase ⚠️ IMPORTANTE

1. **Abre tu proyecto en Supabase:**
   ```
   https://supabase.com/dashboard/project/ytuuinqelukfoqyeschn
   ```

2. **Ve a SQL Editor:**
   - En la barra lateral izquierda, haz clic en **"SQL Editor"**

3. **Crea una nueva consulta:**
   - Haz clic en **"+ New query"**

4. **Copia el script:**
   - Abre el archivo `supabase-setup.sql` en VS Code
   - Selecciona todo (Ctrl+A)
   - Copia (Ctrl+C)

5. **Pega en el SQL Editor de Supabase:**
   - Pega el script (Ctrl+V)

6. **Ejecuta el script:**
   - Haz clic en **"Run"** o presiona `Ctrl+Enter`
   - Deberías ver: **"Success. No rows returned"**

7. **Verifica las tablas:**
   - Ve a **"Table Editor"** en la barra lateral
   - Deberías ver dos tablas:
     - ✅ `user_profiles`
     - ✅ `transactions`

---

### PASO 2: Configurar Autenticación (Para Desarrollo)

1. **Ve a Authentication > Providers:**
   ```
   https://supabase.com/dashboard/project/ytuuinqelukfoqyeschn/auth/providers
   ```

2. **Haz clic en "Email" para expandir la configuración**

3. **Configura estas opciones:**
   - ❌ **Confirm email** → DESACTIVADO (para desarrollo rápido)
   - ✅ **Enable email autoconfirm** → ACTIVADO
   
   Esto te permitirá crear cuentas y hacer login inmediatamente sin confirmar el email.

4. **Haz clic en "Save"**

---

### PASO 3: Verificar la Instalación

Una vez que `npm install` termine, ejecuta:

```bash
npm run dev
```

Esto iniciará el servidor en `http://localhost:5173`

---

## 🧪 PASO 4: Probar la Autenticación

1. **Abre el navegador:**
   ```
   http://localhost:5173
   ```

2. **Registra una cuenta nueva:**
   - Email: tu-email@ejemplo.com
   - Password: mínimo 6 caracteres

3. **Deberías poder iniciar sesión inmediatamente** (sin confirmar email)

4. **Verifica en Supabase:**
   - Ve a **Authentication > Users**
   - Deberías ver tu usuario creado
   - Ve a **Table Editor > user_profiles**
   - Deberías ver un registro con tu email

---

## 🔄 PASO 5: Migración de Datos (Si tienes datos en localStorage)

Si ya tenías transacciones guardadas localmente:

1. **Inicia sesión en la app**
2. **Debería aparecer un diálogo de migración**
3. **Haz clic en "Migrar Ahora"**
4. **Verifica en Table Editor > transactions**

---

## ❌ Troubleshooting

### Si ves "Faltan las variables de entorno de Supabase":
```bash
# Detén el servidor (Ctrl+C)
# Reinicia el servidor
npm run dev
```

### Si no puedes crear transacciones:
- Verifica que ejecutaste el script SQL completo
- Ve a Table Editor y verifica que existan las tablas

### Si el login no funciona:
- Verifica que desactivaste "Confirm email" en Authentication > Providers

---

## 📝 Resumen de Archivos Creados/Actualizados:

- ✅ `.env` - Credenciales de Supabase (NO se sube a GitHub)
- ✅ `.env.example` - Plantilla actualizada
- ✅ `.gitignore` - Agregado `.env`
- ✅ `supabase-setup.sql` - Script de base de datos
- ✅ `src/lib/supabase.js` - Cliente de Supabase
- ✅ `src/contexts/AuthContext.jsx` - Contexto de autenticación
- ✅ `src/components/Auth/*` - Componentes de login/registro
- ✅ `src/utils/dataMigration.js` - Migración de localStorage
- ✅ `src/components/MigrationDialog.jsx` - Diálogo de migración

---

## 🎯 Checklist:

- [ ] Ejecutar script SQL en Supabase
- [ ] Configurar autenticación (desactivar confirm email)
- [ ] Verificar que npm install terminó
- [ ] Iniciar servidor (`npm run dev`)
- [ ] Probar registro/login
- [ ] Verificar que se creen las tablas user_profiles
- [ ] Crear una transacción de prueba
- [ ] Verificar que aparezca en Table Editor > transactions

---

**¿Alguna duda? Avísame cuando hayas completado el PASO 1 (ejecutar el script SQL) y continuamos.**
