/**
 * Sistema de iconos 3D para Budget Calculator
 * Iconos descargados de Blush.design e Iconscout (uso comercial permitido)
 */

// URLs de iconos 3D (temporales - reemplazar con archivos locales)
export const ICONS_3D = {
  // Finanzas principales
  income: '/icons/3d/money-bag.png',        // Bolsa de dinero verde
  expense: '/icons/3d/flying-money.png',    // Billetes volando
  balance: '/icons/3d/chart-up.png',        // Gráfico ascendente
  wallet: '/icons/3d/wallet.png',           // Billetera 3D
  
  // Tarjetas y deudas
  creditCard: '/icons/3d/credit-card.png',  // Tarjeta 3D flotante
  bankCard: '/icons/3d/bank-card.png',      // Tarjeta bancaria
  debt: '/icons/3d/debt-chart.png',         // Gráfico de deuda
  
  // Metas financieras
  goal: '/icons/3d/target.png',             // Diana con flecha
  trophy: '/icons/3d/trophy-gold.png',      // Trofeo dorado
  rocket: '/icons/3d/rocket.png',           // Cohete 3D
  diamond: '/icons/3d/diamond.png',         // Diamante brillante
  
  // Logros y gamificación
  medal: {
    bronze: '/icons/3d/medal-bronze.png',   // Medalla bronce
    silver: '/icons/3d/medal-silver.png',   // Medalla plata
    gold: '/icons/3d/medal-gold.png',       // Medalla oro
  },
  fire: '/icons/3d/fire.png',               // Fuego para rachas
  star: '/icons/3d/star.png',               // Estrella dorada
  chest: '/icons/3d/treasure-chest.png',    // Cofre del tesoro
  
  // Categorías de gastos (3D)
  categories: {
    housing: '/icons/3d/house.png',         // Casa 3D
    food: '/icons/3d/food-cart.png',        // Carrito de comida
    transport: '/icons/3d/car.png',         // Auto 3D
    entertainment: '/icons/3d/popcorn.png', // Palomitas
    health: '/icons/3d/medical.png',        // Cruz médica
    education: '/icons/3d/books.png',       // Libros apilados
    services: '/icons/3d/lightbulb.png',    // Bombillo 3D
    others: '/icons/3d/box.png',            // Caja 3D
  },
  
  // Acciones UI
  add: '/icons/3d/plus-circle.png',         // Círculo con +
  remove: '/icons/3d/minus-circle.png',     // Círculo con -
  delete: '/icons/3d/trash.png',            // Basurero 3D
  check: '/icons/3d/check-circle.png',      // Check verde
  
  // Gráficos y estadísticas
  pieChart: '/icons/3d/pie-chart.png',      // Gráfico circular 3D
  barChart: '/icons/3d/bar-chart.png',      // Gráfico de barras
  trendUp: '/icons/3d/trend-up.png',        // Tendencia ascendente
  trendDown: '/icons/3d/trend-down.png',    // Tendencia descendente
  
  // Otros
  calendar: '/icons/3d/calendar.png',       // Calendario 3D
  notification: '/icons/3d/bell.png',       // Campana
  settings: '/icons/3d/gear.png',           // Engranaje
};

// Fallback a emojis si no carga la imagen
export const ICONS_EMOJI = {
  income: '💰',
  expense: '💸',
  balance: '📊',
  creditCard: '💳',
  goal: '🎯',
  trophy: '🏆',
  fire: '🔥',
  star: '⭐',
  medal: '🏅',
  check: '✅',
  delete: '🗑️',
};

// Tamaños predefinidos
export const ICON_SIZES = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-24 h-24',
  '3xl': 'w-32 h-32',
};
