import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axiosInstance from '../utils/axiosInstance';

interface ExamRecord {
  _id: string;
  title: string;
  description: string;
  date: string;
  duration: number;
}

const ExamRecordScreen = () => {
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

  const renderRecord = ({ item }: { item: ExamRecord }) => (
    <View style={styles.recordCard}>
      <Text style={styles.recordTitle}>{item.title}</Text>
      <View style={styles.cardContent}>
        <Text style={styles.recordText}><Text style={styles.recordLabel}>Description:</Text> {item.description}</Text>
        <Text style={styles.recordText}><Text style={styles.recordLabel}>Date:</Text> {new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.recordText}><Text style={styles.recordLabel}>Duration:</Text> {item.duration} minutes</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Exam Records</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF8C00" />
      ) : records.length > 0 ? (
        <FlatList
          data={records}
          keyExtractor={(item) => item._id}
          renderItem={renderRecord}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noDataText}>No records available</Text>
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
  recordCard: {
    backgroundColor: '#FFEEDC',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#FFD9B3',
  },
  recordTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 10,
  },
  cardContent: {
    borderTopWidth: 1,
    borderColor: '#FFD9B3',
    paddingTop: 10,
  },
  recordText: {
    fontSize: 16,
    color: '#FF8C00',
    marginBottom: 5,
  },
  recordLabel: {
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 18,
    color: '#FF8C00',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ExamRecordScreen;
