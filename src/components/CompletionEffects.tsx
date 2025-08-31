import React, { useEffect, useState } from 'react';

interface CompletionEffectsProps {
  show: boolean;
  type: 'task' | 'levelUp' | 'badge';
  message?: string;
  onComplete: () => void;
}

export const CompletionEffects: React.FC<CompletionEffectsProps> = ({
  show,
  type,
  message,
  onComplete
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  useEffect(() => {
    if (show && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Generate confetti particles
      const newParticles = Array.from({ length: type === 'levelUp' ? 50 : 20 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        color: ['#f59e0b', '#8b5cf6', '#06b6d4', '#10b981', '#f97316'][Math.floor(Math.random() * 5)]
      }));
      
      setParticles(newParticles);
      
      // Auto-complete after animation
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete();
      }, type === 'levelUp' ? 3000 : 1500);
      
      return () => clearTimeout(timer);
    } else if (show) {
      // For reduced motion, just show toast briefly
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [show, type, onComplete]);

  if (!show) return null;

  return (
    <>
      {/* Confetti particles */}
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 animate-bounce"
              style={{
                left: particle.x,
                top: particle.y,
                backgroundColor: particle.color,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      )}

      {/* Toast notification */}
      <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
        <div className={`
          bg-white/10 backdrop-blur-xl border border-white/15 rounded-xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.25)]
          ${type === 'levelUp' ? 'border-yellow-400/30 shadow-[0_0_30px_rgba(251,191,36,0.3)]' : ''}
          ${type === 'badge' ? 'border-purple-400/30 shadow-[0_0_30px_rgba(168,85,247,0.3)]' : ''}
        `}>
          <div className="flex items-center space-x-3">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-xl
              ${type === 'task' ? 'bg-green-500/20 text-green-400' : ''}
              ${type === 'levelUp' ? 'bg-yellow-500/20 text-yellow-400' : ''}
              ${type === 'badge' ? 'bg-purple-500/20 text-purple-400' : ''}
            `}>
              {type === 'task' && '✓'}
              {type === 'levelUp' && '🎉'}
              {type === 'badge' && '🏆'}
            </div>
            <div>
              <div className="text-white font-medium">
                {type === 'task' && 'Task Completed!'}
                {type === 'levelUp' && 'Level Up!'}
                {type === 'badge' && 'Badge Earned!'}
              </div>
              {message && (
                <div className="text-white/70 text-sm">{message}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
};
