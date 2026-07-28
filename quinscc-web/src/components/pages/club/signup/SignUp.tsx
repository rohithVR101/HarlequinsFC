import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
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
  SimpleGrid,
  Alert,
} from '@mantine/core';
import {
  FacebookLogo,
  XLogo,
  GoogleLogo,
  UserIcon,
  EnvelopeSimpleIcon,
  LockKeyIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react';
import { useSignUpMutation } from '../../../../hooks/useAuthMutations';
import type { SignUpPayload } from '../../../../services/authApi';
import classes from './SignUp.module.css';

interface SignUpFormData extends SignUpPayload {
  confirmPassword: string;
}

function SignUp() {
  const navigate = useNavigate();
  const { mutate: registerMember, isPending, isError, error } = useSignUpMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: {
      phoneNumber: '',
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = (data: SignUpFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword: _, ...payload } = data;
    registerMember(payload, {
      onSuccess: () => {
        navigate('/login');
      },
    });
  };

  return (
    <div className={classes.signUpPage}>
      <div className={classes.bgOverlay} />

      <Paper className={classes.glassCard} radius="lg" p="xl">
        <div className={classes.titleHeader}>
          <Title order={1} className={classes.cardTitle}>
            Join the club now!
          </Title>
          <Text size="sm" c="dimmed" mt={4}>
            Become an official Harlequins FC member & unlock exclusive club privileges
          </Text>
        </div>

        {isError && (
          <Alert icon={<WarningCircleIcon size={18} />} color="red" mt="md" title="Registration Failed">
            {error?.message || 'Failed to create account. Please check your details and try again.'}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <Stack gap="md" mt="md">
            {/* Phone Number */}
            <TextInput
              id="phoneNumber"
              type="tel"
              label="Enter your phone number"
              placeholder="1234567890"
              leftSection={<span className={classes.phonePrefix}>+91</span>}
              error={errors.phoneNumber?.message}
              size="md"
              classNames={{ input: classes.input, label: classes.label }}
              {...register('phoneNumber', {
                required: 'Phone number is required',
                pattern: { value: /^[0-9]{10}$/, message: 'Phone number must be exactly 10 digits' },
              })}
            />

            {/* First & Last Name */}
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                id="firstName"
                label="First Name"
                placeholder="John"
                error={errors.firstName?.message}
                size="md"
                classNames={{ input: classes.input, label: classes.label }}
                {...register('firstName', { required: 'First name is required' })}
              />

              <TextInput
                id="lastName"
                label="Last Name"
                placeholder="Doe"
                error={errors.lastName?.message}
                size="md"
                classNames={{ input: classes.input, label: classes.label }}
                {...register('lastName', { required: 'Last name is required' })}
              />
            </SimpleGrid>

            {/* Username */}
            <TextInput
              id="userName"
              label="Username"
              placeholder="quin_fan_99"
              leftSection={<UserIcon size={16} color="var(--hcc-gray-400)" />}
              error={errors.userName?.message}
              size="md"
              classNames={{ input: classes.input, label: classes.label }}
              {...register('userName', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
              })}
            />

            {/* Email */}
            <TextInput
              id="email"
              type="email"
              label="Email"
              placeholder="john@example.com"
              leftSection={<EnvelopeSimpleIcon size={16} color="var(--hcc-gray-400)" />}
              error={errors.email?.message}
              size="md"
              classNames={{ input: classes.input, label: classes.label }}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' },
              })}
            />

            {/* Password */}
            <PasswordInput
              id="password"
              label="Password"
              placeholder="At least 8 characters"
              leftSection={<LockKeyIcon size={16} color="var(--hcc-gray-400)" />}
              error={errors.password?.message}
              size="md"
              classNames={{ input: classes.input, label: classes.label }}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              })}
            />

            {/* Confirm Password */}
            <PasswordInput
              id="confirmPassword"
              label="Confirm Password"
              placeholder="Re-enter password"
              leftSection={<LockKeyIcon size={16} color="var(--hcc-gray-400)" />}
              error={errors.confirmPassword?.message}
              size="md"
              classNames={{ input: classes.input, label: classes.label }}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
            />

            <Text size="xs" c="dimmed" ta="center" mt={2}>
              Already part of the club?{' '}
              <Anchor component={Link} to="/login" c="pink.4" className={classes.link}>
                Sign in
              </Anchor>
            </Text>

            <Button
              type="submit"
              fullWidth
              size="md"
              radius="md"
              color="pink"
              loading={isPending}
              className={classes.submitBtn}
            >
              Sign Up
            </Button>
          </Stack>
        </form>

        <Divider label="or sign up with" labelPosition="center" my="lg" c="dimmed" />

        <Group justify="center" gap="md">
          <ActionIcon size="lg" radius="xl" variant="filled" color="blue" className={classes.socialBtn}>
            <FacebookLogo size={20} weight="fill" />
          </ActionIcon>
          <ActionIcon size="lg" radius="xl" variant="filled" color="dark" className={classes.socialBtn}>
            <XLogo size={20} weight="fill" />
          </ActionIcon>
          <ActionIcon size="lg" radius="xl" variant="filled" color="red" className={classes.socialBtn}>
            <GoogleLogo size={20} weight="fill" />
          </ActionIcon>
        </Group>
      </Paper>
    </div>
  );
}

export default SignUp;
