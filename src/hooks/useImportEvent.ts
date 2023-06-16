import React from 'react'

import { listen } from '@tauri-apps/api/event'

import ImportFile from '@/modals/ImportFile/ImportFile'
import useModalStore from '@/store/modal/modalStore'

const useImportEvent = () => {
  const { openModal } = useModalStore()

  React.useEffect(() => {
    listen('open_import', () => {
      openModal({
        component: ImportFile,
        config: {
          closeOnClickOutside: false,
          closeOnEscapeKeydown: true,
          size: 'lg'
        }
      })   
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export default useImportEvent