import { invoke } from '@tauri-apps/api'

export interface IDraw {
    id: string
    name: string
    elements?: Record<string, unknown>[]
}

export interface IBackendResponse<T> {
    error?: string
    data?: T
}

const createDraw = async (newDraw: Omit<IDraw, 'id'>): Promise<IBackendResponse<string>> => {
  const result = await invoke('create_draw_command', {
    name: newDraw.name,
    elementsMeta: JSON.stringify(newDraw.elements || [])
  })

  return JSON.parse(result as string)
}

const updateDraw = async (id: string, draw: Omit<IDraw, 'id'>): Promise<IBackendResponse<boolean>> => {
  const result = await invoke('update_draw_command', {
    drawId: id,
    name: draw.name,
    elementsMeta: JSON.stringify(draw.elements || [])
  })

  return JSON.parse(result as string)
}
const deleteDraw = async (id: string): Promise<IBackendResponse<boolean>> => {
  const result = await invoke('delete_draw_command', {
    drawId: id,
  })

  return JSON.parse(result as string)
}

const findDraws = async (): Promise<IBackendResponse<IDraw[]>> => {
  const result = await invoke('find_all_draws_command')

  return JSON.parse(result as string)
}

const findOneDraw = async (id: string): Promise<IBackendResponse<IDraw>> => {
  const result = await invoke('find_one_draw_command', {
    drawId: id,
  })

  return JSON.parse(result as string)
}

export default {
  createDraw,
  updateDraw,
  deleteDraw,
  findDraws,
  findOneDraw
}