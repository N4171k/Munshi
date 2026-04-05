import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const styles = `
  .munshi-markdown { font-family: 'DM Sans', sans-serif; }

  .munshi-markdown h1,
  .munshi-markdown h2,
  .munshi-markdown h3,
  .munshi-markdown h4 {
    font-family: 'Playfair Display', serif;
    color: #F0EDE6;
    letter-spacing: -0.02em;
    line-height: 1.25;
    margin-top: 1.4em;
    margin-bottom: 0.5em;
  }
  .munshi-markdown h1 { font-size: 1.55rem; }
  .munshi-markdown h2 { font-size: 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.07); padding-bottom: 8px; }
  .munshi-markdown h3 { font-size: 1rem; font-family: 'DM Sans', sans-serif; color: #C9A84C; font-weight: 600; }

  .munshi-markdown p {
    color: #8A8799;
    line-height: 1.75;
    font-size: 14px;
    font-weight: 300;
    margin-bottom: 0.75em;
  }

  .munshi-markdown strong { color: #F0EDE6; font-weight: 600; }
  .munshi-markdown em { color: #C9A84C; font-style: italic; }

  .munshi-markdown ul,
  .munshi-markdown ol {
    color: #8A8799;
    font-size: 14px;
    line-height: 1.8;
    padding-left: 1.4em;
    margin-bottom: 0.75em;
  }

  .munshi-markdown li { margin-bottom: 4px; }
  .munshi-markdown li::marker { color: #C9A84C; }

  .munshi-markdown code {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 12px;
    background: rgba(201,168,76,0.08);
    border: 1px solid rgba(201,168,76,0.15);
    color: #E8C97A;
    padding: 2px 8px;
    border-radius: 5px;
  }

  .munshi-markdown pre {
    background: #0D0D10;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 16px 20px;
    overflow-x: auto;
    margin-bottom: 0.75em;
  }

  .munshi-markdown pre code {
    background: none;
    border: none;
    padding: 0;
    color: #C8C5D0;
    font-size: 13px;
  }

  .munshi-markdown blockquote {
    border-left: 3px solid #C9A84C;
    padding: 12px 18px;
    background: rgba(201,168,76,0.06);
    border-radius: 0 10px 10px 0;
    margin: 1em 0;
    color: #C8C5D0;
    font-style: italic;
  }

  .munshi-markdown table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1em;
    font-size: 13px;
  }

  .munshi-markdown th {
    background: rgba(255,255,255,0.04);
    color: #F0EDE6;
    font-weight: 600;
    padding: 10px 14px;
    text-align: left;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    border-top: 1px solid rgba(255,255,255,0.08);
  }

  .munshi-markdown td {
    padding: 10px 14px;
    color: #8A8799;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .munshi-markdown tr:hover td {
    background: rgba(255,255,255,0.02);
    color: #C8C5D0;
  }

  .munshi-markdown a {
    color: #C9A84C;
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-color: rgba(201,168,76,0.35);
  }
  .munshi-markdown a:hover {
    color: #E8C97A;
    text-decoration-color: rgba(232,201,122,0.6);
  }

  .munshi-markdown hr {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.07);
    margin: 1.5em 0;
  }

  /* Chat variant — compact */
  .munshi-markdown-chat p {
    font-size: 13.5px;
    line-height: 1.65;
    margin-bottom: 0.4em;
    color: #C8C5D0;
  }
  .munshi-markdown-chat li {
    font-size: 13.5px;
    color: #8A8799;
  }
  .munshi-markdown-chat code {
    font-size: 12px;
  }
`;

const MarkDownRenderer = ({ message, ref, compact = false }) => {
    return (
        <div className={compact ? "munshi-markdown munshi-markdown-chat" : "munshi-markdown"}>
            <style>{styles}</style>
            <ReactMarkdown remarkPlugins={[remarkGfm]} ref={ref}>
                {message}
            </ReactMarkdown>
        </div>
    );
};

export default MarkDownRenderer;