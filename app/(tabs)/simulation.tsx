import React from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
} from 'react-native';
import { ActivityIndicator } from 'react-native';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad123bb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fb123a97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-14123e29d72',
    title: 'Third Item',
  },
  {
    id: 'bd7124bea-c1b1-46c2-aed5-3ad123bb28ba',
    title: 'First Item',
  },
  {
    id: '3ac124afc-c605-48d3-a4f8-fb123a97f63',
    title: 'Second Item',
  },
  {
    id: '581254a0f-3da1-471f-bd96-14123e29d72',
    title: 'Third Item',
  },
  {
    id: 'bd722bea-c1b1-46c2-aed5-3ad123bb28ba',
    title: 'First Item',
  },
  {
    id: '3a234c-c605-48d3-a4f8-fb123a97f63',
    title: 'Second Item',
  },
  {
    id: '5869123f-3da1-471f-bd96-14123e29d72',
    title: 'Third Item',
  },
];

type ItemProps = { title: string };

const Item = ({ title }: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const App = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={item => item.id}
        refreshing={isLoading}
        onRefresh={() => {
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        }}
        ListFooterComponent={() => !isLoading && <ActivityIndicator />}
        onEndReached={() => console.log('end')}
        onEndReachedThreshold={5}
        initialNumToRender={3}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default App;
