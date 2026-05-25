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

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.error || 'Upload failed');
      }
      const uploadData = await uploadRes.json();

      // Trigger AI analysis
      const analyzeRes = await fetch('/api/analyze', {
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
    <div className="home">
      <header>
        <div className="logo">🩸 GlucoWise</div>
        <p className="tagline">Your glucose data, honestly interpreted.</p>
      </header>
      <UploadZone onFile={handleFile} loading={loading} />
      {error && <div className="error-banner">{error}</div>}
      <div className="supported">
        Supports LibreLink, Dexcom Clarity, and any CGM CSV export
      </div>
    </div>
  );
}
