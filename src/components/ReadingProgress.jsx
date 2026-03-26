import { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const spring = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const pct = scrollHeight === clientHeight ? 0 : (scrollTop / (scrollHeight - clientHeight)) * 100;
      setProgress(pct);
      spring.set(pct);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-white/5">
      <motion.div
        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"
        style={{ width: spring.get() + '%' }}
        animate={{ width: progress + '%' }}
        transition={{ type: 'spring', stiffness: 100, damping: 30 }}
      />
    </div>
  );
}
