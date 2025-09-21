import React from 'react';
import { IoDiamondOutline, IoFlash, IoHeart, IoShieldCheckmarkOutline, IoCheckmarkCircle } from 'react-icons/io5';
import { useUserProfile } from '../hooks/useUserProfile.js';
import styles from './PremiumPage.module.css';

const PremiumPage = () => {
  const { profileData, isLoading } = useUserProfile();

  if (isLoading) {
    return <div className={styles.loading}>Загрузка статуса...</div>;
  }

  const isAlreadySubscribed = profileData?.isSubscribed || false;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <div className={styles.headerIcon}>
            <IoDiamondOutline size={28} />
          </div>
          <h1>Премиум</h1>
        </div>
        <p>Разблокируйте весь потенциал обучения</p>
      </header>

      <section className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <IoFlash size={24} />
          </div>
          <div className={styles.featureContent}>
            <h3>Скоростное обучение</h3>
            <p>Вы получите возможность выбрать любой раздел для изучения, <span>сразу!</span></p>
          </div>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <IoHeart size={24} />
          </div>
          <div className={styles.featureContent}>
            <h3>Бесконечные жизни</h3>
            <p>У вас больше не будет ограничение по жизням, вы сможете сделать сколько угодно ошибок.</p>
          </div>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <IoShieldCheckmarkOutline size={24} />
          </div>
          <div className={styles.featureContent}>
            <h3>Приорететная поддержка</h3>
            <p>Быстрые ответы от команды экспертов, также прямая связь с администратором.</p>
          </div>
        </div>
      </section>

      <section className={styles.plansContainer}>
        <div className={styles.planCard}>
          <span className={styles.recommendBadge}>Рекомендуем</span>
          <h4>Премиум</h4>
          <div className={styles.price}>
            <h2>4.50$</h2>
            <span>/месяц</span>
          </div>
          <ul className={styles.planFeatures}>
            <li><IoCheckmarkCircle /> Возможность выбрать любой курс</li>
            <li><IoCheckmarkCircle /> Бесконечное количество жизней</li>
            <li><IoCheckmarkCircle /> Приорететная поддержка</li>
          </ul>
          {isAlreadySubscribed ? (
            <button className={styles.ctaButton} disabled>Подписка активна</button>
          ) : (
            <button className={styles.ctaButton}>Активировать</button>
          )}
        </div>

        <div className={styles.planCard}>
          <h4>Базовый</h4>
          <h2>Бесплатно</h2>
          <ul className={styles.planFeatures}>
            <li><IoCheckmarkCircle /> 3 жизней которые обновляться каждый час</li>
            <li><IoCheckmarkCircle /> Все разделы проходиться по порядку</li>
            <li><IoCheckmarkCircle /> Наличие рекламы</li>
          </ul>
          {!isAlreadySubscribed && (
            <button className={styles.activeButton} disabled>Активен</button>
          )}
        </div>
      </section>
    </div>
  );
};

export default PremiumPage;