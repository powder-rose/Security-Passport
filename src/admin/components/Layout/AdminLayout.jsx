import { useAuth } from '../../auth/AuthProvider';
import ArrowIcon from '../ArrowIcon.jsx';

export default function AdminLayout({ children }) {
  const { signOut } = useAuth();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">БОЙКОВГРУПП</div>

        <nav className="admin-sidebar__menu">
          <a href="/admin/">Главная</a>

          <a href="/admin/articles">Статьи</a>
          <a
            href="/admin/publications"
            aria-current={
              window.location.pathname.startsWith('/admin/publications') ? 'page' : undefined
            }
          >
            План публикаций
          </a>

          <a href="/admin/questions">Вопросы и ответы</a>

          <a href="/admin/directions">Каталог постановлений</a>

          <a
            href="/blog/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-sidebar__blog-link"
          >
            Блог на сайте <ArrowIcon />
          </a>

          <a href="/admin/leads">Заявки</a>

          <a href="/admin/statistics">Статистика</a>

          <a href="/admin/documentation">Документация</a>
        </nav>

        <button className="admin-sidebar__logout" onClick={signOut}>
          Выйти
        </button>
      </aside>

      <main className="admin-content">{children}</main>
    </div>
  );
}
