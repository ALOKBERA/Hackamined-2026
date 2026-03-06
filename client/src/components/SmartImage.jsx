import React, { useState } from 'react';
import {
    FileText,
    ImageIcon,
    Ticket,
    CreditCard,
    Mail,
    MessageSquare,
    BookOpen,
    User as UserIcon,
    Share2,
    Linkedin,
    HelpCircle,
    Palette,
    Shield,
    Image as ImageLucide,
    Quote as QuoteIcon
} from 'lucide-react';

export const getCategoryIcon = (category, size = 24) => {
    const iconMap = {
        'Ticket': { icon: Ticket, color: '#FF4D4D' }, // Red
        'Wallpaper': { icon: ImageLucide, color: '#4D94FF' }, // Blue
        'LinkedIn Profile': { icon: Linkedin, color: '#0077B5' }, // LinkedIn Blue
        'LinkedIn Post': { icon: Linkedin, color: '#00A0DC' }, // Lighter Blue
        'Social Media Post': { icon: Instagram, color: '#E4405F' }, // Insta Pink
        'Payment': { icon: CreditCard, color: '#4CAF50' }, // Green
        'Sensitive Document': { icon: Shield, color: '#9C27B0' }, // Purple
        'Contact': { icon: UserIcon, color: '#FF9800' }, // Orange
        'Mail': { icon: Mail, color: '#2196F3' }, // Blue
        'Quote': { icon: QuoteIcon, color: '#F44336' }, // Dark Red
        'WhatsApp Chat': { icon: MessageSquare, color: '#25D366' }, // WhatsApp Green
        'Study Notes': { icon: BookOpen, color: '#795548' }, // Brown
        'Other': { icon: HelpCircle, color: '#9E9E9E' }, // Grey
    };

    // Special case for Instagram which isn't imported correctly sometimes or needs specific handling
    if (category === 'Social Media Post') {
        return <Share2 size={size} style={{ color: '#E4405F' }} />;
    }

    const item = iconMap[category] || { icon: HelpCircle, color: '#9E9E9E' };
    const IconComp = item.icon;
    return <IconComp size={size} style={{ color: item.color }} />;
};

const SmartImage = ({ src, category, alt, className }) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    if (error || !src) {
        return (
            <div className={`${className} glass-panel`} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-elevated)',
            }}>
                <div style={{ textAlign: 'center' }}>
                    {getCategoryIcon(category, 48)}
                    <p style={{ fontSize: '0.75rem', marginTop: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{category}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {loading && (
                <div className={className} style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div className="loading-spinner" style={{ width: '20px', height: '20px' }}></div>
                </div>
            )}
            <img
                src={src}
                alt={alt}
                className={className}
                onLoad={() => setLoading(false)}
                onError={() => setError(true)}
                style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.3s' }}
            />
        </div>
    );
};

export default SmartImage;
