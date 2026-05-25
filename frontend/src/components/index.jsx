// PatternAlert.jsx
export function PatternAlert({ pattern }) {
  const colors = { critical: '#b91c1c', high: '#c2410c', medium: '#b45309' };
  return (
    <div className="pattern-alert" style={{ borderLeftColor: colors[pattern.severity] }}>
      <div className="alert-severity">{pattern.severity.toUpperCase()}</div>
      <div className="alert-title">{pattern.title}</div>
      <div className="alert-detail">{pattern.detail}</div>
    </div>
  );
}

// InsightCard.jsx
export function InsightCard({ insights, model, patterns }) {
  const medPatterns = patterns.filter(p => p.severity === 'medium');
  return (
    <div className="insight-card">
      <div className="insight-header">
        <h3>AI Analysis</h3>
        <span className="model-badge">{model.includes('opus') ? '🔬 Deep Analysis' : '⚡ Quick Analysis'}</span>
      </div>
      <div className="insight-body">
        {insights.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
      </div>
      {medPatterns.length > 0 && (
        <div className="medium-patterns">
          <h4>Also noted:</h4>
          {medPatterns.map(p => (
            <div key={p.id} className="medium-pattern">• {p.title}: {p.detail}</div>
          ))}
        </div>
      )}
      <div className="insight-footer">
        This analysis is for informational purposes. Always consult your diabetes care team.
      </div>
    </div>
  );
}

// ChatBox.jsx
import { useState } from 'react';

export function ChatBox({ context }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const res = await fetch('/api/chat', {
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
    <div className="chatbox">
      <h3>Ask a Follow-up Question</h3>
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg chat-${m.role}`}>{m.text}</div>
        ))}
      </div>
      <div className="chat-input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="e.g. What does high CV mean for me?"
          disabled={loading}
        />
        <button onClick={send} disabled={loading}>
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
