import { Button, XStack, H3, Sheet } from '@my/ui'
import TamaIcon from 'packages/app/ui/Icon'
import { useContext, useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'solito/navigation'
import { fileState, fileDispatch } from 'packages/app/contexts/mapData/fileReducer'
import { Route } from 'packages/app/types/type'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import MapBoxComponent from 'packages/app/provider/MapBox'
import MapboxGL from '@rnmapbox/maps'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import { create } from 'zustand'
import MultiSlider from '@ptomasroos/react-native-multi-slider'

interface RouteState {
  route: Route
  updateRoute: (route: Route) => void
}

const useRouteState = create<RouteState>((set) => ({
  route: {
    id: 'current',
    title: '',
    description: '',
    path: [],
    lineWidth: 3,
    lineColor: '#fbfbfb',
  },
  updateRoute(route) {
    set({ route })
  },
}))

export function EditRoutePathView() {
  const fileInfo = useContext(fileState)
  const dispatch = useContext(fileDispatch)
  const params = useParams<{ id: string }>()
  const routeIdx = params.id ? parseInt(params.id) - 1 : -1
  const { route, updateRoute } = useRouteState()

  useEffect(() => {
    const selectedRoute = fileInfo?.routes[routeIdx]
    if (!selectedRoute) return
    const { id, title, description, lineColor, lineWidth, path } = selectedRoute
    updateRoute({
      id: id,
      title: title,
      description: description,
      path: path,
      lineColor: lineColor,
      lineWidth: lineWidth,
    })
  }, [routeIdx])
  const startPos = route.path.length > 0 ? route.path[0] : fileInfo?.pos?.[0]
  const endPos = route.path.length > 0 ? route.path[route.path.length - 1] : fileInfo?.pos?.[0]

  const router = useRouter()
  return (
    <>
      <MapBoxComponent
        location={routeIdx && startPos ? startPos : (fileInfo?.pos as [Position, string])}
        zoomLevel={15}
      >
        <MapboxGL.PointAnnotation
          coordinate={startPos?.[0]}
          key={String(routeIdx)}
          id={String(routeIdx)}
        >
          <TamaIcon iconName="MapPin" color="$black10" size="$2" />
        </MapboxGL.PointAnnotation>
        <MapboxGL.PointAnnotation
          coordinate={endPos?.[0]}
          key={`end-${routeIdx}`}
          id={`end-${routeIdx}`}
        >
          <TamaIcon iconName="MapPin" color="$black10" size="$2" />
        </MapboxGL.PointAnnotation>
        <MapboxGL.ShapeSource
          id={'line' + String(routeIdx)}
          lineMetrics={true}
          shape={{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route.path.map((pos) => pos[0]),
            },
          }}
        >
          <MapboxGL.LineLayer
            id="lineIdx"
            sourceID="shapeSource"
            style={{
              lineColor: route.lineColor,
              lineWidth: route.lineWidth,
            }}
          />
        </MapboxGL.ShapeSource>
      </MapBoxComponent>

      <XStack f={1} jc="space-between" ai="flex-end" gap="$4" p={2} w="100%" m={2}>
        <Button icon={<TamaIcon iconName="ChevronLeft" />} onPress={() => router.back()}></Button>
        <RouteSheet />
      </XStack>
    </>
  )
}

function RouteSheet() {
  const [open, setOpen] = useState(true)
  const toggleOpen = useCallback(() => setOpen((prev) => !prev), [])
  const [position, setPosition] = useState(0)
  const { route, updateRoute } = useRouteState()
  return (
    <>
      <Button
        size="$6"
        icon={<TamaIcon iconName={open ? 'ChevronDown' : 'ChevronUp'} color="$black10" size="$4" />}
        circular
        onPress={() => setOpen((x) => !x)}
      />
      <Sheet
        modal
        animation="medium"
        open={open}
        onOpenChange={() => toggleOpen()}
        snapPoints={[60]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Frame ai="center" gap="$5" bg="$color2" p="$2">
          <XStack gap="$4">
            <MultiSlider
              isMarkersSeparated={true}
              customMarkerLeft={() => <ChevronLeft />}
              customMarkerRight={() => <ChevronRight />}
              values={[0, route.path.length]}
              max={Math.max(1, route.path.length)}
              min={0}
              step={1}
            />
          </XStack>
          <H3>{route.path.length}</H3>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
