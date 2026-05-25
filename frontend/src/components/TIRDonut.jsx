import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = {
  veryLow: '#b91c1c',
  low: '#f97316',
  inRange: '#22c55e',
  high: '#f59e0b',
  veryHigh: '#dc2626',
};

const LABELS = {
  veryLow: '<54 mg/dL',
  low: '54–69',
  inRange: '70–180',
  high: '181–250',
  veryHigh: '>250',
};

export default function TIRDonut({ tir }) {
  const data = Object.entries(tir)
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({ name: LABELS[key], value, key }));

  return (
    <div className="chart-card">
      <h3>Time in Range</h3>
      <PieChart width={280} height={240}>
        <Pie data={data} cx={140} cy={110} innerRadius={60} outerRadius={100} dataKey="value">
          {data.map(entry => (
            <Cell key={entry.key} fill={COLORS[entry.key]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => `${v}%`} />
        <Legend />
      </PieChart>
      <div className="tir-target">
        Target: ≥70% in range — You: <strong>{tir.inRange}%</strong>
      </div>
    </div>
  );
}
