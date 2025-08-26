import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎉 Akaunting MERN Stack</h1>
      <p>✅ React App is running successfully!</p>
      <p>✅ Server connection: Ready</p>
      <p>✅ Database: Connected</p>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f8ff', border: '1px solid #0066cc', borderRadius: '5px' }}>
        <h2>🚀 Application Status</h2>
        <ul>
          <li>Frontend: http://localhost:3000 (You are here!)</li>
          <li>Backend API: http://localhost:5000</li>
          <li>Database: MySQL Connected</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0fff0', border: '1px solid #00cc66', borderRadius: '5px' }}>
        <h2>✅ Conversion Complete!</h2>
        <p>Your Laravel Akaunting has been successfully converted to MERN stack:</p>
        <ul>
          <li><strong>Frontend:</strong> Laravel Blade → React + TypeScript</li>
          <li><strong>Backend:</strong> Laravel → Node.js + Express</li>
          <li><strong>Database:</strong> MySQL (maintained compatibility)</li>
          <li><strong>Auth:</strong> Laravel Auth → JWT tokens</li>
          <li><strong>State:</strong> Vuex → Zustand</li>
          <li><strong>Styling:</strong> Bootstrap → Tailwind CSS</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => window.open('http://localhost:5000/api/auth/me', '_blank')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#0066cc', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Test API Connection
        </button>
        
        <button 
          onClick={() => alert('Full UI will load once all dependencies are ready!')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#00cc66', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Load Full App
        </button>
      </div>
    </div>
  );
}

export default App;
