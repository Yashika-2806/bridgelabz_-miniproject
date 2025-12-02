// API Base URL
const API_URL = 'http://localhost:5000/students';

// Check if API is available
const isAPIAvailable = async () => {
  try {
    const response = await fetch(API_URL, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// localStorage fallback functions
const getStorageData = () => {
  const data = localStorage.getItem('students');
  return data ? JSON.parse(data) : [];
};

const saveStorageData = (students) => {
  localStorage.setItem('students', JSON.stringify(students));
};

const getNextId = (students) => {
  return students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
};

// GET - Fetch all students
export const getAllStudents = async () => {
  try {
    const isAvailable = await isAPIAvailable();
    if (isAvailable) {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      saveStorageData(data); // Cache in localStorage
      return data;
    } else {
      // Fallback to localStorage
      return getStorageData();
    }
  } catch (error) {
    console.warn('API error, using localStorage:', error);
    return getStorageData();
  }
};

// GET - Fetch a single student by ID
export const getStudentById = async (id) => {
  try {
    const isAvailable = await isAPIAvailable();
    if (isAvailable) {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch student');
      }
      return await response.json();
    } else {
      const students = getStorageData();
      return students.find(s => s.id === id);
    }
  } catch (error) {
    console.warn('Error fetching student:', error);
    const students = getStorageData();
    return students.find(s => s.id === id);
  }
};

// POST - Create a new student
export const createStudent = async (studentData) => {
  try {
    const isAvailable = await isAPIAvailable();
    if (isAvailable) {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      if (!response.ok) {
        throw new Error('Failed to create student');
      }
      const data = await response.json();
      return data;
    } else {
      // Use localStorage
      const students = getStorageData();
      const newStudent = {
        ...studentData,
        id: getNextId(students)
      };
      students.push(newStudent);
      saveStorageData(students);
      return newStudent;
    }
  } catch (error) {
    console.warn('API error, using localStorage:', error);
    // Fallback to localStorage
    const students = getStorageData();
    const newStudent = {
      ...studentData,
      id: getNextId(students)
    };
    students.push(newStudent);
    saveStorageData(students);
    return newStudent;
  }
};

// PUT - Update an existing student
export const updateStudent = async (id, studentData) => {
  try {
    const isAvailable = await isAPIAvailable();
    if (isAvailable) {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      if (!response.ok) {
        throw new Error('Failed to update student');
      }
      return await response.json();
    } else {
      // Use localStorage
      const students = getStorageData();
      const index = students.findIndex(s => s.id === id);
      if (index !== -1) {
        students[index] = { ...studentData, id };
        saveStorageData(students);
        return students[index];
      }
      throw new Error('Student not found');
    }
  } catch (error) {
    console.warn('API error, using localStorage:', error);
    // Fallback to localStorage
    const students = getStorageData();
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
      students[index] = { ...studentData, id };
      saveStorageData(students);
      return students[index];
    }
    throw error;
  }
};

// DELETE - Delete a student
export const deleteStudent = async (id) => {
  try {
    const isAvailable = await isAPIAvailable();
    if (isAvailable) {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete student');
      }
      return true;
    } else {
      // Use localStorage
      const students = getStorageData();
      const filtered = students.filter(s => s.id !== id);
      saveStorageData(filtered);
      return true;
    }
  } catch (error) {
    console.warn('API error, using localStorage:', error);
    // Fallback to localStorage
    const students = getStorageData();
    const filtered = students.filter(s => s.id !== id);
    saveStorageData(filtered);
    return true;
  }
};
