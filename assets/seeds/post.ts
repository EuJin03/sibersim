import { Post } from '@/constants/Types';

export const posts: Post[] = [
  {
    id: '',
    title: 'New Phishing Scam Targeting Bank Customers',
    content:
      "Beware of an email claiming to be from a major Malaysian bank and asking for your login credentials. It's a phishing scam! Do not respond or click on any links.",
    image: '@/assets/images/placeholder.jpg',
    upvote: 35,
    postedBy: 'unknown',
    commentsId: ['comment1', 'comment2'],
  },
  {
    id: '',
    title: 'Suspicious Mobile App Targeting Malaysians',
    content:
      'A new mobile app claiming to offer free shopping vouchers is actually spreading malware. Avoid installing any apps from untrusted sources.',
    upvote: 22,
    postedBy: 'unknown',
    commentsId: ['comment3'],
  },
];
