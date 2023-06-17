export type User = {
  id: number;
  name: string;
};

export type Ticket = {
  id: number;
  description: string;
  assigneeId: null | number;
  completed: boolean;
};

export const REACT_QUERY_KEY = {
  TICKETS: 'tickets',
  TICKET_DETAIL: 'ticket-detail',
  USERS: 'users',
  USER_DETAIL: 'user-detail',
};
