import React from 'react';

const StudentDetails = ({ student, onBack }) => {
  const getPerformanceMessage = (marks) => {
    if (marks >= 90) return { text: 'Outstanding Performance! 🌟', color: '#28a745' };
    if (marks >= 80) return { text: 'Excellent Work! 👏', color: '#17a2b8' };
    if (marks >= 70) return { text: 'Good Job! 👍', color: '#ffc107' };
    if (marks >= 60) return { text: 'Satisfactory', color: '#6c757d' };
    if (marks >= 40) return { text: 'Needs Improvement 📚', color: '#fd7e14' };
    return { text: 'Requires Attention ⚠️', color: '#dc3545' };
  };

  const performance = getPerformanceMessage(student.marks);
  const percentage = ((student.marks / 100) * 100).toFixed(1);
  const isPassed = student.marks >= 40;

  return (
    <div className="student-details">
      <h2>📋 Student Details</h2>
      
      <div className="details-card">
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '25px', 
          padding: '20px', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '10px',
          color: 'white'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '2.2rem' }}>{student.name}</h3>
          <p style={{ margin: '5px 0', opacity: 0.9, fontSize: '1.2rem' }}>Roll No: {student.rollNo}</p>
          <p style={{ margin: 0, opacity: 0.9 }}>Student ID: #{student.id}</p>
        </div>

        <div className="detail-row">
          <span className="detail-label">📚 Section:</span>
          <span className="detail-value" style={{ fontSize: '1.3rem', fontWeight: '600' }}>
            {student.section}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">📊 Marks Obtained:</span>
          <span className="detail-value" style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea' }}>
            {student.marks} / 100
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">📈 Percentage:</span>
          <span className="detail-value" style={{ fontSize: '1.3rem', fontWeight: '600' }}>
            {percentage}%
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">🎯 Grade:</span>
          <span className="detail-value">
            <span className="grade-badge" style={{ fontSize: '1.2rem', padding: '8px 20px' }}>
              {student.grade}
            </span>
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">✅ Status:</span>
          <span className="detail-value">
            <span style={{ 
              padding: '6px 16px', 
              borderRadius: '20px', 
              background: isPassed ? '#28a745' : '#dc3545',
              color: 'white',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              {isPassed ? '✓ Passed' : '✗ Failed'}
            </span>
          </span>
        </div>

        <div style={{
          marginTop: '25px',
          padding: '20px',
          background: `${performance.color}15`,
          borderLeft: `4px solid ${performance.color}`,
          borderRadius: '8px'
        }}>
          <strong style={{ color: performance.color, fontSize: '1.1rem' }}>
            {performance.text}
          </strong>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '13px'
        }}>
          <strong>📊 Performance Analysis:</strong>
          <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
            <li>Percentile: Top {100 - percentage}% </li>
            <li>Grade Point: {student.marks >= 90 ? '10' : student.marks >= 80 ? '9' : student.marks >= 70 ? '8' : student.marks >= 60 ? '7' : student.marks >= 50 ? '6' : student.marks >= 40 ? '5' : 'F'}</li>
            <li>Improvement Needed: {100 - student.marks} marks to reach 100%</li>
          </ul>
        </div>
      </div>

      <button onClick={onBack} className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
        ⬅️ Back to List
      </button>
    </div>
  );
};

export default StudentDetails;
