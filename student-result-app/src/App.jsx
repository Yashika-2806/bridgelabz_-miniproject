import React, { useState, useEffect } from 'react';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import StudentDetails from './components/StudentDetails';
import Toast from './components/Toast';
import { getAllStudents, createStudent, updateStudent, deleteStudent } from './services/studentService';
import './App.css';

function App() {
  // State for storing all students
  const [students, setStudents] = useState([]);
  
  // State for tracking which view to show: 'list', 'form', 'details'
  const [currentView, setCurrentView] = useState('list');
  
  // State for tracking if we're adding or editing
  const [isEditing, setIsEditing] = useState(false);
  
  // State for the student being edited or viewed
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Initialize localStorage with sample data on first visit
  useEffect(() => {
    const existingData = localStorage.getItem('students');
    if (!existingData) {
      const sampleData = [
        { id: 1, rollNo: "101", name: "John Doe", section: "A", marks: 85, grade: "A" },
        { id: 2, rollNo: "102", name: "Jane Smith", section: "B", marks: 92, grade: "A+" },
        { id: 3, rollNo: "103", name: "Mike Johnson", section: "A", marks: 78, grade: "B" }
      ];
      localStorage.setItem('students', JSON.stringify(sampleData));
    }
  }, []);

  // Add toast notification
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  // Remove toast
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Load all students from JSON Server
  const handleLoadStudents = async () => {
    setLoading(true);
    try {
      const data = await getAllStudents();
      setStudents(data);
      addToast(`Successfully loaded ${data.length} students!`, 'success');
    } catch (error) {
      console.error('Error loading students:', error);
      addToast('Loading from local storage (JSON Server not available)', 'info');
    } finally {
      setLoading(false);
    }
  };

  // Switch to Add Student form
  const handleAddStudent = () => {
    setIsEditing(false);
    setSelectedStudent(null);
    setCurrentView('form');
  };

  // Switch to Edit Student form
  const handleEditStudent = (student) => {
    setIsEditing(true);
    setSelectedStudent(student);
    setCurrentView('form');
  };

  // View Student Details
  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setCurrentView('details');
  };

  // Handle form submission (both add and edit)
  const handleFormSubmit = async (studentData) => {
    setLoading(true);
    try {
      if (isEditing) {
        // Update existing student
        await updateStudent(selectedStudent.id, studentData);
        addToast(`${studentData.name} updated successfully!`, 'success');
        
        // Update local state
        setStudents(prevStudents => 
          prevStudents.map(s => s.id === selectedStudent.id ? { ...studentData, id: selectedStudent.id } : s)
        );
      } else {
        // Create new student
        const newStudent = await createStudent(studentData);
        addToast(`${studentData.name} added successfully!`, 'success');
        
        // Add to local state
        setStudents(prevStudents => [...prevStudents, newStudent]);
      }
      
      // Go back to list view
      setCurrentView('list');
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error saving student:', error);
      addToast('Error saving student. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete a student
  const handleDeleteStudent = async (id) => {
    const student = students.find(s => s.id === id);
    
    if (window.confirm(`Are you sure you want to delete ${student?.name || 'this student'}?`)) {
      setLoading(true);
      try {
        await deleteStudent(id);
        addToast(`${student?.name || 'Student'} deleted successfully!`, 'success');
        
        // Remove from local state
        setStudents(prevStudents => prevStudents.filter(s => s.id !== id));
      } catch (error) {
        console.error('Error deleting student:', error);
        addToast('Error deleting student. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  // Cancel form and go back to list
  const handleCancel = () => {
    setCurrentView('list');
    setSelectedStudent(null);
  };

  // Back to list from details
  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedStudent(null);
  };

  return (
    <div className="App">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      <div className="container">
        <h1>🎓 Student Result Management System</h1>
        
        {currentView === 'list' && (
          <StudentList
            students={students}
            onLoadStudents={handleLoadStudents}
            onAddStudent={handleAddStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onViewDetails={handleViewDetails}
            loading={loading}
          />
        )}

        {currentView === 'form' && (
          <StudentForm
            studentToEdit={isEditing ? selectedStudent : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        )}

        {currentView === 'details' && selectedStudent && (
          <StudentDetails
            student={selectedStudent}
            onBack={handleBackToList}
          />
        )}
      </div>
    </div>
  );
}

export default App;
