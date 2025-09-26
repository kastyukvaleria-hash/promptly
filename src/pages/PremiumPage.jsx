// src/pages/PremiumPage.jsx
import React from 'react';
import { IoDiamondOutline, IoFlash, IoHeart, IoShieldCheckmarkOutline, IoCheckmarkCircle } from 'react-icons/io5';
import { useUserProfile } from '../hooks/useUserProfile.js';
import styles from './PremiumPage.module.css';

const PremiumPage = () => {
  const { profileData, isLoading } = useUserProfile();

  if (isLoading) {
    return <div className={styles.loading}>Загрузка статуса...</div>;
  }

  const isAlreadySubscribed = profileData?.subscribed || false;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <div className={styles.headerIcon}>
            <IoDiamondOutline size={28} />
          </div>
          <h1>Премиум</h1>
        </div>
        <p>Раскройте полный потенциал обучения</p>
      </header>

      <section className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <IoFlash size={24} />
          </div>
          <div className={styles.featureContent}>
            <h3>Учитесь в своем темпе</h3>
            <p>Открывайте доступ к любому разделу сразу, не проходя курс по порядку.</p>
          </div>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <IoHeart size={24} />
          </div>
          <div className={styles.featureContent}>
            <h3>Бесконечные жизни</h3>
            <p>Совершайте ошибки без страха и ограничений. Сердца больше не будут вас сдерживать.</p>
          </div>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <IoShieldCheckmarkOutline size={24} />
          </div>
          <div className={styles.featureContent}>
            <h3>Приоритетная поддержка</h3>
            <p>Получайте быстрые ответы от нашей команды и прямую связь с администрацией.</p>
          </div>
        </div>
      </section>

      <section className={styles.plansContainer}>
        <div className={styles.planCard}>
          <span className={styles.recommendBadge}>Рекомендуем</span>
          <h4>Премиум</h4>
          <div className={styles.price}>
            <h2>4.50$</h2>
            <span>/ месяц</span>
          </div>
          <ul className={styles.planFeatures}>
            <li><IoCheckmarkCircle /> Доступ ко всем разделам сразу</li>
            <li><IoCheckmarkCircle /> Бесконечные жизни</li>
            <li><IoCheckmarkCircle /> Приоритетная поддержка</li>
          </ul>
          {isAlreadySubscribed ? (
            // --- ИЗМЕНЕНИЕ: Новый стиль и текст для активной подписки ---
            <button className={styles.activePremiumButton} disabled>
              Премиум активен
            </button>
          ) : (
            <button className={styles.ctaButton}>Получить Премиум</button>
          )}
        </div>

        <div className={styles.planCard}>
          <h4>Базовый</h4>
          <h2>Бесплатно</h2>
          <ul className={styles.planFeatures}>
            <li><IoCheckmarkCircle /> 3 жизни, восстанавливающиеся со временем</li>
            <li><IoCheckmarkCircle /> Последовательное прохождение разделов</li>
            <li><IoCheckmarkCircle /> Возможное наличие рекламы</li>
          </ul>
          {/* --- ИЗМЕНЕНИЕ: Улучшенная логика отображения --- */}
          {isAlreadySubscribed ? (
             <button className={styles.basicButton} disabled>Неактивен</button>
          ) : (
             <button className={styles.activeButton} disabled>Ваш план</button>
          )}
        </div>
      </section>
    </div>
  );
};

export default PremiumPage;