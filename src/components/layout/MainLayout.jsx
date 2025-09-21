import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav.jsx';
import DailyStreakManager from './DailyStreakManager.jsx';
import styles from './MainLayout.module.css';

const MainLayout = () => {
  return (
    <div className={styles.layout}>
      {/* 
        Добавляем наш менеджер "чекинов".
        Он будет работать в фоне на всех страницах,
        которые используют этот layout.
      */}
      <DailyStreakManager />
      
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      
      <BottomNav />
    </div>
  );
};

export default MainLayout;