import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MemeFormPage from './pages/MemeFormPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/submit" element={<MemeFormPage />} />
      </Routes>
    </Router>
  );
}

export default App;
