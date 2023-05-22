import { open } from '@tauri-apps/api/dialog'
import { readTextFile } from '@tauri-apps/api/fs'
import { homeDir } from '@tauri-apps/api/path'


export interface IEntryFile {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any
}

interface IOptions {
  multiple?: boolean
}

const parseFiles = (files: string[]): IEntryFile[] => {
  const parsedFiles = []

  for (const file of files) {
    const parsedFile = parseFile(file)


    if (!parsedFile) {
      continue
    }

    parsedFiles.push(parsedFile)
  }

  return parsedFiles
}

const parseFile = (file: string): IEntryFile | null => {
  try {
    return JSON.parse(file)
  } catch {
    return null
  }
}


const getDrawFiles = async (args?: IOptions): Promise<IEntryFile[] | IEntryFile | undefined> => {
  const { multiple = false } = args || {}

  const basePath = await homeDir()

  const paths = await open({
    multiple,
    defaultPath: basePath,
    filters: [{ name: 'json', extensions: ['json'] }],
  })

  if (!paths) {
    return
  }

  const files = []

  if (typeof paths === 'string') {
    const file = await readTextFile(paths)
    const [parsed] = parseFiles([file])

    return parsed as IEntryFile | undefined
  }

  for (const path of paths) {
    const file = await readTextFile(path)


    files.push(file)
  }

  return parseFiles(files)
}


export default getDrawFiles
