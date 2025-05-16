import { useState, useEffect } from 'react';

type RangeSliderProps = {
  questionId?: string;
  value?: number;
  onChange?: (e: { target: { value: number } }) => void;
  disabled?: boolean;
};

export default function RangeSlider({ value, onChange, disabled }: RangeSliderProps) {
  const [sliderValue, setSliderValue] = useState(value || 3);
  const [isDragging, setIsDragging] = useState(false);
  
  useEffect(() => {
    if (value !== undefined) {
      setSliderValue(Number(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setSliderValue(newValue);
    if (onChange) {
      onChange({ target: { value: newValue } });
    }
  };

  // Labels for the range values
  const labels = ['Péssimo', 'ruim', 'Normal', 'Bom', 'Excelente'];

  return (
    <div className="w-full max-w-md mx-auto my-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-300">1</span>
          <span className="text-sm font-medium text-gray-300">5</span>
        </div>
        
        <div className="relative">
          {/* Slider track background */}
          <div className="absolute h-2 w-full bg-gray-700 rounded-full"></div>
          
          {/* Colored track based on value */}
          <div 
            className="absolute h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" 
            style={{ width: `${(sliderValue - 1) * 25}%` }}
          ></div>
          
          {/* The actual range input */}
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={sliderValue}
            onChange={handleChange}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            disabled={disabled}
            className="appearance-none w-full h-2 bg-transparent rounded-full outline-none cursor-pointer relative z-10"
            style={{
              WebkitAppearance: 'none',
              MozAppearance: 'none'
            }}
          />
          
          {/* Tick marks */}
          <div className="absolute top-1 left-0 w-full flex justify-between px-0.5">
            {[1, 2, 3, 4, 5].map((tick) => (
              <div 
                key={tick} 
                className={`w-3 h-3 rounded-full -mt-0.5 ${
                  tick <= sliderValue ? 'bg-purple-500' : 'bg-gray-600'
                } ${tick === sliderValue ? 'ring-2 ring-purple-300 ring-opacity-50 scale-125' : ''}`}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Current value indicator */}
        <div className="text-center">
          <span className={`text-xl font-bold transition-all duration-300 ${
            isDragging ? 'text-purple-400 scale-110' : 'text-white'
          }`}>
            {sliderValue}
          </span>
          <p className={`text-sm mt-1 transition-all duration-300 ${
            isDragging ? 'text-purple-300' : 'text-gray-400'
          }`}>
            {labels[sliderValue - 1]}
          </p>
        </div>
        
        {/* Labels under the slider */}
        <div className="flex justify-between px-1 pt-2">
          {labels.map((label, index) => (
            <div 
              key={index} 
              className={`text-xs font-medium text-center w-1/5 transition-all duration-200 ${
                index + 1 === sliderValue ? 'text-purple-400' : 'text-gray-500'
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}