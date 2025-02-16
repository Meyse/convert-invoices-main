import React from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

export function Slider({ value, onChange, min, max, step }: SliderProps) {
  return (
    <div className="relative w-full">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-[#131A2A] rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #3165D4 0%, #3165D4 ${(value - min) / (max - min) * 100}%, #131A2A ${(value - min) / (max - min) * 100}%, #131A2A 100%)`
        }}
      />
      <div className="flex justify-between text-xs text-[#5D6785] mt-2">
        <span>{min}%</span>
        <span>{max}%</span>
      </div>
    </div>
  );
} 