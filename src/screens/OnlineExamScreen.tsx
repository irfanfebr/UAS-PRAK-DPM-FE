// React Native Screen (Manajemen Ujian Online)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axiosInstance from '../utils/axiosInstance';

interface Exam {
  _id: string;
  title: string;
  description: string;
  date: string;
  duration: number;
}

const OnlineExamScreen = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/exams');
      setExams(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to fetch exams.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateExam = async () => {
    if (!title || !description || !date || !duration) {
      Alert.alert('Validation', 'All fields are required.');
      return;
    }

    try {
      if (editMode && editingId) {
        await axiosInstance.put(`/exams/${editingId}`, { title, description, date, duration });
        Alert.alert('Success', 'Exam updated successfully!');
      } else {
        const response = await axiosInstance.post('/exams', { title, description, date, duration });
        Alert.alert('Success', 'Exam added successfully!');
        setExams((prev) => [...prev, response.data]);
      }
      resetForm();
      fetchExams();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to save exam.');
    }
  };

  const handleDeleteExam = async (id: string) => {
    try {
      await axiosInstance.delete(`/exams/${id}`);
      Alert.alert('Success', 'Exam deleted successfully!');
      fetchExams();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to delete exam.');
    }
  };

  const handleEditExam = (exam: Exam) => {
    setTitle(exam.title);
    setDescription(exam.description);
    setDate(exam.date);
    setDuration(exam.duration.toString());
    setEditMode(true);
    setEditingId(exam._id);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setDuration('');
    setEditMode(false);
    setEditingId(null);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const renderExamCard = ({ item }: { item: Exam }) => (
    <View style={styles.examCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleEditExam(item)}>
          <AntDesign name="edit" size={20} color="#FF8C00" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardText}><Text style={styles.cardLabel}>Description:</Text> {item.description}</Text>
        <Text style={styles.cardText}><Text style={styles.cardLabel}>Date:</Text> {new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.cardText}><Text style={styles.cardLabel}>Duration:</Text> {item.duration} minutes</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteExam(item._id)}>
        <AntDesign name="delete" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Online Exam Management</Text>
      <View style={styles.formCard}>
        <Text style={styles.formHeader}>{editMode ? 'Edit Exam' : 'Add New Exam'}</Text>
        <View style={styles.inputContainer}>
          <AntDesign name="book" size={20} color="#FF8C00" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
        </View>
        <View style={styles.inputContainer}>
          <AntDesign name="profile" size={20} color="#FF8C00" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
        </View>
        <View style={styles.inputContainer}>
          <AntDesign name="calendar" size={20} color="#FF8C00" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
          />
        </View>
        <View style={styles.inputContainer}>
          <AntDesign name="clockcircleo" size={20} color="#FF8C00" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Duration (minutes)"
            value={duration}
            keyboardType="number-pad"
            onChangeText={setDuration}
          />
        </View>
        <Pressable style={styles.addButton} onPress={handleAddOrUpdateExam}>
          <Text style={styles.addButtonText}>{editMode ? 'Update Exam' : 'Add Exam'}</Text>
        </Pressable>
      </View>
      <FlatList
        data={exams}
        keyExtractor={(item) => item._id}
        renderItem={renderExamCard}
        refreshing={loading}
        onRefresh={fetchExams}
      />
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF8C00',
    textAlign: 'center',
    paddingTop: 50,
    marginBottom: 20,
  },
  formCard: {
    padding: 25,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#FFD9B3',
    backgroundColor: '#FFEEDC',
  },
  formHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#FFD9B3',
    color: '#FF8C00',
    backgroundColor: '#FFF7E6',
  },
  addButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  examCard: {
    backgroundColor: '#FFEEDC',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#FFD9B3',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  cardContent: {
    marginBottom: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#FFD9B3',
  },
  cardText: {
    fontSize: 15,
    color: '#FF8C00',
    marginBottom: 5,
  },
  cardLabel: {
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF8C00',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
});

export default OnlineExamScreen;
