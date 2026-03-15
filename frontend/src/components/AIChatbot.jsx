import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, MessageCircle, RotateCcw } from 'lucide-react';

const GEMINI_API_KEY = 'AIzaSyDemoKeyReplaceWithYours'; // 🔑 Replace with your Gemini API key

const SYSTEM_CONTEXT = `You are a helpful AI assistant for QP Creator — a Question Paper Generator platform used by university faculty and admins.
Help users with:
- Generating question papers (go to Paper Generator in sidebar → select subject, units, difficulty → click Generate → export as PDF)
- Adding questions (go to Question Bank → click Add Question → fill details → save)
- Managing faculty (go to Faculty Management → add/edit/remove faculty members and assign roles)
- Subject mapping (go to Subject Mapping → link subjects to faculty)
- Exporting papers (after generating, click the Download/Export button to save as PDF)
- Dashboard overview (shows stats: question count, papers created, active subjects, activity stream)
Keep answers concise, friendly, and step-by-step. If asked something unrelated to the platform, politely redirect.`;

const SUGGESTIONS = [
  'How to generate a question paper?',
  'How to add questions?',
  'How to manage faculty?',
  'How to export a paper?',
  'What does the dashboard show?',
];

async function callGemini(userMessage) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${SYSTEM_CONTEXT}\n\nUser: ${userMessage}` }
            ]
          }
        ],
        generationConfig: { maxOutputTokens: 300, temperature: 0.7 }
      })
    }
  );
  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not get a response. Please try again.';
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', background: 'var(--bg-body)', borderRadius: '18px 18px 18px 4px', width: 'fit-content', maxWidth: 80, border: '1px solid var(--border)' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: '50%', background: 'var(--text-sub)',
          animation: 'typingBounce 1.2s infinite',
          animationDelay: `${i * 0.2}s`,
          display: 'inline-block'
        }} />
      ))}
    </div>
  );
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: '👋 Hi! I\'m your AI assistant for QP Creator. Ask me anything about generating papers, managing questions, faculty, or anything else about the platform!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setShowSuggestions(false);
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const reply = await callGemini(msg);
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: '⚠️ Unable to reach the AI right now. Please check your API key or try again later.' }]);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setMessages([{ role: 'ai', text: '👋 Hi! I\'m your AI assistant for QP Creator. Ask me anything about generating papers, managing questions, faculty, or anything else about the platform!' }]);
    setShowSuggestions(true);
    setInput('');
  };

  return (
    <>
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes msgFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.5), 0 8px 24px rgba(99,102,241,0.4); }
          50%       { box-shadow: 0 0 0 10px rgba(99,102,241,0), 0 8px 24px rgba(99,102,241,0.4); }
        }
        .chat-fab { animation: pulseGlow 2.5s infinite; }
        .chat-fab:hover { transform: scale(1.1) !important; animation: none !important; box-shadow: 0 12px 32px rgba(99,102,241,0.55) !important; }
        .chat-window { animation: chatSlideUp 0.28s cubic-bezier(0.34,1.56,0.64,1); }
        .chat-msg { animation: msgFadeIn 0.22s ease; }
        .send-btn:hover { background: #4f46e5 !important; transform: scale(1.08); }
        .suggestion-chip:hover { background: rgba(99,102,241,0.12) !important; border-color: #6366f1 !important; color: #4f46e5 !important; }
        .chat-input:focus { outline: none; border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
        @media (max-width: 480px) {
          .chat-window {
            position: fixed !important;
            bottom: 0 !important; right: 0 !important; left: 0 !important;
            width: 100% !important; height: 85vh !important;
            border-radius: 20px 20px 0 0 !important;
          }
        }
      `}</style>

      {/* Floating Button */}
      {!open && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
          <div style={{ position: 'relative' }}>
            <button
              className="chat-fab"
              onClick={() => setOpen(true)}
              title="Ask AI Assistant"
              style={{
                width: 58, height: 58, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              <Sparkles size={24} />
            </button>
            <div style={{
              position: 'absolute', bottom: '110%', right: 0, marginBottom: 6,
              background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.75rem', fontWeight: 600,
              padding: '5px 10px', borderRadius: 8, whiteSpace: 'nowrap',
              pointerEvents: 'none', opacity: 0.95,
              boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)'
            }}>
              Ask AI Assistant
              <div style={{ position: 'absolute', bottom: -4, right: 14, width: 8, height: 8, background: 'var(--bg-card)', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', transform: 'rotate(45deg)' }} />
            </div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {open && (
        <div
          className="chat-window"
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
            width: 360, height: 520,
            background: 'var(--bg-card)', borderRadius: 20,
            boxShadow: 'var(--shadow-lg)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            border: '1px solid var(--border)'
          }}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
            flexShrink: 0
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Sparkles size={18} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>AI Assistant</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                Powered by Gemini
              </div>
            </div>
            <button onClick={handleReset} title="Reset chat" style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', marginRight: 4 }}>
              <RotateCcw size={15} />
            </button>
            <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}>
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.map((msg, i) => (
              <div key={i} className="chat-msg" style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'ai' && (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: 8, alignSelf: 'flex-end' }}>
                    <Sparkles size={13} color="#fff" />
                  </div>
                )}
                <div style={{
                  maxWidth: '75%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'var(--bg-body)',
                  color: msg.role === 'user' ? '#fff' : 'var(--text-main)',
                  fontSize: '0.875rem', lineHeight: 1.55, fontWeight: 400,
                  boxShadow: msg.role === 'user' ? '0 4px 12px rgba(99,102,241,0.25)' : 'none',
                  border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-msg" style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sparkles size={13} color="#fff" />
                </div>
                <TypingIndicator />
              </div>
            )}

            {/* Suggestion chips */}
            {showSuggestions && !loading && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    className="suggestion-chip"
                    onClick={() => sendMessage(s)}
                    style={{
                      padding: '5px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600,
                      border: '1.5px solid var(--border)', background: 'var(--bg-body)', color: 'var(--text-sub)',
                      cursor: 'pointer', transition: 'all 0.18s', whiteSpace: 'nowrap'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '0.875rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.625rem', alignItems: 'center', flexShrink: 0, background: 'var(--bg-card)' }}>
            <input
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask anything about the system..."
              disabled={loading}
              style={{
                flex: 1, padding: '0.65rem 0.875rem', borderRadius: 12,
                border: '1.5px solid var(--border)', fontSize: '0.875rem',
                fontFamily: 'inherit', background: 'var(--bg-input)', color: 'var(--text-main)',
                transition: 'border 0.2s, box-shadow 0.2s', resize: 'none'
              }}
            />
            <button
              className="send-btn"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                width: 40, height: 40, borderRadius: 12, border: 'none', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                background: loading || !input.trim() ? '#e2e8f0' : 'linear-gradient(135deg,#6366f1,#4f46e5)',
                color: loading || !input.trim() ? '#94a3b8' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.18s', flexShrink: 0
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
