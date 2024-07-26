# SiberSim

SiberSim is a comprehensive mobile application designed to enhance cybersecurity education and awareness through interactive learning and community engagement. Built with Expo and React Native, SiberSim aims to empower users with the knowledge and skills needed to navigate the digital world securely.

## Features

- User-friendly mobile interface for easy access to cybersecurity content
- Interactive learning modules and simulated phishing exercises
- Dynamic scammer database with community-driven updates
- Personalized feedback and performance tracking
- Community forum for discussion and knowledge sharing
- Integration with official reporting channels for scam attempts

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository:

```bash
   git clone https://github.com/yourusername/sibersim.git
   cd sibersim
```

2. Install dependencies:

```bash
   npm install
```

3. Start the Expo development server:

```bash
   expo start
```

4. Use the Expo Go app on your mobile device to scan the QR code and run the app, or use an iOS or Android simulator.

## Project Structure

```bash
.
└── sibersim/
    ├── app/
    │   ├── (auth)/
    │   │   ├── login.tsx
    │   │   └── setup.tsx
    │   ├── (tabs)/
    │   │   ├── _layout.tsx
    │   │   ├── blog.tsx
    │   │   ├── index.tsx
    │   │   ├── settings.tsx
    │   │   ├── simulation.tsx
    │   │   └── single_post.tsx
    │   ├── blog-details/
    │   │   └── [slug].tsx
    │   ├── check-phish/
    │   │   └── index.tsx
    │   ├── course/
    │   │   └── [id].tsx
    │   ├── course-chapter/
    │   │   └── [id].tsx
    │   ├── edit-profile/
    │   │   └── index.tsx
    │   ├── leaderboard/
    │   │   └── index.tsx
    │   ├── new-post/
    │   │   └── index.tsx
    │   ├── posts/
    │   │   └── [id].tsx
    │   ├── semak-mule/
    │   │   └── index.tsx
    │   ├── user-profile/
    │   │   └── [id].tsx
    │   ├── video-course/
    │   │   └── [id].tsx
    │   ├── _layout.tsx
    │   ├── +html.tsx
    │   └── +not-found.tsx
    ├── assets
    ├── components
    ├── constants
    ├── contexts
    ├── firebase
    ├── hooks
    ├── utils
    ├── .gitignore
    ├── app.json
    ├── babel.config.js
    ├── eas.json
    ├── google-services.json
    ├── package-lock.json
    ├── package.json
    ├── README.md
    └── tsconfig.json
```

## Technologies Used

- Expo
- React Native
- Firebase (Authentication, Firestore)
- TypeScript
- Sanity (Material CMS)

## Contributing

We welcome contributions to SiberSim! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Thanks to all contributors who have helped shape SiberSim
- Special thanks to the cybersecurity community for their invaluable insights

## Contact

For any inquiries or support, please contact [your-email@example.com](mailto:your-email@example.com).

## Disclaimer

SiberSim is an educational tool and should not be considered a substitute for professional cybersecurity advice or services. Always consult with cybersecurity experts for critical security concerns.
