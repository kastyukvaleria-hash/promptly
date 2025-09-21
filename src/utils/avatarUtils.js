// Импортируем все твои 9 аватарок.
// Убедись, что они лежат в папке src/assets/avatars и называются 1.png, 2.png и т.д.
import avatar1 from '../assets/avatars/1.png';
import avatar2 from '../assets/avatars/2.png';
import avatar3 from '../assets/avatars/3.png';
import avatar4 from '../assets/avatars/4.png';
import avatar5 from '../assets/avatars/5.png';
import avatar6 from '../assets/avatars/6.png';
import avatar7 from '../assets/avatars/7.png';
import avatar8 from '../assets/avatars/8.png';
import avatar9 from '../assets/avatars/9.png';

// Создаем "карту" аватарок, где ключ - это цифра, а значение - сама картинка
const avatarMap = {
  1: avatar1,
  2: avatar2,
  3: avatar3,
  4: avatar4,
  5: avatar5,
  6: avatar6,
  7: avatar7,
  8: avatar8,
  9: avatar9,
};

// Функция, которая безопасно возвращает аватарку.
// Если с бэкенда придет неизвестный номер (например, 0 или null),
// она вернет первую аватарку по умолчанию, чтобы ничего не ломалось.
export const getAvatarById = (id) => {
  return avatarMap[id] || avatar1;
};

// Новая функция, которая возвращает ВСЕ аватарки.
// Она понадобится нам для модального окна выбора аватара.
export const getAllAvatars = () => {
  return Object.entries(avatarMap).map(([id, src]) => ({
    id: parseInt(id, 10), // Преобразуем ключ-строку в число
    src: src,
  }));
};