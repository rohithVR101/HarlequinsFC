import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Group,
  Burger,
  Menu,
  Drawer,
  Button,
  UnstyledButton,
  Text,
  Stack,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  TicketIcon,
  SignOutIcon,
  UserIcon,
  CaretDownIcon,
} from '@phosphor-icons/react';
import logo from '../../assets/hcclogo.png';
import { useAuthStore } from '../../store/useAuthStore';
import classes from './SportsNavbar.module.css';

interface NavItem {
  label: string;
  path: string;
}

const baseNavItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'News', path: '/news' },
  { label: 'Videos', path: '/videos' },
  { label: 'Fixtures', path: '/fixtures' },
  { label: 'Stadium', path: '/stadium' },
  { label: 'Squad', path: '/squad' },
  { label: 'History', path: '/history' },
  { label: 'Shop', path: '/shop' },
];

function SportsNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, user, logout } = useAuthStore();

  const navItems: NavItem[] = [
    ...baseNavItems,
    isAuthenticated
      ? { label: 'Tickets', path: '/tickets' }
      : { label: 'Join the Club', path: '/join-the-club' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    closeDrawer();
  }, [location.pathname, closeDrawer]);

  const handleNavClick = (path: string) => {
    navigate(path);
    closeDrawer();
  };

  const handleLogout = () => {
    logout();
    closeDrawer();
    navigate('/');
  };

  return (
    <>
      <nav
        className={`${classes.navbar} ${scrolled ? classes.navbarSolid : classes.navbarTransparent}`}
      >
        {/* Brand */}
        <Link to="/" className={classes.brand}>
          <img src={logo} alt="Harlequins FC Logo" className={classes.logo} />
          <div className={classes.brandText}>
            <span className={classes.brandName}>HARLEQUINS FC</span>
            <span className={classes.brandTagline}>The Quins. The Diamonds.</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <Group gap={0} className={classes.navLinks}>
          {navItems.map((item) => (
            <UnstyledButton
              key={item.path}
              component={Link}
              to={item.path}
              className={`${classes.navLink} ${
                location.pathname === item.path ? classes.navLinkActive : ''
              }`}
            >
              {item.label}
            </UnstyledButton>
          ))}
        </Group>

        {/* Action Button & Hamburger */}
        <Group gap="sm" className={classes.navActions}>
          {isAuthenticated ? (
            <Menu
              shadow="xl"
              width={200}
              position="bottom-end"
              offset={10}
              transitionProps={{ transition: 'pop-top-right', duration: 200 }}
              classNames={{
                dropdown: classes.userMenuDropdown,
                item: classes.userMenuItem,
                divider: classes.userMenuDivider,
              }}
            >
              <Menu.Target>
                <UnstyledButton className={classes.userMenuBtn}>
                  <UserIcon size={16} weight="bold" />
                  <Text component="span" className={classes.usernameText}>
                    Hi, {user?.username}
                  </Text>
                  <CaretDownIcon size={12} weight="bold" className={classes.caret} />
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label className={classes.userMenuLabel}>
                  <Text size="xs" c="var(--hcc-gray-400)" tt="uppercase" lts="1px" fw={600}>
                    Signed in as
                  </Text>
                  <Text size="sm" c="white" fw={700} className={classes.userMenuName}>
                    {user?.username}
                  </Text>
                </Menu.Label>

                <Menu.Divider />

                <Menu.Item
                  leftSection={<UserIcon size={16} weight="bold" />}
                  onClick={() => navigate('/profile')}
                >
                  Profile
                </Menu.Item>

                <Menu.Item
                  leftSection={<TicketIcon size={16} weight="bold" />}
                  onClick={() => navigate('/my-tickets')}
                >
                  My Tickets
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                  color="red"
                  leftSection={<SignOutIcon size={16} weight="bold" />}
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Button
              component={Link}
              to="/login"
              variant="outline"
              color="pink"
              radius="xl"
              size="xs"
              leftSection={<TicketIcon size={14} weight="bold" />}
              className={classes.ticketsBtn}
            >
              TICKETS
            </Button>
          )}

          <Burger
            opened={drawerOpened}
            onClick={drawerOpened ? closeDrawer : openDrawer}
            size="sm"
            color="white"
            aria-label="Toggle menu"
            className={classes.hamburger}
          />
        </Group>
      </nav>

      {/* Mobile Drawer Menu */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding={0}
        withCloseButton={false}
        classNames={{ body: classes.drawerBody, content: classes.drawerContent }}
        transitionProps={{ transition: 'fade', duration: 250 }}
        zIndex={1050}
      >
        <Stack
          align="center"
          justify="center"
          h="100%"
          gap={0}
        >
          {navItems.map((item) => (
            <UnstyledButton
              key={item.path}
              className={`${classes.mobileNavLink} ${
                location.pathname === item.path ? classes.mobileNavLinkActive : ''
              }`}
              onClick={() => handleNavClick(item.path)}
            >
              {item.label}
            </UnstyledButton>
          ))}

          {isAuthenticated ? (
            <Stack align="center" gap="sm" mt="xl" w="100%">
              <Divider w="60%" color="rgba(255,255,255,0.08)" />
              <UnstyledButton
                className={`${classes.mobileNavLink} ${classes.mobileUserItem}`}
                onClick={() => handleNavClick('/profile')}
              >
                <UserIcon size={18} weight="bold" />
                PROFILE ({user?.username})
              </UnstyledButton>
              <UnstyledButton
                className={`${classes.mobileNavLink} ${classes.mobileLogout}`}
                onClick={handleLogout}
              >
                <SignOutIcon size={18} weight="bold" />
                LOGOUT
              </UnstyledButton>
            </Stack>
          ) : (
            <UnstyledButton
              className={`${classes.mobileNavLink} ${classes.mobileTickets}`}
              onClick={() => handleNavClick('/login')}
            >
              <TicketIcon size={16} weight="bold" />
              TICKETS
            </UnstyledButton>
          )}
        </Stack>
      </Drawer>
    </>
  );
}

export default SportsNavbar;
