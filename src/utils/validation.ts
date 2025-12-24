export const validateUserId = (id: string): boolean => {
    if (!id || typeof id !== 'string') return false;

    if (!/^\d+$/.test(id)) return false;

    if (id.length < 17 || id.length > 19) return false;

    return true;
};

export const validateTheme = (theme: string): boolean => {
    const validThemes = ['classic', 'elite', 'glass'];
    return validThemes.includes(theme.toLowerCase());
};

export const sanitizeInput = (input: string): string => {
    if (!input) return '';

    return input.replace(/[<>]/g, '');
};
