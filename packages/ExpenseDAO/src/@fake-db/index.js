import './db/auth-db';
import './db/faq-db';
import './db/icons-db';
import './db/project-dashboard-db';
import './db/quick-panel-db';
import './db/notification-panel-db';
import history from '@history';
import mock from './mock';

mock.onAny().passThrough();

if (module?.hot?.status() === 'apply') {
  const { pathname } = history.location;
  history.push('/loading');
  history.push({ pathname });
}
