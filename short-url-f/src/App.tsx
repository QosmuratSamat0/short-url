import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import UrlShortener from './components/UrlShortener';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<UrlShortener />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
