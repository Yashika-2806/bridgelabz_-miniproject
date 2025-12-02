import React, { useState } from 'react';

const StudentForm = ({ studentToEdit, onSubmit, onCancel, loading }) => {
  // Initialize form state with existing student data or empty values
  const [rollNo, setRollNo] = useState(studentToEdit ? studentToEdit.rollNo : '');
  const [name, setName] = useState(studentToEdit ? studentToEdit.name : '');
  const [section, setSection] = useState(studentToEdit ? studentToEdit.section : '');
  const [marks, setMarks] = useState(studentToEdit ? studentToEdit.marks : '');
  const [grade, setGrade] = useState(studentToEdit ? studentToEdit.grade : '');

  // Validation errors
  const [errors, setErrors] = useState({});

  // Auto-calculate grade based on marks
  const calculateGrade = (marksValue) => {
    const m = Number(marksValue);
    if (m >= 90) return 'A+';
    if (m >= 80) return 'A';
    if (m >= 70) return 'B+';
    if (m >= 60) return 'B';
    if (m >= 50) return 'C';
    if (m >= 40) return 'D';
    return 'F';
  };

  const handleMarksChange = (e) => {
    const marksValue = e.target.value;
    setMarks(marksValue);
    if (marksValue && !isNaN(marksValue)) {
      setGrade(calculateGrade(marksValue));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!rollNo.trim()) {
      newErrors.rollNo = 'Roll Number is required';
    } else if (!/^[0-9]+$/.test(rollNo.trim())) {
      newErrors.rollNo = 'Roll Number must contain only numbers';
    }

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      newErrors.name = 'Name can only contain letters and spaces';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!section.trim()) {
      newErrors.section = 'Section is required';
    }

    if (!marks) {
      newErrors.marks = 'Marks are required';
    } else if (isNaN(marks) || Number(marks) < 0 || Number(marks) > 100) {
      newErrors.marks = 'Marks must be between 0 and 100';
    }

    if (!grade.trim()) {
      newErrors.grade = 'Grade is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Create student object
    const studentData = {
      rollNo: rollNo.trim(),
      name: name.trim(),
      section: section.trim().toUpperCase(),
      marks: Number(marks),
      grade: grade.trim().toUpperCase()
    };

    // If editing, include the ID
    if (studentToEdit) {
      studentData.id = studentToEdit.id;
    }

    // Call the onSubmit callback
    onSubmit(studentData);
  };

  return (
    <div className="student-form">
      <h2>{studentToEdit ? '✏️ Edit Student' : '➕ Add New Student'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className={`form-group ${errors.rollNo ? 'error' : ''}`}>
          <label htmlFor="rollNo">Roll Number: *</label>
          <input
            type="text"
            id="rollNo"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            placeholder="Enter roll number (numbers only)"
            className={errors.rollNo ? 'error' : ''}
          />
          {errors.rollNo && <span className="error-message">{errors.rollNo}</span>}
        </div>

        <div className={`form-group ${errors.name ? 'error' : ''}`}>
          <label htmlFor="name">Student Name: *</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only letters and spaces
              if (/^[a-zA-Z\s]*$/.test(value) || value === '') {
                setName(value);
              }
            }}
            placeholder="Enter student's full name (letters only)"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className={`form-group ${errors.section ? 'error' : ''}`}>
          <label htmlFor="section">Section: *</label>
          <input
            type="text"
            id="section"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            placeholder="e.g., A, B, C"
            maxLength="2"
            className={errors.section ? 'error' : ''}
          />
          {errors.section && <span className="error-message">{errors.section}</span>}
        </div>

        <div className={`form-group ${errors.marks ? 'error' : ''}`}>
          <label htmlFor="marks">Marks (0-100): *</label>
          <input
            type="number"
            id="marks"
            value={marks}
            onChange={handleMarksChange}
            min="0"
            max="100"
            placeholder="Enter marks out of 100"
            className={errors.marks ? 'error' : ''}
          />
          {errors.marks && <span className="error-message">{errors.marks}</span>}
        </div>

        <div className={`form-group ${errors.grade ? 'error' : ''}`}>
          <label htmlFor="grade">Grade: *</label>
          <input
            type="text"
            id="grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="Auto-calculated or enter manually"
            maxLength="3"
            className={errors.grade ? 'error' : ''}
          />
          {errors.grade && <span className="error-message">{errors.grade}</span>}
          <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
            💡 Grade is auto-calculated based on marks
          </small>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? (
              <span>Saving<span className="loading-inline"></span></span>
            ) : (
              studentToEdit ? '💾 Update Student' : '➕ Add Student'
            )}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={loading}>
            ❌ Cancel
          </button>
        </div>
      </form>

      <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', fontSize: '13px' }}>
        <strong>📊 Grading Scale:</strong>
        <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
          <li>A+ : 90-100 marks</li>
          <li>A  : 80-89 marks</li>
          <li>B+ : 70-79 marks</li>
          <li>B  : 60-69 marks</li>
          <li>C  : 50-59 marks</li>
          <li>D  : 40-49 marks</li>
          <li>F  : Below 40 marks</li>
        </ul>
      </div>
    </div>
  );
};

export default StudentForm;
