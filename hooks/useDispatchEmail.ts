import axios from 'axios';
import { generateUUID } from './useUuid';

interface EmailParams {
  to_email: string;
  from_service: string;
  template: string;
  fullname: string;
  email: string;
  userId: string;
  groupId: string;
  uniqueId: string;
}

export default async function handleEmail({ params }: { params: EmailParams }) {
  const sendParams = {
    to_email: params.to_email,
    from_service: params.from_service,
    template: params.template,
    fullname: params.fullname,
    email: params.email,
    userId: params.userId,
    groupId: params.groupId,
    url: `sibersim-store.onrender.com/record-behavior?templateId=${
      params.template
    }&userId=${params.userId}&groupId=${params.groupId}&uniqueId=${generateUUID(
      10
    )}`,
  };

  try {
    const response = await axios.post(
      'https://sibersim-store.onrender.com/send-email',
      {
        params: sendParams,
      }
    );

    console.log('Email sent successfully');
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}
