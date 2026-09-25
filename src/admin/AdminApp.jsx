import ArticleEditPage 
from './pages/ArticleEditPage/ArticleEditPage.jsx';

import CreateArticlePage from './pages/ArticleEditPage/CreateArticlePage.jsx';

import LoginPage from './pages/LoginPage.jsx';
import AdminLayout from './components/Layout/AdminLayout.jsx';

import DashboardPage from './pages/DashboardPage/DashboardPage.jsx';
import ArticlesPage from './pages/ArticlesPage/ArticlesPage.jsx';
import StatisticsPage from './pages/StatisticsPage/StatisticsPage.jsx';
import LeadsPage from './pages/LeadsPage/LeadsPage.jsx';

import {
  useAuth,
} from './auth/AuthProvider.jsx';




function RouterView() {

  const path =
    window.location.pathname;



  if (
    path.startsWith('/admin/articles/new')
  ) {

    return (
      <CreateArticlePage />
    );

  }



  if (
    path.startsWith('/admin/articles/edit/')
  ) {

    return (
      <ArticleEditPage />
    );

  }



  if (
    path.startsWith('/admin/articles')
  ) {

    return (
      <ArticlesPage />
    );

  }



  if (
    path.startsWith('/admin/leads')
  ) {

    return (
      <LeadsPage />
    );

  }



  if (
    path.startsWith('/admin/statistics')
  ) {

    return (
      <StatisticsPage />
    );

  }



  return (
    <DashboardPage />
  );

}



export default function AdminApp() {

  const {
    user,
    checking,
  } = useAuth();


  if (checking) {
    return (
      <div>
        Проверка сессии...
      </div>
    );
  }


  if (!user) {
    return (
      <LoginPage />
    );
  }


  return (
    <AdminLayout>
      <RouterView />
    </AdminLayout>
  );
}
