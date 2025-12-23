import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

interface VoiceRecorderProps {
  roomCode: string;
  onRecordingComplete: (audioUrl: string, duration: number) => Promise<void>;
  disabled?: boolean;
}

const MAX_DURATION = 30; // 30 seconds max

const VoiceRecorder = ({ roomCode, onRecordingComplete, disabled }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      startTimeRef.current = Date.now();
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        const blob = new Blob(chunksRef.current, { 
          type: mediaRecorder.mimeType 
        });
        
        if (blob.size > 0 && duration > 0) {
          await uploadRecording(blob, duration);
        }
      };
      
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= MAX_DURATION) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);
      
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  }, [roomCode]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  const uploadRecording = async (blob: Blob, duration: number) => {
    setIsUploading(true);
    
    try {
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.webm`;
      const audioRef = storageRef(storage, `voice-notes/${roomCode}/${fileName}`);
      
      await uploadBytes(audioRef, blob);
      const downloadUrl = await getDownloadURL(audioRef);
      
      await onRecordingComplete(downloadUrl, duration);
    } catch (err) {
      console.error("Error uploading recording:", err);
    } finally {
      setIsUploading(false);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative flex items-center">
      <AnimatePresence mode="wait">
        {isRecording ? (
          <motion.div
            key="recording"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            {/* Recording indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/20 border border-destructive/30">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="h-2 w-2 rounded-full bg-destructive"
              />
              <span className="text-xs font-medium text-destructive">
                {formatTime(recordingTime)}
              </span>
            </div>
            
            {/* Stop button */}
            <Button
              variant="destructive"
              size="icon"
              onClick={stopRecording}
              className="h-9 w-9"
            >
              <Square className="h-4 w-4" />
            </Button>
          </motion.div>
        ) : isUploading ? (
          <motion.div
            key="uploading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button
              variant="ghost"
              size="icon"
              disabled
              className="h-9 w-9"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={startRecording}
              disabled={disabled}
              className="h-9 w-9 text-muted-foreground hover:text-primary"
            >
              <Mic className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceRecorder;
