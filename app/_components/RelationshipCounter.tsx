import React from 'react';

interface RelationshipCounterProps {
  startDate: string;
  startTime: string;
}

const RelationshipCounter: React.FC<RelationshipCounterProps> = ({ startDate, startTime }) => {
  const [timeElapsed, setTimeElapsed] = React.useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  React.useEffect(() => {
    const calculateTime = () => {
      const start = new Date(`${startDate}T${startTime}`);
      const now = new Date();
      const diff = now.getTime() - start.getTime();

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30.44); // Average month length
      const years = Math.floor(months / 12);

      setTimeElapsed({
        years,
        months: months % 12,
        days: days % 30,
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60
      });
    };

    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [startDate, startTime]);

  return (
    <div className=" rounded-xl text-white">
      <h3 className="text-2xl font-bold text-center mb-4">Time Together</h3>
      <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
        {Object.entries(timeElapsed).map(([unit, value]) => (
          <div key={unit} className="text-center">
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-sm capitalize">{unit}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelationshipCounter;