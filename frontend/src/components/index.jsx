// PatternAlert
export function PatternAlert({ pattern }) {
  const palette = {
    critical: { bg: 'var(--coral-soft)', dot: 'var(--coral)', label: 'Needs attention' },
    high: { bg: 'var(--amber-soft)', dot: 'var(--amber)', label: 'Watch closely' },
    medium: { bg: '#F0EDE6', dot: 'var(--muted)', label: 'Noted' },
  }[pattern.severity] || { bg: '#F0EDE6', dot: 'var(--muted)', label: 'Info' };

  return (
    <div style={{ display: 'flex', gap: 16, padding: '20px 24px', background: palette.bg, borderRadius: 14, alignItems: 'flex-start' }}>
      <div style={{ marginTop: 6, width: 10, height: 10, borderRadius: 999, background: palette.dot, flexShrink: 0 }} />
      <div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em', color: palette.dot, textTransform: 'uppercase', marginBottom: 4 }}>{palette.label}</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 20, color: 'var(--ink)', lineHeight: 1.2, marginBottom: 4 }}>{pattern.title}</div>
        <div style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>{pattern.detail}</div>
      </div>
    </div>
  );
}

// InsightCard
export function InsightCard({ insights, model, patterns }) {
  const isDeep = model && model.includes('deep');
  const medPatterns = patterns.filter(p => p.severity === 'medium');

  return (
    <div style={{ background: 'var(--ink)', color: 'var(--paper)', borderRadius: 20, padding: '28px 30px 30px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--paper)', display: 'block' }} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(251,249,244,0.7)' }}>
          AI Insights {isDeep ? '· Deep Analysis' : ''}
        </span>
      </div>

      <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(18px, 2.5vw, 26px)', lineHeight: 1.35, letterSpacing: '-0.01em', color: 'var(--paper)' }}>
        {insights.split('\n\n').map((para, i) => (
          <p key={i} style={{ marginBottom: i < insights.split('\n\n').length - 1 ? 16 : 0 }}>{para}</p>
        ))}
      </div>

      {medPatterns.length > 0 && (
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(251,249,244,0.12)' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(251,249,244,0.5)', marginBottom: 12 }}>Also noted</div>
          {medPatterns.map(p => (
            <div key={p.id} style={{ fontSize: 13, color: 'rgba(251,249,244,0.7)', marginBottom: 6, lineHeight: 1.5 }}>· {p.title}: {p.detail}</div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(251,249,244,0.1)', fontSize: 12, color: 'rgba(251,249,244,0.45)', fontStyle: 'italic' }}>
        This analysis is for informational purposes only. Always consult your diabetes care team.
      </div>
    </div>
  );
}

// ChatBox
import { useState } from 'react';

export function ChatBox({ context }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestions = [
    'What does high CV mean for me?',
    'What should I tell my doctor?',
    'How do I improve my TIR?',
  ];

  async function send(text) {
    const userMsg = (text || input).trim();
    if (!userMsg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const API = import.meta.env.VITE_API_URL || '';
    const res = await fetch(`${API}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg, context }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let aiText = '';
    setMessages(prev => [...prev, { role: 'ai', text: '' }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const lines = decoder.decode(value).split('\n').filter(l => l.startsWith('data:'));
      for (const line of lines) {
        const payload = line.slice(5).trim();
        if (payload === '[DONE]') break;
        try {
          const { text } = JSON.parse(payload);
          aiText += text;
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'ai', text: aiText };
            return updated;
          });
        } catch {}
      }
    }
    setLoading(false);
  }

  return (
    <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 20, padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--violet)', display: 'block' }} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>Ask about this report</span>
      </div>

      {messages.length > 0 && (
        <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 300, overflowY: 'auto' }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              padding: '10px 14px', borderRadius: 12, fontSize: 14, lineHeight: 1.6, maxWidth: '85%',
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              background: m.role === 'user' ? 'var(--ink)' : 'var(--bg)',
              color: m.role === 'user' ? 'var(--paper)' : 'var(--ink)',
              border: m.role === 'ai' ? '1px solid var(--line)' : 'none',
            }}>
              {m.text}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--bg)', borderRadius: 14, border: '1px solid var(--line)' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask anything about your glucose data…"
          disabled={loading}
          style={{ flex: 1, background: 'transparent', border: 0, outline: 'none', fontSize: 14, color: 'var(--ink)' }}
        />
        <button
          onClick={() => send()}
          disabled={loading}
          style={{ background: 'var(--ink)', color: 'var(--paper)', border: 0, padding: '7px 16px', borderRadius: 999, fontSize: 13, fontWeight: 500, opacity: loading ? 0.5 : 1 }}
        >
          {loading ? '…' : 'Send'}
        </button>
      </div>

      {messages.length === 0 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => send(s)}
              style={{ background: 'transparent', border: '1px solid var(--line)', padding: '7px 12px', borderRadius: 999, fontSize: 12.5, color: 'var(--ink-2)' }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatBox;
