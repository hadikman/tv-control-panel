import axiosClient from 'util/axios-http'
import {useMutation, useQueryClient} from '@tanstack/react-query'

function useMutateData({
  queryKey,
  url,
  axiosConfig,
  mutationKey,
  mutationFn,
  cacheTime,
  networkMode,
  onError,
  onMutate,
  onSettled,
  onSuccess,
  retry,
  retryDelay,
  useErrorBoundary,
  meta,
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
    mutationFn:
      mutationFn ||
      (body => axiosClient.post(url, body, axiosConfig).then(res => res.data)),
    cacheTime,
    networkMode,
    onError,
    onMutate,
    onSettled,
    onSuccess:
      onSuccess ||
      (() => {
        queryClient.invalidateQueries({queryKey})
      }),
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
