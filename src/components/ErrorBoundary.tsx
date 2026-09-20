import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2, Home } from 'lucide-react';
import { db } from '../db/store';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AttendIQ Uncaught Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    if (window.confirm('Reset local application cache and restore system defaults?')) {
      try {
        db.resetToDefaults();
        localStorage.removeItem('attendiq_auth_user');
      } catch (e) {
        console.error('Failed to reset storage:', e);
        localStorage.clear();
      }
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Application Encountered an Error
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              An unexpected issue occurred while rendering the portal. You can reload or reset your browser's local state.
            </p>

            {this.state.error && (
              <div className="mt-4 p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-left overflow-hidden">
                <p className="text-[11px] font-mono text-rose-300 break-words line-clamp-3">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="mt-6 space-y-2">
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                onClick={this.handleResetCache}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>Reset System Cache</span>
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <Home className="w-3.5 h-3.5" />
              <span>Sri Balaji College of Engg & Tech • AttendIQ</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

