import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Anchor,
  Stack,
  Divider,
  ActionIcon,
  Alert,
} from '@mantine/core';
import {
  UserIcon,
  LockKeyIcon,
  WarningCircleIcon,
  FacebookLogoIcon,
  GoogleLogoIcon,
  XLogoIcon,
} from '@phosphor-icons/react';
import { useLoginMutation } from '../../../../hooks/useAuthMutations';
import type { LoginPayload } from '../../../../services/authApi';
import classes from './Login.module.css';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: login, isPending, isError, error } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    defaultValues: {
      user: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginPayload) => {
    login(data, {
      onSuccess: () => {
        const from = (location.state as { from?: string })?.from || '/';
        const autoBookFixtureId = (location.state as { autoBookFixtureId?: string })?.autoBookFixtureId;
        navigate(from, { state: { autoBookFixtureId } });
      },
    });
  };

  return (
    <div className={classes.loginPage}>
      <div className={classes.bgOverlay} />

      <Paper className={classes.glassCard} radius="lg" p="xl">
        <div className={classes.titleHeader}>
          <Title order={1} className={classes.cardTitle}>
            Get in the club!
          </Title>
          <Text size="sm" c="dimmed" mt={4}>
            Sign in to access tickets, memberships & exclusive Harlequins FC perks
          </Text>
        </div>

        {isError && (
          <Alert icon={<WarningCircleIcon size={18} />} color="red" mt="md" title="Login Failed">
            {error?.message || 'Invalid username/email or password. Please try again.'}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <Stack gap="md" mt="md">
            <TextInput
              id="username"
              label="Username or email"
              placeholder="Enter your username or email"
              error={errors.user?.message}
              leftSection={<UserIcon size={16} color="var(--hcc-gray-400)" />}
              size="md"
              classNames={{ input: classes.input, label: classes.label }}
              {...register('user', { required: 'Username is required' })}
            />

            <PasswordInput
              id="password"
              label="Password"
              placeholder="Enter your password"
              error={errors.password?.message}
              leftSection={<LockKeyIcon size={16} color="var(--hcc-gray-400)" />}
              size="md"
              classNames={{ input: classes.input, label: classes.label }}
              {...register('password', { required: 'Password is required' })}
            />

            <Group justify="space-between" mt={4}>
              <Anchor component={Link} to="#" size="xs" c="dimmed" className={classes.link}>
                Forgot password?
              </Anchor>
              <Anchor component={Link} to="/join-the-club" size="xs" c="pink.4" className={classes.link}>
                Create an account
              </Anchor>
            </Group>

            <Button
              type="submit"
              fullWidth
              size="md"
              radius="md"
              color="pink"
              loading={isPending}
              className={classes.submitBtn}
            >
              Login
            </Button>
          </Stack>
        </form>

        <Divider label="or continue with" labelPosition="center" my="lg" c="dimmed" />

        <Group justify="center" gap="md">
          <ActionIcon size="lg" radius="xl" variant="filled" color="blue" className={classes.socialBtn}>
            <FacebookLogoIcon size={20} weight="fill" />
          </ActionIcon>
          <ActionIcon size="lg" radius="xl" variant="filled" color="dark" className={classes.socialBtn}>
            <XLogoIcon size={20} weight="fill" />
          </ActionIcon>
          <ActionIcon size="lg" radius="xl" variant="filled" color="red" className={classes.socialBtn}>
            <GoogleLogoIcon size={20} weight="fill" />
          </ActionIcon>
        </Group>
      </Paper>
    </div>
  );
}

export default Login;
