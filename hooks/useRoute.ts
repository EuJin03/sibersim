// import { useRouter } from 'expo-router';

// export const useAuthRouting = () => {
//   const router = useRouter();
//   const { authUser, dbUser } = useAuth();

//   const handleRouting = () => {
//     if (authUser) {
//       if (!dbUser) {
//         router.replace('/login');
//       } else if (dbUser.isNewUser) {
//         router.replace('/setup');
//       } else {
//         router.replace('/(tabs)');
//       }
//     } else {
//       router.replace('/login');
//     }
//   };

//   return handleRouting;
// };
