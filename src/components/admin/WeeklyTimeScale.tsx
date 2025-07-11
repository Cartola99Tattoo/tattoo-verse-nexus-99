
import React from 'react';
import { Clock } from 'lucide-react';

interface WeeklyTimeScaleProps {
  currentDate: Date;
}

const WeeklyTimeScale: React.FC<WeeklyTimeScaleProps> = ({ currentDate }) => {
  // CONSTANTES MATEMÁTICAS PARA ALINHAMENTO PERFEITO
  const PIXELS_PER_HOUR = 80;
  const START_HOUR = 8;
  const END_HOUR = 20;
  
  // Escala de tempo ultra-proeminente com cálculos precisos
  const timeScale = [];
  for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
    const isCurrentHour = new Date().getHours() === hour;
    const isPeakHour = hour >= 12 && hour <= 16;
    
    timeScale.push({ 
      hour, 
      label: `${hour.toString().padStart(2, '0')}:00`,
      isCurrentHour,
      isPeakHour,
      isMainHour: true,
      topPosition: (hour - START_HOUR) * PIXELS_PER_HOUR
    });
  }

  const isToday = new Date().toDateString() === currentDate.toDateString();
  const totalHeight = (END_HOUR - START_HOUR + 1) * PIXELS_PER_HOUR;

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 border-2 border-gray-300 rounded-2xl p-4 shadow-lg">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-red-600" />
          <h3 className="font-black text-gray-800 text-base tracking-wide">HORÁRIOS</h3>
        </div>
        <div className="w-full h-0.5 bg-gradient-to-r from-red-600 to-red-700 mt-3 rounded-full"></div>
        {isToday && (
          <div className="mt-2">
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-200">
              HOJE
            </span>
          </div>
        )}
      </div>
      
      <div 
        className="space-y-0 relative" 
        style={{ height: `${totalHeight}px` }}
      >
        {timeScale.map((time) => (
          <div 
            key={time.hour}
            className="absolute left-0 right-0 flex items-center justify-center"
            style={{ 
              top: `${time.topPosition}px`,
              height: `${PIXELS_PER_HOUR}px`
            }}
          >
            {/* Marcador de horário proeminente - POSICIONAMENTO MATEMÁTICO PRECISO */}
            <div 
              className={`
                text-center font-black rounded-xl border-2 px-4 py-2 text-sm shadow-sm transition-all duration-300 z-20
                ${time.isCurrentHour && isToday 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white border-red-500 shadow-red-200 scale-110' 
                  : time.isPeakHour 
                  ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300 text-gray-800' 
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300 text-gray-800'
                }
              `}
            >
              {time.label}
            </div>
            
            {/* Linha de grade horizontal - ALINHAMENTO PERFEITO */}
            <div 
              className={`
                absolute right-0 h-px transition-all duration-300 z-10
                ${time.isCurrentHour && isToday 
                  ? 'w-8 bg-gradient-to-r from-red-500 to-transparent' 
                  : 'w-6 bg-gradient-to-r from-gray-300 to-transparent'
                }
              `}
            />
            
            {/* Linha de meio (30min) sutil - MATEMÁTICA PRECISA */}
            <div 
              className="absolute right-0 w-4 h-px bg-gradient-to-r from-gray-200 to-transparent z-5"
              style={{ top: `${PIXELS_PER_HOUR / 2}px` }}
            />
          </div>
        ))}
        
        {/* Indicador de jornada de trabalho */}
        <div className="absolute left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 via-yellow-400 to-red-400 rounded-full opacity-20 z-5"></div>
      </div>
    </div>
  );
};

export default WeeklyTimeScale;
