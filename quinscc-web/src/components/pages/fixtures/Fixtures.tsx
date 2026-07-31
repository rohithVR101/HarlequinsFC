import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  Group,
  Stack,
  Title,
  Text,
  Badge,
  Button,
  Chip,
  Center,
  Avatar,
} from '@mantine/core';
import { MapPinIcon, TicketIcon, ArrowRightIcon } from '@phosphor-icons/react';
import { fixturesData, type Fixture } from '../../../data/fixturesData';
import logo from '../../../assets/hcclogo.png';
import classes from './Fixtures.module.css';

type MonthFilter = 'All' | 'August 2026' | 'September 2026' | 'October 2026' | 'November 2026';
type VenueFilter = 'All' | 'Home' | 'Away';
type CompetitionFilter = 'All' | 'Premier League' | 'Carabao Cup';

const monthsList: MonthFilter[] = [
  'All',
  'August 2026',
  'September 2026',
  'October 2026',
  'November 2026',
];

function TeamLogo({ name: _name, shortName, isHarlequins }: { name: string; shortName: string; isHarlequins: boolean }) {
  if (isHarlequins) {
    return <img src={logo} alt="Harlequins FC" className={classes.teamLogo} />;
  }

  return (
    <Avatar
      size={44}
      radius="xl"
      color="dark"
      className={classes.teamLogoFallback}
    >
      {shortName}
    </Avatar>
  );
}

function FixtureCard({ fixture }: { fixture: Fixture }) {
  const navigate = useNavigate();
  const isCompleted = fixture.status === 'COMPLETED';

  return (
    <Card className={classes.fixtureCard} padding="1.4rem 1.8rem" radius="md">
      {/* Left Info */}
      <Stack gap={6} className={classes.leftInfo}>
        <Text
          size="xs"
          fw={700}
          tt="uppercase"
          lts="1.5px"
          c="var(--hcc-accent)"
          className={classes.competitionTag}
        >
          {fixture.competition}
          {fixture.roundNote && ` • ${fixture.roundNote}`}
        </Text>
        <Text fw={700} size="md" c="white" className={classes.matchDate}>
          {fixture.date}
        </Text>
        <Group gap={4} wrap="nowrap">
          <MapPinIcon size={14} style={{ color: 'var(--hcc-accent)', flexShrink: 0 }} />
          <Text size="xs" c="var(--hcc-gray-400)">{fixture.venue}</Text>
        </Group>
      </Stack>

      {/* Center Matchup */}
      <Group gap="2rem" justify="center" align="center" className={classes.matchupCenter}>
        {/* Home Team */}
        <Group gap="sm" className={classes.homeTeam}>
          <Text
            fw={fixture.homeTeam.isHarlequins ? 800 : 700}
            size="lg"
            c={fixture.homeTeam.isHarlequins ? 'white' : 'var(--hcc-gray-300)'}
            tt="uppercase"
            className={classes.teamName}
          >
            {fixture.homeTeam.name}
          </Text>
          <TeamLogo
            name={fixture.homeTeam.name}
            shortName={fixture.homeTeam.shortName}
            isHarlequins={fixture.homeTeam.isHarlequins}
          />
        </Group>

        {/* Center Badge (Score or VS) */}
        {isCompleted ? (
          <Badge
            size="xl"
            radius="sm"
            variant="filled"
            color="dark"
            className={classes.scoreBadge}
          >
            {fixture.homeScore} - {fixture.awayScore}
          </Badge>
        ) : (
          <Badge
            size="lg"
            radius="sm"
            variant="light"
            color="pink"
            className={classes.vsBadge}
          >
            VS
          </Badge>
        )}

        {/* Away Team */}
        <Group gap="sm" className={classes.awayTeam}>
          <TeamLogo
            name={fixture.awayTeam.name}
            shortName={fixture.awayTeam.shortName}
            isHarlequins={fixture.awayTeam.isHarlequins}
          />
          <Text
            fw={fixture.awayTeam.isHarlequins ? 800 : 700}
            size="lg"
            c={fixture.awayTeam.isHarlequins ? 'white' : 'var(--hcc-gray-300)'}
            tt="uppercase"
            className={classes.teamName}
          >
            {fixture.awayTeam.name}
          </Text>
        </Group>
      </Group>

      {/* Right Actions */}
      <Stack align="flex-end" gap="xs" className={classes.rightActions}>
        {!isCompleted ? (
          <>
            <Text fw={800} size="lg" c="white" className={classes.matchTime}>
              {fixture.time} GMT
            </Text>
            <Button
              onClick={() => navigate('/tickets', { state: { autoBookFixtureId: fixture.id } })}
              variant="outline"
              color="pink"
              radius="xl"
              size="xs"
              leftSection={<TicketIcon size={14} weight="bold" />}
              className={classes.actionBtn}
            >
              Tickets
            </Button>
          </>
        ) : (
          <Button
            component={Link}
            to="/news"
            variant="outline"
            color="pink"
            radius="xl"
            size="xs"
            rightSection={<ArrowRightIcon size={12} weight="bold" />}
            className={classes.actionBtn}
          >
            Match Report
          </Button>
        )}
      </Stack>
    </Card>
  );
}

function Fixtures() {
  const [selectedMonth, setSelectedMonth] = useState<MonthFilter>('September 2026');
  const [selectedVenue, setSelectedVenue] = useState<VenueFilter>('All');
  const [selectedComp, setSelectedComp] = useState<CompetitionFilter>('All');

  // Filter logic
  const filteredFixtures = useMemo(() => {
    return fixturesData.filter((fix) => {
      // Month
      if (selectedMonth !== 'All' && fix.month !== selectedMonth) {
        return false;
      }
      // Venue
      if (selectedVenue === 'Home' && !fix.homeTeam.isHarlequins) {
        return false;
      }
      if (selectedVenue === 'Away' && !fix.awayTeam.isHarlequins) {
        return false;
      }
      // Competition
      if (selectedComp !== 'All' && fix.competition !== selectedComp) {
        return false;
      }
      return true;
    });
  }, [selectedMonth, selectedVenue, selectedComp]);

  // Group by month for rendering
  const groupedByMonth = useMemo(() => {
    const map: Record<string, Fixture[]> = {};
    filteredFixtures.forEach((fix) => {
      if (!map[fix.month]) {
        map[fix.month] = [];
      }
      map[fix.month].push(fix);
    });
    return map;
  }, [filteredFixtures]);

  const monthKeys = Object.keys(groupedByMonth);

  return (
    <div className={classes.fixturesPage}>
      {/* Hero Section */}
      <section className={classes.heroSection}>
        <Stack align="center" gap="xs" className={classes.heroContent}>
          <Text
            size="xs"
            fw={700}
            tt="uppercase"
            lts="3px"
            c="var(--hcc-accent)"
          >
            Harlequins FC • Premier League 2026/27
          </Text>
          <Title order={1} className={classes.heroTitle}>
            Fixtures & Results
          </Title>
          <Text size="md" c="var(--hcc-gray-400)" ta="center" maw={540}>
            Full match schedule for the Quins 2026/27 campaign.
          </Text>
        </Stack>
      </section>

      {/* Controls Bar */}
      <Container size={1200} mt="2rem" px="2rem">
        <Card className={classes.controlsBar} radius="lg" p="1rem 1.5rem">
          <Group justify="space-between" gap="1.5rem" wrap="wrap">
            {/* Month Filters */}
            <Chip.Group
              value={selectedMonth}
              onChange={(val) => setSelectedMonth(val as MonthFilter)}
            >
              <Group gap={8} wrap="wrap">
                {monthsList.map((month) => (
                  <Chip key={month} value={month} variant="filled" color="pink" className={classes.filterChip}>
                    {month === 'All' ? 'All Months' : month}
                  </Chip>
                ))}
              </Group>
            </Chip.Group>

            {/* Venue & Competition Filters */}
            <Group gap={8} wrap="wrap">
              <Chip.Group
                value={selectedVenue}
                onChange={(val) => setSelectedVenue(val as VenueFilter)}
              >
                <Group gap={8}>
                  <Chip value="Home" variant="filled" color="pink" className={classes.filterChip}>
                    Home Only
                  </Chip>
                  <Chip value="Away" variant="filled" color="pink" className={classes.filterChip}>
                    Away Only
                  </Chip>
                </Group>
              </Chip.Group>

              <Chip.Group
                value={selectedComp}
                onChange={(val) => setSelectedComp(val as CompetitionFilter)}
              >
                <Chip value="Premier League" variant="filled" color="pink" className={classes.filterChip}>
                  Premier League
                </Chip>
              </Chip.Group>
            </Group>
          </Group>
        </Card>
      </Container>

      {/* Fixtures List */}
      <Container size={1200} mt="3rem" px="2rem" pb="3rem">
        {monthKeys.length > 0 ? (
          monthKeys.map((monthName) => (
            <div key={monthName} className={classes.monthBlock}>
              <Group gap="sm" align="center" mb="1.5rem" className={classes.monthHeader}>
                <Title order={2} className={classes.monthTitle}>
                  {monthName}
                </Title>
                <Badge color="pink" variant="filled" size="md" radius="xl">
                  {groupedByMonth[monthName].length} Matches
                </Badge>
              </Group>
              <Stack gap="1.2rem">
                {groupedByMonth[monthName].map((fixture) => (
                  <FixtureCard key={fixture.id} fixture={fixture} />
                ))}
              </Stack>
            </div>
          ))
        ) : (
          <Center py="5rem">
            <Stack align="center" gap="xs">
              <Title order={3} c="white" className={classes.noResultsTitle}>
                No Fixtures Found
              </Title>
              <Text c="var(--hcc-gray-400)">
                Try clearing your month or venue filters.
              </Text>
            </Stack>
          </Center>
        )}
      </Container>
    </div>
  );
}

export default Fixtures;
