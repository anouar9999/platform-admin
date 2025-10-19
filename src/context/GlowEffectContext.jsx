import React, { useEffect, useState } from 'react'
import { createContext } from 'react';

export const GlowEffectContext = createContext();
const GlowEffectContextProvider = ({children}) => {
const [showGlow, setshowGlow] = useState(false)
useEffect(() => {
  const timer = setTimeout(() => {
    setshowGlow(false);
  }, 700    );
      return () => clearTimeout(timer);
}, [showGlow]);
  return (
   
      <GlowEffectContext.Provider value={{showGlow, setshowGlow}}>
               <div className={`fixed inset-0 z-[999] pointer-events-none transition-opacity duration-1000 ${showGlow ? 'opacity-100' : 'opacity-0'}`}>
        {/* Top edge */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-green-500 via-green-500/20 to-transparent"></div>
        {/* Bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-green-500 via-green-500/20 to-transparent"></div>
        {/* Left edge */}
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-green-500 via-green-500/20 to-transparent"></div>
        {/* Right edge */}
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-green-500 via-green-500/20 to-transparent"></div>
      </div>
            {children}
      </GlowEffectContext.Provider>
  )
}

export default GlowEffectContextProvider