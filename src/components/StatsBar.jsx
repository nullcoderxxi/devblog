import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@apollo/client/react';
import { GET_STATS } from '../graphql/queries';
import useCountUp from '../hooks/useCountUp';

const FALLBACK = [
  { label: 'Articles', value: 6, icon: '📝', color: '#6366f1' },
  { label: 'Total Views', value: 18540, icon: '👁️', color: '#10b981' },
  { label: 'Comments', value: 0, icon: '💬', color: '#f59e0b' },
  { label: 'Topics', value: 6, icon: '🏷️', color: '#8b5cf6' },
];

function StatCard({ stat, delay }) {
  const [ref, inView] = useInView({ triggerOnce: true });
  const count = useCountUp(inView ? stat.value : 0, 1400, 0);

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.4, type: 'spring', stiffness: 200 }}
      whileHover={{ y: -5, boxShadow: `0 12px 30px ${stat.color}20` }}
      className="glass" style={{ padding: '20px', textAlign: 'center', cursor: 'default' }}>
      <div style={{ fontSize: '26px', marginBottom: '8px' }}>{stat.icon}</div>
      <div style={{ fontSize: '26px', fontWeight: 800, color: stat.color, fontFamily: 'monospace', marginBottom: '4px' }}>
        {stat.value >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
      </div>
      <div style={{ color: '#4a5568', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
    </motion.div>
  );
}

export default function StatsBar() {
  const { data } = useQuery(GET_STATS);
  const s = data?.getStats;

  const statsArr = s ? [
    { label: 'Articles', value: s.totalPosts, icon: '📝', color: '#6366f1' },
    { label: 'Total Views', value: s.totalViews, icon: '👁️', color: '#10b981' },
    { label: 'Comments', value: s.totalComments, icon: '💬', color: '#f59e0b' },
    { label: 'Authors', value: s.totalAuthors, icon: '👤', color: '#8b5cf6' },
  ] : FALLBACK;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '14px' }}>
      {statsArr.map((stat, i) => <StatCard key={stat.label} stat={stat} delay={i * 0.08} />)}
    </div>
  );
}
