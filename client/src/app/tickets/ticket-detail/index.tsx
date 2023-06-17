import { REACT_QUERY_KEY, Ticket, User } from '@acme/shared-models';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import TicketService from '../../../services/ticket.service';
import UserService from '../../../services/user.service';
import { Spin } from 'antd';
import { DetailWrapper } from './styled';

const TicketDetail: React.FC = () => {
  const { id: ticketId } = useParams();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');

  const { data: dataTicket, isLoading } = useQuery<Ticket, Error>(
    [REACT_QUERY_KEY.TICKET_DETAIL, ticketId],
    () => {
      return TicketService.getTicket(Number(ticketId));
    },
    {
      enabled: !!ticketId,
    }
  );

  const { data: dataUser, isLoading: isLoadingUser } = useQuery<User, Error>(
    [REACT_QUERY_KEY.USER_DETAIL, userId],
    () => {
      return UserService.getUser(Number(userId));
    },
    {
      enabled: !!userId,
    }
  );

  const ticket = useMemo<Ticket | undefined>(() => {
    return dataTicket;
  }, [dataTicket]);

  const user = useMemo<User | undefined>(() => {
    return dataUser;
  }, [dataUser]);

  return (
    <Spin spinning={isLoading || isLoadingUser}>
      <DetailWrapper>
        <div className="content">
          <p>Id: {ticket?.id}</p>
          <p>Description: {ticket?.description}</p>
          <p>Status: {ticket?.completed ? 'Completed' : 'Incomplete'}</p>
          <p>Assignee: {user?.name || '--'}</p>
        </div>
      </DetailWrapper>
    </Spin>
  );
};

export default TicketDetail;
