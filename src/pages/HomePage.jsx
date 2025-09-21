// src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCourseData } from '../context/CourseContext.jsx';
import { useAuth } from '../hooks/useAuth.js';
import LivesIndicator from '../components/common/LivesIndicator.jsx';
import SectionCard from '../components/courses/SectionCard.jsx';
import styles from './HomePage.module.css';

const HomePage = () => {
  const { courseData, isLoading, error, reloadCourseData } = useCourseData();
  const { user } = useAuth();

  useEffect(() => {
    reloadCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.message}>
          Загрузка курса...
          <br />
          <button onClick={() => reloadCourseData(true)} style={{ marginTop: '10px' }}>
            Принудительно перезагрузить
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.message}>
          Не удалось загрузить курс.
          <button onClick={() => reloadCourseData()} style={{ marginLeft: '10px' }}>
            Попробовать снова
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
            <h2 className={styles.subtitle}>Пора учить промты!</h2>
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
          <h2 className={styles.subtitle}>Пора учить промты!</h2>
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
