import StatGrid from '../components/StatGrid';
import TIRDonut from '../components/TIRDonut';
import GlucoseChart from '../components/GlucoseChart';
import PatternAlert from '../components/PatternAlert';
import InsightCard from '../components/InsightCard';
import ChatBox from '../components/ChatBox';

export default function Dashboard({ data, onReset }) {
  const { stats, patterns, chartData, hourlyBuckets, insights, usedOpus, model } = data;

  return (
    <div className="dashboard">
      <nav className="dash-nav">
        <span className="logo">🩸 GlucoWise</span>
        <button onClick={onReset} className="btn-secondary">Upload New File</button>
      </nav>

      <div className="dash-header">
        <h1>Your {stats.daysCovered}-Day Glucose Report</h1>
        <span className="date-range">{stats.startDate} → {stats.endDate}</span>
        {usedOpus && <span className="opus-badge">Deep Analysis (Opus)</span>}
      </div>

      {patterns.filter(p => p.severity === 'critical' || p.severity === 'high').map(p => (
        <PatternAlert key={p.id} pattern={p} />
      ))}

      <StatGrid stats={stats} />

      <div className="charts-row">
        <TIRDonut tir={stats.tir} />
        <GlucoseChart data={chartData} hourlyBuckets={hourlyBuckets} />
      </div>

      <InsightCard insights={insights} model={model} patterns={patterns} />

      <ChatBox context={{ stats, patterns }} />
    </div>
  );
}
