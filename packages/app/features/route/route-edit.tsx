import { Button, XStack, H3, Sheet, YStack } from '@my/ui'
import TamaIcon from 'packages/app/ui/Icon'
import { useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'solito/navigation'
import { fileState, fileDispatch } from 'app/contexts/mapData/fileReducer'
import { Pos, Route } from 'packages/app/types/type'
import 'react-native-get-random-values'
import MapBoxComponent from 'packages/app/provider/MapBox'
import MapboxGL from '@rnmapbox/maps'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import { create } from 'zustand'
import MultiSlider from '@ptomasroos/react-native-multi-slider'

interface RouteState {
  start: number
  end: number
  setStart: (start: number) => void
  setEnd: (end: number) => void
}

const useRouteState = create<RouteState>((set) => ({
  start: 0,
  end: 0,
  setStart: (start) => set((state) => (state.start !== start ? { start } : state)),
  setEnd: (end) => set((state) => (state.end !== end ? { end } : state)),
}))

export function EditRoutePathView() {
  const fileInfo = useContext(fileState)
  const dispatch = useContext(fileDispatch)
  const params = useParams<{ id: number }>()
  const router = useRouter()
  const [route, setRoute] = useState<Route | undefined>(undefined)
  const { start, end, setEnd } = useRouteState()

  useEffect(() => {
    async function fetchRouteData() {
      const selectedRoute = fileInfo?.routes.find((route) => route.id === Number(params.id))
      if (selectedRoute) {
        setRoute(selectedRoute)
        setEnd(selectedRoute?.path.length - 1 ?? 0)
      }
    }
    fetchRouteData()
  }, [params.id])

  if (!route) return null
  const handleSave = () => {
    const routePath = route.path.slice(start, end)
    dispatch({
      type: 'EDIT_ROUTE',
      payload: {
        routeId: String(params.id),
        route: {
          ...route,
          path: routePath,
        },
      },
    })
    router.back()
    router.back()
  }

  return (
    <>
      <MapBoxComponent location={route?.path[0]}>
        <MapboxGL.PointAnnotation coordinate={route.path[start][0]} key={'start'} id={'start'}>
          <TamaIcon iconName="MapPin" color="$black10" size="$2" />
        </MapboxGL.PointAnnotation>
        <MapboxGL.PointAnnotation coordinate={route.path[end][0]} key={'end'} id={'end'}>
          <TamaIcon iconName="MapPin" color="$black10" size="$2" />
        </MapboxGL.PointAnnotation>
        <MapboxGL.ShapeSource
          id={'line'}
          lineMetrics={true}
          shape={{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route.path.slice(start, end).map((pos) => pos[0]) ?? [],
            },
          }}
        >
          <MapboxGL.LineLayer
            id={'line'}
            sourceID={'line'}
            style={{
              lineColor: route.lineColor,
              lineWidth: route.lineWidth,
            }}
          />
        </MapboxGL.ShapeSource>
      </MapBoxComponent>

      <XStack
        f={1}
        jc="space-between"
        ai="flex-end"
        gap="$4"
        p={2}
        w="100%"
        m={2}
        pos="absolute"
        bottom={0}
        left={0}
        right={0}
      >
        <Button
          ai="flex-start"
          icon={<TamaIcon iconName="ChevronLeft" />}
          onPress={() => {
            router.back()
          }}
        ></Button>
        <RouteSheet routeLength={route.path.length - 1} save={handleSave} />
        <Button
          ai="flex-end"
          icon={<TamaIcon iconName="ChevronRight" />}
          onPress={() => router.back()}
        ></Button>
      </XStack>
    </>
  )
}

function RouteSheet({ routeLength, save }: { routeLength: number; save: () => void }) {
  const [open, setOpen] = useState(true)
  const toggleOpen = () => setOpen(!open)
  const [position, setPosition] = useState(0)
  const { start, end, setStart, setEnd } = useRouteState()
  return (
    <>
      <Button
        size="$6"
        circular
        onPress={() => setOpen((x) => !x)}
        icon={<TamaIcon iconName={open ? 'ChevronDown' : 'ChevronUp'} color="$black10" size="$4" />}
        zIndex={3}
      ></Button>
      <Sheet
        modal
        animation="medium"
        open={open}
        onOpenChange={() => toggleOpen()}
        snapPoints={[30]}
        position={position}
        onPositionChange={setPosition}
      >
        <Sheet.Frame ai="center" gap="$5" bg="$color2" p="$2">
          <XStack gap="$4">
            <MultiSlider
              isMarkersSeparated={true}
              customMarkerLeft={() => <ChevronLeft />}
              customMarkerRight={() => <ChevronRight />}
              values={[start, end]} // 초기값을 상태로 동기화
              max={Math.max(1, routeLength)}
              onValuesChangeFinish={(values) => {
                setStart(values[0])
                setEnd(values[1])
              }}
              min={0}
              step={1}
            />
          </XStack>
          <H3>{end - start}</H3>
          <XStack>
            <Button onPress={save}>
              <TamaIcon iconName="Save" />
            </Button>
            <Button>
              <TamaIcon iconName="Delete" />
              <H3>삭제</H3>
            </Button>
          </XStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
