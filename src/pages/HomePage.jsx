// src/pages/HomePage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCourseData } from '../context/CourseContext.jsx';
import { useAuth } from '../hooks/useAuth.js';
import LivesIndicator from '../components/common/LivesIndicator.jsx';
import SectionCard from '../components/courses/SectionCard.jsx';
import HomePageSkeleton from '../components/common/HomePageSkeleton.jsx';
import SegmentedControl from '../components/common/SegmentedControl.jsx';
import styles from './HomePage.module.css';

const HomePage = () => {
  const { courseData, error, reloadCourseData } = useCourseData();
  const { user } = useAuth();
  
  const [isPreparing, setIsPreparing] = useState(true);
  const [activeTab, setActiveTab] = useState('lectures');

  useEffect(() => {
    const preparePage = async () => {
      try {
        await Promise.all([
          reloadCourseData(),
          new Promise(resolve => setTimeout(resolve, 1000))
        ]);
      } catch (err) {
        console.error("Ошибка при загрузке данных курса, будет показан экран ошибки.", err);
      } finally {
        setIsPreparing(false);
      }
    };
    preparePage();
  }, [reloadCourseData]);

  const { lectureSections, practiceSections } = useMemo(() => {
    if (!courseData?.sections) {
      return { lectureSections: [], practiceSections: [] };
    }
    const lectures = courseData.sections.filter(section => !section.isPremium);
    const practices = courseData.sections.filter(section => section.isPremium);
    return { lectureSections: lectures, practiceSections: practices };
  }, [courseData]);

  const sectionsToDisplay = activeTab === 'lectures' ? lectureSections : practiceSections;

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
          <Link to="/admin" className={styles.adminButton}>Панель Администратора</Link>
        )}
        <div className={styles.message}>Курс пока пуст. Загляните позже!</div>
      </div>
    );
  }

  // --- ИЗМЕНЕНИЕ: Возвращаем простой расчет общего прогресса ---
  const totalLessonsInCourse = (courseData.sections || []).reduce(
    (total, section) => total + section.chapters.reduce((sum, chapter) => sum + chapter.lectures.length, 0),
    0
  );
  const completedLessonsInCourse = Math.round((totalLessonsInCourse * (courseData.totalCourseProgress || 0)) / 100);

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

      {/* --- ИЗМЕНЕНИЕ: Блок прогресса теперь показывается ВСЕГДА и использует ОБЩИЕ данные --- */}
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

      <SegmentedControl
        options={[
          { label: 'Лекции', value: 'lectures' },
          { label: 'Практика', value: 'practice' },
        ]}
        selected={activeTab}
        onSelect={setActiveTab}
      />

      <main className={styles.sectionsList}>
        {sectionsToDisplay.length > 0 ? (
            sectionsToDisplay.map((section, index) => (
                <SectionCard key={section.id} section={section} index={index} />
            ))
        ) : (
            <div className={styles.message}>
                <p>
                    {activeTab === 'lectures'
                        ? 'Здесь пока нет лекций. Загляните позже!'
                        : 'Здесь пока нет практических курсов. Они скоро появятся!'
                    }
                </p>
            </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;