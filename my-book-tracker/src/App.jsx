/*#  главный КОД (аналог index.html)*/
import React, { useState } from 'react';
import './App.css';

function App() {
  // --- СОСТОЯНИЯ ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [activeFilter, setActiveFilter] = useState('all');

  // Данные профиля
  const [user, setUser] = useState({ name: 'Ваше имя', bio: 'Добавьте информацию о себе' });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Список книг
  const [books, setBooks] = useState([]);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // Состояние новой книги
  const [newBook, setNewBook] = useState({ title: '', author: '', status: 'want', totalPages: '', readPages: '', rating: 0 });

  // --- ЛОГИКА ---
  const handleLogin = () => setIsLoggedIn(true);

  const saveProfile = (e) => {
    e.preventDefault();
    setIsProfileModalOpen(false);
  };

  const addBook = () => {
    setBooks([...books, { ...newBook, id: Date.now() }]);
    setIsBookModalOpen(false);
    setNewBook({ title: '', author: '', status: 'want', totalPages: '', readPages: '', rating: 0 });
  };

  // Статистика (считается сама!)
  const stats = {
    total: books.length,
    reading: books.filter(b => b.status === 'reading').length,
    finished: books.filter(b => b.status === 'finished').length
  };

  const filteredBooks = books.filter(b => activeFilter === 'all' || b.status === activeFilter);

  // --- ЭКРАН ЛОГИНА ---
  if (!isLoggedIn) {
    return (
      <div className="app-wrapper flex items-center justify-center min-h-screen">
        <div className="fade-in text-center p-6 max-w-md w-full">
          <div className="mb-8 float-animation">📚</div>
          <h1 className="text-5xl font-bold mb-10 text-[#4A3728]">MoodBook</h1>
          <button onClick={handleLogin} className="w-full py-4 rounded-2xl bg-[#8B7355] text-white font-bold">Войти в библиотеку</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrapper min-h-screen">
      {/* HEADER */}
      <div className="sticky top-0 z-10 p-4 bg-[#FDF6E3]/90 border-b-2 border-[#D4C4B0]">
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#4A3728]">Книжный Трекер</h1>
            <button onClick={() => setIsLoggedIn(false)}>🚪</button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded-xl ${activeTab === 'profile' ? 'bg-[#8B7355] text-white' : 'bg-white/50'}`}>Профиль</button>
            <button onClick={() => setActiveTab('books')} className={`px-4 py-2 rounded-xl ${activeTab === 'books' ? 'bg-[#8B7355] text-white' : 'bg-white/50'}`}>Книги</button>
          </div>
        </div>
      </div>

      <main className="p-4 max-w-5xl mx-auto">
        {activeTab === 'profile' ? (
          <div className="fade-in">
            <div className="bg-white/30 border-2 border-[#D4C4B0] rounded-3xl p-8 text-center">
              <div className="w-24 h-24 bg-[#8B7355] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl">👤</div>
              <h2 className="text-3xl font-bold text-[#4A3728]">{user.name}</h2>
              <p className="text-[#6D5D4E]">{user.bio}</p>
              <button onClick={() => setIsProfileModalOpen(true)} className="mt-6 text-[#8B7355] font-bold">✏️ Редактировать</button>

              <div className="grid grid-cols-3 gap-3 mt-8">
                <div className="bg-white/80 p-4 rounded-2xl border border-[#D4C4B0]">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-xs">Всего</div>
                </div>
                <div className="bg-white/80 p-4 rounded-2xl border border-[#D4C4B0]">
                  <div className="text-2xl font-bold">{stats.reading}</div>
                  <div className="text-xs">Читаю</div>
                </div>
                <div className="bg-white/80 p-4 rounded-2xl border border-[#D4C4B0]">
                  <div className="text-2xl font-bold">{stats.finished}</div>
                  <div className="text-xs">Готово</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="fade-in">
            <button onClick={() => setIsBookModalOpen(true)} className="w-full py-4 bg-[#8B7355] text-white rounded-2xl font-bold mb-6">+ Добавить книгу</button>

            <div className="flex gap-2 mb-6 overflow-x-auto">
              {['all', 'want', 'reading', 'finished'].map(f => (
                <button key={f} onClick={() => setActiveFilter(f)} className={`px-4 py-1 rounded-lg text-sm ${activeFilter === f ? 'bg-[#8B7355] text-white' : 'bg-white'}`}>
                  {f === 'all' ? 'Все' : f === 'want' ? 'Хочу' : f === 'reading' ? 'Читаю' : 'Закончил'}
                </button>
              ))}
            </div>

            {filteredBooks.length === 0 ? (
              <div className="text-center py-20 opacity-50">Библиотека пуста 📚</div>
            ) : (
              <div className="space-y-4">
                {filteredBooks.map(book => (
                  <div key={book.id} className="bg-white p-4 rounded-2xl shadow-sm border border-[#D4C4B0]">
                    <h3 className="font-bold text-lg text-[#4A3728]">{book.title}</h3>
                    <p className="text-sm text-[#8B7355]">{book.author}</p>
                    <div className="mt-2 text-xs bg-[#FDF6E3] inline-block px-2 py-1 rounded-md">
                      {book.status === 'reading' ? '📖 Читаю' : book.status === 'finished' ? '✅ Прочитано' : '⏳ Хочу купить'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL: PROFILE */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#FDF6E3] w-full max-w-md p-6 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Редактировать профиль</h2>
            <input value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} className="w-full p-3 mb-4 rounded-xl border-2 border-[#D4C4B0]" placeholder="Имя" />
            <textarea value={user.bio} onChange={e => setUser({ ...user, bio: e.target.value })} className="w-full p-3 mb-4 rounded-xl border-2 border-[#D4C4B0] h-24" placeholder="О себе" />
            <div className="flex gap-3">
              <button onClick={() => setIsProfileModalOpen(false)} className="flex-1 py-3 bg-gray-200 rounded-xl">Отмена</button>
              <button onClick={() => setIsProfileModalOpen(false)} className="flex-1 py-3 bg-[#8B7355] text-white rounded-xl">Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD BOOK */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#FDF6E3] w-full max-w-md p-6 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Новая книга</h2>
            <div className="space-y-4">
              <input onChange={e => setNewBook({ ...newBook, title: e.target.value })} className="w-full p-3 rounded-xl border-2 border-[#D4C4B0]" placeholder="Название" />
              <input onChange={e => setNewBook({ ...newBook, author: e.target.value })} className="w-full p-3 rounded-xl border-2 border-[#D4C4B0]" placeholder="Автор" />
              <select onChange={e => setNewBook({ ...newBook, status: e.target.value })} className="w-full p-3 rounded-xl border-2 border-[#D4C4B0]">
                <option value="want">Хочу купить</option>
                <option value="reading">Читаю</option>
                <option value="finished">Прочитано</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setIsBookModalOpen(false)} className="flex-1 py-3 bg-gray-200 rounded-xl">Отмена</button>
              <button onClick={addBook} className="flex-1 py-3 bg-[#8B7355] text-white rounded-xl">Добавить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;