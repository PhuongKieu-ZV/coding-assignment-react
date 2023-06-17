import { Ticket } from '@acme/shared-models';
import axiosClient from '../middleware/axiosClient';

export default class TicketService {
  static getTickets(): Promise<Array<Ticket>> {
    return axiosClient.get('/tickets');
  }

  static getTicket(id: number): Promise<Ticket> {
    return axiosClient.get(`/tickets/${id}`);
  }

  static createTicket(description: string): Promise<Ticket> {
    const body = {
      description,
    };
    return axiosClient.post('/tickets', body);
  }

  static assignUserToTicket(ticketId: number, userId: number): Promise<void> {
    return axiosClient.put(`/tickets/${ticketId}/assign/${userId}`);
  }

  static unassignUserFromTicket(ticketId: number): Promise<void> {
    return axiosClient.put(`/tickets/${ticketId}/unassign`);
  }

  static markTicketComplete(ticketId: number): Promise<void> {
    return axiosClient.put(`/tickets/${ticketId}/complete`);
  }

  static markTicketInComplete(ticketId: number): Promise<void> {
    return axiosClient.delete(`/tickets/${ticketId}/complete`);
  }
}
