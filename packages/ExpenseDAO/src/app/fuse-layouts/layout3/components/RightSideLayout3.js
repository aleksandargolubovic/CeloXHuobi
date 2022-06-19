import QuickPanel from 'app/fuse-layouts/shared-components/quickPanel/QuickPanel';
import NotificationPanel from 'app/fuse-layouts/shared-components/notificationPanel/NotificationPanel';
import { memo } from 'react';

function RightSideLayout3() {
  return (
    <>
      <QuickPanel />

      <NotificationPanel />
    </>
  );
}

export default memo(RightSideLayout3);
