import {
  Button,
  XStack,
  YStack,
  Input,
  TextArea,
  H3,
  H6,
  H5,
  useToastController,
  Square,
  Slider,
  SliderProps,
  Separator,
} from '@my/ui'
import TamaIcon from 'packages/app/ui/Icon'
import { useContext, useEffect, useState } from 'react'
import { useParams, useRouter } from 'solito/navigation'
import { fileState, fileDispatch } from 'packages/app/contexts/mapData/fileReducer'
import { Route } from 'packages/app/types/type'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import MapBoxComponent from 'packages/app/provider/MapBox'
import MapboxGL from '@rnmapbox/maps'

export function EditRoutePathView() {
  const fileInfo = useContext(fileState)
  const dispatch = useContext(fileDispatch)
  const params = useParams<{ id: string }>()
  const routeIdx = params.id ? parseInt(params.id) - 1 : -1
  const [routeInfo, setRouteInfo] = useState<Route>({
    id: uuidv4(),
    title: '',
    description: '',
    path: fileInfo?.currentRoute || [],
    lineWidth: 3,
    lineColor: '#fbfbfb',
  })
  
  useEffect(() => {
    const selectedRoute = fileInfo?.routes[routeIdx]
    if (!selectedRoute) return;
    const { id, title, description, lineColor, lineWidth, path } = selectedRoute
    setRouteInfo((prev) => ({
      ...prev,
      id: id,
      title: title,
      description: description,
      path: path,
      lineColor: lineColor,
      lineWidth: lineWidth,
    }))

  }, [routeIdx])
  const startPos = routeInfo.path.length > 0 ? routeInfo.path[0] : fileInfo?.pos[0]
  const endPos = routeInfo.path.length > 0 ? routeInfo.path[routeInfo.path.length - 1] : fileInfo?.pos[0]

  const router = useRouter()
  return (
    <>
        <MapBoxComponent location={routeIdx && startPos ? startPos : (fileInfo?.pos as [Position, string])} zoomLevel={15}>
          <MapboxGL.PointAnnotation
            coordinate={startPos[0]}
            key={String(routeIdx)}
            id={String(routeIdx)}
          >
            <TamaIcon iconName="MapPin" color="$black10" size="$2" />
          </MapboxGL.PointAnnotation>
          <MapboxGL.PointAnnotation
            coordinate={endPos[0]}
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
                coordinates: routeInfo.path.map((pos) => pos[0]),
              },
            }}
          >
        <MapboxGL.LineLayer
          id="lineIdx"
          sourceID="shapeSource"
              style={{
                lineColor: routeInfo.lineColor,
                lineWidth: routeInfo.lineWidth,
              }}
            />
          </MapboxGL.ShapeSource>
        </MapBoxComponent>

        <XStack f={1} jc="space-between" ai="flex-end" gap="$4" p={2} w="100%" m={2}>
          <Button icon={<TamaIcon iconName="ChevronLeft" />} onPress={() => router.back()}></Button>
      </XStack>
    </>
  )
} 

function SimpleSlider({ children, ...props }: SliderProps) {
  return (
    <Slider defaultValue={[2]} max={15} step={1} {...props}>
      <Slider.Track>
        <Slider.TrackActive />
      </Slider.Track>
      <Slider.Thumb size="$2" index={0} circular />
      {children}
    </Slider>
  )
}
