import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Smile } from "lucide-react";

interface AvatarProps {
  status: "neutral" | "thinking" | "speaking" | "listening" | "warning" | "smiling";
  textSpeech: string;
  onVoiceCommand: (command: string) => void;
}

export const Avatar: React.FC<AvatarProps> = ({ status, textSpeech, onVoiceCommand }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const voiceVolume = 1.0;
  const [language, setLanguage] = useState<"en-IN" | "hi-IN">("en-IN");
  const recognitionRef = useRef<any>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Soundwave lines representation
  const waveLines = Array.from({ length: 15 });

  useEffect(() => {
    // Setup Speech Recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language;

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        onVoiceCommand(text);
        setIsListening(false);
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error", e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [language, onVoiceCommand]);

  // Handle Text-to-Speech playback when textSpeech changes
  useEffect(() => {
    if (textSpeech && !isMuted) {
      speak(textSpeech);
    }
  }, [textSpeech]);

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;

    // Cancel ongoing speech
    window.speechSynthesis.cancel();

    // Remove markdown symbols from spoken text
    const cleanText = text.replace(/[*#`_\-]/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language;
    utterance.volume = voiceVolume;

    // Try to find a natural sounding Indian voice
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    if (language === "hi-IN") {
      selectedVoice = voices.find(v => v.lang.includes("HI") || v.lang.includes("hi"));
    } else {
      selectedVoice = voices.find(v => v.lang.includes("IN") || v.lang.includes("in") || v.lang.includes("en-GB"));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome/Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Cancel speech before listening
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      recognitionRef.current.start();
    }
  };

  // Select Avatar Colors based on State
  const getAvatarColors = () => {
    switch (status) {
      case "thinking":
        return {
          glow: "rgba(0, 229, 255, 0.4)",
          pulse: "animate-pulse border-brand-cyan",
          faceColor: "text-brand-cyan",
          accentColor: "#00e5ff",
          bgGlow: "from-brand-cyan/20 to-transparent"
        };
      case "speaking":
        return {
          glow: "rgba(124, 77, 255, 0.4)",
          pulse: "animate-bounce border-brand-purple",
          faceColor: "text-brand-purple",
          accentColor: "#7c4dff",
          bgGlow: "from-brand-purple/20 to-transparent"
        };
      case "listening":
        return {
          glow: "rgba(255, 64, 129, 0.4)",
          pulse: "animate-ping border-brand-pink",
          faceColor: "text-brand-pink",
          accentColor: "#ff4081",
          bgGlow: "from-brand-pink/20 to-transparent"
        };
      case "warning":
        return {
          glow: "rgba(255, 145, 0, 0.4)",
          pulse: "border-orange-500",
          faceColor: "text-orange-500",
          accentColor: "#ff9100",
          bgGlow: "from-orange-500/20 to-transparent"
        };
      case "smiling":
        return {
          glow: "rgba(255, 215, 0, 0.4)",
          pulse: "border-brand-gold",
          faceColor: "text-brand-gold",
          accentColor: "#ffd700",
          bgGlow: "from-brand-gold/20 to-transparent"
        };
      case "neutral":
      default:
        return {
          glow: "rgba(0, 230, 118, 0.2)",
          pulse: "border-brand-green",
          faceColor: "text-brand-green",
          accentColor: "#00e676",
          bgGlow: "from-brand-green/10 to-transparent"
        };
    }
  };

  const colors = getAvatarColors();

  return (
    <div className="relative glass-panel rounded-3xl p-6 flex flex-col items-center justify-between h-[450px] overflow-hidden">
      {/* Absolute Glow Background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${colors.bgGlow} opacity-30 pointer-events-none transition-all duration-500`} />

      {/* Header controls */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-gold" />
          <span className="text-xs font-semibold tracking-wider uppercase text-gray-400 font-display">
            ARTHA Wealth Agent
          </span>
        </div>
        
        {/* Localization & Sound */}
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-brand-green transition-all"
          >
            <option value="en-IN">English (IN)</option>
            <option value="hi-IN">हिंदी (Hindi)</option>
          </select>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            title={isMuted ? "Unmute Voice" : "Mute Voice"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Animated 3D/SVG Avatar Graphic */}
      <div className="relative flex items-center justify-center my-6 h-[200px] w-[200px]">
        {/* Core Ring Outer Wave */}
        <div
          className={`absolute inset-0 rounded-full border border-dashed opacity-25 ${colors.pulse} transition-all duration-700`}
          style={{ boxShadow: `0 0 40px ${colors.glow}` }}
        />
        
        {/* Inner Ring Glow */}
        <div
          className="absolute inset-4 rounded-full border border-white/10 transition-all duration-500"
          style={{ background: `radial-gradient(circle, ${colors.accentColor}11 0%, transparent 70%)` }}
        />

        {/* Dynamic SVG Avatar Face */}
        <svg
          viewBox="0 0 100 100"
          className={`w-[120px] h-[120px] z-10 transition-transform duration-500 ${status === 'thinking' ? 'animate-float' : ''}`}
        >
          {/* Cybernetic Face Outer */}
          <circle cx="50" cy="50" r="42" fill="none" stroke={colors.accentColor} strokeWidth="1.5" strokeDasharray="4,4" className="opacity-40" />
          
          {/* Inner Face Shell */}
          <circle cx="50" cy="50" r="38" fill="rgba(10, 12, 22, 0.75)" stroke={colors.accentColor} strokeWidth="2.5" />

          {/* Futuristic Ear Nodes */}
          <rect x="7" y="42" width="4" height="16" rx="2" fill={colors.accentColor} className="opacity-80" />
          <rect x="89" y="42" width="4" height="16" rx="2" fill={colors.accentColor} className="opacity-80" />

          {/* Status Indicator Lights on forehead */}
          <circle cx="50" cy="20" r="1.5" fill={colors.accentColor} className="animate-ping" />
          <line x1="45" y1="20" x2="55" y2="20" stroke={colors.accentColor} strokeWidth="0.5" strokeDasharray="1,1" />

          {/* EYES */}
          {status === "thinking" ? (
            <>
              {/* Spinning/Analyzing Eyes */}
              <circle cx="35" cy="45" r="5" fill="none" stroke={colors.accentColor} strokeWidth="1.5" strokeDasharray="2,2" className="animate-spin" style={{ transformOrigin: "35px 45px" }} />
              <circle cx="65" cy="45" r="5" fill="none" stroke={colors.accentColor} strokeWidth="1.5" strokeDasharray="2,2" className="animate-spin" style={{ transformOrigin: "65px 45px" }} />
              <circle cx="35" cy="45" r="2" fill={colors.accentColor} />
              <circle cx="65" cy="45" r="2" fill={colors.accentColor} />
            </>
          ) : status === "listening" ? (
            <>
              {/* Alert Open Eyes */}
              <ellipse cx="35" cy="45" rx="6" ry="3" fill="none" stroke={colors.accentColor} strokeWidth="2" />
              <circle cx="35" cy="45" r="2" fill={colors.accentColor} className="animate-pulse" />
              <ellipse cx="65" cy="45" rx="6" ry="3" fill="none" stroke={colors.accentColor} strokeWidth="2" />
              <circle cx="65" cy="45" r="2" fill={colors.accentColor} className="animate-pulse" />
            </>
          ) : status === "smiling" ? (
            <>
              {/* Happy Curved Eyes */}
              <path d="M 29 48 Q 35 40 41 48" fill="none" stroke={colors.accentColor} strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 59 48 Q 65 40 71 48" fill="none" stroke={colors.accentColor} strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : status === "warning" ? (
            <>
              {/* Focused/Flat Top Eyes */}
              <line x1="29" y1="42" x2="41" y2="45" stroke={colors.accentColor} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="71" y1="42" x2="59" y2="45" stroke={colors.accentColor} strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="35" cy="48" r="2.5" fill={colors.accentColor} />
              <circle cx="65" cy="48" r="2.5" fill={colors.accentColor} />
            </>
          ) : (
            <>
              {/* Standard Neutral Intelligent Eyes */}
              <circle cx="35" cy="45" r="4" fill="none" stroke={colors.accentColor} strokeWidth="2" />
              <circle cx="35" cy="45" r="1.5" fill={colors.accentColor} />
              <circle cx="65" cy="45" r="4" fill="none" stroke={colors.accentColor} strokeWidth="2" />
              <circle cx="65" cy="45" r="1.5" fill={colors.accentColor} />
            </>
          )}

          {/* MOUTH / PHONEMES */}
          {status === "speaking" ? (
            // Wave/Opening Mouth
            <ellipse cx="50" cy="65" rx="8" ry="4" fill="none" stroke={colors.accentColor} strokeWidth="2.5" className="animate-pulse" />
          ) : status === "smiling" ? (
            // Curved Smile
            <path d="M 38 62 Q 50 74 62 62" fill="none" stroke={colors.accentColor} strokeWidth="2.5" strokeLinecap="round" />
          ) : status === "listening" ? (
            // Small Circular O
            <circle cx="50" cy="65" r="3" fill="none" stroke={colors.accentColor} strokeWidth="2" />
          ) : status === "thinking" ? (
            // Straight/Neutral Line
            <line x1="42" y1="65" x2="58" y2="65" stroke={colors.accentColor} strokeWidth="2.5" strokeLinecap="round" />
          ) : (
            // Subtle Smile
            <path d="M 40 64 Q 50 70 60 64" fill="none" stroke={colors.accentColor} strokeWidth="2" strokeLinecap="round" />
          )}

          {/* Cybernetic Face Lines */}
          <path d="M 50 74 L 50 82" stroke={colors.accentColor} strokeWidth="1" className="opacity-50" />
          <path d="M 22 50 A 28 28 0 0 0 78 50" fill="none" stroke={colors.accentColor} strokeWidth="0.5" strokeDasharray="2,2" className="opacity-30" />
        </svg>
      </div>

      {/* Voice Wave Visualizer (when listening or speaking) */}
      <div className="h-[24px] flex items-center gap-1 z-10 w-[80%] justify-center">
        {(status === "speaking" || status === "listening") ? (
          waveLines.map((_, idx) => {
            // Give randomized animated heights
            const delay = idx * 0.08;
            const heightMultiplier = Math.sin(idx / 2) * 8 + 14;
            return (
              <div
                key={idx}
                className="w-[3px] bg-brand-green rounded-full opacity-80"
                style={{
                  height: `${heightMultiplier}px`,
                  backgroundColor: colors.accentColor,
                  animation: `avatar-wave ${status === "listening" ? "1s" : "0.6s"} ease-in-out infinite alternate`,
                  animationDelay: `${delay}s`
                }}
              />
            );
          })
        ) : (
          <span className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1 font-display">
            <Smile className="w-3.5 h-3.5" /> Avatar {status}
          </span>
        )}
      </div>

      {/* Mic trigger buttons */}
      <div className="w-full flex flex-col gap-2 z-10 mt-2">
        <button
          onClick={toggleListening}
          className={`w-full py-3 px-4 rounded-xl font-medium font-display flex items-center justify-center gap-2 border transition-all duration-300 ${
            isListening
              ? "bg-brand-pink/20 border-brand-pink text-brand-pink shadow-lg shadow-brand-pink/15"
              : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white"
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 animate-pulse" />
              <span>Listening... Speak Now</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-brand-green" />
              <span>Tap to Speak (Hindi/English)</span>
            </>
          )}
        </button>
        
        <p className="text-[10px] text-center text-gray-500 leading-normal">
          Supported queries: "improve my wealth score", "portfolio balance", "retire at 50", "UPI fraud check"
        </p>
      </div>
    </div>
  );
};
export default Avatar;
