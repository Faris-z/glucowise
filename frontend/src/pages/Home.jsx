import { useState } from 'react';
import UploadZone from '../components/UploadZone';

export default function Home({ onAnalysis }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file) {
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);

      const API = import.meta.env.VITE_API_URL || '';
      const uploadRes = await fetch(`${API}/api/upload`, { method: 'POST', body: formData });
      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.error || 'Upload failed');
      }
      const uploadData = await uploadRes.json();

      const analyzeRes = await fetch(`${API}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats: uploadData.stats, patterns: uploadData.patterns }),
      });
      const aiData = await analyzeRes.json();

      onAnalysis({ ...uploadData, ...aiData });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Nav */}
      <div style={{ padding: '24px 40px', display: 'flex', alignItems: 'center' }}>
        <Logo size={20} />
      </div>

      {/* Hero */}
      <div style={{ padding: '60px 40px 32px', maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(48px, 8vw, 76px)', lineHeight: 1.04, letterSpacing: '-0.025em', color: 'var(--ink)' }}>
          Your glucose data,<br />
          <em style={{ fontStyle: 'italic', color: 'var(--coral)' }}>honestly</em> interpreted.
        </h1>
        <p style={{ marginTop: 20, fontSize: 16, color: 'var(--muted)', lineHeight: 1.6 }}>
          Upload your CGM export and get deep, honest AI analysis — not just averages.
        </p>
      </div>

      {/* Upload zone */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 40px' }}>
        <UploadZone onFile={handleFile} loading={loading} />

        {error && (
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--coral-soft)', border: '1px solid var(--coral)', borderRadius: 12, color: 'var(--coral)', fontSize: 14 }}>
            {error}
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--muted)' }}>
          Supports LibreLink, Dexcom Clarity, and any CGM CSV export
        </p>
      </div>

      {/* Features row */}
      <div style={{ maxWidth: 880, margin: '64px auto 0', padding: '0 40px 80px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {[
          { title: 'Honest patterns', body: 'Detects when your Time-in-Range looks fine but readings are actually dangerous.' },
          { title: 'No data stored', body: 'Your CSV is processed in memory and discarded. Nothing is saved.' },
          { title: 'Plain language', body: 'AI explains everything as a patient, not a clinician. Bring it to your doctor.' },
        ].map(f => (
          <div key={f.title} style={{ borderTop: '1px solid var(--line)', paddingTop: 20 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>{f.title}</div>
            <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6 }}>{f.body}</div>
          </div>
        ))}
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
