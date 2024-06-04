import { formatDistanceToNow, parseISO } from 'date-fns';

const useRelativeTime = (dateString: string): string => {
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};
export default useRelativeTime;
