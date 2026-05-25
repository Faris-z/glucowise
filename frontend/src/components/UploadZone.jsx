// UploadZone.jsx
import { useRef, useState } from 'react';

export default function UploadZone({ onFile, loading }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  const handle = (file) => {
    if (file && file.name.endsWith('.csv')) onFile(file);
  };

  return (
    <div
      className={`upload-zone ${dragging ? 'dragging' : ''} ${loading ? 'loading' : ''}`}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files[0]); }}
      onClick={() => !loading && inputRef.current.click()}
    >
      <input ref={inputRef} type="file" accept=".csv" hidden onChange={e => handle(e.target.files[0])} />
      {loading ? (
        <div className="upload-loading">
          <div className="spinner" />
          <p>Analysing your glucose data…</p>
        </div>
      ) : (
        <>
          <div className="upload-icon">📁</div>
          <p className="upload-primary">Drop your LibreLink CSV here</p>
          <p className="upload-secondary">or click to browse · 10MB max</p>
        </>
      )}
    </div>
  );
}
