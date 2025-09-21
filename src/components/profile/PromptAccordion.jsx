import React, { useState } from 'react';
import { IoChevronDown, IoSearch } from 'react-icons/io5';
import styles from './PromptAccordion.module.css';
import PromptItem from './PromptItem.jsx'; // Импортируем наш умный компонент

const PromptAccordion = ({ sections }) => {
  const [openSectionId, setOpenSectionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSection = (sectionId) => {
    setOpenSectionId(openSectionId === sectionId ? null : sectionId);
  };

  if (!sections || sections.length === 0) {
    return <p className={styles.noPrompts}>Пройдите несколько уроков, чтобы здесь появились изученные промпты.</p>;
  }

  return (
    <div className={styles.accordion}>
      {sections.map((section) => {
        // Проверяем, что в секции вообще есть промпты
        if (!section.prompts || section.prompts.length === 0) {
          return null;
        }

        const isOpen = openSectionId === section.sectionId;
        
        const filteredPrompts = section.prompts.filter(p => 
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          p.text.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
          <div key={section.sectionId} className={`${styles.section} ${isOpen ? styles.open : ''}`}>
            <button onClick={() => toggleSection(section.sectionId)} className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <span>{section.sectionTitle}</span>
              </div>
              <IoChevronDown className={styles.chevron} />
            </button>
            {isOpen && (
              <div className={styles.sectionContent}>
                <div className={styles.searchWrapper}>
                  <IoSearch className={styles.searchIcon} />
                  <input 
                    type="text" 
                    placeholder="Поиск по промптам..." 
                    className={styles.searchInput}
                    value={searchTerm}
                    onClick={(e) => e.stopPropagation()} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className={styles.promptsList}>
                  {/* --- ВОТ ГЛАВНОЕ ИСПРАВЛЕНИЕ --- */}
                  {/* Теперь мы реально используем PromptItem и передаем в него все данные */}
                  {filteredPrompts.length > 0 ? (
                    filteredPrompts.map(prompt => (
                      <PromptItem key={prompt.id} title={prompt.title} text={prompt.text} />
                    ))
                  ) : (
                    <p className={styles.noPrompts}>По вашему запросу ничего не найдено.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PromptAccordion;