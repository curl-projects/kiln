import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import DatabaseProvider from './Helpers/Providers/DatabaseProvider.jsx';
import ActiveTabProvider from './Helpers/Providers/ActiveTabProvider.jsx';
import SidePanel from './SidePanel.jsx';


export default function SidePanelManager(){
    const queryClient = new QueryClient();

    return(
        <QueryClientProvider client={queryClient}>
            <ActiveTabProvider>
                <DatabaseProvider>
                    <SidePanel />
                </DatabaseProvider>
            </ActiveTabProvider>
        </QueryClientProvider>
    )
}