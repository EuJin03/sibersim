import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import Avatar from '@/components/user/Avatar';
import { Text } from 'react-native-paper';
import { Colors } from '@/hooks/useThemeColor';
import LearningProgressBar from '@/components/blog/LearningProgressBar';
import { Material, Topic } from '@/constants/Types';
import useUsersStore from '@/hooks/useUsers';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import useMaterialStore from '@/hooks/useMaterial';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Quiz: React.FC<{
  question: string;
  choices: string[];
  answer: string;
  onCorrectAnswer: (index: number) => void;
  index: number;
}> = ({ question, choices, answer, onCorrectAnswer, index }) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [showRetry, setShowRetry] = useState(false);

  const handleAnswerSelection = (selectedChoice: string) => {
    setSelectedAnswer(selectedChoice);
    setIsAnswerCorrect(selectedChoice === answer);
    setShowRetry(selectedChoice !== answer);

    if (selectedChoice === answer) {
      onCorrectAnswer(index);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswer('');
    setIsAnswerCorrect(false);
    setShowRetry(false);
  };

  return (
    <View style={styles.quizContainer}>
      <Text style={styles.questionText}>{question}</Text>
      <Text
        style={{
          color: '#909090',
          fontSize: 10,
          marginBottom: actuatedNormalizeVertical(10),
        }}
      >
        Answer the quiz to proceed to next lesson!
      </Text>
      {choices.map((choice, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.choiceButton,
            selectedAnswer === choice &&
              !isAnswerCorrect &&
              styles.incorrectChoiceButton,
            selectedAnswer === choice &&
              isAnswerCorrect &&
              styles.correctChoiceButton,
          ]}
          onPress={() => handleAnswerSelection(choice)}
          disabled={selectedAnswer !== ''}
        >
          <Text
            style={[
              styles.choiceText,
              selectedAnswer === choice &&
                !isAnswerCorrect && { color: 'white' },
              selectedAnswer === choice &&
                isAnswerCorrect && { color: 'white' },
            ]}
          >
            {choice}
          </Text>
        </TouchableOpacity>
      ))}
      {showRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={resetQuiz}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function CourseChapter() {
  const colorScheme = 'light';
  const { id, topicId } = useLocalSearchParams();
  let chapterRef = useRef<FlatList | null>(null);
  const router = useRouter();
  const { materials } = useMaterialStore(state => state);

  const course = materials.find(material => material.id === id) as Material;
  const topic = course?.topic?.find(topic => topic.id === topicId) as Topic;
  const lessons = topic?.lesson || [];
  const topicLength = lessons.length;

  const [progress, setProgress] = useState<number>(1 / topicLength);
  const dbUser = useUsersStore(state => state.dbUser);
  const updateUserProgress = useUsersStore(state => state.updateUserProgress);

  const [isUpdating, setIsUpdating] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState<boolean>(false);

  const onClickNext = async (index: number) => {
    if (isUpdating) return;

    setIsUpdating(true);
    setQuizCorrect(false);

    if (dbUser && dbUser.id && id) {
      if (index === topicLength - 1) {
        setProgress(1);

        try {
          router.setParams({ showMessage: 'true' });
          router.back();
          showMessage({
            message: 'Congratulations!',
            description: 'You have completed this topic.',
            type: 'success',
            duration: 3000,
            style: { top: 0 },
            titleStyle: { fontWeight: 'bold' },
            floating: true,
            icon: 'success',
          });
          // @ts-ignore
          await updateUserProgress(dbUser.id, id, topicId);
        } catch (err) {
          console.warn('Error updating user progress:', err);
        }
      } else {
        chapterRef.current?.scrollToIndex({
          animated: true,
          index: index + 1,
        });
        setProgress((index + 2) / topicLength);
      }
    } else {
      console.warn('User or course ID is missing');
    }

    setIsUpdating(false);
  };

  const renderContent = (item: any, index: number) => {
    switch (item.type) {
      case 'text':
        return (
          <Text
            key={index}
            style={{
              fontSize: actuatedNormalize(13),
              lineHeight: 20,
              textAlign: 'justify',
            }}
            selectable={true}
          >
            {item.value}
          </Text>
        );
      case 'subtitle':
        return (
          <Text
            key={index}
            style={{
              fontSize: actuatedNormalize(16),
              fontWeight: 'bold',
              marginTop: actuatedNormalize(10),
            }}
            selectable={true}
          >
            {item.value}
          </Text>
        );
      case 'bullet':
        return (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: actuatedNormalize(8),
              marginTop: actuatedNormalize(5),
            }}
          >
            <MaterialCommunityIcons
              name="checkbox-marked-circle"
              size={15}
              color="black"
              style={{
                marginTop: actuatedNormalize(5),
              }}
            />
            <Text
              style={{
                fontSize: actuatedNormalize(13),
                lineHeight: 20,
                flex: 1,
                textAlign: 'justify',
              }}
              selectable={true}
            >
              {item.value}
            </Text>
          </View>
        );
      case 'image':
        return (
          <Image
            key={index}
            source={{ uri: item.value }}
            style={{
              width: '90%',
              height: actuatedNormalize(180),
              marginVertical: actuatedNormalize(10),
              marginHorizontal: 'auto',
            }}
            resizeMode="cover"
          />
        );
      default:
        return null;
    }
  };

  const renderQuiz = (item: any, index: number) => {
    if (!item.question || !item.choices || !item.answer) {
      return null;
    }

    return (
      <Quiz
        question={item.question}
        choices={item.choices}
        answer={item.answer}
        onCorrectAnswer={quizIndex => {
          setQuizCorrect(!quizCorrect);
        }}
        index={index}
      />
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () => <Avatar />,
          animation: 'slide_from_right',
        }}
      />
      <FlashMessage position={'top'} />
      <FlatList
        data={lessons}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        ref={chapterRef}
        renderItem={({ item, index }) => (
          <View style={styles.container}>
            <LearningProgressBar progress={progress} />
            <ScrollView
              style={{
                flex: 1,
                paddingHorizontal: actuatedNormalize(26),
                paddingTop: actuatedNormalize(16),
              }}
              contentContainerStyle={{
                paddingBottom: actuatedNormalize(30),
              }}
            >
              <Text
                style={{
                  fontSize: actuatedNormalize(24),
                  fontWeight: 'bold',
                  marginBottom: actuatedNormalizeVertical(6),
                }}
              >
                {item.title}
              </Text>

              {item.content.map((contentItem: any, contentIndex: number) =>
                renderContent(contentItem, contentIndex)
              )}
              <View style={styles.quizContainer}>
                {renderQuiz(item, index)}
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={() => onClickNext(index)}
              disabled={isUpdating || !quizCorrect}
              style={[
                styles.button,
                { backgroundColor: Colors[colorScheme].primary },
                (isUpdating || !quizCorrect) && styles.buttonDisabled,
              ]}
            >
              {isUpdating ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>
                  {index === topicLength - 1 ? 'Complete' : 'Next'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('screen').width,
    display: 'flex',
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: actuatedNormalize(24),
    paddingHorizontal: actuatedNormalize(20),
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: actuatedNormalize(10),
    borderRadius: 7,
    marginTop: actuatedNormalizeVertical(18),
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#ffffff',
  },
  quizContainer: {
    marginVertical: actuatedNormalizeVertical(20),
  },
  questionText: {
    fontSize: actuatedNormalize(18),
    fontWeight: 'bold',
  },
  choiceButton: {
    paddingVertical: actuatedNormalizeVertical(10),
    paddingHorizontal: actuatedNormalize(15),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: actuatedNormalizeVertical(10),
  },
  incorrectChoiceButton: {
    backgroundColor: 'red',
  },
  correctChoiceButton: {
    backgroundColor: 'green',
  },
  choiceText: {
    fontSize: actuatedNormalize(16),
  },
  retryButton: {
    backgroundColor: Colors.light.secondary,
    paddingVertical: actuatedNormalizeVertical(10),
    paddingHorizontal: actuatedNormalize(15),
    borderRadius: 5,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: actuatedNormalize(16),
  },
});
