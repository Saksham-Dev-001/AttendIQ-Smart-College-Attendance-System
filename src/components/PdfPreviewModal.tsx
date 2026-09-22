import React from 'react';
import { X, Printer, Download, FileText } from 'lucide-react';
import { triggerPrintHtml } from '../services/pdfService';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  htmlContent: string;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  htmlContent,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    triggerPrintHtml(htmlContent);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Toolbar Header */}
        <div className="p-4 sm:px-6 bg-slate-800/90 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-100">
                {title}
              </h2>
              <p className="text-[11px] text-slate-400">
                Official Institutional PDF Document Preview (A4 Printable Layout)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Render Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/50 flex justify-center">
          <div className="w-full max-w-3xl bg-white text-slate-900 rounded-xl shadow-2xl overflow-hidden min-h-[600px] border border-slate-200">
            <iframe
              srcDoc={htmlContent}
              title="Attendance Document PDF Preview"
              className="w-full h-[70vh] border-0"
              sandbox="allow-same-origin"
            />
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-3 bg-slate-800/80 border-t border-slate-700/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
          <span>
            💡 In the print dialog, select <strong className="text-indigo-300">"Save as PDF"</strong> to store this document offline.
          </span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1 rounded-lg hover:bg-slate-700/60 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

