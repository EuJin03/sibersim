import { View, Text, Button } from 'react-native';
import React from 'react';
import axios from 'axios';

export default function handleEmail({
  template,
  params,
}: {
  template: string;
  params: any;
}) {
  const handleSendEmail = async () => {
    const template = 'template_3xj7cw3';
    const params = {
      to_email: 'eugenetin98@gmail.com',
      from_service: 'The Gmail Team',
    };

    try {
      const response = await axios.post(
        'https://sibersim-store.onrender.com:3001/send-email',
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
