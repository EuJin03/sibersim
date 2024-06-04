import React from 'react';
import { ProgressBar } from 'react-native-paper';

export default function LearningProgressBar({
  progress,
}: {
  progress: number;
}) {
  return <ProgressBar progress={progress} />;
}
