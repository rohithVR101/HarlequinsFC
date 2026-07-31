import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@mantine/core';
import SportsNavbar from './components/layout/SportsNavbar';
import SportsFooter from './components/layout/SportsFooter';
import Home from './components/pages/home/Home';
import Squad from './components/pages/squad/Squad';
import Fixtures from './components/pages/fixtures/Fixtures';
import History from './components/pages/history/History';
import Stadium from './components/pages/stadium/Stadium';
import Login from './components/pages/club/login/Login';
import SignUp from './components/pages/club/signup/SignUp';
import Tickets from './components/pages/tickets/Tickets';
import MyTickets from './components/pages/tickets/MyTickets';
import PaymentSuccess from './components/pages/tickets/PaymentSuccess';
import PlaceholderPage from './components/pages/PlaceholderPage';
import './App.css';

function App() {
  return (
    <AppShell>
      <SportsNavbar />

      <AppShell.Main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<PlaceholderPage title="News" />} />
          <Route path="/videos" element={<PlaceholderPage title="Videos" />} />
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/stadium" element={<Stadium />} />
          <Route path="/squad" element={<Squad />} />
          <Route path="/history" element={<History />} />
          <Route path="/shop" element={<PlaceholderPage title="Shop" />} />
          <Route path="/join-the-club" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/tickets/payment-success" element={<PaymentSuccess />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/profile" element={<PlaceholderPage title="User Profile" />} />
          <Route path="*" element={<PlaceholderPage title="404 - Page Not Found" />} />
        </Routes>
      </AppShell.Main>

      <SportsFooter />
    </AppShell>
  );
}

export default App;
