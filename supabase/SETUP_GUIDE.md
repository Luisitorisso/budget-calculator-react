# Guía de Configuración de Supabase

## Paso 1: Crear Proyecto en Supabase

1. Ve a [https://app.supabase.com](https://app.supabase.com)
2. Click en "New Project"
3. Rellena los datos:
   - **Name**: Budget Calculator
   - **Database Password**: (guarda esta contraseña de forma segura)
   - **Region**: Selecciona la más cercana a Panamá (us-east-1)
4. Click en "Create new project"
5. Espera 2-3 minutos mientras se crea el proyecto

## Paso 2: Ejecutar Script SQL

1. En el dashboard de Supabase, ve a **SQL Editor** (icono de base de datos en sidebar)
2. Click en "New Query"
3. Copia TODO el contenido del archivo `supabase/schema.sql`
4. Pega en el editor SQL
5. Click en "Run" (o presiona Ctrl+Enter)
6. Verifica que aparezca el mensaje "Success. No rows returned"

## Paso 3: Configurar Autenticación

1. Ve a **Authentication > Providers** en el sidebar
2. Asegúrate de que **Email** esté habilitado (debe estar por defecto)
3. Configuración recomendada:
   - **Enable Email Confirmations**: OFF (para desarrollo)
   - **Enable Email Autoconfirm**: ON (para desarrollo)
   - **Minimum Password Length**: 6 caracteres
4. En **Authentication > URL Configuration**:
   - **Site URL**: http://localhost:5173 (para desarrollo)
   - **Redirect URLs**: Agrega http://localhost:5173/**

## Paso 4: Obtener Credenciales

1. Ve a **Settings > API**
2. Copia la información:
   - **Project URL**: https://xxxxxxxxxxxxx.supabase.co
   - **anon public**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

## Paso 5: Configurar Variables de Entorno

1. En la raíz del proyecto, crea un archivo `.env`:
   ```bash
   copy .env.example .env
   ```

2. Abre `.env` y reemplaza con tus credenciales:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```

3. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Paso 6: Instalar Dependencias

En la terminal, ejecuta:

```bash
npm install @supabase/supabase-js
```

## Paso 7: Verificar Instalación

1. Abre el navegador en http://localhost:5173
2. Deberías ver la pantalla de login/registro
3. Registra una cuenta de prueba
4. Verifica en **Supabase > Authentication > Users** que aparezca el usuario

## Paso 8: Verificar Base de Datos

1. Ve a **Table Editor** en Supabase
2. Deberías ver las tablas:
   - `transactions`
   - `user_profiles`
3. Crea una transacción en la app
4. Verifica que aparezca en la tabla `transactions`

## Configuración de Producción

Cuando deploys a producción (Netlify/Vercel):

1. Agrega las variables de entorno en el dashboard de tu hosting
2. Actualiza **Site URL** en Supabase con tu dominio real
3. Agrega tu dominio a **Redirect URLs**
4. En Authentication > URL Configuration:
   - **Site URL**: https://tu-dominio.com
   - **Redirect URLs**: https://tu-dominio.com/**

## Habilitar Email Confirmations (Producción)

Cuando estés listo para producción:

1. Ve a **Authentication > Providers > Email**
2. **Enable Email Confirmations**: ON
3. **Enable Email Autoconfirm**: OFF
4. Configura templates de email en **Authentication > Email Templates**

## Solución de Problemas

### Error: "Invalid API Key"
- Verifica que copiaste correctamente la `anon public` key
- Asegúrate de que el archivo `.env` está en la raíz del proyecto
- Reinicia el servidor de desarrollo

### Error: "Row Level Security Policy Violation"
- Verifica que ejecutaste TODO el script SQL
- Comprueba que las políticas RLS se crearon en **Authentication > Policies**

### Los datos no aparecen
- Abre las DevTools del navegador (F12)
- Ve a la pestaña Network
- Busca errores en las peticiones a Supabase
- Verifica que el `user_id` en las transacciones coincida con tu ID de usuario

### Error: "relation does not exist"
- Ejecuta nuevamente el script SQL completo
- Verifica que estés conectado al proyecto correcto en Supabase

## Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
