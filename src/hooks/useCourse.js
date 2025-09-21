import { useState, useEffect } from 'react';
import courseService from '../api/courseService.js';

export const useCourse = () => {
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        const data = await courseService.getCourseOutline();
        setCourseData(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseData();
  }, []);

  return { courseData, isLoading, error };
};