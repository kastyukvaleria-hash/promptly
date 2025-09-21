import React, { useState, useEffect, useRef } from 'react';
// --- ИСПРАВЛЕНА ОПЕЧАТКА ЗДЕСЬ ---
import { NavLink, useLocation } from 'react-router-dom'; 
import { IoHomeOutline, IoSparklesOutline, IoPersonOutline, IoDiamondOutline } from 'react-icons/io5';
import styles from './BottomNav.module.css';

const BottomNav = () => {
  const navRef = useRef(null);
  const location = useLocation();
  const [sliderStyle, setSliderStyle] = useState({});
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  useEffect(() => {
    const updateSlider = () => {
      if (navRef.current) {
        const activeLinkElement = navRef.current.querySelector(`.${styles.active}`);
        if (activeLinkElement) {
          setSliderStyle({
            width: `${activeLinkElement.offsetWidth}px`,
            transform: `translateX(${activeLinkElement.offsetLeft}px)`,
          });
        }
      }
    };
    
    updateSlider();
    const timer = setTimeout(updateSlider, 100); // Доп. проверка после рендера

    return () => clearTimeout(timer);

  }, [location]);

  useEffect(() => {
    if (isTooltipVisible) {
      const timer = setTimeout(() => setIsTooltipVisible(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [isTooltipVisible]);

  const handleWipClick = () => setIsTooltipVisible(prev => !prev);

  return (
    <nav className={styles.nav} ref={navRef}>
      <NavLink to="/" end className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
        <IoHomeOutline size={28} />
      </NavLink>
      
      <div className={styles.linkWrapper}>
        <button onClick={handleWipClick} className={styles.actionButton}>
          <IoSparklesOutline size={28} />
        </button>
        {isTooltipVisible && (
          <div className={styles.tooltip}>
            Здесь будет раздел для практики изученного материала. В разработке!
          </div>
        )}
      </div>

      <NavLink to="/profile" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
        <IoPersonOutline size={28} />
      </NavLink>
      <NavLink to="/premium" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
        <IoDiamondOutline size={28} />
      </NavLink>
      
      <div className={styles.slider} style={sliderStyle} />
    </nav>
  );
};

export default BottomNav;