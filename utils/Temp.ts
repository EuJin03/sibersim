import { View, Text, Button } from 'react-native';
import React from 'react';
import axios from 'axios';

export default function settings() {
  const handleSendEmail = async () => {
    const template = 'template_3xj7cw3';
    const params = {
      to_email: 'kskfkd02@gmail.com',
      from_service: 'The Gmail Team',
    };

    try {
      const response = await axios.post(
        'https://sibersim-store.onrender.com/send-email',
        {
          template,
          params,
        }
      );

      console.log('Email sent successfully');
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View>
      <Button title="Send Email" onPress={handleSendEmail} />
    </View>
  );
}
