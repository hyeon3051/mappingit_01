import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position'

export type Pos = [Position, string]

export type selectedIcon = {
  color: string
  icon: string
}
export type Route = {
  id: number
  path: Pos[]
  title: string
}
// TODO endTrackingDate는 isRecord가 false일때 채워짐 true 일때는 startDate
// 위치 추적시 이름을 지정하고 움직임

export type Marker = {
  id: number
  pos: Position
  title: string
  description: string
  markerIcon: string
  markerColor: string
}

export interface LocateFile {
  title: string
  routes: Route[]
  markers: Marker[]
  isRecord: boolean
  currentRoute: Pos[]
}
