import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoArrowBack } from 'react-icons/io5';
import courseService from '../api/courseService';
import progressService from '../api/progressService';
import { useCourseData } from '../context/CourseContext.jsx';
import LivesIndicator from '../components/common/LivesIndicator.jsx';
import styles from './LecturePage.module.css';

const animation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.35, ease: 'easeInOut' },
};

const Skeleton = () => (
  <div className={styles.contentWrapper}>
    <div style={{height: 28, width: '70%', background: 'rgba(255,255,255,0.08)', borderRadius: 8, marginBottom: 20}} />
    <div style={{height: 14, width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: 6, marginBottom: 12}} />
    <div style={{height: 14, width: '95%', background: 'rgba(255,255,255,0.06)', borderRadius: 6, marginBottom: 12}} />
    <div style={{height: 14, width: '90%', background: 'rgba(255,255,255,0.06)', borderRadius: 6, marginBottom: 12}} />
  </div>
);

const LecturePage = () => {
  const { lectureId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { courseData, reloadCourseData } = useCourseData();

  const sectionIdFromState = location.state?.sectionId || null;

  // ищем лекцию и главу в актуальном outline
  const placement = useMemo(() => {
    if (!courseData) return null;
    for (const s of courseData.sections || []) {
      for (const ch of s.chapters || []) {
        const lec = ch.lectures.find(l => String(l.id) === String(lectureId));
        if (lec) return { section: s, chapter: ch, lecture: lec };
      }
    }
    return null;
  }, [courseData, lectureId]);

  const resolvedSectionId = sectionIdFromState || placement?.section?.id || null;

  // доступ управляет сервер: если глава locked — не пускаем на незавершённые лекции
  const isLectureAllowed = useMemo(() => {
    if (!placement?.chapter || !placement?.lecture) return false;

    const chUnlocked = !!placement.chapter.unlocked;
    const isCompleted = placement.lecture.state === 'COMPLETED';

    if (!chUnlocked && !isCompleted) return false;

    // В открытой главе — только первая незавершённая доступна (остальные до неё — закрыты)
    if (chUnlocked && !isCompleted) {
      const firstIncomplete = placement.chapter.lectures.find(l => l.state !== 'COMPLETED');
      return firstIncomplete && String(firstIncomplete.id) === String(lectureId);
    }

    return true;
  }, [placement, lectureId]);

  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (courseData && placement && !isLectureAllowed) {
      if (resolvedSectionId) navigate(`/section/${resolvedSectionId}`);
      else navigate('/');
    }
  }, [courseData, placement, isLectureAllowed, resolvedSectionId, navigate]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!courseData) await reloadCourseData();
      setLoading(true);
      setErr('');
      try {
        const data = await courseService.getLectureContent(lectureId);
        if (!cancelled) setLecture(data);
      } catch (e) {
        if (!cancelled) setErr(e?.response?.data?.message || 'Не удалось загрузить лекцию');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lectureId]);

  const startTestIfAny = () => {
    if (lecture?.testId) {
      navigate(`/test/${lecture.testId}`, { state: { lectureId: lecture.id, sectionId: resolvedSectionId } });
    }
  };

  const markCompleted = async () => {
    if (!resolvedSectionId || !lecture?.id) return;
    try {
      await progressService.completeLecture(lecture.id, resolvedSectionId);
    } catch {}
    await reloadCourseData(true);
    navigate(`/section/${resolvedSectionId}`);
  };

  return (
    <motion.div
      className={styles.pageWrapper}
      variants={animation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={animation.transition}
    >
      <header className={styles.header}>
        <button onClick={() => navigate(resolvedSectionId ? `/section/${resolvedSectionId}` : '/')} className={styles.backButton}>
          <IoArrowBack size={24} />
        </button>
        <LivesIndicator />
      </header>

      <div className={styles.container}>
        {loading ? (
          <Skeleton />
        ) : !lecture ? (
          <div className={styles.message}>
            <p>{err || 'Лекция недоступна.'}</p>
          </div>
        ) : (
          <div className={styles.contentWrapper}>
            <h1 className={styles.title}>{lecture.title}</h1>

            {lecture.videoUrl && (
              <video src={lecture.videoUrl} controls style={{ maxWidth: '100%', borderRadius: 12, marginBottom: 20 }} />
            )}

            {lecture.contentText && <div className={styles.contentText}>{lecture.contentText}</div>}

            <div className={styles.footer}>
              {lecture.testId ? (
                <button className="primaryButton" onClick={startTestIfAny}>
                  Пройти тест лекции
                </button>
              ) : (
                resolvedSectionId && (
                  <button className="primaryButton" onClick={markCompleted}>
                    Отметить как пройдено
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LecturePage;
