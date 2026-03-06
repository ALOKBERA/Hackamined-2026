import React from 'react';
import {
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
    Quote as QuoteIcon,
    Instagram
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

    // Special case for Social Media Post
    if (category === 'Social Media Post') {
        return <Share2 size={size} style={{ color: '#E4405F' }} />;
    }

    const item = iconMap[category] || { icon: HelpCircle, color: '#9E9E9E' };
    const IconComp = item.icon;
    return <IconComp size={size} style={{ color: item.color }} />;
};
