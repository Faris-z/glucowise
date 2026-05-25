import StatGrid from '../components/StatGrid';
import TIRDonut from '../components/TIRDonut';
import GlucoseChart from '../components/GlucoseChart';
import PatternAlert from '../components/PatternAlert';
import InsightCard from '../components/InsightCard';
import { ChatBox } from '../components/index.jsx';

export default function Dashboard({ data, onReset }) {
  const { stats, patterns, chartData, hourlyBuckets, insights, usedDeep, model } = data;
  const criticalPatterns = patterns.filter(p => p.severity === 'critical' || p.severity === 'high');

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid var(--line)', background: 'var(--bg)' }}>
        <Logo size={19} />
        <button
          onClick={onReset}
          style={{ background: 'transparent', border: '1px solid var(--line)', padding: '8px 16px', borderRadius: 999, fontSize: 13, color: 'var(--ink)', transition: 'border-color 0.15s' }}
        >
          Upload New File
        </button>
      </div>

      {/* Header */}
      <div style={{ padding: '40px 40px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.06, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
            Your {stats.daysCovered}-Day Glucose Report
          </h1>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--muted)' }}>
            {stats.startDate} → {stats.endDate}
          </span>
          {usedDeep && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: 'var(--ink)', color: 'var(--paper)', fontSize: 11, fontFamily: 'var(--mono)', letterSpacing: '0.04em' }}>
              Deep Analysis
            </span>
          )}
        </div>
      </div>

      {/* Pattern alerts */}
      {criticalPatterns.length > 0 && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {criticalPatterns.map(p => <PatternAlert key={p.id} pattern={p} />)}
        </div>
      )}

      <div style={{ height: 28 }} />

      {/* Stat grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <StatGrid stats={stats} />
      </div>

      <div style={{ height: 16 }} />

      {/* Charts row */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '400px 1fr', gap: 16 }}>
        <TIRDonut tir={stats.tir} />
        <GlucoseChart data={chartData} />
      </div>

      <div style={{ height: 16 }} />

      {/* Insights */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <InsightCard insights={insights} model={model} patterns={patterns} />
      </div>

      <div style={{ height: 16 }} />

      {/* Chat */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px 60px' }}>
        <ChatBox context={{ stats, patterns }} />
      </div>
    </div>
  );
}

function Logo({ size = 20 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--sans)', fontWeight: 600, fontSize: size, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 3.2 C 7.8 8.2, 5.5 11.6, 5.5 14.6 a 6.5 6.5 0 0 0 13 0 c 0 -3 -2.3 -6.4 -6.5 -11.4 z" fill="#B5462E" />
        <path d="M9 14.5 c 0.6 1.6 1.7 2.4 3 2.4" stroke="#FBF9F4" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.85" />
      </svg>
      GlucoWise
    </span>
  );
}
