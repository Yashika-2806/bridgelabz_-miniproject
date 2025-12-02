import React, { useState } from 'react';

const StudentList = ({ 
  students, 
  onLoadStudents, 
  onAddStudent, 
  onEditStudent, 
  onDeleteStudent, 
  onViewDetails,
  loading 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSection, setFilterSection] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  // Get unique sections and grades for filters
  const sections = ['all', ...new Set(students.map(s => s.section))];
  const grades = ['all', ...new Set(students.map(s => s.grade))];

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.toString().includes(searchTerm) ||
                         student.id.toString().includes(searchTerm);
    const matchesSection = filterSection === 'all' || student.section === filterSection;
    const matchesGrade = filterGrade === 'all' || student.grade === filterGrade;
    return matchesSearch && matchesSection && matchesGrade;
  });

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (!sortField) return 0;
    
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (sortField === 'marks') {
      aVal = Number(aVal);
      bVal = Number(bVal);
    } else if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Calculate statistics
  const totalStudents = students.length;
  const averageMarks = students.length > 0 
    ? (students.reduce((sum, s) => sum + Number(s.marks), 0) / students.length).toFixed(1)
    : 0;
  const passedStudents = students.filter(s => Number(s.marks) >= 40).length;

  return (
    <div className="student-list">
      <h2>Student Results Dashboard</h2>
      
      <div className="controls-section">
        <div className="button-group">
          <button onClick={onLoadStudents} className="btn btn-primary" disabled={loading}>
            {loading ? <span>Loading<span className="loading-inline"></span></span> : 'Load Students'}
          </button>
          <button onClick={onAddStudent} className="btn btn-success" disabled={loading}>
            ➕ Add Student
          </button>
        </div>

        <div className="search-filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <select 
              value={filterSection} 
              onChange={(e) => setFilterSection(e.target.value)}
            >
              <option value="all">All Sections</option>
              {sections.slice(1).map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>

            <select 
              value={filterGrade} 
              onChange={(e) => setFilterGrade(e.target.value)}
            >
              <option value="all">All Grades</option>
              {grades.slice(1).map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-value">{totalStudents}</div>
            <div className="stat-label">Total Students</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{averageMarks}</div>
            <div className="stat-label">Average Marks</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{passedStudents}</div>
            <div className="stat-label">Passed (≥40)</div>
          </div>
        </div>
      </div>

      {students.length === 0 ? (
        <p className="no-data">📚 No students found. Click "Load Students" to fetch data.</p>
      ) : sortedStudents.length === 0 ? (
        <p className="no-data">🔍 No students match your search criteria.</p>
      ) : (
        <div className="table-wrapper">
          <table className="student-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('rollNo')} className={`sortable ${sortField === 'rollNo' ? 'sorted-' + sortDirection : ''}`}>
                  Roll No
                </th>
                <th onClick={() => handleSort('id')} className={`sortable ${sortField === 'id' ? 'sorted-' + sortDirection : ''}`}>
                  ID
                </th>
                <th onClick={() => handleSort('name')} className={`sortable ${sortField === 'name' ? 'sorted-' + sortDirection : ''}`}>
                  Name
                </th>
                <th onClick={() => handleSort('section')} className={`sortable ${sortField === 'section' ? 'sorted-' + sortDirection : ''}`}>
                  Section
                </th>
                <th onClick={() => handleSort('marks')} className={`sortable ${sortField === 'marks' ? 'sorted-' + sortDirection : ''}`}>
                  Marks
                </th>
                <th onClick={() => handleSort('grade')} className={`sortable ${sortField === 'grade' ? 'sorted-' + sortDirection : ''}`}>
                  Grade
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((student) => (
                <tr key={student.id}>
                  <td><strong>{student.rollNo}</strong></td>
                  <td>#{student.id}</td>
                  <td><strong>{student.name}</strong></td>
                  <td>{student.section}</td>
                  <td><strong>{student.marks}</strong> / 100</td>
                  <td>
                    <span className={`grade-badge-table grade-${student.grade.replace('+', '\\+')}`}>
                      {student.grade}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button 
                      onClick={() => onViewDetails(student)} 
                      className="btn btn-info btn-sm"
                      title="View Details"
                    >
                      👁️ View
                    </button>
                    <button 
                      onClick={() => onEditStudent(student)} 
                      className="btn btn-warning btn-sm"
                      title="Edit Student"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => onDeleteStudent(student.id)} 
                      className="btn btn-danger btn-sm"
                      title="Delete Student"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sortedStudents.length > 0 && (
        <p style={{ textAlign: 'center', marginTop: '15px', color: '#666', fontSize: '14px' }}>
          Showing {sortedStudents.length} of {students.length} students
        </p>
      )}
    </div>
  );
};

export default StudentList;
