import { useState, useEffect, createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDatabase } from '../APIFuncs/goals';

const GoalDataContext = createContext(null);

export default function DatabaseProvider({ children }){
  const [userInfo, setUserInfo] = useState({ id: null, email: null });

    useEffect(() => {
        chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, function (profileInfo) {
            setUserInfo({ ...userInfo, id: profileInfo.id, email: profileInfo.email });
        });
    }, []);

    const { status: databaseStatus, data: databaseData, error: databaseError, refetch: refetchDatabase,
    } = useQuery({ queryKey: ['goals', userInfo], queryFn: () => fetchDatabase(userInfo.id), 
                    enabled: !!userInfo.id});

    useEffect(() => {
    refetchDatabase();
    }, []);

    useEffect(()=>{
        databaseError && console.error("Database Error:", databaseError)
    }, [databaseError])
                

  return (
    <GoalDataContext.Provider value={{databaseData, goals: databaseData?.goals || undefined, databaseStatus, databaseError}}>
      {children}
    </GoalDataContext.Provider>
  );
};

export const useDatabase = () => useContext(GoalDataContext);
