// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react'; // <-- Добавили useState
import { Link } from 'react-router-dom';
import { useCourseData } from '../context/CourseContext.jsx';
import { useAuth } from '../hooks/useAuth.js';
import LivesIndicator from '../components/common/LivesIndicator.jsx';
import SectionCard from '../components/courses/SectionCard.jsx';
import HomePageSkeleton from '../components/common/HomePageSkeleton.jsx';
import styles from './HomePage.module.css';

const HomePage = () => {
  // --- НАЧАЛО ИЗМЕНЕНИЙ ---
  // Убираем isLoading, так как у нас будет своя, более умная логика
  const { courseData, error, reloadCourseData } = useCourseData();
  const { user } = useAuth();
  
  // Новое состояние, которое будет управлять показом скелета
  const [isPreparing, setIsPreparing] = useState(true);

  useEffect(() => {
    // Создаем асинхронную функцию, чтобы красиво все обработать
    const preparePage = async () => {
      try {
        // Запускаем ДВА процесса одновременно и ждем, пока ОБА завершатся
        await Promise.all([
          reloadCourseData(), // 1. Загрузка данных
          new Promise(resolve => setTimeout(resolve, 800)) // 2. Таймер на 1 секунду
        ]);
      } catch (err) {
        // Если во время загрузки данных произойдет ошибка, мы ее проигнорируем здесь,
        // потому что `useCourseData` сам сохранит эту ошибку в `error`
        console.error("Ошибка при загрузке данных курса, будет показан экран ошибки.", err);
      } finally {
        // Этот блок выполнится в любом случае: и при успехе, и при ошибке.
        // Он уберет скелет-загрузчик.
        setIsPreparing(false);
      }
    };

    preparePage();
    // Мы хотим, чтобы это выполнялось только один раз при заходе на страницу,
    // поэтому массив зависимостей оставляем таким.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // --- КОНЕЦ ИЗМЕНЕНИЙ ---

  // Теперь главный индикатор загрузки - это наше новое состояние `isPreparing`
  if (isPreparing) {
    return <HomePageSkeleton />;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.message}>
          <p>Не удалось загрузить курс.</p>
          <button onClick={() => window.location.reload()} className="primaryButton">
            Перезагрузить страницу
          </button>
        </div>
      </div>
    );
  }

  if (!courseData || !courseData.sections || !courseData.sections.length) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.titleWrapper}>
            <h1 className={styles.title}>Привет 👋</h1>
            <h2 className={styles.subtitle}>Пора учить промпты!</h2>
          </div>
        </header>

        {user && user.role === 'ADMIN' && (
          <Link to="/admin" className={styles.adminButton}>
            Панель Администратора
          </Link>
        )}

        <div className={styles.message}>Курс пока пуст. Загляните позже!</div>
      </div>
    );
  }

  const totalLessonsInCourse = courseData.sections.reduce(
    (total, section) => total + section.chapters.reduce((sum, chapter) => sum + chapter.lectures.length, 0),
    0
  );
  const completedLessonsInCourse = Math.round((totalLessonsInCourse * courseData.totalCourseProgress) / 100);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.livesWrapper}>
          <LivesIndicator />
        </div>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Привет 👋</h1>
          <h2 className={styles.subtitle}>Пора учить промпты!</h2>
        </div>
      </header>

      {user && user.role === 'ADMIN' && (
        <Link to="/admin" className={styles.adminButton}>
          Панель Администратора
        </Link>
      )}

      <div className={styles.overallProgress}>
        <div className={styles.progressInfo}>
          <span className={styles.progressTitle}>Пройти {courseData.sections.length} раздела</span>
          <span className={styles.progressPercentage}>{courseData.totalCourseProgress}%</span>
        </div>
        <p className={styles.progressDescription}>
          {completedLessonsInCourse} из {totalLessonsInCourse} уроков
        </p>
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBar} style={{ width: `${courseData.totalCourseProgress}%` }} />
        </div>
      </div>

      <main className={styles.sectionsList}>
        {courseData.sections.map((section, index) => (
          <SectionCard key={section.id} section={section} index={index} />
        ))}
      </main>
    </div>
  );
};

export default HomePage;