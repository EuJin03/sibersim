import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  StyleSheet,
} from 'react-native';

const BackgroundAnimation = () => {
  const gradientPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(gradientPosition, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, [gradientPosition]);

  const animatedStyle = {
    transform: [
      {
        translateY: gradientPosition.interpolate({
          inputRange: [0, 1],
          outputRange: [-281, 0],
        }),
      },
    ],
  };

  return (
    <ImageBackground
      source={require('@/assets/images/orange.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height - 180,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});

export default BackgroundAnimation;
