import { useAuth } from '../../auth/AuthProvider';


export default function AdminLayout({
  children,
}) {
  const { signOut } = useAuth();


  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">

        <div className="admin-sidebar__brand">
          БОЙКОВГРУПП
        </div>


        <nav className="admin-sidebar__menu">

          <a href="/admin/">
            Главная
          </a>

          <a href="/admin/articles">
            Статьи
          </a>

          <a href="/admin/leads">
            Заявки
          </a>

          <a href="/admin/statistics">
            Статистика
          </a>

        </nav>


        <button
          className="admin-sidebar__logout"
          onClick={signOut}
        >
          Выйти
        </button>

      </aside>


      <main className="admin-content">
        {children}
      </main>

    </div>
  );
}
