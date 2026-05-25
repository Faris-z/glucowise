export default function StatGrid({ stats }) {
  const items = [
    { label: 'Mean Glucose', value: `${stats.mean} mg/dL`, note: stats.mean > 154 ? '⚠️ High' : '✓' },
    { label: 'GMI (est. A1c)', value: `${stats.gmi}%`, note: stats.gmi > 7 ? '⚠️' : '✓' },
    { label: 'Variability (CV)', value: `${stats.cv}%`, note: stats.cv > 36 ? '⚠️ High' : '✓ Stable' },
    { label: 'Std Deviation', value: `${stats.sd} mg/dL`, note: '' },
    { label: 'Time in Range', value: `${stats.tir.inRange}%`, note: stats.tir.inRange >= 70 ? '✓ Target met' : '⚠️ Below 70%' },
    { label: 'Readings', value: stats.count.toLocaleString(), note: `${stats.daysCovered} days` },
  ];

  return (
    <div className="stat-grid">
      {items.map(item => (
        <div key={item.label} className="stat-card">
          <div className="stat-value">{item.value}</div>
          <div className="stat-label">{item.label}</div>
          {item.note && <div className="stat-note">{item.note}</div>}
        </div>
      ))}
    </div>
  );
}
