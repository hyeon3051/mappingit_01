import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position'

export type Pos = [Position, string]

export type selectedIcon = {
  color: string
  icon: string
}
export type Route = {
  id: string
  path: Pos[]
  title: string
  description: string
  lineWidth?: number
  lineColor?: string
  parent?: number
  delete_flag?: boolean
  isSelected?: boolean
  hashTags?: string[]
}
// TODO endTrackingDate는 isRecord가 false일때 채워짐 true 일때는 startDate
// 위치 추적시 이름을 지정하고 움직임

export type Marker = {
  id: string
  pos: Pos
  title: string
  description: string
  markerIcon: string
  markerColor: string
  imageUri?: string[]
  parent?: number
  isSelected?: boolean
  delete_flag?: boolean
  hashTags?: string[]
}

export interface LocateFile {
  title: string
  description: string
  routes: Route[]
  markers: Marker[]
  isRecord: boolean
  currentRoute: Pos[]
  pos: Pos
}

export interface File {
  id: number
  title: string
  description: string
  isSelected?: boolean
}

export interface FileState {
  id: number
  title: string
  description: string
  routes: Route[]
  markers: Marker[]
}
