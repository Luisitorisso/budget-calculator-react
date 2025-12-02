import PropTypes from 'prop-types';

/**
 * Componente Button reutilizable
 */
export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button',
  className = '',
  disabled = false,
}) => {
  const baseStyles = 'px-5 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-primary text-white hover:shadow-lg hover:scale-105 active:scale-95',
    danger: 'bg-gradient-danger text-white hover:shadow-lg hover:scale-105 active:scale-95',
    secondary: 'bg-white text-primary-500 border-2 border-primary-500 hover:bg-primary-50',
    outline: 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-2 border-primary-500 dark:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-semibold',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'danger', 'secondary', 'outline']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
};
