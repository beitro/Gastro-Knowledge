import { SwimlaneScenarioPackage, SwimlaneNodeData, SwimlaneConnectorData } from '../data/swimlaneScenariosData';

export function generateStandaloneSvgString(
  scenario: SwimlaneScenarioPackage,
  theme: 'light' | 'dark' = 'dark'
): string {
  // Compute dynamic width to ensure no node or label gets clipped
  const maxX = Math.max(...scenario.nodes.map((n) => n.x + n.width), 1200);
  const canvasWidth = Math.max(maxX + 100, 1360);

  const headerHeight = 52;
  const stripWidth = 120;
  let totalHeight = headerHeight;
  const laneOffsets: { [laneId: string]: number } = {};

  scenario.lanes.forEach((l) => {
    laneOffsets[l.id] = totalHeight;
    totalHeight += l.height;
  });

  const isLight = theme === 'light';
  const bgColor = isLight ? '#f8fafc' : '#020617';
  const textColor = isLight ? '#0f172a' : '#f8fafc';
  const subtextColor = isLight ? '#475569' : '#94a3b8';
  const borderColor = isLight ? '#cbd5e1' : '#334155';
  const nodeBg = isLight ? '#ffffff' : '#0f172a';
  const nodeBorder = isLight ? '#334155' : '#475569';
  const stripBg = isLight ? '#e2e8f0' : '#090d16';
  const stripBorder = isLight ? '#94a3b8' : '#1e293b';

  // 1. Lanes and Left Actor Strips
  let lanesSvg = '';
  scenario.lanes.forEach((lane, idx) => {
    const y = laneOffsets[lane.id];
    const laneBg = isLight
      ? idx % 2 === 0
        ? '#ffffff'
        : '#f8fafc'
      : idx % 2 === 0
      ? 'rgba(15, 23, 42, 0.55)'
      : 'rgba(2, 6, 23, 0.45)';

    lanesSvg += `
      <!-- Lane ${idx + 1}: ${lane.name} -->
      <rect x="0" y="${y}" width="${canvasWidth}" height="${lane.height}" fill="${laneBg}" stroke="${borderColor}" stroke-width="1" />
      
      <!-- Watermark Lane Label on Right -->
      <text x="${canvasWidth - 25}" y="${y + 20}" text-anchor="end" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10" font-weight="700" fill="${isLight ? '#94a3b8' : '#334155'}" letter-spacing="1">
        LANE 0${idx + 1} // ${lane.name.toUpperCase()}
      </text>

      <!-- Left Vertical Actor Strip -->
      <rect x="0" y="${y}" width="${stripWidth}" height="${lane.height}" fill="${stripBg}" stroke="${stripBorder}" stroke-width="1.2" />
      <g transform="translate(${stripWidth / 2}, ${y + lane.height / 2}) rotate(-90)">
        <text text-anchor="middle" dominant-baseline="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="800" font-size="11" fill="${isLight ? '#0f172a' : '#fbbf24'}" letter-spacing="1">
          ${lane.name.toUpperCase()}
        </text>
        <text text-anchor="middle" y="15" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="8.5" font-weight="500" fill="${subtextColor}">
          ${lane.subname}
        </text>
      </g>
    `;
  });

  // 2. Port coordinate calculation
  const getPortCoord = (node: SwimlaneNodeData, port: 'top' | 'bottom' | 'left' | 'right') => {
    const laneY = laneOffsets[node.laneId] || headerHeight;
    const globalY = laneY + node.y;
    switch (port) {
      case 'top':
        return { x: node.x + node.width / 2, y: globalY };
      case 'bottom':
        return { x: node.x + node.width / 2, y: globalY + node.height };
      case 'left':
        return { x: node.x, y: globalY + node.height / 2 };
      case 'right':
        return { x: node.x + node.width, y: globalY + node.height / 2 };
    }
  };

  // 3. Connectors (Orthogonal Arrows with Pill Badges)
  let connectorsSvg = '';
  scenario.connectors.forEach((conn) => {
    const fromNode = scenario.nodes.find((n) => n.id === conn.fromId);
    const toNode = scenario.nodes.find((n) => n.id === conn.toId);
    if (!fromNode || !toNode) return;

    const fromPort = conn.fromPort || 'right';
    const toPort = conn.toPort || 'left';
    const start = getPortCoord(fromNode, fromPort);
    const end = getPortCoord(toNode, toPort);

    let pathD = '';
    let labelPos = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };

    if (fromPort === 'bottom' && toPort === 'top') {
      if (Math.abs(start.x - end.x) < 8) {
        pathD = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
      } else {
        const midY = (start.y + end.y) / 2;
        pathD = `M ${start.x} ${start.y} L ${start.x} ${midY} L ${end.x} ${midY} L ${end.x} ${end.y}`;
      }
      labelPos = { x: (start.x + end.x) / 2 + 18, y: (start.y + end.y) / 2 };
    } else if (fromPort === 'top' && toPort === 'bottom') {
      const midY = (start.y + end.y) / 2;
      pathD = `M ${start.x} ${start.y} L ${start.x} ${midY} L ${end.x} ${midY} L ${end.x} ${end.y}`;
      labelPos = { x: (start.x + end.x) / 2 + 18, y: (start.y + end.y) / 2 };
    } else if (fromPort === 'right' && toPort === 'left') {
      if (Math.abs(start.y - end.y) < 8) {
        pathD = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
      } else {
        const midX = (start.x + end.x) / 2;
        pathD = `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
      }
      labelPos = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 - 10 };
    } else if (fromPort === 'right' && toPort === 'top') {
      pathD = `M ${start.x} ${start.y} L ${end.x} ${start.y} L ${end.x} ${end.y}`;
      labelPos = { x: (start.x + end.x) / 2, y: start.y - 10 };
    } else if (fromPort === 'bottom' && toPort === 'left') {
      pathD = `M ${start.x} ${start.y} L ${start.x} ${end.y} L ${end.x} ${end.y}`;
      labelPos = { x: start.x + 15, y: (start.y + end.y) / 2 };
    } else {
      pathD = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    }

    const strokeColor = isLight ? '#475569' : '#94a3b8';
    const dashedAttr = conn.isDashed ? 'stroke-dasharray="4,4"' : '';
    connectorsSvg += `
      <path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="1.8" ${dashedAttr} marker-end="url(#arrow-head)" />
    `;

    if (conn.label) {
      const labelW = conn.label.length * 6.8 + 14;
      connectorsSvg += `
        <g transform="translate(${labelPos.x}, ${labelPos.y})">
          <rect x="${-labelW / 2}" y="-10" width="${labelW}" height="20" rx="4" fill="${isLight ? '#ffffff' : '#090d16'}" stroke="${isLight ? '#cbd5e1' : '#334155'}" stroke-width="1" />
          <text text-anchor="middle" y="4" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="9.5" font-weight="700" fill="${isLight ? '#1e293b' : '#fbbf24'}">
            ${conn.label}
          </text>
        </g>
      `;
    }
  });

  // 4. Nodes (Terminators, Process, Decision, Document, Database)
  let nodesSvg = '';
  scenario.nodes.forEach((node) => {
    const laneY = laneOffsets[node.laneId] || headerHeight;
    const y = laneY + node.y;
    const x = node.x;
    const w = node.width;
    const h = node.height;

    if (node.type === 'terminator') {
      nodesSvg += `
        <g transform="translate(${x}, ${y})">
          <rect x="0" y="0" width="${w}" height="${h}" rx="${h / 2}" fill="${isLight ? '#dcfce7' : '#064e3b'}" stroke="#10b981" stroke-width="2" />
          <text text-anchor="middle" x="${w / 2}" y="${h / 2 - (node.subtitle ? 3 : 0)}" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="800" font-size="11.5" fill="${isLight ? '#065f46' : '#ffffff'}">
            ${node.title}
          </text>
          ${node.subtitle ? `<text text-anchor="middle" x="${w / 2}" y="${h / 2 + 11}" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="9" fill="${isLight ? '#047857' : '#a7f3d0'}">${node.subtitle}</text>` : ''}
        </g>
      `;
    } else if (node.type === 'document') {
      nodesSvg += `
        <g transform="translate(${x}, ${y})">
          <path d="M 0 0 L ${w - 14} 0 L ${w} 14 L ${w} ${h} L 0 ${h} Z" fill="${isLight ? '#faf5ff' : '#1e1b4b'}" stroke="${isLight ? '#9333ea' : '#c084fc'}" stroke-width="2" />
          <path d="M ${w - 14} 0 L ${w - 14} 14 L ${w} 14" fill="${isLight ? '#e9d5ff' : '#312e81'}" stroke="${isLight ? '#9333ea' : '#c084fc'}" stroke-width="1.5" />
          <text text-anchor="middle" x="${w / 2}" y="${h / 2 - 4}" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="700" font-size="11" fill="${isLight ? '#581c87' : '#f3e8ff'}">
            ${node.title}
          </text>
          ${node.subtitle ? `<text text-anchor="middle" x="${w / 2}" y="${h / 2 + 10}" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="9.5" font-weight="600" fill="#f59e0b">${node.subtitle}</text>` : ''}
        </g>
      `;
    } else if (node.type === 'database') {
      nodesSvg += `
        <g transform="translate(${x}, ${y})">
          <!-- Cylinder Body -->
          <rect x="0" y="8" width="${w}" height="${h - 16}" fill="${isLight ? '#f0f9ff' : '#082f49'}" stroke="${isLight ? '#0284c7' : '#38bdf8'}" stroke-width="2" />
          <path d="M 0 ${h - 8} A ${w / 2} 8 0 0 0 ${w} ${h - 8} L ${w} 8 L 0 8 Z" fill="${isLight ? '#f0f9ff' : '#082f49'}" stroke="${isLight ? '#0284c7' : '#38bdf8'}" stroke-width="2" />
          <!-- Top Oval Lid -->
          <ellipse cx="${w / 2}" cy="8" rx="${w / 2}" ry="8" fill="${isLight ? '#bae6fd' : '#0369a1'}" stroke="${isLight ? '#0284c7' : '#38bdf8'}" stroke-width="2" />
          <text text-anchor="middle" x="${w / 2}" y="${h / 2 + 3}" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="700" font-size="11" fill="${isLight ? '#0369a1' : '#e0f2fe'}">
            ${node.title}
          </text>
          ${node.subtitle ? `<text text-anchor="middle" x="${w / 2}" y="${h / 2 + 16}" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="9" font-weight="600" fill="#10b981">${node.subtitle}</text>` : ''}
        </g>
      `;
    } else if (node.type === 'decision') {
      nodesSvg += `
        <g transform="translate(${x}, ${y})">
          <polygon points="${w / 2},0 ${w},${h / 2} ${w / 2},${h} 0,${h / 2}" fill="${isLight ? '#fef3c7' : '#451a03'}" stroke="#d97706" stroke-width="2" />
          <text text-anchor="middle" x="${w / 2}" y="${h / 2 - 3}" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="800" font-size="10.5" fill="${isLight ? '#78350f' : '#fef3c7'}">
            ${node.title}
          </text>
          ${node.subtitle ? `<text text-anchor="middle" x="${w / 2}" y="${h / 2 + 10}" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="8.5" font-weight="600" fill="#f59e0b">${node.subtitle}</text>` : ''}
        </g>
      `;
    } else {
      // Standard process card
      nodesSvg += `
        <g transform="translate(${x}, ${y})">
          <rect x="0" y="0" width="${w}" height="${h}" rx="8" fill="${nodeBg}" stroke="${nodeBorder}" stroke-width="2" />
          <text text-anchor="middle" x="${w / 2}" y="${h / 2 - (node.subtitle ? 4 : 0)}" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="700" font-size="11" fill="${textColor}">
            ${node.title}
          </text>
          ${node.subtitle ? `<text text-anchor="middle" x="${w / 2}" y="${h / 2 + 11}" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="9" font-weight="500" fill="${subtextColor}">${node.subtitle}</text>` : ''}
        </g>
      `;
    }
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvasWidth} ${totalHeight}" width="${canvasWidth}" height="${totalHeight}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&amp;display=swap');
    </style>
    <marker id="arrow-head" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="${isLight ? '#475569' : '#94a3b8'}" />
    </marker>
  </defs>

  <!-- Background Canvas -->
  <rect width="${canvasWidth}" height="${totalHeight}" fill="${bgColor}" />

  <!-- Grid Dots -->
  <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
    <circle cx="2" cy="2" r="1" fill="${isLight ? 'rgba(100, 116, 139, 0.25)' : 'rgba(148, 163, 184, 0.15)'}" />
  </pattern>
  <rect y="${headerHeight}" width="${canvasWidth}" height="${totalHeight - headerHeight}" fill="url(#grid-pattern)" />

  <!-- Top Title Banner Bar -->
  <rect width="${canvasWidth}" height="${headerHeight}" fill="${isLight ? '#0f172a' : '#050811'}" stroke="${borderColor}" stroke-width="1" />
  
  <rect x="18" y="14" width="76" height="24" rx="4" fill="#f59e0b" />
  <text x="56" y="30" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10.5" font-weight="800" fill="#0f172a" letter-spacing="1">
    ${scenario.badge.toUpperCase()}
  </text>

  <text x="106" y="31" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="13.5" font-weight="800" fill="#ffffff" letter-spacing="0.5">
    RESTOSYNC: ${scenario.title.toUpperCase()}
  </text>

  <text x="${canvasWidth - 20}" y="31" text-anchor="end" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10" font-weight="600" fill="#94a3b8">
    Draw.io / Diagrams.net Swimlane Standard Architecture · Real-Time Restaurant System
  </text>

  ${lanesSvg}
  ${connectorsSvg}
  ${nodesSvg}
</svg>`;
}

export function downloadSvgFile(scenario: SwimlaneScenarioPackage, theme: 'light' | 'dark' = 'dark') {
  const svg = generateStandaloneSvgString(scenario, theme);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `restosync_swimlane_${scenario.id}_${theme}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadPngFile(scenario: SwimlaneScenarioPackage, theme: 'light' | 'dark' = 'dark') {
  const svg = generateStandaloneSvgString(scenario, theme);
  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const URLObj = window.URL || window.webkitURL || window;
  const blobURL = URLObj.createObjectURL(svgBlob);
  const image = new Image();

  image.onload = () => {
    const maxX = Math.max(...scenario.nodes.map((n) => n.x + n.width), 1200);
    const canvasWidth = Math.max(maxX + 100, 1360);
    const totalHeight = scenario.lanes.reduce((acc, l) => acc + l.height, 52);

    const canvas = document.createElement('canvas');
    const scale = 2; // Crisp 2x high-resolution
    canvas.width = canvasWidth * scale;
    canvas.height = totalHeight * scale;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(scale, scale);
    ctx.drawImage(image, 0, 0);

    const pngUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = `restosync_swimlane_${scenario.id}_${theme}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URLObj.revokeObjectURL(blobURL);
  };

  image.src = blobURL;
}
