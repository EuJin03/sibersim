import { Quiz } from '@/constants/Types';

export const quizzes: Quiz[] = [
  {
    id: '',
    tag: 'Phishing',
    question: 'What is the main goal of a phishing attack?',
    options: [
      'To steal sensitive information',
      'To spread malware',
      'To deface websites',
      'To launch DDoS attacks',
    ],
    correctAnswer: 'To steal sensitive information',
  },
  {
    id: '',
    tag: 'Password Security',
    question:
      'Which of the following is a characteristic of a strong password?',
    options: [
      'Contains personal information',
      'Is at least 12 characters long',
      'Is a common dictionary word',
      'Is the same for all accounts',
    ],
    correctAnswer: 'Is at least 12 characters long',
  },
];
