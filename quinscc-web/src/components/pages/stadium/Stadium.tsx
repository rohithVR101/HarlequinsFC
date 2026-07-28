import {
  Title,
  Text,
  Paper,
  Grid,
  Group,
  Stack,
  ThemeIcon,
  SimpleGrid,
  Card,
} from '@mantine/core';
import {
  MapPinIcon,
  UsersIcon,
  TrainIcon,
  LightningIcon,
  BuildingsIcon,
  CompassIcon,
} from '@phosphor-icons/react';
import classes from './Stadium.module.css';

function Stadium() {
  return (
    <div className={classes.stadiumPage}>
      {/* Hero Banner */}
      <section className={classes.heroSection}>
        <div className={classes.heroContent}>
          <span className={classes.heroTag}>Fortress • Craneford Way • Twickenham</span>
          <h1 className={classes.heroTitle}>Craneford Way Stadium</h1>
          <p className={classes.heroSubtitle}>
            The 25,000-capacity state-of-the-art home of Harlequins FC, located in the heart of South West London.
          </p>
        </div>
      </section>

      <div className={classes.contentContainer}>
        {/* Quick Stats Grid using Mantine SimpleGrid & Card */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg" mb="2rem">
          <Card className={classes.statCard} radius="md" p="lg">
            <Group gap="sm">
              <ThemeIcon color="pink" size="xl" radius="md">
                <MapPinIcon size={24} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Location
                </Text>
                <Text fw={800} size="lg" c="white" className={classes.statValue}>
                  Twickenham
                </Text>
              </div>
            </Group>
          </Card>

          <Card className={classes.statCard} radius="md" p="lg">
            <Group gap="sm">
              <ThemeIcon color="violet" size="xl" radius="md">
                <UsersIcon size={24} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Capacity
                </Text>
                <Text fw={800} size="lg" c="white" className={classes.statValue}>
                  25,000 Seats
                </Text>
              </div>
            </Group>
          </Card>

          <Card className={classes.statCard} radius="md" p="lg">
            <Group gap="sm">
              <ThemeIcon color="cyan" size="xl" radius="md">
                <TrainIcon size={24} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Transit Walk
                </Text>
                <Text fw={800} size="lg" c="white" className={classes.statValue}>
                  15 Mins
                </Text>
              </div>
            </Group>
          </Card>

          <Card className={classes.statCard} radius="md" p="lg">
            <Group gap="sm">
              <ThemeIcon color="yellow" size="xl" radius="md">
                <LightningIcon size={24} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Opened
                </Text>
                <Text fw={800} size="lg" c="white" className={classes.statValue}>
                  2021 Modern
                </Text>
              </div>
            </Group>
          </Card>
        </SimpleGrid>

        {/* Detailed Sections Grid using Mantine Grid & Paper */}
        <Grid gap="lg">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Paper className={classes.sectionPaper} radius="lg" p="xl" h="100%">
              <Group mb="md" gap="xs">
                <ThemeIcon color="pink" size="lg" radius="xl">
                  <BuildingsIcon size={20} />
                </ThemeIcon>
                <Title order={2} className={classes.sectionTitle}>
                  Development History & Heritage
                </Title>
              </Group>
              <Text c="gray.3" size="sm" style={{ lineHeight: 1.8 }}>
                Built on the historic Craneford Way Playing Fields, the state-of-the-art, 25,000-capacity ground sits
                just a 15-minute walk from Twickenham station and is located directly adjacent to the rugby club’s
                famous Twickenham Stoop.
              </Text>
              <Text c="gray.3" size="sm" mt="md" style={{ lineHeight: 1.8 }}>
                When the American consortium took over Harlequins FC in 2021, they didn't need to look far for a stadium
                site. The club had been playing on Craneford Way Playing Fields since the 1920s. As one fan put it:
                <Text component="span" fw={700} c="pink.4"> "You get two world-class stadiums for the price of one train ticket."</Text>
              </Text>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
            <Stack gap="lg" h="100%">
              <Paper className={classes.sectionPaper} radius="lg" p="xl">
                <Group mb="xs" gap="xs">
                  <ThemeIcon color="cyan" size="lg" radius="xl">
                    <CompassIcon size={20} />
                  </ThemeIcon>
                  <Title order={3} className={classes.sectionTitle}>
                    Matchday Access
                  </Title>
                </Group>
                <Text c="gray.3" size="sm" style={{ lineHeight: 1.7 }}>
                  The 15-minute walk from Twickenham station via the scenic River Crane path became a pilgrimage for
                  football fans, with the multi-colored Quins kit visible against the backdrop of both rugby stadiums.
                </Text>
              </Paper>

              <Paper className={classes.sectionPaper} radius="lg" p="xl">
                <Group mb="xs" gap="xs">
                  <ThemeIcon color="grape" size="lg" radius="xl">
                    <LightningIcon size={20} />
                  </ThemeIcon>
                  <Title order={3} className={classes.sectionTitle}>
                    Performance Hub
                  </Title>
                </Group>
                <Text c="gray.3" size="sm" style={{ lineHeight: 1.7 }}>
                  The <b>'Harlequins Performance Hub'</b> in Hounslow is shared with the rugby and foundation youth
                  setups, providing high-performance recovery, analytics, and elite pitch training.
                </Text>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
}

export default Stadium;
