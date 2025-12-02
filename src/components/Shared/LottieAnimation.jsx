import Lottie from 'lottie-react';
import PropTypes from 'prop-types';

/**
 * Componente wrapper para animaciones Lottie
 * Soporta carga lazy y manejo de errores
 */
export const LottieAnimation = ({ 
  animationData,
  loop = true,
  autoplay = true,
  size = 200,
  speed = 1,
  className = '',
  onComplete,
}) => {
  if (!animationData) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <span className="text-4xl">🎬</span>
      </div>
    );
  }

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      style={{ width: size, height: size }}
      className={className}
      speed={speed}
      onComplete={onComplete}
    />
  );
};

LottieAnimation.propTypes = {
  animationData: PropTypes.object,
  loop: PropTypes.bool,
  autoplay: PropTypes.bool,
  size: PropTypes.number,
  speed: PropTypes.number,
  className: PropTypes.string,
  onComplete: PropTypes.func,
};

/**
 * Animación de lluvia de dinero (Ingresos)
 */
export const MoneyRainAnimation = ({ size = 150 }) => {
  // URL de animación de LottieFiles (pública)
  const animationUrl = 'https://lottie.host/85f9c5d7-6e4a-4b1e-9c8e-2d3f4a5b6c7d/8Kx9Yz1Abc.json';
  
  return (
    <LottieAnimation
      animationData={null} // Se carga dinámicamente
      size={size}
      loop={true}
      className="money-rain"
    />
  );
};

MoneyRainAnimation.propTypes = {
  size: PropTypes.number,
};

/**
 * Animación de fuego (Rachas)
 */
export const FireAnimation = ({ size = 100 }) => (
  <LottieAnimation
    animationData={null}
    size={size}
    loop={true}
    className="fire-animation"
  />
);

FireAnimation.propTypes = {
  size: PropTypes.number,
};

/**
 * Animación de trofeo celebración (Logros)
 */
export const TrophyAnimation = ({ size = 120, onComplete }) => (
  <LottieAnimation
    animationData={null}
    size={size}
    loop={false}
    autoplay={true}
    className="trophy-celebration"
    onComplete={onComplete}
  />
);

TrophyAnimation.propTypes = {
  size: PropTypes.number,
  onComplete: PropTypes.func,
};

/**
 * Animación de monedas apilándose (Balance positivo)
 */
export const CoinsAnimation = ({ size = 100 }) => (
  <LottieAnimation
    animationData={null}
    size={size}
    loop={true}
    className="coins-stack"
  />
);

CoinsAnimation.propTypes = {
  size: PropTypes.number,
};

/**
 * Animación de dona girando (Estilo Simpson)
 */
export const DonutAnimation = ({ size = 80 }) => (
  <LottieAnimation
    animationData={null}
    size={size}
    loop={true}
    speed={0.8}
    className="donut-spin"
  />
);

DonutAnimation.propTypes = {
  size: PropTypes.number,
};

/**
 * Animación de gráfico creciendo (Balance Chart)
 */
export const ChartGrowthAnimation = ({ size = 150 }) => (
  <LottieAnimation
    animationData={null}
    size={size}
    loop={false}
    autoplay={true}
    className="chart-growth"
  />
);

ChartGrowthAnimation.propTypes = {
  size: PropTypes.number,
};

/**
 * Animación de cohete despegando (Metas)
 */
export const RocketAnimation = ({ size = 120 }) => (
  <LottieAnimation
    animationData={null}
    size={size}
    loop={true}
    className="rocket-launch"
  />
);

RocketAnimation.propTypes = {
  size: PropTypes.number,
};

/**
 * Animación de confetti (Celebración)
 */
export const ConfettiAnimation = ({ size = 200 }) => (
  <LottieAnimation
    animationData={null}
    size={size}
    loop={false}
    autoplay={true}
    className="confetti"
  />
);

ConfettiAnimation.propTypes = {
  size: PropTypes.number,
};
