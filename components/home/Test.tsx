import * as React from 'react';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

const Test = () => {
  const [text, setText] = React.useState('');

  const onChangeText = (text: React.SetStateAction<string>) => setText(text);

  const hasErrors = () => {
    return !text.includes('@');
  };

  return (
    <View>
      <TextInput
        mode="outlined"
        value={text}
        onChangeText={onChangeText}
        label="Email"
        theme={{ colors: { primary: 'white', background: 'white' } }}
      />
      <HelperText type="error" visible={hasErrors()}>
        Email address is invalid!
      </HelperText>
    </View>
  );
};

export default Test;
