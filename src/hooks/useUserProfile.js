import { useState, useEffect } from 'react';
import userService from '../api/userService.js';

export const useUserProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [promptsData, setPromptsData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Запрашиваем данные профиля и промпты параллельно
        const [profile, prompts] = await Promise.all([
          userService.getProfile(),
          userService.getPrompts()
        ]);
        setProfileData(profile);
        setPromptsData(prompts);
      } catch (err) {
        setErrorProfile(err);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    fetchAllData();
  }, []);

  // --- НОВАЯ ФУНКЦИЯ ДЛЯ МГНОВЕННОГО ОБНОВЛЕНИЯ UI ---
  const updateLocalAvatar = (newAvatarId) => {
    if (profileData) {
      setProfileData(prevData => ({
        ...prevData,
        avatarId: newAvatarId,
      }));
    }
  };

  return { profileData, promptsData, isLoadingProfile, errorProfile, updateLocalAvatar };
};