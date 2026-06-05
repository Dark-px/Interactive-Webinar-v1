import React, { useState } from "react";
import {
  Lightbulb,
  Cpu,
  TrendingUp,
  Settings,
  ArrowRightLeft,
  Users,
  Compass,
  Factory,
  BarChart3,
  Award,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Home,
  BookOpen,
  Wrench,
  ChevronDown,
  DollarSign,
  Handshake,
  FileSignature
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// 1. Cover Illustration: Glowing SVG Bulb & Gears
export function CoverIllustration() {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center">
      {/* Decorative pulse ring */}
      <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
      <div className="absolute inset-16 rounded-full bg-purple-500/15 blur-2xl animate-ping duration-[3000ms]" />

      <svg
        viewBox="0 0 200 200"
        className="w-72 h-72 sm:w-96 sm:h-96 relative z-10"
        id="cover-svg"
      >
        {/* Connection pathways */}
        <path
          d="M 50 150 C 50 100, 100 100, 100 80"
          fill="none"
          stroke="rgba(99, 102, 241, 0.4)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <path
          d="M 150 150 C 150 100, 100 100, 100 80"
          fill="none"
          stroke="rgba(168, 85, 247, 0.4)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <path
          d="M 100 150 L 100 80"
          fill="none"
          stroke="rgba(245, 158, 11, 0.4)"
          strokeWidth="2"
        />

        {/* Rotating Gear left */}
        <g className="origin-[55px_145px] animate-[spin_10s_linear_infinite] text-indigo-400">
          <circle cx="55" cy="145" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <rect
              key={angle}
              x="51"
              y="125"
              width="8"
              height="8"
              transform={`rotate(${angle} 55 145)`}
              fill="currentColor"
              rx="1.5"
            />
          ))}
        </g>

        {/* Counter-rotating Gear right */}
        <g className="origin-[145px_145px] animate-[spin_12s_linear_infinite_reverse] text-purple-400">
          <circle cx="145" cy="145" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
            <rect
              key={angle}
              x="141"
              y="120"
              width="8"
              height="8"
              transform={`rotate(${angle} 145 145)`}
              fill="currentColor"
              rx="1.5"
            />
          ))}
        </g>

        {/* Market node bottom */}
        <g transform="translate(100, 160)" className="text-amber-400">
          <circle cx="0" cy="0" r="10" fill="currentColor" className="opacity-20 animate-ping" />
          <circle cx="0" cy="0" r="6" fill="currentColor" />
          <text x="0" y="-12" textAnchor="middle" fontSize="8" className="fill-slate-400 font-sans font-medium">بازار</text>
        </g>

        {/* Glowing bulb centered top */}
        <g transform="translate(100, 70)" className="cursor-pointer group">
          {/* Bulb base glow */}
          <circle cx="0" cy="0" r="25" fill="rgba(245, 158, 11, 0.2)" className="blur-md animate-pulse" />
          
          {/* Bulb glass body */}
          <path
            d="M -15 -15 C -15 -30, 15 -30, 15 -15 C 15 -5, 8 5, 8 15 L -8 15 C -8 5, -15 -5, -15 -15 Z"
            fill="rgba(15, 23, 42, 0.8)"
            stroke="#f59e0b"
            strokeWidth="3"
          />
          {/* Filament */}
          <path
            d="M -6 5 L -3 -5 L 3 -5 L 6 5"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinecap="round"
            className="animate-pulse"
          />
          {/* Base */}
          <rect x="-8" y="15" width="16" height="5" fill="#94a3b8" rx="1" />
          <rect x="-5" y="20" width="10" height="3" fill="#64748b" rx="1" />
          <circle cx="0" cy="24" r="1.5" fill="#475569" />

          {/* Spark rays */}
          <line x1="0" y1="-32" x2="0" y2="-42" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="-22" y1="-22" x2="-29" y2="-29" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="22" y1="-22" x2="29" y2="-29" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="-30" y1="0" x2="-40" y2="0" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="30" y1="0" x2="40" y2="0" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

// 2. Process Flowchart Component: Interactive 10 steps
export function ProcessFlowchart() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    { id: 1, title: "ایده پردازی اولیه", subtitle: "شکل‌گیری تصور ذهنی", icon: Lightbulb, color: "text-amber-400 bg-amber-500/10 border-amber-500/30", details: "مرحله حس کردن یک نیاز مبرم یا چالش جدی در جامعه یا بازار و خلق اولین جرقه‌های نجات‌دهنده ذهنی." },
    { id: 2, title: "تثبیت مفهوم", subtitle: "فرم دادن به ایده", icon: Cpu, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30", details: "تبدیل جرقه ذهنی به یک کانسپت با ساختار مشخص، به طوری که قابل توصیف، نوشتن و مدل‌سازی تجاری اولیه باشد." },
    { id: 3, title: "پايلوت (Prototypes)", subtitle: "ساخت نمونه آزمایشی", icon: Settings, color: "text-purple-400 bg-purple-500/10 border-purple-500/30", details: "مدل‌سازی اولین محصول ملموس در تعداد انگشت‌شمار با ابزار ساده یا ماکت‌ها کارگاهی جهت ارزیابی ابعادی و فیزیکی." },
    { id: 4, title: "اعتبارسنجی عملی", subtitle: "تست عملکرد نمونه", icon: ArrowRightLeft, color: "text-pink-400 bg-pink-500/10 border-pink-500/30", details: "انجام آزمون‌های مکانیکی، فنی و رفتاری با نمونه پایلوت در برابر چالش‌های واقعی کاربر تا ایرادهای طراحی هویدا شده و مرتفع گردند." },
    { id: 5, title: "دانش فنی ساخت", subtitle: "مرجع فرآیند تولید", icon: BookOpen, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30", details: "فرموله‌کردن و ثبت دقیق روش ترکیب مواد، نقشه‌های قطعه‌بندی و مراحل گام‌به‌گام ساخت محصول (Know-how)." },
    { id: 6, title: "تشکیل شرکت", subtitle: "چهارچوب حقوقی و تیمی", icon: Users, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", details: "جمع‌کردن مهندسان و تامین‌کنندگان مالی تحت یک اساسنامه رسمی و ثبت برند صنفی جهت آغاز کسب‌وکار." },
    { id: 7, title: "طراحی نهایی و R&D", subtitle: "تحقیق و توسعه پیشرفته", icon: Compass, color: "text-teal-400 bg-teal-500/10 border-teal-500/30", details: "انجام تحقیقات پیشرفته روی متریال نوین، زیبایی‌شناسی، بسته‌بندی ایمن و بهینه‌سازی نهایی جهت خط تولید انبوه." },
    { id: 8, title: "تولید صنعتی", subtitle: "به‌کارگیری سریع ابزار", icon: Factory, color: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30", details: "آغاز ماشین‌کاری، قالب‌ریزی و دایرکردن سالن مونتاژ در حجم‌های بالا جهت پاسخ به سفارش‌های بازار." },
    { id: 9, title: "توسعه بازار", subtitle: "تبلیغات و توزیع وسیع", icon: BarChart3, color: "text-blue-400 bg-blue-500/10 border-blue-500/30", details: "تبلیغ برند در سایت‌ها و شبکه‌های اجتماعی، انعقاد قرارداد با ارگان‌ها یا عوامل توزیع و نفوذ به لایه‌های جدید بازار." },
    { id: 10, title: "ارزش افزوده اقتصادی", subtitle: "کسب ثروت پایدار", icon: Award, color: "text-amber-500 bg-amber-600/10 border-amber-600/30", details: "رسیدن به سود خالص مستمر اقتصادی و سرمایه‌گذاری بخشی از درآمد برای دور بعدی ایده‌پردازی و پیشرفت تکنولوژیک." }
  ];

  return (
    <div className="w-full space-y-3.5 max-w-4xl mx-auto font-sans">
      {/* Micro Info Guide badge */}
      <div className="text-center">
        <span className="text-[9.5px] sm:text-[10.5px] font-mono tracking-wider text-amber-450 bg-amber-500/10 px-3.5 py-0.5 rounded-full inline-flex items-center gap-1.5 border border-amber-500/20 shadow-sm">
          <span>⚡ نقشه راهنما تعاملی</span>
          <span className="opacity-90">• برای مطالعه جزئیات گام‌ها، روی هر کارت کلیک کنید</span>
        </span>
      </div>

      {/* 1. DESKTOP VIEW: Beautiful 2-row roadmap with Boustrophedon flow directions */}
      <div className="hidden md:flex flex-col gap-4 relative py-2.5 bg-slate-950/20 rounded-2xl border border-slate-900/60 p-3.5 select-none overflow-hidden">
        {/* Background Connector Lines */}
        {/* Row 1 Horizontal (Right to Left) */}
        <div className="absolute top-[23%] left-[10%] right-[10%] h-0.5 border-t border-dashed border-indigo-500/35 pointer-events-none z-0" />
        {/* Row 1 to Row 2 S-Curve vertical connector */}
        <div className="absolute top-[23%] bottom-[23%] left-[10%] w-0.5 border-l border-dashed border-indigo-500/35 pointer-events-none z-0" />
        {/* Row 2 Horizontal (Left to Right) */}
        <div className="absolute bottom-[23%] left-[10%] right-[10%] h-0.5 border-t border-dashed border-indigo-500/35 pointer-events-none z-0" />

        {/* ROW 1: Steps 1 to 5 (RTL flow: read Right to Left) */}
        <div className="grid grid-cols-5 gap-3 relative z-10">
          {steps.slice(0, 5).map((s) => {
            const Icon = s.icon;
            const isSelected = activeStep === s.id;
            return (
              <div key={s.id} className="relative">
                <button
                  id={`process-step-${s.id}`}
                  onClick={() => setActiveStep(isSelected ? null : s.id)}
                  className={`w-full flex flex-col justify-between p-1.5 rounded-lg border transition-all duration-350 text-center relative focus:outline-none min-h-[82px] ${
                    isSelected
                      ? "bg-slate-800 border-indigo-500 scale-[1.03] shadow-lg shadow-indigo-500/15 ring-2 ring-indigo-500/20 z-20"
                      : "bg-slate-900/80 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700 hover:scale-[1.01]"
                  }`}
                >
                  <div className="w-full flex justify-between items-center mb-1">
                    <span className={`w-3.5 h-3.5 rounded-full text-[7.5px] flex items-center justify-center font-bold leading-none border transition-colors ${
                      isSelected ? "bg-indigo-500 border-indigo-400 text-white" : "bg-slate-850 border-slate-800 text-slate-400"
                    }`}>
                      {s.id}
                    </span>
                    <div className={`w-5.5 h-5.5 rounded-md flex items-center justify-center border shrink-0 ${s.color}`}>
                      <Icon className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="text-[7.5px] text-indigo-400 font-mono font-bold mb-0.5">گام {s.id}</div>
                  <h4 className="text-[10px] font-extrabold text-slate-200 line-clamp-1">{s.title}</h4>
                  <p className="text-[7.5px] text-slate-450 line-clamp-1 mt-0.5">{s.subtitle}</p>
                </button>
              </div>
            );
          })}
        </div>

        {/* ROW 2: Steps 6 to 10 (Reversed in DOM so that Step 6 starts on the far left, right under Step 5, flowing left-to-right to Step 10) */}
        <div className="grid grid-cols-5 gap-3 relative z-10">
          {steps.slice(5, 10).reverse().map((s) => {
            const Icon = s.icon;
            const isSelected = activeStep === s.id;
            return (
              <div key={s.id} className="relative">
                <button
                  id={`process-step-${s.id}`}
                  onClick={() => setActiveStep(isSelected ? null : s.id)}
                  className={`w-full flex flex-col justify-between p-1.5 rounded-lg border transition-all duration-350 text-center relative focus:outline-none min-h-[82px] ${
                    isSelected
                      ? "bg-slate-800 border-indigo-500 scale-[1.03] shadow-lg shadow-indigo-500/15 ring-2 ring-indigo-500/20 z-20"
                      : "bg-slate-900/80 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700 hover:scale-[1.01]"
                  }`}
                >
                  <div className="w-full flex justify-between items-center mb-1">
                    <span className={`w-3.5 h-3.5 rounded-full text-[7.5px] flex items-center justify-center font-bold leading-none border transition-colors ${
                      isSelected ? "bg-indigo-500 border-indigo-400 text-white" : "bg-slate-850 border-slate-800 text-slate-400"
                    }`}>
                      {s.id}
                    </span>
                    <div className={`w-5.5 h-5.5 rounded-md flex items-center justify-center border shrink-0 ${s.color}`}>
                      <Icon className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="text-[7.5px] text-indigo-400 font-mono font-bold mb-0.5">گام {s.id}</div>
                  <h4 className="text-[10px] font-extrabold text-slate-200 line-clamp-1">{s.title}</h4>
                  <p className="text-[7.5px] text-slate-450 line-clamp-1 mt-0.5">{s.subtitle}</p>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. MOBILE VIEW: Stacked elegant list with indicators instead of massive horizontal stretch */}
      <div className="flex flex-col gap-1.5 md:hidden max-h-[260px] overflow-y-auto pr-1 border border-slate-900/80 rounded-xl bg-slate-950/20 p-2 scrollbar-thin">
        {steps.map((s) => {
          const Icon = s.icon;
          const isSelected = activeStep === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveStep(isSelected ? null : s.id)}
              className={`w-full flex items-center justify-between p-2 rounded-xl border text-right transition-all duration-300 relative focus:outline-none ${
                isSelected
                  ? "bg-slate-800 border-indigo-500 shadow-md scale-[1.01]"
                  : "bg-slate-900/60 border-slate-850/80 hover:bg-slate-850"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center border shrink-0 ${s.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[8.5px] text-slate-500 font-mono">گام {s.id} از ۱۰</div>
                  <h4 className="text-[11px] font-bold text-slate-200">{s.title}</h4>
                  <p className="text-[8.5px] text-slate-400 truncate max-w-[190px]">{s.subtitle}</p>
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isSelected ? "rotate-180 text-indigo-400" : "-rotate-90"}`} />
            </button>
          );
        })}
      </div>

      {/* Details Box */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep ?? "fallback"}
          initial={{ opacity: 0, scale: 0.98, y: 3 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -3 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-900/40 border border-slate-800/80 p-3 rounded-xl min-h-[68px] flex items-center justify-center text-center"
        >
          {activeStep !== null ? (
            <div className="space-y-1 w-full">
              <div className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <h4 className="text-xs font-bold text-indigo-300">
                  شناسنامه گام {activeStep}: {steps[activeStep - 1].title} ({steps[activeStep - 1].subtitle})
                </h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed max-w-3xl mx-auto font-sans font-medium">
                {steps[activeStep - 1].details}
              </p>
            </div>
          ) : (
            <p className="text-[11px] text-slate-450 italic font-sans font-medium">
              روی هر یک از ۱۰ گام فرآیند بالا کلیک کنید تا شناسنامه و تشریح ماموریت آن را مطالعه کنید.
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// 3. WheelEvolution Component: Animated timeline of development
export function WheelEvolution() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const eras = [
    {
      id: 0,
      title: "دوران باستان",
      subtitle: "نیاز و ترابری سنتی با جانداران",
      desc: "در ابتدا انسان بارهای سنگین را خودش یا به سختی به کمک حیوانات منتقل می‌کرد. مسیرها محدود، زمان طولانی و راندمان کاری ناامیدکننده بود. احساس نیاز شدید به یک مکانیزم تسهیل‌کننده چاره‌ساز، جرقه خلق چرخ را روشن نمود.",
      tech: "بدون چرخ (حیوانات و کنده درخت)",
      illustration: (
        <div className="flex flex-col items-center justify-center space-y-2 bg-slate-950/60 rounded-xl p-3 border border-slate-900/80 aspect-video w-full h-full min-h-[115px]">
          <span className="text-3xl">🪵</span>
          <p className="text-[10px] text-slate-400 text-center font-sans">کنده درخت و تخته‌های سنگین جهت کشیدن بار فاقد اصطکاک چرخش مداوم</p>
        </div>
      )
    },
    {
      id: 1,
      title: "قرون باستان و میانی",
      subtitle: "ساخت چرخ‌های سنگینی از سنگ و چوب",
      desc: "اولین چرخ‌های گاری‌ها از چوب‌های بریده‌شده دایره‌ای یا سنگ تراشیده پدید آمدند. به علت صلب بودن جنس سنگ و چوب، در برخورد با کوچکترین چاله یا دست‌انداز خرد می‌شدند و تمام لرزش‌ها به کابین منتقل شده و سرعت ناچیز بود.",
      tech: "چرخ سنگی بی‌کشش و سنگین",
      illustration: (
        <div className="flex flex-col items-center justify-center space-y-2 bg-slate-950/60 rounded-xl p-3 border border-slate-900/80 aspect-video w-full h-full min-h-[115px]">
          <div className="relative w-12 h-12 rounded-full border-4 border-slate-600 border-dashed animate-[spin_15s_linear_infinite] flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-500" />
            <div className="absolute w-9 h-1 bg-slate-600" />
            <div className="absolute h-9 w-1 bg-slate-600" />
          </div>
          <p className="text-[10px] text-slate-400 text-center font-sans">چرخ سنگی ناهموار با چالش ضربه‌پذیری بالا و مقاومت سایشی کم</p>
        </div>
      )
    },
    {
      id: 2,
      title: "دوران مدرن صنعتی",
      subtitle: "تایر بادی فلزی و لاستیکی پیشرفته",
      desc: "با تکامل متالورژی و مهندسی پلیمر، امروزه چرخ‌ها از آلیاژ آلومینیوم (رینگ مستحکم) و لاستیک‌های چندلایه مجهز به سیم‌های فولادی و هوای فشرده (تایر) ساخته می‌شوند. سرعت، چسبندگی فوق‌العاده جاده، ترمزگیری ایمن و خنثی کردن ضربات جاده دستاورد این توسعه باشکوه است.",
      tech: "لاستیک و آلیاژ پیشرفته تایر",
      illustration: (
        <div className="flex flex-col items-center justify-center space-y-2 bg-slate-950/60 rounded-xl p-3 border border-slate-900/80 aspect-video w-full h-full min-h-[115px]">
          <div className="relative w-12 h-12 rounded-full border-[6px] border-slate-800 bg-slate-900 animate-[spin_6s_linear_infinite] flex items-center justify-center ring-4 ring-indigo-500/20">
            {/* Spokes */}
            <div className="absolute w-9 h-0.5 bg-indigo-500/50" />
            <div className="absolute h-9 w-0.5 bg-indigo-500/50" />
            <div className="absolute w-9 h-0.5 rotate-45 bg-indigo-500/50" />
            <div className={`absolute w-9 h-0.5 -rotate-45 bg-indigo-500/50`} />
            <div className="w-3 h-3 rounded-full bg-slate-700 border-2 border-indigo-400 z-10" />
          </div>
          <p className="text-[10px] text-slate-400 text-center font-sans">رینگ آلیاژی با تایر منعطف بادی - حداکثر مهار ضربه جاده حاصل توسعه مستمر</p>
        </div>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
      {/* Sidebar Tabs */}
      <div className="md:col-span-4 flex flex-col gap-1.5">
        {eras.map((era) => (
          <button
            key={era.id}
            onClick={() => setActiveTab(era.id)}
            className={`p-2.5 rounded-xl border text-right transition-all duration-300 ${
              activeTab === era.id
                ? "bg-indigo-600/15 border-indigo-500 text-indigo-200 shadow-md"
                : "bg-slate-900/40 border-slate-800/80 text-slate-400 hover:bg-slate-850 hover:border-slate-700"
            }`}
          >
            <div className="text-[9px] text-indigo-400/80 font-mono mb-0.5">گام {era.id + 1} تکامل</div>
            <h4 className="text-[11px] font-bold">{era.title}</h4>
            <p className="text-[9px] opacity-70 mt-0.5 truncate">{era.tech}</p>
          </button>
        ))}
      </div>

      {/* Detail Area */}
      <div className="md:col-span-8 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded border border-indigo-500/20 font-mono">
              پودمان پنجم: تعریف توسعه عینی
            </span>
            <span className="text-[11px] text-slate-400 font-bold">{eras[activeTab].title}</span>
          </div>

          <h3 className="text-xs font-bold text-slate-100">{eras[activeTab].subtitle}</h3>
          <p className="text-[11px] text-slate-350 leading-relaxed font-sans">{eras[activeTab].desc}</p>
        </div>

        <div className="mt-2 text-right pt-2 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-7 space-y-0.5">
            <div className="text-[9px] text-slate-500 font-mono">فناوری شاخص دوره:</div>
            <div className="text-[11px] font-bold text-amber-400">{eras[activeTab].tech}</div>
            <p className="text-[9px] text-slate-400">توسعه به معنای رشد تدریجی جهت راحت‌تر شدن زندگی بشر است.</p>
          </div>
          <div className="sm:col-span-5 h-full flex items-center justify-center">
            {eras[activeTab].illustration}
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. FiveWhysLadder: 5 steps of vertical questioning with tree diagram
export function FiveWhysLadder() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const stairs = [
    { num: 1, why: "چرا خودرو روشن نمی‌شود و استارت نمی‌خورد؟", answer: "چون شارژ باتری آن کاملاً تمام شده و خالی است." },
    { num: 2, why: "چرا شارژ باتری خالی شده است؟", answer: "چون دینام به درستی کار نکرده و باتری را شارژ نکرده است." },
    { num: 3, why: "چرا دینام باتری را شارژ نکرده است؟", answer: "چون تسمه دینام خودرو به دلیل فرسودگی ناگهان پاره شده است." },
    { num: 4, why: "چرا تسمه دینام ناگهان پاره شده است؟", answer: "چون فرسوده بوده و عمر مفید آن به پایان رسیده بود اما به موقع تعویض نشده بود." },
    { num: 5, why: "چرا تسمه به موقع تعویض نشده بود؟", answer: "چون خودرو طبق برنامه منظم و استاندارد دفترچه راهنما به صورت دوره‌ای سرویس و چکاپ نشده است (علت ریشه‌ای)." }
  ];

  return (
    <div className="space-y-3">
      <div className="bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-xl text-center">
        <span className="text-[11px] sm:text-xs font-bold text-red-400">مسئله هدف: خودرو استارت نمی‌خورد و متوقف مانده است</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* Interactive Ladder steps */}
        <div className="md:col-span-7 flex flex-col gap-2 relative">
          {stairs.map((step, idx) => {
            const isSelected = activeStep === idx;
            return (
              <button
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={`relative flex items-start gap-3 p-2 rounded-xl border text-right transition-all duration-300 z-10 ${
                  isSelected
                    ? "bg-slate-800/90 border-indigo-500 scale-[1.01] shadow-md shadow-indigo-500/5"
                    : "bg-slate-900/40 border-slate-800/85 hover:bg-slate-850 hover:border-slate-700"
                }`}
              >
                {/* Step Circle Pin */}
                <div className="flex flex-col items-center shrink-0 relative select-none">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-[11px] font-mono font-bold font-sans transition-all duration-300 relative z-10 ${
                    isSelected
                      ? "bg-indigo-500 border-indigo-400 text-white shadow-sm"
                      : "bg-slate-850 border-slate-750 text-slate-400"
                  }`}>
                    {step.num}
                  </div>
                </div>

                {/* Fully height-responsive connection line between step pins */}
                {idx < stairs.length - 1 && (
                  <div className="absolute right-5 top-8 bottom-[-10px] w-0.5 bg-indigo-500/25 pointer-events-none z-0" />
                )}

                <div className="space-y-1 flex-1">
                  <div className="text-xs font-bold text-slate-200 leading-snug">{step.why}</div>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-[11px] text-indigo-300 font-medium leading-relaxed font-sans"
                    >
                      💡 پاسخ: {step.answer}
                    </motion.div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
 
        {/* Tree Graph visual of root cause - Centered flex content to keep elements cohesive on stretch */}
        <div className="md:col-span-5 bg-gradient-to-br from-slate-900/60 to-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-center items-center gap-3.5 md:min-h-[320px] min-h-[220px] w-full">
          <div className="text-center space-y-1">
            <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-300 rounded border border-emerald-500/20 font-mono tracking-wider">ریشه یابی نهایی</span>
            <h4 className="text-[11.5px] font-bold text-slate-200">کشف ریشه واقعی برای تعلیق خطا</h4>
          </div>
 
          {/* Root vs Symptoms visual */}
          <div className="relative py-2 flex flex-col items-center justify-center w-full">
            {/* Symptoms area */}
            <div className="bg-red-500/10 border border-red-500/20 px-3.5 py-1.5 rounded-[10px] text-[10px] text-red-300 text-center w-full max-w-[190px] z-10 font-bold">
              معلول ظاهری: خرابی باتری
            </div>
            
            {/* Connect line */}
            <div className="w-px h-7 border-r border-dashed border-indigo-500/35 my-0.5" />
 
            {/* Root cause area */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-center w-full max-w-[218px] z-10 ring-4 ring-emerald-500/5 animate-pulse">
              <span className="text-[11px] font-bold text-emerald-400">علت ریشه‌ای (Root Cause)</span>
              <p className="text-[10px] text-slate-300 mt-1 font-sans leading-relaxed">عدم تقید به دفترچه راهنما و چکاپ دوره‌‌ای سرویس ماشین</p>
            </div>
          </div>
 
          <blockquote className="border-r-2 border-amber-500/40 pr-2.5 text-[9.5px] text-slate-400 leading-relaxed italic text-right w-full font-sans">
            "بدون تکنیک پنج چرا، بارها با تعویض غیرضروری باتری متحمل ضرر مالی می‌شدیم در حالی که تسمه همچنان فرسوده رها می‌شد."
          </blockquote>
        </div>
      </div>
    </div>
  );
}

// 5. FourPsGrid: Interactive 4P layout with flip or hover logic
export function FourPsGrid() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const ps = [
    { id: 1, name: "نوع محصول (Product)", title: "جذابیت و رفع نیاز واقعی", desc: "کالا یا خدمت شما باید بر اساس ایده اثبات‌شده پایلوت، رنج و کمبود واقعی مشتری را برطرف سازد و در ظاهر، بسته‌بندی، کارایی و اصالت استاندارد باشد." },
    { id: 2, name: "قیمت‌گذاری (Price)", title: "تناسب با کشش پرداخت", desc: "قیمت نهایی باید هم حاشیه سود عادلانه و بقای کارگاه را تایید کند و هم تناسب رقابتی با نمونه‌های رقیب در بازار داشته باشد." },
    { id: 3, name: "مکان عرضه (Place)", title: "سهولت در دسترسی مشتری", desc: "انتخاب هوشمندانه کانال فروش (فروشگاه فیزیکی در بازار محلی، پلتفرم مجازی، پیج شاپ یا دیجی‌کالا) به طوری که مشتری برای تحویل سختی نکشد." },
    { id: 4, name: "ترویج و تبلیغ (Promotion)", title: "آگاهی‌بخشی گسترده مخاطب", desc: "ایجاد ارتباط عاطفی و حرفه‌ای با خریداران با استفاده از تخفیف‌های گشایش کار، تیزرهای ویدیویی دانش‌آموزی، بنرهای مجازی شبکه‌ها و بازاریابی تلفنی محلی." }
  ];

  return (
    <div className="space-y-3">
      <div className="text-center font-sans">
        <p className="text-[11px] text-slate-400">آمیخته بازاریابی یا آیکون <strong className="text-indigo-400">4P</strong> اساسی‌ترین ماتریکس امکان‌سنجی موفق بازار است.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {ps.map((p, index) => {
          const isSelected = hoveredCard === index;
          return (
            <div
              key={p.id}
              className="relative p-3 rounded-xl border bg-slate-900/50 border-slate-800/80 overflow-hidden min-h-[120px] flex flex-col justify-between transition-all duration-300 hover:border-indigo-500/40 hover:bg-slate-850/70"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              id={`4p-card-${index}`}
            >
              {/* Corner badge index */}
              <div className="absolute top-1.5 left-1.5 text-[9px] text-indigo-400 font-mono font-bold bg-indigo-500/10 px-1 py-0.5 rounded">
                P{p.id}
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-200 mt-1">{p.name}</h4>
                <div className="h-0.5 w-8 bg-indigo-500/30 my-1" />
                <h5 className="text-[10.5px] font-bold text-amber-400">{p.title}</h5>
                <p className="text-[10.5px] sm:text-[11px] text-slate-350 leading-relaxed font-sans mt-0.5">
                  {p.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 6. CommercializationCompare: Cards presenting 4 main commercialization options
export function CommercializationCompare() {
  const [activeItem, setActiveItem] = useState<string>("direct");

  const options = [
    {
      id: "direct",
      title: "تولید و بازاریابی مستقل",
      icon: Factory,
      accent: "text-amber-400 border-amber-500/20",
      risk: "بسیار بالا (۱۰۰٪)",
      reward: "سود دهی حداکثری بی‌شریک",
      bullets: [
        "سرمایه‌گذاری سنگین از جیب مالک روی ماشین‌آلات.",
        "کنترل مطلق روی برندینگ، توزیع و کیفیت نهایی.",
        "تحمل تمام شکست‌های مالی و مسئولیت حقوقی کارگاه با مخترع است."
      ]
    },
    {
      id: "joint",
      title: "سرمایه‌گذاری مشترک (Joint Venture)",
      icon: Handshake,
      accent: "text-indigo-400 border-indigo-500/20",
      risk: "متوسط و توزیع‌شده مابین دو طرف",
      reward: "رشد پرشتاب ملی و سهم از بازار",
      bullets: [
        "تقسیم ریسک‌ها، هزینه‌ها و استخدام پرسنل با شریک باسابقه صنعت.",
        "بهره‌گیری از زنجیره توزیع و کانال‌های فروش تثبیت‌شده شریک مالی.",
        "گاهی چالش در تصمیم‌گیری‌ها و تقسیم درصدهای سود پدید می‌آید."
      ]
    },
    {
      id: "license",
      title: "اعطای لیسانس (امتیاز ساخت)",
      icon: FileSignature,
      accent: "text-cyan-400 border-cyan-500/20",
      risk: "بسیار پایین",
      reward: "دریافت درصد از فروش دایمی کالا (امتیاز)",
      bullets: [
        "مخترع به هیچ‌وجه درگیر تولید صنعتی کارخانه‌ای، اعتصاب کارگری و تامین متریال نمی‌شود.",
        "فروش حقوق به چندین شرکت مجزا منطقه‌‌ای امکان‌پذیر است.",
        "سود نهایی بابت هر تایر کمتر از تولید مستقیم است، اما کاملاً تضمین‌شده می‌باشد."
      ]
    },
    {
      id: "sale",
      title: "واگذاری کامل حقوق پتنت",
      icon: DollarSign,
      accent: "text-emerald-400 border-emerald-500/20",
      risk: "صفر مطلق",
      reward: "پول نقد کلان، فوری و یک‌جا",
      bullets: [
        "انتقال صد درصدی مالکیت مادی و معنوی اختراع به شرکت خریدار.",
        "رهایی دائمی از دغدغه‌های تجاری در ازای کسب نقدینگی در یک روز.",
        "دیگر منافع سودهای هنگفت در سال‌های آینده شرکت تعلقی به مخترع نخواهد داشت."
      ]
    }
  ];

  const current = options.find((o) => o.id === activeItem) || options[0];
  const CurrentIcon = current.icon;

  return (
    <div className="space-y-3">
      <div className="text-center font-sans mb-1.5">
        <span className="text-[11px] text-slate-400">
          برای سنجش تفاوت‌ها، ریسک‌ها و درصد سود هر روش تجاری‌سازی روی دکمه‌های زیر ضربه بزنید:
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {options.map((o) => {
          const isSelected = activeItem === o.id;
          return (
            <button
              key={o.id}
              onClick={() => setActiveItem(o.id)}
              className={`p-2.5 rounded-xl border text-center font-sans text-[11px] font-bold transition-all duration-300 ${
                isSelected
                  ? "bg-slate-800 border-indigo-500 text-indigo-300 scale-102"
                  : "bg-slate-900/50 border-slate-850 text-slate-450 hover:bg-slate-850 hover:text-slate-200"
              }`}
            >
              <h5 className="truncate leading-none py-1">{o.title}</h5>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 h-auto border-b border-slate-800/60 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center">
                <CurrentIcon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">{current.title}</h4>
                <p className="text-[10px] text-slate-450">بررسی ویژگی‌های تجاری‌سازی پودمان پنجم</p>
              </div>
            </div>

            <div className="flex gap-2 self-stretch sm:self-auto justify-between sm:justify-start">
              <div className="px-2.5 py-1 rounded bg-red-500/10 border border-red-550/10 text-center min-w-[100px]">
                <div className="text-[7.5px] text-slate-400 leading-none">ریسک اقتصادی</div>
                <div className="text-[10px] font-bold text-red-400 mt-1">{current.risk}</div>
              </div>
              <div className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-550/10 text-center min-w-[100px]">
                <div className="text-[7.5px] text-slate-400 leading-none">پاداش و عایدی مالکیتی</div>
                <div className="text-[10px] font-bold text-emerald-400 mt-1">{current.reward}</div>
              </div>
            </div>
          </div>

          <div className="mt-2.5">
            <h5 className="text-[10.5px] font-bold text-amber-400 mb-1.5">ابعاد و پیامد عملی این رویکرد:</h5>
            <ul className="space-y-1 list-none pl-0">
              {current.bullets.map((b, i) => (
                <li key={i} className="text-[11px] text-slate-300 leading-relaxed font-sans flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
