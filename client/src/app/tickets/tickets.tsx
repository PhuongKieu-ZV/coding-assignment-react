/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from 'react-query';
import TicketService from '../../services/ticket.service';
import UserService from '../../services/user.service';
import { REACT_QUERY_KEY, Ticket, User } from '@acme/shared-models';
import { useMemo, useState } from 'react';
import { ActionGroupWrapper, ButtonCreate, TicketWrapper } from './styled';
import { Button, Select, Table, Tag, notification } from 'antd';
import ModalCreateTicket from './modal-create-ticket';
import ModalAssignTicket from './modal-assign-ticket';
import { useNavigate } from 'react-router-dom';

const enum Status {
  COMPLETED = 'Completed',
  INCOMPLETE = 'Incomplete',
}

export function Tickets() {
  const [open, setOpen] = useState<boolean>(false);
  const [openAssign, setOpenAssign] = useState<boolean>(false);
  const [ticketSelected, setTicketSelected] = useState<Ticket | undefined>(
    undefined
  );
  const [statusFilter, setStatusFilter] = useState<Status | undefined>(
    undefined
  );

  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
    if (statusFilter) {
      return (dataTickets || []).filter((t) =>
        statusFilter === Status.COMPLETED ? t.completed : !t.completed
      );
    } else {
      return dataTickets || [];
    }
  }, [dataTickets, statusFilter]);

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

  const handleNavigate = (record: Ticket) => {
    if (record.assigneeId) {
      navigate(`/ticket/${record.id}?userId=${record.assigneeId}`);
    } else {
      navigate(`/ticket/${record.id}`);
    }
  };

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
            <Button onClick={() => handleNavigate(record)}>View</Button>
          </ActionGroupWrapper>
        );
      },
    },
  ];

  const toggleModal = () => setOpen((prev) => !prev);
  const toggleModalAssign = () => setOpenAssign((prev) => !prev);
  const callback = () => setTicketSelected(undefined);

  const handleChangeStatus = (value: Status) => {
    setStatusFilter(value);
  };

  return (
    <TicketWrapper>
      <div>
        <ButtonCreate onClick={toggleModal}>Create Ticket</ButtonCreate>
        <Select
          allowClear
          onChange={handleChangeStatus}
          onClear={() => setStatusFilter(undefined)}
          style={{ width: 150, marginLeft: 15 }}
          placeholder="Filter by status"
        >
          <Select.Option value={Status.COMPLETED}>Completed</Select.Option>
          <Select.Option value={Status.INCOMPLETE}>Incomplete</Select.Option>
        </Select>
      </div>
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
