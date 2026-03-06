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
    Instagram,
    Linkedin,
    HelpCircle
} from 'lucide-react';

const categoryIcons = {
    'Ticket': <Ticket size={40} />,
    'Wallpaper': <ImageIcon size={40} />,
    'LinkedIn Profile': <Linkedin size={40} />,
    'LinkedIn Post': <Linkedin size={40} />,
    'Social Media Post': <Share2 size={40} />,
    'Payment': <CreditCard size={40} />,
    'Sensitive Document': <FileText size={40} />,
    'Contact': <UserIcon size={40} />,
    'Mail': <Mail size={40} />,
    'Quote': <MessageSquare size={40} />,
    'WhatsApp Chat': <MessageSquare size={40} />,
    'Study Notes': <BookOpen size={40} />,
    'Other': <HelpCircle size={40} />,
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
                color: 'var(--text-muted)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    {categoryIcons[category] || <ImageIcon size={40} />}
                    <p style={{ fontSize: '0.7rem', marginTop: '8px', opacity: 0.6 }}>{category}</p>
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
