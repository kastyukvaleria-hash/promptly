// src/pages/HomePage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    // Правильный и надежный фильтр
    const lectures = courseData.sections.filter(section => !section.premium);
    const practices = courseData.sections.filter(section => section.premium === true);
    return { lectureSections: lectures, practiceSections: practices };
  }, [courseData]);

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
      
      <motion.div
        className={styles.contentSlider}
        animate={{ x: activeTab === 'lectures' ? '0%' : '-50%' }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.1 }}
      >
        <div className={styles.slide}>
          <main className={styles.sectionsList}>
            {lectureSections.length > 0 ? (
                lectureSections.map((section, index) => (
                    <SectionCard key={section.id} section={section} index={index} />
                ))
            ) : (
                <div className={styles.message}><p>Здесь пока нет лекций.</p></div>
            )}
          </main>
        </div>
        <div className={styles.slide}>
          <main className={styles.sectionsList}>
            {practiceSections.length > 0 ? (
                practiceSections.map((section, index) => (
                    <SectionCard key={section.id} section={section} index={index} />
                ))
            ) : (
                <div className={styles.message}><p>Здесь пока нет практических курсов.</p></div>
            )}
          </main>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;