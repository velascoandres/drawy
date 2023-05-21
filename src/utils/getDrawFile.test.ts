import { expect, it, type Mock, vi } from 'vitest'

import { open } from '@tauri-apps/api/dialog'
import { readTextFile } from '@tauri-apps/api/fs'
import { homeDir } from '@tauri-apps/api/path'

import getDrawFiles from './getDrawFiles'

vi.mock('@tauri-apps/api/dialog')
vi.mock('@tauri-apps/api/path')
vi.mock('@tauri-apps/api/fs')


const readTextFileMock = readTextFile as Mock
const homeDirMock = homeDir as Mock
const openMock = open as Mock

const draw = {
  name: 'test-name',
  scene: []
}

const rawDraw = JSON.stringify(draw)


beforeEach(() => {
  readTextFileMock.mockResolvedValue(rawDraw)
  homeDirMock.mockResolvedValue('/test-dir')
  openMock.mockResolvedValue(['/test-dir/path-1', '/test-dir/path-2'])
})

it('should return a list of files', async () => {

  const files = await getDrawFiles({ multiple: true })
      
  expect(files).toHaveLength(2)
      
  expect(files).toEqual([draw, draw])
})
      
it('should return a list of one file', async () => {
  openMock.mockResolvedValue('/test-dir/path-1')
      
  const file = await getDrawFiles()
        
  expect(file).toMatchObject(draw)
})

it('should return an empty list', async () => {
  readTextFileMock.mockResolvedValue('{brokenJSON}')
  const files = await getDrawFiles()
          
  expect(files).toHaveLength(0)
})
