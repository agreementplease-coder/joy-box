import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gift, 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  RotateCcw, 
  Heart, 
  Eye, 
  ArrowLeft, 
  ArrowRight, 
  Smile, 
  BookOpen, 
  Cake, 
  Award, 
  Mail, 
  Volume2, 
  Send,
  PartyPopper,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { encodeData, decodeData, GiftPayload } from './crypto';

// Definitions for the curated premium themes
interface AppTheme {
  id: string;
  name: string;
  bgGradient: string;
  cardBg: string;
  cardTextColor: string;
  textAccent: string;
  buttonBg: string;
  boxColor: string;
  borderColor: string;
  glowColor: string;
  floatingEmojis: string[];
}

const THEMES: AppTheme[] = [
  {
    id: 'pink',
    name: 'الغروب الدافئ 🌅',
    bgGradient: 'from-rose-500 via-orange-400 to-amber-300',
    cardBg: 'bg-white/95 backdrop-blur-md border border-white',
    cardTextColor: 'text-slate-800',
    textAccent: 'text-orange-600',
    buttonBg: 'bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600',
    boxColor: '#f97316', // orange-500
    borderColor: 'border-orange-200/50',
    glowColor: 'shadow-orange-500/50',
    floatingEmojis: ['🌸', '✨', '💖', '🎈', '🧡']
  },
  {
    id: 'classic',
    name: 'الملكي الدافئ ❤️',
    bgGradient: 'from-red-600 via-amber-600 to-red-800',
    cardBg: 'bg-white/12 backdrop-blur-xl border border-white/25',
    cardTextColor: 'text-white',
    textAccent: 'text-amber-200',
    buttonBg: 'bg-gradient-to-r from-red-500 via-amber-500 to-red-600 hover:from-red-600 hover:to-amber-600',
    boxColor: '#dc2626', // red-600
    borderColor: 'border-amber-300/40',
    glowColor: 'shadow-amber-500/50',
    floatingEmojis: ['❤️', '✨', '🎁', '🎈', '🎉']
  },
  {
    id: 'cosmic',
    name: 'الكوني الساحر 🌌',
    bgGradient: 'from-slate-950 via-purple-950 to-indigo-900',
    cardBg: 'bg-black/40 backdrop-blur-2xl border border-white/10',
    cardTextColor: 'text-purple-50',
    textAccent: 'text-fuchsia-300',
    buttonBg: 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:from-fuchsia-600 hover:to-indigo-600',
    boxColor: '#a78bfa', // violet-400
    borderColor: 'border-purple-500/35',
    glowColor: 'shadow-purple-500/40',
    floatingEmojis: ['🌌', '⭐', '✨', '🛸', '🔮']
  },
  {
    id: 'emerald',
    name: 'الزمردي الأنيق 💚',
    bgGradient: 'from-emerald-800 via-teal-900 to-emerald-950',
    cardBg: 'bg-white/8 backdrop-blur-xl border border-white/15',
    cardTextColor: 'text-white',
    textAccent: 'text-emerald-300',
    buttonBg: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600',
    boxColor: '#10b981', // emerald-500
    borderColor: 'border-emerald-500/30',
    glowColor: 'shadow-emerald-500/40',
    floatingEmojis: ['💚', '✨', '🌿', '🔔', '🌟']
  },
  {
    id: 'sunset',
    name: 'العيد السعيد 🎈',
    bgGradient: 'from-amber-500 via-rose-500 to-pink-600',
    cardBg: 'bg-white/12 backdrop-blur-xl border border-white/20',
    cardTextColor: 'text-white',
    textAccent: 'text-amber-200',
    buttonBg: 'bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600',
    boxColor: '#ec4899', // pink-500
    borderColor: 'border-orange-200/40',
    glowColor: 'shadow-orange-500/50',
    floatingEmojis: ['✨', '☀️', '🍊', '🍂', '🌹']
  }
];

// Curated gift models/styles
interface BoxStyle {
  id: string;
  name: string;
  emoji: string;
  closedDesc: string;
  openedDesc: string;
}

const BOX_STYLES: BoxStyle[] = [
  { id: 'gift', name: 'صندوق الهدايا 🎁', emoji: '🎁', closedDesc: 'صندوق الهدايا الكلاسيكي الفاخر بملمس مخملي وشريط حريري برّاق', openedDesc: 'انفجر الصندوق مطلقاً هالة غامرة من البهجة والمحبة والقصاصات الملوّنة!' },
  { id: 'cake', name: 'كعكة هنيئة 🎂', emoji: '🎂', closedDesc: 'كعكة الأعياد التفاعلية المزينة بكريم الفانيلا والشموع المضيئة', openedDesc: 'أطفئنا الشموع وانثنينا فرحاً في هذا اليوم السعيد الخالد!' },
  { id: 'love', name: 'رسالة ودّ ✉️', emoji: '✉️', closedDesc: 'مظروف رسائل مغلق برفق ومطرز بقلب ذهبي دافئ ومحبة أصيلة', openedDesc: 'فُتح الغلاف لتسري طاقة الكلمات الرقيقة وتعانق روحك الطيبة!' },
  { id: 'trophy', name: 'كأس فوز 🏆', emoji: '🏆', closedDesc: 'كأس التفوق الذهبي المخصص لتوثيق اللحظات العظيمة والنجاح الملهم', openedDesc: 'ألف مبروك الصعود وتحقيق القمة المستحقة والتميّز المستمر!' },
  { id: 'star', name: 'نجم أمنيات ⭐', emoji: '⭐', closedDesc: 'النجمة السحرية المتوهجة بالأمنيات ومشاعر الود والجمال الصادقة', openedDesc: 'أبرقت النجمة الساطعة في سمائك بأخلص عبارات التبريك والوفاء!' }
];

// Ready-to-use celebration templates
interface Template {
  title: string;
  text: string;
  themeId: string;
  boxStyleId: string;
  badgeColorClass: string;
}

const TEMPLATES: Template[] = [
  { 
    title: "🎁 قالب عيد ميلاد", 
    text: "كل عام وأنتِ بخير يا أغلى صديقة! أتمنى لكِ سنة مليئة بالنجاح والسعادة والتفوق. شكراً لأنكِ دائماً بجانبي ❤️✨",
    themeId: 'pink',
    boxStyleId: 'gift',
    badgeColorClass: 'bg-orange-100 text-orange-600 hover:bg-orange-200'
  },
  { 
    title: "🎉 تهنئة نجاح", 
    text: "ألف مبروك النجاح والتفوق الباهر! 🎉 جهدك المبارك وسعيك الدؤوب قد أثمرا اليوم فخراً عظيماً. نرجو لك دوام التقدّم والصعود نحو أعلى مراتب المجد.",
    themeId: 'classic',
    boxStyleId: 'trophy',
    badgeColorClass: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
  },
  { 
    title: "💌 رسالة شكر وتقدير", 
    text: "أردت فقط أن أخبرك كم أنت شخص رائع ومميز للغاية في حياتي! ✨ شكراً لكونك الروح الصادقة والقلب النبيل الذي يسعد الجميع دائماً.",
    themeId: 'sunset',
    boxStyleId: 'love',
    badgeColorClass: 'bg-pink-100 text-pink-600 hover:bg-pink-200'
  }
];

export default function App() {
  // Navigation states: 'create' | 'preview' | 'result' | 'receive'
  const [step, setStep] = useState<'create' | 'preview' | 'result' | 'receive'>('create'); 
  
  // Custom states
  const [name, setName] = useState('سارة القحطاني');
  const [message, setMessage] = useState('كل عام وأنتِ بخير يا أغلى سارة! أتمنى لكِ سنة مليئة بالنجاح والسعادة والتفوق. شكراً لأنكِ دائماً بجانبي ❤️✨');
  const [selectedThemeId, setSelectedThemeId] = useState('pink');
  const [selectedBoxStyleId, setSelectedBoxStyleId] = useState('gift');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [isBoxOpened, setIsBoxOpened] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Loading states
  const [initialLoading, setInitialLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Custom visual components feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Auto detect if the user opened as a receiver
  useEffect(() => {
    // Elegant loading screen period on initial site entrance
    const loadTimer = setTimeout(() => {
      setInitialLoading(false);
    }, 1800);

    const urlParams = new URLSearchParams(window.location.search);
    const giftParam = urlParams.get('gift');
    if (giftParam) {
      const decoded = decodeData(giftParam);
      if (decoded) {
        setName(decoded.name || '');
        setMessage(decoded.msg || '');
        setSelectedThemeId(decoded.theme || 'pink');
        setSelectedBoxStyleId(decoded.boxStyle || 'gift');
        setStep('receive');
      } else {
        showToast('عذراً، يبدو أن رابط المفاجأة يحتوي على خطأ أو تم التلاعب به.', 'error');
      }
    }

    return () => clearTimeout(loadTimer);
  }, []);

  // Quick toast notification setup
  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message: msg, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Current active configuration theme
  const activeTheme = THEMES.find(t => t.id === selectedThemeId) || THEMES[0];
  const activeBoxStyle = BOX_STYLES.find(b => b.id === selectedBoxStyleId) || BOX_STYLES[0];

  // Confetti showstopper function (Creates multiple spatial explosions on opening)
  const triggerConfettiExplosion = () => {
    // 1. Center big impact burst
    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.65 },
      colors: ['#ffe4e6', '#f43f5e', '#a855f7', '#3b82f6', '#f59e0b', '#10b981']
    });

    // 2. Left side delay burst
    setTimeout(() => {
      confetti({
        particleCount: 90,
        angle: 60,
        spread: 60,
        origin: { x: 0.05, y: 0.75 },
        colors: ['#3b82f6', '#a855f7', '#ffedd5', '#f43f5e']
      });
    }, 200);

    // 3. Right side delay burst
    setTimeout(() => {
      confetti({
        particleCount: 90,
        angle: 120,
        spread: 60,
        origin: { x: 0.95, y: 0.75 },
        colors: ['#10b981', '#f59e0b', '#ec4899', '#3b82f6']
      });
    }, 350);

    // 4. Sky heavy cascade rain
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.3 }
      });
    }, 800);
  };

  // Interact with the box
  const handleBoxClick = () => {
    if (isBoxOpened) return;
    
    // Shake first for build-up then pop open
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      setIsBoxOpened(true);
      triggerConfettiExplosion();
      showToast('تم فتح الصندوق السحري واندفاع الألوان! ✨🎨', 'success');
    }, 600);
  };

  // Compile final encrypted link for the creator
  const generateCelebrationLink = () => {
    if (!name.trim() || !message.trim()) {
      showToast('يرجى كتابة اسم المستلم ورسالته للمفاجأة أولاً.', 'error');
      return;
    }
    
    // Smooth custom heart loader transition during compilation
    setIsGenerating(true);

    setTimeout(() => {
      const encrypted = encodeData(name, message, selectedThemeId, selectedBoxStyleId);
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      const finalUrl = `${origin2Clean()}${pathname}?gift=${encrypted}`;
      setGeneratedUrl(finalUrl);
      setIsGenerating(false);
      setStep('result');
      showToast('تم صياغة رابط المفاجأة السحرية بنجاح! 🏆✨', 'success');
    }, 1800);
  };

  const origin2Clean = () => {
    // Avoid double slashes or port references if not matching
    return window.location.origin;
  };

  // Safe clipboard copying with high-fidelity custom fallback for iframe sandboxes
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      showToast('تم نسخ الرابط بنجاح! جاهز للإرسال 📋✨', 'success');
    } catch {
      // Robust classic input selection fallback for iframe restrictions
      const inputEl = document.getElementById('generated-link-input') as HTMLInputElement;
      if (inputEl) {
        inputEl.select();
        inputEl.setSelectionRange(0, 99999); // for mobile
        try {
          document.execCommand('copy');
          showToast('تم النسخ يدوياً بنجاح! 📋✨', 'success');
        } catch {
          showToast('يرجى تظليل الرابط والضغط على نسخ.', 'error');
        }
      }
    }
  };

  // Apply a template directly to fields
  const applyTemplate = (t: Template) => {
    setMessage(t.text);
    setSelectedThemeId(t.themeId);
    setSelectedBoxStyleId(t.boxStyleId);
    showToast(`تم تطبيق قالب التهنئة الفوري ✨`, 'info');
  };

  // Return to editing setup
  const handleBackToEdit = () => {
    setIsBoxOpened(false);
    setStep('create');
  };

  if (initialLoading) {
    return (
      <div id="joybox-initial-loader" className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex flex-col items-center justify-center relative overflow-hidden font-sans" style={{ direction: 'rtl' }}>
        {/* Immersive background decoration */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="heart-loader-container">
            <div className="container">
              <div className="preloader">
                <span />
                <span />
                <span />
              </div>
              <div className="shadow" />
            </div>
          </div>
        </div>
        <p className="text-slate-700 font-bold text-lg animate-pulse mt-12 z-10 select-none">
          جاري تجهيز صندوق الفرح... ✨🌹
        </p>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div id="joybox-generating-loader" className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex flex-col items-center justify-center relative overflow-hidden font-sans" style={{ direction: 'rtl' }}>
        {/* Immersive background decoration */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="heart-loader-container">
            <div className="container">
              <div className="preloader">
                <span />
                <span />
                <span />
              </div>
              <div className="shadow" />
            </div>
          </div>
        </div>
        <p className="text-slate-700 font-bold text-lg animate-pulse mt-12 z-10 select-none">
          جاري تشفير وصياغة رابط المفاجأة السحرية... 🔒✨
        </p>
      </div>
    );
  }

  return (
    <div id="joybox-root" className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 text-slate-800 flex flex-col justify-between relative overflow-hidden font-sans pt-1">
      
      {/* Dynamic Background Floaties depending on selected Theme in Recipient space */}
      {step === 'receive' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float-slow text-2xl"
              style={{
                top: `${Math.random() * 90}%`,
                left: `${Math.random() * 95}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${10 + Math.random() * 12}s`,
              }}
            >
              {activeTheme.floatingEmojis[i % activeTheme.floatingEmojis.length]}
            </div>
          ))}
        </div>
      )}

      {/* Floating custom responsive Toast alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            id="joybox-toast"
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm bg-slate-900/95 backdrop-blur-md rounded-2xl border border-white/20 p-4 shadow-2xl flex items-center justify-between gap-3 text-right text-white"
            style={{ direction: 'rtl' }}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400"><CheckCircle2 className="w-5 h-5" /></div>}
              {toast.type === 'info' && <div className="p-2 rounded-full bg-orange-500/20 text-orange-400"><Sparkles className="w-5 h-5" /></div>}
              {toast.type === 'error' && <div className="p-2 rounded-full bg-rose-500/20 text-rose-400"><AlertCircle className="w-5 h-5" /></div>}
              <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-normal">{toast.message}</p>
            </div>
            <button 
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-200 text-xs font-bold mr-2 p-1 hover:bg-white/5 rounded cursor-pointer"
            >
              إغلاق
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Applet Body fitted beautifully to are "Vibrant Palette" mockup */}
      <main className="w-full flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 z-10 relative">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: CREATE GIFT - SIGNATURE SPLIT DUAL SCREEN VIEW! */}
          {step === 'create' && (
            <motion.div
              key="step-create"
              id="joybox-panel-create"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-6xl bg-white rounded-[32px] sm:rounded-[48px] shadow-[0_32px_64px_-12px_rgba(251,146,60,0.22)] border-4 sm:border-8 border-white flex flex-col lg:flex-row overflow-hidden text-right leading-relaxed"
              style={{ direction: 'rtl' }}
            >
              
              {/* LEFT SUITE: CREATION CONTROLS (7/12 layout) */}
              <div className="w-full lg:w-7/12 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
                
                {/* Header elements with Beta Tag */}
                <header>
                  <span className="inline-block px-4 py-1.5 bg-rose-100 text-rose-600 rounded-full text-xs font-black uppercase tracking-widest mb-4 italic select-none">
                    Beta 2.0
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight mb-2">
                    صندوق الفرح <span className="text-transparent bg-clip-text bg-gradient-to-l from-rose-500 to-orange-500 tracking-tighter italic">JoyBox</span>
                  </h1>
                  <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                    اصنع لحظة سحرية لشخص تحبه بلمسة زر واحدة. رسالة مشفرة، مفاجأة مبهجة بالألوان، وذكرى لا تُنسى بدون إعلانات.
                  </p>
                </header>

                {/* Form fields */}
                <div className="space-y-5">
                  
                  {/* RECIPIENT INPUT */}
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-400 mr-2 flex items-center gap-1">
                      <Smile className="w-4 h-4 text-rose-500 inline" />
                      اسم صاحب الحظ السعيد (المستلم):
                    </label>
                    <input
                      id="recipient-name-input"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setIsBoxOpened(false); // Close preview box for freshness on input modification
                      }}
                      placeholder="اكتب اسم من تحب هنا..."
                      maxLength={40}
                      className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-base sm:text-lg font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-orange-300 focus:bg-white transition-all"
                    />
                  </div>

                  {/* CUSTOM MESSAGE TEXTAREA */}
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-400 mr-2 flex items-center gap-1">
                      <Heart className="w-4 h-4 text-rose-500 inline" />
                      رسالتك الخاصة والدافئة:
                    </label>
                    <textarea
                      id="celebration-message-input"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        setIsBoxOpened(false); // Close preview box for freshness
                      }}
                      placeholder="اكتب مشاعرك المبهجة وعباراتك الجميلة هنا..."
                      rows={3}
                      maxLength={1000}
                      className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm sm:text-base font-semibold text-slate-700 h-28 sm:h-32 resize-none focus:outline-none focus:border-orange-300 focus:bg-white transition-all leading-relaxed"
                    />
                  </div>

                  {/* CELEBRATION TEMPLATES CHIPS */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 mr-2 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-orange-500 inline" />
                      إدراج رسائل جاهزة ومفتوحة بالكامل للمناسبات:
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {TEMPLATES.map((t, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => applyTemplate(t)}
                          className={`whitespace-nowrap px-4 py-2 ${t.badgeColorClass} rounded-full text-xs font-black hover:scale-105 transition-all cursor-pointer border ${
                            message === t.text ? 'ring-2 ring-orange-400 font-extrabold scale-105' : 'border-transparent'
                          }`}
                        >
                          {t.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* VISUAL THEME SELECTOR */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 mr-2 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 inline" />
                      اختر الطابع اللوني الفني (Theme):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {THEMES.map((theme) => (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => {
                            setSelectedThemeId(theme.id);
                            setIsBoxOpened(false); // fresh preview
                            showToast(`تم تعيين طابع: ${theme.name.split(' ')[0]} 💫`, 'info');
                          }}
                          className={`p-2 rounded-xl border-2 flex items-center justify-center gap-1.5 transition-all text-[11px] font-bold cursor-pointer ${
                            selectedThemeId === theme.id
                              ? 'border-orange-400 bg-orange-50 text-slate-900 shadow-sm'
                              : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${theme.bgGradient} border border-white`} />
                          <span className="truncate">{theme.name.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* BOX STYLE SELECTION CHIPS */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 mr-2 flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5 text-rose-500 inline" />
                      شكل ونمط المفاجأة المغلق:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {BOX_STYLES.map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => {
                            setSelectedBoxStyleId(style.id);
                            setIsBoxOpened(false); // fresh preview
                            showToast(`تم تغيير نمط العلبة: ${style.name.split(' ')[0]} 📦`, 'info');
                          }}
                          className={`p-2 rounded-xl border-2 flex items-center justify-center gap-1.5 transition-all text-[11px] font-bold cursor-pointer ${
                            selectedBoxStyleId === style.id
                              ? 'border-rose-400 bg-rose-50 text-slate-900 shadow-sm'
                              : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-sm">{style.emoji}</span>
                          <span className="truncate">{style.name.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Left side actions bar matching mockup */}
                <footer className="flex flex-col sm:flex-row gap-4 mt-6 pt-4 border-t border-slate-100">
                  <button
                    id="generate-url-direct-btn"
                    onClick={generateCelebrationLink}
                    disabled={!name.trim() || !message.trim()}
                    className="flex-1 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-base sm:text-xl font-black rounded-3xl shadow-lg shadow-orange-200 hover:brightness-110 active:scale-98 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    إنشاء الرابط السحري ✨
                  </button>
                  <button
                    id="trigger-live-preview-btn"
                    onClick={() => {
                      setStep('preview');
                      setIsBoxOpened(false); // reset
                    }}
                    disabled={!name.trim() || !message.trim()}
                    className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-3xl font-black hover:text-slate-800 transition-all cursor-pointer disabled:opacity-40 text-sm sm:text-base flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    معاينة كاملة 👁️
                  </button>
                </footer>

              </div>

              {/* RIGHT SUITE: IMMERSIVE PREVIEW CARD PANEL (5/12 layout representation) */}
              <div 
                className={`w-full lg:w-5/12 bg-gradient-to-br ${activeTheme.bgGradient} p-8 lg:p-12 flex flex-col items-center justify-center relative min-h-[400px] lg:min-h-full transition-all duration-700`}
                style={{ direction: 'rtl' }}
              >
                {/* Decorative visual nodes mock up */}
                <div className="absolute top-10 right-10 w-12 h-12 bg-white/20 rounded-full blur-xl pointer-events-none" />
                <div className="absolute bottom-20 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute top-1/4 left-8 w-4 h-4 bg-yellow-300 rounded-sm rotate-45 opacity-60 pointer-events-none" />
                <div className="absolute bottom-1/3 right-8 w-3 h-3 bg-white rounded-full opacity-60 pointer-events-none" />

                {/* Interactive visual mockup block */}
                <div className="relative z-10 text-center flex flex-col items-center justify-center w-full max-w-sm">
                  
                  <AnimatePresence mode="wait">
                    {!isBoxOpened ? (
                      /* CLOSED STATE PREVIEW CONTAINER */
                      <motion.div
                        key="creator-box-preview-closed"
                        className="cursor-pointer flex flex-col items-center group select-none"
                        onClick={handleBoxClick}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        {/* Interactive Box emoji bouncing */}
                        <motion.div
                          animate={
                            isShaking
                              ? { 
                                  x: [-8, 8, -6, 6, -4, 4, -2, 2, 0],
                                  y: [-3, 1, -2, 1, -1, 0],
                                  rotate: [-3, 3, -2, 2, -1, 1, 0],
                                }
                              : {}
                          }
                          transition={{ duration: 0.5, ease: 'easeInOut' }}
                          className="text-[120px] sm:text-[140px] leading-none mb-6 filter drop-shadow-2xl animate-bounce"
                        >
                          {activeBoxStyle.emoji}
                        </motion.div>

                        {/* White rounded card mimicking the layout mock beautifully */}
                        <div className="bg-white/95 backdrop-blur-md p-6 rounded-[32px] shadow-2xl border-2 border-white max-w-[280px] rotate-3 text-right">
                          <div className="flex justify-center mb-3 text-orange-500 gap-1 select-none">
                            <span className="text-xl font-black">★</span>
                            <span className="text-xl font-black">★</span>
                            <span className="text-xl font-black">★</span>
                          </div>
                          <h3 className="text-slate-800 font-extrabold text-lg mb-1">
                            المفاجأة جاهزة لـ {name || 'الأحبة'}!
                          </h3>
                          <p className="text-slate-500 text-[11px] sm:text-xs font-bold leading-normal">
                            انقر فوق العلبة لترى سحر الألوان الملوّنة ونموذج الرّسالة في هذا القالب.
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      /* OPENED STATE PREVIEW CONTAINER */
                      <motion.div
                        key="creator-box-preview-opened"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="w-full bg-white/95 backdrop-blur-md p-6 sm:p-7 rounded-[32px] shadow-2xl border-2 border-white max-w-[320px] text-right font-sans rotate-1"
                      >
                        <div className="flex items-center justify-between pb-2.5 mb-3.5 border-b border-slate-100 text-xs text-slate-400 font-bold">
                          <span>JoyBox ✨</span>
                          <span className="text-orange-500 font-black">محاكاة حية 👁️</span>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-bold leading-none">إلى العزيز/ة:</span>
                            <h2 className="text-base sm:text-lg font-black text-slate-800 leading-tight">
                              {name || 'سارة القحطاني'} ❤️
                            </h2>
                          </div>
                          
                          <div className="bg-slate-50 border border-slate-100 p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-semibold text-slate-600 line-clamp-4 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap">
                            {message || 'كتابة رسالتك الخاصة والدافئة بأمان...'}
                          </div>
                        </div>

                        {/* Simple reset helper */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                          <button
                            type="button"
                            onClick={() => {
                              setIsBoxOpened(false);
                              showToast('تمت إعادة إغلاق العلبة للتجربة الكبرى.', 'info');
                            }}
                            className="hover:text-slate-700 underline font-black flex items-center gap-0.5"
                          >
                            <RotateCcw className="w-2.5 h-2.5" />
                            إغلاق صندوق المعاينة
                          </button>
                          <span>الفرح مشفّر بالكامل 🔒</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* Over 5k users footer block */}
                <div className="mt-10 text-white/90 flex flex-col items-center gap-2 select-none">
                  <div className="flex -space-x-3 space-x-reverse">
                    <div className="w-8 h-8 rounded-full border-2 border-orange-400 bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold">
                      +5k
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-orange-400 bg-rose-300" />
                    <div className="w-8 h-8 rounded-full border-2 border-orange-400 bg-blue-300" />
                    <div className="w-8 h-8 rounded-full border-2 border-orange-400 bg-indigo-300" />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-wider">
                    أكثر من 5,000 شخص شجروا الفرح والتهنئة اليوم
                  </p>
                </div>

              </div>
              
            </motion.div>
          )}

          {/* STEP 2: PREVIEW MODE (Simulating full-screen receiver encounter before sending) */}
          {step === 'preview' && (
            <motion.div
              key="step-preview"
              id="joybox-panel-preview"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-xl bg-white rounded-[42px] overflow-hidden border-8 border-white shadow-[0_32px_64px_-12px_rgba(251,146,60,0.22)] flex flex-col relative"
              style={{ minHeight: '520px' }}
            >
              
              {/* Top Control Bar matching style with Orange actions */}
              <div 
                className="w-full bg-slate-50 p-4 flex justify-between items-center border-b border-slate-100 z-20 shrink-0"
                style={{ direction: 'rtl' }}
              >
                <button
                  id="preview-edit-text-btn"
                  onClick={handleBackToEdit}
                  className="flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  تعديل النص والمظهر
                </button>
                <div className="text-[11px] text-orange-600 font-extrabold bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-full select-none">
                  وضع المعاينة الحقيقية 👁️
                </div>
                <button
                  id="preview-finalize-btn"
                  onClick={generateCelebrationLink}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:brightness-110 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md transition cursor-pointer"
                >
                  توليد الرابط ✨
                </button>
              </div>

              {/* Subtitle Instruction strip */}
              <div className="bg-amber-50 text-slate-700 p-2.5 text-center text-xs border-b border-orange-100 font-bold select-none leading-normal">
                {!isBoxOpened ? '🎁 انقر فوق الصندوق أدناه لتجرب محاكاة الانفجار اللوني السعيد!' : '💖 رائع! هذا هو المظهر الدقيق الذي سيظهر للعزيز/ة المستلم.'}
              </div>

              {/* Simulation Environment */}
              <div className={`flex-1 flex flex-col items-center justify-center p-6 sm:p-10 transition-all duration-700 bg-gradient-to-br ${activeTheme.bgGradient} relative min-h-[380px]`}>
                
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full blur-lg pointer-events-none" />
                <div className="absolute bottom-6 left-6 w-16 h-16 bg-white/10 rounded-full blur-xl pointer-events-none" />

                <AnimatePresence mode="wait">
                  {!isBoxOpened ? (
                    /* CLOSED PREVIEW MODEL */
                    <motion.div
                      key="closed-preview-box"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center text-center cursor-pointer max-w-xs"
                      onClick={handleBoxClick}
                    >
                      <motion.div
                        animate={
                          isShaking
                            ? { 
                                x: [-8, 8, -6, 6, -4, 4, -2, 2, 0],
                                y: [-3, 1, -2, 1, -1, 0],
                                rotate: [-3, 3, -2, 2, -1, 1, 0],
                              }
                            : { y: [0, -8, 0] }
                        }
                        transition={
                          isShaking
                            ? { duration: 0.5, ease: 'easeInOut' }
                            : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                        }
                        className="text-8xl sm:text-9xl mb-6 relative hover:scale-105 active:scale-95 transition-all drop-shadow-2xl select-none"
                      >
                        <div className="absolute -inset-2 bg-white/25 blur-xl rounded-full scale-75 animate-pulse-subtle -z-10" />
                        <span>{activeBoxStyle.emoji}</span>
                      </motion.div>

                      <div className="bg-white/95 backdrop-blur-md p-5 rounded-3xl border border-white max-w-xs text-center shadow-xl">
                        <h4 className="text-slate-800 text-sm font-black mb-1">
                          اضغط على {activeBoxStyle.name.split(' ')[0]} لفتحه ✨
                        </h4>
                        <p className="text-slate-500 text-[10px] sm:text-xs leading-normal font-semibold">
                          {activeBoxStyle.closedDesc}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    /* OPENED CARD PREVIEW MODEL */
                    <motion.div
                      key="opened-preview-card"
                      initial={{ opacity: 0, y: 30, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                      className="w-full max-w-sm bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-white text-right relative overflow-hidden"
                      style={{ direction: 'rtl' }}
                    >
                      {/* Signature Stars */}
                      <div className="flex justify-center mb-3 text-orange-500 gap-1 select-none">
                        <span className="text-lg font-black">★</span>
                        <span className="text-lg font-black">★</span>
                        <span className="text-lg font-black">★</span>
                      </div>

                      <div className="mb-4">
                        <span className="text-[10px] text-slate-400 font-bold block mb-0.5">رسالة مفاجأة سعيدة إلى:</span>
                        <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-l from-rose-600 to-orange-500 leading-tight">
                          {name} ❤️
                        </h2>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 p-4 sm:p-5 rounded-2xl text-slate-700 text-sm sm:text-base font-semibold leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto min-h-20 select-text">
                        {message}
                      </div>

                      {/* Reset inside mock */}
                      <div className="mt-5 pt-3.5 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-semibold select-none">
                        <button
                          type="button"
                          onClick={() => {
                            setIsBoxOpened(false);
                            showToast('أعدنا إغلاق الهديّة لتجربتها مجدداً! 🔒', 'info');
                          }}
                          className="hover:text-slate-600 transition underline cursor-pointer flex items-center gap-1 font-bold"
                        >
                          <RotateCcw className="w-3 h-3" />
                          إغلاق الصندوق السحري
                        </button>
                        <span>JoyBox 🎁</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

            </motion.div>
          )}

          {/* STEP 3: RESULT SCREEN WITH SUCCESSFUL LINK TO COPIED BY SENDER */}
          {step === 'result' && (
            <motion.div
              key="step-result"
              id="joybox-panel-result"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full max-w-xl bg-white rounded-[40px] p-6 sm:p-10 border-8 border-white shadow-[0_32px_64px_-12px_rgba(251,146,60,0.22)] text-center text-slate-800"
              style={{ direction: 'rtl' }}
            >
              <div className="inline-flex p-4 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 mb-4 text-4xl animate-bounce select-none">
                🎉
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 leading-tight">
                تم صياغة وتشجير المفاجأة بنجاح!
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mb-6 max-w-md mx-auto leading-relaxed font-medium">
                رابط التهنئة جاهز ومحمي بالكامل. انسخ الرابط المأمون وأرسله للشخص المستلم عبر واتساب أو فيسبوك، وسينطلق له هذا الصّندوق السحري بالألوان بدون إعلانات نهائياً!
              </p>

              {/* Ready Link field */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border-2 border-slate-100 mb-6 text-right">
                <label className="block text-slate-400 text-xs font-black mb-2 mr-1">
                  الرابط السحري المولد لـ {name || 'المستمر'}:
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    id="generated-link-input"
                    type="text"
                    readOnly
                    value={generatedUrl}
                    className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-indigo-600 font-mono select-all focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                  />
                  <button
                    id="copy-link-field-btn"
                    onClick={handleCopyLink}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition cursor-pointer flex items-center justify-center shadow"
                    title="نسخ الرابط"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons matching standard style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                
                {/* WHATSAPP SHARE OPTION */}
                <button
                  id="whatsapp-share-btn"
                  onClick={() => {
                    const messageText = `افتح هديتك ومفاجأتك الخاصة جداً من هنا 🎁👇\n${generatedUrl}`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`, '_blank');
                    showToast('يتم توجيهك للمشاركة عبر واتساب 📲', 'info');
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 px-5 rounded-2xl shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                >
                  <Share2 className="w-5 h-5" />
                  مشاركة عبر واتساب 📲
                </button>

                {/* COPY LINK OPTION */}
                <button
                  id="copy-link-primary-btn"
                  onClick={handleCopyLink}
                  className="bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black py-4 px-5 rounded-2xl shadow-lg shadow-orange-100 transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                >
                  <Copy className="w-5 h-5" />
                  نسخ رابط الهدية 📋
                </button>

              </div>

              {/* Restarts block */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-5 border-t border-slate-100 text-xs sm:text-sm font-black select-none">
                <button
                  id="result-back-to-edit-btn"
                  onClick={() => {
                    setIsBoxOpened(false);
                    setStep('create');
                  }}
                  className="text-slate-400 hover:text-slate-600 transition flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  إنشاء مفاجأة جديدة وصندوق آخر
                </button>
                
                <button
                  id="result-preview-live-btn"
                  onClick={() => {
                    setIsBoxOpened(false);
                    setStep('receive');
                  }}
                  className="text-indigo-600 hover:text-indigo-700 transition flex items-center gap-1 cursor-pointer bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl"
                >
                  تجربة محاكاة لزيارة المستقبل المباشرة
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          )}

          {/* STEP 4: RECIPIENT VIEW (100% clean device view, immersive space environment depending on selected theme, strictly zero builder hints) */}
          {step === 'receive' && (
            <motion.div
              key="step-receive"
              id="joybox-panel-receive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`w-full min-h-[500px] flex flex-col items-center justify-center p-4 sm:p-10 transition-all duration-700 bg-gradient-to-br ${activeTheme.bgGradient} rounded-[36px] sm:rounded-[48px] border-4 sm:border-8 border-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] relative overflow-hidden`}
              style={{ direction: 'rtl' }}
            >
              
              {/* Floating lights inside the recipient panel */}
              <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <AnimatePresence mode="wait">
                {!isBoxOpened ? (
                  /* RECIPIENT MODE: GIFT CLOSED */
                  <motion.div
                    key="recipient-closed"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center text-center cursor-pointer max-w-sm px-4 select-none z-10"
                    onClick={handleBoxClick}
                  >
                    {/* Soft interactive floating box */}
                    <motion.div
                      animate={
                        isShaking
                          ? { 
                              x: [-8, 8, -6, 6, -4, 4, -2, 2, 0],
                              y: [-3, 1, -2, 1, -1, 0],
                              rotate: [-3, 3, -2, 2, -1, 1, 0],
                            }
                          : {
                              y: [0, -12, 0],
                            }
                      }
                      transition={
                        isShaking
                          ? { duration: 0.5, ease: 'easeInOut' }
                          : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                      }
                      className="text-9xl sm:text-[140px] mb-8 relative drop-shadow-3xl hover:scale-105 active:scale-95 transition-all"
                    >
                      {/* Aura glowing circle behind */}
                      <div className="absolute -inset-4 bg-white/20 blur-3xl rounded-full scale-90 animate-pulse-subtle -z-10" />
                      <span>{activeBoxStyle.emoji}</span>
                    </motion.div>

                    <div className="bg-white/95 backdrop-blur-md p-6 rounded-[32px] shadow-2xl border-2 border-white max-w-[320px]">
                      <div className="flex justify-center mb-3 text-orange-500 gap-1">
                        <span className="text-xl font-black">★</span>
                        <span className="text-xl font-black">★</span>
                        <span className="text-xl font-black">★</span>
                      </div>
                      <h2 className="text-slate-800 text-base sm:text-lg font-black tracking-wide mb-1 leading-snug">
                        أحدهم أرسل لك مفاجأة خاصة جداً...
                      </h2>
                      <p className="text-slate-500 text-xs sm:text-sm font-bold mb-3.5">
                        انقر فوق الهدية لكشف مشاعر مرسلها إليك ✨
                      </p>
                      <div className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100 inline-block px-3 py-1 rounded-full font-bold">
                        صندوق فرح مجاني، آمن ومفتوح بنسبة 100% 🔒
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* RECIPIENT MODE: EXPLICIT CONFETTI SHOWN CARD */
                  <motion.div
                    key="recipient-opened"
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 150 }}
                    className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 shadow-3xl relative border-2 border-white overflow-hidden text-right shadow-xl z-10"
                    style={{ direction: 'rtl' }}
                  >
                    {/* Glowing effect nodes inside glass */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-rose-500/10 to-transparent rounded-full blur-2xl -z-10" />
                    
                    {/* Signature celebration ribbon header */}
                    <div className="h-1.5 w-16 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full mb-6 mx-auto" />

                    <div className="text-center mb-5">
                      <h4 className="text-[11px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
                        <PartyPopper className="text-rose-500 w-4 h-4" />
                        التهنئة السحرية الدافئة الموجهة إليك
                      </h4>
                      <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-l from-rose-600 to-orange-500 leading-normal">
                        إلى: {name} ❤️
                      </h1>
                    </div>

                    {/* Highly readable, comfortable Arabic message segment */}
                    <div className="bg-slate-50 border-2 border-slate-100 p-5 sm:p-6 rounded-2xl text-slate-700 text-sm sm:text-base font-semibold leading-relaxed whitespace-pre-wrap max-h-[280px] overflow-y-auto leading-loose select-text shadow-inner">
                      {message}
                    </div>

                    {/* Immersive actions footer */}
                    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 pt-5 border-t border-slate-100 text-xs text-slate-400 font-bold select-none">
                      <button
                        type="button"
                        onClick={() => {
                          setIsBoxOpened(false);
                          showToast('تمت إعادة إغلاق المفاجأة بنجاح! 🔒', 'info');
                        }}
                        className="text-slate-400 hover:text-slate-600 transition hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        إعادة إغلاق الصندوق
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          window.location.search = ''; // Navigate cleanly to create page
                        }}
                        className="bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black px-4 py-2 rounded-xl hover:brightness-110 shadow-sm transition flex items-center gap-1 cursor-pointer text-xs"
                      >
                        اصنع مفاجأة مبهجة لمن تحب 🎁
                      </button>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Tidy Footer Section */}
      <footer className="w-full max-w-6xl mx-auto px-4 py-5 text-center mt-auto z-10 relative border-t border-slate-200/50">
        <p className="text-slate-400 text-[10px] sm:text-xs font-semibold">
          صندوق الفرح (JoyBox) © 2026. مشفّر بالكامل ولا يتم تخزين أي رسائل حمايةً تامّة لخصوصية الجميع 🔒
        </p>
      </footer>

    </div>
  );
}
