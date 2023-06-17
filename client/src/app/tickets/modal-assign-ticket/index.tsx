/* eslint-disable @typescript-eslint/no-explicit-any */
import { REACT_QUERY_KEY, Ticket, User } from '@acme/shared-models';
import { Button, Form, Modal, Select, notification } from 'antd';
import React from 'react';
import TicketService from '../../../services/ticket.service';
import { useMutation, useQueryClient } from 'react-query';

interface IModalAssignTicket {
  isOpen: boolean;
  toggleModal: () => void;
  ticketSelected?: Ticket;
  users: User[];
  callback: () => void;
}

const ModalAssignTicket: React.FC<IModalAssignTicket> = (props) => {
  const { isOpen, toggleModal, ticketSelected, users, callback } = props;
  const queryClient = useQueryClient();

  const assignTicketMutation = useMutation(
    (payload: { assigneeId: number }) => {
      return TicketService.assignUserToTicket(
        ticketSelected?.id as number,
        payload.assigneeId
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(REACT_QUERY_KEY.TICKETS);
        notification.success({ message: 'Assign ticket successfully!' });
        callback();
        toggleModal();
      },
      onError: (error: any) => {
        notification.error({ message: error?.response?.data?.message });
      },
    }
  );

  const handleSubmit = (values: { assigneeId: number }) => {
    assignTicketMutation.mutate({ assigneeId: values.assigneeId });
  };

  return (
    <Modal
      title="Assign Ticket"
      open={isOpen}
      onCancel={toggleModal}
      destroyOnClose
      footer
    >
      <Form
        name="basic"
        initialValues={{ assigneeId: undefined }}
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item name="assigneeId" label="User" rules={[{ required: true }]}>
          <Select placeholder="Select user" allowClear>
            {users.map((u) => {
              return (
                <Select.Option value={u.id} key={u.id}>
                  {u.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={assignTicketMutation.isLoading}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAssignTicket;
