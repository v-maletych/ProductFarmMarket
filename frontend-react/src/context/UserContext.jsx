import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } 
      catch (error) { localStorage.removeItem('currentUser'); }
    }
    setIsLoading(false);
  }, []);

  const register = (name, email, password) => {
    const usersDB = JSON.parse(localStorage.getItem('usersDB')) || [];
    if (usersDB.find(u => u.email === email)) {
      toast.error('Ця пошта вже зареєстрована!'); return false;
    }
    const newUser = { 
      id: Date.now(), name, email, password, phone: '', address: '', avatar: '',
      bannerColor: '#10b981', bannerImage: '', cardColor: '#ffffff', pageColor: '#f3f4f6',
      orders: [],
      wishlist: [] // <--- НОВЕ ПОЛЕ
    };
    usersDB.push(newUser);
    localStorage.setItem('usersDB', JSON.stringify(usersDB));
    login(email, password);
    return true;
  };

  const login = (email, password) => {
    const usersDB = JSON.parse(localStorage.getItem('usersDB')) || [];
    const foundUser = usersDB.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password, ...userWithoutPass } = foundUser;
      setUser(userWithoutPass);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPass));
      toast.success(`Вітаємо, ${foundUser.name}!`);
      return true;
    }
    toast.error('Невірний email або пароль'); return false;
  };

  const logout = () => {
    setUser(null); localStorage.removeItem('currentUser'); toast.success('Ви вийшли з акаунту');
  };

  const updateUserProfile = (updatedData) => {
    if (!user) return;
    updateUserData({ ...user, ...updatedData });
    toast.success('Профіль оновлено успішно!');
  };

  const addOrderToHistory = (orderData) => {
    if (!user) return;
    const fullDate = new Date().toLocaleString('uk-UA');
    const newOrder = { ...orderData, id: Date.now(), date: fullDate };
    updateUserData({ ...user, orders: [...(user.orders || []), newOrder] });
  };

  const clearOrderHistory = () => {
    if (!user) return;
    updateUserData({ ...user, orders: [] });
    toast.success('Історія замовлень очищена');
  };

  const deleteOrder = (orderId) => {
    if (!user) return;
    const updatedOrders = user.orders.filter(order => order.id !== orderId);
    updateUserData({ ...user, orders: updatedOrders });
    toast.success('Замовлення видалено');
  };

  // 🔥 НОВА ФУНКЦІЯ: ДОДАТИ/ВИДАЛИТИ З ОБРАНОГО 🔥
  const toggleWishlist = (product) => {
    if (!user) {
      toast.error("Увійдіть, щоб додати в обране");
      return;
    }
    const currentWishlist = user.wishlist || [];
    const isExists = currentWishlist.find(p => p.id === product.id);
    
    let newWishlist;
    if (isExists) {
      newWishlist = currentWishlist.filter(p => p.id !== product.id);
      toast("Видалено з обраного", { icon: '💔' });
    } else {
      newWishlist = [...currentWishlist, product];
      toast("Додано в обране", { icon: '❤️' });
    }
    updateUserData({ ...user, wishlist: newWishlist });
  };

  // Допоміжна функція для збереження (щоб не дублювати код)
  const updateUserData = (newUserState) => {
    setUser(newUserState);
    localStorage.setItem('currentUser', JSON.stringify(newUserState));
    const usersDB = JSON.parse(localStorage.getItem('usersDB')) || [];
    const newDB = usersDB.map(u => u.id === newUserState.id ? newUserState : u); // Важливо: зберігаємо все
    localStorage.setItem('usersDB', JSON.stringify(newDB));
  }

  return (
    <UserContext.Provider value={{ 
      user, isLoading, login, register, logout, 
      updateUserProfile, addOrderToHistory, clearOrderHistory, deleteOrder,
      toggleWishlist // <--- Передаємо
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);