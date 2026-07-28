import { useState, useMemo } from 'react';
import {
  Container,
  SimpleGrid,
  Card,
  Image,
  Group,
  Stack,
  Title,
  Text,
  Badge,
  TextInput,
  Chip,
  Center,
  Avatar,
} from '@mantine/core';
import { MagnifyingGlassIcon, CrownIcon } from '@phosphor-icons/react';
import { squadData, type Player } from '../../../data/squadData';
import classes from './Squad.module.css';

type PositionFilter = 'All' | 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
type RoleFilter = 'All' | 'First Team' | 'Academy Prospect';

const positionOrder: ('Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward')[] = [
  'Goalkeeper',
  'Defender',
  'Midfielder',
  'Forward',
];

const positionPlurals: Record<string, string> = {
  Goalkeeper: 'Goalkeepers',
  Defender: 'Defenders',
  Midfielder: 'Midfielders',
  Forward: 'Forwards',
};

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getImageUrl(url: string): string {
  if (url.includes('Special:FilePath')) {
    return url.replace('Special:FilePath', 'Special:Redirect/file');
  }
  return url;
}

function PlayerCard({ player }: { player: Player }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Card className={classes.playerCard} padding={0} radius="md">
      {/* Top Badges */}
      <div className={classes.topBadges}>
        <div>
          {player.role === 'Captain' && (
            <Badge
              color="yellow"
              variant="filled"
              size="xs"
              tt="uppercase"
              leftSection={<CrownIcon size={12} weight="fill" />}
              className={classes.captainBadge}
            >
              Captain
            </Badge>
          )}
          {player.role === 'Academy Prospect' && (
            <Badge color="pink" variant="filled" size="xs" tt="uppercase">
              Academy
            </Badge>
          )}
          {player.role === 'First Team' && (
            <Badge
              variant="filled"
              size="xs"
              tt="uppercase"
              className={classes.firstTeamBadge}
            >
              First Team
            </Badge>
          )}
        </div>
        {player.number && (
          <span className={classes.squadNumber}>#{player.number}</span>
        )}
      </div>

      {/* Image Container */}
      <div className={classes.imageWrapper}>
        {!imgError ? (
          <Image
            src={getImageUrl(player.photoUrl)}
            alt={player.name}
            className={classes.playerImage}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <Center className={classes.fallbackAvatar}>
            <Avatar
              size={80}
              radius="xl"
              color="pink"
              variant="transparent"
              className={classes.avatarIcon}
            >
              {getInitials(player.name)}
            </Avatar>
          </Center>
        )}
        <div className={classes.imageOverlay} />
      </div>

      {/* Footer Info */}
      <Stack gap={4} p="1rem 1.2rem 1.2rem" className={classes.cardInfo}>
        <Text
          size="xs"
          fw={700}
          tt="uppercase"
          lts="2px"
          c="var(--hcc-accent)"
          className={classes.playerPosition}
        >
          {player.position}
        </Text>
        <Title order={3} className={classes.playerName}>
          {player.name}
        </Title>
      </Stack>
    </Card>
  );
}

function Squad() {
  const [activePosition, setActivePosition] = useState<PositionFilter>('All');
  const [activeRole, setActiveRole] = useState<RoleFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter players
  const filteredPlayers = useMemo(() => {
    return squadData.filter((player) => {
      // Position filter
      if (activePosition !== 'All' && player.position !== activePosition) {
        return false;
      }
      // Role filter
      if (activeRole !== 'All') {
        if (activeRole === 'First Team' && player.role === 'Academy Prospect') {
          return false;
        }
        if (activeRole === 'Academy Prospect' && player.role !== 'Academy Prospect') {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = player.name.toLowerCase().includes(query);
        const matchesPosition = player.position.toLowerCase().includes(query);
        const matchesNumber = player.number?.toString().includes(query);
        return matchesName || matchesPosition || matchesNumber;
      }
      return true;
    });
  }, [activePosition, activeRole, searchQuery]);

  // Group filtered players by position
  const groupedPlayers = useMemo(() => {
    const map: Record<string, Player[]> = {
      Goalkeeper: [],
      Defender: [],
      Midfielder: [],
      Forward: [],
    };
    filteredPlayers.forEach((player) => {
      if (map[player.position]) {
        map[player.position].push(player);
      }
    });
    return map;
  }, [filteredPlayers]);

  const hasPlayers = filteredPlayers.length > 0;

  return (
    <div className={classes.squadPage}>
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
            Harlequins FC • 2025/26 Season
          </Text>
          <Title order={1} className={classes.heroTitle}>
            Men's First Team Squad
          </Title>
          <Text size="md" c="var(--hcc-gray-400)" ta="center" maw={540}>
            Meet the players defending the Quins diamond crest in the Premier League.
          </Text>
        </Stack>
      </section>

      {/* Controls Bar */}
      <Container size={1300} mt="2rem" px="2rem">
        <Card className={classes.controlsBar} radius="lg" p="1rem 1.5rem">
          <Group justify="space-between" gap="1.5rem" wrap="wrap">
            {/* Position Filters */}
            <Chip.Group
              value={activePosition}
              onChange={(val) => setActivePosition(val as PositionFilter)}
            >
              <Group gap={8} wrap="wrap">
                <Chip value="All" variant="filled" color="pink" className={classes.filterChip}>
                  All Positions ({squadData.length})
                </Chip>
                {positionOrder.map((pos) => {
                  const count = squadData.filter((p) => p.position === pos).length;
                  return (
                    <Chip key={pos} value={pos} variant="filled" color="pink" className={classes.filterChip}>
                      {positionPlurals[pos]} ({count})
                    </Chip>
                  );
                })}
              </Group>
            </Chip.Group>

            {/* Role & Search */}
            <Group gap={8} wrap="wrap">
              <Chip.Group
                value={activeRole}
                onChange={(val) => setActiveRole(val as RoleFilter)}
              >
                <Group gap={8}>
                  <Chip value="First Team" variant="filled" color="pink" className={classes.filterChip}>
                    First Team
                  </Chip>
                  <Chip value="Academy Prospect" variant="filled" color="pink" className={classes.filterChip}>
                    Academy
                  </Chip>
                </Group>
              </Chip.Group>

              <TextInput
                placeholder="Search player name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                leftSection={<MagnifyingGlassIcon size={18} />}
                radius="xl"
                className={classes.searchInput}
                classNames={{ input: classes.searchInputInner }}
              />
            </Group>
          </Group>
        </Card>
      </Container>

      {/* Squad Sections */}
      <Container size={1300} mt="3rem" px="2rem" pb="3rem">
        {hasPlayers ? (
          positionOrder.map((pos) => {
            const playersInPos = groupedPlayers[pos];
            if (playersInPos.length === 0) return null;

            return (
              <div key={pos} className={classes.sectionBlock}>
                <Group
                  gap="sm"
                  align="center"
                  mb="1.8rem"
                  className={classes.sectionHeader}
                >
                  <Title order={2} className={classes.sectionTitle}>
                    {positionPlurals[pos]}
                  </Title>
                  <Badge color="pink" variant="filled" size="md" radius="xl">
                    {playersInPos.length}
                  </Badge>
                </Group>

                <SimpleGrid
                  cols={{ base: 2, xs: 2, sm: 3, md: 4, lg: 4 }}
                  spacing="1.8rem"
                >
                  {playersInPos.map((player) => (
                    <PlayerCard key={player.name} player={player} />
                  ))}
                </SimpleGrid>
              </div>
            );
          })
        ) : (
          <Center py="5rem">
            <Stack align="center" gap="xs">
              <Title order={3} c="white" className={classes.noResultsTitle}>
                No Players Found
              </Title>
              <Text c="var(--hcc-gray-400)">
                Try clearing your search query or position filters.
              </Text>
            </Stack>
          </Center>
        )}
      </Container>
    </div>
  );
}

export default Squad;
