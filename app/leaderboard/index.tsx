import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import useUsersStore from '@/hooks/useUsers';
import useMaterialStore from '@/hooks/useMaterial';
import { Stack } from 'expo-router';
import Avatar from '@/components/user/Avatar';
import useGroupStore from '@/hooks/useGroup';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { Colors } from '@/hooks/useThemeColor';

const Dashboard: React.FC = () => {
  const dbUser = useUsersStore(state => state.dbUser);
  const materials = useMaterialStore(state => state.materials);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lessonsByTag, setLessonsByTag] = useState<
    Array<{ label: string; value: number; color: string }>
  >([]);
  const [userPoints, setUserPoints] = useState<
    Array<{ label: string; value: number; color: string }>
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      if (dbUser) {
        const lessonsCompleted: { [key: string]: number } = {};

        const userProgress = await useUsersStore
          .getState()
          .getUserProgressByUserId(dbUser.id ?? '');
        if (userProgress) {
          userProgress.forEach(progress => {
            const course = materials.find(
              material => material.id === progress.courseId
            );
            if (course) {
              course.tags?.forEach(tag => {
                lessonsCompleted[tag] =
                  (lessonsCompleted[tag] || 0) +
                  progress.completedTopics.length;
              });
            }
          });
        }

        const colorPalette = [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#72e99b',
          '#e4e0b6',
          '#787cd7',
          '#aad97c',
          '#5dadad',
          '#cd418a',
        ];

        setLessonsByTag(
          Object.entries(lessonsCompleted).map(([tag, count], index) => ({
            label: tag,
            value: count,
            color: colorPalette[index % colorPalette.length],
          }))
        );

        if (dbUser.group) {
          const groupUsers = await useGroupStore
            .getState()
            .fetchGroupUsers(dbUser.group);
          setUserPoints(
            groupUsers.map((user, index) => ({
              label: user.displayName,
              value: user.points,
              color: colorPalette[index % colorPalette.length],
            }))
          );
        }

        setIsLoading(false);
      }
    };

    fetchData();
  }, [dbUser, materials]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Dashboard',
          headerRight: () => <Avatar />,
          animation: 'slide_from_right',
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Lessons Completed</Text>
            <Text style={styles.chartSubtitle}>
              Each lesson is accredited with 10 points*
            </Text>
          </View>
          {lessonsByTag.length > 0 ? (
            <>
              <BarChart
                barWidth={actuatedNormalize(50)}
                noOfSections={
                  Math.max(...lessonsByTag.map(item => item.value)) === 1
                    ? 1
                    : Math.max(...lessonsByTag.map(item => item.value)) === 2
                    ? 2
                    : 3
                }
                barBorderRadius={4}
                data={lessonsByTag.map(item => ({
                  ...item,
                  frontColor: item.color,
                }))}
                yAxisThickness={0}
                xAxisThickness={0.2}
                labelWidth={45}
                adjustToWidth
                xAxisLabelTextStyle={styles.xAxisLabelTextStyle}
                isAnimated
                xAxisLabelsVerticalShift={4}
                maxValue={Math.max(...lessonsByTag.map(item => item.value))}
              />
              <View style={styles.totalScoreContainer}>
                <Text style={styles.totalScoreLabel}>Your Total Score:</Text>
                <Text style={styles.totalScoreValue}>
                  {lessonsByTag.reduce(
                    (total, item) => total + item.value * 10,
                    0
                  )}
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.noLessonsText}>
              Complete some lessons to view your status.
            </Text>
          )}
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Leaderboard</Text>
            <Text style={styles.chartSubtitle}>
              Total points for each user earned through lessons.
            </Text>
          </View>
          {dbUser?.group ? (
            <>
              <View style={styles.pieChartContainer}>
                <PieChart
                  data={userPoints}
                  radius={100}
                  showText
                  textColor="#ffffff"
                  showValuesAsLabels
                  showTextBackground
                  textBackgroundRadius={2}
                  textSize={16}
                  textBackgroundColor="transparent"
                  isAnimated
                />
              </View>
              <View style={styles.legendContainer}>
                {userPoints.map((user, index) => (
                  <View
                    key={user.label + Math.random()}
                    style={styles.legendItem}
                  >
                    <View
                      style={[
                        styles.legendColor,
                        { backgroundColor: user.color || 'transparent' },
                      ]}
                    />
                    <Text style={styles.legendLabel}>{user.label}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <>
              <Text style={styles.noLessonsText}>
                Join a group to view the leaderboard.
              </Text>
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 13,
    marginBottom: actuatedNormalizeVertical(15),
    shadowColor: '#909090',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  chartHeader: {
    marginBottom: actuatedNormalizeVertical(8),
  },
  chartTitle: {
    fontWeight: 'bold',
  },
  chartSubtitle: {
    color: '#909090',
    fontSize: 9,
  },
  xAxisLabelTextStyle: {
    color: 'gray',
    textAlign: 'center',
    fontSize: 10,
  },
  noLessonsText: {
    textAlign: 'center',
    marginVertical: actuatedNormalize(50),
    color: 'gray',
  },
  pieChartContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendContainer: {
    marginLeft: 20,
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 12,
    color: 'gray',
  },
  totalScoreContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  totalScoreLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  totalScoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.secondary,
  },
});

export default Dashboard;
