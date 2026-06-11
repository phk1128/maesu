import { useMemo } from 'react';
import Tex from './Tex';

interface FormulaContentProps {
  contentMd: string;
  svg?: string | null;
}

export default function FormulaContent({ contentMd, svg }: FormulaContentProps) {
  const blocks = useMemo(() => parseContentMd(contentMd), [contentMd]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {blocks.map((block, i) => (
        <div key={i}>{renderBlock(block)}</div>
      ))}
      {svg && (
        <div style={{
          display: 'flex', justifyContent: 'center', padding: '8px 0',
        }}>
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
      )}
    </div>
  );
}

type Block =
  | { type: 'displayMath'; content: string }
  | { type: 'text'; segments: Segment[] }
  | { type: 'table'; rows: string[][] }
  | { type: 'list'; items: Segment[][] };

type Segment = { type: 'text'; content: string } | { type: 'math'; content: string };

function parseContentMd(md: string): Block[] {
  const lines = md.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Empty line
    if (!line) { i++; continue; }

    // Display math: $$...$$
    if (line.startsWith('$$')) {
      // Could be single line $$...$$ or multi-line
      if (line.endsWith('$$') && line.length > 4) {
        blocks.push({ type: 'displayMath', content: line.slice(2, -2).trim() });
        i++;
      } else {
        const mathLines = [line.slice(2)];
        i++;
        while (i < lines.length && !lines[i].trim().endsWith('$$')) {
          mathLines.push(lines[i]);
          i++;
        }
        if (i < lines.length) {
          const last = lines[i].trim();
          mathLines.push(last.slice(0, -2));
          i++;
        }
        blocks.push({ type: 'displayMath', content: mathLines.join('\n').trim() });
      }
      continue;
    }

    // Table: lines starting with |
    if (line.startsWith('|')) {
      const tableRows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const row = lines[i].trim();
        // Skip separator rows (|---|---|)
        if (row.match(/^\|[\s\-:|]+\|$/)) { i++; continue; }
        const cells = row.split('|').slice(1, -1).map(c => c.trim());
        tableRows.push(cells);
        i++;
      }
      if (tableRows.length > 0) blocks.push({ type: 'table', rows: tableRows });
      continue;
    }

    // List item: - ...
    if (line.startsWith('- ')) {
      const items: Segment[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(parseInline(lines[i].trim().slice(2)));
        i++;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    // Regular text with possible inline math
    blocks.push({ type: 'text', segments: parseInline(line) });
    i++;
  }

  return blocks;
}

function parseInline(text: string): Segment[] {
  const segments: Segment[] = [];
  // Match $...$ (not $$)
  const regex = /\$([^$]+)\$/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'math', content: match[1] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return segments;
}

function renderBlock(block: Block) {
  switch (block.type) {
    case 'displayMath':
      return (
        <div style={{
          background: 'var(--bg)', borderRadius: 10, padding: '14px 12px',
          textAlign: 'center', fontSize: 17, overflow: 'auto',
        }}>
          <Tex block>{block.content}</Tex>
        </div>
      );
    case 'text':
      return (
        <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>
          {renderSegments(block.segments)}
        </div>
      );
    case 'table':
      return (
        <div style={{ overflow: 'auto', fontSize: 13 }}>
          <table style={{
            width: '100%', borderCollapse: 'collapse',
            border: '1px solid var(--border)',
          }}>
            <thead>
              <tr>
                {block.rows[0]?.map((cell, j) => (
                  <th key={j} style={{
                    padding: '8px 10px', background: 'var(--bg)',
                    borderBottom: '1px solid var(--border)',
                    fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)',
                    textAlign: 'left',
                  }}>{renderSegments(parseInline(cell))}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.slice(1).map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} style={{
                      padding: '7px 10px',
                      borderBottom: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}>{renderSegments(parseInline(cell))}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'list':
      return (
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7 }}>
          {block.items.map((item, i) => (
            <li key={i}>{renderSegments(item)}</li>
          ))}
        </ul>
      );
  }
}

function renderSegments(segments: Segment[]) {
  return segments.map((seg, i) =>
    seg.type === 'math'
      ? <Tex key={i}>{seg.content}</Tex>
      : <span key={i}>{seg.content}</span>
  );
}
