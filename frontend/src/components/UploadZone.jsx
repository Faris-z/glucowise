import { useRef, useState } from 'react';

export default function UploadZone({ onFile, loading }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  const handle = (file) => {
    if (file && file.name.endsWith('.csv')) onFile(file);
  };

  return (
    <div
      onClick={() => !loading && inputRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files[0]); }}
      style={{
        position: 'relative',
        border: `1.5px dashed ${dragging ? 'var(--jade)' : '#C9C3B2'}`,
        borderRadius: 24,
        background: dragging ? 'var(--jade-soft)' : 'var(--paper)',
        padding: '52px 32px 44px',
        textAlign: 'center',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'border-color 0.2s, background 0.2s',
        boxShadow: '0 1px 0 rgba(20,20,15,0.02), 0 30px 60px -30px rgba(20,20,15,0.08)',
      }}
    >
      <input ref={inputRef} type="file" accept=".csv" hidden onChange={e => handle(e.target.files[0])} />

      <CornerTick pos={{ top: 12, left: 12 }} />
      <CornerTick pos={{ top: 12, right: 12 }} rotate={90} />
      <CornerTick pos={{ bottom: 12, right: 12 }} rotate={180} />
      <CornerTick pos={{ bottom: 12, left: 12 }} rotate={270} />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <Spinner />
          <p style={{ fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--ink)' }}>Analysing your glucose data…</p>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>This takes about 10 seconds</p>
        </div>
      ) : (
        <>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--bg)', border: '1px solid var(--line)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 16V5M8 9l4-4 4 4" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 16v3h14v-3" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 400, color: 'var(--ink)', marginBottom: 6 }}>
            Drop your CGM export here
          </div>
          <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
            .csv from LibreLink, Dexcom, or any CGM platform
          </div>
          <button
            style={{ background: 'var(--ink)', color: 'var(--paper)', border: 0, padding: '13px 24px', borderRadius: 999, fontSize: 14, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 8 }}
            onClick={e => { e.stopPropagation(); inputRef.current.click(); }}
          >
            Choose file
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </>
      )}
    </div>
  );
}

function CornerTick({ pos, rotate = 0 }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" style={{ position: 'absolute', ...pos, transform: `rotate(${rotate}deg)` }}>
      <path d="M0 4V0h4" stroke="#C9C3B2" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      border: '2.5px solid var(--line)',
      borderTopColor: 'var(--jade)',
      animation: 'spin 0.8s linear infinite',
    }} />
  );
}
