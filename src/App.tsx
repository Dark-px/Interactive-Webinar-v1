import React, { useState, useEffect, useRef } from "react";
import { slidesData } from "./slidesData";
import { Slide, SlideType } from "./types";
import {
  ProcessFlowchart,
  WheelEvolution,
  FiveWhysLadder,
  FourPsGrid,
  CommercializationCompare,
  CoverIllustration
} from "./components/InteractiveDiagrams";
import {
  ChevronLeft,
  ChevronRight,
  Tv,
  Monitor,
  Search,
  PenTool,
  Trash2,
  Maximize2,
  Minimize2,
  BookOpen,
  Clock,
  Settings,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  RotateCcw,
  Volume2,
  VolumeX,
  FileText,
  X,
  HelpCircle,
  Play,
  Pause,
  Printer,
  ChevronDown,
  Home,
  Wrench,
  Music,
  ExternalLink,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StartupOverlay, TourGuide, TOUR_STEPS, safeStorage } from "./components/Onboarding";
import { decrypt } from "./cryptoUtils";
import { PresenterPasswordModal } from "./components/PresenterPasswordModal";
import { TourCompletionModal } from "./components/TourCompletionModal";

class LofiAmbientSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: any = null;
  private mainGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private delay: DelayNode | null = null;
  private delayGain: GainNode | null = null;
  private step = 0;
  private volumeVal = 0.18; // Default gain level
  private noiseSource: AudioBufferSourceNode | null = null;

  // A gorgeous retro-futuristic chord progression in G Minor / Bb Major (Crystalline Space Ambient)
  private chords = [
    // G minor 7 (Gm7) - Deep space mystery
    { root: 49.00, pad: [146.83, 174.61, 220.00, 261.63, 293.66] }, // G3, D4, F4, A4, C5, D5
    // Eb Major 7 (Ebmaj7) - Hopeful discovery
    { root: 38.89, pad: [116.54, 155.56, 196.00, 233.08, 261.63] }, // Eb3, Bb3, Eb4, G4, Bb4, C5
    // Bb Major 9 (Bbmaj9) - Cosmic expansion
    { root: 58.27, pad: [116.54, 146.83, 174.61, 233.08, 293.66] }, // Bb3, D4, F4, Bb4, D5, F5
    // F Major 6/9 (F6/9) - Futuristic resolve
    { root: 43.65, pad: [130.81, 174.61, 220.00, 293.66, 349.23] }  // F3, C4, F4, A4, D5, F5
  ];

  private startHiss() {
    if (!this.ctx || !this.mainGain) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2.0; // 2 seconds of noise
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      // Generate soothing focus-conducive background noise with analog vinyl tape hum
      for (let i = 0; i < bufferSize; i++) {
        let noise = Math.random() * 2 - 1;
        // Warm brown filter simulation in code for comfort
        if (i > 0) {
          noise = (data[i - 1] * 0.94) + (noise * 0.06);
        }
        // Occasional light analog vinyl pop/crackle for relaxing focus texture
        if (Math.random() > 0.9998) {
          noise += (Math.random() > 0.5 ? 0.25 : -0.25);
        }
        data[i] = noise;
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      // Deep sea breeze / warm analog hum frequencies (helps with concentration)
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(260, this.ctx.currentTime);
      noiseFilter.Q.setValueAtTime(0.6, this.ctx.currentTime);

      const noiseGain = this.ctx.createGain();
      // Keep tape noise extremely subtle and relaxing in the background
      noiseGain.gain.setValueAtTime(0.045, this.ctx.currentTime);

      source.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.mainGain);

      source.start(0);
      this.noiseSource = source;
    } catch (e) {
      console.warn("Concentration noise failed to start:", e);
    }
  }

  start(initialVolume?: number) {
    if (this.isPlaying) return;
    if (initialVolume !== undefined) {
      this.volumeVal = initialVolume;
    }
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      this.mainGain = this.ctx.createGain();
      this.mainGain.gain.setValueAtTime(this.volumeVal, this.ctx.currentTime);

      // Deep analog ladder-style lowpass filter to remove harsh frequencies
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.setValueAtTime(650, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(0.7, this.ctx.currentTime);

      // Stereo Space Delay for that wide galactic field
      this.delay = this.ctx.createDelay(2.0);
      this.delay.delayTime.setValueAtTime(0.6, this.ctx.currentTime);
      
      this.delayGain = this.ctx.createGain();
      this.delayGain.gain.setValueAtTime(0.40, this.ctx.currentTime); // high feedback space echo

      // Feedback loop
      this.delay.connect(this.delayGain);
      this.delayGain.connect(this.delay);

      // Routing: Synth nodes -> mainGain -> Delay -> Filter -> Output
      this.mainGain.connect(this.filter);
      this.mainGain.connect(this.delay);
      this.delayGain.connect(this.filter);

      this.filter.connect(this.ctx.destination);
      this.isPlaying = true;

      // Start focus analogue rustle
      this.startHiss();

      const playStep = () => {
        if (!this.isPlaying || !this.ctx) return;

        const currentSec = this.ctx.currentTime;
        const currentChordIndex = Math.floor(this.step / 16) % this.chords.length;
        const currentChord = this.chords[currentChordIndex];

        // 1. Slow-sweep filter cutoff using a rhythmic LFO calculation (improves brainwave synchronization)
        const lfoCycle = Math.sin(this.step * 0.03) * 60 + 720;
        this.filter?.frequency.setValueAtTime(lfoCycle, currentSec);

        // 2. Play Deep Sub-Bass Drone on the start of each chord (every 16 steps)
        if (this.step % 16 === 0) {
          const subOsc = this.ctx.createOscillator();
          const subGain = this.ctx.createGain();

          subOsc.type = "sine";
          subOsc.frequency.setValueAtTime(currentChord.root, currentSec);

          subGain.gain.setValueAtTime(0.0001, currentSec);
          subGain.gain.linearRampToValueAtTime(0.035, currentSec + 2.5);
          subGain.gain.exponentialRampToValueAtTime(0.0001, currentSec + 12.0);

          subOsc.connect(subGain);
          subGain.connect(this.mainGain!);

          subOsc.start(currentSec);
          subOsc.stop(currentSec + 12.0);
        }

        // 3. Play Lush Warm Ambient Pads (fade in and out to create continuous rich harmony with overlaps)
        if (this.step % 8 === 0) {
          currentChord.pad.forEach((freq, idx) => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const oscGain = this.ctx.createGain();

            osc.type = idx % 2 === 0 ? "triangle" : "sine";
            // Detune to simulate spacious analogue chorus drift
            const detuneOffset = (idx - 2) * 4;
            osc.frequency.setValueAtTime(freq, currentSec);
            osc.detune.setValueAtTime(detuneOffset, currentSec);

            oscGain.gain.setValueAtTime(0.0001, currentSec);
            oscGain.gain.linearRampToValueAtTime(0.018, currentSec + 3.0 + idx * 0.2); // gentler, longer swell for consistency
            oscGain.gain.exponentialRampToValueAtTime(0.0005, currentSec + 11.5); // long decay to blend and overlay with next chords

            osc.connect(oscGain);
            oscGain.connect(this.mainGain!);

            osc.start(currentSec);
            osc.stop(currentSec + 11.5);
          });
        }

        // 4. Futuristic Pluck Arps (Crystalline stardust pings for attention focus)
        const isArpStep = (this.step % 4 === 2) || (this.step % 4 === 0 && Math.random() > 0.4);
        if (isArpStep) {
          const padNotes = currentChord.pad;
          const randomNoteBase = padNotes[Math.floor(Math.random() * (padNotes.length - 2)) + 2];
          const octavedFreq = randomNoteBase * 2.0; // sparkling high pitches

          const pluckOsc = this.ctx.createOscillator();
          const pluckGain = this.ctx.createGain();

          pluckOsc.type = "sine";
          pluckOsc.frequency.setValueAtTime(octavedFreq, currentSec);

          pluckGain.gain.setValueAtTime(0.0001, currentSec);
          pluckGain.gain.linearRampToValueAtTime(0.040, currentSec + 0.05);
          pluckGain.gain.exponentialRampToValueAtTime(0.0001, currentSec + 1.8);

          pluckOsc.connect(pluckGain);
          pluckGain.connect(this.mainGain!);

          pluckOsc.start(currentSec);
          pluckOsc.stop(currentSec + 1.8);
        }

        // 5. Cosmic Soundscape FX: a very light, sweeping high-resonance pulse to represent technology
        if (this.step % 16 === 12 && Math.random() > 0.5) {
          const fxOsc = this.ctx.createOscillator();
          const fxGain = this.ctx.createGain();

          fxOsc.type = "triangle";
          fxOsc.frequency.setValueAtTime(100, currentSec);
          fxOsc.frequency.exponentialRampToValueAtTime(800, currentSec + 1.2);

          fxGain.gain.setValueAtTime(0.0001, currentSec);
          fxGain.gain.linearRampToValueAtTime(0.004, currentSec + 0.6);
          fxGain.gain.exponentialRampToValueAtTime(0.0001, currentSec + 1.6);

          fxOsc.connect(fxGain);
          fxGain.connect(this.mainGain!);

          fxOsc.start(currentSec);
          fxOsc.stop(currentSec + 1.6);
        }

        this.step++;
      };

      playStep();
      this.intervalId = setInterval(playStep, 850);
    } catch (e) {
      console.warn("AudioContext init blocked or unsupported:", e);
    }
  }

  setVolume(volume: number) {
    this.volumeVal = volume;
    if (this.mainGain && this.ctx) {
      try {
        this.mainGain.gain.setValueAtTime(this.mainGain.gain.value, this.ctx.currentTime);
        this.mainGain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.15);
      } catch (e) {}
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.noiseSource) {
      try {
        this.noiseSource.stop();
      } catch (e) {}
      this.noiseSource = null;
    }
    try {
      if (this.ctx) {
        this.ctx.close();
        this.ctx = null;
      }
    } catch (e) {}
  }
}

const isInteractiveSlide = (type?: string) => {
  return [
    "process-diagram",
    "development-concept",
    "idea-sources",
    "brainstorm-prohibitions",
    "five-whys-example",
    "market-feasibility",
    "commercialization-paths"
  ].includes(type || "");
};

export default function App() {
  // Loading state variables
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadingText, setLoadingText] = useState<string>("در حال راه‌اندازی شبیه‌ساز ارائه...");

  // Beautiful progressive asset preloader
  useEffect(() => {
    let active = true;
    let progressVal = 0;
    
    // Explicitly check for professional Persian typography
    const fontPromise = document.fonts ? document.fonts.ready : Promise.resolve();
    
    const startPreloadSequence = async () => {
      const milestones = [
        { upTo: 22, text: "در حال پیکربندی هسته سیستم ارائه کلاسی..." },
        { upTo: 48, text: "بارگذاری فونت‌های فارسی استاندارد (Vazirmatn و Noto)..." },
        { upTo: 73, text: "آماده‌سازی لایه‌های بصری تعاملی و نمودارهای برداری..." },
        { upTo: 92, text: "راه‌اندازی موتور موسیقی زمینه Lo-Fi و فرکانس تمرکز آلفا..." },
        { upTo: 100, text: "تنظیم تراز راست‌چین و نهایی‌سازی اسلایدهای پودمان پنجم..." }
      ];
      
      try {
        await fontPromise;
      } catch (err) {
        console.warn("Fonts check bypassed or timeout:", err);
      }
      
      // Artificial delay is added for smooth premium feel, and real loading state is verified
      for (let i = 0; i < milestones.length; i++) {
        const stage = milestones[i];
        if (!active) return;
        setLoadingText(stage.text);
        
        while (progressVal < stage.upTo) {
          const stepSpeed = Math.random() * 15 + 6;
          await new Promise((r) => setTimeout(r, stepSpeed));
          if (!active) return;
          progressVal += 1;
          setLoadingProgress(progressVal);
        }
        await new Promise((r) => setTimeout(r, 180));
      }
      
      if (active) {
        setLoadingProgress(100);
        await new Promise((r) => setTimeout(r, 450));
        setLoading(false);
      }
    };
    
    startPreloadSequence();
    
    return () => {
      active = false;
    };
  }, []);

  // Current slide index (0-indexed, so 0 to 20)
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // Navigation & layout settings
  const [layoutMode, setLayoutMode] = useState<"standard" | "presenter">("standard");
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [isPresenterUnlocked, setIsPresenterUnlocked] = useState<boolean>(false);
  const [presenterPassword, setPresenterPassword] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Presentation stopwatch state (Presenter mode)
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(true);
  
  // Interactive Tools state
  const [laserPointerActive, setLaserPointerActive] = useState<boolean>(false);
  const [laserPos, setLaserPos] = useState({ x: 0, y: 0 });
  const [drawingActive, setDrawingActive] = useState<boolean>(false);
  const [feedbackSound, setFeedbackSound] = useState<boolean>(true); // optional synthesizer beep (enabled by default)
  
  // High-performance custom premium cursor states
  const [globalMousePos, setGlobalMousePos] = useState({ x: -100, y: -100 });
  const [cursorVisible, setCursorVisible] = useState<boolean>(false);
  const [cursorHovered, setCursorHovered] = useState<boolean>(false);
  const [cursorDesc, setCursorDesc] = useState<string | null>(null);
  const [mouseOverSlide, setMouseOverSlide] = useState<boolean>(false);
  
  // Autoplay setting
  const [autoplayActive, setAutoplayActive] = useState<boolean>(false);
  const [autoplayInterval, setAutoplayInterval] = useState<number>(10); // in seconds

  // Ambient Lo-fi Music generator controls
  const [ambientMusicActive, setAmbientMusicActive] = useState<boolean>(true);
  const [musicVolume, setMusicVolume] = useState<number>(95); // 95% default
  const synthRef = useRef<LofiAmbientSynthesizer | null>(null);

  // Onboarding States
  const [onboardingVisible, setOnboardingVisible] = useState<boolean>(true);
  const [guidedTourState, setGuidedTourState] = useState<"hidden" | "playing">("hidden");
  const [showTourCompletion, setShowTourCompletion] = useState<boolean>(false);
  const [hasTourCompleted, setHasTourCompleted] = useState<boolean>(false);
  const [voiceOverEnabled, setVoiceOverEnabled] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const voiceOverAudioCtxRef = useRef<AudioContext | null>(null);

  const handleStartup = (enableSound: boolean) => {
    setOnboardingVisible(false);
    
    setFeedbackSound(enableSound);
    setAmbientMusicActive(enableSound);

    if (enableSound) {
      if (!synthRef.current) {
        synthRef.current = new LofiAmbientSynthesizer();
      }
      const targetGain = (musicVolume / 100) * 0.35;
      synthRef.current.start(targetGain);
    }
    
    const hasSeenTour = safeStorage.getItem("tour_seen");
    if (!hasSeenTour) {
      setTimeout(() => {
        setGuidedTourState("playing");
      }, 1500);
      safeStorage.setItem("tour_seen", "true");
    } else {
      setHasTourCompleted(true);
    }
  };

  const manuallyStartTour = () => {
    setHelpOpen(false); // Close help drawer if open
    setGuidedTourState("playing");
  };

  const toggleAmbientMusic = () => {
    if (!synthRef.current) {
      synthRef.current = new LofiAmbientSynthesizer();
    }
    if (ambientMusicActive) {
      synthRef.current.stop();
      setAmbientMusicActive(false);
    } else {
      const targetGain = (musicVolume / 100) * 0.35;
      synthRef.current.start(targetGain);
      setAmbientMusicActive(true);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setMusicVolume(newVol);
    const targetGain = (newVol / 100) * 0.35;
    if (synthRef.current) {
      synthRef.current.setVolume(targetGain);
    }
  };

  // Clean ambient audio synth on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, []);
  
  // Printed Summary Drawer
  const [summaryOpen, setSummaryOpen] = useState<boolean>(false);
  const [helpOpen, setHelpOpen] = useState<boolean>(false);
  const [iframePrintWarning, setIframePrintWarning] = useState<boolean>(false);

  // States for other interactive elements of individual slides
  const [selectedIdeaSource, setSelectedIdeaSource] = useState<string>("experts");
  const [prohibitionReveal, setProhibitionReveal] = useState<number | null>(null);
  const [selectedFeasibilityTab, setSelectedFeasibilityTab] = useState<string>("market");

  // Dynamic search filtering
  const filteredSlides = slidesData.filter(
    (slide) =>
      slide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slide.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slide.bullets?.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Canvas ref for drawing board
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const currentSlide = slidesData[currentIndex];

  // Stopwatch ticking logic
  useEffect(() => {
    let timerId: any = null;
    if (timerRunning) {
      timerId = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [timerRunning]);

  // Autoplay slide shifting logic
  useEffect(() => {
    let intervalId: any = null;
    if (autoplayActive) {
      // Auto play ambient music if not already running when autoplay starts
      if (!ambientMusicActive) {
        if (!synthRef.current) {
          synthRef.current = new LofiAmbientSynthesizer();
        }
        const targetGain = (musicVolume / 100) * 0.35;
        synthRef.current.start(targetGain);
        setAmbientMusicActive(true);
      }

      if (!voiceOverEnabled) {
        intervalId = setInterval(() => {
          setCurrentIndex((prev) => (prev < slidesData.length - 1 ? prev + 1 : 0));
          playBeep();
        }, autoplayInterval * 1000);
      }
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoplayActive, autoplayInterval, ambientMusicActive, voiceOverEnabled]);

  // Handle keyboard shortcuts for pro presenters
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if focus is in an input field
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }
      if (e.key === "ArrowLeft") {
        // Since we are RTL (Right-to-Left):
        // ArrowLeft should logically move to NEXT slide (direction of progression)
        handleNextSlide();
      } else if (e.key === "ArrowRight") {
        // ArrowRight should move to PREVIOUS slide
        handlePrevSlide();
      } else if (e.key === " ") {
        e.preventDefault();
        handleNextSlide();
      } else if (e.key === "l" || e.key === "L") {
        setLaserPointerActive((prev) => !prev);
      } else if (e.key === "d" || e.key === "D") {
        setDrawingActive((prev) => !prev);
      } else if (e.key === "Escape") {
        setDrawingActive(false);
        setLaserPointerActive(false);
      } else if (e.key === "Home") {
        setCurrentIndex(0);
        playBeep();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  // Track global cursor for custom premium cursor element & smart hover annotations
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      // Check if pointer is fine (traditional mouse/trackpad vs touch screens)
      if (!window.matchMedia("(pointer: fine)").matches) {
        setCursorVisible(false);
        return;
      }
      
      setGlobalMousePos({ x: e.clientX, y: e.clientY });
      
      // Lazily show custom cursor on first movement
      if (!cursorVisible) {
        setCursorVisible(true);
      }

      // Detect if we are hovering any button, link or designated interactive item
      const target = e.target as HTMLElement | null;
      const interactiveEl = target?.closest('[data-cursor-desc], button, a, [role="button"], input, select, textarea');

      if (interactiveEl) {
        setCursorHovered(true);

        const customDesc = interactiveEl.getAttribute('data-cursor-desc');
        const titleVal = interactiveEl.getAttribute('title');
        
        if (customDesc) {
          setCursorDesc(customDesc);
        } else if (titleVal) {
          setCursorDesc(titleVal);
        } else {
          // Fallback to text content if it's very short and neat
          const text = interactiveEl.textContent?.trim() || "";
          if (text && text.length < 18) {
            setCursorDesc(text);
          } else {
            setCursorDesc(null);
          }
        }
      } else {
        setCursorHovered(false);
        setCursorDesc(null);
      }
    };

    const handleMouseLeaveWindow = () => setCursorVisible(false);
    const handleMouseEnterWindow = () => {
      if (window.matchMedia("(pointer: fine)").matches) {
        setCursorVisible(true);
      }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseleave", handleMouseLeaveWindow);
    document.addEventListener("mouseenter", handleMouseEnterWindow);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      document.removeEventListener("mouseenter", handleMouseEnterWindow);
    };
  }, [cursorVisible]);

  // Initialize and scale Drawing Canvas on activation and handle window resizes
  useEffect(() => {
    const handleResize = () => {
      if (drawingActive && canvasRef.current) {
        const canvas = canvasRef.current;
        const parent = canvas.parentElement;
        if (!parent) return;

        const parentRect = parent.getBoundingClientRect();
        const width = parentRect.width || 800;
        const height = parentRect.height || 500;

        // Setup dynamic scale depending on device pixel ratio to prevent pixelation
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        
        // Remove style.width / style.height overrides so CSS absolute positioning fits perfectly
        canvas.style.width = "";
        canvas.style.height = "";

        const context = canvas.getContext("2d");
        if (context) {
          context.scale(dpr, dpr);
          context.lineCap = "round";
          context.lineJoin = "round";
          context.strokeStyle = "#f59e0b"; // Premium Gold dry-brush color
          context.lineWidth = 3;
          contextRef.current = context;
        }
      }
    };

    handleResize();
    const timer = setTimeout(handleResize, 60);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [drawingActive, layoutMode, currentIndex]);

  // Helper synthesize standard slide transition bubble blip sound
  const playBeep = () => {
    if (!feedbackSound) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.value = 600; // soft treble chirp
      gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (err) {
      // AudioContext might be blocked by browser user-interaction rules safely
    }
  };

  // VoiceOver Audio Playback logic
  useEffect(() => {
    let delayTimeoutId: any = null;
    let active = true;

    // Clean up previous playback immediately when slide changes or is disabled
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    // Only play if tour is completed and voiceover is enabled
    if (hasTourCompleted && voiceOverEnabled) {
      const audioSrc = `/audio/Slide-${currentIndex + 1}.mp3`;
      const audio = new window.Audio(audioSrc);
      
      // Reuse the persistent AudioContext to prevent exceeding browser's AudioContext allocation limit
      if (!voiceOverAudioCtxRef.current) {
        voiceOverAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const audioCtx = voiceOverAudioCtxRef.current;
      
      const source = audioCtx.createMediaElementSource(audio);

      // --- PROFESSIONAL STUDIO AUDIO PROCESSING CHAIN (LOUDNESS MAXIMIZER & SOFT-CLIPPER) ---
      // 1. High-Pass Filter: Cuts out mic popping (P & T plosives), wind, and room rumbles below 140Hz
      const highPass = audioCtx.createBiquadFilter();
      highPass.type = "highpass";
      highPass.frequency.setValueAtTime(140, audioCtx.currentTime);
      highPass.Q.setValueAtTime(0.8, audioCtx.currentTime);

      // 2. Vocal Presence Boost (Peaking EQ at 3200 Hz for ultimate clarity and speech bite)
      const presBoost = audioCtx.createBiquadFilter();
      presBoost.type = "peaking";
      presBoost.frequency.setValueAtTime(3200, audioCtx.currentTime);
      presBoost.Q.setValueAtTime(1.2, audioCtx.currentTime);
      presBoost.gain.setValueAtTime(6.0, audioCtx.currentTime); // +6 dB boost for extra punch

      // 3. Dual-Stage Loudness Maximizer (Pre-Gain Boost)
      const preGain = audioCtx.createGain();
      preGain.gain.setValueAtTime(8.5, audioCtx.currentTime); // Boost input into the clipper to raise average volume (RMS)

      // 4. Analog-Style Soft Clipper (WaveShaper with tanh curve)
      // This increases perceived loudness dramatically while keeping peaks strictly under 0dB to prevent harsh digital distortion.
      const waveShaper = audioCtx.createWaveShaper();
      const curve = new Float32Array(44100);
      for (let i = 0; i < 44100; i++) {
        const x = (i * 2) / 44100 - 1;
        curve[i] = Math.tanh(x);
      }
      waveShaper.curve = curve;
      waveShaper.oversample = "4x"; // Use 4x oversampling to prevent aliasing noise

      // 5. Pro Dynamics Compressor: Smooths and glues the saturated vocal
      const compressor = audioCtx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-15, audioCtx.currentTime);
      compressor.knee.setValueAtTime(15, audioCtx.currentTime);
      compressor.ratio.setValueAtTime(4, audioCtx.currentTime);
      compressor.attack.setValueAtTime(0.005, audioCtx.currentTime);
      compressor.release.setValueAtTime(0.12, audioCtx.currentTime);

      // 6. Master Studio Gain Control (Optimized ceiling output - reduced by 30%)
      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.77, audioCtx.currentTime); 
      
      // Route signals cleanly: source -> highPass -> presBoost -> preGain -> waveShaper -> compressor -> gainNode -> destination
      source.connect(highPass);
      highPass.connect(presBoost);
      presBoost.connect(preGain);
      preGain.connect(waveShaper);
      waveShaper.connect(compressor);
      compressor.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      const onEnded = () => {
        if (autoplayActive) {
          setCurrentIndex((p) => (p < slidesData.length - 1 ? p + 1 : 0));
          playBeep();
        }
      };
      
      audio.addEventListener("ended", onEnded);
      
      const startPlaying = () => {
        if (!active) return;
        if (audioCtx.state === "suspended") {
          audioCtx.resume();
        }
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.warn("Audio playback blocked or failed:", err);
            // Fallback if audio fails to play: advance manually after a timeout if autoplay is on
            if (active && autoplayActive) {
              setTimeout(() => {
                 setCurrentIndex((p) => (p < slidesData.length - 1 ? p + 1 : 0));
                 playBeep();
              }, autoplayInterval * 1000);
            }
          });
        }
        audioRef.current = audio;
      };

      if (currentIndex === 0) {
        delayTimeoutId = setTimeout(startPlaying, 2000);
      } else {
        startPlaying();
      }
      
      return () => {
        active = false;
        if (delayTimeoutId) {
          clearTimeout(delayTimeoutId);
        }
        audio.removeEventListener("ended", onEnded);
        audio.pause();
        audio.currentTime = 0;
        try {
          source.disconnect();
          highPass.disconnect();
          presBoost.disconnect();
          preGain.disconnect();
          waveShaper.disconnect();
          compressor.disconnect();
          gainNode.disconnect();
        } catch (e) {}
      };
    }
  }, [currentIndex, hasTourCompleted, voiceOverEnabled, slidesData.length, autoplayActive, autoplayInterval]);

  const handleNextSlide = () => {
    if (currentIndex < slidesData.length - 1) {
      setCurrentIndex((p) => p + 1);
    } else {
      setCurrentIndex(0); // circular flow
    }
    setProhibitionReveal(null); // reset slide specific animations
    playBeep();
  };

  const handlePrevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((p) => p - 1);
    } else {
      setCurrentIndex(slidesData.length - 1);
    }
    setProhibitionReveal(null);
    playBeep();
  };

  // Drawing mouse and touch event handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingActive || !canvasRef.current || !contextRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawingActive || !canvasRef.current || !contextRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  // Drawing touch event handlers for tablets, smart boards and smartphones
  const startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!drawingActive || !canvasRef.current || !contextRef.current || e.touches.length === 0) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const drawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawingActive || !canvasRef.current || !contextRef.current || e.touches.length === 0) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
    
    // Prevent default gesture behaviours (like scrolling page) while drawing on mobile
    if (e.cancelable) {
      e.preventDefault();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current || !contextRef.current) return;
    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Track cursor for custom golden Laser Pointer trail
  const handleMouseMoveOnSlide = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!laserPointerActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setLaserPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Format Elapsed Stopwatch time into readable MM:SS
  const formatTime = (timeInSecs: number) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = timeInSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div id="app-root" className={`h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-indigo-500 overflow-hidden select-none ${cursorVisible ? "custom-cursor-enabled" : ""}`}>
      
      {/* 1. CINEMATIC GLASSMORPHISM LOADING SCREEN OVERLAY */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -24, filter: "blur(20px)" }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }} // smooth ease-out-expo
            className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-sans select-none"
          >
            {/* Ambient Nebula Backdrop Glimmers */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 pointer-events-none" />
            <div className="absolute -top-[15%] -left-[15%] w-[60%] h-[60%] rounded-full bg-indigo-500/[0.04] blur-[150px] pointer-events-none" />
            <div className="absolute -bottom-[15%] -right-[15%] w-[70%] h-[70%] rounded-full bg-purple-600/[0.04] blur-[180px] pointer-events-none" />
            
            {/* Subtle Futuristic Segmented Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25" />

            {/* Premium Centered Card Module */}
            <div className="relative z-10 flex flex-col items-center max-w-sm sm:max-w-md w-full px-8 text-center space-y-8">
              
              {/* Pulsing Lightbulb Icon with Multi-colored Glowing Halo */}
              <div className="relative group">
                <div className="absolute -inset-6 bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 rounded-full opacity-20 blur-2xl animate-pulse" style={{ animationDuration: "4s" }} />
                <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl opacity-40 blur-md" />
                
                <div className="relative w-20 h-20 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-center backdrop-blur-3xl shadow-[0_0_50px_rgba(99,102,241,0.15)]">
                  <Lightbulb className="w-10 h-10 text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.7)] animate-pulse" style={{ animationDuration: "2s" }} />
                </div>
              </div>

              {/* Title & Badge Layout */}
              <div className="space-y-3">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-indigo-300 font-bold bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                  ارائه پودمان پنجم: از ایده تا محصول
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white font-sans mt-3 tracking-normal">
                  در حال آماده‌سازی کارگاه تعاملی
                </h2>
                <p className="text-slate-450 text-[10.5px] leading-relaxed">
                  محیط یادگیری استاندارد چندرسانه‌ای برای ارائه‌دهندگان برتر فناوری
                </p>
              </div>

              {/* Glowing Advanced Track Loader */}
              <div className="w-full space-y-4 pt-4">
                <div className="flex items-center justify-between text-[11px] font-sans font-medium px-1">
                  <span className="text-slate-500 font-medium">لطفاً چند لحظه صبر کنید</span>
                  <span className="text-indigo-400 font-mono font-bold text-xs">{loadingProgress}%</span>
                </div>

                {/* Progress bar boundary */}
                <div className="h-[6px] w-full bg-slate-900/90 rounded-full overflow-hidden border border-slate-800/20 relative">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 rounded-full shadow-[0_0_14px_rgba(99,102,241,0.75)]"
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ ease: "easeOut", duration: 0.15 }}
                  />
                </div>

                {/* Micro-log progress messages */}
                <div className="h-6 flex items-center justify-center">
                  <AnimatePresence mode="popLayout">
                    <motion.p
                      key={loadingText}
                      initial={{ opacity: 0, y: 7, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -7, filter: "blur(4px)" }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="text-xs text-indigo-200/80 font-sans font-medium tracking-wide truncate max-w-full"
                    >
                      {loadingText}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>
            
            {/* Futuristic Branding Footer Label */}
            <div className="absolute bottom-6 text-slate-600 text-[10px] font-sans tracking-wider">
              CRAFTED BY DESIGN STUDIO • 2026
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. PRESENTATION LAYOUT CORE (Pre-loaded in DOM; smoothly revealed to prevent flashes) */}
      <div 
        className={`w-full h-full flex flex-col transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) ${
          loading 
            ? "opacity-0 scale-[0.985] blur-xl pointer-events-none" 
            : "opacity-100 scale-100 blur-0"
        }`}
      >
        
        {/* BACKGROUND GRAPHICS GALAXY */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-500/[0.03] blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-purple-500/[0.03] blur-[180px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-[250px] h-[250px] rounded-full bg-amber-500/[0.015] blur-[100px] pointer-events-none" />

        {/* TOP HEADER PANELS */}
        <header id="main-header" className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md relative z-40 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-4">
        
        {/* Logo and Class metadata */}
        <div className="flex items-center gap-3">
          <a
            id="tour-pg-logo"
            href="https://www.parsaghaei.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="w-[42px] h-[42px] sm:w-[50px] sm:h-[50px] rounded-xl bg-slate-950/60 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.12)] hover:scale-105 hover:border-indigo-400/60 hover:bg-slate-900/40 transition-all duration-300 shrink-0 cursor-pointer overflow-visible"
            onMouseEnter={() => {
              setCursorHovered(true);
              setCursorDesc("باز کردن وبسایت شخصی پارسا غائی");
            }}
            onMouseLeave={() => {
              setCursorHovered(false);
              setCursorDesc(null);
            }}
            title="باز کردن وبسایت شخصی پارسا غائی"
            data-cursor-desc="باز کردن وبسایت شخصی پارسا غائی"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1254 1254"
              className="w-full h-full scale-[1.3] hover:scale-[1.38] transition-transform duration-300 transform"
              aria-hidden="true"
              title="مشاهده سایت پارسا غائی"
            >
              <defs>
                <linearGradient id="pg-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#e0e7ff" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
              <path fill="url(#pg-logo-grad)" d="M280.864 309.422c11.489-.55 25.06-.198 36.76-.2l65.511-.005 190.389.065c9.507 8.896 19.698 20.282 29.237 29.649 27.692 27.191 55.438 56.484 83.807 82.813l.01 153.218c-13.489 12.159-29.974 29.159-43.098 42.084l-69.404 67.987c-38.858.824-78.125-.279-117.026.15-17.83.196-36.256.255-54.074-.166a4001 4001 0 0 1-53.015-52.431l206.257-.074 77.177-75.978c-.399-37.724-.026-76.031.028-113.804l-52.49-52.994c-7.948-7.997-19.372-18.839-26.578-27.17l-219.689-.009c-11.284-9.756-24.134-24.569-35.519-34.993-3.143-2.878-16.828-16.039-18.283-18.142"/>
              <path fill="url(#pg-logo-grad)" d="M271.028 320.132c4.903 3.739 15.452 14.799 20.209 19.53a3901 3901 0 0 1 32.894 32.58l-.074 505.763c-6.954 7.744-18.115 18.051-25.778 25.583a3480 3480 0 0 1-27.051 26.603l-.071-422.141-.143-133.253a2264 2264 0 0 0-.266-33.068c-.069-6.037-.383-15.803.28-21.597"/>
              <path fill="url(#pg-logo-grad)" d="M618.764 661.208c1.762 2.433.778 133.391.772 148.255l78.771 78.82c72.89-.044 147.718-.874 220.487.079 6.079 5.055 13.982 13.449 19.841 19.297a3769 3769 0 0 0 33.394 33.042c-17.448.541-36.32.209-53.878.201l-154.304.009c-28.473.012-57.733.353-86.143-.083A10799 10799 0 0 0 566.007 829.06c1.258-42.094-.41-87.253-.095-129.645l14.392-.079z"/>
              <path fill="url(#pg-logo-grad)" d="M981.721 576.043c1.47 1.729.918 41.277.918 47.761l-.031 84.523-.126 222.813c-8.262-7.332-18.113-17.65-26.073-25.556a1382 1382 0 0 1-27.528-27.733l-.037-249.936c13.804-14.609 38.292-38.934 52.877-51.872"/>
              <path fill="url(#pg-logo-grad)" d="M679.188 309.296c34.934-.816 72.982-.06 108.123-.062l185.225.088c-17.476 17.658-35.596 35.917-53.388 53.215l-14.699.018-205.979.022c-8.855 8.524-17.017 17.46-26.179 25.914-11.979-11.679-24.067-24.195-35.897-36.1a2932 2932 0 0 0 42.794-43.095"/>
              <path fill="url(#pg-logo-grad)" d="M338.524 641.901c2.631 1.578 13.56 12.618 16.632 15.625l36.508 35.748-.022 235.993-.688.197c-5.03-2.477-46.087-44.422-52.47-50.802-.644-31.527-.055-65.494-.063-97.186z"/>
              <path fill="url(#pg-logo-grad)" d="M685.522 595.576c.135.114.293.204.404.341 1.253 1.529.8 235.69.519 260.556-8.053-7.221-18.742-18.616-26.628-26.535l-26.368-26.451c-.513-15.661-.088-34.072-.091-49.945v-106.2z"/>
              <path fill="url(#pg-logo-grad)" d="M702.808 821.407c38.642-.729 77.567.294 116.242-.139 10.738-.12 21.926-.252 32.617.157 10.575 9.151 22.043 21.941 32.289 31.773 3.748 3.596 17.025 16.771 19.563 20.332l-.503.85c-23.337.393-47.484.086-70.869.089l-130.658-.02-.068-34.204c-.005-4.457-.266-14.182.342-18.191z"/>
              <path fill="url(#pg-logo-grad)" d="M349.324 376.619c66.298-.916 135.485-.251 201.907-.022l-.095 52.672c-48.921.666-99.708.055-148.759.051-12.254-10.814-23.726-24.319-35.857-35.461-5.764-5.294-12.073-11.386-17.196-17.24"/>
              <path fill="url(#pg-logo-grad)" d="m701.477 376.605 202.335.007c-8.512 8.86-17.912 17.855-26.686 26.526l-26.189 26.213-149.41-.008z"/>
              <path fill="url(#pg-logo-grad)" d="M914.698 640.905c.989 4.027.549 19.361.516 24.173l-.134 39.397c-.093 52.968.766 107.608-.141 160.338-7.776-6.86-18.347-18.174-25.913-25.776l-27.495-27.242.043-118.703c16.628-16.459 36.027-36.511 53.124-52.187"/>
              <path fill="url(#pg-logo-grad)" d="M338.494 386.566c3.368 2.304 13.943 12.96 17.389 16.334a4135 4135 0 0 0 35.53 34.807l.017 120.913-25.702 25.226-27.217 27.194z"/>
              <path fill="url(#pg-logo-grad)" d="M402.406 567.189c19.81-.573 42.161-.08 62.219-.083q43.294-.153 86.586.152l-.087 51.381-50.106.079c-49.815.004-100.856.647-150.554-.077z"/>
              <path fill="url(#pg-logo-grad)" d="M565.929 395.354c2.79 1.86 12.901 12.592 15.945 15.64a4217 4217 0 0 1 37.667 37.76l.001 101.756c-8.144 8.587-18.198 18.029-26.737 26.437l-27.052 26.485c1.038-13.931.258-38.731.381-53.535.425-51.252-1.021-103.326-.205-154.543"/>
              <path fill="url(#pg-logo-grad)" d="M769.87 567.277a788 788 0 0 1 27.839-.144c57.246.688 114.979-1.1 172.17.171-9.015 9.414-18.81 18.872-28.084 28.085a1543 1543 0 0 1-23.554 23.211c-31.394.873-68.058.229-99.666.111-4.397-3.666-50.133-49.995-50.379-50.967z"/>
              <path fill="url(#pg-logo-grad)" d="M981.896 320.092c1.514 2.185.924 22.863.923 26.715l-.066 82.537-53.135-.036c-.991-1.475-.589-50.407-.769-56.685 6.118-6.8 15.09-15.332 21.694-21.85a2817 2817 0 0 1 31.353-30.681"/>
              <path fill="url(#pg-logo-grad)" d="m819.363 632.549 84.162-.024c-16.968 17.662-35.541 34.857-52.737 52.579-27.255.546-56.532.046-83.89-.038 14.869-16.264 36.489-36.562 52.465-52.517"/>
              <path fill="url(#pg-logo-grad)" d="M330.615 891.298c2.738 1.605 16.195 15.344 19.661 18.783l31.186 30.68c-15.476.583-33.612.141-49.287.132a2834 2834 0 0 1-51.749-.119c15.623-16.255 34-33.47 50.189-49.476"/>
              <path fill="url(#pg-logo-grad)" d="M756.618 577.728c2.37 1.78 4.834 4.076 6.899 6.18 13.978 14.24 28.714 27.885 42.526 42.275-7.54 7.956-16.045 16.134-23.847 23.914l-25.534 25.248c-.446-32.044-.108-65.528-.044-97.617"/>
              <path fill="url(#pg-logo-grad)" d="M914.589 385.614c.038.036.078.068.112.107 2.047 2.396.816 37.722.789 43.651l-43.949-.035-.387-.759c12.634-13.461 30-30.178 43.435-42.964"/>
            </svg>
          </a>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-slate-50 to-indigo-300">
                پودمان پنجم: از ایده تا محصول
              </span>
              <span className="hidden sm:inline-block text-[10px] bg-indigo-500/15 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/20 font-bold">
                کاربر فناوری‌های نوین
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">ارائه فوق پیشرفته کلاسی با سبک و استانداردهای TEDx</p>
          </div>
        </div>

        {/* Global Toolbar and presenter settings */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          <button
            id="tour-sound-effects"
            onClick={() => setFeedbackSound(!feedbackSound)}
            title={feedbackSound ? "خاموش کردن صدای افکت" : "روشن کردن صدای افکت تعویض دیواره"}
            className={`p-1.5 sm:p-2 rounded-lg border transition-all duration-300 ${
              feedbackSound ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300" : "bg-slate-900/40 border-slate-900 text-slate-450 hover:border-slate-800"
            }`}
          >
            {feedbackSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setVoiceOverEnabled(!voiceOverEnabled)}
            title={voiceOverEnabled ? "خاموش کردن صدای ارائه دهنده" : "روشن کردن صدای ارائه دهنده"}
            className={`p-1.5 sm:p-2 rounded-lg border transition-all duration-300 flex items-center justify-center ${
              voiceOverEnabled ? "bg-purple-500/15 border-purple-500/40 text-purple-400 opacity-100" : "bg-slate-900/40 border-slate-900 text-slate-450 hover:border-slate-800 opacity-50"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
              <path d="M16 18a4 4 0 0 0-4-4H9a5 5 0 0 0-5 5v2" />
              <circle cx="11.5" cy="7" r="4" />
              <path d="M18 8a3 3 0 0 1 0 8" />
              <path d="M21 5a6 6 0 0 1 0 14" />
            </svg>
          </button>

          <div id="tour-bg-music" className={`flex items-center gap-2 sm:gap-3 border rounded-xl px-3 py-1.5 transition-all duration-500 backdrop-blur-md ${
            ambientMusicActive 
              ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400/20" 
              : "bg-slate-950/40 border-slate-900 hover:border-slate-800 hover:bg-slate-950/60"
          }`}>
            <button
              onClick={() => {
                toggleAmbientMusic();
                playBeep();
              }}
              title={ambientMusicActive ? "قطع موسیقی پس زمینه" : "پخش موسیقی پس زمینه Lo-fi برای افزایش تمرکز"}
              className="flex items-center gap-2 group cursor-pointer select-none"
            >
              <div className="relative flex h-5 w-5 items-center justify-center rounded-lg bg-slate-900/45 border border-slate-850/80 group-hover:border-slate-700/60 transition-all duration-300">
                {ambientMusicActive ? (
                  <div className="absolute inset-0 rounded-lg bg-emerald-500/10 animate-pulse" />
                ) : null}
                <Music className={`w-3.5 h-3.5 transition-all duration-500 relative z-10 ${
                  ambientMusicActive ? "text-emerald-400 scale-110" : "text-slate-400 group-hover:text-slate-200"
                }`} />
              </div>

              <div className="flex flex-col text-right">
                <span className={`text-[11px] font-sans font-bold transition-colors duration-300 leading-none ${
                  ambientMusicActive ? "text-emerald-400" : "text-slate-200"
                }`}>
                  موسیقی پس زمینه
                </span>
                <span className="text-[8px] text-slate-500 font-sans mt-0.5 leading-none">Lo-Fi تمرکز</span>
              </div>
              
              {/* Premium micro audio visualizer animation */}
              {ambientMusicActive && (
                <div id="visualizer-bars" className="flex items-end gap-[2px] h-3.5 px-1 bg-emerald-950/25 border border-emerald-500/20 rounded-md ml-1" title="موسیقی در حال پخش است">
                  <span className="w-[1.5px] bg-emerald-400 rounded-full animate-[visualizer1_1s_infinite_alternate]" />
                  <span className="w-[1.5px] bg-emerald-400 rounded-full animate-[visualizer2_0.7s_infinite_alternate_0.2s]" />
                  <span className="w-[1.5px] bg-emerald-400 rounded-full animate-[visualizer3_1.2s_infinite_alternate_0.1s]" />
                </div>
              )}
            </button>

            <div className={`flex items-center gap-2 border-r pl-1 sm:pl-1.5 mr-1.5 transition-colors duration-500 ${
              ambientMusicActive ? "border-emerald-500/20" : "border-slate-800/80"
            }`}>
              <div className="flex flex-col items-center">
                <span className={`text-[9px] font-mono w-[22px] text-center select-none leading-none transition-colors duration-300 font-bold ${
                  ambientMusicActive ? "text-emerald-400" : "text-slate-500"
                }`}>{musicVolume}%</span>
              </div>
              <div className="relative flex items-center h-4">
                <input
                  id="music-volume-input"
                  type="range"
                  min="0"
                  max="100"
                  value={musicVolume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  title="تنظیم دقیق حجم صدای موسیقی پس زمینه"
                  className={`w-12 sm:w-16 h-1 rounded-full appearance-none cursor-pointer transition-all duration-300 focus:outline-none ${
                    ambientMusicActive
                      ? "bg-emerald-950/80 accent-emerald-400"
                      : "bg-slate-900 accent-slate-500 hover:accent-slate-450"
                  }`}
                />
              </div>
            </div>
          </div>

          <button
            id="tour-auto-slide"
            onClick={() => {
              const newState = !autoplayActive;
              setAutoplayActive(newState);
              if (newState && !voiceOverEnabled) {
                setVoiceOverEnabled(true);
              }
              playBeep();
            }}
            title={autoplayActive ? "توقف اسلایدشو خودکار" : "شروع اسلایدشو خودکار"}
            className={`p-1.5 sm:p-2 rounded-lg border transition-all duration-300 flex items-center gap-1.5 ${
              autoplayActive ? "bg-amber-500/15 border-amber-500/40 text-amber-400" : "bg-slate-900/40 border-slate-900 text-slate-450 hover:border-slate-800 subtle-pulse-glow"
            }`}
          >
            {autoplayActive ? <Pause className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4" />}
            <span className="hidden sm:inline text-[10px] font-sans">اسلایدشو خودکار</span>
          </button>

          {/* Document Summary Print Booklet */}
          <button
            id="tour-summary"
            onClick={() => {
              setSummaryOpen(true);
              playBeep();
            }}
            className="p-1.5 sm:p-2 rounded-lg border bg-slate-900/40 border-slate-900 text-slate-350 hover:border-slate-800 flex items-center gap-1.5"
            title="جزوه کامل خلاصه و نکات کلاس"
          >
            <FileText className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline text-[10px] font-sans">خلاصه وبینار تعاملی</span>
          </button>

          <button
            id="tour-help"
            onClick={() => setHelpOpen(true)}
            className="p-1.5 sm:p-2 rounded-lg border bg-slate-900/40 border-slate-900 text-slate-450 hover:border-slate-800"
            title="راهنمای کلید‌های میانبر"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <div className="h-6 w-px bg-slate-900 mx-1 hidden sm:block" />

          {/* Layout switches */}
          <div className="bg-slate-900/50 p-1 rounded-xl border border-slate-800 flex font-sans relative shadow-inner">
            <button
              id="standard-layout-btn"
              onClick={() => {
                setLayoutMode("standard");
                playBeep();
              }}
              className={`relative px-3 py-1.5 text-[10.5px] font-bold rounded-lg transition-colors duration-300 flex items-center gap-1.5 z-10 ${
                layoutMode === "standard" ? "text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {layoutMode === "standard" && (
                <motion.div
                  layoutId="active-mode-bg"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg shadow-[0_2px_10px_rgba(79,70,229,0.3)] border border-indigo-400/30"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Monitor className={`w-3.5 h-3.5 relative z-10 transition-transform duration-300 ${layoutMode === "standard" ? "scale-110" : ""}`} />
              <span className="relative z-10 tracking-wide">بخش کلاس</span>
            </button>
            <button
              id="presenter-layout-btn"
              onClick={() => {
                if (isPresenterUnlocked) {
                  setLayoutMode("presenter");
                  playBeep();
                } else {
                  setShowPasswordModal(true);
                  playBeep();
                }
              }}
              className={`relative px-3 py-1.5 text-[10.5px] font-bold rounded-lg transition-colors duration-300 flex items-center gap-1.5 z-10 ${
                layoutMode === "presenter" ? "text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {layoutMode === "presenter" && (
                <motion.div
                  layoutId="active-mode-bg"
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-lg shadow-[0_2px_10px_rgba(147,51,234,0.3)] border border-purple-400/30"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Tv className={`w-3.5 h-3.5 relative z-10 transition-transform duration-300 ${layoutMode === "presenter" ? "scale-110" : ""}`} />
              <span className="relative z-10 tracking-wide">پیشخوان ارائه</span>
            </button>
          </div>
        </div>
      </header>

      {/* CORE WORKSPACE: Sidebar + Main Stage / Presenter Panels */}
      <div className="flex-1 flex overflow-hidden relative z-30">
        
        {/* PRESENTATION OUTLINE SIDEBAR (COLLAPSIBLE) */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <>
              {/* Mobile overlay backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
              />
              <motion.aside
                id="outline-sidebar"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 300, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="border-l border-slate-900 bg-slate-950/95 backdrop-blur flex flex-col h-full overflow-hidden shrink-0 z-50 absolute md:relative right-0 top-0 bottom-0"
              >
              {/* Search Bar inside outline */}
              <div className="p-3 border-b border-slate-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span id="tour-slide-list" className="text-xs font-bold text-indigo-400">سرفصل‌ها و نقشه اسلایدها</span>
                  <span className="text-[10px] text-slate-500 font-mono font-bold font-sans">
                    {slidesData.length} اسلاید
                  </span>
                </div>
                
                <div id="tour-search" className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جستجو در کل اسلایدها..."
                    className="w-full bg-slate-900 border border-slate-800 text-xs px-8 py-2 rounded-lg text-slate-250 focus:outline-none focus:border-indigo-500/80 transition-all font-sans"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Slide Timeline List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
                {filteredSlides.map((slide, index) => {
                  const absoluteIndex = slidesData.findIndex((s) => s.id === slide.id);
                  const isCurrent = absoluteIndex === currentIndex;
                  return (
                    <button
                      key={slide.id}
                      onClick={() => {
                        setCurrentIndex(absoluteIndex);
                        playBeep();
                      }}
                      className={`w-full text-right p-2.5 rounded-lg border transition-all duration-300 flex items-start gap-3 relative ${
                        isCurrent
                          ? "bg-indigo-650/15 border-indigo-500 text-indigo-200 shadow shadow-indigo-500/5 glow-indigo"
                          : "bg-slate-900/30 border-slate-900 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 hover:border-slate-800"
                      }`}
                    >
                      {/* Step index badge */}
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono shrink-0 font-bold border font-sans ${
                        isCurrent ? "bg-indigo-505 border-indigo-400 text-indigo-300 text-indigo-400" : "bg-slate-90 The0 border-slate-800 text-slate-500"
                      }`}>
                        {absoluteIndex + 1}
                      </span>

                      <div className="space-y-0.5 truncate pr-1">
                        <span className="text-[9px] font-bold text-slate-500 tracking-wide font-sans">{slide.category}</span>
                        <h4 className="text-xs font-bold truncate text-slate-200">{slide.title}</h4>
                      </div>

                      {/* Right accent line if active */}
                      {isCurrent && (
                        <span className="absolute right-0 top-2 bottom-2 w-1 rounded-l bg-indigo-500" />
                      )}
                    </button>
                  );
                })}

                {filteredSlides.length === 0 && (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    موردی برای جستجوی شما پیدا نشد.
                  </div>
                )}
              </div>

              {/* Class footer summary indicator */}
              <div className="p-3 border-t border-slate-900 bg-slate-950 text-center text-[10px] text-slate-500">
                پودمان ۵: کاربر فناوری‌های نوین
              </div>
            </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Dynamic Sidebar Toggle Tab */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-4 h-16 bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 rounded-l flex items-center justify-center z-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          title={sidebarOpen ? "بستن ستون کناری سرفصل‌ها" : "باز کردن ستون کناری سرفصل‌ها"}
        >
          {sidebarOpen ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* MIDDLE ACTIVE REGION: SLIDE CONSOLE / WORKSPACE */}
        <main className={`flex-1 flex flex-col min-w-0 bg-slate-950/20 relative ${layoutMode === "presenter" ? "lg:flex-row" : ""}`}>
          
          {/* STAGE CONTAINER: Beautiful responsive card hosting current slide */}
          <div className="flex-1 flex flex-col overflow-hidden p-3 sm:p-4 lg:p-5">
            
            {/* Action Bar immediately above slides */}
            <div id="slide-actions-toolbar" className="flex flex-wrap gap-2 items-center justify-between mb-3 text-xs text-slate-400 font-bold max-w-5xl mx-auto w-full">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>دسته‌بندی فعلی: <strong className="text-indigo-400">{currentSlide.category}</strong></span>
                {isInteractiveSlide(currentSlide.type) && (
                  <span className="mr-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/25 shadow-sm animate-pulse" title="این اسلاید مجهز به ابزار تعاملی است. روی دکمه‌ها یا المان‌های درون صفحه‌ای آن کلیک کنید.">
                    <span>⚡ تعاملی</span>
                    <span className="text-[8px] font-normal opacity-80 hidden sm:inline">(کلیک کنید)</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {/* Laser Pointer toggle btn */}
                <button
                  id="tour-laser"
                  onClick={() => {
                    setLaserPointerActive(!laserPointerActive);
                    if (drawingActive) setDrawingActive(false);
                    playBeep();
                  }}
                  className={`px-2.5 py-1 rounded border text-[10.5px] transition-all flex items-center gap-1 ${
                    laserPointerActive
                      ? "bg-red-500/15 border-red-500/40 text-red-400 font-bold ring-2 ring-red-500/10"
                      : "bg-slate-900/60 border-slate-850 hover:border-slate-700"
                  }`}
                  title="افکت لیزر پوینتر فانتزی روی اسلاید (کلید L)"
                >
                  <span className={`w-1.5 h-1.5 rounded-full bg-red-500 ${laserPointerActive ? "animate-ping" : ""}`} />
                  <span>لیزر پوینتر</span>
                </button>

                {/* Whiteboard Dry Pen btn */}
                <button
                  id="tour-whiteboard"
                  onClick={() => {
                    setDrawingActive(!drawingActive);
                    if (laserPointerActive) setLaserPointerActive(false);
                    playBeep();
                  }}
                  className={`px-2.5 py-1 rounded border text-[10.5px] transition-all flex items-center gap-1.5 ${
                    drawingActive
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-400 font-bold ring-2 ring-amber-500/10"
                      : "bg-slate-900/60 border-slate-850 hover:border-slate-700"
                  }`}
                  title="بازکردن صفحه یادداشت و وایت‌برد روی اسلاید (کلید D)"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>قلم وایت‌برد</span>
                </button>

                {drawingActive && (
                  <button
                    onClick={clearCanvas}
                    className="px-2 py-1 rounded bg-red-650/15 hover:bg-red-600 border border-slate-800 text-[10px] text-red-450 hover:text-white transition-all flex items-center gap-1"
                    title="پاک کردن تمام خطوط کشیده شده"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>پاک کردن</span>
                  </button>
                )}
              </div>
            </div>

            {/* PRESENTATION BOARD FRAME */}
            <div
              id="presentation-board-frame"
              className={`flex-1 min-h-0 w-full max-w-5xl mx-auto rounded-3xl border border-slate-900 bg-gradient-to-br from-slate-900/40 to-slate-950/40 backdrop-blur-lg relative overflow-hidden flex flex-col justify-between glow-indigo p-3 sm:p-4 lg:p-4.5 select-none ${laserPointerActive ? "cursor-none [&_*]:cursor-none" : "cursor-default"}`}
              onMouseMove={handleMouseMoveOnSlide}
              onMouseEnter={() => setMouseOverSlide(true)}
              onMouseLeave={() => setMouseOverSlide(false)}
            >
              
              {/* SLIDE BACKGROUND DESIGNS */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-indigo-500/[0.015] blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-purple-500/[0.015] blur-2xl pointer-events-none" />
              
              {/* Decorative design studio margins */}
              <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none text-[9px] text-slate-600 tracking-wider font-mono uppercase">
                <span>کاربر فناوری‌های نوین - پودمان پنجم</span>
                <span>کلاس درس خلاق • پژوهش خلاقانه</span>
              </div>

              {/* LASER POINTER LAYER */}
              {laserPointerActive && mouseOverSlide && (
                <div
                  className="absolute pointer-events-none rounded-full bg-red-500/85 w-3 h-3 -translate-x-1/2 -translate-y-1/2 blur-[1.4px] z-50 flex items-center justify-center mix-blend-screen transition-transform"
                  style={{
                    left: `${laserPos.x}px`,
                    top: `${laserPos.y}px`,
                    boxShadow: "0 0 6px 1.8px rgba(239, 68, 68, 0.48), 0 0 12px 4.8px rgba(244, 63, 94, 0.3)"
                  }}
                >
                  <div className="w-[3px] h-[3px] rounded-full bg-white" />
                </div>
              )}


              {/* DYNAMIC PRESENTATION CONTENT SLIDES (ANIMATED) */}
              <div className="flex-1 flex flex-col justify-center relative z-10 overflow-y-auto pr-1 min-h-0 scrollbar-thin">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: -15, y: 0 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: 15, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="space-y-2.5 sm:space-y-3 lg:space-y-4 flex flex-col min-h-full justify-center px-4 sm:px-5 py-1.5"
                  >
                    
                    {/* TYPE 1: COVER SLIDE */}
                    {currentSlide.type === "cover" && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-7 space-y-4 text-right">
                          <span className="text-[11px] sm:text-xs font-mono font-bold text-amber-500 tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 uppercase inline-block">
                            کتاب کاربر فناوری‌های نوین
                          </span>
                          <h1 id="cover-title" className="text-2xl sm:text-3.5xl lg:text-4.5xl font-extrabold tracking-tight text-slate-100 leading-tight">
                            {currentSlide.title}
                          </h1>
                          <p id="cover-subtitle" className="text-xs sm:text-base text-slate-400 font-sans leading-relaxed">
                            {currentSlide.subtitle}
                          </p>
                          
                          <div className="pt-4 space-y-2.5 border-t border-slate-900 max-w-md">
                            {currentSlide.bullets?.map((bull, i) => {
                              if (bull.startsWith("تهیه کننده:")) {
                                return (
                                  <div key={i} className="text-[10.5px] sm:text-xs text-slate-400 flex items-center gap-2.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
                                    <span>تهیه کننده:</span>
                                    <a
                                      href="https://parsaghaei.dev"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 text-amber-400 font-bold hover:text-amber-300 transition-all cursor-pointer relative group/gold py-0.5"
                                      style={{ textShadow: "0 0 14px rgba(245, 158, 11, 0.9)" }}
                                      onMouseEnter={() => {
                                        setCursorHovered(true);
                                        setCursorDesc("باز کردن وبسایت شخصی پارسا غائی");
                                      }}
                                      onMouseLeave={() => {
                                        setCursorHovered(false);
                                        setCursorDesc(null);
                                      }}
                                      title="باز کردن وبسایت شخصی پارسا غائی"
                                      data-cursor-desc="باز کردن وبسایت شخصی پارسا غائی"
                                    >
                                      <span>پارسا غائی</span>
                                      <ExternalLink className="w-3.5 h-3.5 text-amber-400/80 group-hover/gold:text-amber-300 transition-transform group-hover/gold:translate-x-0.5 group-hover/gold:-translate-y-0.5 duration-200" />
                                    </a>
                                  </div>
                                );
                              }
                              return (
                                <p key={i} className="text-[10.5px] sm:text-xs text-slate-450 flex items-center gap-2.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                  <span>{bull}</span>
                                </p>
                              );
                            })}
                          </div>
                        </div>

                        <div className="md:col-span-5 h-full flex items-center justify-center">
                          <CoverIllustration />
                        </div>
                      </div>
                    )}

                    {/* TYPE 2: INTRODUCTION & NPD NEED & SCREENING & CONCLUSION */}
                    {(currentSlide.type === "intro" ||
                      currentSlide.type === "npd-need" ||
                      currentSlide.type === "idea-spotting" ||
                      currentSlide.type === "screening" ||
                      currentSlide.type === "feasibility" ||
                      currentSlide.type === "financial-feasibility" ||
                      currentSlide.type === "pilot" ||
                      currentSlide.type === "conclusion") && (
                      <div className="space-y-4 max-w-4xl">
                        <div className="space-y-1">
                          <span className="text-[10px] sm:text-xs font-mono tracking-wider text-indigo-400 font-bold uppercase">
                            پودمان پنجم • {currentSlide.category}
                          </span>
                          <h2 className="text-xl sm:text-2.5xl lg:text-3.5xl font-extrabold text-slate-100 tracking-tight">
                            {currentSlide.title}
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-400">{currentSlide.subtitle}</p>
                        </div>

                        {/* Beautiful grid for bullets */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2.5 border-t border-slate-900/60 auto-rows-auto">
                          {currentSlide.bullets?.map((bullet, idx) => {
                            // Give color markers dynamically
                            const isPurple = idx % 2 === 1;
                            return (
                              <div
                                key={idx}
                                className={`p-2.5 sm:p-3 rounded-xl border bg-slate-950/40 text-right space-y-0.5 transition-all duration-300 hover:scale-101 ${
                                  isPurple
                                    ? "border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/[0.02]"
                                    : "border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-500/[0.02]"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full shrink-0 ${isPurple ? "bg-purple-500" : "bg-indigo-500"}`} />
                                  <span className="text-[10px] text-slate-500 font-mono font-bold">بند {idx + 1} مبحث </span>
                                </div>
                                <p className="text-xs sm:text-13px text-slate-300 leading-relaxed font-sans font-medium">
                                  {bullet}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* TYPE 3: PROCESS FLOWCHART */}
                    {currentSlide.type === "process-diagram" && (
                      <div className="space-y-2.5">
                        <div className="space-y-0.5">
                          <span className="text-[10px] sm:text-xs font-mono tracking-wider text-indigo-400 font-bold uppercase">نمودار فرآیند کلی</span>
                          <h2 className="text-lg sm:text-xl lg:text-[22px] font-extrabold text-slate-100">{currentSlide.title}</h2>
                          <p className="text-[11px] sm:text-xs text-slate-400 leading-tight">{currentSlide.subtitle}</p>
                        </div>
                        
                        <div className="pt-1">
                          <ProcessFlowchart />
                        </div>
                      </div>
                    )}

                    {/* TYPE 4: DEVELOPMENT CONCEPT */}
                    {currentSlide.type === "development-concept" && (
                      <div className="space-y-2.5">
                        <div className="space-y-0.5">
                          <span className="text-[10px] sm:text-xs font-mono tracking-wider text-indigo-400 font-bold uppercase">پدیده توسعه تدریجی</span>
                          <h2 className="text-lg sm:text-xl lg:text-[22px] font-extrabold text-slate-100">{currentSlide.title}</h2>
                          <p className="text-[11px] sm:text-xs text-slate-400 leading-tight">{currentSlide.subtitle}</p>
                        </div>
                        
                        <div className="pt-1">
                          <WheelEvolution />
                        </div>
                      </div>
                    )}

                    {/* TYPE 5: THREE SOURCES OF IDEA GENERATION */}
                    {currentSlide.type === "idea-sources" && (
                      <div className="space-y-2.5">
                        <div className="space-y-0.5">
                          <span className="text-[10px] sm:text-xs font-mono tracking-wider text-indigo-400 font-bold uppercase">منابع ایده پردازی</span>
                          <h2 className="text-lg sm:text-xl lg:text-[22px] font-extrabold text-slate-100">{currentSlide.title}</h2>
                          <p className="text-[11px] sm:text-xs text-slate-400 leading-tight">{currentSlide.subtitle}</p>
                        </div>

                        {/* Interactive columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1.55 pt-1.5">
                          {currentSlide.interactiveData?.map((source: any) => {
                            const isSelected = selectedIdeaSource === source.id;
                            return (
                              <button
                                key={source.id}
                                onClick={() => {
                                  setSelectedIdeaSource(source.id);
                                  playBeep();
                                }}
                                className={`p-3 rounded-xl border text-right transition-all duration-300 relative ${
                                  isSelected
                                    ? "bg-slate-900 border-indigo-500 scale-102 shadow glow-indigo"
                                    : "bg-slate-950/40 border-slate-900 hover:bg-slate-900/40 hover:border-slate-800"
                                }`}
                              >
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-indigo-500 animate-pulse" : "bg-slate-700"}`} />
                                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-200">{source.title}</h4>
                                </div>
                                <p className="text-[10.5px] text-slate-350 leading-relaxed font-sans">{source.desc}</p>
                                
                                {isSelected && (
                                  <span className="absolute bottom-1.5 left-2 text-[7px] uppercase font-mono text-indigo-400 font-bold">بسیار موثر</span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        <div className="bg-slate-900/20 p-2 rounded-xl border border-slate-900 text-center text-[10px] text-slate-400 font-sans italic">
                          "علاوه بر ۳ مورد بالا، مهندسی معکوس و رصد پتنت‌های جهانی از بهترین راه‌های مفر ایده به شمار می‌روند."
                        </div>
                      </div>
                    )}

                    {/* TYPE 6: BRAINSTORMING */}
                    {currentSlide.type === "brainstorm" && (
                      <div className="space-y-2.5">
                        <div className="space-y-0.5">
                          <span className="text-[10px] sm:text-xs font-mono tracking-wider text-indigo-400 font-bold uppercase">قوانین طوفان فکری</span>
                          <h2 className="text-lg sm:text-xl lg:text-[22px] font-extrabold text-slate-100">{currentSlide.title}</h2>
                          <p className="text-[11px] sm:text-xs text-slate-400 leading-tight">{currentSlide.subtitle}</p>
                        </div>

                        {/* Four grid rule cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
                          {currentSlide.interactiveData?.map((r: any) => (
                            <div
                              key={r.rule}
                              className={`p-3 rounded-xl border border-slate-900 bg-slate-950/50 flex flex-col justify-between min-h-[125px] text-right transition-all duration-300 hover:border-indigo-500/30 hover:bg-slate-900 hover:scale-102`}
                            >
                              <div>
                                <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-400 font-bold px-1.5 py-0.5 rounded">
                                  قانون {r.rule}
                                </span>
                                <h4 className="text-xs font-bold text-slate-200 mt-2 mb-1">{r.title}</h4>
                              </div>
                              <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{r.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TYPE 7: BRAINSTORM PROHIBITIONS / BLOCKED WORDS */}
                    {currentSlide.type === "brainstorm-prohibitions" && (
                      <div className="space-y-2.5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                            <span className="text-[10px] sm:text-xs font-mono tracking-wider text-red-400 font-bold uppercase">عبارت‌های سمی ممنوعه</span>
                          </div>
                          <h2 className="text-lg sm:text-xl lg:text-[22px] font-extrabold text-slate-100">{currentSlide.title}</h2>
                          <p className="text-[11px] sm:text-xs text-slate-400 leading-tight">{currentSlide.subtitle}</p>
                        </div>

                        {/* Interactive reveal of prohibitions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
                          {currentSlide.bullets?.map((bullet, idx) => {
                            const [phrase, why] = bullet.split(" -> ");
                            const isRevealed = prohibitionReveal === idx;
                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  setProhibitionReveal(isRevealed ? null : idx);
                                  playBeep();
                                }}
                                className={`p-3 rounded-xl border text-right transition-all duration-300 flex flex-col justify-center min-h-[60px] relative ${
                                  isRevealed
                                    ? "bg-red-500/[0.04] border-red-500 text-slate-100"
                                    : "bg-slate-900/40 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <AlertTriangle className={`w-4 h-4 shrink-0 ${isRevealed ? "text-red-500 animate-bounce" : "text-slate-600"}`} />
                                  <p className="text-xs font-sans font-bold leading-relaxed">{phrase}</p>
                                </div>
                                
                                {isRevealed && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="pt-2 text-[11px] text-red-300 font-sans pr-7"
                                  >
                                    📢 چرا ممنوع است؟ {why}
                                  </motion.div>
                                )}

                                <span className="absolute bottom-1 left-2 text-[8px] font-mono text-slate-605 text-slate-500">
                                  {isRevealed ? "بستن توصیح" : "کلیک برای ریشه‌یابی"}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* TYPE 8: FIVE WHYS CONCEPT */}
                    {currentSlide.type === "five-whys-concept" && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-7 space-y-4 text-right">
                          <span className="text-[10px] sm:text-xs font-mono font-bold text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                            مدیریت و مهندسی ناب
                          </span>
                          <h2 className="text-xl sm:text-2.5xl lg:text-3.5xl font-extrabold text-slate-100 leading-tight">
                            {currentSlide.title}
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-400">{currentSlide.subtitle}</p>
                          
                          <div className="space-y-2 border-t border-slate-900 pt-3">
                            {currentSlide.bullets?.map((bull, i) => (
                              <p key={i} className="text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed font-sans">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
                                <span>{bull}</span>
                              </p>
                            ))}
                          </div>
                        </div>

                        <div className="md:col-span-5 h-full flex flex-col justify-center items-center gap-3 bg-indigo-500/[0.015] border border-slate-900 p-6 rounded-2xl">
                          <span className="text-5xl animate-bounce">❓</span>
                          <div className="text-3xl font-mono font-extrabold text-amber-400 tracking-wider">5 Whys</div>
                          <p className="text-[10.5px] text-slate-400 text-center leading-relaxed">تکرار قانونمند پرسش "چرا" عمیق‌ترین چشمه‌های علت یابی را به روی ما می‌گشاید.</p>
                        </div>
                      </div>
                    )}

                    {/* TYPE 9: FIVE WHYS EXAMPLE */}
                    {currentSlide.type === "five-whys-example" && (
                      <div className="space-y-2.5">
                        <div className="space-y-0.5">
                          <span className="text-[10px] sm:text-xs font-mono tracking-wider text-indigo-400 font-bold uppercase">آزمایش ملموس ۵ چرا</span>
                          <h2 className="text-lg sm:text-xl lg:text-[22px] font-extrabold text-slate-100">{currentSlide.title}</h2>
                          <p className="text-[11px] sm:text-xs text-slate-400 leading-tight">{currentSlide.subtitle}</p>
                        </div>
                        
                        <div className="pt-1">
                          <FiveWhysLadder />
                        </div>
                      </div>
                    )}

                    {/* TYPE 10: MARKET FEASIBILITY STUDY */}
                    {currentSlide.type === "market-feasibility" && (
                      <div className="space-y-2.5">
                        <div className="space-y-0.5">
                          <span className="text-[10px] sm:text-xs font-mono tracking-wider text-indigo-400 font-bold uppercase">سنجش بازار و ماتریکس 4P</span>
                          <h2 className="text-lg sm:text-xl lg:text-[22px] font-extrabold text-slate-100">{currentSlide.title}</h2>
                          <p className="text-[11px] sm:text-xs text-slate-400 leading-tight">{currentSlide.subtitle}</p>
                        </div>
                        
                        <div className="pt-1">
                          <FourPsGrid />
                        </div>
                      </div>
                    )}

                    {/* TYPE 11: TECHNICAL FEASIBILITY STUDY */}
                    {currentSlide.type === "technical-feasibility" && (
                      <div className="space-y-2.5">
                        <div className="space-y-0.5">
                          <span className="text-[10px] sm:text-xs font-mono tracking-wider text-indigo-400 font-bold uppercase">الزامات فیزیکی و ابزاری</span>
                          <h2 className="text-lg sm:text-xl lg:text-[22px] font-extrabold text-slate-100">{currentSlide.title}</h2>
                          <p className="text-[11px] sm:text-xs text-slate-400 leading-tight">{currentSlide.subtitle}</p>
                        </div>

                        {/* Visual cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-1.5">
                          {currentSlide.interactiveData?.map((item: any) => (
                            <div
                              key={item.key}
                              className="p-3 rounded-xl border border-slate-900 bg-slate-950/50 hover:bg-slate-900 hover:border-indigo-500/20 text-right space-y-1 flex flex-col justify-between min-h-[110px] transition-all duration-300 hover:scale-102"
                            >
                              <div className="w-7 h-7 rounded-md bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/10 mb-1">
                                {item.key === "space" && <Home className="w-4 h-4" />}
                                {item.key === "knowledge" && <BookOpen className="w-4 h-4" />}
                                {item.key === "tools" && <Wrench className="w-4 h-4" />}
                                {item.key === "human" && <CheckCircle2 className="w-4 h-4" />}
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-200">{item.label}</h4>
                                <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-1">{item.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TYPE 12: PATENT REGISTRATION */}
                    {currentSlide.type === "patent" && (
                      <div className="space-y-2.5">
                        <div className="space-y-0.5">
                          <span className="text-[10px] sm:text-xs font-mono tracking-wider text-indigo-400 font-bold uppercase">حقوق مالکیت فکری فدرال</span>
                          <h2 className="text-lg sm:text-xl lg:text-[22px] font-extrabold text-slate-100">{currentSlide.title}</h2>
                          <p className="text-[11px] sm:text-xs text-slate-400 leading-tight">{currentSlide.subtitle}</p>
                        </div>

                        {/* Conditions grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 pt-1">
                          {currentSlide.interactiveData?.conditions.map((cond: any, i: number) => {
                            const isPurple = i % 2 === 1;
                            return (
                              <div
                                key={i}
                                className={`p-3 rounded-xl border bg-slate-950/40 text-right space-y-1 transition-all duration-300 ${
                                  isPurple
                                    ? "border-purple-500/20 hover:border-gradient-purple"
                                    : "border-indigo-500/20 hover:border-gradient-indigo"
                                }`}
                              >
                                <h4 className="text-xs font-bold text-slate-200">{cond.title}</h4>
                                <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{cond.text}</p>
                              </div>
                            );
                          })}
                        </div>

                        <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl text-center text-[11px] text-amber-300 leading-relaxed font-sans max-w-3xl mx-auto">
                          📢 <strong>قانون کپی رایت مخترع:</strong> پتنت‌ها فرصت طلایی ۲۰ ساله انحصار مطلق تجاری در تولید محصول را به مخترعین اهدا می‌کنند.
                        </div>
                      </div>
                    )}

                    {/* TYPE 13: COMMERCIALIZATION PATHS */}
                    {currentSlide.type === "commercialization-paths" && (
                      <div className="space-y-2.5">
                        <div className="space-y-0.5">
                          <span className="text-[10px] sm:text-xs font-mono tracking-wider text-indigo-400 font-bold uppercase">۴ راه حل طلایی ثروت‌زایی</span>
                          <h2 className="text-lg sm:text-xl lg:text-[22px] font-extrabold text-slate-100">{currentSlide.title}</h2>
                          <p className="text-[11px] sm:text-xs text-slate-400 leading-tight">{currentSlide.subtitle}</p>
                        </div>
                        
                        <div className="pt-0.5">
                          <CommercializationCompare />
                        </div>
                      </div>
                    )}

                    {/* TYPE 14: THE END SLIDE */}
                    {currentSlide.type === "end" && (
                      <div className="text-center space-y-6 max-w-2xl mx-auto py-4 relative w-full h-full flex flex-col justify-between">
                        <div className="flex-1 flex flex-col justify-center space-y-6">
                          <div className="relative inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold text-xs uppercase animate-pulse self-center">
                            پتک نهایی: اتمام ارائه کلاسی
                          </div>
                          
                          <h1 id="end-title" className="text-3.5xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-slate-150 to-indigo-300">
                            {currentSlide.title}
                          </h1>
                          
                          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-amber-400 mx-auto rounded" />

                          <p id="end-subtitle" className="text-xs sm:text-lg text-slate-300 font-sans leading-relaxed italic max-w-lg mx-auto">
                            {currentSlide.subtitle}
                          </p>

                          <div className="grid grid-cols-3 gap-2 text-[10px] sm:text-xs text-slate-500 font-mono font-bold max-w-md mx-auto pt-4 border-t border-slate-900 w-full">
                            <div>پودمان پنجم</div>
                            <div>کاربر فناوری‌های نوین</div>
                            <div>نمره ارزیابی: ۲۰</div>
                          </div>
                        </div>

                        {/* Bottom-right absolute element */}
                        <div className="absolute bottom-0 right-0 md:bg-slate-900/40 md:backdrop-blur-sm px-3.5 py-2 rounded-2xl md:border md:border-slate-800/80 shadow-lg flex items-center justify-center pointer-events-auto z-30">
                          <div className="text-[10.5px] sm:text-xs text-slate-400 flex items-center gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
                            <span>تهیه کننده:</span>
                            <a
                              href="https://parsaghaei.dev"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-amber-400 font-bold hover:text-amber-300 transition-all cursor-pointer relative group/gold py-0.5"
                              style={{ textShadow: "0 0 14px rgba(245, 158, 11, 0.9)" }}
                              onMouseEnter={() => {
                                setCursorHovered(true);
                                setCursorDesc("باز کردن وبسایت شخصی پارسا غائی");
                              }}
                              onMouseLeave={() => {
                                setCursorHovered(false);
                                setCursorDesc(null);
                              }}
                              title="باز کردن وبسایت شخصی پارسا غائی"
                              data-cursor-desc="باز کردن وبسایت شخصی پارسا غائی"
                            >
                              <span>پارسا غائی</span>
                              <ExternalLink className="w-3.5 h-3.5 text-amber-400/80 group-hover/gold:text-amber-300 transition-transform group-hover/gold:translate-x-0.5 group-hover/gold:-translate-y-0.5 duration-200" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* SLIDE PROGRESS BAR & INTEGRATED NAVIGATION FOOTER */}
              <div className="border-t border-slate-900/60 pt-3 mt-auto flex flex-row items-center justify-between text-slate-500 text-[10px] sm:text-xs font-mono relative z-[48] gap-2 w-full flex-nowrap select-none">
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    id="tour-prev-slide"
                    onClick={handlePrevSlide}
                    className="px-2.5 py-1 rounded-lg border border-slate-850 bg-slate-900/40 hover:bg-slate-850 hover:border-slate-700 text-xs text-slate-300 transition-all duration-300 flex items-center gap-0.5 sm:gap-1 focus:none select-none shrink-0"
                    title="رفتن به اسلاید قبلی (در جهت راست)"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span>قبلی</span>
                  </button>

                  <div className="flex items-center gap-1 text-slate-450 font-sans pr-1">
                    <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse hidden xs:inline-block" />
                    <span className="text-[10px] sm:text-xs text-slate-400 whitespace-nowrap">اسلاید <strong className="text-slate-300 font-mono">{currentIndex + 1}</strong> از <strong className="text-slate-300 font-mono">{slidesData.length}</strong></span>
                  </div>
                </div>
                
                {/* Horizontal progress indicators */}
                <div id="tour-progress" className="flex-1 max-w-[80px] sm:max-w-md mx-2 h-1 rounded-full bg-slate-900 border border-slate-850 overflow-hidden hidden sm:block">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / slidesData.length) * 100}%` }}
                  />
                </div>



                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="hidden md:flex items-center gap-1 pl-1 text-[10px] text-slate-500 whitespace-nowrap">
                    <span>ریموت: </span>
                    <span className="key-badge text-[9px] px-1 py-0.5">‌←</span>
                    <span className="key-badge text-[9px] px-1 py-0.5">‌→</span>
                  </div>

                  <button
                    id="tour-next-slide"
                    onClick={handleNextSlide}
                    className="px-2.5 py-1 rounded-lg border border-slate-850 bg-slate-900/40 hover:bg-slate-850 hover:border-slate-700 text-xs text-indigo-300 font-bold transition-all duration-300 flex items-center gap-0.5 sm:gap-1 focus:none select-none shrink-0"
                    title="رفتن به اسلاید بعدی (در جهت چپ)"
                  >
                    <span>بعدی</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* DRAWING BOARD OVERLAY CANVAS */}
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawingTouch}
                onTouchMove={drawTouch}
                onTouchEnd={stopDrawing}
                className={`absolute inset-0 w-full h-full transition-opacity ${
                  drawingActive ? "pointer-events-auto cursor-crosshair opacity-100" : "pointer-events-none opacity-40 invisible"
                }`}
                style={{ zIndex: 45 }}
              />

            </div>

          </div>

          {/* PRESENTER SPEAKERS NOTES COLUMN SIDEBAR (PRESENTER MODE ONLY) */}
          {layoutMode === "presenter" && (
            <div
              id="presenter-speaker-panel"
              className="w-full lg:w-96 border-t lg:border-t-0 lg:border-r border-slate-900 bg-slate-950 flex flex-col justify-between overflow-hidden shrink-0 z-20 h-[300px] lg:h-auto"
            >
              
              {/* Presenter Stopwatch header */}
              <div className="p-4 border-b border-slate-900 bg-slate-950">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-200">پیشخوان مدیریت زمان ارائه</span>
                  </div>
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20 font-bold">
                    حالت پیشخوان ارائه‌دهنده
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  {/* Big stopwatch */}
                  <div className="flex items-center gap-2.5 bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-850">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <span className="text-xl font-mono font-extrabold tracking-wider text-slate-100">
                      {formatTime(elapsedTime)}
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => setTimerRunning(!timerRunning)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-350 transition-all"
                      title={timerRunning ? "توقف کرونومتر ارائه" : "ادامه کرونومتر ارائه"}
                    >
                      {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => {
                        setElapsedTime(0);
                        playBeep();
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-350 transition-all"
                      title="تنظیم مجدد زمان ارائه به صفر"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* SPEAKER CONTEXT NOTES CONTENT */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans pb-6">
                <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>نکات شفاهی ارائه دهنده (اسلاید {currentIndex + 1})</span>
                </div>

                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-900 leading-relaxed text-xs text-slate-300 font-sans leading-relaxed text-slate-250">
                  {currentSlide.notes ? (
                    <p className="whitespace-pre-wrap">
                      {(currentSlide as any).isEncrypted
                        ? decrypt(currentSlide.notes, presenterPassword)
                        : currentSlide.notes}
                    </p>
                  ) : (
                    <span className="italic text-slate-500">نکته شفاهی خاصی برای این اسلاید ثبت نشده است.</span>
                  )}
                </div>
              </div>

              {/* Presenter power quick tip */}
              <div className="p-3 border-t border-slate-900 bg-slate-950 font-sans text-[10px] text-slate-500 flex justify-between">
                <span>ریموت: راست/چپ کیبورد روی وایت‌برد</span>
                <span>فناوری‌های نوین</span>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* FOOTER DESK SUMMARY PANEL */}
      <footer id="desk-footer" className="border-t border-slate-900 bg-slate-950/80 backdrop-blur px-4 py-2 sm:px-6 flex items-center justify-between text-[11px] text-slate-500 relative z-40">
        <div>
          طراحی ویژه پودمان پنجم درس <strong className="text-slate-400">کاربر فناوری‌های نوین</strong> هدیه برای ارائه تیمی
        </div>
        <div className="hidden sm:block">
          تحت استانداردهای ارائه‌های مدرن و <strong className="text-indigo-400">TEDx Pitch Decks</strong> • سال تحصیلی ۱۴۰۵
        </div>
      </footer>

      {/* DRAWER LAYER 1: STUDY OUTLINE AND EXTRAS printable summary booklet */}
      <AnimatePresence>
        {summaryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden text-right font-sans"
            >
              
              {/* Drawer header */}
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-lg font-extrabold text-slate-100">
                    توشه‌راه خلاصه فشرده پودمان پنجم
                  </h3>
                  <p className="text-xs text-slate-400">مناسب مطالعه شبِ امتحان، پرینت کلاسی و بروشور ارائه دانش‌آموزی</p>
                </div>
                
                <button
                  onClick={() => {
                    setSummaryOpen(false);
                    playBeep();
                  }}
                  className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-450 border border-slate-800 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin max-h-[60vh]">
                
                <div className="bg-indigo-505/10 bg-indigo-500/10 border border-indigo-550/10 p-4 rounded-2xl">
                  <h4 className="text-xs font-bold text-indigo-300 mb-1">توضیح کوتاه دبیرخانه آموزشی درس:</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    این جزوه فشرده دربردارنده تمام کانسپت‌های پودمان پنجم از ایده تا محصول مطابق کتب درسی است. شما می‌توانید کل متن را کپی نموده یا جهت مباحثه استفاده کنید.
                  </p>
                </div>

                <div className="space-y-4">
                  {slidesData.map((s, idx) => (
                    <div
                      key={s.id}
                      className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/40 space-y-2 text-right"
                    >
                      <div className="flex items-center justify-between text-xs border-b border-slate-900 pb-2">
                        <span className="font-bold text-indigo-400">بخش {idx + 1}: {s.category}</span>
                        <span className="text-slate-500 font-mono">اسلاید {s.id}</span>
                      </div>
                      
                      <h4 className="text-normal font-bold text-slate-200">{s.title}</h4>
                      <p className="text-xs text-slate-400">{s.subtitle}</p>

                      <ul className="space-y-1.5 list-none pl-0 pt-2">
                        {s.bullets?.map((b, i) => (
                          <li key={i} className="text-xs text-slate-300 font-sans flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0 mt-2" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

              </div>

              {/* Drawer footer buttons */}
              <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">دیگر نگران خلاصه نویسی یا غیبت در پودمان پنجم نباشید!</span>
                <button
                  onClick={() => {
                    const isInsideIframe = typeof window !== "undefined" && window.self !== window.top;
                    if (isInsideIframe) {
                      setIframePrintWarning(true);
                      playBeep();
                    } else {
                      window.print();
                    }
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow shadow-indigo-500/10"
                >
                  <Printer className="w-4 h-4" />
                  <span>چاپ فیزیکی جزوه پودمان</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DRAWER LAYER 2: SHORTCUT HELP MANUAL */}
      <AnimatePresence>
        {helpOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 p-6 rounded-3xl w-full max-w-md text-right font-sans"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-100">راهنمای کلید شتاب دهنده ارائه کننده</h3>
                <button
                  onClick={() => {
                    setHelpOpen(false);
                    playBeep();
                  }}
                  className="p-1 rounded bg-slate-850 text-slate-450 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">اسلاید بعدی (حرکت رو به جلو)</span>
                  <div className="flex gap-1">
                    <span className="key-badge">‌←</span>
                    <span className="key-badge">Space</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">اسلاید قبلی (حرکت رو به عقب)</span>
                  <span className="key-badge">‌→</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">شروع مجدد ارائه از اسلاید اول</span>
                  <span className="key-badge">Home</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">فعال/غیرفعال کردن لیزر پوینتر</span>
                  <span className="key-badge">L</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">فعال/غیرفعال کردن قلم طراحی</span>
                  <span className="key-badge">D</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">خروج از حالت‌های جانبی یا رسم</span>
                  <span className="key-badge">Esc</span>
                </div>
                
                <div className="pt-3 border-t border-slate-800 mt-3 flex justify-center">
                  <button
                    onClick={() => {
                      manuallyStartTour();
                      playBeep();
                    }}
                    className="w-full py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-xl text-xs font-bold border border-indigo-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>نمایش دوباره راهنمای محیط نرم‌افزار</span>
                  </button>
                </div>
              </div>

              {/* Interactive slide icon guide */}
              <div className="pt-3 border-t border-slate-800/80 mb-3 space-y-1.5 text-right font-sans">
                <span className="text-[11.5px] font-bold text-slate-350 block">💡 راهنما و شناسایی المان‌های تعاملی</span>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  هر جا علامت چشمک‌زن <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8.5px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">⚡ تعاملی</span> را در بالای اسلاید دیدید، یعنی این که دکمه‌ها، نمودارها یا المان‌های تعاملی درون این اسلاید وجود دارد و می‌توانید با کلیک روی آن‌ها اطلاعات و جزئیات علمی افزون‌تری را مطالعه و در کلاس ارائه نمایید.
                </p>
              </div>

              <p className="text-[10px] text-slate-450 text-center leading-relaxed">
                با بهره‌گیری از کلید‌های میانبر فوق، کار با تخته هوشمند مدرسه را مانند بازاریابان باتجربه سیلیکون‌ولی هدایت کنید!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DRAWER LAYER 3: IFRAME PRINT WARNING EXPLANATION */}
      <AnimatePresence>
        {iframePrintWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 p-6 rounded-3xl w-full max-w-lg text-right font-sans shadow-2xl relative overflow-hidden"
            >
              {/* Top ambient colored gradient strip */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-505 to-indigo-500" />
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                  <h3 className="text-sm sm:text-base font-extrabold text-amber-500">راهنمای بارگیری و پرینت جزوه در Google AI Studio</h3>
                </div>
                <button
                  onClick={() => {
                    setIframePrintWarning(false);
                    playBeep();
                  }}
                  className="p-1 rounded bg-slate-850 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-4 space-y-4 text-xs leading-relaxed text-slate-300 font-medium">
                <p className="font-bold text-slate-200">
                  همکلاسی گرامی، حدس شما کاملاً درست است! 🎯
                </p>
                
                <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl space-y-2">
                  <span className="text-red-400 font-bold block">❌ علت کار نکردن مستقیم در پیش‌نمایش:</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    محیط <strong className="text-slate-200">پیش‌نمایش وب‌اپلیکیشن در Google AI Studio</strong> بر بستر یک قاب امنیتی شبیه‌ساز یا همان <strong className="text-slate-200">Iframe</strong> بسیار محدودشده اجرا می‌شود. مرورگرهای کامپیوتر صراحتاً به دلایل امنیتی برای پیشگیری از نفوذ، فراخوانی تابع سیستمی <code className="bg-slate-800 px-1 py-0.5 rounded text-indigo-400 font-mono">window.print()</code> را به صورت مستقیم در داخل فریم‌های تودرتو مسدود می‌کنند.
                  </p>
                </div>

                <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-2">
                  <span className="text-indigo-400 font-bold block">💡 راه‌حل فوق‌العاده ساده و تضمین‌شده:</span>
                  <ol className="list-decimal list-inside text-[11px] text-slate-350 space-y-1.5 font-sans">
                    <li>در بالای کادر هدر همین ویرایشگر بزرگ پیش‌نمایش، روی نماد <strong className="text-white">«باز کردن در تب مستقل» (↗️ Open in New Tab)</strong> کلیک کنید تا سایت مستقل باز شود.</li>
                    <li>پس از باز شدن خودکار آدرس مستقل وب‌سایت در صفحه جدید، مجدداً دکمه <strong className="text-white">«چاپ فیزیکی جزوه پودمان»</strong> را فشار دهید.</li>
                    <li>جهت ثبت خاطره علمی عالی، پنجره پرینت پیشرفته مرورگر باز گردیده و می‌توانید دفترچه را فیزیکی چاپ کنید یا به راحتی به صورت فایل <strong className="text-emerald-450 font-extrabold">PDF</strong> ذخیره کنید!</li>
                  </ol>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-850 flex justify-end">
                <button
                  onClick={() => {
                    setIframePrintWarning(false);
                    playBeep();
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  فهمیدم، بستن راهنما
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </div> {/* Closing tag for the Presentation Layout Core wrapper */}

      {/* 4. PREMIUM LIQUID GLASS CUSTOM CURSOR & DYNAMIC HOVER DESCRIPTIONS */}
      {cursorVisible && (!laserPointerActive || !mouseOverSlide) && (
        <>
          {/* Outer ring */}
          <div
            className="fixed pointer-events-none rounded-full border border-purple-450/40 z-[99999] -translate-x-1/2 -translate-y-1/2 will-change-transform"
            style={{
              left: `${globalMousePos.x}px`,
              top: `${globalMousePos.y}px`,
              width: cursorHovered ? '46px' : '18px',
              height: cursorHovered ? '46px' : '18px',
              backgroundColor: cursorHovered ? 'rgba(168, 85, 247, 0.12)' : 'rgba(99, 102, 241, 0.04)',
              boxShadow: cursorHovered 
                ? '0 0 16px 2px rgba(168, 85, 247, 0.35), inset 0 0 10px rgba(255, 255, 255, 0.25)' 
                : '0 0 8px rgba(99, 102, 241, 0.1)',
              transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s, box-shadow 0.2s',
            }}
          />
          {/* Inner solid dot */}
          <div
            className="fixed pointer-events-none rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 z-[100000] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_6px_rgba(168,85,247,0.7)] will-change-transform"
            style={{
              left: `${globalMousePos.x}px`,
              top: `${globalMousePos.y}px`,
              width: cursorHovered ? '4px' : '6px',
              height: cursorHovered ? '4px' : '6px',
              transition: 'width 0.25s, height 0.25s',
            }}
          />
          {/* Custom Cursor Description Tooltip - Liquid Glass Style */}
          {cursorDesc && (
            <div
              className="fixed pointer-events-none z-[99998] bg-gradient-to-br from-white/15 via-white/5 to-white/0 border-t border-l border-white/45 border-r border-b border-white/10 backdrop-blur-xl rounded-full px-4 py-2 text-[11px] text-white shadow-[0_15px_30px_-5px_rgba(168,85,247,0.18),0_10px_25px_-5px_rgba(0,0,0,0.45),inset_0_1.5px_4px_rgba(255,255,255,0.55)] flex items-center gap-2 transition-all duration-200 select-none"
              style={{
                left: `${globalMousePos.x}px`,
                top: `${globalMousePos.y}px`,
                transform: `${
                  globalMousePos.x + 245 > window.innerWidth ? 'translateX(-100%) translateX(-12px)' : 'translateX(16px)'
                } ${
                  globalMousePos.y + 45 > window.innerHeight ? 'translateY(-32px)' : 'translateY(-12px)'
                } ${cursorHovered ? 'scale(1)' : 'scale(0.85) translateY(4px)'}`,
                opacity: cursorHovered ? 1 : 0,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 shadow-[0_0_6px_rgba(244,63,94,0.7)] shrink-0 animate-pulse" />
              <span className="whitespace-nowrap font-sans font-bold text-slate-100 tracking-tight text-[11px]">{cursorDesc}</span>
            </div>
          )}
        </>
      )}

      {/* Onboarding Logic */}
      <AnimatePresence>
        {!loading && onboardingVisible && <StartupOverlay onStart={handleStartup} />}
      </AnimatePresence>
      {guidedTourState === "playing" && (
        <TourGuide
          steps={TOUR_STEPS}
          onFinish={() => {
            setGuidedTourState("hidden");
            setShowTourCompletion(true);
            playBeep();
          }}
        />
      )}

      {/* Tour Completion Modal */}
      <TourCompletionModal
        isOpen={showTourCompletion}
        onClose={() => {
          setShowTourCompletion(false);
          setHasTourCompleted(true);
        }}
        playBeep={playBeep}
      />

      {/* Presenter Auth Modal */}
      <PresenterPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onUnlock={(password) => {
          setIsPresenterUnlocked(true);
          setPresenterPassword(password);
          setLayoutMode("presenter");
          setShowPasswordModal(false);
        }}
        playBeep={playBeep}
      />
    </div>
  );
}
