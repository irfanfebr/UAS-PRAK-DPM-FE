import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import axiosInstance from '../utils/axiosInstance';

interface ExamRecord {
  _id: string;
  title: string;
  description: string;
  date: string;
  duration: number;
}

const HomeScreen = () => {
  const [records, setRecords] = useState<ExamRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axiosInstance.get('/exams');
        setRecords(response.data);
      } catch (error: any) {
        console.error('Error fetching exam records:', error.response?.data?.error || 'Server error');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const renderNode = ({ item }: { item: ExamRecord }) => (
    <View style={styles.nodeCard}>
      <Text style={styles.nodeTitle}>{item.title}</Text>
      <Text style={styles.nodeText}><Text style={styles.nodeLabel}>Description:</Text> {item.description}</Text>
      <Text style={styles.nodeText}><Text style={styles.nodeLabel}>Date:</Text> {new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.nodeText}><Text style={styles.nodeLabel}>Duration:</Text> {item.duration} minutes</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Exam Overview</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF8C00" />
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => item._id}
          renderItem={renderNode}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7E6',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF8C00',
    textAlign: 'center',
    paddingTop: 50,
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  nodeCard: {
    backgroundColor: '#FFEEDC',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FFD9B3',
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  nodeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 10,
  },
  nodeText: {
    fontSize: 16,
    color: '#FF8C00',
    marginBottom: 5,
  },
  nodeLabel: {
    fontWeight: 'bold',
  },
});

export default HomeScreen;
