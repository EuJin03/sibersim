import axios from 'axios';

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
    url: `localhost:3001?templateId=${params.template}&userId=${params.userId}&groupId=${params.groupId}&uniqueId=${params.uniqueId}`,
  };

  try {
    const response = await axios.post('http://192.168.1.7:3001/send-email', {
      params: sendParams,
    });

    console.log('Email sent successfully');
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}
