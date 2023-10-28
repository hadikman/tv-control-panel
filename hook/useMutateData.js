import axiosClient from 'util/axios-http'
import {useMutation, useQueryClient} from '@tanstack/react-query'

function useMutateData({
  mutationKey,
  //   mutationFn,
  cacheTime,
  networkMode,
  onError,
  onMutate,
  onSettled,
  //   onSuccess,
  retry,
  retryDelay,
  useErrorBoundary,
  meta,
  queryKey,
  url,
}) {
  const queryClient = useQueryClient()

  const {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isPaused,
    isSuccess,
    failureCount,
    failureReason,
    mutate,
    mutateAsync,
    reset,
    status,
  } = useMutation({
    mutationKey,
    mutationFn: item => axiosClient.post(url, item).then(res => res.data),
    cacheTime,
    networkMode,
    onError,
    onMutate,
    onSettled,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey})
    },
    retry,
    retryDelay,
    useErrorBoundary,
    meta,
  })

  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isPaused,
    isSuccess,
    failureCount,
    failureReason,
    mutate,
    mutateAsync,
    reset,
    status,
  }
}

export default useMutateData
