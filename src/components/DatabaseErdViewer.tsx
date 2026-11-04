import React, { useState } from 'react';
import { 
  Database, 
  Key, 
  Link2, 
  Copy, 
  Check, 
  FileCode, 
  Layers, 
  Table, 
  ShieldCheck, 
  Search 
} from 'lucide-react';
import { DB_TABLES, POSTGRESQL_DDL_SCRIPT } from '../data/databaseSchemaData';
import { DbTableSpec } from '../types/inventory';

export const DatabaseErdViewer: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>('raw_materials');
  const [copied, setCopied] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const currentTable = DB_TABLES.find((t) => t.name === selectedTable) || DB_TABLES[0];

  const handleCopySql = () => {
    navigator.clipboard.writeText(POSTGRESQL_DDL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredTables = DB_TABLES.filter((t) => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="font-semibold text-teal-700">Arsitektur Basis Data Relasional</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-medium">PostgreSQL ACID &amp; FIFO Stored Procedure</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Skema Database &amp; Relasi (ERD) Terpadu
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Model data relasional yang menopang integritas mutasi persediaan, pencatatan batch FEFO/FIFO, Bill of Materials (BOM) multi-level, dan buku besar transaksi (General Ledger) nir-selisih.
            </p>
          </div>

          <button
            onClick={handleCopySql}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-full transition-all shadow-xs self-start sm:self-auto shrink-0 active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'SQL DDL Disalin!' : 'Salin Script PostgreSQL DDL'}</span>
          </button>
        </div>

        {/* Visual ERD Entity Relational Blueprint Cards */}
        <div className="mt-5 pt-4 border-t border-black/[0.04]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Peta Relasi Antar Tabel (Entity Relationship Map)
            </span>
            <span className="text-[11px] text-slate-500">
              Klik kotak tabel untuk menginspeksi kolom & indeks
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {DB_TABLES.map((table) => {
              const isSelected = table.name === selectedTable;
              return (
                <button
                  key={table.name}
                  onClick={() => setSelectedTable(table.name)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-850 border-emerald-500/80 ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-emerald-400 text-[11px]">
                      {table.name}
                    </span>
                    <Table className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">
                    PK: {table.primaryKey}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {table.columns.length} kolom · {table.indexes.length} indeks
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table Inspector & Column Specification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table Column Details */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-base font-bold text-white">
                    {currentTable.name}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {currentTable.description}
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-amber-400 border border-slate-700 shrink-0">
                Primary Key: {currentTable.primaryKey}
              </span>
            </div>

            {/* Column Schema Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-slate-400 border-b border-slate-800 bg-slate-950">
                  <tr>
                    <th className="py-2.5 px-3">Nama Kolom</th>
                    <th className="py-2.5 px-3">Tipe Data</th>
                    <th className="py-2.5 px-3">Constraint</th>
                    <th className="py-2.5 px-3">Deskripsi & Relasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                  {currentTable.columns.map((col) => (
                    <tr key={col.name} className="hover:bg-slate-850">
                      <td className="py-2.5 px-3 font-semibold text-white flex items-center gap-1.5">
                        {col.name === currentTable.primaryKey ? (
                          <Key className="w-3 h-3 text-amber-400 shrink-0" />
                        ) : col.isForeignKey ? (
                          <Link2 className="w-3 h-3 text-cyan-400 shrink-0" />
                        ) : (
                          <span className="w-3 h-3 inline-block" />
                        )}
                        <span>{col.name}</span>
                      </td>
                      <td className="py-2.5 px-3 text-emerald-400">{col.type}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          col.nullable ? 'text-slate-400 bg-slate-800' : 'text-amber-400 bg-amber-500/10'
                        }`}>
                          {col.nullable ? 'NULL' : 'NOT NULL'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-300">
                        {col.description}
                        {col.isForeignKey && (
                          <span className="block text-[10px] text-cyan-400 font-mono mt-0.5">
                            &rarr; Relasi ke {col.foreignTable}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Indexes */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Strategi Indeks Kinerja Tinggi:
              </span>
              <div className="space-y-1.5 font-mono text-[11px]">
                {currentTable.indexes.map((idx, i) => (
                  <div key={i} className="p-2 rounded bg-slate-950 text-slate-300 border border-slate-800 overflow-x-auto">
                    {idx}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PostgreSQL DDL & Stored Procedure Viewer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Full PostgreSQL DDL Script</h3>
              </div>
              <button
                onClick={handleCopySql}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin Script'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Termasuk definisi tabel relasional, foreign key constraints, indexes, dan Stored Procedure FIFO dengan Row-Level Locking (`SELECT FOR UPDATE`).
            </p>

            <pre className="text-[11px] font-mono text-emerald-300/90 bg-slate-950 p-3.5 rounded-lg border border-slate-800 overflow-x-auto max-h-[500px] overflow-y-auto leading-relaxed">
              {POSTGRESQL_DDL_SCRIPT}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
