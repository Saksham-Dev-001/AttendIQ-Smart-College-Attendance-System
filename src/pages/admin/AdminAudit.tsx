import React, { useState, useEffect } from 'react';
import { db } from '../../db/store';
import { AuditLog } from '../../types';
import { History, Search, ShieldCheck, Filter } from 'lucide-react';

export const AdminAudit: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const sync = () => {
    setLogs(db.getAuditLogs());
  };

  useEffect(() => {
    sync();
    const unsub = db.subscribe(sync);
    return () => unsub();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesSearch =
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAction && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" />
          <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            Immutable Audit Trail & Governance Log
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Every manual attendance correction, rule update, or session override is permanently recorded with mandatory justification.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail by actor, reason, or target ID..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Actions</option>
            <option value="attendance_correction">Attendance Corrections</option>
            <option value="rule_change">System Rule Changes</option>
            <option value="session_closed">Session Closures</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Target</th>
                <th className="py-3.5 px-4">Old Value ➔ New Value</th>
                <th className="py-3.5 px-4">Justification Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No audit records found matching filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{log.actorName}</div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500">
                      {log.targetType}: {log.targetId.substring(0, 12)}...
                    </td>
                    <td className="py-3.5 px-4">
                      {log.oldValue || log.newValue ? (
                        <div className="flex items-center gap-1.5 font-mono text-[10px]">
                          <span className="line-through text-rose-500">{log.oldValue || 'none'}</span>
                          <span className="text-slate-400">➔</span>
                          <span className="font-bold text-emerald-600">{log.newValue || 'updated'}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px]">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">{log.reason}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

