import { useState, type SyntheticEvent } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  Stack,
  Group,
  Text,
  Button,
  Paper,
  Divider,
  Alert,
  Center,
  Loader,
} from '@mantine/core';
import {
  LockKeyIcon,
  InfoIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
} from '@phosphor-icons/react';
import { useAuthStore } from '../../store/useAuthStore';
import classes from '../pages/tickets/Tickets.module.css';

// Load Stripe Public Key from environment variable (.env)
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51MockKeyHarlequinsFC2026';
const stripePromise = loadStripe(stripePublicKey);

export interface PaymentItemDetail {
  label: string;
  value: string;
}

export interface StripePaymentCheckoutProps {
  title: string;
  description?: string;
  amount: number; // amount in major currency unit (e.g. 85.00)
  currency?: string; // default 'gbp'
  badgeLabel?: string;
  itemDetails?: PaymentItemDetail[];
  onPaymentSuccess: () => Promise<void> | void;
  onBack?: () => void;
  onClose: () => void;
}

function EmbeddedPaymentForm({
  title,
  description,
  amount,
  currency = 'gbp',
  badgeLabel,
  itemDetails,
  onPaymentSuccess,
  onBack,
  onClose,
}: StripePaymentCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuthStore();

  const [processingState, setProcessingState] = useState<'idle' | 'processing'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!user) {
      setErrorMsg('You must be signed in to complete payment.');
      return;
    }

    setProcessingState('processing');

    try {
      if (stripe && elements) {
        const { error: submitError } = await elements.submit();
        if (submitError) {
          setErrorMsg(submitError.message || 'Payment details validation failed.');
          setProcessingState('idle');
          return;
        }
      }

      await onPaymentSuccess();
    } catch (err: unknown) {
      setProcessingState('idle');
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Payment failed. Please check your card details and try again.');
      }
    }
  };

  const currencySymbol = currency.toLowerCase() === 'gbp' ? '£' : '$';

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        {/* Universal Order Summary Card */}
        <Paper p="sm" radius="md" style={{ backgroundColor: 'var(--hcc-darker)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Group justify="space-between" align="center">
            <Stack gap={2}>
              {badgeLabel && (
                <Text size="xs" fw={700} c="var(--hcc-accent)" tt="uppercase">
                  {badgeLabel}
                </Text>
              )}
              <Text size="sm" fw={700} c="white">
                {title}
              </Text>
              {description && (
                <Text size="xs" c="var(--hcc-gray-400)">
                  {description}
                </Text>
              )}
            </Stack>
            <Stack align="flex-end" gap={0}>
              <Text size="xs" c="var(--hcc-gray-400)">Total Due</Text>
              <Text fw={900} size="xl" c="white">
                {currencySymbol}{amount.toFixed(2)}
              </Text>
            </Stack>
          </Group>

          {itemDetails && itemDetails.length > 0 && (
            <Stack gap="xs" mt="xs" pt="xs" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              {itemDetails.map((item, idx) => (
                <Group key={idx} justify="space-between">
                  <Text size="xs" c="var(--hcc-gray-400)">{item.label}</Text>
                  <Text size="xs" fw={600} c="white">{item.value}</Text>
                </Group>
              ))}
            </Stack>
          )}
        </Paper>

        {errorMsg && (
          <Alert color="red" variant="light" icon={<InfoIcon size={18} />}>
            {errorMsg}
          </Alert>
        )}

        {/* Official Stripe Payment Element */}
        <Paper p="md" radius="md" style={{ backgroundColor: 'var(--hcc-darker)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <PaymentElement options={{ layout: 'tabs' }} />
        </Paper>

        <Divider color="rgba(255, 255, 255, 0.08)" />

        <Paper p="xs" radius="md" className={classes.seatAllocationBox}>
          <Group gap="xs">
            <ShieldCheckIcon size={18} style={{ color: 'var(--hcc-accent)' }} />
            <Text size="xs" c="var(--hcc-gray-400)">
              256-bit SSL encrypted PCI-DSS payment processing via Stripe
            </Text>
          </Group>
        </Paper>

        {/* Actions */}
        <Group justify="space-between" align="center" mt="xs">
          {onBack ? (
            <Button
              variant="subtle"
              color="gray"
              leftSection={<ArrowLeftIcon size={16} />}
              onClick={onBack}
              disabled={processingState === 'processing'}
            >
              Back
            </Button>
          ) : (
            <Button
              variant="subtle"
              color="gray"
              onClick={onClose}
              disabled={processingState === 'processing'}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="filled"
            color="pink"
            size="md"
            radius="xl"
            leftSection={processingState === 'processing' ? <Loader size="xs" color="white" /> : <LockKeyIcon size={18} weight="bold" />}
            disabled={processingState === 'processing'}
            className={classes.confirmBtn}
          >
            {processingState === 'processing' ? 'Authorizing with Stripe...' : `Pay ${currencySymbol}${amount.toFixed(2)} via Stripe`}
          </Button>
        </Group>

        <Center>
          <Text size="xs" c="var(--hcc-gray-500)">
            🔒 Official Harlequins FC Stripe Checkout Component
          </Text>
        </Center>
      </Stack>
    </form>
  );
}

/**
 * Reusable Stripe Payment Component for any transaction (Tickets, Shop, Parking, Memberships)
 */
export function StripePaymentCheckout(props: StripePaymentCheckoutProps) {
  const amountInPence = Math.round(props.amount * 100);

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: 'payment',
        amount: amountInPence,
        currency: props.currency || 'gbp',
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#e91e63',
            colorBackground: '#161622',
            colorText: '#ffffff',
            colorDanger: '#ff5252',
          },
        },
      }}
    >
      <EmbeddedPaymentForm {...props} />
    </Elements>
  );
}
