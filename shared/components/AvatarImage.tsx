import React from 'react';
import { useAvatarUrl } from '../hooks/use-avatar-url';

interface AvatarImageProps {
    avatarPath: string | null | undefined;
    fallbackSeed: string | number;
    alt?: string;
    className?: string;
}

/**
 * Component hiển thị avatar với signed URL từ private bucket
 */
export const AvatarImage: React.FC<AvatarImageProps> = ({
    avatarPath,
    fallbackSeed,
    alt = 'Avatar',
    className = 'w-full h-full object-cover'
}) => {
    const { avatarUrl, isLoading } = useAvatarUrl(avatarPath, fallbackSeed);

    if (isLoading) {
        return (
            <div className={className + ' bg-slate-200 animate-pulse'} />
        );
    }

    return (
        <img
            src={avatarUrl}
            alt={alt}
            className={className}
            loading="lazy"
        />
    );
};
