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
}
// TODO endTrackingDate는 isRecord가 false일때 채워짐 true 일때는 startDate
// 위치 추적시 이름을 지정하고 움직임

export type Marker = {
  id: string
  pos: Position
  title: string
  description: string
  markerIcon: string
  markerColor: string
}

export interface LocateFile {
  title: string
  description: string
  routes: Route[]
  markers: Marker[]
  isRecord: boolean
  currentRoute: Pos[]
}

export interface File {
  id: string
  title: string
  description: string
}

export interface FileState {
  id: string
  title: string
  description: string
  routes: Route[]
  markers: Marker[]
}
