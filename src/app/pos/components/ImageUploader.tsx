"use client";

import { useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ImageIcon, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onClear: () => void;
}

export default function ImageUploader({ value, onChange, onClear }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Max 5MB.");
      return;
    }

    setError("");
    setUploading(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 12, 85));
    }, 100);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      clearInterval(interval);
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setProgress(100);
      setTimeout(() => { setUploading(false); setProgress(0); }, 400);
      onChange(data.url);
    } catch (e) {
      clearInterval(interval);
      setUploading(false);
      setProgress(0);
      setError(e instanceof Error ? e.message : "Upload failed");
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }, [upload]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  }, [upload]);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {value ? (
          /* Preview state */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative rounded-2xl overflow-hidden group"
            style={{ border: "2px solid rgba(255,213,0,0.3)" }}
          >
            <div className="relative h-48 sm:h-56 w-full bg-black">
              <Image
                src={value}
                alt="Product preview"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
              <motion.button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white"
                style={{ background: "rgba(255,213,0,0.2)", border: "1.5px solid rgba(255,213,0,0.4)" }}
                whileHover={{ scale: 1.05 }}
                onClick={() => inputRef.current?.click()}
              >
                <Upload className="w-4 h-4" /> Change Image
              </motion.button>
              <motion.button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white"
                style={{ background: "rgba(209,18,13,0.2)", border: "1.5px solid rgba(209,18,13,0.4)" }}
                whileHover={{ scale: 1.05 }}
                onClick={onClear}
              >
                <X className="w-4 h-4" /> Remove
              </motion.button>
            </div>
            {/* Success badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-white"
              style={{ background: "rgba(0,133,43,0.8)", backdropFilter: "blur(8px)" }}>
              <CheckCircle className="w-3.5 h-3.5" /> Uploaded
            </div>
          </motion.div>
        ) : (
          /* Upload zone */
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`upload-zone relative flex flex-col items-center justify-center py-10 px-6 rounded-2xl cursor-pointer transition-all duration-300 ${isDragging ? "drag-over" : ""}`}
            onClick={() => !uploading && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            whileHover={uploading ? {} : { borderColor: "rgba(255,213,0,0.6)" }}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                <Loader2 className="w-10 h-10 text-lego-yellow animate-spin" />
                <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #D1120D, #FFD500)" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <span className="text-sm text-white/50">Uploading... {progress}%</span>
              </div>
            ) : (
              <>
                <motion.div
                  animate={isDragging
                    ? { scale: 1.2, color: "#FFD500" }
                    : { scale: 1, color: "rgba(255,255,255,0.3)" }
                  }
                  transition={{ duration: 0.2 }}
                >
                  <ImageIcon className="w-12 h-12 mb-4" />
                </motion.div>
                <p className="text-sm font-semibold text-white/60 mb-1">
                  {isDragging ? "Drop to upload!" : "Drag & drop or click to upload"}
                </p>
                <p className="text-xs text-white/30">PNG, JPG, WEBP · Max 5MB</p>
                <motion.div
                  className="mt-5 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white/70"
                  style={{ background: "rgba(255,213,0,0.08)", border: "1.5px solid rgba(255,213,0,0.2)" }}
                  whileHover={{ scale: 1.05, borderColor: "rgba(255,213,0,0.5)", color: "#FFD500" }}
                >
                  <Upload className="w-4 h-4" /> Browse Files
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 flex items-center gap-2 text-sm text-lego-red"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
}
