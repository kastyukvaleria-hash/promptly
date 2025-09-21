import React, { useState, useEffect } from 'react';
import userService from '../api/userService.js';
import { getAvatarById } from '../utils/avatarUtils.js';
import PromptAccordion from '../components/profile/PromptAccordion.jsx';
import LivesIndicator from '../components/common/LivesIndicator.jsx';
import Modal from '../components/common/Modal.jsx';
import AvatarSelectionModal from '../components/profile/AvatarSelectionModal.jsx';
import { useCourseData } from '../context/CourseContext.jsx';
import { IoPodiumOutline, IoFlameOutline, IoCalendarOutline, IoDocumentTextOutline } from 'react-icons/io5';
import styles from './ProfilePage.module.css';

const getUserRank = (activeDays) => {
  if (activeDays >= 15) return 'Профи';
  if (activeDays >= 10) return 'Продвинутый';
  if (activeDays >= 3) return 'Ученик';
  return 'Новичок';
};

const ProfilePage = () => {
  const { courseData, isLoading: isCourseLoading } = useCourseData();
  
  const [profileData, setProfileData] = useState(null);
  const [promptsData, setPromptsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setIsModalOpen(false);
      return;
    }
    const oldAvatarId = profileData.avatarId;
    setProfileData(prevData => ({ ...prevData, avatarId: newAvatarId }));
    setIsModalOpen(false);
    try {
      await userService.updateAvatar(newAvatarId);
    } catch (error) {
      console.error('Не удалось сохранить аватар на сервере:', error);
      setProfileData(prevData => ({ ...prevData, avatarId: oldAvatarId }));
      alert('Не удалось обновить аватар. Попробуйте снова.');
    }
  };

  if (isLoading) {
    return <div className={styles.message}>Загрузка профиля...</div>;
  }

  if (error || !profileData) {
    return <div className={styles.message}>Не удалось загрузить профиль. Обновите страницу.</div>;
  }

  const rank = getUserRank(profileData.totalActiveDays);
  // --- ВОТ ОН, ФИНАЛЬНЫЙ ФИКС ---
  // Используем `subscribed`, как в JSON от Данилы
  const isSubscribed = profileData.subscribed;

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
              <button className={styles.avatarButton} onClick={() => setIsModalOpen(true)}>
                <img src={getAvatarById(profileData.avatarId)} alt="Аватар" />
              </button>
              <div className={styles.userText}>
                <h1 className={styles.nickname}>@{profileData.nickname}</h1>
                <p className={styles.bio}>Изучаю промт инжиниринг</p>
                <div className={styles.badges}>
                  <span className={styles.badge} data-rank={rank.toLowerCase()}>{rank}</span>
                  {/* --- ТЕПЕРЬ ЭТА ПРОВЕРКА БУДЕТ РАБОТАТЬ --- */}
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
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Выберите аватар"
      >
        <AvatarSelectionModal 
          onSelect={handleAvatarSelect}
          currentAvatarId={profileData.avatarId}
        />
      </Modal>
    </>
  );
};

export default ProfilePage;