import { Template } from '@/constants/Types';

export const templates: Template[] = [
  {
    id: '',
    title: 'Phishing Email',
    description: 'A simulated phishing email targeting bank customers.',
    image: '@/assets/images/placeholder.jpg',
    tag: 'Phishing',
    template: 'Dear valued customer, ...',
  },
  {
    id: '',
    title: 'Malicious Link',
    description: 'A simulated malicious link claiming to offer free products.',
    image: '@/assets/images/placeholder.jpg',
    tag: 'Malware',
    template: 'https://example.com/free-products?...',
  },
];
