import React from 'react';
import {
  DonutWebP,
  HouseWebP,
  MoneyRainWebP,
  FireWebP,
  CoinsWebP,
  RocketWebP,
  TransportWebP,
  EntertainmentWebP,
  IncomeWebP,
  HomerMoneyWebP,
  WebPWithGlow,
  WebPWithHover
} from '../components/Shared/WebPAnimation';

/**
 * Página de prueba para ver todas las animaciones WebP
 * Temporal - solo para verificar que funcionan
 */
const AnimationsTest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          🎨 Animaciones Simpson Style
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Todas las animaciones WebP funcionando
        </p>
      </div>

      {/* Grid de animaciones */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Dona */}
        <AnimationCard
          title="🍩 Dona Simpson"
          subtitle="Categoría: Alimentación"
          animation={<DonutWebP size="2xl" />}
          bgColor="bg-pink-50 dark:bg-pink-900/20"
        />

        {/* Casa */}
        <AnimationCard
          title="🏠 Casa Simpson"
          subtitle="Categoría: Vivienda"
          animation={<HouseWebP size="2xl" />}
          bgColor="bg-orange-50 dark:bg-orange-900/20"
        />

        {/* Homer con dinero */}
        <AnimationCard
          title="💰 Homer Money"
          subtitle="Balance positivo"
          animation={<HomerMoneyWebP size="2xl" />}
          bgColor="bg-yellow-50 dark:bg-yellow-900/20"
        />

        {/* Lluvia de dinero */}
        <AnimationCard
          title="💵 Money Rain"
          subtitle="Ingresos altos"
          animation={<MoneyRainWebP size="2xl" />}
          bgColor="bg-green-50 dark:bg-green-900/20"
        />

        {/* Fuego */}
        <AnimationCard
          title="🔥 Fire Streak"
          subtitle="Racha activa"
          animation={<FireWebP size="2xl" />}
          bgColor="bg-red-50 dark:bg-red-900/20"
        />

        {/* Monedas */}
        <AnimationCard
          title="🪙 Gold Coins"
          subtitle="Ingreso agregado"
          animation={<CoinsWebP size="2xl" />}
          bgColor="bg-amber-50 dark:bg-amber-900/20"
        />

        {/* Cohete */}
        <AnimationCard
          title="🚀 Rocket"
          subtitle="Nueva meta"
          animation={<RocketWebP size="2xl" />}
          bgColor="bg-blue-50 dark:bg-blue-900/20"
        />

        {/* Transporte */}
        <AnimationCard
          title="🚗 Pink Car"
          subtitle="Categoría: Transporte"
          animation={<TransportWebP size="2xl" />}
          bgColor="bg-pink-50 dark:bg-pink-900/20"
        />

        {/* Entretenimiento */}
        <AnimationCard
          title="📺 TV"
          subtitle="Categoría: Entretenimiento"
          animation={<EntertainmentWebP size="2xl" />}
          bgColor="bg-purple-50 dark:bg-purple-900/20"
        />

        {/* Ingresos */}
        <AnimationCard
          title="💵 Income"
          subtitle="Icono general"
          animation={<IncomeWebP size="2xl" />}
          bgColor="bg-green-50 dark:bg-green-900/20"
        />
      </div>

      {/* Efectos especiales */}
      <div className="max-w-7xl mx-auto mt-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          ✨ Efectos Especiales
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Con Glow */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Glow Effect
            </h3>
            <WebPWithGlow 
              src="/animations/donut.webp"
              alt="Dona con glow"
              size="xl"
              glowColor="pink"
            />
          </div>

          {/* Con Hover */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Hover Scale
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              (pasa el mouse)
            </p>
            <WebPWithHover
              src="/animations/fire.webp"
              alt="Fuego con hover"
              size="xl"
              hoverEffect="scale"
            />
          </div>

          {/* Combinado */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Glow + Hover
            </h3>
            <div className="transition-transform duration-300 hover:scale-110">
              <WebPWithGlow
                src="/animations/Rocket.webp"
                alt="Cohete con efectos"
                size="xl"
                glowColor="blue"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Info técnica */}
      <div className="max-w-4xl mx-auto mt-16 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          📊 Info Técnica
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">Formato:</p>
            <p className="text-gray-600 dark:text-gray-400">WebP animado</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">Total archivos:</p>
            <p className="text-gray-600 dark:text-gray-400">10 animaciones</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">Peso promedio:</p>
            <p className="text-gray-600 dark:text-gray-400">~150 KB por archivo</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">Compatibilidad:</p>
            <p className="text-gray-600 dark:text-gray-400">97% navegadores</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente helper para cards
const AnimationCard = ({ title, subtitle, animation, bgColor }) => (
  <div className={`${bgColor} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300`}>
    <div className="flex flex-col items-center">
      <div className="mb-4">
        {animation}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {subtitle}
      </p>
    </div>
  </div>
);

export default AnimationsTest;
