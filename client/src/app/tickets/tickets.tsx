/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from 'react-query';
import TicketService from '../../services/ticket.service';
import UserService from '../../services/user.service';
import { REACT_QUERY_KEY, Ticket, User } from '@acme/shared-models';
import { useMemo, useState } from 'react';
import { ActionGroupWrapper, ButtonCreate, TicketWrapper } from './styled';
import { Button, Table, Tag, notification } from 'antd';
import ModalCreateTicket from './modal-create-ticket';
import ModalAssignTicket from './modal-assign-ticket';

export function Tickets() {
  const [open, setOpen] = useState<boolean>(false);
  const [openAssign, setOpenAssign] = useState<boolean>(false);
  const [ticketSelected, setTicketSelected] = useState<Ticket | undefined>(
    undefined
  );
  const queryClient = useQueryClient();

  const { data: dataTickets, isLoading } = useQuery<Ticket[], Error>(
    REACT_QUERY_KEY.TICKETS,
    () => {
      return TicketService.getTickets();
    }
  );

  const { data: dataUsers, isLoading: isLoadingUsers } = useQuery<
    User[],
    Error
  >(REACT_QUERY_KEY.USERS, () => {
    return UserService.getUsers();
  });

  const tickets = useMemo<Ticket[]>(() => {
    return dataTickets || [];
  }, [dataTickets]);

  const users = useMemo<User[]>(() => {
    return dataUsers || [];
  }, [dataUsers]);

  const unassignFromMutation = useMutation(
    (payload: Ticket) => {
      return TicketService.unassignUserFromTicket(payload.id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(REACT_QUERY_KEY.TICKETS);
        notification.success({ message: 'unassign successfully!' });
        setTicketSelected(undefined);
      },
      onError: (error: any) => {
        notification.error({ message: error?.response?.data?.message });
        setTicketSelected(undefined);
      },
    }
  );

  const markCompleteOrIncomplete = useMutation(
    (payload: Ticket) =>
      payload.completed
        ? TicketService.markTicketInComplete(payload.id)
        : TicketService.markTicketComplete(payload.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(REACT_QUERY_KEY.TICKETS);
        notification.success({ message: 'successfully!' });
        setTicketSelected(undefined);
      },
      onError: (error: any) => {
        notification.error({ message: error?.response?.data?.message });
        setTicketSelected(undefined);
      },
    }
  );

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Assign name',
      dataIndex: 'assigneeId',
      key: 'assigneeId',
      render: (_: any, record: Ticket) => {
        const existUser = users.find((u) => u.id === record.assigneeId);
        return <span>{existUser ? existUser.name : '--'}</span>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'completed',
      key: 'completed',
      render: (_: any, record: Ticket) => {
        return (
          <Tag color={record.completed ? 'green' : 'yellow'} key={record.id}>
            {record.completed ? 'Completed' : 'Incomplete'}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_: any, record: Ticket) => {
        return (
          <ActionGroupWrapper>
            <Button
              type="primary"
              onClick={() => {
                setTicketSelected(record);
                toggleModalAssign();
              }}
            >
              Assign To
            </Button>
            {record.assigneeId && (
              <Button
                type="default"
                onClick={() => {
                  unassignFromMutation.mutate(record);
                  setTicketSelected(record);
                }}
                loading={
                  unassignFromMutation.isLoading &&
                  record.id === ticketSelected?.id
                }
              >
                Unassign
              </Button>
            )}
            <Button
              type="text"
              onClick={() => {
                markCompleteOrIncomplete.mutate(record);
                setTicketSelected(record);
              }}
              loading={
                markCompleteOrIncomplete.isLoading &&
                record.id === ticketSelected?.id
              }
            >
              {record.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </Button>
          </ActionGroupWrapper>
        );
      },
    },
  ];

  const toggleModal = () => setOpen((prev) => !prev);
  const toggleModalAssign = () => setOpenAssign((prev) => !prev);
  const callback = () => setTicketSelected(undefined);

  return (
    <TicketWrapper>
      <ButtonCreate onClick={toggleModal}>Create Ticket</ButtonCreate>
      <Table
        rowKey={(record) => record?.id}
        columns={columns as any}
        dataSource={tickets}
        loading={isLoading || isLoadingUsers}
        pagination={false}
      />
      <ModalCreateTicket isOpen={open} toggleModal={toggleModal} />
      <ModalAssignTicket
        isOpen={openAssign}
        toggleModal={toggleModalAssign}
        users={users}
        ticketSelected={ticketSelected}
        callback={callback}
      />
    </TicketWrapper>
  );
}

export default Tickets;
