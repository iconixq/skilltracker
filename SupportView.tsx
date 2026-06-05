import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Heart } from 'lucide-react';

export default function SupportView() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSent(true);
    setTimeout(() => {
      setSubject('');
      setMessage('');
    }, 2000);
  };

  return (
    <div className="px-6 lg:px-12 pb-12 w-full max-w-2xl mx-auto space-y-8">
      {/* Support Title */}
      <div className="py-4">
        <h2 className="font-display text-2xl lg:text-3xl font-black text-primary tracking-tight">
          Inspiration Support Stationery
        </h2>
        <p className="text-xs text-on-surface-variant font-bold mt-1">
          Have ideas or comments? Write them directly onto our notebook.
        </p>
      </div>

      <div className="soft-card p-6 lg:p-10 rounded-lg bg-white/90 border border-outline-variant/10 relative overflow-hidden">
        {/* Stationery lines pattern background */}
        <div className="absolute inset-0 paper-grain pointer-events-none opacity-4"></div>
        
        {isSent ? (
          <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-primary-container text-primary rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <h3 className="font-display font-black text-xl text-primary">Inspiration Sent! ✉️</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-sm mx-auto">
              Your notes have been recorded in the tracker records. Our team is constantly enhancing these features to aid your quest!
            </p>
            
            <button
              onClick={() => setIsSent(false)}
              className="px-6 py-2 bg-primary text-on-primary rounded-full text-xs font-bold shadow-sm"
            >
              Write Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-6">
            <div className="flex items-center gap-2 text-primary font-display font-bold">
              <Mail className="w-5 h-5 animate-bounce" />
              <h3>Direct Mailbox</h3>
            </div>

            <div className="space-y-4 font-sans">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                  Mail subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Adding calendar synchronization"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                  Message on stationery lines
                </label>
                <textarea
                  required
                  placeholder="Write detailed notes here..."
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-4 text-xs focus:ring-2 focus:ring-primary/45 focus:outline-none leading-relaxed"
                  style={{
                    backgroundImage: 'radial-gradient(ellipse at center, rgba(120, 85, 94, 0.05) 0%, transparent 100%)',
                    backgroundSize: '100% 1.5rem'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/95 text-on-primary font-bold text-sm py-3.5 rounded-full flex items-center justify-center gap-2 hover:scale-102 transition-transform shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4 ml-1" />
              Drop in Mailbox
            </button>

            <div className="text-center pt-2">
              <span className="text-[10px] font-bold text-on-surface-variant/70 flex items-center justify-center gap-1">
                Made with <Heart className="w-3.5 h-3.5 fill-red-450 text-red-400" /> by Alex & SkillTracker Team
              </span>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}
