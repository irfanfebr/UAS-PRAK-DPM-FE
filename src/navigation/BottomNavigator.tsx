import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HomeScreen from '../screens/HomeScreen';
import ExamRecordScreen from '../screens/ExamRecordScreen';
import OnlineExamScreen from '../screens/OnlineExamScreen';
import { Text, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

const CustomTabBarLabel = ({ label, color }: { label: string; color: string }) => (
  <Text style={[styles.tabLabel, { color }]}>{label}</Text>
);

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFF7E6',
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopColor: '#FFD9B3',
          borderTopWidth: 2,
        },
        tabBarActiveTintColor: '#FF8C00',
        tabBarInactiveTintColor: '#FFD9B3',
        tabBarLabel: ({ color }) => {
          const label =
            route.name === 'Home'
              ? 'Home'
              : route.name === 'Exam Records'
              ? 'Exam Records'
              : route.name === 'Online Exams'
              ? 'Online Exams'
              : '';
          return <CustomTabBarLabel label={label} color={color} />;
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Exam Records') {
            iconName = 'bars';
          } else if (route.name === 'Online Exams') {
            iconName = 'book';
          } else {
            iconName = 'question';
          }

          return <AntDesign name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Exam Records" component={ExamRecordScreen} />
      <Tab.Screen name="Online Exams" component={OnlineExamScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: 'bold',
  },
});

export default BottomNavigator;
