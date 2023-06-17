/* eslint-disable @typescript-eslint/no-explicit-any */
import { render } from '@testing-library/react';
import TicketDetail from './index';
import TicketService from '../../../services/ticket.service';
import UserService from '../../../services/user.service';
import Router from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('Ticket Detail', () => {
  const queryClient = new QueryClient();
  it('should render successfully', () => {
    jest.spyOn(Router, 'useParams').mockReturnValueOnce({ id: '1' });
    jest
      .spyOn(Router, 'useSearchParams')
      .mockReturnValueOnce({ userId: '1' } as any);
    jest.spyOn(TicketService, 'getTicket').mockResolvedValueOnce({
      id: 1,
      description: 'test',
      completed: true,
      assigneeId: 1,
    });
    jest.spyOn(UserService, 'getUser').mockResolvedValueOnce({
      id: 1,
      name: 'Alex',
    });
    const { baseElement } = render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TicketDetail />
        </BrowserRouter>
      </QueryClientProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
