/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, Modal, notification } from 'antd';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import TicketService from '../../../services/ticket.service';
import { REACT_QUERY_KEY } from '@acme/shared-models';

interface IModalCreateTicket {
  isOpen: boolean;
  toggleModal: () => void;
}

const ModalCreateTicket: React.FC<IModalCreateTicket> = (props) => {
  const { isOpen, toggleModal } = props;
  const queryClient = useQueryClient();

  const createMutation = useMutation(
    (payload: { description: string }) => {
      return TicketService.createTicket(payload.description);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(REACT_QUERY_KEY.TICKETS);
        notification.success({ message: 'Create successfully!' });
        toggleModal();
      },
      onError: (error: any) => {
        notification.error({ message: error?.response?.data?.message });
      },
    }
  );

  const handleSubmit = (values: { description: string }) => {
    createMutation.mutate({ description: values.description });
  };
  return (
    <Modal
      title="Create ticket"
      open={isOpen}
      onCancel={toggleModal}
      destroyOnClose
      footer={null}
    >
      <Form
        name="basic"
        initialValues={{ description: '' }}
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: 'Please input your description!' },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={createMutation.isLoading}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateTicket;
