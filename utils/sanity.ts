import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'mq8vr33o',
  dataset: 'production',
  apiVersion: '2024-03-11',
  // Set to `true` for production environments
  useCdn: false,
  token:
    'skxGi1jemOUWoMquSTli2tvCPLu1WYmnPa7fKQjBJrfApxAXvoJzLKueSMW0g2AWnVC1uqvIWlaEU8sh1DqygIV7MQoa513r3SWP2oUdOswyKDngU40g4afwrmh22hrSCajpbkyismySmyR6cFRt7n5D0UfTspAy8C9B18HYbRodDxM3Mjmp',
});
