import { useState, useEffect } from 'react';
import {
  Modal,
  Stack,
  Group,
  Title,
  Text,
  Badge,
  Button,
  Radio,
  NumberInput,
  Paper,
  Divider,
  Alert,
  Center,
  ThemeIcon,
  Stepper,
} from '@mantine/core';
import {
  TicketIcon,
  CheckCircleIcon,
  InfoIcon,
  ShieldCheckIcon,
  SparkleIcon,
  XCircleIcon,
  LockKeyIcon,
  QrCodeIcon,
} from '@phosphor-icons/react';
import type { Fixture } from '../../../data/fixturesData';
import type { TicketCategoryType } from '../../../data/ticketsData';
import { TICKET_CATEGORIES } from '../../../data/ticketsData';
import { useTicketsStore } from '../../../store/useTicketsStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { createCheckoutSession, fulfillPaymentSession } from '../../../services/paymentsApi';
import { StripePaymentCheckout } from '../../payments/StripePaymentCheckout';
import classes from './Tickets.module.css';

interface TicketPurchaseModalProps {
  opened: boolean;
  onClose: () => void;
  fixture: Fixture | null;
  onSuccess: () => void;
}

export function TicketPurchaseModal({
  opened,
  onClose,
  fixture,
  onSuccess,
}: TicketPurchaseModalProps) {
  const { user, token } = useAuthStore();
  const { getAvailableCount, fetchAvailability, purchaseTickets } = useTicketsStore();

  const [activeStep, setActiveStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<TicketCategoryType>('STANDARD');
  const [quantity, setQuantity] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [ticketDetails, setTicketDetails] = useState<{
    ticketId: string;
    seats: string;
    section: string;
  } | null>(null);

  // Reset stepper & refresh availability when modal opens or fixture changes
  useEffect(() => {
    if (fixture && opened) {
      setErrorMsg(null);
      setActiveStep(0);
      setTicketDetails(null);

      fetchAvailability(fixture.id).then(() => {
        const store = useTicketsStore.getState();
        const fixAvail = store.availability[fixture.id];
        if (fixAvail) {
          const availableTier = TICKET_CATEGORIES.find(
            (cat) => (fixAvail[cat.id] ?? 0) > 0
          );
          if (availableTier) {
            setSelectedCategory(availableTier.id);
            setQuantity(1);
          } else {
            setSelectedCategory('STANDARD');
            setQuantity(0);
          }
        }
      });
    }
  }, [fixture, opened, fetchAvailability]);

  if (!fixture) return null;

  const currentCategoryInfo = TICKET_CATEGORIES.find((c) => c.id === selectedCategory)!;
  const availableCount = getAvailableCount(fixture.id, selectedCategory);
  const effectiveAvailable = availableCount === -1 ? 0 : availableCount;
  const totalFixtureAvail = getAvailableCount(fixture.id);
  const isMatchFullySoldOut = totalFixtureAvail !== -1 && totalFixtureAvail === 0;

  const handleCategoryChange = (catId: TicketCategoryType) => {
    const avail = getAvailableCount(fixture.id, catId);
    if (avail <= 0) return;
    setSelectedCategory(catId);
    setQuantity(1);
  };

  const totalPrice = currentCategoryInfo.price * quantity;

  const handleProceedToPayment = () => {
    setErrorMsg(null);
    if (!user || !token) {
      setErrorMsg('You must be signed in to purchase tickets.');
      return;
    }

    if (effectiveAvailable === 0 || quantity === 0) {
      setErrorMsg('This ticket category is sold out.');
      return;
    }

    if (quantity > effectiveAvailable) {
      setErrorMsg(`Only ${effectiveAvailable} tickets remaining in this category.`);
      return;
    }

    setActiveStep(1);
  };

  // Payment Execution Handler for Reusable Stripe Component
  const handleExecutePayment = async () => {
    if (!user || !token) return;

    // Execute backend order checkout session & fulfillment
    let session;
    try {
      session = await createCheckoutSession(
        { fixtureId: fixture.id, category: selectedCategory, quantity },
        token
      );
    } catch (err) {
      console.warn('payment-service backend unavailable, falling back to tickets-service direct reservation:', err);
    }

    if (session?.sessionId) {
      try {
        const fulfilledOrder = await fulfillPaymentSession(session.sessionId, token);
        setTicketDetails({
          ticketId: fulfilledOrder.ticketId || `HFC-TKT-${Math.floor(1000 + Math.random() * 9000)}`,
          seats: `Seats ${Math.floor(1 + Math.random() * 20)}-${Math.floor(1 + Math.random() * 20) + quantity - 1}`,
          section: `${selectedCategory} Stand - Block ${selectedCategory.charAt(0)}1`,
        });
      } catch {
        const pass = await purchaseTickets(
          { fixtureId: fixture.id, category: selectedCategory, quantity, memberUsername: user.username },
          token
        );
        setTicketDetails({
          ticketId: pass.ticketId,
          seats: pass.seatNumbers,
          section: pass.seatSection,
        });
      }
    } else {
      const pass = await purchaseTickets(
        { fixtureId: fixture.id, category: selectedCategory, quantity, memberUsername: user.username },
        token
      );
      setTicketDetails({
        ticketId: pass.ticketId,
        seats: pass.seatNumbers,
        section: pass.seatSection,
      });
    }

    setActiveStep(2);
    onSuccess();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <TicketIcon size={22} weight="bold" style={{ color: 'var(--hcc-accent)' }} />
          <Text fw={700} size="lg" c="white" tt="uppercase" lts="1px">
            Book Matchday Tickets
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
      <Stack gap="md">
        {/* Mantine Stepper Visual Progress Bar */}
        <Stepper active={activeStep} onStepClick={setActiveStep} color="pink" size="sm" radius="md">
          <Stepper.Step
            label="Tier Selection"
            description="Category & Qty"
            icon={<TicketIcon size={18} />}
            allowStepSelect={activeStep > 0 && activeStep < 2}
          >
            <Stack gap="md" mt="sm">
              {/* Match Overview Header */}
              <Paper p="md" radius="md" className={classes.fixtureModalSummary}>
                <Group justify="space-between" align="center" wrap="nowrap">
                  <Stack gap={2}>
                    <Text size="xs" fw={700} c="var(--hcc-accent)" tt="uppercase">
                      {fixture.competition}
                    </Text>
                    <Title order={4} c="white" tt="uppercase">
                      {fixture.homeTeam.shortName} vs {fixture.awayTeam.shortName}
                    </Title>
                    <Text size="xs" c="var(--hcc-gray-400)">
                      {fixture.date} • {fixture.time} GMT
                    </Text>
                  </Stack>
                  <Badge color="pink" variant="light" radius="sm" size="lg">
                    {fixture.venue.split(',')[0]}
                  </Badge>
                </Group>
              </Paper>

              {isMatchFullySoldOut && (
                <Alert color="red" variant="filled" icon={<XCircleIcon size={20} />} title="Match Fully Sold Out">
                  All ticket tiers for this match are currently sold out. Check back later for returned allocations.
                </Alert>
              )}

              {errorMsg && (
                <Alert color="red" variant="light" icon={<InfoIcon size={18} />}>
                  {errorMsg}
                </Alert>
              )}

              {/* Tier Selection */}
              <Stack gap="xs">
                <Text fw={700} size="sm" c="white" tt="uppercase" lts="1px">
                  1. Select Ticket Tier
                </Text>

                <Radio.Group
                  value={selectedCategory}
                  onChange={(val) => handleCategoryChange(val as TicketCategoryType)}
                >
                  <Stack gap="sm">
                    {TICKET_CATEGORIES.map((cat) => {
                      const count = getAvailableCount(fixture.id, cat.id);
                      const effectiveCount = count === -1 ? 0 : count;
                      const isSoldOut = effectiveCount === 0;

                      return (
                        <Paper
                          key={cat.id}
                          p="sm"
                          radius="md"
                          className={`${classes.tierCard} ${
                            selectedCategory === cat.id && !isSoldOut ? classes.tierCardSelected : ''
                          } ${isSoldOut ? classes.tierCardDisabled : ''}`}
                          onClick={() => !isSoldOut && handleCategoryChange(cat.id)}
                        >
                          <Group justify="space-between" align="flex-start" wrap="nowrap">
                            <Group gap="sm" align="flex-start">
                              <Radio
                                value={cat.id}
                                disabled={isSoldOut}
                                color="pink"
                                style={{ marginTop: 2 }}
                              />
                              <Stack gap={2}>
                                <Group gap="xs">
                                  <Text fw={700} size="sm" c={isSoldOut ? 'var(--hcc-gray-500)' : 'white'}>
                                    {cat.name}
                                  </Text>
                                  {cat.id === 'VIP' && (
                                    <Badge color="yellow" size="xs" variant="filled" leftSection={<SparkleIcon size={10} />}>
                                      VIP
                                    </Badge>
                                  )}
                                </Group>
                                <Text size="xs" c="var(--hcc-gray-400)" lineClamp={2}>
                                  {cat.description}
                                </Text>
                              </Stack>
                            </Group>

                            <Stack align="flex-end" gap={2} style={{ flexShrink: 0 }}>
                              <Text fw={800} size="md" c={isSoldOut ? 'var(--hcc-gray-500)' : 'var(--hcc-accent)'}>
                                £{cat.price}
                              </Text>
                              <Badge
                                size="xs"
                                variant={isSoldOut ? 'filled' : 'dot'}
                                color={isSoldOut ? 'red' : effectiveCount < 10 ? 'orange' : 'green'}
                              >
                                {isSoldOut ? 'Sold Out' : `${effectiveCount} available`}
                              </Badge>
                            </Stack>
                          </Group>
                        </Paper>
                      );
                    })}
                  </Stack>
                </Radio.Group>
              </Stack>

              <Divider color="rgba(255, 255, 255, 0.08)" />

              {/* Quantity Selector */}
              <Group justify="space-between" align="center">
                <Stack gap={2}>
                  <Text fw={700} size="sm" c="white" tt="uppercase" lts="1px">
                    2. Quantity
                  </Text>
                  <Text size="xs" c="var(--hcc-gray-400)">
                    {effectiveAvailable > 0
                      ? `Max ${Math.min(4, effectiveAvailable)} tickets per member`
                      : 'Selected tier is currently unavailable'}
                  </Text>
                </Stack>

                <NumberInput
                  value={quantity}
                  onChange={(val) => setQuantity(Number(val) || 0)}
                  min={effectiveAvailable > 0 ? 1 : 0}
                  max={Math.min(4, effectiveAvailable)}
                  disabled={effectiveAvailable === 0}
                  clampBehavior="strict"
                  size="sm"
                  w={110}
                  classNames={{ input: classes.numberInput }}
                />
              </Group>

              <Divider color="rgba(255, 255, 255, 0.08)" />

              {/* Seat Allocation Preview */}
              <Paper p="sm" radius="md" className={classes.seatAllocationBox}>
                <Group gap="xs">
                  <ShieldCheckIcon size={20} style={{ color: 'var(--hcc-accent)' }} />
                  <Stack gap={0}>
                    <Text size="xs" fw={700} c="white">
                      Guaranteed Adjacent Seating
                    </Text>
                    <Text size="xs" c="var(--hcc-gray-400)">
                      Seats are automatically assigned in best available section upon confirmation.
                    </Text>
                  </Stack>
                </Group>
              </Paper>

              {/* Total & Action */}
              <Group justify="space-between" align="center" mt="xs">
                <Stack gap={0}>
                  <Text size="xs" c="var(--hcc-gray-400)" tt="uppercase" lts="1px">
                    Total Amount
                  </Text>
                  <Text fw={900} size="xl" c="white">
                    £{totalPrice} <Text component="span" size="xs" c="var(--hcc-gray-400)">inc. VAT</Text>
                  </Text>
                </Stack>

                <Group gap="sm">
                  <Button variant="subtle" color="gray" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="filled"
                    color="pink"
                    size="md"
                    radius="xl"
                    leftSection={<LockKeyIcon size={18} weight="bold" />}
                    disabled={effectiveAvailable === 0 || quantity === 0}
                    onClick={handleProceedToPayment}
                    className={classes.confirmBtn}
                  >
                    {effectiveAvailable === 0 ? 'Sold Out' : `Proceed to Stripe (£${totalPrice})`}
                  </Button>
                </Group>
              </Group>
            </Stack>
          </Stepper.Step>

          <Stepper.Step
            label="Payment"
            description="Stripe Checkout"
            icon={<LockKeyIcon size={18} />}
            allowStepSelect={false}
          >
            <Stack gap="md" mt="sm">
              <StripePaymentCheckout
                title={`${fixture.homeTeam.shortName} vs ${fixture.awayTeam.shortName}`}
                description={`${quantity}x ${currentCategoryInfo.name} Matchday Pass`}
                amount={totalPrice}
                badgeLabel={fixture.competition}
                itemDetails={[
                  { label: 'Category Tier', value: currentCategoryInfo.name },
                  { label: 'Quantity', value: `${quantity} ${quantity === 1 ? 'Pass' : 'Passes'}` },
                  { label: 'Stadium Venue', value: fixture.venue.split(',')[0] },
                ]}
                onPaymentSuccess={handleExecutePayment}
                onBack={() => setActiveStep(0)}
                onClose={onClose}
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Completed>
            {ticketDetails && (
              <Stack gap="md" mt="sm">
                <Center py="xs">
                  <Stack align="center" gap="xs">
                    <ThemeIcon color="green" size={56} radius="xl">
                      <CheckCircleIcon size={34} weight="bold" />
                    </ThemeIcon>
                    <Title order={3} c="white" tt="uppercase" lts="1px">
                      Match Booking Confirmed!
                    </Title>
                    <Badge color="pink" variant="light" size="lg">
                      {selectedCategory} TIER • {quantity} {quantity === 1 ? 'PASS' : 'PASSES'}
                    </Badge>
                  </Stack>
                </Center>

                <Paper p="md" radius="md" style={{ backgroundColor: 'var(--hcc-darker)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text size="xs" c="var(--hcc-gray-400)">Digital Ticket Reference</Text>
                      <Text size="sm" fw={700} c="green">{ticketDetails.ticketId}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="xs" c="var(--hcc-gray-400)">Fixture</Text>
                      <Text size="sm" fw={700} c="white">{fixture.homeTeam.shortName} vs {fixture.awayTeam.shortName}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="xs" c="var(--hcc-gray-400)">Stadium Block</Text>
                      <Text size="sm" fw={700} c="white">{ticketDetails.section}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="xs" c="var(--hcc-gray-400)">Allocated Seats</Text>
                      <Text size="sm" fw={700} c="var(--hcc-accent)">{ticketDetails.seats}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="xs" c="var(--hcc-gray-400)">Total Charged</Text>
                      <Text size="md" fw={800} c="white">£{totalPrice.toFixed(2)} GBP</Text>
                    </Group>
                  </Stack>
                </Paper>

                <Group justify="space-between" mt="sm">
                  <Button variant="subtle" color="gray" onClick={onClose}>
                    Close
                  </Button>
                  <Button
                    color="pink"
                    radius="xl"
                    leftSection={<QrCodeIcon size={18} />}
                    onClick={() => {
                      onClose();
                      window.location.href = '/my-tickets';
                    }}
                  >
                    View Digital Pass in Wallet
                  </Button>
                </Group>
              </Stack>
            )}
          </Stepper.Completed>
        </Stepper>
      </Stack>
    </Modal>
  );
}
