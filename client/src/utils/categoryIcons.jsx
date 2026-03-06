import {
    Ticket,
    CreditCard,
    Mail,
    MessageCircle,
    BookOpen,
    User as UserIcon,
    Share2,
    Linkedin,
    HelpCircle,
    Image as ImageLucide,
    Quote as QuoteIcon,
    Instagram,
    Twitter,
    ShieldCheck,
    StickyNote
} from 'lucide-react';

export const getCategoryIcon = (category, size = 24) => {
    const iconMap = {
        'Ticket': { icon: Ticket, color: '#FF5722' }, // Vibrant Orange-Red
        'Wallpaper': { icon: ImageLucide, color: '#00BCD4' }, // Cyan
        'LinkedIn Profile': { icon: Linkedin, color: '#0077B5' }, // LinkedIn Identity
        'LinkedIn Post': { icon: Linkedin, color: '#0077B5' },
        'Social Media Post': { icon: Instagram, color: '#E1306C' }, // Instagram Pink
        'Payment': { icon: CreditCard, color: '#4CAF50' }, // Success Green
        'Sensitive Document': { icon: ShieldCheck, color: '#673AB7' }, // Deep Purple
        'Contact': { icon: UserIcon, color: '#2196F3' }, // Professional Blue
        'Mail': { icon: Mail, color: '#FFC107' }, // Amber
        'Quote': { icon: QuoteIcon, color: '#E91E63' }, // Pink
        'WhatsApp Chat': { icon: MessageCircle, color: '#25D366' }, // WhatsApp Green
        'Study Notes': { icon: StickyNote, color: '#FF9800' }, // Education Orange
        'Other': { icon: HelpCircle, color: '#607D8B' }, // Blue Grey
    };

    const item = iconMap[category] || { icon: HelpCircle, color: '#9E9E9E' };
    const IconComp = item.icon;

    return (
        <IconComp
            size={size}
            strokeWidth={2.5}
            style={{
                color: item.color,
                filter: `drop-shadow(0 0 8px ${item.color}44)`
            }}
        />
    );
};
