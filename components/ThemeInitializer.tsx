
import React, { useEffect } from 'react';
import { useAppStore } from '../store/app-store';
import { hexToHSLValues, hexToRGBValues } from '../shared/utils/color';

const ThemeInitializer: React.FC = () => {
    const { primaryColor } = useAppStore();

    useEffect(() => {
        const root = document.documentElement;
        const hsl = hexToHSLValues(primaryColor);
        const rgb = hexToRGBValues(primaryColor);

        root.style.setProperty('--primary', hsl);
        root.style.setProperty('--primary-rgb', rgb);
    }, [primaryColor]);

    return null;
};

export default ThemeInitializer;
