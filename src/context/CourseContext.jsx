import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import courseService from '../api/courseService';
import { useAuth } from '../hooks/useAuth';

const CourseContext = createContext(null);

export const CourseProvider = ({ children }) => {
  const [serverCourseData, setServerCourseData] = useState(null);
  const [localLivesAdjustment, setLocalLivesAdjustment] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastLoadTime, setLastLoadTime] = useState(null);
  const { isLoggedIn } = useAuth();

  const [isLoadingInternal, setIsLoadingInternal] = useState(false);

  const loadCourseData = useCallback(async (forceReload = false) => {
    if (!isLoggedIn) {
      console.log('User not logged in, skipping course data load');
      setIsLoading(false);
      setServerCourseData(null);
      setLocalLivesAdjustment(0);
      return null;
    }
    
    console.log(`Loading course data... Force reload: ${forceReload}, isLoadingInternal: ${isLoadingInternal}`);
    
    // Предотвращаем множественные одновременные загрузки
    if (isLoadingInternal && !forceReload) {
      console.log('Already loading internally, skipping...');
      return serverCourseData;
    }

    setIsLoading(true);
    setIsLoadingInternal(true);
    setError(null);
    
    try {
      const data = forceReload 
        ? await courseService.getCourseOutlineForce()
        : await courseService.getCourseOutline();
        
      console.log('Course data loaded successfully:', data);
      setServerCourseData(data);
      setLocalLivesAdjustment(0);
      setLastLoadTime(Date.now());
      return data;
    } catch (err) {
      console.error('Ошибка загрузки данных курса:', err);
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
      setIsLoadingInternal(false);
    }
  }, [isLoggedIn]); // Убрал isLoadingInternal и serverCourseData из зависимостей

  // Загружаем данные при изменении статуса авторизации
  useEffect(() => {
    console.log('CourseProvider effect triggered:', { isLoggedIn, hasServerData: !!serverCourseData });
    if (isLoggedIn && !serverCourseData) {
      console.log('Initial course data load...');
      loadCourseData();
    } else if (!isLoggedIn) {
      console.log('User not logged in, clearing data');
    } else if (serverCourseData) {
      console.log('Server data already exists, skipping load');
    }
  }, [isLoggedIn, serverCourseData, loadCourseData]);

  const reloadCourseData = useCallback(async (forceReload = false) => {
    console.log(`Reloading course data... Force reload: ${forceReload}`);
    return await loadCourseData(forceReload);
  }, [loadCourseData]);
  
  const forceReloadCourseData = useCallback(async () => {
    console.log('FORCE reloading course data (bypassing all caches)...');
    return await loadCourseData(true);
  }, [loadCourseData]);
  
  const decrementLifeLocally = useCallback(() => {
    console.log('Decrementing life locally');
    setLocalLivesAdjustment(prevAdjustment => prevAdjustment - 1);
  }, []);

  const finalCourseData = useMemo(() => {
    if (!serverCourseData) {
      console.log('No server course data available');
      return null;
    }

    const finalLives = serverCourseData.livesLeft === -1
      ? -1 
      : Math.max(0, serverCourseData.livesLeft + localLivesAdjustment);

    const result = {
      ...serverCourseData,
      livesLeft: finalLives
    };
    
    console.log('Final course data computed:', { 
      sectionsCount: result.sections?.length,
      totalProgress: result.totalCourseProgress,
      lives: result.livesLeft
    });
    
    return result;
  }, [serverCourseData, localLivesAdjustment]);

  const value = {
    courseData: finalCourseData,
    isLoading,
    error,
    reloadCourseData,
    forceReloadCourseData,
    decrementLifeLocally,
    lastLoadTime
  };

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
};

export const useCourseData = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourseData must be used within CourseProvider');
  }
  return context;
};