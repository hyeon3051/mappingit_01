import { Button, XStack } from '@my/ui'
import MapBoxComponent from 'app/provider/MapBox'
import MapboxGL from '@rnmapbox/maps'
import useBackgroundGeolocation from 'app/services/BackGroundGelocation'
import { useContext } from 'react'
import { useLink } from 'solito/navigation'
import { fileState } from 'packages/app/contexts/mapData/fileReducer'
import TamaIcon from 'packages/app/ui/Icon'

export function HomeScreen({ pagesMode = false }: { pagesMode?: boolean }) {
  const fileInfo = useContext(fileState)
  return (
    <>
      <MapBoxComponent>
        {fileInfo?.markers?.map(({ pos, markerIcon, markerColor, id }) => (
          <MapboxGL.PointAnnotation key={id} coordinate={pos} id="pt-ann">
            <TamaIcon iconName={markerIcon} color={markerColor} />
          </MapboxGL.PointAnnotation>
        ))}
        {(fileInfo?.currentRoute.length || 0) > 1 && (
          <MapboxGL.ShapeSource
            id="line-source"
            lineMetrics={true}
            shape={{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: fileInfo?.currentRoute.map((pos) => pos[0]),
              },
            }}
          >
            <MapboxGL.LineLayer
              id="line"
              sourceID="line"
              minZoomLevel={10}
              style={{
                lineColor: '#000000',
                lineWidth: 5,
              }}
            />
          </MapboxGL.ShapeSource>
        )}
        {fileInfo?.routes?.map(({ path, id, lineColor, lineWidth }, idx) => (
          <MapboxGL.ShapeSource
            key={idx}
            id={'line' + idx}
            lineMetrics={true}
            shape={{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: path.map((pos) => pos[0]),
              },
            }}
          >
            <MapboxGL.LineLayer
              id={'line' + idx}
              sourceID={'line' + idx}
              style={{
                lineColor: lineColor || '#FFFFFF',
                lineWidth: lineWidth || 3,
              }}
            />
          </MapboxGL.ShapeSource>
        ))}
      </MapBoxComponent>
      <XStack
        f={2}
        jc="space-between"
        gap="$1"
        w="100%"
        zIndex={3}
        pos="absolute"
        bottom={0}
        left={0}
        p="$4"
        right={0}
      >
        <Button icon={<TamaIcon iconName="Home" color="$white1" size="$2" />}></Button>
        <Button>측정 여부</Button>
      </XStack>
    </>
  )
}
