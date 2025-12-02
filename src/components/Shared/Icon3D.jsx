import { useState } from 'react';
import PropTypes from 'prop-types';
import { ICONS_EMOJI, ICON_SIZES } from '../../constants/icons';

/**
 * Componente para mostrar iconos 3D con fallback a emoji
 * Soporta animaciones hover y efectos visuales
 */
export const Icon3D = ({ 
  src, 
  alt, 
  size = 'md', 
  emoji = '📦',
  className = '',
  animate = false,
  glow = false,
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Si hay error o no hay src, mostrar emoji
  if (imageError || !src) {
    return (
      <span 
        className={`inline-block ${ICON_SIZES[size]} ${className}`}
        role="img" 
        aria-label={alt}
        style={{ fontSize: size === 'xs' ? '1rem' : size === 'sm' ? '1.5rem' : size === 'md' ? '2rem' : size === 'lg' ? '3rem' : '4rem' }}
      >
        {emoji}
      </span>
    );
  }

  return (
    <div className={`inline-block ${className}`}>
      <img
        src={src}
        alt={alt}
        onError={() => setImageError(true)}
        className={`
          ${ICON_SIZES[size]}
          object-contain
          ${animate ? 'transition-transform duration-300 hover:scale-110 hover:-rotate-6' : ''}
          ${glow ? 'drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]' : ''}
        `}
        loading="lazy"
      />
    </div>
  );
};

Icon3D.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']),
  emoji: PropTypes.string,
  className: PropTypes.string,
  animate: PropTypes.bool,
  glow: PropTypes.bool,
};

/**
 * Componente especializado para iconos de logros
 */
export const AchievementIcon = ({ type = 'bronze', size = 'lg', unlocked = false }) => {
  const icons = {
    bronze: { src: '/icons/3d/medal-bronze.png', emoji: '🥉' },
    silver: { src: '/icons/3d/medal-silver.png', emoji: '🥈' },
    gold: { src: '/icons/3d/medal-gold.png', emoji: '🥇' },
    trophy: { src: '/icons/3d/trophy-gold.png', emoji: '🏆' },
    star: { src: '/icons/3d/star.png', emoji: '⭐' },
    fire: { src: '/icons/3d/fire.png', emoji: '🔥' },
    diamond: { src: '/icons/3d/diamond.png', emoji: '💎' },
  };

  const icon = icons[type] || icons.bronze;

  return (
    <div className="relative inline-block">
      <Icon3D
        src={icon.src}
        alt={`${type} achievement`}
        emoji={icon.emoji}
        size={size}
        animate={unlocked}
        glow={unlocked}
        className={`${!unlocked ? 'opacity-30 grayscale' : ''}`}
      />
      {unlocked && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      )}
    </div>
  );
};

AchievementIcon.propTypes = {
  type: PropTypes.oneOf(['bronze', 'silver', 'gold', 'trophy', 'star', 'fire', 'diamond']),
  size: PropTypes.string,
  unlocked: PropTypes.bool,
};

/**
 * Componente para iconos de categorías
 */
export const CategoryIcon = ({ category, size = 'md', className = '' }) => {
  const categoryIcons = {
    'Vivienda': { src: '/icons/3d/house.png', emoji: '🏠' },
    'Alimentación': { src: '/icons/3d/food-cart.png', emoji: '🍽️' },
    'Transporte': { src: '/icons/3d/car.png', emoji: '🚗' },
    'Entretenimiento': { src: '/icons/3d/popcorn.png', emoji: '🎬' },
    'Salud': { src: '/icons/3d/medical.png', emoji: '⚕️' },
    'Educación': { src: '/icons/3d/books.png', emoji: '📚' },
    'Servicios': { src: '/icons/3d/lightbulb.png', emoji: '💡' },
    'Otros': { src: '/icons/3d/box.png', emoji: '📦' },
  };

  const icon = categoryIcons[category] || categoryIcons['Otros'];

  return (
    <Icon3D
      src={icon.src}
      alt={category}
      emoji={icon.emoji}
      size={size}
      animate
      className={className}
    />
  );
};

CategoryIcon.propTypes = {
  category: PropTypes.string.isRequired,
  size: PropTypes.string,
  className: PropTypes.string,
};
