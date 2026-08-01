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
  CarIcon,
  SparkleIcon,
  LockKeyIcon,
} from '@phosphor-icons/react';
import { fixturesData } from '../../../data/fixturesData';
import { useTicketsStore } from '../../../store/useTicketsStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useParkingStore } from '../../../store/useParkingStore';
import { ParkingZoneSelector } from '../../parking/ParkingZoneSelector';
import { StripePaymentCheckout } from '../../payments/StripePaymentCheckout';
import { Modal } from '@mantine/core';
import classes from './Tickets.module.css';

export function MyTickets() {
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useAuthStore();
  const { myTickets, fetchMyTickets, cancelTicket, isLoadingMyTickets } = useTicketsStore();
  const { myReservations, fetchMyReservations, reserveParking, cancelReservation, availability: parkingAvail } = useParkingStore();

  const [notification, setNotification] = useState<{ title: string; message: string; color: string } | null>(null);
  const [parkingModalFixtureId, setParkingModalFixtureId] = useState<string | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [parkingActiveStep, setParkingActiveStep] = useState<number>(0);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchMyTickets(token);
      fetchMyReservations(token);
    }
  }, [isAuthenticated, token, fetchMyTickets, fetchMyReservations]);

  const handleExecuteParkingPayment = async () => {
    if (!token || !parkingModalFixtureId || !selectedZoneId) return;
    const res = await reserveParking(
      {
        fixtureId: parkingModalFixtureId,
        zoneId: selectedZoneId,
        isPaid: true,
      },
      token
    );

    if (res) {
      setParkingModalFixtureId(null);
      setSelectedZoneId(null);
      setParkingActiveStep(0);
      setNotification({
        title: 'Parking Pass Confirmed!',
        message: `Your spot in ${res.zoneName} (Ref: ${res.reservationId}) has been paid and confirmed.`,
        color: 'green',
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleCancelParking = async (reservationId: string, pricePence: number) => {
    if (!token) return;
    const success = await cancelReservation(reservationId, token);
    if (success) {
      const refundText = pricePence > 0 ? `Refund of £${(pricePence / 100).toFixed(2)} processed to original payment method.` : 'Space released back to pool.';
      setNotification({
        title: 'Parking Pass Cancelled',
        message: `Parking reservation ${reservationId} cancelled. ${refundText}`,
        color: 'orange',
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleCancelTicket = async (ticketId: string) => {
    if (!token) return;
    const targetTicket = myTickets.find((t) => t.ticketId === ticketId);
    if (targetTicket) {
      // Automatically cancel associated parking reservation if present
      const associatedParking = myReservations.find(
        (r) => r.fixtureId === targetTicket.fixtureId && r.status !== 'CANCELLED' && r.status !== 'EXPIRED'
      );
      if (associatedParking) {
        await cancelReservation(associatedParking.reservationId, token);
      }
    }
    const success = await cancelTicket(ticketId, token);
    if (success) {
      setNotification({
        title: 'Booking & Parking Pass Cancelled',
        message: 'Your ticket and associated parking pass have been cancelled and full refund processed.',
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
                            <Badge color="pink" variant="filled" size="xs">
                              🏠 HOME
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

                          {/* Parking Reservation Info / Add Parking Button */}
                          {(() => {

                          const isVipPass = ticket.category === 'VIP';
                          if (isVipPass) {
                            return (
                              <Paper p="xs" radius="md" style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)' }} mt="4px">
                                <Group justify="space-between" align="center">
                                  <Group gap="xs">
                                    <SparkleIcon size={18} color="#eab308" />
                                    <div>
                                      <Text size="xs" fw={700} c="white">
                                        🅿️ Zone B (VIP / Hospitality)
                                      </Text>
                                      <Text size="xs" c="dimmed">
                                        Dedicated VIP Underground Parking Pass Included
                                      </Text>
                                    </div>
                                  </Group>
                                  <Badge color="yellow" size="xs" variant="filled">
                                    CONFIRMED
                                  </Badge>
                                </Group>
                              </Paper>
                            );
                          }

                          const parkingRes = myReservations.find(
                            (r) => r.fixtureId === ticket.fixtureId && r.status !== 'CANCELLED' && r.status !== 'EXPIRED'
                          );
                          if (parkingRes) {
                            const paidText = parkingRes.pricePaidPence === 0 ? 'Free Pass' : `Paid: £${(parkingRes.pricePaidPence / 100).toFixed(2)}`;
                            return (
                              <Paper p="xs" radius="md" style={{ backgroundColor: 'rgba(230, 0, 126, 0.1)', border: '1px solid rgba(230, 0, 126, 0.3)' }} mt="4px">
                                <Group justify="space-between" align="center" wrap="nowrap">
                                  <Group gap="xs" wrap="nowrap">
                                    <CarIcon size={20} color="var(--hcc-accent)" />
                                    <div>
                                      <Group gap="xs">
                                        <Text size="xs" fw={700} c="white">
                                          🅿️ {parkingRes.zoneName}
                                        </Text>
                                        <Badge size="xs" color="pink" variant="outline">
                                          {paidText}
                                        </Badge>
                                      </Group>
                                      <Text size="xs" c="dimmed">
                                        Ref: {parkingRes.reservationId} {parkingRes.plateNumber ? `• Reg: ${parkingRes.plateNumber}` : ''}
                                      </Text>
                                    </div>
                                  </Group>
                                  <Group gap="xs">
                                    <Badge color={parkingRes.status === 'CONFIRMED' ? 'green' : 'pink'} size="xs" variant="filled">
                                      {parkingRes.status}
                                    </Badge>
                                    {!isCancelled && (
                                      <Button
                                        variant="subtle"
                                        color="red"
                                        size="xs"
                                        onClick={() => handleCancelParking(parkingRes.reservationId, parkingRes.pricePaidPence)}
                                      >
                                        Cancel Parking
                                      </Button>
                                    )}
                                  </Group>
                                </Group>
                              </Paper>
                            );
                          }
                          if (!isCancelled) {
                            return (
                              <Group mt="4px">
                                <Button
                                  variant="light"
                                  color="pink"
                                  size="xs"
                                  radius="xl"
                                  leftSection={<CarIcon size={14} />}
                                  onClick={() => {
                                    setParkingModalFixtureId(ticket.fixtureId);
                                    setSelectedZoneId(null);
                                    setParkingActiveStep(0);
                                  }}
                                >
                                  Add Parking
                                </Button>
                              </Group>
                            );
                          }
                          return null;
                        })()}
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
                No Active Passes Found
              </Title>
              <Text c="var(--hcc-gray-400)" mb="lg">
                You haven't booked any matchday tickets yet for the upcoming 2026/27 season.
              </Text>
              <Button color="pink" radius="xl" onClick={() => navigate('/tickets')}>
                Browse Home Fixtures
              </Button>
            </Paper>
          )}
        </Stack>
      </Container>

      {/* Standalone Parking Modal */}
      <Modal
        opened={!!parkingModalFixtureId}
        onClose={() => {
          setParkingModalFixtureId(null);
          setParkingActiveStep(0);
        }}
        title={
          <Group gap="xs">
            <CarIcon size={22} color="var(--hcc-accent)" weight="bold" />
            <Text fw={700} size="lg" c="white" tt="uppercase">
              Add Matchday Parking Pass
            </Text>
          </Group>
        }
        size="lg"
        radius="lg"
        centered
        classNames={{
          content: classes.modalContent,
          header: classes.modalHeader,
          body: classes.modalBody,
        }}
      >
        {parkingModalFixtureId && (() => {
          const targetFixture = fixturesData.find(f => f.id === parkingModalFixtureId);
          const selectedZoneObj = selectedZoneId && parkingModalFixtureId ? (parkingAvail[parkingModalFixtureId] || []).find(z => z.zoneId === selectedZoneId) : null;
          const selectedZonePrice = selectedZoneObj && selectedZoneObj.priceMinPence ? selectedZoneObj.priceMinPence / 100 : 0;

          if (parkingActiveStep === 1 && selectedZoneObj) {
            return (
              <StripePaymentCheckout
                title={`Matchday Parking Pass — ${selectedZoneObj.zoneName}`}
                description={`${targetFixture?.homeTeam.shortName || 'Harlequins FC'} vs ${targetFixture?.awayTeam.shortName || 'Opponent'} • ${targetFixture?.date || 'Matchday'}`}
                amount={selectedZonePrice}
                badgeLabel="PARKING RESERVATION"
                itemDetails={[
                  { label: 'Parking Zone', value: selectedZoneObj.zoneName },
                  { label: 'Location', value: selectedZoneObj.location },
                  { label: 'Eligibility', value: selectedZoneObj.eligibleTier },
                ]}
                onPaymentSuccess={handleExecuteParkingPayment}
                onBack={() => setParkingActiveStep(0)}
                onClose={() => {
                  setParkingModalFixtureId(null);
                  setParkingActiveStep(0);
                }}
              />
            );
          }

          return (
            <Stack gap="md">
              <ParkingZoneSelector
                fixtureId={parkingModalFixtureId}
                selectedZoneId={selectedZoneId}
                onSelectZone={(zoneId) => {
                  setSelectedZoneId(zoneId);
                }}
              />

              <Group justify="space-between" mt="md">
                <Button variant="subtle" color="gray" onClick={() => {
                  setParkingModalFixtureId(null);
                  setParkingActiveStep(0);
                }}>
                  Cancel
                </Button>
                <Button
                  color="pink"
                  radius="xl"
                  leftSection={<LockKeyIcon size={16} />}
                  disabled={!selectedZoneId}
                  onClick={() => {
                    if (selectedZonePrice === 0) {
                      handleExecuteParkingPayment();
                    } else {
                      setParkingActiveStep(1);
                    }
                  }}
                >
                  {selectedZonePrice === 0 ? 'Confirm Free Reservation' : `Proceed to Stripe Payment (£${selectedZonePrice})`}
                </Button>
              </Group>
            </Stack>
          );
        })()}
      </Modal>
    </div>
  );
}

export default MyTickets;
