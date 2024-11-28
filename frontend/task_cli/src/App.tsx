import React from 'react';
import logo from './logo.svg';
import './App.css';
import TicketRaiser from './componts/Chat';
import DummyPage from './componts/background';

function App() {
  // const appClientId = window._env_.APP_IAM_CLIENT_ID;
  // const apiEndpoint = window._env_.APP_UMS_SERVICE_URL;

  const appClientId = '123'
  // const apiEndpoint = 'http://localhost:3010/api#/default/TicketsController_createFmsTicket'
  const apiEndpoint = 'http://localhost:3010/api/tickets/createFmsTicket';

  return (
    <>
    <>
    <TicketRaiser 
        appClientId={appClientId} 
        apiEndpoint={apiEndpoint} 
      />
    <DummyPage/>
    {/* <Background/> */}
    </>
    </>
  );
}

export default App;
