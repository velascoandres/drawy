import { invoke } from '@tauri-apps/api'

export interface IDraw {
    id: string
    name: string
    scene?: Record<string, unknown>
}

export interface IRawDraw {
  id: string
  name: string
  raw_elements?: string
}

export interface IDrawInfo {
  id: string
  name: string
  description?: string
}

export interface IBackendResponse<T> {
    error?: string
    data?: T
}

export interface IPaginatedResponseRaw<T> extends IBackendResponse<T> {
  count: number
  total_pages: number
}

export interface IPaginatedResponse<T> {
  results: T[]
  count: number
  totalPages: number
  error?: string
}

export interface IUpdateDraw {
  id: string
  name?: string
  description?: string
  scene?: Record<string, unknown>
} 

const createDraw = async (newDraw: Omit<IDraw, 'id'>): Promise<IBackendResponse<string>> => {
  const result = await invoke('create_draw_command', {
    name: newDraw.name,
    elementsMeta: JSON.stringify(newDraw.scene || {})
  })

  return JSON.parse(result as string)
}

const updateDraw = async (id: string, draw: IUpdateDraw): Promise<IBackendResponse<boolean>> => {
  const result = await invoke('update_draw_command', {
    drawId: id,
    name: draw.name,
    description: draw.description,
    elementsMeta: draw.scene ? JSON.stringify(draw.scene) : null
  })

  return JSON.parse(result as string)
}
const deleteDraw = async (id: string): Promise<IBackendResponse<boolean>> => {
  const result = await invoke('delete_draw_command', {
    drawId: id,
  })

  return JSON.parse(result as string)
}

const findDraws = async (): Promise<IBackendResponse<IRawDraw[]>> => {
  const result = await invoke('find_all_draws_command')

  return JSON.parse(result as string)
}

const findOneDraw = async (id: string): Promise<IBackendResponse<IRawDraw>> => {
  const result = await invoke('find_one_draw_command', {
    drawId: id,
  })

  return JSON.parse(result as string)
}

const findDrawsInfo = async (offset: number): Promise<IPaginatedResponseRaw<IDrawInfo[]>> => {
  const result = await invoke('find_info_draws_command', {
    offset,
  })

  return JSON.parse(result as string)
}

export default {
  createDraw,
  updateDraw,
  deleteDraw,
  findDraws,
  findOneDraw,
  findDrawsInfo
}