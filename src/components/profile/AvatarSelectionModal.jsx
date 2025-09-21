import React from 'react';
import { getAllAvatars } from '../../utils/avatarUtils.js';
import styles from './AvatarSelectionModal.module.css';

const AvatarSelectionModal = ({ onSelect, currentAvatarId }) => {
  const avatars = getAllAvatars();

  return (
    <div className={styles.grid}>
      {avatars.map(avatar => (
        <button 
          key={avatar.id} 
          onClick={() => onSelect(avatar.id)} 
          className={`${styles.avatarWrapper} ${currentAvatarId === avatar.id ? styles.selected : ''}`}
        >
          <img src={avatar.src} alt={`Аватар ${avatar.id}`} />
        </button>
      ))}
    </div>
  );
};

export default AvatarSelectionModal;