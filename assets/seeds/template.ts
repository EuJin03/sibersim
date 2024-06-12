import { Template } from '@/constants/Types';

export const templates: Template[] = [
  {
    id: '7e891d43-2463-4a7a-9e7d-f0e8d5a0d3c4',
    title: 'Phishing Email: Google Drive File Sharing',
    description:
      'A simulated phishing email disguised as a file sharing notification from Google Drive, targeting unsuspecting users.',
    image:
      'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/google-sign-in-template.jpg?alt=media&token=51d7b17e-70a6-4cb9-9cfb-69868e224f6b',
    tag: 'Phishing',
    template: `template_3xj7cw3`,
    type: 'Email',
    service: 'The Gmail Team',
  },
  {
    id: '2b762414-38d7-4c0d-9d55-0c9331ec1f29',
    title: 'Phishing Email: New Sign-in from Chrome OS',
    description:
      'A simulated phishing email disguised as a Google Account sign-in notification, attempting to trick users into revealing their account credentials.',
    image:
      'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/google-sign-in-template.jpg?alt=media&token=51d7b17e-70a6-4cb9-9cfb-69868e224f6b',
    tag: 'Phishing',
    template: `template_ytl3a66`,
    type: 'Email',
    service: 'The Gmail Team',
  },
];
