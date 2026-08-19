import React, { useState } from "react";
import { X, Key, ExternalLink, Check, AlertCircle, Sparkles, ShieldCheck } from "lucide-react";
import { LtaApiStatus } from "../types";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiStatus: LtaApiStatus | null;
  onSaveCustomKey: (key: string) => void;
  currentCustomKey: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiStatus,
  onSaveCustomKey,
  currentCustomKey
}) => {
  const [inputKey, setInputKey] = useState(currentCustomKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCustomKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-base">LTA DataMall AccountKey</h3>
              <p className="text-xs text-slate-400">Land Transport Authority Singapore DataMall API</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Status Box */}
          <div className={`p-4 rounded-xl border ${apiStatus?.hasKey ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300" : "bg-slate-850 border-slate-700/60 text-slate-300"}`}>
            <div className="flex items-start gap-3">
              {apiStatus?.hasKey ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
              )}
              <div className="text-xs space-y-1">
                <p className="font-semibold text-slate-100">
                  {apiStatus?.hasKey ? "LTA DataMall Active Connection" : "Demo / Offline Mode Active"}
                </p>
                <p className="text-slate-400">
                  {apiStatus?.source || "Simulated realistic Singapore data is loaded for preview."}
                </p>
                {apiStatus?.hasKey && (
                  <p className="font-mono text-emerald-400 pt-1">
                    Key Fingerprint: {apiStatus.keyPreview}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form to enter or override custom account key */}
          <form onSubmit={handleSave} className="space-y-3">
            <label className="block text-xs font-medium text-slate-300">
              Enter or update your LTA DataMall AccountKey
            </label>
            <div className="relative">
              <input
                id="input-lta-account-key"
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="e.g. 5x7K... or your 32-character key"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              All requests are securely proxied server-side to <code className="text-slate-300">datamall2.mytransport.sg</code> using standard HTTP headers.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="btn-save-account-key"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Save & Apply</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* How to get an account key */}
          <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 space-y-2">
            <p className="font-semibold text-slate-300 flex items-center gap-1.5">
              <span>Need a free Singapore LTA DataMall Key?</span>
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Anyone can request an official API AccountKey instantly on LTA DataMall portal.
            </p>
            <a
              href="https://datamall.lta.gov.sg/content/datamall/en/request-api.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium hover:underline text-xs"
            >
              <span>Visit LTA DataMall API Request Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
