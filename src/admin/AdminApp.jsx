import { lazy, Suspense } from 'react';

import LoginPage from './pages/LoginPage.jsx';
import AdminLayout from './components/Layout/AdminLayout.jsx';

import DashboardPage from './pages/DashboardPage/DashboardPage.jsx';
import ArticlesPage from './pages/ArticlesPage/ArticlesPage.jsx';
import StatisticsPage from './pages/StatisticsPage/StatisticsPage.jsx';
import RegulationsPage from './pages/RegulationsPage/RegulationsPage.jsx';
import LeadsPage from './pages/LeadsPage/LeadsPage.jsx';
import DocumentationPage from './pages/DocumentationPage/DocumentationPage.jsx';

import { useAuth } from './auth/AuthProvider.jsx';

const ArticleEditPage = lazy(() => import('./pages/ArticleEditPage/ArticleEditPage.jsx'));

const CreateArticlePage = lazy(() => import('./pages/ArticleEditPage/CreateArticlePage.jsx'));

const QuestionsPage = lazy(() => import('./pages/QuestionsPage/QuestionsPage.jsx'));
const QuestionEditPage = lazy(() => import('./pages/QuestionEditPage/QuestionEditPage.jsx'));
const QuestionPreviewPage = lazy(
  () => import('./pages/QuestionPreviewPage/QuestionPreviewPage.jsx'),
);
const QuestionSettingsPage = lazy(
  () => import('./pages/QuestionSettingsPage/QuestionSettingsPage.jsx'),
);

function RouterView() {
  const path = window.location.pathname;

  if (path.startsWith('/admin/questions/preview/')) return <QuestionPreviewPage />;
  if (path.startsWith('/admin/questions/settings')) return <QuestionSettingsPage />;
  if (path.startsWith('/admin/questions/new') || path.startsWith('/admin/questions/edit/'))
    return <QuestionEditPage />;
  if (path.startsWith('/admin/questions')) return <QuestionsPage />;

  if (path.startsWith('/admin/articles/new')) {
    return <CreateArticlePage />;
  }

  if (path.startsWith('/admin/articles/edit/')) {
    return <ArticleEditPage />;
  }

  if (path.startsWith('/admin/regulations')) {
    return <RegulationsPage />;
  }

  if (path.startsWith('/admin/articles')) {
    return <ArticlesPage />;
  }

  if (path.startsWith('/admin/leads')) {
    return <LeadsPage />;
  }

  if (path.startsWith('/admin/statistics')) {
    return <StatisticsPage />;
  }

  if (path.startsWith('/admin/documentation')) {
    return <DocumentationPage />;
  }

  return <DashboardPage />;
}

export default function AdminApp() {
  const { user, checking } = useAuth();

  if (checking) {
    return <div>Проверка сессии...</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  if (window.location.pathname.startsWith('/admin/questions/preview/')) {
    return (
      <Suspense fallback={<div>Загрузка предпросмотра…</div>}>
        <QuestionPreviewPage />
      </Suspense>
    );
  }

  return (
    <AdminLayout>
      <Suspense fallback={<div>Загрузка раздела...</div>}>
        <RouterView />
      </Suspense>
    </AdminLayout>
  );
}
