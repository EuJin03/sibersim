import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Text,
  RefreshControl,
} from 'react-native';
import {
  BarChart,
  PieChart,
  LineChart,
  yAxisSides,
} from 'react-native-gifted-charts';
import useUsersStore from '@/hooks/useUsers';
import useMaterialStore from '@/hooks/useMaterial';
import { Stack } from 'expo-router';
import Avatar from '@/components/user/Avatar';
import { Colors } from '@/hooks/useThemeColor';
import useGroupStore from '@/hooks/useGroup';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';

const Dashboard = () => {
  const dbUser = useUsersStore(state => state.dbUser);
  const materials = useMaterialStore(state => state.materials);
  const [isLoading, setIsLoading] = useState(true);
  const [lessonsByTag, setLessonsByTag] = useState<
    { label: string; value: number; color: string }[]
  >([]);
  const [userPoints, setUserPoints] = useState<
    { label: string; value: number; color: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      if (dbUser) {
        const lessonsCompleted: { [key: string]: number } = {};

        // Fetch user progress from Firestore
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

        // Fetch user points from Firestore
        const groupUsers = await useGroupStore
          .getState()
          .fetchGroupUsers(dbUser.group ?? '');
        setUserPoints(
          groupUsers.map((user, index) => ({
            label: user.displayName,
            value: user.points,
            color: colorPalette[index % colorPalette.length],
          }))
        );

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

  // const [refreshing, setRefreshing] = useState<boolean>(false);
  // // it should the page with necessary data in the leaderboard
  // const onRefresh = async () => {
  //   setRefreshing(true);
  //   // await fetchMaterials();
  //   setRefreshing(false);
  // };

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
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View
          style={{
            flex: 1,
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
          }}
        >
          <View style={{ marginBottom: actuatedNormalizeVertical(8) }}>
            <Text style={{ fontWeight: 'bold' }}>Lessons Completed</Text>
            <Text style={{ color: '#909090', fontSize: 9 }}>
              Each lessons is accredited with 10 points*
            </Text>
          </View>
          <BarChart
            barWidth={actuatedNormalize(50)}
            noOfSections={3}
            barBorderRadius={4}
            data={lessonsByTag.map(item => ({
              ...item,
              frontColor: item.color,
            }))}
            yAxisThickness={0}
            xAxisThickness={0.2}
            labelWidth={45}
            adjustToWidth
            xAxisLabelTextStyle={{
              color: 'gray',
              textAlign: 'center',
              fontSize: 10,
            }}
            isAnimated
            xAxisLabelsVerticalShift={4}
            maxValue={Math.max(...lessonsByTag.map(item => item.value))}
          />
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
            padding: 10,
            borderRadius: 13,
            shadowColor: '#909090',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
            elevation: 4,
          }}
        >
          <View style={{ marginBottom: actuatedNormalizeVertical(8) }}>
            <Text style={{ fontWeight: 'bold' }}>Leaderboard</Text>
            <Text style={{ color: '#909090', fontSize: 9 }}>
              Total points for each users earned through lessons.
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
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
              <View key={user.label} style={styles.legendItem}>
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
        </View>

        {/* <View style={styles.leaderboardContainer}>
          <Text>Leaderboard</Text>
          <LineChart
            data={userPoints.map(user => ({
              value: user.value,
              labelComponent: () => (
                <Text style={styles.lineChartLabel} numberOfLines={1}>
                  {user.label}
                </Text>
              ),
            }))}
            isAnimated
            curved
            spacing={70}
            color="#F08A5D"
            thickness={3}
            hideRules
            dataPointsHeight={0}
            dataPointsWidth={0}
            startFillColor="orange"
            endFillColor="#F08A5D"
            startOpacity={0.9}
            endOpacity={0.2}
            yAxisColor="gray"
            yAxisThickness={1}
            rulesColor="gray"
            height={200}
            width={280}
            initialSpacing={30}
            backgroundColor="#f1f1f1"
            areaChart
            noOfSections={5}
            yAxisTextStyle={{ color: 'gray' }}
            yAxisSide={yAxisSides.RIGHT}
          />
        </View> */}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 24,
  },
  chartContainer: {
    marginBottom: 24,
    alignItems: 'center',
    width: 300,
  },
  centerLabel: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  leaderboardContainer: {
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  lineChartLabel: {
    fontSize: 10,
    color: 'gray',
    paddingHorizontal: 16,
  },

  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
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
});

export default Dashboard;
