import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Spark Studio Uncaught Error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('spark_studio_save_v3');
      localStorage.removeItem('spark_studio_save_v2');
      localStorage.removeItem('spark_studio_data');
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex items-center justify-center p-6 text-white select-none">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-pink-200 to-indigo-200">
              Студия перезагружается
            </h1>

            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Произошла непредвиденная ошибка в браузере. Нажмите кнопку ниже, чтобы перезапустить игру с сохранением данных.
            </p>

            {this.state.error && (
              <div className="mb-6 p-3 rounded-xl bg-black/40 border border-white/10 text-left overflow-auto max-h-32 text-xs text-rose-300 font-mono">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-600 hover:from-amber-500 hover:to-indigo-700 text-slate-950 font-black text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Перезапустить студию</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
