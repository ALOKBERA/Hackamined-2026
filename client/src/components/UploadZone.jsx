import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    Loader2,
    CheckCircle2,
    Calendar as CalIcon,
    ExternalLink,
    ChevronRight,
    Sparkles,
    Zap,
    Layout
} from 'lucide-react';
import toast from 'react-hot-toast';

const UploadZone = ({ onSuccess }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [step, setStep] = useState(0); // 0: Idle, 1: AI, 2: Drive, 3: Done
    const [result, setResult] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
            setStep(0);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false,
        disabled: isUploading
    });

    const steps = [
        { icon: <Zap size={18} />, label: "Classifying with Llama AI" },
        { icon: <Layout size={18} />, label: "Structuring for Cloud" },
        { icon: <CheckCircle2 size={18} />, label: "Finalizing Index" }
    ];

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        setStep(0);

        const formData = new FormData();
        formData.append('screenshot', file);

        try {
            const stepInterval = setInterval(() => {
                setStep(prev => (prev < 2 ? prev + 1 : prev));
            }, 2000);

            const response = await axios.post('/api/screenshots/upload', formData);

            clearInterval(stepInterval);
            setStep(2);
            setTimeout(() => {
                setResult(response.data.screenshot);
                toast.success('Snapshot processed');
                if (onSuccess) onSuccess();
            }, 1000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Processing failed');
            setIsUploading(false);
            setStep(0);
        }
    };

    return (
        <div className="premium-upload-wrap">
            <AnimatePresence mode="wait">
                {!result ? (
                    <motion.div
                        {...getRootProps()}
                        className={`premium-dropzone ${isDragActive ? 'active' : ''}`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                    >
                        <input {...getInputProps()} />

                        {preview && (
                            <div style={{ position: 'relative', marginBottom: '24px' }}>
                                <img src={preview} alt="Preview" style={{ maxHeight: '160px', borderRadius: '12px', border: '1px solid var(--border)' }} />
                                {isUploading && <div className="scanning-line" />}
                            </div>
                        )}

                        {!preview && (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ marginBottom: '20px', color: 'var(--accent)' }}>
                                    <Sparkles size={40} />
                                </div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Push to Cloud</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Drag a screenshot to begin the AI analysis</p>
                            </div>
                        )}

                        {isUploading && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{steps[step].label}</span>
                                </div>
                            </div>
                        )}

                        {file && !isUploading && (
                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                <button className="btn-premium" onClick={(e) => { e.stopPropagation(); handleUpload(); }}>
                                    Execute Analysis
                                    <ChevronRight size={18} />
                                </button>
                                <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}>
                                    Reset
                                </button>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        className="card-premium"
                        style={{ background: 'var(--bg-secondary)', textAlign: 'center' }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{
                                display: 'inline-flex',
                                padding: '8px 16px',
                                borderRadius: '40px',
                                background: 'var(--accent-glow)',
                                color: 'var(--accent)',
                                fontWeight: 800,
                                fontSize: '0.85rem',
                                border: '1px solid var(--accent)'
                            }}>
                                {result.category.toUpperCase()}
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>{result.metadata.summary}</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                            Snapshot classified and archived with {Math.round(result.metadata.confidence * 100)}% accuracy.
                        </p>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '32px' }}>
                            <a href={result.driveViewLink} target="_blank" rel="noreferrer" className="btn-secondary">
                                <ExternalLink size={18} />
                                Root Folder
                            </a>
                            {result.calendarEventLink && (
                                <a href={result.calendarEventLink} target="_blank" rel="noreferrer" className="btn-secondary" style={{ color: 'var(--accent)' }}>
                                    <CalIcon size={18} />
                                    Calendar Event
                                </a>
                            )}
                        </div>

                        <button
                            className="btn-premium"
                            style={{ width: '100%', background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                            onClick={() => { setResult(null); setFile(null); setPreview(null); }}
                        >
                            Process New Visual
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UploadZone;
