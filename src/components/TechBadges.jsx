const techs = ['Next.js', 'Node.js', 'MongoDB', 'GraphQL', 'React.js', 'Framer Motion', 'Tailwind CSS', 'React Router', 'Markdown', 'REST API'];

export default function TechBadges() {
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(12,14,22,0.97)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '10px', overflowX: 'auto' }}>
      <span style={{ color: '#4a5568', fontSize: '11px', fontWeight: 700, flexShrink: 0, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Tech Stack:</span>
      {techs.map(t => (
        <span key={t} style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)', flexShrink: 0 }}>{t}</span>
      ))}
    </div>
  );
}
