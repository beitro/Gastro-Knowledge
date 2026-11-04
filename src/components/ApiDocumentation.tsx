import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Radio, 
  ExternalLink, 
  ChevronDown, 
  ChevronRight, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';
import { API_ENDPOINTS } from '../data/apiSpecData';
import { ApiEndpointSpec, SystemModuleId } from '../types/inventory';

export const ApiDocumentation: React.FC = () => {
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>(API_ENDPOINTS[0].id);
  const [filterModule, setFilterModule] = useState<SystemModuleId | 'all'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const selectedEndpoint = API_ENDPOINTS.find((e) => e.id === selectedEndpointId) || API_ENDPOINTS[0];

  const filteredEndpoints = filterModule === 'all' 
    ? API_ENDPOINTS 
    : API_ENDPOINTS.filter((e) => e.module === filterModule);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getMethodBadge = (method: ApiEndpointSpec['method']) => {
    switch (method) {
      case 'POST':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'GET':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'PATCH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'DELETE':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'WS':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Overview */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <span className="font-semibold text-blue-700">Spesifikasi Teknis &amp; Integrasi</span>
          <span aria-hidden="true">·</span>
          <span className="text-slate-500 font-medium">REST API &amp; WebSocket RFC Spec</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Dokumentasi Integrasi API &amp; Event Bus Real-Time
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Seluruh interface (Kasir, KDS, Scanner Gudang, Web Dashboard) terhubung via REST API berstandar JSON dan WebSocket Gateway untuk sinkronisasi instan di bawah 150ms.
        </p>

        {/* Filter Bar */}
        <div className="mt-5 pt-4 border-t border-black/[0.04] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 shrink-0">Filter Modul:</span>
          {[
            { id: 'all', name: 'Semua Endpoint' },
            { id: 'kasir', name: 'Kasir (POS)' },
            { id: 'dapur', name: 'Dapur (KDS)' },
            { id: 'gudang', name: 'Gudang & Stok' },
            { id: 'dashboard', name: 'Dashboard' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterModule(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                filterModule === tab.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 border-black/[0.04] text-slate-700 hover:bg-slate-100'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* API Explorer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoint List Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
            Daftar Endpoint ({filteredEndpoints.length})
          </div>

          <div className="space-y-1.5">
            {filteredEndpoints.map((ep) => {
              const isSelected = ep.id === selectedEndpointId;
              return (
                <div
                  key={ep.id}
                  onClick={() => setSelectedEndpointId(ep.id)}
                  className={`cursor-pointer p-3 rounded-lg border text-xs transition-all ${
                    isSelected
                      ? 'bg-slate-850 border-cyan-500/70 shadow-md ring-1 ring-cyan-500/30'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850/60'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] border ${getMethodBadge(ep.method)}`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-slate-300 text-[11px] truncate">
                      {ep.path}
                    </span>
                  </div>
                  <div className="font-semibold text-white truncate">{ep.title}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Endpoint Detail View */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
            {/* Title & Route banner */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs border ${getMethodBadge(selectedEndpoint.method)}`}>
                  {selectedEndpoint.method}
                </span>
                <span className="font-mono text-sm sm:text-base font-semibold text-white">
                  {selectedEndpoint.path}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">{selectedEndpoint.title}</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                {selectedEndpoint.description}
              </p>
            </div>

            {/* Request Headers */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Header Permintaan (HTTP Request Headers)
              </h3>
              <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-slate-400 border-b border-slate-800 bg-slate-900/60">
                    <tr>
                      <th className="py-2 px-3 font-semibold">Header Key</th>
                      <th className="py-2 px-3 font-semibold">Value / Deskripsi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                    {Object.entries(selectedEndpoint.headers).map(([k, v]) => (
                      <tr key={k}>
                        <td className="py-2 px-3 text-cyan-400">{k}</td>
                        <td className="py-2 px-3 text-slate-300">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Request Body Payload */}
            {selectedEndpoint.requestBody && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Request Payload Body (JSON)
                  </h3>
                  <button
                    onClick={() => handleCopy(selectedEndpoint.requestBody!, 'req-body')}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
                  >
                    {copiedKey === 'req-body' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'req-body' ? 'Disalin!' : 'Salin JSON'}</span>
                  </button>
                </div>

                <pre className="text-xs font-mono text-amber-300 bg-slate-950 p-3.5 rounded-lg border border-slate-800 overflow-x-auto leading-relaxed">
                  {selectedEndpoint.requestBody}
                </pre>
              </div>
            )}

            {/* Response Schemas */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Daftar Respons API (HTTP Responses)
              </h3>

              <div className="space-y-3">
                {selectedEndpoint.responses.map((res) => {
                  const isSuccess = res.status >= 200 && res.status < 300;
                  return (
                    <div key={res.status} className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
                      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                            isSuccess ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            HTTP {res.status}
                          </span>
                          <span className="text-xs text-slate-300 font-medium">
                            {res.description}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(res.body, `res-${res.status}`)}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          {copiedKey === `res-${res.status}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Salin</span>
                        </button>
                      </div>

                      <pre className="text-xs font-mono text-emerald-300 p-3.5 overflow-x-auto leading-relaxed">
                        {res.body}
                      </pre>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* WebSocket Events */}
            {selectedEndpoint.websocketEvents && selectedEndpoint.websocketEvents.length > 0 && (
              <div className="pt-3 border-t border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2 mb-2">
                  <Radio className="w-4 h-4 text-purple-400" />
                  <span>WebSocket Real-Time Broadcast yang Dipicu</span>
                </h3>

                <div className="space-y-3">
                  {selectedEndpoint.websocketEvents.map((ws, i) => (
                    <div key={i} className="p-3 rounded-lg bg-purple-950/20 border border-purple-800/40 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-purple-300">{ws.event}</span>
                        <span className="text-[11px] text-slate-400">{ws.direction}</span>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        <span className="text-slate-400">Target Penerima: </span>
                        {ws.targetInterfaces.join(', ')}
                      </div>
                      <pre className="text-[11px] font-mono bg-slate-950 p-2.5 rounded text-slate-200 overflow-x-auto border border-slate-800">
                        {ws.payload}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
