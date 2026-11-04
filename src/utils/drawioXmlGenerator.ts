// Draw.io XML Exporter for RestoSync Swimlane Architecture
// Outputs standard multi-tab mxGraphModel XML that can be opened directly in diagrams.net (draw.io)
// Supports single scenario export or ALL 6 scenarios packed into one .drawio file with individual tabs!

export interface DrawioExportNode {
  id: string;
  laneId: string;
  label: string;
  subtitle?: string;
  type: 'terminator' | 'process' | 'document' | 'database' | 'decision';
  x: number;
  y: number;
  width: number;
  height: number;
  description?: string;
  apiEndpoint?: string;
  sqlOperation?: string;
}

export interface DrawioExportEdge {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  dashed?: boolean;
}

export interface DrawioExportLane {
  id: string;
  name: string;
  subname?: string;
  height: number;
}

export interface DrawioScenarioItem {
  id: string;
  title: string;
  tabName?: string;
  badge?: string;
  lanes: DrawioExportLane[];
  nodes: DrawioExportNode[];
  edges: DrawioExportEdge[];
}

const escapeXml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

export function buildDiagramBlock(
  diagramId: string,
  diagramName: string,
  lanes: DrawioExportLane[],
  nodes: DrawioExportNode[],
  edges: DrawioExportEdge[],
  theme: 'light' | 'dark' = 'light',
  poolId = 'pool_resto'
): string {
  const isLight = theme === 'light';
  const poolWidth = 1420;
  let poolHeight = 40;
  lanes.forEach((l) => (poolHeight += l.height));

  let lanesXml = '';
  let currentY = 30;

  lanes.forEach((lane) => {
    const laneFill = isLight ? '#f8fafc' : '#0f172a';
    const laneStroke = isLight ? '#cbd5e1' : '#334155';
    const laneFontColor = isLight ? '#0f172a' : '#f8fafc';
    const laneLabel = `${lane.name.toUpperCase()}${lane.subname ? ` (${lane.subname})` : ''}`;

    lanesXml += `
        <mxCell id="${lane.id}" value="${escapeXml(laneLabel)}" style="swimlane;html=1;startSize=28;fillColor=${laneFill};strokeColor=${laneStroke};fontColor=${laneFontColor};fontStyle=1;fontSize=11;horizontal=1;collapsible=0;" vertex="1" parent="${poolId}">
          <mxGeometry y="${currentY}" width="${poolWidth}" height="${lane.height}" as="geometry" />
        </mxCell>`;
    currentY += lane.height;
  });

  let nodesXml = '';
  nodes.forEach((node) => {
    let style = '';
    const fullLabel = node.subtitle ? `${node.label}&#xa;${node.subtitle}` : node.label;
    const cleanLabel = escapeXml(fullLabel);

    if (isLight) {
      switch (node.type) {
        case 'terminator':
          style = 'rounded=1;whiteSpace=wrap;html=1;arcSize=50;fillColor=#dcfce7;strokeColor=#16a34a;fontColor=#14532d;fontStyle=1;fontSize=11;';
          break;
        case 'decision':
          style = 'rhombus;whiteSpace=wrap;html=1;fillColor=#fef3c7;strokeColor=#d97706;fontColor=#78350f;fontStyle=1;fontSize=11;';
          break;
        case 'database':
          style = 'shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=12;fillColor=#e0f2fe;strokeColor=#0284c7;fontColor=#0369a1;fontStyle=1;fontSize=11;';
          break;
        case 'document':
          style = 'shape=document;whiteSpace=wrap;html=1;boundedLbl=1;size=0.2;fillColor=#faf5ff;strokeColor=#9333ea;fontColor=#581c87;fontStyle=1;fontSize=11;';
          break;
        case 'process':
        default:
          style = 'rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#475569;fontColor=#0f172a;fontStyle=1;fontSize=11;shadow=1;';
          break;
      }
    } else {
      switch (node.type) {
        case 'terminator':
          style = 'rounded=1;whiteSpace=wrap;html=1;arcSize=50;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;fontStyle=1;fontSize=11;strokeWidth=2;';
          break;
        case 'decision':
          style = 'rhombus;whiteSpace=wrap;html=1;fillColor=#451a03;strokeColor=#d97706;fontColor=#fef3c7;fontStyle=1;fontSize=11;strokeWidth=2;';
          break;
        case 'database':
          style = 'shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=12;fillColor=#082f49;strokeColor=#38bdf8;fontColor=#e0f2fe;fontStyle=1;fontSize=11;strokeWidth=2;';
          break;
        case 'document':
          style = 'shape=document;whiteSpace=wrap;html=1;boundedLbl=1;size=0.2;fillColor=#1e1b4b;strokeColor=#c084fc;fontColor=#f3e8ff;fontStyle=1;fontSize=11;strokeWidth=2;';
          break;
        case 'process':
        default:
          style = 'rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#475569;fontColor=#f8fafc;fontStyle=1;fontSize=11;shadow=1;strokeWidth=1.5;';
          break;
      }
    }

    const tooltip = escapeXml(`${node.description || ''}${node.apiEndpoint ? `\nAPI: ${node.apiEndpoint}` : ''}${node.sqlOperation ? `\nSQL: ${node.sqlOperation}` : ''}`);

    nodesXml += `
        <mxCell id="${node.id}" value="${cleanLabel}" style="${style}" tooltip="${tooltip}" vertex="1" parent="${node.laneId}">
          <mxGeometry x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" as="geometry" />
        </mxCell>`;
  });

  let edgesXml = '';
  edges.forEach((edge) => {
    const dashedStyle = edge.dashed ? 'dashed=1;' : '';
    const cleanLabel = edge.label ? escapeXml(edge.label) : '';
    const edgeColor = isLight ? '#475569' : '#94a3b8';
    const edgeFontColor = isLight ? '#1e293b' : '#fbbf24';

    edgesXml += `
        <mxCell id="${edge.id}" value="${cleanLabel}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${edgeColor};strokeWidth=1.8;fontSize=10;fontColor=${edgeFontColor};fontStyle=1;labelBackgroundColor=${isLight ? '#ffffff' : '#090d16'};${dashedStyle}" edge="1" parent="1" source="${edge.sourceId}" target="${edge.targetId}">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>`;
  });

  const poolFill = isLight ? '#0f172a' : '#050811';
  const poolStroke = isLight ? '#334155' : '#1e293b';

  return `  <diagram id="${escapeXml(diagramId)}" name="${escapeXml(diagramName)}">
    <mxGraphModel dx="1600" dy="1000" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1600" pageHeight="1200" background="${isLight ? '#f8fafc' : '#020617'}">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="${poolId}" value="${escapeXml(diagramName.toUpperCase())}" style="swimlane;html=1;childLayout=stackLayout;resizeParent=1;resizeParentMax=0;startSize=30;horizontal=1;fontStyle=1;fillColor=${poolFill};fontColor=#ffffff;strokeColor=${poolStroke};fontSize=13;" vertex="1" parent="1">
          <mxGeometry x="40" y="40" width="${poolWidth}" height="${poolHeight}" as="geometry" />
        </mxCell>
${lanesXml}
${nodesXml}
${edgesXml}
      </root>
    </mxGraphModel>
  </diagram>`;
}

// Single Scenario Draw.io XML
export function generateDrawioXml(
  title: string,
  lanes: DrawioExportLane[],
  nodes: DrawioExportNode[],
  edges: DrawioExportEdge[],
  theme: 'light' | 'dark' = 'light'
): string {
  const diagramBlock = buildDiagramBlock('RestoSync_Swimlane', title, lanes, nodes, edges, theme, 'pool_resto');

  return `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="${new Date().toISOString()}" agent="RestoSync-Architecture-Engine" version="21.0.0" type="device">
${diagramBlock}
</mxfile>`;
}

// Multi-Tab Draw.io XML (Single file containing ALL scenarios as separate tabs in Draw.io)
export function generateAllScenariosDrawioXml(
  scenarios: DrawioScenarioItem[],
  theme: 'light' | 'dark' = 'light'
): string {
  const diagramBlocks = scenarios.map((sc, index) => {
    // Derive intuitive tab names like "Tab 1: Checkout Normal", "Tab 2: Defisit Stok"
    let cleanTabName = sc.tabName;
    if (!cleanTabName) {
      if (sc.title.includes('Normal') || sc.id === 'scenario_order_bom') {
        cleanTabName = 'Tab 1: Checkout Normal';
      } else if (sc.title.includes('Stok Tidak Cukup') || sc.id === 'scenario_insufficient_stock') {
        cleanTabName = 'Tab 2: Stok Tidak Cukup';
      } else if (sc.title.includes('Dapur') || sc.id === 'scenario_kds_kitchen_flow') {
        cleanTabName = 'Tab 3: Alur Dapur KDS';
      } else if (sc.title.includes('Dashboard') || sc.id === 'scenario_dashboard_sync') {
        cleanTabName = 'Tab 4: Sinkron Dashboard';
      } else if (sc.title.includes('Supplier') || sc.id === 'scenario_goods_in') {
        cleanTabName = 'Tab 5: Goods In Supplier';
      } else if (sc.title.includes('Waste') || sc.id === 'scenario_kitchen_waste') {
        cleanTabName = 'Tab 6: Waste Dapur';
      } else {
        cleanTabName = `Tab ${index + 1}: ${sc.badge || sc.id}`;
      }
    }

    const poolId = `pool_${sc.id}`;
    return buildDiagramBlock(sc.id, cleanTabName, sc.lanes, sc.nodes, sc.edges, theme, poolId);
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="${new Date().toISOString()}" agent="RestoSync-Architecture-Engine" version="21.0.0" type="device">
${diagramBlocks}
</mxfile>`;
}
