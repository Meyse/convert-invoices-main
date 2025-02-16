import React from 'react';

export function BackgroundGradient() {
  return (
    <div className="fixed inset-0 overflow-hidden isolate">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[20%] left-[15%] w-[35vw] h-[35vw] rounded-full bg-white/70 blur-[100px] animate-float-slow" />
        <div className="absolute bottom-[10%] right-[20%] w-[45vw] h-[45vw] rounded-full bg-white/30 blur-[120px] animate-float-slower" />
        <div className="absolute top-[40%] right-[25%] w-[25vw] h-[25vw] rounded-full bg-white/70 blur-[200px] animate-float" />
      </div>
    </div>
  );
} 