// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
// --- НАЧАЛО ИЗМЕНЕНИЙ (ИСПРАВЛЕНЫ ПУТИ) ---
import { useAuth } from '../hooks/useAuth.js';
import userService from '../api/userService.js';
import { getAvatarById } from '../utils/avatarUtils.js';
// --- КОНЕЦ ИЗМЕНЕНИЙ ---
import PromptAccordion from '../components/profile/PromptAccordion.jsx';
import LivesIndicator from '../components/common/LivesIndicator.jsx';
import Modal from '../components/common/Modal.jsx';
import AvatarSelectionModal from '../components/profile/AvatarSelectionModal.jsx';
import { useCourseData } from '../context/CourseContext.jsx';
import { IoPodiumOutline, IoFlameOutline, IoCalendarOutline, IoDocumentTextOutline } from 'react-icons/io5';
import ProfilePageSkeleton from '../components/profile/ProfilePageSkeleton.jsx';
import LogoutConfirmationModal from '../components/profile/LogoutConfirmationModal.jsx';
import styles from './ProfilePage.module.css';

const getUserRank = (activeDays) => {
  if (activeDays >= 15) return 'Профи';
  if (activeDays >= 10) return 'Продвинутый';
  if (activeDays >= 3) return 'Ученик';
  return 'Новичок';
};

const ProfilePage = () => {
  const { courseData, isLoading: isCourseLoading } = useCourseData();
  const { logout } = useAuth();
  
  const [profileData, setProfileData] = useState(null);
  const [promptsData, setPromptsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [profile, prompts] = await Promise.all([
          userService.getProfile(),
          userService.getPrompts()
        ]);
        setProfileData(profile);
        setPromptsData(prompts);
      } catch (err) {
        console.error("Ошибка загрузки профиля:", err.response || err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleAvatarSelect = async (newAvatarId) => {
    if (!profileData || profileData.avatarId === newAvatarId) {
      setIsAvatarModalOpen(false);
      return;
    }
    const oldAvatarId = profileData.avatarId;
    setProfileData(prevData => ({ ...prevData, avatarId: newAvatarId }));
    setIsAvatarModalOpen(false);
    try {
      await userService.updateAvatar(newAvatarId);
    } catch (error) {
      console.error('Не удалось сохранить аватар на сервере:', error);
      setProfileData(prevData => ({ ...prevData, avatarId: oldAvatarId }));
      alert('Не удалось обновить аватар. Попробуйте снова.');
    }
  };

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (error || !profileData) {
    return <div className={styles.message}>Не удалось загрузить профиль. Обновите страницу.</div>;
  }

  const rank = getUserRank(profileData.totalActiveDays);
  const isSubscribed = profileData.subscribed;
  const isAccountLinked = profileData.isEmailPasswordLinked || false;

  return (
    <>
      <div className={styles.container}>
        <header className={styles.header}>
          {!isCourseLoading && courseData && (
            <LivesIndicator lives={courseData.livesLeft} recoveryTime={courseData.recoveryTimeLeft} />
          )}
        </header>

        <main>
          <section className={styles.userCard}>
            <div className={styles.userInfo}>
              <button className={styles.avatarButton} onClick={() => setIsAvatarModalOpen(true)}>
                <img src={getAvatarById(profileData.avatarId)} alt="Аватар" />
              </button>
              <div className={styles.userText}>
                <button className={styles.nicknameButton} onClick={() => setIsLogoutModalOpen(true)}>
                  @{profileData.nickname}
                </button>
                <p className={styles.bio}>Изучаю промт-инженеринг</p>
                <div className={styles.badges}>
                  <span className={styles.badge} data-rank={rank.toLowerCase()}>{rank}</span>
                  <span className={`${styles.badge} ${isSubscribed ? styles.premiumBadge : styles.baseBadge}`}>
                    {isSubscribed ? 'Премиум' : 'Базовый'}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.statsGrid}>
            <div className={styles.statCard}>
              <IoPodiumOutline size={28} />
              <span className={styles.statValue}>{profileData.totalLecturesCompleted}</span>
              <span className={styles.statLabel}>Пройдено лекций</span>
            </div>
            <div className={styles.statCard}>
              <IoFlameOutline size={28} />
              <span className={styles.statValue}>{profileData.consecutiveDays}</span>
              <span className={styles.statLabel}>Дней подряд</span>
            </div>
            <div className={styles.statCard}>
              <IoCalendarOutline size={28} />
              <span className={styles.statValue}>{profileData.totalActiveDays}</span>
              <span className={styles.statLabel}>Дней в приложении</span>
            </div>
          </section>

          <section className={styles.promptsSection}>
            <h2 className={styles.sectionTitle}>
              <IoDocumentTextOutline />
              Изученные промпты
            </h2>
            <PromptAccordion sections={promptsData} />
          </section>
        </main>
      </div>

      <Modal 
        isOpen={isAvatarModalOpen} 
        onClose={() => setIsAvatarModalOpen(false)}
        title="Выберите аватар"
      >
        <AvatarSelectionModal 
          onSelect={handleAvatarSelect}
          currentAvatarId={profileData.avatarId}
        />
      </Modal>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Выход"
      >
        <LogoutConfirmationModal
          onClose={() => setIsLogoutModalOpen(false)}
          onLogout={logout}
          isAccountLinked={isAccountLinked}
        />
      </Modal>
    </>
  );
};

export default ProfilePage;