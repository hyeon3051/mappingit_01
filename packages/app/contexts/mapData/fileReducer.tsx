import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position'
import { produce } from 'immer'
import { Pos, Route, Marker, LocateFile } from 'packages/app/types/type'

const ADD_MARKER = 'ADD_MARKER'
const REMOVE_MARKER = 'REMOVE_MARKER'
const EDIT_MARKER = 'EDIT_MARKER'
const ADD_ROUTE = 'ADD_ROUTE'
const REMOVE_ROUTE = 'REMOVE_ROUTE'
const EDIT_ROUTE = 'EDIT_ROUTE'
const APPEND_POS = 'APPEND_POS'

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
  payload: { routeIdRef: number }
}

interface RemoveRouteAction {
  type: typeof REMOVE_ROUTE
  payload: { routeId: number }
}

interface EditRouteAction {
  type: typeof EDIT_ROUTE
  payload: { route: Route; routeId: number }
}

interface appendPos {
  type: typeof APPEND_POS
  payload: { pos: Pos }
}

export type LocateFileActions =
  | AddMarkerAction
  | RemoveMarkerAction
  | EditMarkerAction
  | AddRouteAction
  | RemoveRouteAction
  | EditRouteAction
  | appendPos

const fileReducer = (state: LocateFile, action: LocateFileActions) =>
  produce(state, (draft) => {
    switch (action.type) {
      case 'ADD_MARKER':
        draft.markers.push(action.payload.marker)
        break
      case 'REMOVE_MARKER':
        draft.markers = draft.markers.filter((marker) => marker.id == action.payload.markerId)
        break
      case 'EDIT_MARKER':
        draft.markers = draft.markers.map((marker) =>
          marker.id === action.payload.markerId ? action.payload.marker : marker
        )
        break
      case 'ADD_ROUTE':
        draft.routes.push({ id: action.payload.routeIdRef, path: draft.currentRoute, title: '' })
        draft.currentRoute = []

        break
      case 'REMOVE_ROUTE':
        draft.routes = draft.routes.filter((route) => route.id == action.payload.routeId)
        break
      case 'EDIT_ROUTE':
        draft.routes = draft.routes.map((route) =>
          route.id === action.payload.routeId ? action.payload.route : route
        )
        break
      case 'APPEND_POS':
        draft.currentRoute.push(action.payload.pos)
        break
    }
  })

export default fileReducer
