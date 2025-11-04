import { PlayerProgress } from './PlayerProgress';
import { AchievementsPanel } from './AchievementsPanel';
import PropTypes from 'prop-types';

/**
 * Componente principal de gamificación
 * Combina el progreso del jugador y el panel de logros
 */
export const GamificationDashboard = ({ 
  currentLevel,
  totalPoints,
  pointsForNext,
  levelProgress,
  currentStreak,
  longestStreak,
  unlockedAchievements,
  isAchievementUnlocked,
}) => {
  return (
    <div className="space-y-6">
      {/* Progreso del jugador */}
      <PlayerProgress
        currentLevel={currentLevel}
        totalPoints={totalPoints}
        pointsForNext={pointsForNext}
        levelProgress={levelProgress}
        currentStreak={currentStreak}
        longestStreak={longestStreak}
      />

      {/* Panel de logros */}
      <AchievementsPanel
        unlockedAchievements={unlockedAchievements}
        isAchievementUnlocked={isAchievementUnlocked}
      />
    </div>
  );
};

GamificationDashboard.propTypes = {
  currentLevel: PropTypes.number.isRequired,
  totalPoints: PropTypes.number.isRequired,
  pointsForNext: PropTypes.number.isRequired,
  levelProgress: PropTypes.number.isRequired,
  currentStreak: PropTypes.number.isRequired,
  longestStreak: PropTypes.number.isRequired,
  unlockedAchievements: PropTypes.array.isRequired,
  isAchievementUnlocked: PropTypes.func.isRequired,
};
