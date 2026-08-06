import { useEffect } from 'react';
import {
  Group,
  Stack,
  Text,
  Badge,
  Radio,
  Paper,
  Loader,
  ThemeIcon,
} from '@mantine/core';
import {
  CarIcon,
  BicycleIcon,
  MapPinIcon,
} from '@phosphor-icons/react';
import { useParkingStore } from '../../store/useParkingStore';
import type { ZoneAvailability } from '../../services/parkingApi';
import { fixturesData, isHomeMatch } from '../../data/fixturesData';

interface ParkingZoneSelectorProps {
  fixtureId: string;
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string | null) => void;
}

export function ParkingZoneSelector({
  fixtureId,
  selectedZoneId,
  onSelectZone,
}: ParkingZoneSelectorProps) {
  const { availability, fetchAvailability, isLoadingAvailability } = useParkingStore();

  useEffect(() => {
    if (fixtureId) {
      fetchAvailability(fixtureId);
    }
  }, [fixtureId, fetchAvailability]);

  const zoneList: ZoneAvailability[] = availability[fixtureId] || [];
  const isLoading = isLoadingAvailability[fixtureId];

  const handleZoneChange = (zoneId: string) => {
    if (zoneId === selectedZoneId) {
      onSelectZone(null);
    } else {
      onSelectZone(zoneId);
    }
  };

  const targetFix = fixturesData.find((f) => f.id === fixtureId);
  const isHome = targetFix ? isHomeMatch(targetFix) : true;

  if (!isHome) {
    return (
      <Paper p="md" radius="md" style={{ backgroundColor: 'rgba(0, 180, 216, 0.08)', border: '1px solid rgba(0, 180, 216, 0.3)' }}>
        <Group gap="xs">
          <MapPinIcon size={20} color="#00b4d8" />
          <div>
            <Text fw={700} size="sm" c="#00b4d8">
              Away Match — No Harlequins Stadium Parking
            </Text>
            <Text size="xs" c="dimmed">
              Official Harlequins FC car park passes (Zones A–D) are strictly available for Home fixtures at Craneford Way Stadium. For away matches, please check host venue transport guidance.
            </Text>
          </div>
        </Group>
      </Paper>
    );
  }

  if (isLoading && zoneList.length === 0) {
    return (
      <Paper p="md" radius="md" withBorder style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
        <Group justify="center" p="lg">
          <Loader size="sm" color="pink" />
          <Text size="sm" c="dimmed">Checking parking space availability...</Text>
        </Group>
      </Paper>
    );
  }

  const bookableZones = zoneList.filter((z) => z.isBookable);
  const cycleZones = zoneList.filter((z) => !z.isBookable);

  return (
    <Stack gap="md">
      <div>
        <Group justify="space-between" mb="xs">
          <Group gap="xs">
            <ThemeIcon color="pink" variant="light" size="md">
              <CarIcon size={18} />
            </ThemeIcon>
            <Text fw={700} size="sm" c="white">
              Reserved Matchday Car Parking
            </Text>
          </Group>
          <Badge variant="outline" color="pink" size="xs">
            ANPR Pre-Authorised
          </Badge>
        </Group>
        <Text size="xs" c="dimmed">
          Select an available parking zone to reserve your space for this fixture.
        </Text>
      </div>

      <Radio.Group
        value={selectedZoneId || ''}
        onChange={handleZoneChange}
      >
        <Stack gap="sm">
          {bookableZones.map((zone) => {
            const isFull = zone.availableSpaces <= 0;
            const priceDisplay =
              zone.priceMinPence === 0 || zone.priceMinPence == null
                ? 'FREE'
                : `£${(zone.priceMinPence / 100).toFixed(0)}`;

            return (
              <Paper
                key={zone.zoneId}
                p="md"
                radius="md"
                withBorder
                style={{
                  backgroundColor:
                    selectedZoneId === zone.zoneId
                      ? 'rgba(230, 0, 126, 0.1)'
                      : isFull
                      ? 'rgba(255, 255, 255, 0.02)'
                      : 'rgba(255, 255, 255, 0.04)',
                  borderColor:
                    selectedZoneId === zone.zoneId
                      ? 'var(--hcc-accent)'
                      : 'rgba(255, 255, 255, 0.1)',
                  opacity: isFull ? 0.6 : 1,
                  cursor: isFull ? 'not-allowed' : 'pointer',
                }}
                onClick={() => !isFull && handleZoneChange(zone.zoneId)}
              >
                <Group justify="space-between" wrap="nowrap" align="flex-start">
                  <Group gap="sm" wrap="nowrap">
                    <Radio value={zone.zoneId} disabled={isFull} />
                    <div>
                      <Group gap="xs">
                        <Text fw={700} size="sm" c="white">
                          {zone.zoneName}
                        </Text>
                        <Badge
                          size="xs"
                          color={isFull ? 'red' : zone.availableSpaces < 30 ? 'orange' : 'teal'}
                          variant="light"
                        >
                          {isFull ? 'SOLD OUT' : `${zone.availableSpaces} spaces left`}
                        </Badge>
                      </Group>
                      <Text size="xs" c="dimmed" mt={2}>
                        📍 {zone.location}
                      </Text>
                      <Text size="xs" c="cyan" mt={2}>
                        Eligible: {zone.eligibleTier}
                      </Text>
                    </div>
                  </Group>
                  <Text fw={800} size="sm" c="var(--hcc-accent)">
                    {priceDisplay}
                  </Text>
                </Group>
              </Paper>
            );
          })}
        </Stack>
      </Radio.Group>

      {cycleZones.length > 0 && (
        <Paper p="xs" radius="md" style={{ backgroundColor: 'rgba(74, 222, 128, 0.08)', border: '1px dashed rgba(74, 222, 128, 0.3)' }}>
          <Group gap="xs" align="flex-start">
            <BicycleIcon size={20} color="#4ade80" style={{ marginTop: 2 }} />
            <div>
              <Text fw={700} size="xs" c="#4ade80">
                Cycling to Craneford Way Stadium?
              </Text>
              <Text size="xs" c="dimmed">
                Over 450 free, secure bike racks are available at North Plaza and Twickenham Stoop overflow. No booking required!
              </Text>
            </div>
          </Group>
        </Paper>
      )}
    </Stack>
  );
}
