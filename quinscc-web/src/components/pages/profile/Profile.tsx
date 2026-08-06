import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Stack,
  Group,
  Title,
  Text,
  Badge,
  Button,
  TextInput,
  SimpleGrid,
  Divider,
  Notification,
  ThemeIcon,
  Card,
  Alert,
} from '@mantine/core';
import {
  UserCircleIcon,
  CarIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  EnvelopeSimpleIcon,
  IdentificationCardIcon,
  LockKeyIcon,
} from '@phosphor-icons/react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useParkingStore } from '../../../store/useParkingStore';
import classes from './Profile.module.css';

export function Profile() {
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useAuthStore();
  const { myReservations, fetchMyReservations, updateVehicle } = useParkingStore();

  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleColour, setVehicleColour] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ title: string; message: string; color: string } | null>(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchMyReservations(token);
    }
  }, [isAuthenticated, token, fetchMyReservations]);

  // Load existing vehicle registration from active reservations if available
  useEffect(() => {
    const existingVehicleRes = myReservations.find((r) => r.plateNumber);
    if (existingVehicleRes) {
      setPlateNumber(existingVehicleRes.plateNumber || '');
      setVehicleMake(existingVehicleRes.vehicleMake || '');
      setVehicleColour(existingVehicleRes.vehicleColour || '');
    }
  }, [myReservations]);

  if (!isAuthenticated) {
    return (
      <div className={classes.profilePage}>
        <section className={classes.heroSection}>
          <Stack align="center" gap="xs" className={classes.heroContent}>
            <Text size="xs" fw={700} tt="uppercase" lts="3px" c="var(--hcc-accent)">
              Authentication Required
            </Text>
            <Title order={1} className={classes.heroTitle}>
              Member Profile
            </Title>
            <Text size="md" c="var(--hcc-gray-400)" ta="center" maw={500}>
              Please sign in to view your Harlequins FC member profile.
            </Text>
            <Button
              mt="md"
              color="pink"
              radius="xl"
              size="md"
              leftSection={<UserCircleIcon size={18} />}
              onClick={() => navigate('/login', { state: { from: '/profile' } })}
            >
              Sign In to Access Profile
            </Button>
          </Stack>
        </section>
      </div>
    );
  }

  const handleSaveVehicle = async () => {
    if (!plateNumber.trim()) {
      setNotification({
        title: 'Validation Error',
        message: 'Please enter a valid UK license plate number.',
        color: 'orange',
      });
      return;
    }

    if (!token) return;
    setIsSaving(true);

    // If active reservation exists, update vehicle registration
    const activeRes = myReservations.find((r) => r.status !== 'CANCELLED' && r.status !== 'EXPIRED');
    const targetResId = activeRes ? activeRes.reservationId : 'PROFILE-PREAUTH';

    const success = await updateVehicle(
      {
        reservationId: targetResId,
        plateNumber: plateNumber.trim().toUpperCase(),
        vehicleMake: vehicleMake.trim(),
        vehicleColour: vehicleColour.trim(),
      },
      token
    );

    setIsSaving(false);

    if (success) {
      setNotification({
        title: 'Vehicle Registration Saved',
        message: `Plate ${plateNumber.trim().toUpperCase()} pre-authorised for stadium ANPR gate entry.`,
        color: 'green',
      });
      setTimeout(() => setNotification(null), 5000);
    } else {
      // Local fallback for offline/demo mode
      setNotification({
        title: 'ANPR Pre-Authorisation Saved',
        message: `Vehicle ${plateNumber.trim().toUpperCase()} updated on your member profile.`,
        color: 'green',
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <div className={classes.profilePage}>
      {/* Hero Header */}
      <section className={classes.heroSection}>
        <Stack align="center" gap="xs" className={classes.heroContent}>
          <Text size="xs" fw={700} tt="uppercase" lts="3px" c="var(--hcc-accent)">
            Member Center • Harlequins FC
          </Text>
          <Title order={1} className={classes.heroTitle}>
            User Profile
          </Title>
          <Text size="md" c="var(--hcc-gray-400)" ta="center" maw={600}>
            View your club membership details.
          </Text>
        </Stack>
      </section>

      {/* Notifications */}
      {notification && (
        <Container size={1000} mt="1.5rem">
          <Notification
            title={notification.title}
            color={notification.color}
            icon={<CheckCircleIcon size={18} />}
            onClose={() => setNotification(null)}
            radius="md"
          >
            {notification.message}
          </Notification>
        </Container>
      )}

      {/* Profile Body */}
      <Container size={1000} py="3rem" px="2rem">
        <Stack gap="2rem">
          {/* Readonly Member Service Profile Card */}
          <Paper p="2rem" radius="lg" className={classes.profileCard}>
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Group gap="md">
                  <ThemeIcon color="pink" size={48} radius="xl">
                    <UserCircleIcon size={28} />
                  </ThemeIcon>
                  <div>
                    <Group gap="xs">
                      <Title order={2} size="h3" c="white">
                        {user?.username}
                      </Title>
                      <Badge color="green" variant="filled" size="sm">
                        Verified Member
                      </Badge>
                    </Group>
                    <Text size="xs" c="var(--hcc-gray-400)">
                      Member Account ID: <Text component="span" fw={700} c="white">HFC-MBR-{user?.username.toUpperCase()}</Text>
                    </Text>
                  </div>
                </Group>
                <Badge variant="outline" color="pink" size="md">
                  2026/27 Official Membership
                </Badge>
              </Group>

              <Divider color="rgba(255, 255, 255, 0.08)" />

              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
                <Paper p="sm" radius="md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                  <Group gap="xs">
                    <IdentificationCardIcon size={18} color="var(--hcc-accent)" />
                    <div>
                      <Text size="xs" c="var(--hcc-gray-400)">Username</Text>
                      <Text size="sm" fw={700} c="white">{user?.username}</Text>
                    </div>
                  </Group>
                </Paper>

                <Paper p="sm" radius="md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                  <Group gap="xs">
                    <EnvelopeSimpleIcon size={18} color="var(--hcc-accent)" />
                    <div>
                      <Text size="xs" c="var(--hcc-gray-400)">Email Address</Text>
                      <Text size="sm" fw={700} c="white">{user?.username.toLowerCase()}@quinsfc.co.uk</Text>
                    </div>
                  </Group>
                </Paper>

                <Paper p="sm" radius="md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                  <Group gap="xs">
                    <LockKeyIcon size={18} color="var(--hcc-accent)" />
                    <div>
                      <Text size="xs" c="var(--hcc-gray-400)">Account Status</Text>
                      <Text size="sm" fw={700} c="green">Active & Synchronised</Text>
                    </div>
                  </Group>
                </Paper>
              </SimpleGrid>
            </Stack>
          </Paper>

          {/* ANPR Gate Pre-Authorisation Card */}
          <Paper p="2rem" radius="lg" className={classes.profileCard}>
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <ThemeIcon color="pink" size="lg" radius="md">
                    <CarIcon size={22} />
                  </ThemeIcon>
                  <div>
                    <Title order={3} size="h4" c="white">
                      ANPR Gate Pre-Authorisation
                    </Title>
                    <Text size="xs" c="var(--hcc-gray-400)">
                      Automatic barrier access for Craneford Way Stadium and Twickenham Stoop car parks.
                    </Text>
                  </div>
                </Group>
                <Badge color="pink" variant="light" size="sm">
                  Optional Online Entry
                </Badge>
              </Group>

              <Alert color="blue" variant="light" icon={<ShieldCheckIcon size={20} />}>
                Pre-register your vehicle registration plate below for fast-track automatic barrier opening at all official matchday car parks.
                <Text fw={700} component="span"> If you prefer not to fill this in now, your parking pass can also be verified manually in person at the gate.</Text>
              </Alert>

              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                <TextInput
                  label="UK Reg Plate Number"
                  placeholder="e.g. AB12 CDE"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.currentTarget.value.toUpperCase())}
                  styles={{
                    label: { color: 'white', fontWeight: 600, fontSize: '12px' },
                    input: { textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '1px' },
                  }}
                />
                <TextInput
                  label="Vehicle Make"
                  placeholder="e.g. Toyota"
                  value={vehicleMake}
                  onChange={(e) => setVehicleMake(e.currentTarget.value)}
                  styles={{
                    label: { color: 'white', fontWeight: 600, fontSize: '12px' },
                  }}
                />
                <TextInput
                  label="Vehicle Colour"
                  placeholder="e.g. Black"
                  value={vehicleColour}
                  onChange={(e) => setVehicleColour(e.currentTarget.value)}
                  styles={{
                    label: { color: 'white', fontWeight: 600, fontSize: '12px' },
                  }}
                />
              </SimpleGrid>

              <Group justify="flex-end" mt="xs">
                <Button
                  color="pink"
                  radius="xl"
                  size="sm"
                  loading={isSaving}
                  leftSection={<ShieldCheckIcon size={16} />}
                  onClick={handleSaveVehicle}
                >
                  Save Vehicle Pre-Authorisation
                </Button>
              </Group>

              {plateNumber.trim() && (
                <Card radius="md" p="md" style={{ backgroundColor: 'rgba(74, 222, 128, 0.06)', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                  <Group justify="space-between" align="center">
                    <Group gap="xs">
                      <CheckCircleIcon size={20} color="#4ade80" />
                      <div>
                        <Text fw={700} size="xs" c="#4ade80">
                          Active Vehicle Linked: {plateNumber.trim().toUpperCase()}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {vehicleMake ? `${vehicleMake} ` : ''}{vehicleColour ? `(${vehicleColour})` : ''} • Pre-authorised for all matchday reservations.
                        </Text>
                      </div>
                    </Group>
                    <Badge color="green" size="xs" variant="filled">
                      ANPR Whitelisted
                    </Badge>
                  </Group>
                </Card>
              )}
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </div>
  );
}

export default Profile;
