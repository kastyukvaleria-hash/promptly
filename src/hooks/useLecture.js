import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCourseData } from '../context/CourseContext.jsx';
import courseService from '../api/courseService.js';

export const useLecture = () => {
  const { lectureId } = useParams(); // Берем ID лекции из URL
  const { courseData, isLoading: isCourseLoading } = useCourseData(); // Берем данные всего курса

  const [lecture, setLecture] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const findDataAndFetchLecture = async () => {
      // Ждем, пока загрузится общая структура курса
      if (isCourseLoading) {
        return;
      }
      
      if (!courseData) {
        setError('Не удалось загрузить структуру курса.');
        setIsLoading(false);
        return;
      }

      // --- ВОТ ОНА, ГЛАВНАЯ МАГИЯ ---
      // Ищем нашу лекцию во всей структуре курса, чтобы найти ее sectionId
      let foundSectionId = null;
      for (const section of courseData.sections) {
        for (const chapter of section.chapters) {
          const found = chapter.lectures.find(l => l.id === Number(lectureId));
          if (found) {
            foundSectionId = section.id;
            break;
          }
        }
        if (foundSectionId) break;
      }

      if (!foundSectionId) {
        setError('Ошибка: лекция не найдена в структуре курса.');
        setIsLoading(false);
        return;
      }
      
      setSectionId(foundSectionId);

      // Теперь, когда у нас есть sectionId, мы можем безопасно загрузить контент лекции
      try {
        const lectureContent = await courseService.getLectureContent(lectureId);
        setLecture(lectureContent);
      } catch (err) {
        setError('Не удалось загрузить контент лекции.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    findDataAndFetchLecture();

  }, [lectureId, courseData, isCourseLoading]); // Перезапускаем, когда появятся данные курса

  return { lecture, sectionId, isLoading, error };
};