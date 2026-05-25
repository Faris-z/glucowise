import { useState } from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import './styles/theme.css';

export default function App() {
  const [analysisData, setAnalysisData] = useState(null);

  return analysisData
    ? <Dashboard data={analysisData} onReset={() => setAnalysisData(null)} />
    : <Home onAnalysis={setAnalysisData} />;
}
