import { Link } from 'react-router-dom';
import {
  Container,
  SimpleGrid,
  Stack,
  Group,
  Text,
  Anchor,
  ActionIcon,
} from '@mantine/core';
import {
  MapPinIcon,
  EnvelopeSimpleIcon,
  PhoneIcon,
  XLogo,
  InstagramLogo,
  FacebookLogo,
  YoutubeLogo,
  TiktokLogo,
} from '@phosphor-icons/react';
import logo from '../../assets/hcclogo.png';
import classes from './SportsFooter.module.css';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'News', path: '/news' },
  { label: 'Squad', path: '/squad' },
  { label: 'Fixtures', path: '/fixtures' },
  { label: 'Stadium', path: '/stadium' },
  { label: 'Shop', path: '/shop' },
  { label: 'History', path: '/history' },
  { label: 'Join the Club', path: '/join-the-club' },
];

function SportsFooter() {
  return (
    <footer className={classes.footer}>
      {/* Gradient accent line */}
      <div className={classes.accentLine}></div>

      {/* Main footer content */}
      <Container size={1200} py="3rem" px="2rem">
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="3rem" className={classes.footerGrid}>
          {/* Brand Column */}
          <Stack gap="md">
            <Anchor component={Link} to="/" underline="never" className={classes.footerBrand}>
              <img src={logo} alt="Harlequins FC" className={classes.footerLogo} />
              <div className={classes.footerBrandText}>
                <span className={classes.footerBrandName}>HARLEQUINS FC</span>
                <span className={classes.footerBrandTagline}>The Quins. The Diamonds.</span>
              </div>
            </Anchor>
            <Text size="sm" lh={1.7} c="var(--hcc-gray-400)" maw={320}>
              Harlequins Football Club — a proud tradition of excellence, passion, and community.
              Join the Quins family and be part of something special.
            </Text>
          </Stack>

          {/* Quick Links Column */}
          <Stack gap="sm">
            <Text
              size="xs"
              fw={700}
              tt="uppercase"
              lts="2px"
              c="var(--hcc-accent)"
              mb={4}
              className={classes.columnTitle}
            >
              Quick Links
            </Text>
            {quickLinks.map((link) => (
              <Anchor
                key={link.path}
                component={Link}
                to={link.path}
                size="sm"
                c="var(--hcc-gray-400)"
                underline="never"
                className={classes.footerLink}
              >
                {link.label}
              </Anchor>
            ))}
          </Stack>

          {/* Contact Column */}
          <Stack gap="sm">
            <Text
              size="xs"
              fw={700}
              tt="uppercase"
              lts="2px"
              c="var(--hcc-accent)"
              mb={4}
              className={classes.columnTitle}
            >
              Contact Us
            </Text>

            <Group gap="sm" align="flex-start" wrap="nowrap">
              <MapPinIcon size={16} className={classes.contactIcon} />
              <Text size="sm" c="var(--hcc-gray-400)">
                Craneford Way Stadium<br />
                Craneford Way, Twickenham<br />
                Middlesex TW2 7SX
              </Text>
            </Group>

            <Group gap="sm" align="center" wrap="nowrap">
              <EnvelopeSimpleIcon size={16} className={classes.contactIcon} />
              <Text size="sm" c="var(--hcc-gray-400)">hello@harlequinsfc.co.uk</Text>
            </Group>

            <Group gap="sm" align="center" wrap="nowrap">
              <PhoneIcon size={16} className={classes.contactIcon} />
              <Text size="sm" c="var(--hcc-gray-400)">+44 20 8410 6000</Text>
            </Group>

            {/* Social Links */}
            <Stack gap="sm" mt="xs">
              <Text
                size="xs"
                fw={700}
                tt="uppercase"
                lts="2px"
                c="var(--hcc-gray-400)"
                className={classes.columnTitle}
              >
                Follow the Quins
              </Text>
              <Group gap="sm">
                <ActionIcon
                  component="a"
                  href="#"
                  variant="default"
                  size="lg"
                  radius="xl"
                  aria-label="X / Twitter"
                  className={classes.socialLink}
                >
                  <XLogo size={16} />
                </ActionIcon>
                <ActionIcon
                  component="a"
                  href="#"
                  variant="default"
                  size="lg"
                  radius="xl"
                  aria-label="Instagram"
                  className={classes.socialLink}
                >
                  <InstagramLogo size={16} />
                </ActionIcon>
                <ActionIcon
                  component="a"
                  href="#"
                  variant="default"
                  size="lg"
                  radius="xl"
                  aria-label="Facebook"
                  className={classes.socialLink}
                >
                  <FacebookLogo size={16} />
                </ActionIcon>
                <ActionIcon
                  component="a"
                  href="#"
                  variant="default"
                  size="lg"
                  radius="xl"
                  aria-label="YouTube"
                  className={classes.socialLink}
                >
                  <YoutubeLogo size={16} />
                </ActionIcon>
                <ActionIcon
                  component="a"
                  href="#"
                  variant="default"
                  size="lg"
                  radius="xl"
                  aria-label="TikTok"
                  className={classes.socialLink}
                >
                  <TiktokLogo size={16} />
                </ActionIcon>
              </Group>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>

      {/* Bottom Bar */}
      <Container size={1200} px="2rem">
        <Group
          justify="space-between"
          align="center"
          py="1rem"
          className={classes.bottomBar}
        >
          <Text size="xs" c="var(--hcc-gray-500)">
            © {new Date().getFullYear()} Harlequins FC. All Rights Reserved.
          </Text>
          <Group gap="xl">
            <Anchor href="#" size="xs" c="var(--hcc-gray-500)" underline="never" className={classes.legalLink}>
              Privacy Policy
            </Anchor>
            <Anchor href="#" size="xs" c="var(--hcc-gray-500)" underline="never" className={classes.legalLink}>
              Terms of Use
            </Anchor>
            <Anchor href="#" size="xs" c="var(--hcc-gray-500)" underline="never" className={classes.legalLink}>
              Cookie Policy
            </Anchor>
          </Group>
        </Group>
      </Container>
    </footer>
  );
}

export default SportsFooter;
