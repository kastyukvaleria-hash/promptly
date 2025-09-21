import React, { useState, useMemo } from 'react';
import { IoCopyOutline, IoChevronDown, IoChevronUp } from 'react-icons/io5';
import styles from './PromptAccordion.module.css'; // Используем те же стили

const PromptItem = ({ title, text }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // --- ВОТ ОНО, ФИНАЛЬНОЕ ИСПРАВЛЕНИЕ ---
  // Теперь мы проверяем не количество строк, а ОБЩУЮ ДЛИНУ ТЕКСТА.
  // Если символов больше 300, считаем текст длинным.
  // Это будет работать и с переносами, и без них.
  const isLongText = useMemo(() => {
    return text.length > 300;
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={styles.promptItem}>
      <div className={styles.promptHeader}>
        <h4>{title}</h4>
        <button onClick={handleCopy} className={styles.copyButton}>
          <IoCopyOutline />
        </button>
      </div>

      {/* 
        Эта обертка нужна для градиента. 
        Класс `collapsed` добавляется, только если текст длинный И не развернут.
      */}
      <div className={`${styles.promptTextWrapper} ${isLongText && !isExpanded ? styles.collapsed : ''}`}>
        <p className={styles.promptText}>{text}</p>
      </div>

      {/* Показываем кнопку, только если текст длинный */}
      {isLongText && (
        <button onClick={() => setIsExpanded(!isExpanded)} className={styles.toggleButton}>
          {isExpanded ? <><IoChevronUp /> Скрыть</> : <><IoChevronDown /> Показать еще</>}
        </button>
      )}
    </div>
  );
};

export default PromptItem;