import {useQuery} from '@tanstack/react-query'
import {fetchAndPostData} from 'util/helper-functions'
import {GET_FILE_LIST_API} from 'util/api-url'

const URL = process.env.NEXT_PUBLIC_DOMAIN + GET_FILE_LIST_API

function useMediaFilesData() {
  const {data, isLoading, isSuccess} = useQuery({
    queryKey: ['media-files-data'],
    queryFn: () => fetchAndPostData(URL),
  })

  return {data, isLoading, isSuccess}
}

export default useMediaFilesData
