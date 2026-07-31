import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Stack,
  Title,
  Text,
  Group,
  Badge,
  Button,
  Loader,
  Alert,
  Divider,
  Center,
  ThemeIcon,
} from '@mantine/core';
import {
  CheckCircleIcon,
  TicketIcon,
  ShieldCheckIcon,
  QrCodeIcon,
  ArrowRightIcon,
  InfoIcon,
} from '@phosphor-icons/react';
import { fulfillPaymentSession } from '../../../services/paymentsApi';
import type { PaymentOrderResponse } from '../../../services/paymentsApi';
import classes from './Tickets.module.css';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<PaymentOrderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No payment session ID found in request URL.');
      setLoading(false);
      return;
    }

    fulfillPaymentSession(sessionId)
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fulfill payment session:', err);
        setError('Failed to confirm payment status. If your card was charged, your ticket will appear in your wallet shortly.');
        setLoading(false);
      });
  }, [sessionId]);

  return (
    <div className={classes.ticketsPage}>
      <Container size="sm" py="xl" style={{ paddingTop: '6rem' }}>
        <Paper p="xl" radius="lg" className={classes.passCard}>
          {loading ? (
            <Center py="xl">
              <Stack align="center" gap="md">
                <Loader color="pink" size="lg" type="dots" />
                <Text size="sm" c="white" fw={600}>
                  Confirming your payment & allocating stadium seats...
                </Text>
              </Stack>
            </Center>
          ) : error ? (
            <Stack gap="md">
              <Alert color="red" icon={<InfoIcon size={20} />} title="Payment Verification Pending">
                {error}
              </Alert>
              <Group justify="center">
                <Button color="pink" variant="light" onClick={() => navigate('/my-tickets')}>
                  Go to My Digital Passes
                </Button>
              </Group>
            </Stack>
          ) : order ? (
            <Stack gap="lg">
              <Center>
                <Stack align="center" gap="xs">
                  <ThemeIcon color="green" size={60} radius="xl">
                    <CheckCircleIcon size={36} weight="bold" />
                  </ThemeIcon>
                  <Title order={2} c="white" tt="uppercase" lts="1px" ta="center">
                    Payment Confirmed!
                  </Title>
                  <Text size="sm" c="var(--hcc-gray-400)">
                    Order Reference: <Text component="span" fw={700} c="var(--hcc-accent)">{order.paymentOrderId}</Text>
                  </Text>
                </Stack>
              </Center>

              <Divider color="rgba(255, 255, 255, 0.1)" />

              {/* Order Details Grid */}
              <Paper p="md" radius="md" style={{ backgroundColor: 'var(--hcc-darker)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text size="xs" c="var(--hcc-gray-400)" tt="uppercase">Fixture ID</Text>
                    <Text size="sm" fw={700} c="white">{order.fixtureId.toUpperCase()}</Text>
                  </Group>

                  <Group justify="space-between">
                    <Text size="xs" c="var(--hcc-gray-400)" tt="uppercase">Ticket Tier</Text>
                    <Badge color="pink" variant="light">{order.category}</Badge>
                  </Group>

                  <Group justify="space-between">
                    <Text size="xs" c="var(--hcc-gray-400)" tt="uppercase">Quantity</Text>
                    <Text size="sm" fw={700} c="white">{order.quantity} {order.quantity === 1 ? 'Pass' : 'Passes'}</Text>
                  </Group>

                  <Group justify="space-between">
                    <Text size="xs" c="var(--hcc-gray-400)" tt="uppercase">Total Amount Paid</Text>
                    <Text size="lg" fw={800} c="var(--hcc-accent)">£{order.totalAmount.toFixed(2)} GBP</Text>
                  </Group>

                  {order.ticketId && (
                    <Group justify="space-between">
                      <Text size="xs" c="var(--hcc-gray-400)" tt="uppercase">Digital Ticket ID</Text>
                      <Text size="sm" fw={700} c="green">{order.ticketId}</Text>
                    </Group>
                  )}
                </Stack>
              </Paper>

              <Paper p="sm" radius="md" className={classes.seatAllocationBox}>
                <Group gap="xs">
                  <ShieldCheckIcon size={22} style={{ color: 'var(--hcc-accent)' }} />
                  <Stack gap={0}>
                    <Text size="xs" fw={700} c="white">
                      Digital Pass Issued to Wallet
                    </Text>
                    <Text size="xs" c="var(--hcc-gray-400)">
                      Your QR entry code and seat allocation have been saved to your account wallet.
                    </Text>
                  </Stack>
                </Group>
              </Paper>

              {/* CTAs */}
              <Group justify="space-between" mt="md">
                <Button
                  variant="subtle"
                  color="gray"
                  leftSection={<TicketIcon size={18} />}
                  onClick={() => navigate('/tickets')}
                >
                  Back to Matchday Hub
                </Button>
                <Button
                  variant="filled"
                  color="pink"
                  radius="xl"
                  leftSection={<QrCodeIcon size={18} />}
                  rightSection={<ArrowRightIcon size={16} />}
                  onClick={() => navigate('/my-tickets')}
                >
                  View Digital Pass in Wallet
                </Button>
              </Group>
            </Stack>
          ) : null}
        </Paper>
      </Container>
    </div>
  );
}
