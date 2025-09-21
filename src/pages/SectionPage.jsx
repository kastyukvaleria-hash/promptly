import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, Navigate, Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoArrowBack, IoPlay, IoSparkles, IoLockClosed, IoBook, IoClipboardOutline } from 'react-icons/io5';
import { useCourseData } from '../context/CourseContext.jsx';
import progressService from '../api/progressService.js';
import LivesIndicator from '../components/common/LivesIndicator.jsx';
import styles from './SectionPage.module.css';

const animation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4, ease: 'easeInOut' },
};

const LessonNode = ({ lesson, sectionId }) => {
  const isCompleted = lesson.uiState === 'COMPLETED';
  const isUnlocked  = lesson.uiState === 'UNLOCKED';
  const isLocked    = lesson.uiState === 'LOCKED';

  let Icon = IoSparkles;
  if (isUnlocked) Icon = IoPlay;
  if (isLocked)   Icon = IoLockClosed;

  const nodeClasses = `${styles.lessonNode} ${isCompleted ? styles.completed : ''} ${isLocked ? styles.locked : ''} ${isUnlocked ? styles.unlocked : ''}`;
  const nodeContent = (<div className={nodeClasses}><Icon size={32} /></div>);

  if (isLocked) return nodeContent;
  return <Link to={`/lecture/${lesson.id}`} state={{ sectionId }}>{nodeContent}</Link>;
};

const SectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sectionId } = useParams();

  const { sectionData: initialSectionData } = location.state || {};
  const { courseData, isLoading, reloadCourseData } = useCourseData();
  const [isCompletingSection, setIsCompletingSection] = useState(false);

  useEffect(() => {
    reloadCourseData();
  }, [sectionId, reloadCourseData]);

  const sectionData = useMemo(() => {
    const fresh = courseData?.sections?.find(s => s.id === Number(sectionId));
    return fresh || initialSectionData;
  }, [courseData, initialSectionData, sectionId]);

  // строим UI состояния лекций только от server state (chapter.unlocked + lecture.state)
  const computed = useMemo(() => {
    if (!sectionData?.chapters?.length) return null;

    const lecturesUI = new Map();
    const canTakeChapterTest = new Map();

    for (const ch of sectionData.chapters) {
      const isChapterUnlocked = !!ch.unlocked;
      const ordered = ch.lectures.slice();
      const allLecturesCompleted = ordered.every(l => l.state === 'COMPLETED');
      const firstIncomplete = ordered.find(l => l.state !== 'COMPLETED');

      canTakeChapterTest.set(ch.id, !!ch.testId && isChapterUnlocked && allLecturesCompleted);

      const list = ordered.map(l => {
        let uiState = 'LOCKED';
        if (l.state === 'COMPLETED') {
          uiState = isChapterUnlocked ? 'COMPLETED' : 'LOCKED';
        } else if (isChapterUnlocked && firstIncomplete && firstIncomplete.id === l.id) {
          uiState = 'UNLOCKED';
        } else {
          uiState = 'LOCKED';
        }
        return { ...l, uiState, sectionId: sectionData.id, chapterId: ch.id };
      });

      lecturesUI.set(ch.id, list);
    }

    return { lecturesUI, canTakeChapterTest };
  }, [sectionData]);

  const orderIndexToComplete = useMemo(() => {
    if (!courseData || !sectionData) return null;
    const idx = courseData.sections.findIndex(s => s.id === sectionData.id);
    return idx >= 0 ? idx + 1 : null;
  }, [courseData, sectionData]);

  const isSectionCompleted = useMemo(() => {
    if (!sectionData) return false;
    return sectionData.chapters.every(ch =>
      ch.lectures.every(l => l.state === 'COMPLETED')
    );
  }, [sectionData]);

  const handleCompleteSection = async () => {
    if (!orderIndexToComplete) {
      alert('Критическая ошибка: не удалось определить порядковый номер раздела.');
      return;
    }
    setIsCompletingSection(true);
    try {
      await progressService.completeSection(orderIndexToComplete, sectionData.id);
      await reloadCourseData(true);
      navigate('/');
    } catch (error) {
      alert(`Произошла ошибка при сохранении прогресса. ${error.message}`);
      setIsCompletingSection(false);
    }
  };

  if (isLoading && !sectionData) {
    return <div className={styles.container}><p>Загрузка раздела...</p></div>;
  }
  if (!sectionData || !computed) {
    return <Navigate to="/" replace />;
  }

  return (
    <motion.div
      variants={animation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={animation.transition}
      className={styles.pageWrapper}
    >
      <header className={styles.header}>
        <button onClick={() => navigate('/')} className={styles.backButton}><IoArrowBack size={28} /></button>
        <LivesIndicator />
      </header>

      <div className={styles.container}>
        <div className="purpleGlow"></div>
        <main className={styles.map}>
          {sectionData.chapters.map((chapter, idx) => {
            const chapterLessons = computed.lecturesUI.get(chapter.id) || [];
            const testEnabled = computed.canTakeChapterTest.get(chapter.id) === true;

            return (
              <section key={chapter.id} className={styles.chapterBlock}>
                {/* Новый заголовок главы */}
                <div className={styles.chapterHeader}>
                  <div className={styles.chapterBadge}>{idx + 1}</div>
                  <div className={styles.chapterHeadTexts}>
                    <h2 className={styles.chapterTitleText}>{chapter.title}</h2>
                    <div className={styles.chapterMeta}>
                      <IoBook size={16} />
                      <span>{chapter.lectures.length} лекций</span>
                      {chapter.testId && (
                        <>
                          <span className={styles.dot} />
                          <IoClipboardOutline size={16} />
                          <span>есть тест главы</span>
                        </>
                      )}
                      {!chapter.unlocked && <span className={styles.lockBadge}><IoLockClosed /> Глава закрыта</span>}
                    </div>
                  </div>
                </div>

                {/* Лекции */}
                <div className={styles.lessonsGrid}>
                  {chapterLessons.map((lesson, index) => {
                    const isLeft = index % 2 !== 0;
                    return (
                      <div key={lesson.id} className={`${styles.nodeWrapper} ${isLeft ? styles.left : styles.right}`}>
                        <LessonNode lesson={lesson} sectionId={lesson.sectionId} />
                      </div>
                    );
                  })}
                </div>

                {/* Тест главы — снизу, понятная надпись */}
                {chapter.testId && (
                  <button
                    className={`${styles.chapterTestButton} ${testEnabled ? styles.testEnabled : styles.testDisabled}`}
                    disabled={!testEnabled}
                    onClick={() => {
                      if (!testEnabled) return;
                      navigate(`/test/${chapter.testId}`, { state: { sectionId: sectionData.id } });
                    }}
                    aria-label={`Тест главы «${chapter.title}»`}
                  >
                    <IoClipboardOutline />
                    <span>Тест главы «{chapter.title}»</span>
                    {chapter.testCompleted && <span className={styles.testCompletedIndicator}>✓</span>}
                  </button>
                )}
              </section>
            );
          })}

          {isSectionCompleted && (
            sectionData.testId ? (
              <button
                onClick={() => {
                  if (!orderIndexToComplete) return;
                  navigate(`/test/${sectionData.testId}`, {
                    state: { sectionId: sectionData.id, orderIndex: orderIndexToComplete }
                  });
                }}
                className={`${styles.completionCard} ${styles.sectionTestButton}`}
              >
                <h2 className={styles.completionTitle}>Отлично!</h2>
                <p className={styles.completionSubtitle}>Вы прошли все лекции. Осталось сдать финальный тест раздела.</p>
                <div className={styles.completionButton}>Пройти тест раздела</div>
              </button>
            ) : (
              <button onClick={handleCompleteSection} className={styles.completionCard} disabled={isCompletingSection}>
                <h2 className={styles.completionTitle}>Отлично!</h2>
                <p className={styles.completionSubtitle}>Раздел пройден, теперь доступен следующий раздел.</p>
                <div className={styles.completionButton}>
                  {isCompletingSection ? 'Сохранение...' : 'Завершить раздел'}
                </div>
              </button>
            )
          )}
        </main>
      </div>
    </motion.div>
  );
};

export default SectionPage;
