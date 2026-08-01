import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Card,
  Group,
  Stack,
  Title,
  Text,
  Badge,
  Button,
  Avatar,
  Paper,
  Notification,
  Skeleton,
} from '@mantine/core';
import {
  TicketIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserCircleIcon,
  CalendarCheckIcon,
} from '@phosphor-icons/react';
import type { Fixture } from '../../../data/fixturesData';
import { fixturesData } from '../../../data/fixturesData';
import { TICKET_CATEGORIES } from '../../../services/ticketsApi';
import { useTicketsStore } from '../../../store/useTicketsStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { TicketPurchaseModal } from './TicketPurchaseModal';
import logo from '../../../assets/hcclogo.png';
import classes from './Tickets.module.css';

function TeamLogo({ name: _name, shortName, isHarlequins }: { name: string; shortName: string; isHarlequins: boolean }) {
  if (isHarlequins) {
    return <img src={logo} alt="Harlequins FC" className={classes.teamLogo} />;
  }

  return (
    <Avatar
      size={40}
      radius="xl"
      color="dark"
      className={classes.teamLogoFallback}
    >
      {shortName}
    </Avatar>
  );
}

export function Tickets() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const { availability, fetchAllAvailability, isLoadingAvailability } = useTicketsStore();

  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [notification, setNotification] = useState<{ title: string; message: string; color: string } | null>(null);

  // Filter only upcoming HOME fixtures
  const upcomingFixtures = useMemo(() => {
    return fixturesData.filter((f) => f.status === 'UPCOMING' && f.homeTeam.isHarlequins);
  }, []);

  // Fetch availability from tickets-service on mount
  useEffect(() => {
    const ids = upcomingFixtures.map((f) => f.id);
    if (ids.length > 0) {
      fetchAllAvailability(ids);
    }
  }, [upcomingFixtures, fetchAllAvailability]);

  const handleOpenPurchaseModal = (fixture: Fixture) => {
    if (!isAuthenticated) {
      // Remember where user was and which match they intended to book
      navigate('/login', {
        state: {
          from: '/tickets',
          autoBookFixtureId: fixture.id,
        },
      });
      return;
    }
    setSelectedFixture(fixture);
    setModalOpened(true);
  };

  // Handle return-from-login OR direct navigation with target fixture: smooth scroll & auto open modal
  useEffect(() => {
    const state = location.state as { autoBookFixtureId?: string } | null;
    if (state?.autoBookFixtureId) {
      const fix = upcomingFixtures.find((f) => f.id === state.autoBookFixtureId);
      if (fix) {
        // 1. Smooth scroll to fixture card
        setTimeout(() => {
          const el = document.getElementById(`fixture-${fix.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);

        // 2. Automatically open purchase modal (or trigger login redirect if unauthenticated)
        handleOpenPurchaseModal(fix);

        // 3. Clear state to avoid re-triggering on manual refresh
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state, upcomingFixtures, navigate, location.pathname, isAuthenticated]);

  const handlePurchaseSuccess = () => {
    setNotification({
      title: 'Ticket Order Confirmed!',
      message: 'Your match pass has been added to your digital wallet.',
      color: 'green',
    });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className={classes.ticketsPage}>
      {/* Hero Header */}
      <section className={classes.heroSection}>
        <Stack align="center" gap="xs" className={classes.heroContent}>
          <Text
            size="xs"
            fw={700}
            tt="uppercase"
            lts="3px"
            c="var(--hcc-accent)"
          >
            Matchday Ticketing Hub • 2026/27 Campaign
          </Text>
          <Title order={1} className={classes.heroTitle}>
            Official Match Tickets
          </Title>
          <Text size="md" c="var(--hcc-gray-400)" ta="center" maw={580}>
            Secure your seats at Craneford Way Stadium for the Quins 2026/27 season.
          </Text>

          <Group gap="sm" mt="xs">
            {isAuthenticated ? (
              <Button
                variant="outline"
                color="pink"
                radius="xl"
                size="xs"
                leftSection={<CalendarCheckIcon size={16} />}
                onClick={() => navigate('/my-tickets')}
              >
                View My Digital Passes
              </Button>
            ) : (
              <Button
                variant="subtle"
                color="pink"
                size="xs"
                leftSection={<UserCircleIcon size={16} />}
                onClick={() => navigate('/login', { state: { from: '/tickets' } })}
              >
                Sign In to Access Digital Passes
              </Button>
            )}
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
                Upcoming Home Fixtures ({upcomingFixtures.length})
              </Title>
              <Text size="sm" c="var(--hcc-gray-400)">
                Official Harlequins FC Home Matchday Tickets & Matchday Parking Passes
              </Text>
            </Stack>

            {isAuthenticated && (
              <Text size="xs" c="var(--hcc-gray-400)">
                Signed in as <Text component="span" fw={700} c="white">{user?.username}</Text>
              </Text>
            )}
          </Group>

          {upcomingFixtures.map((fixture) => {
            const fixAvail = availability[fixture.id];
            const isLoading = isLoadingAvailability[fixture.id];
            const notLoaded = !fixAvail;

            // When data hasn't loaded yet, show defaults
            const standard = fixAvail?.STANDARD ?? 0;
            const premium = fixAvail?.PREMIUM ?? 0;
            const vip = fixAvail?.VIP ?? 0;
            const totalRemaining = standard + premium + vip;
            const isFullySoldOut = !notLoaded && totalRemaining === 0;
            const isSellingFast = !notLoaded && totalRemaining < 50 && totalRemaining > 0;
            const isLowStock = !notLoaded && totalRemaining < 20 && totalRemaining > 0;

            return (
              <Card
                id={`fixture-${fixture.id}`}
                key={fixture.id}
                className={classes.ticketCard}
                radius="lg"
              >
                {/* 1. Left Info Details */}
                <Stack gap={4} className={classes.leftInfo}>
                  <Group gap={6}>
                    <Text size="xs" fw={700} tt="uppercase" lts="1.5px" c="var(--hcc-accent)">
                      {fixture.competition}
                    </Text>
                    {isLoading || notLoaded ? (
                      <Skeleton width={70} height={16} radius="xl" />
                    ) : isFullySoldOut ? (
                      <Badge color="red" variant="filled" size="xs">Sold Out</Badge>
                    ) : isLowStock ? (
                      <Badge color="red" variant="filled" size="xs">Low Stock</Badge>
                    ) : isSellingFast ? (
                      <Badge color="orange" variant="light" size="xs">Selling Fast</Badge>
                    ) : (
                      <Badge color="green" variant="light" size="xs">Available</Badge>
                    )}
                  </Group>
                  <Text fw={700} size="md" c="white">
                    {fixture.date} • {fixture.time} GMT
                  </Text>
                  <Group gap={4} wrap="nowrap">
                    <MapPinIcon size={14} style={{ color: 'var(--hcc-accent)', flexShrink: 0 }} />
                    <Text size="xs" c="var(--hcc-gray-400)" truncate>{fixture.venue}</Text>
                  </Group>
                </Stack>

                {/* 2. Center Matchup — Clean Team Layout */}
                <div className={classes.matchupCenter}>
                  <Group gap="xs" wrap="nowrap" className={classes.homeTeam}>
                    <Text
                      fw={fixture.homeTeam.isHarlequins ? 800 : 700}
                      c={fixture.homeTeam.isHarlequins ? 'white' : 'var(--hcc-gray-300)'}
                      tt="uppercase"
                      className={classes.teamName}
                    >
                      {fixture.homeTeam.name}
                    </Text>
                    <TeamLogo name={fixture.homeTeam.name} shortName={fixture.homeTeam.shortName} isHarlequins={fixture.homeTeam.isHarlequins} />
                  </Group>

                  <Badge size="md" radius="sm" variant="light" color="pink" className={classes.vsBadge} mx="xs">
                    VS
                  </Badge>

                  <Group gap="xs" wrap="nowrap" className={classes.awayTeam}>
                    <TeamLogo name={fixture.awayTeam.name} shortName={fixture.awayTeam.shortName} isHarlequins={fixture.awayTeam.isHarlequins} />
                    <Text
                      fw={fixture.awayTeam.isHarlequins ? 800 : 700}
                      c={fixture.awayTeam.isHarlequins ? 'white' : 'var(--hcc-gray-300)'}
                      tt="uppercase"
                      className={classes.teamName}
                    >
                      {fixture.awayTeam.name}
                    </Text>
                  </Group>
                </div>

                {/* 3. Right Inventory & Action Button */}
                <Stack align="flex-end" gap="xs" className={classes.rightActions}>
                  <Group gap={6} justify="flex-end">
                    {TICKET_CATEGORIES.map((cat) => {
                      const count = fixAvail?.[cat.id] ?? 0;
                      const loading = isLoading || notLoaded;
                      return (
                        <Paper key={cat.id} p="3px 8px" radius="xs" className={classes.tierPill}>
                          {loading ? (
                            <Skeleton width={90} height={14} radius="xs" />
                          ) : (
                            <Text size="xs" c="var(--hcc-gray-400)">
                              {cat.name.split(' ')[0]}:{' '}
                              <Text component="span" fw={700} c={count === 0 ? 'red.4' : 'white'}>
                                £{cat.price}
                              </Text>{' '}
                              ({count === 0 ? 'Sold Out' : `${count} left`})
                            </Text>
                          )}
                        </Paper>
                      );
                    })}
                  </Group>

                  <Button
                    variant={isFullySoldOut ? 'outline' : 'filled'}
                    color={isFullySoldOut ? 'gray' : 'pink'}
                    radius="xl"
                    size="sm"
                    disabled={isFullySoldOut}
                    leftSection={<TicketIcon size={16} weight="bold" />}
                    className={isFullySoldOut ? '' : classes.buyBtn}
                    onClick={() => handleOpenPurchaseModal(fixture)}
                  >
                    {isFullySoldOut ? 'Sold Out' : 'Select Seats & Book'}
                  </Button>
                </Stack>
              </Card>
            );
          })}
        </Stack>
      </Container>

      {/* Ticket Purchase Modal */}
      <TicketPurchaseModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        fixture={selectedFixture}
        onSuccess={handlePurchaseSuccess}
      />
    </div>
  );
}

export default Tickets;
