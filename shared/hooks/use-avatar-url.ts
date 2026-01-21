import { useState, useEffect } from 'react';
import { profileService } from '../../features/thiet-lap/ho-so/services/profile-service';

/**
 * Custom hook để lấy signed URL cho avatar từ private bucket
 * @param avatarPath - Đường dẫn file avatar hoặc null
 * @param fallbackSeed - Seed cho avatar mặc định (dicebear)
 * @returns URL của avatar (signed URL hoặc fallback)
 */
export const useAvatarUrl = (avatarPath: string | null | undefined, fallbackSeed: string | number = 'default') => {
    const fallbackUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${fallbackSeed}`;
    const [avatarUrl, setAvatarUrl] = useState<string>(fallbackUrl);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchSignedUrl = async () => {
            if (!avatarPath) {
                setAvatarUrl(fallbackUrl);
                return;
            }

            // Nếu đã là URL đầy đủ, dùng luôn
            if (avatarPath.startsWith('http')) {
                setAvatarUrl(avatarPath);
                return;
            }

            setIsLoading(true);
            try {
                const signedUrl = await profileService.getAvatarUrl(avatarPath);
                setAvatarUrl(signedUrl || fallbackUrl);
            } catch (error) {
                console.error('Error fetching avatar URL:', error);
                setAvatarUrl(fallbackUrl);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSignedUrl();
    }, [avatarPath, fallbackUrl]);

    return { avatarUrl, isLoading };
};
