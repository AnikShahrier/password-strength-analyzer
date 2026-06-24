import { useState } from 'react';
import { analyzePassword, getHistory } from '../services/api';
import PasswordInput from '../components/PasswordInput';
import StrengthMeter from '../components/StrengthMeter';
import RulesChecklist from '../components/RulesChecklist';
import Recommendations from '../components/Recommendations';
import PasswordGenerator from '../components/PasswordGenerator';
import LastPasswordTracker from '../components/LastPasswordTracker';
import AnalysisHistory from '../components/AnalysisHistory';

const Home = () => {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastPasswordKey, setLastPasswordKey] = useState(0);

  const handleAnalyze = async (pwd) => {
    setLoading(true);
    setError(null);
    try {
      const response = await analyzePassword(pwd);
      setResult(response.data);
      const historyResponse = await getHistory(5);
      setHistory(historyResponse.data);
      setLastPasswordKey(prev => prev + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUseGeneratedPassword = (generatedPassword) => {
    setPassword(generatedPassword);
    handleAnalyze(generatedPassword);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Section 1: Password Input */}
      <section>
        <PasswordInput 
          password={password}
          setPassword={setPassword}
          onAnalyze={handleAnalyze}
          loading={loading}
        />
      </section>
      
      {/* Section 2: Error Display */}
      {error && (
        <section>
          <div className="card bg-red-500/10 border-red-500/30 border-l-4 border-l-red-500">
            <div className="flex items-center gap-3 text-red-400">
              <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        </section>
      )}
      
      {/* Section 3: Analysis Results */}
      {result && (
        <section className="space-y-6">
          <StrengthMeter 
            score={result.strengthScore}
            label={result.strengthLabel}
            entropy={result.entropy}
            crackTime={result.crackTime.display}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RulesChecklist rules={result.rules} />
            <Recommendations recommendations={result.recommendations} />
          </div>
        </section>
      )}
      
      {/* Section 4: Generator & Tracker */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PasswordGenerator onUsePassword={handleUseGeneratedPassword} />
          <LastPasswordTracker key={lastPasswordKey} />
        </div>
      </section>
      
      {/* Section 5: Recent History */}
      <section>
        <AnalysisHistory history={history} />
      </section>
    </div>
  );
};

export default Home;