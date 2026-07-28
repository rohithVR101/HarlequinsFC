import {
  Title,
  Text,
  Timeline,
  Paper,
  Badge,
  Group,
  ThemeIcon,
  Accordion,
} from '@mantine/core';
import {
  ClockCounterClockwiseIcon,
  TrophyIcon,
  FlagIcon,
  SparkleIcon,
  ShieldIcon,
} from '@phosphor-icons/react';
import classes from './History.module.css';

const timelineEras = [
  {
    period: '1880s–1990s',
    eraTitle: 'The Historical Origins',
    description:
      'Originally formed in the late 19th century by local railway workers and part-time rugby players from Harlequins RFC. They wore the famous multi-colored kit and played on local pitches in Twickenham and Hounslow. Surviving as a gritty amateur grassroots team kept alive by die-hard locals and rugby groundstaff.',
    icon: <ClockCounterClockwiseIcon size={18} />,
    color: 'pink',
  },
  {
    period: '2000s–2010s',
    eraTitle: 'The Foundation Era',
    description:
      "In the 2000s, the Harlequins Foundation officially adopted the struggling football club. Using surplus profits from the rugby team's Premiership success, the Foundation funded modern training facilities and youth academies. Harlequins FC began a steady, romantic climb up the non-league pyramid.",
    icon: <FlagIcon size={18} />,
    color: 'violet',
  },
  {
    period: '2020s–Present',
    eraTitle: 'The American Takeover & Premier League Rise',
    description:
      "The club's unique heritage, incredible multi-colored kit, and strong community foundation caught the eye of a wealthy American sports consortium. Purchasing the club and injecting Major League capital while protecting its grassroots roots, they stormed from the National League to the Premier League in just four years.",
    icon: <TrophyIcon size={18} />,
    color: 'yellow',
  },
];

const rivalriesData = [
  {
    opponent: 'Brentford FC',
    derbyName: 'The West London / Borough Derby',
    badgeColor: 'red',
    context:
      "Brentford is the historic, established football club of Hounslow, just 3–4 miles north of Twickenham across the Thames. Brentford's famous data-driven Moneyball approach vs. Harlequins' flashy, American-backed glamour project creates an intense local rivalry.",
  },
  {
    opponent: 'Hampton & Richmond Borough',
    derbyName: 'The Historic Grassroots Rival',
    badgeColor: 'pink',
    context:
      "Hampton & Richmond Borough plays at Beveree Stadium, just 2–3 miles from Twickenham. In non-league days, matches against Hampton were gritty, muddy, fiercely local affairs that older Quins fans still cherish.",
  },
  {
    opponent: 'Kingstonian FC',
    derbyName: 'The Cross-River Rival',
    badgeColor: 'cyan',
    context:
      "Kingston upon Thames borders Twickenham directly to the south. A classic North vs South of the River Thames dynamic that brings out passionate, nostalgic fans whenever drawn in cup competitions.",
  },
  {
    opponent: 'Fulham & Chelsea',
    derbyName: "The Premier League 'Big Fish' Rivals",
    badgeColor: 'blue',
    context:
      "Full Premier League clashes with West London heavyweights. Fulham brings a respectable historic rivalry, while Chelsea represents traditional global footballing aristocracy vs. Harlequins' new disruptive model.",
  },
  {
    opponent: 'Harlequins RFC',
    derbyName: "The 'Internal' Rivalry",
    badgeColor: 'grape',
    context:
      "Sharing a name, heritage, and foundation, there is an unspoken tension between code purists. Yet the Harlequins Foundation keeps them united under the shared Quins banner dominating South West London sports.",
  },
];

function History() {
  return (
    <div className={classes.historyPage}>
      {/* Hero Banner */}
      <section className={classes.heroSection}>
        <div className={classes.heroContent}>
          <span className={classes.heroTag}>Heritage • Tradition • Glory</span>
          <h1 className={classes.heroTitle}>Club History & Heritage</h1>
          <p className={classes.heroSubtitle}>
            From 19th-century railway workers to Premier League stardom. The extraordinary journey of Harlequins FC.
          </p>
        </div>
      </section>

      <div className={classes.contentContainer}>
        {/* Timeline Section using Mantine Timeline */}
        <Paper className={classes.sectionPaper} radius="lg" p="xl">
          <Group mb="xl" gap="xs">
            <ThemeIcon color="pink" size="lg" radius="xl">
              <SparkleIcon size={20} />
            </ThemeIcon>
            <div>
              <Title order={2} className={classes.sectionTitle}>
                The Timeline of Eras
              </Title>
              <Text size="sm" c="dimmed">
                Key milestones shaping the history of the Quins
              </Text>
            </div>
          </Group>

          <Timeline active={2} bulletSize={36} lineWidth={3} color="pink">
            {timelineEras.map((era, index) => (
              <Timeline.Item
                key={index}
                bullet={era.icon}
                title={
                  <Group justify="space-between" align="center" wrap="nowrap">
                    <Text fw={800} size="lg" className={classes.eraTitle}>
                      {era.eraTitle}
                    </Text>
                    <Badge color={era.color} variant="light" size="lg">
                      {era.period}
                    </Badge>
                  </Group>
                }
              >
                <Text c="gray.3" size="sm" mt={6} style={{ lineHeight: 1.7 }}>
                  {era.description}
                </Text>
              </Timeline.Item>
            ))}
          </Timeline>
        </Paper>

        {/* Rivalries Section using Mantine Accordion */}
        <Paper className={classes.sectionPaper} radius="lg" p="xl" mt="2rem">
          <Group mb="xl" gap="xs">
            <ThemeIcon color="red" size="lg" radius="xl">
              <ShieldIcon size={20} />
            </ThemeIcon>
            <div>
              <Title order={2} className={classes.sectionTitle}>
                Historic & Local Rivalries
              </Title>
              <Text size="sm" c="dimmed">
                The derbies and grudge matches defining Harlequins FC
              </Text>
            </div>
          </Group>

          <Accordion variant="separated" radius="md" defaultValue="Brentford FC">
            {rivalriesData.map((rival) => (
              <Accordion.Item key={rival.opponent} value={rival.opponent} className={classes.accordionItem}>
                <Accordion.Control>
                  <Group justify="space-between" wrap="nowrap" pr="md">
                    <Group gap="sm">
                      <ShieldIcon size={18} color="var(--hcc-accent)" />
                      <Text fw={700} size="md" c="white">
                        {rival.opponent}
                      </Text>
                    </Group>
                    <Badge color={rival.badgeColor} variant="filled" size="sm">
                      {rival.derbyName}
                    </Badge>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm" c="gray.3" style={{ lineHeight: 1.7 }}>
                    {rival.context}
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Paper>
      </div>
    </div>
  );
}

export default History;
