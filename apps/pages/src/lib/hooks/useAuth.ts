'use client';

import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LOGIN, SIGNUP, GET_ME } from '../apollo/queries';

export function useAuth() {
  const router = useRouter();

  const { data: meData, loading: meLoading, refetch: refetchMe } = useQuery(GET_ME, {
    skip: typeof window === 'undefined' || !localStorage.getItem('token'),
  });

  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.login.accessToken);
      toast.success('¡Bienvenido de vuelta!');
      router.push('/dashboard');
    },
    onError: (error) => {
      toast.error(error.message || 'Error al iniciar sesión');
    },
  });

  const [signupMutation, { loading: signupLoading }] = useMutation(SIGNUP, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.signup.accessToken);
      toast.success('¡Cuenta creada exitosamente!');
      router.push('/dashboard');
    },
    onError: (error) => {
      toast.error(error.message || 'Error al crear cuenta');
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation({
      variables: {
        input: { email, password },
      },
    });
  };

  const signup = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    phone?: string;
    acquiredBy?: string;
    acquiredVia?: string;
    acquiredFrom?: string;
  }) => {
    await signupMutation({
      variables: {
        input: data,
        tenantId: 'publicadis',
      },
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    toast.success('Sesión cerrada');
    router.push('/');
  };

  return {
    user: meData?.me,
    loading: meLoading || loginLoading || signupLoading,
    login,
    signup,
    logout,
    refetchMe,
    isAuthenticated: !!meData?.me,
  };
}
