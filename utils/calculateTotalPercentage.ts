import { Material, User } from '@/constants/Types';

export const calculateCompletionPercentage = (
  user: User,
  courseId: string,
  material: Material
) => {
  const progress = user.progress?.[courseId];
  const totalTopics = material.topic?.length || 0;
  const completedTopics = progress?.completedTopics.length || 0;

  if (totalTopics === 0) {
    return 0;
  }

  return Math.round((completedTopics / totalTopics) * 100);
};
