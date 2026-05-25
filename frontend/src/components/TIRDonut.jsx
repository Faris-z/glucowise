export default function TIRDonut({ tir }) {
  const data = [
    { k: 'Very low', range: '< 54 mg/dL', value: tir.veryLow || 0, color: '#8E2A1B' },
    { k: 'Low', range: '54 – 69', value: tir.low || 0, color: 'var(--coral)' },
    { k: 'In range', range: '70 – 180', value: tir.inRange || 0, color: 'var(--jade)' },
    { k: 'High', range: '181 – 250', value: tir.high || 0, color: 'var(--amber)' },
    { k: 'Very high', range: '> 250', value: tir.veryHigh || 0, color: '#8A5A14' },
  ];

  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const R = 92, r = 64, cx = 120, cy = 120;
  let acc = 0;
  const arcs = data.map((d, i) => {
    if (d.value === 0) return null;
    const start = (acc / total) * Math.PI * 2 - Math.PI / 2;
    acc += d.value;
    const end = (acc / total) * Math.PI * 2 - Math.PI / 2;
    const large = end - start > Math.PI ? 1 : 0;
    return <path key={i} d={describeArc(cx, cy, R, r, start, end, large)} fill={d.color} />;
  });

  return (
    <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 20, padding: '26px 28px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>Time in range</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 24, color: 'var(--ink)', marginTop: 4 }}>Daily distribution</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 240, height: 240, flexShrink: 0 }}>
          <svg width="240" height="240" viewBox="0 0 240 240">{arcs}</svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--muted)', textTransform: 'uppercase' }}>In range</div>
            <div style={{ fontFamily: 'var(--mono)', fontWeight: 500, fontSize: 48, letterSpacing: '-0.03em', color: 'var(--ink)', lineHeight: 1, marginTop: 4 }}>
              {tir.inRange}<span style={{ fontSize: 20, color: 'var(--muted)' }}>%</span>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: tir.inRange >= 70 ? 'var(--jade)' : 'var(--coral)', marginTop: 6 }}>
              {tir.inRange >= 70 ? 'Goal met ✓' : 'Goal ≥ 70%'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data.slice().reverse().map(d => (
            <div key={d.k} style={{ display: 'grid', gridTemplateColumns: '10px 90px 1fr 44px', gap: 10, alignItems: 'center' }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color, display: 'block' }} />
              <span style={{ fontSize: 12.5, color: 'var(--ink)' }}>{d.k}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>{d.range}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink)', textAlign: 'right' }}>{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function describeArc(cx, cy, R, r, start, end, large) {
  const p = (a, rad) => [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad];
  const [x1, y1] = p(start, R), [x2, y2] = p(end, R);
  const [x3, y3] = p(end, r), [x4, y4] = p(start, r);
  return `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`;
}
