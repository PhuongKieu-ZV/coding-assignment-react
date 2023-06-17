import { Routes, Route } from 'react-router-dom';

import Tickets from './tickets/tickets';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { AppLayoutWrapper } from './styled';
import TicketDetail from './tickets/ticket-detail';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppLayoutWrapper>
        <Routes>
          <Route path="/" element={<Tickets />} />
          <Route path="/ticket/:id" element={<TicketDetail />} />
        </Routes>
      </AppLayoutWrapper>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
