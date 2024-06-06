// import { View, Text, TouchableOpacity, Image } from 'react-native';
// import React from 'react';
// import { router } from 'expo-router';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function Login() {
//   return (
//     <SafeAreaView className="flex-1" style={{ backgroundColor: '#fff' }}>
//       <View className="flex-1 flex justify-around my-4">
//         <Text className="text-white font-bold text-4xl text-center">
//           Let's Get Started!
//         </Text>
//         <View className="flex-row justify-center">
//           <Image
//             source={require('@/assets/images/10221134.jpg')}
//             style={{ width: 350, height: 350 }}
//           />
//         </View>
//         <View className="space-y-4">
//           <TouchableOpacity
//             onPress={() => router.replace('./Login')}
//             className="py-3 bg-yellow-400 mx-7 rounded-xl"
//           >
//             <Text className="text-xl font-bold text-center text-gray-700">
//               Sign Up
//             </Text>
//           </TouchableOpacity>
//           <View className="flex-row justify-center">
//             <Text className="text-white font-semibold">
//               Already have an account?
//             </Text>
//             <TouchableOpacity onPress={() => router.replace('./Login')}>
//               <Text className="font-semibold text-yellow-400"> Log In</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// import React from 'react';
// import {
//   SafeAreaView,
//   View,
//   FlatList,
//   StyleSheet,
//   Text,
//   StatusBar,
// } from 'react-native';
// import { ActivityIndicator } from 'react-native';

// const DATA = [
//   {
//     id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
//     title: 'First Item',
//   },
//   {
//     id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
//     title: 'Second Item',
//   },
//   {
//     id: '58694a0f-3da1-471f-bd96-145571e29d72',
//     title: 'Third Item',
//   },
//   {
//     id: 'bd7acbea-c1b1-46c2-aed5-3ad123bb28ba',
//     title: 'First Item',
//   },
//   {
//     id: '3ac68afc-c605-48d3-a4f8-fb123a97f63',
//     title: 'Second Item',
//   },
//   {
//     id: '58694a0f-3da1-471f-bd96-14123e29d72',
//     title: 'Third Item',
//   },
//   {
//     id: 'bd7124bea-c1b1-46c2-aed5-3ad123bb28ba',
//     title: 'First Item',
//   },
//   {
//     id: '3ac124afc-c605-48d3-a4f8-fb123a97f63',
//     title: 'Second Item',
//   },
//   {
//     id: '581254a0f-3da1-471f-bd96-14123e29d72',
//     title: 'Third Item',
//   },
//   {
//     id: 'bd722bea-c1b1-46c2-aed5-3ad123bb28ba',
//     title: 'First Item',
//   },
//   {
//     id: '3a234c-c605-48d3-a4f8-fb123a97f63',
//     title: 'Second Item',
//   },
//   {
//     id: '5869123f-3da1-471f-bd96-14123e29d72',
//     title: 'Third Item',
//   },
// ];

// type ItemProps = { title: string };

// const Item = ({ title }: ItemProps) => (
//   <View style={styles.item}>
//     <Text style={styles.title}>{title}</Text>
//   </View>
// );

// const App = () => {
//   const [isLoading, setIsLoading] = React.useState(false);
//   return (
//     <SafeAreaView style={styles.container}>
//       <FlatList
//         data={DATA}
//         renderItem={({ item }) => <Item title={item.title} />}
//         keyExtractor={item => item.id}
//         refreshing={isLoading}
//         onRefresh={() => {
//           setIsLoading(true);
//           setTimeout(() => {
//             setIsLoading(false);
//           }, 1000);
//         }}
//         ListFooterComponent={() => !isLoading && <ActivityIndicator />}
//         onEndReached={() => console.log('end')}
//         onEndReachedThreshold={5}
//         initialNumToRender={3}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: StatusBar.currentHeight || 0,
//   },
//   item: {
//     backgroundColor: '#f9c2ff',
//     padding: 20,
//     marginVertical: 8,
//     marginHorizontal: 16,
//   },
//   title: {
//     fontSize: 32,
//   },
// });

// export default App;
