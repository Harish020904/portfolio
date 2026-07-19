import React from 'react';
import { useTerminalStore } from '../hooks';

interface BreadcrumbBarProps {
  onNavigate: (fullPath: string) => void;
}

export const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({ onNavigate }) => {
  const cwd = useTerminalStore((state) => state.cwd);

  // Parse path segments
  const pathParts = cwd.split('/').filter(Boolean);
  
  // Build segments data structure
  const segments: { name: string; fullPath: string; isLast: boolean }[] = [];
  let currentPath = '';

  if (cwd === '/home/harish') {
    segments.push({ name: '~', fullPath: '/home/harish', isLast: true });
  } else if (cwd.startsWith('/home/harish/')) {
    segments.push({ name: '~', fullPath: '/home/harish', isLast: false });
    const relPath = cwd.substring('/home/harish/'.length);
    const relParts = relPath.split('/').filter(Boolean);
    let buildPath = '/home/harish';
    for (let i = 0; i < relParts.length; i++) {
      buildPath += '/' + relParts[i];
      segments.push({
        name: relParts[i],
        fullPath: buildPath,
        isLast: i === relParts.length - 1,
      });
    }
  } else if (cwd === '/') {
    segments.push({ name: '/', fullPath: '/', isLast: true });
  } else {
    for (let i = 0; i < pathParts.length; i++) {
      currentPath += '/' + pathParts[i];
      segments.push({
        name: pathParts[i],
        fullPath: currentPath,
        isLast: i === pathParts.length - 1,
      });
    }
  }

  const handleSegmentClick = (fullPath: string) => {
    if (fullPath === cwd) return; // already there
    onNavigate(fullPath);
  };

  return (
    <div
      style={{
        height: '28px',
        background: '#0d1117',
        borderBottom: '1px solid #21262d',
        fontFamily: 'JetBrains Mono, Fira Code, monospace',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        color: '#e6edf3',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      <span style={{ fontWeight: 'bold', color: '#56d364', marginRight: '8px' }}>
        📁
      </span>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {segments.map((segment, idx) => (
          <React.Fragment key={segment.fullPath}>
            {idx > 0 && <span style={{ color: '#484f58' }}>{'>'}</span>}
            <span
              onClick={() => handleSegmentClick(segment.fullPath)}
              style={{
                color: segment.isLast ? '#79c0ff' : '#8b949e',
                fontWeight: segment.isLast ? 'bold' : 'normal',
                cursor: segment.isLast ? 'default' : 'pointer',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                if (!segment.isLast) e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                if (!segment.isLast) e.currentTarget.style.textDecoration = 'none';
              }}
            >
              {segment.name}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
