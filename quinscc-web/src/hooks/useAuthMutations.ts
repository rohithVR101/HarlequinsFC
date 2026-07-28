import { useMutation } from '@tanstack/react-query';
import { loginUser, registerMember } from '../services/authApi';
import type { LoginPayload, SignUpPayload, LoginResponse, RestResponse } from '../services/authApi';
import { useAuthStore } from '../store/useAuthStore';

export const useLoginMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAuth(data.token, data.username);
    },
  });
};

export const useSignUpMutation = () => {
  return useMutation<RestResponse, Error, SignUpPayload>({
    mutationFn: registerMember,
  });
};
