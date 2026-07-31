import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  Group,
  Stack,
  Title,
  Text,
  Badge,
  Button,
  Center,
  Paper,
  Notification,
  Skeleton,
} from '@mantine/core';
import {
  TicketIcon,
  CheckCircleIcon,
  XCircleIcon,
  BarcodeIcon,
  ArrowLeftIcon,
  UserCircleIcon,
} from '@phosphor-icons/react';
import { fixturesData } from '../../../data/fixturesData';
import { useTicketsStore } from '../../../store/useTicketsStore';
import { useAuthStore } from '../../../store/useAuthStore';
import classes from './Tickets.module.css';

export function MyTickets() {
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useAuthStore();
  const { myTickets, fetchMyTickets, cancelTicket, isLoadingMyTickets } = useTicketsStore();
  const [notification, setNotification] = useState<{ title: string; message: string; color: string } | null>(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchMyTickets(token);
    }
  }, [isAuthenticated, token, fetchMyTickets]);

  const handleCancelTicket = async (ticketId: string) => {
    if (!token) return;
    const success = await cancelTicket(ticketId, token);
    if (success) {
      setNotification({
        title: 'Booking Cancelled',
        message: 'Your ticket has been cancelled and refund processed.',
        color: 'orange',
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={classes.ticketsPage}>
        <section className={classes.heroSection}>
          <Stack align="center" gap="xs" className={classes.heroContent}>
            <Text size="xs" fw={700} tt="uppercase" lts="3px" c="var(--hcc-accent)">
              Member Access Required
            </Text>
            <Title order={1} className={classes.heroTitle}>
              My Digital Passes
            </Title>
            <Text size="md" c="var(--hcc-gray-400)" ta="center" maw={500}>
              Sign in to your Harlequins FC account to view your purchased match tickets and gate passes.
            </Text>
            <Button
              mt="md"
              color="pink"
              radius="xl"
              size="md"
              leftSection={<UserCircleIcon size={18} />}
              onClick={() => navigate('/login', { state: { from: '/my-tickets' } })}
            >
              Sign In to View Passes
            </Button>
          </Stack>
        </section>
      </div>
    );
  }

  return (
    <div className={classes.ticketsPage}>
      {/* Hero Header */}
      <section className={classes.heroSection}>
        <Stack align="center" gap="xs" className={classes.heroContent}>
          <Text size="xs" fw={700} tt="uppercase" lts="3px" c="var(--hcc-accent)">
            Personal Wallet • Harlequins FC
          </Text>
          <Title order={1} className={classes.heroTitle}>
            My Digital Passes
          </Title>
          <Text size="md" c="var(--hcc-gray-400)" ta="center" maw={580}>
            View and manage your active matchday passes for the 2026/27 campaign. Present your barcode at turnstiles on arrival.
          </Text>
          <Group gap="sm" mt="xs">
            <Button
              variant="subtle"
              color="gray"
              size="xs"
              leftSection={<ArrowLeftIcon size={14} />}
              onClick={() => navigate('/tickets')}
            >
              Book More Tickets
            </Button>
          </Group>
        </Stack>
      </section>

      {/* Notifications */}
      {notification && (
        <Container size={1200} mt="1.5rem">
          <Notification
            title={notification.title}
            color={notification.color}
            icon={notification.color === 'green' ? <CheckCircleIcon size={18} /> : <XCircleIcon size={18} />}
            onClose={() => setNotification(null)}
            radius="md"
          >
            {notification.message}
          </Notification>
        </Container>
      )}

      {/* Content Body */}
      <Container size={1200} py="3rem" px="2rem">
        <Stack gap="1.5rem">
          <Group justify="space-between" align="center">
            <Stack gap={2}>
              <Title order={2} size="h3" c="white" tt="uppercase" lts="1px">
                Active Passes ({myTickets.length})
              </Title>
              <Text size="sm" c="var(--hcc-gray-400)">
                Signed in as <Text component="span" fw={700} c="white">{user?.username}</Text>
              </Text>
            </Stack>
            <Button
              variant="outline"
              color="pink"
              radius="xl"
              size="xs"
              leftSection={<TicketIcon size={14} />}
              onClick={() => navigate('/tickets')}
            >
              Browse Fixtures
            </Button>
          </Group>

          {isLoadingMyTickets ? (
            <Stack gap="1.2rem">
              <Skeleton height={140} radius="lg" />
              <Skeleton height={140} radius="lg" />
            </Stack>
          ) : myTickets.length > 0 ? (
            <Stack gap="1.2rem">
              {myTickets.map((ticket) => {
                const fixture = fixturesData.find((f) => f.id === ticket.fixtureId);
                const isCancelled = ticket.status === 'CANCELLED';

                return (
                  <Card
                    key={ticket.ticketId}
                    className={`${classes.passCard} ${isCancelled ? classes.passCardCancelled : ''}`}
                    padding="1.8rem 2rem"
                    radius="lg"
                  >
                    <Group justify="space-between" align="center" wrap="wrap" gap="1.5rem">
                      {/* Left Details */}
                      <Stack gap="xs">
                        <Group gap="xs">
                          <Badge color={isCancelled ? 'gray' : 'green'} variant="filled" size="sm">
                            {ticket.status}
                          </Badge>
                          <Text size="xs" fw={700} c="var(--hcc-accent)" tt="uppercase" lts="1px">
                            {ticket.categoryName}
                          </Text>
                        </Group>

                        <Title order={3} size="h4" c="white">
                          {fixture?.homeTeam.name || 'Harlequins FC'} vs {fixture?.awayTeam.name || 'Opponent'}
                        </Title>

                        <Text size="xs" c="var(--hcc-gray-300)">
                          📅 {fixture?.date || 'Matchday'} • {fixture?.time || '15:00'} GMT | 📍 {fixture?.venue || 'Craneford Way Stadium'}
                        </Text>

                        <Group gap="lg" mt="4px">
                          <Stack gap={0}>
                            <Text size="xs" c="var(--hcc-gray-400)">Section</Text>
                            <Text size="sm" fw={700} c="white">{ticket.seatSection}</Text>
                          </Stack>

                          <Stack gap={0}>
                            <Text size="xs" c="var(--hcc-gray-400)">Row & Seats</Text>
                            <Text size="sm" fw={700} c="white">{ticket.seatRow}, {ticket.seatNumbers}</Text>
                          </Stack>

                          <Stack gap={0}>
                            <Text size="xs" c="var(--hcc-gray-400)">Total Paid</Text>
                            <Text size="sm" fw={700} c="var(--hcc-accent)">£{ticket.totalPrice}</Text>
                          </Stack>
                        </Group>
                      </Stack>

                      {/* Right Pass & Barcode */}
                      <Stack align="flex-end" gap="sm">
                        <Paper radius="md" className={classes.passBarcode}>
                          <Group gap={4}>
                            <BarcodeIcon size={20} style={{ color: '#0f0f1a' }} />
                            <Text size="xs" fw={800} c="#0f0f1a">HARLEQUINS FC GATE PASS</Text>
                          </Group>
                          <div className={classes.barcodeLines}>|||||| | |||| ||| ||</div>
                          <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>{ticket.qrCode}</Text>
                        </Paper>

                        {!isCancelled ? (
                          <Button
                            variant="subtle"
                            color="red"
                            size="xs"
                            onClick={() => handleCancelTicket(ticket.ticketId)}
                          >
                            Cancel Booking & Refund
                          </Button>
                        ) : (
                          <Text size="xs" c="var(--hcc-gray-500)">
                            Refunded to original payment method
                          </Text>
                        )}
                      </Stack>
                    </Group>
                  </Card>
                );
              })}
            </Stack>
          ) : (
            <Paper p="4rem" radius="lg" style={{ background: 'var(--hcc-surface)', textAlign: 'center' }}>
              <Center mb="md">
                <TicketIcon size={48} style={{ color: 'var(--hcc-accent)', opacity: 0.6 }} />
              </Center>
              <Title order={3} c="white" mb="xs">
                No Active Tickets Found
              </Title>
              <Text c="var(--hcc-gray-400)" mb="lg">
                You haven't booked any match tickets yet for the upcoming 2026/27 season.
              </Text>
              <Button color="pink" radius="xl" onClick={() => navigate('/tickets')}>
                Browse Upcoming Fixtures
              </Button>
            </Paper>
          )}
        </Stack>
      </Container>
    </div>
  );
}

export default MyTickets;
