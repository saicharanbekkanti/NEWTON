import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  UploadCloud, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ArrowRight, 
  QrCode, 
  Receipt, 
  Zap, 
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { 
  auditDataQuality, 
  type DataQualityReport 
} from '@/lib/credenceEngine';
import { dbService, type StoredFinancialRecord, type StoredSource } from '@/lib/supabase';

interface DataSourcesManagerProps {
  userId: string;
  sources: StoredSource[];
  records: StoredFinancialRecord[];
  onDataUpdated: () => void;
  isDemoMode: boolean;
}

export const DataSourcesManager: React.FC<DataSourcesManagerProps> = ({
  userId,
  sources,
  records,
  onDataUpdated,
  isDemoMode
}) => {
  const [activeTab, setActiveTab] = useState<'sources' | 'upload'>('sources');
  const [parsedRows, setParsedRows] = useState<Omit<StoredFinancialRecord, 'id'>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [auditReport, setAuditReport] = useState<DataQualityReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Sample CSV generator for instant testing
  const handleDownloadSampleCsv = () => {
    const sampleCsv = `record_date,inflow,outflow,category,description,transaction_ref
2026-03-01,4800,0,Retail UPI QR Inflow,Customer QR Settlement - Stall #14,UPI-UTR-99101
2026-03-02,5200,0,Retail UPI QR Inflow,Customer QR Settlement - Stall #14,UPI-UTR-99102
2026-03-02,0,3500,Mandi Wholesale Procurement,Bulk Potato Procurement Lot #88,MND-LOT-8801
2026-03-03,6100,0,Retail UPI QR Inflow,Customer QR Settlement - Stall #14,UPI-UTR-99103
2026-03-04,4900,0,Retail UPI QR Inflow,Customer QR Settlement - Stall #14,UPI-UTR-99104
2026-03-05,0,1800,Utility Payment,Mandi Cold Storage & Power Grid Bill,PWR-BIL-4012
2026-03-06,5600,0,Retail UPI QR Inflow,Customer QR Settlement - Stall #14,UPI-UTR-99105
2026-03-07,6400,0,Retail UPI QR Inflow,Customer QR Settlement - Stall #14,UPI-UTR-99106
2026-03-08,0,4100,Mandi Wholesale Procurement,Bulk Onion Procurement Lot #91,MND-LOT-9102
2026-03-09,5100,0,Retail UPI QR Inflow,Customer QR Settlement - Stall #14,UPI-UTR-99107
2026-03-10,5800,0,Retail UPI QR Inflow,Customer QR Settlement - Stall #14,UPI-UTR-99108`;

    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'credence_alternative_records_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      processCsv(text);
    };
    reader.readAsText(file);
  };

  const processCsv = (text: string) => {
    const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return;

    const detectedHeaders = lines[0].split(',').map(h => h.trim().toLowerCase());
    setHeaders(detectedHeaders);

    const rawRecords: Omit<StoredFinancialRecord, 'id'>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const recordObj: Record<string, string> = {};
      detectedHeaders.forEach((h, idx) => {
        recordObj[h] = values[idx] || '';
      });

      const parsedInflow = parseFloat(recordObj['inflow'] || recordObj['amount'] || '0');
      const parsedOutflow = parseFloat(recordObj['outflow'] || '0');
      const dateVal = recordObj['record_date'] || recordObj['date'] || new Date().toISOString().split('T')[0];

      if (!isNaN(parsedInflow) && dateVal) {
        rawRecords.push({
          firebase_uid: userId,
          record_date: dateVal,
          inflow: isNaN(parsedInflow) ? 0 : parsedInflow,
          outflow: isNaN(parsedOutflow) ? 0 : parsedOutflow,
          net_buffer: (parsedInflow || 0) - (parsedOutflow || 0),
          category: recordObj['category'] || 'Retail UPI QR Inflow',
          description: recordObj['description'] || 'Uploaded transaction record',
          transaction_ref: recordObj['transaction_ref'] || recordObj['ref'] || `TXN-${Date.now()}-${i}`,
          is_recurring: parsedOutflow > 0 && (recordObj['category']?.toLowerCase().includes('procurement') || recordObj['category']?.toLowerCase().includes('utility'))
        });
      }
    }

    setParsedRows(rawRecords);
    const report = auditDataQuality(rawRecords);
    setAuditReport(report);
  };

  const handleCommitImport = async () => {
    if (parsedRows.length === 0) return;
    setIsProcessing(true);

    try {
      await dbService.saveRecords(userId, parsedRows);

      // Also ensure corresponding sources exist
      const sourceCategories = Array.from(new Set(parsedRows.map(r => r.category)));
      for (const cat of sourceCategories) {
        await dbService.saveSource(userId, {
          firebase_uid: userId,
          source_name: cat,
          source_type: cat.toLowerCase().includes('upi') ? 'UPI_QR' : cat.toLowerCase().includes('mandi') ? 'APMC_MANDI' : 'UTILITY',
          status: 'VERIFIED',
          record_count: parsedRows.filter(r => r.category === cat).length,
          evidence_contribution: 25,
          last_sync: new Date().toISOString()
        });
      }

      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setParsedRows([]);
        setAuditReport(null);
        setActiveTab('sources');
        onDataUpdated();
      }, 1500);
    } catch (err) {
      console.error('Failed to import records:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'UPI_QR': return <QrCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'APMC_MANDI': return <Receipt className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'UTILITY': return <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      default: return <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top action navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-6 py-3 rounded-full text-xs font-outfit font-black uppercase tracking-wider transition-all ${
              activeTab === 'sources'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Connected Feeds ({sources.length})
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-3 rounded-full text-xs font-outfit font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Ingest Bank/Mandi Records</span>
          </button>
        </div>

        <button
          onClick={handleDownloadSampleCsv}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-outfit font-black uppercase tracking-wider transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Download Sample CSV</span>
        </button>
      </div>

      {isDemoMode && (
        <div className="flex items-center gap-3 p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-300">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="font-medium">
            <strong className="font-bold text-indigo-700 dark:text-indigo-200 uppercase tracking-wider mr-1">Active Context:</strong>
            Demonstrating with <strong>Sai Charan (APMC Mandi Vendor)</strong>. You can upload custom CSV transactions below to replace or extend this data stream.
          </span>
        </div>
      )}

      {/* Tab: Connected Sources */}
      {activeTab === 'sources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sources.map((src) => {
            const count = records.filter(r => r.category === src.source_name).length || src.record_count;
            return (
              <div 
                key={src.id}
                className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                      {getSourceIcon(src.source_type)}
                    </div>
                    <span className="px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {src.status}
                    </span>
                  </div>

                  <h3 className="font-outfit font-black text-slate-900 dark:text-white text-lg tracking-tight uppercase">{src.source_name}</h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Verified Inflow Stream</p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Audited Records</span>
                  <span className="font-outfit font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-xl">
                    {count} events
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: CSV Upload & Quality Audit */}
      {activeTab === 'upload' && (
        <div className="space-y-8">
          {/* Upload Dropzone */}
          <div className="border-8 border-dashed rounded-[3.5rem] p-16 sm:p-24 text-center bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-xl transition-all relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-24 h-24 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
                <FileSpreadsheet className="w-10 h-10" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-outfit font-black uppercase text-slate-900 dark:text-white">
                Drag & Drop Alternative Financial Records
              </h3>
              <p className="text-slate-400 dark:text-slate-500 text-xs max-w-md font-bold uppercase tracking-widest">
                Bank statements, UPI QR statements, APMC mandi auction slips, and utility bills (.csv)
              </p>
            </div>
          </div>

          {/* Audit & Preview Section */}
          <AnimatePresence>
            {auditReport && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Audit summary banner */}
                <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3.5 rounded-2xl ${
                        auditReport.rating === 'Excellent' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' :
                        auditReport.rating === 'Good' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' :
                        'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      }`}>
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Pre-Ingestion Audit</span>
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            auditReport.rating === 'Excellent' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                            auditReport.rating === 'Good' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' :
                            'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                          }`}>
                            RATING: {auditReport.rating.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xl sm:text-2xl font-outfit font-black uppercase text-slate-900 dark:text-white mt-1">
                          {parsedRows.length} Rows Audited ({auditReport.validRowCount} Valid, {auditReport.invalidRowCount} Invalid)
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleCommitImport}
                      disabled={isProcessing}
                      className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-outfit font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Auditing & Storing...</span>
                        </>
                      ) : uploadSuccess ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Imported Successfully!</span>
                        </>
                      ) : (
                        <>
                          <span>Commit & Recalculate Score</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Audit Metrics Breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Valid Records</div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-outfit font-black text-2xl mt-1">{auditReport.validRowCount}</div>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Invalid Records</div>
                      <div className="text-slate-700 dark:text-slate-300 font-outfit font-black text-2xl mt-1">{auditReport.invalidRowCount}</div>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Duplicates Detected</div>
                      <div className={`font-outfit font-black text-2xl mt-1 ${auditReport.duplicateCount > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                        {auditReport.duplicateCount}
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Missing Fields</div>
                      <div className="text-indigo-600 dark:text-indigo-400 font-outfit font-black text-2xl mt-1">{auditReport.missingFieldsCount}</div>
                    </div>
                  </div>

                  {/* Issues List if any */}
                  {auditReport.issues.length > 0 && (
                    <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 space-y-2">
                      <div className="font-bold flex items-center gap-2 uppercase tracking-wider text-[11px]">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Data Quality Observations:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 pl-1 font-medium">
                        {auditReport.issues.map((iss, i) => (
                          <li key={i}>{iss}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Table Preview */}
                <div className="rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                  <div className="px-8 py-5 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 text-xs font-black uppercase tracking-widest text-slate-400 flex items-center justify-between">
                    <span>Parsed Column Schema ({headers.join(', ')})</span>
                    <span>First 5 records preview</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50/30 dark:bg-slate-800/20 text-slate-400 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-black tracking-wider">
                        <tr>
                          <th className="px-8 py-4">Date</th>
                          <th className="px-8 py-4">Category</th>
                          <th className="px-8 py-4">Description</th>
                          <th className="px-8 py-4 text-right">Inflow</th>
                          <th className="px-8 py-4 text-right">Outflow</th>
                          <th className="px-8 py-4 text-right">Net Buffer</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 font-medium">
                        {parsedRows.slice(0, 5).map((r, i) => (
                          <tr key={i} className="hover:bg-indigo-50/20 dark:hover:bg-indigo-900/10">
                            <td className="px-8 py-4 text-slate-500 dark:text-slate-400">{r.record_date}</td>
                            <td className="px-8 py-4 font-bold text-indigo-600 dark:text-indigo-400">{r.category}</td>
                            <td className="px-8 py-4 text-slate-900 dark:text-white max-w-xs truncate">{r.description}</td>
                            <td className="px-8 py-4 text-right font-black text-emerald-600 dark:text-emerald-400">+₹{r.inflow.toLocaleString('en-IN')}</td>
                            <td className="px-8 py-4 text-right font-bold text-slate-400">-₹{r.outflow.toLocaleString('en-IN')}</td>
                            <td className={`px-8 py-4 text-right font-black ${r.net_buffer >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                              ₹{r.net_buffer.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
