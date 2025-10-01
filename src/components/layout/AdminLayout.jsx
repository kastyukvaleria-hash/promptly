// src/components/layout/AdminLayout.jsx
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { IoHomeOutline } from 'react-icons/io5';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <>
      <header className={styles.adminHeader}>
        <div className={styles.container}>
          <h1 className={styles.logo}>Админ-панель</h1>
          <button onClick={() => navigate('/')} className={styles.homeButton}>
            <IoHomeOutline />
            Вернуться на сайт
          </button>
        </div>
      </header>
      <main className={styles.adminContent}>
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;