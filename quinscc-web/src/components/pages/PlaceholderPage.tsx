import { Center, Stack, Title, Text, Divider, ThemeIcon } from '@mantine/core';
import {
  NewspaperIcon,
  PlayCircleIcon,
  MapPinIcon,
  UsersIcon,
  ClockCounterClockwiseIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  TicketIcon,
  SoccerBallIcon,
} from '@phosphor-icons/react';
import classes from './PlaceholderPage.module.css';

const sectionIcons: Record<string, React.ReactNode> = {
  News: <NewspaperIcon size={32} />,
  Videos: <PlayCircleIcon size={32} />,
  Stadium: <MapPinIcon size={32} />,
  Squad: <UsersIcon size={32} />,
  History: <ClockCounterClockwiseIcon size={32} />,
  Shop: <ShoppingCartIcon size={32} />,
  'Join the Club': <UserCircleIcon size={32} />,
  Tickets: <TicketIcon size={32} />,
};

interface PlaceholderPageProps {
  title: string;
}

function PlaceholderPage({ title }: PlaceholderPageProps) {
  const icon = sectionIcons[title] || <SoccerBallIcon size={32} />;

  return (
    <div className={classes.placeholder}>
      <Center mih="60vh" p="4rem 2rem">
        <Stack align="center" gap="md" className={classes.content}>
          <ThemeIcon
            size={80}
            radius="xl"
            variant="light"
            color="pink"
            className={classes.icon}
          >
            {icon}
          </ThemeIcon>

          <Text
            size="sm"
            fw={500}
            tt="uppercase"
            lts="3px"
            c="var(--hcc-accent)"
          >
            Coming Soon
          </Text>

          <Title
            order={1}
            tt="uppercase"
            lts="3px"
            className={classes.title}
          >
            {title}
          </Title>

          <Divider
            size="sm"
            w={60}
            className={classes.divider}
          />

          <Text
            size="md"
            c="var(--hcc-gray-400)"
            ta="center"
            maw={400}
            lh={1.7}
          >
            We're working hard to bring you the best {title.toLowerCase()} experience.
            Check back soon for updates.
          </Text>
        </Stack>
      </Center>
    </div>
  );
}

export default PlaceholderPage;
