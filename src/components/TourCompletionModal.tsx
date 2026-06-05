import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Lightbulb, Zap, Keyboard, Sparkles, Check, Flame } from "lucide-react";

interface TourCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  playBeep?: (freq?: number, type?: "sine" | "square" | "sawtooth" | "triangle", duration?: number) => void;
}

export const TourCompletionModal: React.FC<TourCompletionModalProps> = ({
  isOpen,
  onClose,
  playBeep
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="tour-completion-overlay"
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
        style={{ direction: "rtl" }}
      >
        <motion.div
          id="tour-completion-modal"
          initial={{ opacity: 0, scale: 0.93, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 30 }}
          transition={{ type: "spring", duration: 0.6, bounce: 0.15 }}
          className="w-full max-w-2xl bg-slate-900 border border-slate-800/80 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative"
        >
          {/* Top glowing ambient line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600" />

          {/* Close button */}
          <button
            onClick={() => {
              if (playBeep) playBeep(350, "sine", 0.08);
              onClose();
            }}
            className="absolute top-4 left-4 p-2 rounded-xl bg-slate-950/40 hover:bg-slate-950/80 text-slate-450 hover:text-white border border-slate-800/40 transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 sm:p-10 font-sans relative overflow-hidden">
            {/* Visual ambient circle glow */}
            <div className="absolute -top-12 right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 left-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header section with lightbulb */}
            <div className="flex items-center gap-4 mb-6 relative z-10 border-b border-slate-800 pb-5">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/25 rounded-full blur-xl animate-pulse" />
                <div className="relative w-12 h-12 bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Lightbulb className="w-6 h-6 stroke-[2.5]" />
                </div>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  راهنما و شناسایی المان‌های تعاملی
                </h3>
                <span className="text-xs text-amber-500 font-bold block mt-0.5 tracking-wide">
                  پودمان پنجم: از ایده تا محصول
                </span>
              </div>
            </div>

            {/* Main Rich text content matching uploaded image */}
            <div className="space-y-5 text-slate-300 relative z-10 leading-relaxed text-sm md:text-base text-justify">
              <p className="font-sans">
                هر جا علامت چشمک‌زن{" "}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-pulse font-mono tracking-wide mx-1">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  تعاملی
                </span>{" "}
                را در بالای اسلاید دیدید، یعنی این که دکمه‌ها، نمودارها یا المان‌های تعاملی درون این اسلاید وجود دارد و می‌توانید با کلیک روی آن‌ها اطلاعات و جزئیات علمی افزون‌تری را مطالعه و در کلاس ارائه نمایید.
              </p>

              {/* Silicon valley quote bar */}
              <div className="bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/15 p-4 rounded-2xl flex items-start gap-3.5 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-xs md:text-sm text-indigo-200 font-medium leading-relaxed font-sans">
                  با بهره‌گیری از کلیدهای میانبر فوق، کار با تخته هوشمند مدرسه را مانند بازاریابان باتجربه سیلیکون‌ولی هدایت کنید!
                </p>
              </div>

              {/* Smart Shortcuts Grid cards representing "کلیدهای میانبر فوق" */}
              <div className="pt-4">
                <span className="text-xs font-extrabold text-slate-400 block mb-3 font-sans tracking-wider flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-slate-500" />
                  جعبه‌ابزار کلیدهای میانبر پرزنتر (تخته هوشمند)
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-slate-950/50 border border-slate-800/60 p-3 rounded-xl flex items-center gap-3">
                    <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-200 shadow-inner min-w-[32px] text-center">
                      ←
                    </kbd>
                    <span className="text-xs font-semibold text-slate-350">اسلاید بعدی (جهت حرکت)</span>
                  </div>

                  <div className="bg-slate-950/50 border border-slate-800/60 p-3 rounded-xl flex items-center gap-3">
                    <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-200 shadow-inner min-w-[32px] text-center">
                      →
                    </kbd>
                    <span className="text-xs font-semibold text-slate-350">اسلاید قبلی</span>
                  </div>

                  <div className="bg-slate-950/50 border border-slate-800/60 p-3 rounded-xl flex items-center gap-3">
                    <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-200 shadow-inner min-w-[32px] text-center">
                      Space
                    </kbd>
                    <span className="text-xs font-semibold text-slate-350">اسلاید بعدی</span>
                  </div>

                  <div className="bg-slate-950/50 border border-slate-800/60 p-3 rounded-xl flex items-center gap-3">
                    <kbd className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-200 shadow-inner min-w-[32px] text-center">
                      L
                    </kbd>
                    <span className="text-xs font-semibold text-slate-350">لیزر ردیاب هوشمند</span>
                  </div>

                  <div className="bg-slate-950/50 border border-slate-800/60 p-3 rounded-xl flex items-center gap-3">
                    <kbd className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-200 shadow-inner min-w-[32px] text-center">
                      D
                    </kbd>
                    <span className="text-xs font-semibold text-slate-350">فعال‌سازی قلم وایت‌برد</span>
                  </div>

                  <div className="bg-slate-950/50 border border-slate-800/60 p-3 rounded-xl flex items-center gap-3">
                    <kbd className="px-1.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-mono font-bold text-slate-200 shadow-inner min-w-[32px] text-center">
                      Home
                    </kbd>
                    <span className="text-xs font-semibold text-slate-350">صفحه اول (جلد)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Call to Action */}
            <div className="mt-8 flex justify-end gap-3 border-t border-slate-800/60 pt-6 relative z-10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (playBeep) playBeep(700, "sine", 0.12);
                  onClose();
                }}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-sm font-black rounded-2xl shadow-lg shadow-amber-500/10 cursor-pointer flex items-center justify-center gap-2 border border-amber-400/20 font-sans"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>متوجه شدم، شروع ارائه حرفه‌ای !</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
