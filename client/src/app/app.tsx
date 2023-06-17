import { Routes, Route } from 'react-router-dom';

import Tickets from './tickets/tickets';
import { Button } from 'antd';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { AppLayoutWrapper } from './styled';

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
          <Route
            path="/ticket/:id"
            element={<Button type="primary">Primary Button</Button>}
          />
        </Routes>
      </AppLayoutWrapper>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
