import { useState, useEffect } from 'react';
import { Dimensions, Image } from 'react-native';

export const ScaledImage = ({ uri }: { uri: string }) => {
  const [imageHeight, setImageHeight] = useState(0);

  useEffect(() => {
    const windowWidth = Dimensions.get('window').width;
    Image.getSize(uri, (width, height) => {
      setImageHeight(Math.round((height * windowWidth) / width));
    });
  }, [uri]);

  return (
    <Image
      style={{ width: '100%', height: imageHeight, resizeMode: 'contain' }}
      source={{
        uri: uri,
      }}
    />
  );
};
