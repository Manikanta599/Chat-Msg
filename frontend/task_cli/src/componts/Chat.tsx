import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import '../componts/ticket.css';
import { Button, Tooltip, Select, Input, Form, message, Modal, MessageArgsProps } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { io } from 'socket.io-client';
// Initialize the socket connection to the server
const socket = io('http://localhost:9001');

// Define the interface for the ticket
interface Ticket {
  username: string;
  description: string;
  priority: string;
  screenshot: string | null;
}

const TicketRaiser: React.FC = () => {
  const [username] = useState('admin');
  const [isOpen, setIsOpen] = useState(false);
  const [ticketDetails, setTicketDetails] = useState<Ticket>({
    username: 'admin',
    description: '',
    priority: 'Low',
    screenshot: null,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });


  // Listen for confirmation from the server when the ticket is received
  socket.on('ticket_received', (data) => {
    message.success(data.message);
    console.log('Ticket ID:', data.ticketId); // Log the ticket ID for reference
  });



    return () => {
      // Clean up the socket connection when the component is unmounted
      socket.off('ticket_received');
    };
  }, []);


  // Toggle the ticket box
  const toggleTicketBox = async () => {
    if (!isOpen) {
      setIsOpen(true);

      // Select the ticket-riser element and cast it to HTMLElement
      const ticketRiser = document.querySelector('.ticket-riser') as HTMLElement;
      const tooltipElement = document.querySelector('.ant-tooltip') as HTMLElement;

      if (ticketRiser) {
        ticketRiser.style.display = 'none'; // Now TypeScript knows this is an HTMLElement
        tooltipElement.style.display = 'none';
      }

      // Capture a screenshot of the current screen
      const canvas = await html2canvas(document.body);
      const imgData = canvas.toDataURL('image/png');

      setTicketDetails((prevDetails) => ({
        ...prevDetails,
        screenshot: imgData,
      }));

      // Restore the display of ticket-riser element
      if (ticketRiser) {
        ticketRiser.style.display = 'block';
        tooltipElement.style.display = '';
      }
    } else {
      setIsOpen(false);
      setTicketDetails((prevDetails) => ({
        ...prevDetails,
        screenshot: null, // Reset screenshot when closing the ticket box
      }));
    }
  };


  // Handle form submission
  const handleSubmit = (values: { description: string; priority: string }) => {
    if (values.description.trim()) {
      const updatedTicket = {
        ...ticketDetails,
        description: values.description,
        priority: values.priority,
      };

      // Emit ticket details to the server
      socket.emit('new_ticket', updatedTicket);

      // Display success message using Ant Design's message component
      message.success('Your ticket has been raised successfully!');
      console.log('Ticket Raised:', updatedTicket);

      // Reset fields after successful submission
      setIsOpen(false);
      setTicketDetails({
        username: 'admin',
        description: '',
        priority: 'Low',
        screenshot: null,
      });
    } else {
      // Display error message if description is missing
      message.error('Please provide a description for your ticket.');
    }
  };

  // Options for priority
  const options = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Urgent', label: 'Urgent' },
  ];

  // Show the modal with the screenshot
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle closing the modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className='ticket-riser'>
      {/* Floating button to open/close the ticket box */}
      <Tooltip title="Raise Ticket" >
        <Button
          type="primary"
          shape="circle"
          icon={<MessageOutlined />}
          size="large"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
          }}
          onClick={toggleTicketBox}
        />
      </Tooltip>

      {/* Ticket box */}
      {isOpen && (
        <div className={`ticket-box ${isOpen ? 'open' : ''}`}>
          <div className="ticket-header">
            <span>Raising Ticket as {username}</span>
            <button onClick={toggleTicketBox} className="close-button">
              &#10005;
            </button>
          </div>

          <div className="ticket-content">
            {/* Display captured screenshot */}
            {ticketDetails.screenshot && (
              <div className="screenshot-container">
                <img
                  src={ticketDetails.screenshot}
                  alt="Screenshot"
                  className="screenshot"
                  onClick={showModal} // Open modal when clicked
                  style={{ cursor: 'pointer', maxWidth: '200px' }} // Optional styling
                />
              </div>
            )}

            {/* Form for ticket submission */}
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item label="Priority" name="priority" rules={[{ required: true, message: 'Please select a priority' }]}>
                <Select
                  value={ticketDetails.priority}
                  onChange={(value: string) => setTicketDetails({ ...ticketDetails, priority: value })}
                  options={options}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please describe your issue' }]}>
                <TextArea
                  rows={4}
                  value={ticketDetails.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTicketDetails({ ...ticketDetails, description: e.target.value })}
                  placeholder="Describe your issue..."
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Submit Ticket
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      )}

      {/* Modal to display the screenshot */}
      <Modal
        title="Screenshot"
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        width={800}
        bodyStyle={{ maxHeight: '500px', overflow: 'auto' }}
      >

        <img
          src={ticketDetails.screenshot || ''}
          alt="Screenshot"
          style={{ maxWidth: '100%', maxHeight: '500px' }}
        />
      </Modal>
    </div>
  );
};

export default TicketRaiser;
