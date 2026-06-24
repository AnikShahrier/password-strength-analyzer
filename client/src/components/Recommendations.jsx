const Recommendations = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) return null;
  
  const isExcellent = recommendations.length === 1 && 
    recommendations[0].includes('Excellent');
  
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Recommendations
      </h3>
      
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div 
            key={index}
            className={`flex items-start gap-3 p-3 rounded-lg ${
              isExcellent 
                ? 'bg-green-500/10 border border-green-500/30' 
                : 'bg-amber-500/10 border border-amber-500/30'
            }`}
          >
            {isExcellent ? (
              <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <span className={isExcellent ? 'text-green-400' : 'text-amber-400'}>
              {rec}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;