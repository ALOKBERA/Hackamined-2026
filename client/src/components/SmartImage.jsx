import React, { useState } from 'react';
import { getCategoryIcon } from '../utils/categoryIcons';

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
