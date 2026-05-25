import { LineChart, Line, XAxis, YAxis, ReferenceLine, Tooltip, ResponsiveContainer } from 'recharts';

export default function GlucoseChart({ data }) {
  const formatted = data.map(r => ({
    t: new Date(r.t).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    glucose: r.g,
  }));

  return (
    <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 20, padding: '26px 28px 24px' }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>Glucose timeline</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 24, color: 'var(--ink)', marginTop: 4 }}>All readings over time</div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={formatted} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis dataKey="t" tick={{ fontSize: 10, fontFamily: 'var(--mono)', fill: '#8A877B' }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
          <YAxis domain={[40, 320]} tick={{ fontSize: 10, fontFamily: 'var(--mono)', fill: '#8A877B' }} axisLine={false} tickLine={false} width={32} />
          <Tooltip
            contentStyle={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 10, fontFamily: 'var(--mono)', fontSize: 12 }}
            itemStyle={{ color: 'var(--ink)' }}
            labelStyle={{ color: 'var(--muted)' }}
          />
          <ReferenceLine y={70} stroke="#B5462E" strokeDasharray="3 4" strokeWidth={1} />
          <ReferenceLine y={180} stroke="#C58A2B" strokeDasharray="3 4" strokeWidth={1} />
          <Line type="monotone" dataKey="glucose" stroke="var(--jade)" dot={false} strokeWidth={1.5} />
        </LineChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: 20, marginTop: 12, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 18, height: 2, background: '#B5462E', display: 'inline-block', borderRadius: 2 }} />
          70 mg/dL low
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 18, height: 2, background: '#C58A2B', display: 'inline-block', borderRadius: 2 }} />
          180 mg/dL high
        </span>
      </div>
    </div>
  );
}
