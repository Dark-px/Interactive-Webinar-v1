import React, { useState, useEffect, useRef } from "react";
import { X, Play, VolumeX, CheckCircle2, Volume2, Navigation, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      console.warn("localStorage not available");
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      console.warn("localStorage not available");
    }
  }
};

export interface StartupOverlayProps {
  onStart: (enableSound: boolean) => void;
}

export function StartupOverlay({ onStart }: StartupOverlayProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/96 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl w-full bg-slate-950 border border-slate-800/70 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.85)] relative overflow-hidden flex flex-col md:flex-row-reverse"
        style={{ direction: "rtl" }}
      >
        {/* Fine architectural layout guides */}
        <div className="absolute top-0 right-0 w-16 h-16 border-r border-t border-slate-800/40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l border-b border-slate-800/40 pointer-events-none" />

        {/* Right Column: Presentation Index/Syllabus */}
        <div className="hidden md:flex flex-col justify-between p-8 bg-slate-900/20 border-l border-slate-900 w-1/3 shrink-0">
          <div className="space-y-6">
            <div>
              <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase block mb-1">PRESENTATION INDEX</span>
              <h4 className="text-xs font-bold text-slate-400 font-sans">سرفصل‌های پودمان ۵</h4>
            </div>
            <div className="space-y-4 font-sans text-xs">
              <div className="flex gap-3 text-slate-400">
                <span className="font-mono text-indigo-500/80">۰۱</span>
                <span>مفهوم ایده و خلاقیت</span>
              </div>
              <div className="flex gap-3 text-slate-400">
                <span className="font-mono text-indigo-500/80">۰۲</span>
                <span>پرورش و طوفان فکری</span>
              </div>
              <div className="flex gap-3 text-slate-400">
                <span className="font-mono text-indigo-500/80">۰۳</span>
                <span>تفکر طراحی و تجاری‌سازی</span>
              </div>
              <div className="flex gap-3 text-slate-400">
                <span className="font-mono text-indigo-500/80">۰۴</span>
                <span>بررسی امکان‌سنجی بازار</span>
              </div>
            </div>
          </div>
          <div className="text-[9px] font-mono text-slate-500 border-t border-slate-900 pt-4">
            درس کارآفرینی • هنرستان
          </div>
        </div>

        {/* Left Column: Greeting and Actions */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-between space-y-8">
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <span className="font-mono text-slate-400">PODMAN 05</span>
              <span>•</span>
              <span className="font-sans">کاربرد فناوری‌های نوین</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-white leading-tight font-sans">
              از ایده تا محصول
            </h2>
            
            <p className="text-sm text-slate-300 leading-relaxed font-sans text-justify">
              سلام! به نمای تعاملی پروژه کلاسی و ارائه مبانی <span className="text-indigo-400 font-bold">پودمان ۵ (کاربرد فناوری‌های نوین)</span> خوش آمدید.
              در این فضای نوآورانه، فرآیند گام‌به‌گام و جذاب تبدیل یک جرقه ساده ذهنی به یک محصول ملموس و کارآمد با ارزش اقتصادی بالا را در قالب اسلایدهایی کاملا پویا تجربه خواهید کرد.
            </p>

            <div className="bg-slate-900/30 border border-slate-900/80 p-4 rounded-xl text-justify space-y-1">
              <span className="text-[11px] font-sans font-semibold text-slate-300 block">💡 بوم صوتی و ابزارهای چندرسانه‌ای:</span>
              <p className="text-xs text-slate-450 leading-relaxed font-sans">
                برای ارائه‌ای حرفه‌ای‌تر و پویاتر، امکاناتی نظیر موسیقی زمینه ملو، افکت‌های صوتی تعاملی، تخته یادداشت و لیزر پوینتر برای شما آماده شده‌اند که پس از کلیک بر روی دکمه شروع قابل استفاده خواهند بود.
              </p>
            </div>
          </div>

          <div className="w-full pt-2">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => onStart(true)}
              className="w-full py-4 px-6 bg-[#00005b] hover:bg-[#0c0c8b] text-white rounded-xl text-base font-bold transition-all duration-200 flex items-center justify-center gap-3 group cursor-pointer shadow-[0_10px_25px_-5px_rgba(0,0,91,0.45)] border border-indigo-500/10"
            >
              <Volume2 className="w-5 h-5 text-indigo-200 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
              <span className="tracking-wide">بزن بریم! 🚀</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export interface TourStep {
  targetId: string;
  title: string;
  content: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    targetId: "tour-pg-logo",
    title: "لوگو پارسا غائی",
    content: "برای رفتن به وبسایت سازنده روی این بخش کلیک کنید."
  },
  {
    targetId: "tour-sound-effects",
    title: "صداهای تعاملی",
    content: "از اینجا می‌توانید افکت‌های صوتی کلیک‌ها و ابزارها را فعال یا غیرفعال کنید."
  },
  {
    targetId: "tour-bg-music",
    title: "موسیقی پس‌زمینه",
    content: "موسیقی آرام‌بخش Lo-Fi را کنترل کنید که به تمرکز حین ارائه کمک می‌کند."
  },
  {
    targetId: "tour-auto-slide",
    title: "پخش خودکار",
    content: "امکان پخش زمان‌بندی‌شده و خودکار اسلایدها برای ارائه‌های بدون دخالت دست."
  },
  {
    targetId: "tour-summary",
    title: "یادداشت‌ها و خلاصه",
    content: "متن‌های کمکی و خلاصه مطالبی که باید حین ارائه به خاطر داشته باشید."
  },
  {
    targetId: "tour-help",
    title: "راهنما",
    content: "همیشه می‌توانید از این قسمت برای یادآوری امکانات نرم‌افزار استفاده کنید."
  },
  {
    targetId: "tour-prev-slide",
    title: "اسلاید قبلی",
    content: "جابجایی به اسلاید گذشته با قابلیت انیمیشن نرم."
  },
  {
    targetId: "tour-next-slide",
    title: "اسلاید بعدی",
    content: "همچنین می‌توانید از کلیدهای جهت‌دار کیبورد برای این کار استفاده کنید."
  },
  {
    targetId: "tour-whiteboard",
    title: "قلم وایت‌برد",
    content: "با این قلم مستقیماً روی اسلایدها خط بکشید و نکات را برجسته کنید."
  },
  {
    targetId: "tour-laser",
    title: "لیزر پوینتر",
    content: "موس را به یک نشانگر لیزری جذاب تبدیل می‌کند تا توجه مخاطبان را جلب کنید."
  },
  {
    targetId: "tour-slide-list",
    title: "لیست اسلایدها",
    content: "نقشه کاملی از ارائه‌ی شما در ستون کناری برای پرش سریع به هر بخش."
  },
  {
    targetId: "tour-search",
    title: "جستجو",
    content: "سرفصل یا محتوای موردنظر خود را اینجا جستجو کنید (مثلاً امکان‌سنجی)."
  },
  {
    targetId: "tour-progress",
    title: "نوار پیشرفت",
    content: "نمای کلی از اینکه چقدر از ارائه سپری شده است."
  }
];

export interface TourGuideProps {
  steps: TourStep[];
  onFinish: () => void;
}

export function TourGuide({ steps, onFinish }: TourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      const step = steps[currentStep];
      const target = document.getElementById(step.targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        setTimeout(() => {
          const newRect = target.getBoundingClientRect();
          setRect(newRect);
        }, 300); // Wait for scroll
      } else {
        setRect(null);
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [currentStep, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const current = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[9000] pointer-events-none" style={{ direction: "rtl" }}>
      {/* Transparent backdrop with SVG Mask Spotlight */}
      <svg onClick={handleNext} className="absolute inset-0 w-full h-full pointer-events-auto z-[9000] cursor-pointer">
        <defs>
          <mask id="tour-spotlight-mask">
            {/* White color renders dark fill shadow */}
            <rect width="100%" height="100%" fill="white" />
            {/* Black color cuts a clean spotlight window */}
            {rect && (
              <rect
                x={rect.left - 8}
                y={rect.top - 8}
                width={rect.width + 16}
                height={rect.height + 16}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(2, 6, 23, 0.75)" mask="url(#tour-spotlight-mask)" />
      </svg>
      
      {/* Spotlight Border Glow */}
      {rect && (
        <motion.div
          animate={{
            top: rect.top - 8,
            left: rect.left - 8,
            width: rect.width + 16,
            height: rect.height + 16,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute z-[9001] bg-transparent border-2 border-indigo-400 rounded-xl shadow-[0_0_15px_rgba(129,140,248,0.4)] pointer-events-none"
        />
      )}

      {/* Popover Card */}
      {rect && (
        <motion.div
          animate={{
            top: rect.top > window.innerHeight / 2 ? "auto" : rect.bottom + 16,
            bottom: rect.top > window.innerHeight / 2 ? window.innerHeight - rect.top + 16 : "auto",
            left: Math.max(16, Math.min(window.innerWidth - 336, rect.left + rect.width / 2 - 160)),
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute z-[9002] w-[320px] bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl p-5 pointer-events-auto"
        >
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
             <div className="flex items-center gap-2">
                 <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                    {currentStep + 1}
                 </div>
                 <h3 className="font-bold text-slate-100">{current.title}</h3>
             </div>
             <button onClick={onFinish} className="text-slate-400 hover:text-white p-1" title="رد کردن راهنما">
                <X className="w-4 h-4" />
             </button>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-6 font-sans">
            {current.content}
          </p>
          
          <div className="flex items-center justify-between pt-1">
             <button
               onClick={onFinish}
               className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
             >
               رد کردن
             </button>
             <div className="flex gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="p-1.5 rounded-lg border border-slate-700 text-slate-300 disabled:opacity-30 hover:bg-slate-800 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center gap-1"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      پایان
                    </>
                  ) : (
                    <>
                      بعدی
                      <ChevronLeft className="w-4 h-4 -mr-1" />
                    </>
                  )}
                </button>
             </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
