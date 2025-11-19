'use client';

import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'sonner';
import { CREATE_BUSINESS, GET_BUSINESS, UPDATE_BUSINESS } from '../apollo/queries';

export function useBusiness(slug?: string) {
  const { data, loading, error, refetch } = useQuery(GET_BUSINESS, {
    variables: { slug },
    skip: !slug,
  });

  const [createBusiness, { loading: creating }] = useMutation(CREATE_BUSINESS, {
    onCompleted: () => {
      toast.success('¡Negocio creado exitosamente!');
    },
    onError: (error) => {
      toast.error(error.message || 'Error al crear negocio');
    },
  });

  const [updateBusiness, { loading: updating }] = useMutation(UPDATE_BUSINESS, {
    onCompleted: () => {
      toast.success('Negocio actualizado');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Error al actualizar');
    },
  });

  return {
    business: data?.business,
    loading,
    error,
    createBusiness,
    updateBusiness,
    creating,
    updating,
    refetch,
  };
}
