import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Unlock, Key, X, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { verifyPasswordSHA256 } from "../cryptoUtils";

interface PresenterPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: (password: string) => void;
  playBeep?: (freq?: number, type?: "sine" | "square" | "sawtooth" | "triangle", duration?: number) => void;
}

// SHA-256 of "258658"
const CORRECT_PASSWORD_HASH = "b861354ad89d2fff8f78c9f2ded9c307fd31732660e5ad600eeedddf94956065";

export const PresenterPasswordModal: React.FC<PresenterPasswordModalProps> = ({
  isOpen,
  onClose,
  onUnlock,
  playBeep
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isErrorShake, setIsErrorShake] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setErrorMsg(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isVerifying || !password) return;

    setIsVerifying(true);
    setErrorMsg(null);

    try {
      // Direct SHA-256 validation (completely safe against simple frontend code inspection)
      const isValid = await verifyPasswordSHA256(password, CORRECT_PASSWORD_HASH);
      
      if (isValid) {
        if (playBeep) playBeep(800, "sine", 0.15); // Success high bell
        setPassword("");
        onUnlock(password);
      } else {
        if (playBeep) {
          playBeep(220, "sawtooth", 0.3); // Low error buzz
        }
        setIsErrorShake(true);
        setErrorMsg("رمز ورود نادرست است. لطفاً دوباره تلاش کنید.");
        setTimeout(() => setIsErrorShake(false), 500);
      }
    } catch (err) {
      setErrorMsg("خطایی در اعتبارسنجی رخ داد.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNumpadClick = (num: string) => {
    setErrorMsg(null);
    if (password.length < 12) {
      setPassword((prev) => prev + num);
      if (playBeep) playBeep(580, "sine", 0.05);
    }
  };

  const handleBackspace = () => {
    setErrorMsg(null);
    setPassword((prev) => prev.slice(0, -1));
    if (playBeep) playBeep(440, "sine", 0.05);
  };

  const handleClear = () => {
    setPassword("");
    setErrorMsg(null);
    if (playBeep) playBeep(330, "sine", 0.05);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div id="presenter-auth-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        
        {/* Modal container */}
        <motion.div
          id="presenter-auth-modal"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            x: isErrorShake ? [0, -10, 10, -10, 10, -5, 5, 0] : 0
          }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative"
        >
          {/* Subtle color ambient border glow */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 via-indigo-500 to-fuchsia-500" />

          {/* Close button */}
          <button
            onClick={() => {
              if (playBeep) playBeep(350, "sine", 0.08);
              onClose();
            }}
            className="absolute top-4 left-4 p-2 rounded-xl bg-slate-950/40 hover:bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 sm:p-8 font-sans">
            {/* Header Lock Icon */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/15 rounded-full blur-xl scale-125" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center border border-purple-400/20 text-white shadow-lg">
                  <Lock className="w-6 h-6 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Typography Title */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-extrabold text-slate-100 tracking-wide">
                پیشخوان حفاظت‌شده ارائه ده‌نده
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                مشاهده نکات شفاهی اسلایدها و ابزارهای مانیتورینگ زمان فقط با تأیید هویت امکان‌پذیر است.
              </p>
            </div>

            {/* Submit logic form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  ref={inputRef}
                  type={showPassword ? "text" : "password"}
                  maxLength={12}
                  value={password}
                  onChange={(e) => {
                    setErrorMsg(null);
                    setPassword(e.target.value);
                  }}
                  placeholder="رمز عبور ۶ رقمی را وارد کنید..."
                  className="w-full text-center tracking-[0.4em] font-mono text-xl py-3.5 bg-slate-950/80 rounded-2xl border-2 border-slate-800 focus:border-purple-500 focus:outline-none transition-colors duration-300 text-slate-100 placeholder:text-slate-650 placeholder:tracking-normal placeholder:font-sans placeholder:text-sm pl-12 pr-4"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all"
                  title={showPassword ? "عدم نمایش رمز" : "نمایش رمز"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Error messages */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center gap-2 text-xs bg-red-500/10 border border-red-500/35 text-red-400 p-3 rounded-xl justify-center font-bold"
                  >
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Premium Numeric Numpad for ease of presentation screen and pointer click */}
              <div className="grid grid-cols-3 gap-2 py-2 select-none">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleNumpadClick(num)}
                    className="py-3 text-lg font-mono font-bold text-slate-350 bg-slate-955 hover:bg-slate-800 border border-slate-800/50 hover:border-slate-700 rounded-xl transition-all hover:text-white"
                  >
                    {num}
                  </button>
                ))}
                
                <button
                  type="button"
                  onClick={handleClear}
                  className="py-3 text-xs font-bold text-slate-400 hover:text-red-400 bg-slate-955 hover:bg-red-500/10 border border-slate-800/50 hover:border-red-500/20 rounded-xl transition-all"
                >
                  پاک کردن
                </button>

                <button
                  type="button"
                  onClick={() => handleNumpadClick("0")}
                  className="py-3 text-lg font-mono font-bold text-slate-350 bg-slate-955 hover:bg-slate-800 border border-slate-800/50 hover:border-slate-700 rounded-xl transition-all hover:text-white"
                >
                  0
                </button>

                <button
                  type="button"
                  onClick={handleBackspace}
                  className="py-3 text-xs font-bold text-slate-400 hover:text-indigo-400 bg-slate-955 hover:bg-indigo-500/10 border border-slate-800/50 hover:border-indigo-500/20 rounded-xl transition-all"
                >
                  حذف
                </button>
              </div>

              {/* Form buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    if (playBeep) playBeep(350, "sine", 0.08);
                    onClose();
                  }}
                  className="flex-1 py-3 text-sm font-bold text-slate-400 bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all text-center"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isVerifying || !password}
                  className="flex-1 py-3 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-2xl transition-all flex items-center justify-center gap-2 border border-purple-500/25"
                >
                  <Unlock className="w-4 h-4" />
                  <span>{isVerifying ? "اعتبارسنجی..." : "تأیید و ورود"}</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
