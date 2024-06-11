import { formatDistanceToNow, parseISO } from 'date-fns';

const useRelativeTime = (dateString: string | undefined) => {
  if (!dateString) {
    return 'Invalid date';
  }
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};
export default useRelativeTime;
