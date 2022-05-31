import _ from '@lodash';
import clsx from 'clsx';

export const requestStatuses = [
  {
    id: 1,
    name: 'Pending',
    color: 'bg-blue text-white',
  },
  {
    id: 2,
    name: 'Approved',
    color: 'bg-green text-white',
  },
  {
    id: 3,
    name: 'Denied',
    color: 'bg-red text-white',
  },
];

function RequestsStatus(props) {
  return (
    <div
      className={clsx(
        'inline text-12 font-semibold py-4 px-12 rounded-full truncate',
        _.find(requestStatuses, { name: props.name }).color
      )}
    >
      {props.name}
    </div>
  );
}

export default RequestsStatus;
