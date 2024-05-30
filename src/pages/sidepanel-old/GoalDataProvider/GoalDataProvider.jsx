import { createContext, useContext } from 'react';

const GoalDataContext = createContext(null);

export const GoalDataProvider = ({ children, goalData }) => {
  // Providing the goalData directly to the context
  return (
    <GoalDataContext.Provider value={goalData}>
      {children}
    </GoalDataContext.Provider>
  );
};

// Custom hook to use the GoalDataContext
export const useGoals = () => useContext(GoalDataContext);
