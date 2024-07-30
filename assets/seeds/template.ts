import { Template } from '@/constants/Types';

export const templates: Template[] = [
  {
    id: '7e891d43-2463-4a7a-9e7d-f0e8d5a0d3c4',
    title: 'Phishing Email: Google Drive File Sharing',
    description:
      'A simulated phishing email disguised as a file sharing notification from Google Drive, targeting unsuspecting users.',
    image:
      'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/blogs%2Fgdrivephish.png?alt=media&token=54bf4b53-c826-43f3-a33e-8d1c729e8e72',
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
      'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/blogs%2Fnewsignin.png?alt=media&token=50863e23-6e4d-44bd-82d8-8f66447f15fb',
    tag: 'Phishing',
    template: `template_ytl3a66`,
    type: 'Email',
    service: 'The Gmail Team',
  },
  {
    id: 'a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6',
    title: 'Maybank Account Security Alert',
    description:
      'A simulated phishing email disguised as a Maybank security alert, prompting users to verify their account.',
    image:
      'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/blogs%2Fmaybankphish.jpg?alt=media&token=b30c6b79-df81-4de8-97e4-d1ac8bb16dfe',
    tag: 'Phishing',
    template: 'empty',
    type: 'Email',
    service: 'Maybank Security Team',
  },
  {
    id: 'q1w2e3r4-5t6y-7u8i-9o0p-a1s2d3f4g5h6',
    title: 'TnG eWallet Reward Notification',
    description:
      'A simulated phishing email claiming the user has won TnG eWallet credit, enticing them to click a malicious link.',
    image:
      'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/blogs%2Ftngsms.png?alt=media&token=dc8a5d6a-c980-4115-b1bf-8d2d16bdb051',
    tag: 'Smishing',
    template: 'empty',
    type: 'SMS',
    service: 'TnG eWallet Rewards Team',
  },
  {
    id: 'z1x2c3v4-5b6n-7m8q-9w0e-r1t2y3u4i5o6',
    title: 'Shopee Logistics SMS Scam',
    description:
      'A simulated SMS phishing attempt posing as a Shopee delivery notification with a suspicious tracking link.',
    image:
      'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/blogs%2Fshopeesms.png?alt=media&token=23c651ef-b07c-49b3-ba52-bc0a2f3c7377',
    tag: 'Smishing',
    template: 'empty',
    type: 'SMS',
    service: 'Shopee Logistics',
  },
];
