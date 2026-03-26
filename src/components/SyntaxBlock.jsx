import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';

export default function SyntaxBlock({ language, children }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, '');

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6 rounded-xl overflow-hidden border border-white/10 shadow-lg shadow-indigo-500/10">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a2e] border-b border-white/10">
        <span className="text-xs text-indigo-400 font-mono uppercase tracking-wider">{language || 'code'}</span>
        <button
          onClick={copy}
          className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded bg-white/5 hover:bg-white/10"
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={oneDark}
        customStyle={{ margin: 0, borderRadius: 0, background: '#0d0d1a', fontSize: '0.85rem' }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
