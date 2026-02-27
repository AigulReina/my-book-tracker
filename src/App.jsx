/*# главный КОД (App.jsx) */
import React, { useState, useEffect } from 'react';
import './App.css';
import myLogo from './assets/images/GIPHY ayesha ali.gif';
import exitIcon from './assets/images/arrow-left pixel bytess.png';
import defaultAvatar from './assets/images/frompinterest2.jpg';
import decorationImg from './assets/images/fromPinterest1.png';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('books');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [books, setBooks] = useState([]);

  // Модалки
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Данные
  const [editingBook, setEditingBook] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);

  const [userProfile, setUserProfile] = useState({
    name: '',
    bio: 'Добавьте информацию о себе',
    avatar: defaultAvatar
  });

  const [bookForm, setBookForm] = useState({
    title: '', author: '', status: 'want',
    pages_total: '', pages_read: '',
    coverUrl: '', note: '', bookQuote: ''
  });

  // --- ЛОГИКА СОХРАНЕНИЯ ---
  useEffect(() => {
    const savedBooks = localStorage.getItem('my-library-v2');
    const savedProfile = localStorage.getItem('my-profile-v2');
    if (savedBooks) setBooks(JSON.parse(savedBooks));
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      if (!parsedProfile.avatar) parsedProfile.avatar = defaultAvatar;
      setUserProfile(parsedProfile);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('my-library-v2', JSON.stringify(books));
    localStorage.setItem('my-profile-v2', JSON.stringify(userProfile));
  }, [books, userProfile]);

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'profile') {
          setUserProfile({ ...userProfile, avatar: reader.result });
        } else if (type === 'book') {
          setBookForm({ ...bookForm, coverUrl: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFakeGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => { setIsLoggedIn(true); setIsLoading(false); }, 1200);
  };

  const handleSaveBook = () => {
    if (!bookForm.title) return;
    const bookData = {
      ...bookForm,
      id: editingBook ? editingBook.id : Date.now(),
      rating: selectedRating,
      pages_total: parseInt(bookForm.pages_total) || 0,
      pages_read: parseInt(bookForm.pages_read) || 0,
    };
    if (editingBook) {
      setBooks(books.map(b => b.id === editingBook.id ? bookData : b));
    } else {
      setBooks([...books, bookData]);
    }
    closeBookModal();
  };

  const closeBookModal = () => {
    setIsBookModalOpen(false);
    setEditingBook(null);
    setBookForm({ title: '', author: '', status: 'want', pages_total: '', pages_read: '', coverUrl: '', note: '', bookQuote: '' });
    setSelectedRating(0);
  };

  const deleteBook = () => {
    setBooks(books.filter(b => b.id !== bookToDelete.id));
    setIsDeleteConfirmOpen(false);
    setBookToDelete(null);
  };

  // --- ЭКРАН ВХОДА ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6E3] p-6 text-center font-sans">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          <div>
            <div className="flex justify-center mb-6">
              <img src={myLogo} alt="Logo" className="w-32 h-32 object-contain animate-float" />
            </div>
            <h1 className="text-5xl font-bold text-[#4A3728] font-serif mb-2">MoodBook</h1>
            <p className="text-[#8B7355] italic">Твои книги — твое настроение</p>
          </div>

          <div className="bg-white p-8 rounded-[32px] border-2 border-[#D4C4B0] shadow-sm space-y-6">
            {isLoading ? (
              <div className="py-10 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355] mx-auto"></div>
                <p className="text-[#8B7355] font-bold">Синхронизация...</p>
              </div>
            ) : (
              <>
                <button onClick={handleFakeGoogleLogin} className="w-full py-3 px-4 bg-white border-2 border-[#D4C4B0] rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all">
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G" />
                  Войти через Google
                </button>
                <button onClick={() => setIsLoggedIn(true)} className="w-full py-4 bg-[#8B7355] text-white rounded-2xl font-bold shadow-lg hover:bg-[#6D5D4E] transition-all">
                  Продолжить как гость
                </button>
                <p className="text-sm text-[#8B7355] italic animate-fade-in">
                  "Входя в библиотеку, вы соглашаетесь с тем, что читать книги — это круто."
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6E3] text-[#4A3728] flex flex-col font-sans">
      <header className="sticky top-0 z-10 bg-[#FDF6E3]/90 backdrop-blur-md border-b-2 border-[#D4C4B0] p-4">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src={myLogo} alt="Logo" className="w-10 h-10 object-contain animate-float" />
              <h1 className="text-2xl font-bold font-serif">MoodBook</h1>
            </div>
            <button onClick={() => setIsLoggedIn(false)} className="hover:scale-110 transition-transform">
              <img src={exitIcon} alt="Exit" className="w-8 h-8 object-contain" />
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('profile')} className={`flex-1 py-2 rounded-xl font-bold transition-all ${activeTab === 'profile' ? 'bg-[#8B7355] text-white shadow-md' : 'bg-white/50'}`}>Профиль</button>
            <button onClick={() => setActiveTab('books')} className={`flex-1 py-2 rounded-xl font-bold transition-all ${activeTab === 'books' ? 'bg-[#8B7355] text-white shadow-md' : 'bg-white/50'}`}>Книги</button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 mt-4 flex-grow w-full">
        {activeTab === 'profile' ? (
          <div className="bg-white border-2 border-[#D4C4B0] rounded-[40px] p-10 text-center shadow-sm animate-fade-in max-w-lg mx-auto">
            <div className="group relative w-40 h-40 mx-auto mb-6">
              <div className="absolute inset-0 bg-[#8B7355] rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity"></div>
              <img
                src={userProfile.avatar || defaultAvatar}
                alt="Avatar"
                onClick={() => setIsPreviewOpen(true)}
                className="relative w-full h-full rounded-full object-cover border-4 border-[#8B7355] shadow-sm transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-white bg-[#8B7355] px-2 py-0.5 rounded-full whitespace-nowrap">Открыть фото</span>
              </div>
            </div>
            {/* ТАИНСТВЕННЫЙ ЧТЕЦ */}
            <h2 className="text-4xl font-bold font-serif text-[#4A3728]">
              {userProfile.name.trim() || "Таинственный чтец"}
            </h2>
            <h2 className="text-4xl font-bold font-serif text-[#4A3728] tracking-tight">{userProfile.name}</h2>
            <p className="text-[#8B7355] mt-3 mb-8 italic text-lg opacity-80">“{userProfile.bio}”</p>

            <div className="grid grid-cols-3 gap-4 mb-10 border-t border-b border-[#D4C4B0]/30 py-6">
              <div><div className="text-2xl font-bold text-[#4A3728]">{books.length}</div><div className="text-[10px] uppercase tracking-widest text-[#8B7355] font-bold">Книг</div></div>
              <div><div className="text-2xl font-bold text-[#4A3728]">{books.filter(b => b.status === 'finished').length}</div><div className="text-[10px] uppercase tracking-widest text-[#8B7355] font-bold">Прочитано</div></div>
              <div><div className="text-2xl font-bold text-[#4A3728]">{books.filter(b => b.status === 'reading').length}</div><div className="text-[10px] uppercase tracking-widest text-[#8B7355] font-bold">Читаю</div></div>
            </div>
            <button onClick={() => setIsProfileModalOpen(true)} className="px-10 py-3 bg-[#8B7355] text-white rounded-2xl font-bold hover:bg-[#6D5D4E] transition-all">Редактировать профиль</button>
          </div>
        ) : (
          <div className="animate-fade-in space-y-6">{/*  КАРТИНКА ИЗ ПАПКИ IMAGES  перед кнопкой добавить книгу  */}
            <div className="flex justify-center -mb-4">
              <img
                src={decorationImg}
                alt="decoration"
                className="w-32 h-32 object-contain "
              />
            </div>
            <button onClick={() => setIsBookModalOpen(true)} className="w-full py-4 bg-[#8B7355] text-white rounded-2xl font-bold shadow-md">+ Добавить книгу</button>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {['all', 'want', 'reading', 'finished'].map(f => (
                <button key={f} onClick={() => setCurrentFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all whitespace-nowrap ${currentFilter === f ? 'bg-[#8B7355] text-white' : 'bg-white'}`}>
                  {f === 'all' ? 'Все' : f === 'want' ? 'Хочу' : f === 'reading' ? 'Читаю' : 'Завершил'}
                </button>
              ))}
            </div>
            <div className="space-y-8">
              {books.filter(b => currentFilter === 'all' || b.status === currentFilter).map(book => {
                const progress = book.pages_total > 0 ? Math.round((book.pages_read / book.pages_total) * 100) : 0;
                return (
                  <div key={book.id} className="relative bg-white rounded-3xl border border-[#D4C4B0] shadow-sm overflow-hidden animate-slide-up flex flex-col md:flex-row">
                    <div className="absolute top-0 right-6 w-5 h-10 bg-[#8B7355] rounded-b-lg z-10 shadow-md"></div>
                    <div className="md:w-40 h-56 bg-[#E5E7EB] shrink-0">
                      {book.coverUrl ? <img src={book.coverUrl} className="w-full h-full object-cover" alt="book" /> : <div className="flex items-center justify-center h-full text-[#8B7355] text-xs font-bold p-4 text-center">НЕТ ОБЛОЖКИ</div>}
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div><h3 className="text-xl font-bold font-serif leading-tight">{book.title}</h3><p className="text-sm text-[#8B7355] italic">{book.author}</p></div>
                        <span className="text-[10px] px-2 py-1 bg-[#FDF6E3] rounded font-bold uppercase border border-[#D4C4B0]">{book.status}</span>
                      </div>
                      <div className="text-[#D4A574] text-lg mb-4">{'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}</div>
                      {book.pages_total > 0 && (
                        <div className="mb-4">
                          <div className="h-1.5 bg-[#D4C4B0]/30 rounded-full overflow-hidden mb-1"><div className="h-full bg-[#8B7355] transition-all" style={{ width: `${progress}%` }}></div></div>
                          <p className="text-[10px] text-right text-[#8B7355] font-bold">{progress}% прочитано</p>
                        </div>
                      )}
                      <div className="space-y-3">
                        {book.bookQuote && <div className="p-3 bg-[#FDF6E3] rounded-xl border-l-4 border-[#8B7355] italic text-sm text-[#6D5D4E]">"{book.bookQuote}"</div>}
                        {book.note && <p className="text-xs text-[#8B7355] line-clamp-3"><strong>Мои мысли:</strong> {book.note}</p>}
                      </div>
                      <div className="flex gap-4 mt-6 pt-4 border-t border-dashed border-[#D4C4B0]">
                        <button onClick={() => { setEditingBook(book); setBookForm(book); setSelectedRating(book.rating); setIsBookModalOpen(true); }} className="text-xs font-bold hover:text-[#8B7355]">✏️ Изменить</button>
                        <button onClick={() => { setBookToDelete(book); setIsDeleteConfirmOpen(true); }} className="text-xs font-bold text-red-400">🗑️ Удалить</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Просмотр фото */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in" onClick={() => setIsPreviewOpen(false)}>
          <div className="relative max-w-2xl w-full flex flex-col items-center">
            <button className="absolute -top-12 right-0 text-white text-4xl" onClick={() => setIsPreviewOpen(false)}>✕</button>
            <img src={userProfile.avatar || defaultAvatar} className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl" alt="Full size" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}

      {/* Редактирование профиля */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[#FDF6E3] w-full max-w-md p-6 rounded-[32px] border-2 border-[#D4C4B0] shadow-2xl animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 font-serif text-center">Настройки</h2>
            <div className="space-y-4">
              <input value={userProfile.name} onChange={e => setUserProfile({ ...userProfile, name: e.target.value })} className="w-full p-3 rounded-xl border-2 border-[#D4C4B0] outline-none" placeholder="Ваше имя" />
              <textarea value={userProfile.bio} onChange={e => setUserProfile({ ...userProfile, bio: e.target.value })} className="w-full p-3 rounded-xl border-2 border-[#D4C4B0] outline-none h-20 resize-none" placeholder="О себе" />

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    value={userProfile.avatar === defaultAvatar ? '' : userProfile.avatar}
                    onChange={e => setUserProfile({ ...userProfile, avatar: e.target.value })}
                    className="flex-1 p-3 rounded-xl border-2 border-[#D4C4B0] outline-none text-sm"
                    placeholder="URL фото или загрузите ->"
                  />
                  <label className="cursor-pointer bg-[#D4C4B0] p-3 rounded-xl flex items-center hover:bg-[#c4b4a0]">
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'profile')} />
                    📁
                  </label>
                </div>

                {/* ВОТ ОНА - КНОПКА  ТУТ */}
                {userProfile.avatar !== defaultAvatar && (
                  <button
                    onClick={() => setUserProfile({ ...userProfile, avatar: defaultAvatar })}
                    className="w-full py-2.5 bg-red-50 text-red-500 border-2 border-red-100 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                  >
                    🗑️ Удалить текущее фото
                  </button>
                )}
              </div>
            </div>
            <button onClick={() => setIsProfileModalOpen(false)} className="w-full py-3 bg-[#8B7355] text-white rounded-xl font-bold mt-6 hover:bg-[#6D5D4E] transition-all">Сохранить</button>
          </div>
        </div>
      )}

      {/* Модалки книг */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FDF6E3] w-full max-w-md p-6 my-auto rounded-[32px] border-2 border-[#D4C4B0] shadow-2xl space-y-4">
            <h2 className="text-2xl font-bold font-serif">{editingBook ? 'Редактировать' : 'Новая книга'}</h2>
            <input value={bookForm.title} onChange={e => setBookForm({ ...bookForm, title: e.target.value })} className="w-full p-3 rounded-xl border-2 border-[#D4C4B0] outline-none" placeholder="Название" />
            <input value={bookForm.author} onChange={e => setBookForm({ ...bookForm, author: e.target.value })} className="w-full p-3 rounded-xl border-2 border-[#D4C4B0] outline-none" placeholder="Автор" />
            <div className="flex gap-2">
              <input value={bookForm.coverUrl} onChange={e => setBookForm({ ...bookForm, coverUrl: e.target.value })} className="flex-1 p-3 rounded-xl border-2 border-[#D4C4B0] outline-none text-sm" placeholder="URL обложки или загрузите ->" />
              <label className="cursor-pointer bg-[#D4C4B0] p-3 rounded-xl flex items-center"><input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'book')} />🖼️</label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" value={bookForm.pages_total} onChange={e => setBookForm({ ...bookForm, pages_total: e.target.value })} className="p-3 rounded-xl border-2 border-[#D4C4B0] outline-none" placeholder="Всего стр." />
              <input type="number" value={bookForm.pages_read} onChange={e => setBookForm({ ...bookForm, pages_read: e.target.value })} className="p-3 rounded-xl border-2 border-[#D4C4B0] outline-none" placeholder="Прочитано" />
            </div>
            <select value={bookForm.status} onChange={e => setBookForm({ ...bookForm, status: e.target.value })} className="w-full p-3 rounded-xl border-2 border-[#D4C4B0] bg-white outline-none">
              <option value="want">Хочу прочитать</option><option value="reading">Читаю сейчас</option><option value="finished">Прочитано</option>
            </select>
            <textarea value={bookForm.bookQuote} onChange={e => setBookForm({ ...bookForm, bookQuote: e.target.value })} className="w-full p-3 rounded-xl border-2 border-[#D4C4B0] outline-none h-16 resize-none" placeholder="Цитата..." />
            <textarea value={bookForm.note} onChange={e => setBookForm({ ...bookForm, note: e.target.value })} className="w-full p-3 rounded-xl border-2 border-[#D4C4B0] outline-none h-16 resize-none" placeholder="Заметки..." />
            <div className="flex justify-center gap-1">{[1, 2, 3, 4, 5].map(s => <button key={s} onClick={() => setSelectedRating(s)} className="text-3xl" style={{ color: s <= selectedRating ? '#D4A574' : '#D4C4B0' }}>★</button>)}</div>
            <div className="flex gap-3 pt-2"><button onClick={closeBookModal} className="flex-1 py-3 bg-white border-2 border-[#D4C4B0] rounded-xl font-bold">Отмена</button><button onClick={handleSaveBook} className="flex-1 py-3 bg-[#8B7355] text-white rounded-xl font-bold">Сохранить</button></div>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[#FDF6E3] w-full max-w-sm p-8 rounded-[32px] border-2 border-[#D4C4B0] text-center shadow-2xl animate-slide-up">
            <h3 className="text-xl font-bold mb-4">Удалить книгу?</h3>
            <div className="flex gap-3"><button onClick={() => setIsDeleteConfirmOpen(false)} className="flex-1 py-3 bg-white border-2 border-[#D4C4B0] rounded-xl font-bold">Нет</button><button onClick={deleteBook} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold">Удалить</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;