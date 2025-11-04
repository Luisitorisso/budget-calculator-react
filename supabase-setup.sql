-- =====================================================
-- SCRIPT DE CONFIGURACIÓN DE BASE DE DATOS SUPABASE
-- Proyecto: Budget Calculator React
-- Fecha: 3 de noviembre de 2025
-- =====================================================

-- PASO 1: Crear extensión para UUID (si no existe)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PASO 2: CREAR TABLAS
-- =====================================================

-- Tabla: users (extiende auth.users de Supabase)
-- Esta tabla almacena información adicional del usuario
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: transactions
-- Almacena todas las transacciones financieras de los usuarios
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    category TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, date DESC);

-- =====================================================
-- PASO 3: HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PASO 4: POLÍTICAS RLS PARA USER_PROFILES
-- =====================================================

-- Política: Los usuarios pueden ver solo su propio perfil
CREATE POLICY "Users can view own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Política: Los usuarios pueden insertar su propio perfil
CREATE POLICY "Users can insert own profile"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Política: Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- PASO 5: POLÍTICAS RLS PARA TRANSACTIONS
-- =====================================================

-- Política: Los usuarios pueden ver solo sus propias transacciones
CREATE POLICY "Users can view own transactions"
    ON public.transactions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Política: Los usuarios pueden insertar sus propias transacciones
CREATE POLICY "Users can insert own transactions"
    ON public.transactions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios pueden actualizar sus propias transacciones
CREATE POLICY "Users can update own transactions"
    ON public.transactions
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios pueden eliminar sus propias transacciones
CREATE POLICY "Users can delete own transactions"
    ON public.transactions
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- PASO 6: TRIGGERS PARA UPDATED_AT
-- =====================================================

-- Función para actualizar el timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para user_profiles
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para transactions
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PASO 7: FUNCIÓN PARA CREAR PERFIL AUTOMÁTICAMENTE
-- =====================================================

-- Esta función crea automáticamente un perfil cuando un usuario se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que ejecuta la función cuando se crea un nuevo usuario
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- PASO 8: HABILITAR REALTIME (OPCIONAL)
-- =====================================================

-- Habilita actualizaciones en tiempo real para transactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;

-- =====================================================
-- PASO 9: DATOS DE EJEMPLO (OPCIONAL - SOLO PARA TESTING)
-- =====================================================

-- Descomenta las siguientes líneas si quieres datos de ejemplo
-- NOTA: Reemplaza 'USER_UUID' con un UUID real de auth.users

/*
INSERT INTO public.transactions (user_id, description, amount, category, type, date) VALUES
    ('USER_UUID', 'Salario Mensual', 1500.00, 'Salario', 'income', NOW() - INTERVAL '5 days'),
    ('USER_UUID', 'Freelance Proyecto Web', 450.00, 'Freelance', 'income', NOW() - INTERVAL '3 days'),
    ('USER_UUID', 'Alquiler', 600.00, 'Vivienda', 'expense', NOW() - INTERVAL '2 days'),
    ('USER_UUID', 'Supermercado', 150.00, 'Comida', 'expense', NOW() - INTERVAL '1 day'),
    ('USER_UUID', 'Netflix', 12.99, 'Entretenimiento', 'expense', NOW());
*/

-- =====================================================
-- PASO 10: VERIFICACIÓN
-- =====================================================

-- Verifica que las tablas se crearon correctamente
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'transactions');

-- Verifica que las políticas RLS están activas
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'transactions');

-- =====================================================
-- CONFIGURACIÓN COMPLETADA
-- =====================================================

-- Próximos pasos:
-- 1. Ejecuta este script en el SQL Editor de Supabase
-- 2. Configura las variables de entorno en tu proyecto React (.env)
-- 3. Instala @supabase/supabase-js: npm install @supabase/supabase-js
-- 4. Implementa los componentes de autenticación
-- 5. Prueba el registro/login de usuarios
