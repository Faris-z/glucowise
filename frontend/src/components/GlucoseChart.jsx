import { LineChart, Line, XAxis, YAxis, ReferenceLine, Tooltip, ResponsiveContainer } from 'recharts';

export default function GlucoseChart({ data }) {
  const formatted = data.map(r => ({
    t: new Date(r.t).toLocaleDateString(),
    glucose: r.g,
  }));

  return (
    <div className="chart-card chart-wide">
      <h3>Glucose Timeline</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={formatted} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <XAxis dataKey="t" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
          <YAxis domain={[40, 300]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <ReferenceLine y={70} stroke="#f97316" strokeDasharray="4 2" label={{ value: '70', fontSize: 10 }} />
          <ReferenceLine y={180} stroke="#f59e0b" strokeDasharray="4 2" label={{ value: '180', fontSize: 10 }} />
          <Line
            type="monotone"
            dataKey="glucose"
            stroke="#22c55e"
            dot={false}
            strokeWidth={1.5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
