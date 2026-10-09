import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, HelpCircle } from 'lucide-react';

/**
 * Pengganti window.confirm / window.prompt untuk panel admin.
 * Popup bawaan browser tidak bisa diberi gaya, sering diblokir di ponsel,
 * dan membekukan halaman. Pemakaian:
 *
 *   const { confirm, prompt, dialogs } = useAdminDialogs();
 *   if (!(await confirm({ title: 'Hapus?', message: '...', tone: 'danger' }))) return;
 *   ...
 *   return (<>{...}{dialogs}</>);
 */

export interface ConfirmOptions {
  title: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'primary' | 'danger';
}

export interface PromptOptions extends ConfirmOptions {
  label?: string;
  placeholder?: string;
  initialValue?: string;
  multiline?: boolean;
  /** true = tombol konfirmasi nonaktif selama isian kosong. */
  required?: boolean;
}

type DialogState =
  | { kind: 'confirm'; opts: ConfirmOptions; resolve: (v: boolean) => void }
  | { kind: 'prompt'; opts: PromptOptions; resolve: (v: string | null) => void };

export function useAdminDialogs() {
  const [state, setState] = useState<DialogState | null>(null);

  const confirm = useCallback(
    (opts: ConfirmOptions) =>
      new Promise<boolean>((resolve) => setState({ kind: 'confirm', opts, resolve })),
    []
  );

  const prompt = useCallback(
    (opts: PromptOptions) =>
      new Promise<string | null>((resolve) => setState({ kind: 'prompt', opts, resolve })),
    []
  );

  const close = useCallback(() => setState(null), []);

  const dialogs = state ? <DialogView state={state} onClose={close} /> : null;
  return { confirm, prompt, dialogs };
}

const DialogView: React.FC<{ state: DialogState; onClose: () => void }> = ({ state, onClose }) => {
  const { opts } = state;
  const isPrompt = state.kind === 'prompt';
  const [value, setValue] = useState(isPrompt ? (state.opts as PromptOptions).initialValue || '' : '');
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const tone = opts.tone || 'primary';
  const required = isPrompt && Boolean((opts as PromptOptions).required);
  const canSubmit = !required || value.trim().length > 0;

  const cancel = useCallback(() => {
    if (state.kind === 'confirm') state.resolve(false);
    else state.resolve(null);
    onClose();
  }, [state, onClose]);

  const submit = () => {
    if (!canSubmit) return;
    if (state.kind === 'confirm') state.resolve(true);
    else state.resolve(value);
    onClose();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cancel]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const Icon = tone === 'danger' ? AlertTriangle : HelpCircle;
  const p = opts as PromptOptions;

  return (
    <div
      className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) cancel();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={opts.title}
    >
      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        <div className="p-5 flex gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              tone === 'danger'
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-blue-50 text-blue-600 border-blue-200'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-heading font-extrabold text-slate-900 text-base">{opts.title}</h3>
            {opts.message && (
              <div className="text-xs text-slate-600 leading-relaxed mt-1.5 whitespace-pre-line">{opts.message}</div>
            )}
            {isPrompt && (
              <div className="mt-3">
                {p.label && (
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    {p.label}
                  </label>
                )}
                {p.multiline ? (
                  <textarea
                    ref={inputRef}
                    rows={3}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={p.placeholder}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                ) : (
                  <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        submit();
                      }
                    }}
                    placeholder={p.placeholder}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                )}
              </div>
            )}
          </div>
        </div>
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={cancel}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            {opts.cancelLabel || 'Batal'}
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className={`px-4 py-2 rounded-xl text-white text-xs font-bold shadow-sm transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              tone === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {opts.confirmLabel || (tone === 'danger' ? 'Ya, hapus' : 'Lanjutkan')}
          </button>
        </div>
      </div>
    </div>
  );
};
