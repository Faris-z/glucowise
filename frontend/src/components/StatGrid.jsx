export default function StatGrid({ stats }) {
  const tiles = [
    { label: 'Average Glucose', value: stats.mean, unit: 'mg/dL', delta: stats.mean > 154 ? 'Above target' : 'On target', warn: stats.mean > 154 },
    { label: 'Estimated A1C (GMI)', value: stats.gmi, unit: '%', delta: stats.gmi > 7 ? 'Above 7%' : 'Within range', warn: stats.gmi > 7 },
    { label: 'Variability (CV)', value: stats.cv, unit: '%', delta: stats.cv > 36 ? 'High variability' : 'Target ≤ 36%', warn: stats.cv > 36 },
    { label: 'Time in Range', value: stats.tir.inRange, unit: '%', delta: stats.tir.inRange >= 70 ? 'Goal met ≥ 70%' : 'Goal ≥ 70%', warn: stats.tir.inRange < 70, tone: 'jade' },
    { label: 'Std Deviation', value: stats.sd, unit: 'mg/dL', delta: `${stats.count.toLocaleString()} readings` },
    { label: 'Days Covered', value: stats.daysCovered, unit: 'days', delta: `${stats.count.toLocaleString()} readings` },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
      {tiles.slice(0, 4).map(t => <StatTile key={t.label} {...t} />)}
    </div>
  );
}

function StatTile({ label, value, unit, delta, warn, tone }) {
  const valueColor = tone === 'jade' ? 'var(--jade)' : warn ? 'var(--coral)' : 'var(--ink)';
  return (
    <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 16, padding: '22px 22px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 148 }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</div>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 12 }}>
          <span style={{ fontFamily: 'var(--mono)', fontWeight: 500, fontSize: 44, letterSpacing: '-0.03em', color: valueColor, lineHeight: 1 }}>{value}</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--muted)' }}>{unit}</span>
        </div>
        {delta && (
          <div style={{ marginTop: 10, fontSize: 12, color: warn ? 'var(--coral)' : 'var(--jade)', fontFamily: 'var(--mono)' }}>{delta}</div>
        )}
      </div>
    </div>
  );
}
