import { useState } from 'react'
import { LoginForm } from '../components/Auth/LoginForm'
import { RegisterForm } from '../components/Auth/RegisterForm'
import { ForgotPasswordForm } from '../components/Auth/ForgotPasswordForm'

export default function AuthPage() {
  const [mode, setMode] = useState('login') // 'login', 'register', 'forgot'

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Budget Calculator
          </h1>
          <p className="text-gray-600">
            {mode === 'login' && 'Inicia sesión para continuar'}
            {mode === 'register' && 'Crea tu cuenta gratis'}
            {mode === 'forgot' && 'Recupera tu contraseña'}
          </p>
        </div>

        {/* Forms */}
        {mode === 'login' && <LoginForm />}
        {mode === 'register' && <RegisterForm />}
        {mode === 'forgot' && <ForgotPasswordForm />}

        {/* Toggle modes */}
        <div className="mt-6 text-center space-y-2">
          {mode === 'login' && (
            <>
              <button
                onClick={() => setMode('register')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                ¿No tienes cuenta? Regístrate
              </button>
              <br />
              <button
                onClick={() => setMode('forgot')}
                className="text-gray-600 hover:text-gray-700 text-sm"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </>
          )}

          {mode === 'register' && (
            <button
              onClick={() => setMode('login')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          )}

          {mode === 'forgot' && (
            <button
              onClick={() => setMode('login')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Volver al inicio de sesión
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 Budget Calculator</p>
        </div>
      </div>
    </div>
  )
}
