import { produce } from 'immer'
import { Pos, Route, Marker, LocateFile, FileState } from 'packages/app/types/type'
import React from 'react'

const ADD_MARKER = 'ADD_MARKER'
const REMOVE_MARKER = 'REMOVE_MARKER'
const EDIT_MARKER = 'EDIT_MARKER'
const ADD_ROUTE = 'ADD_ROUTE'
const REMOVE_ROUTE = 'REMOVE_ROUTE'
const EDIT_ROUTE = 'EDIT_ROUTE'
const APPEND_POS = 'APPEND_POS'

export const fileDispatch = React.createContext<React.Dispatch<LocateFileActions>>(() => null)
export const fileState = React.createContext<LocateFile | null>(null)

interface SetTitleAction {
  type: 'SET_TITLE'
  payload: { title: string; description: string }
}

interface SetLocationAction {
  type: 'SET_LOCATION'
  payload: { location: Pos }
}

interface AddMarkerAction {
  type: typeof ADD_MARKER
  payload: { marker: Marker }
}

interface RemoveMarkerAction {
  type: typeof REMOVE_MARKER
  payload: { markerId: number }
}

interface EditMarkerAction {
  type: typeof EDIT_MARKER
  payload: { marker: Marker; markerId: number }
}

interface AddRouteAction {
  type: typeof ADD_ROUTE
  payload: { route: Route }
}

interface RemoveRouteAction {
  type: typeof REMOVE_ROUTE
  payload: { routeId: string }
}

interface EditRouteAction {
  type: typeof EDIT_ROUTE
  payload: { route: Route; routeId: string }
}

interface appendPos {
  type: typeof APPEND_POS
  payload: { pos: Pos }
}

interface ChangeIsRecordTrueAction {
  type: 'CHANGE_IS_RECORD_TRUE'
}

interface ChangeIsRecordFalseAction {
  type: 'CHANGE_IS_RECORD_FALSE'
}

interface setDataAction {
  type: 'SET_DATA'
  payload: { data: FileState }
}

export type LocateFileActions =
  | SetTitleAction
  | { type: 'INIT' }
  | SetLocationAction
  | AddMarkerAction
  | RemoveMarkerAction
  | EditMarkerAction
  | AddRouteAction
  | RemoveRouteAction
  | EditRouteAction
  | appendPos
  | ChangeIsRecordTrueAction
  | ChangeIsRecordFalseAction
  | setDataAction

const fileReducer = (state: LocateFile, action: LocateFileActions) =>
  produce(state, (draft) => {
    switch (action.type) {
      case 'SET_TITLE':
        draft.title = action.payload.title
        draft.description = action.payload.description
        break
      case 'INIT':
        draft.title = ''
        draft.description = ''
        draft.markers = []
        draft.routes = []
        break
      case 'SET_LOCATION':
        draft.pos = action.payload.location
        break
      case 'ADD_MARKER':
        draft.markers.push(action.payload.marker)
        break
      case 'REMOVE_MARKER':
        draft.markers = draft.markers.filter(
          (marker) => marker.id !== String(action.payload.markerId)
        )
        break
      // 마커 수정
      // 1. 마커 이름, 추가 설명, 아이콘, 색상 수정
      // 2. 마커 위치 가상 이동 수정
      case 'EDIT_MARKER':
        draft.markers = draft.markers.map((marker) =>
          marker.id === action.payload.markerId ? action.payload.marker : marker
        )
        break
      case 'ADD_ROUTE':
        draft.routes.push(action.payload.route)
        draft.currentRoute = []
        break
      case 'REMOVE_ROUTE':
        draft.routes = draft.routes.filter((route) => route.id !== String(action.payload.routeId))
        break
      // 경로 수정
      // 1. 경로 이름, 추가 설명, 색상, 두께 수정
      // 2. 경로 범위 수정
      case 'EDIT_ROUTE':
        draft.routes = draft.routes.map((route) =>
          String(route.id) === action.payload.routeId ? action.payload.route : route
        )
        break
      // 위치 추적
      case 'APPEND_POS':
        draft.currentRoute.push(action.payload.pos)
        break
      case 'CHANGE_IS_RECORD_TRUE':
        draft.isRecord = true
        break
      case 'CHANGE_IS_RECORD_FALSE':
        draft.isRecord = false
        break
      case 'SET_DATA':
        return {
          ...draft,
          markers: [...draft.markers, ...action.payload.data.markers],
          routes: [...draft.routes, ...action.payload.data.routes],
        }
    }
  })

export default fileReducer
