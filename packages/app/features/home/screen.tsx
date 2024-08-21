import { Button } from '@my/ui'
import MapBoxComponent from 'app/provider/MapBox'
import MapboxGL from '@rnmapbox/maps'
import useBackgroundGeolocation from 'app/services/BackGroundGelocation'
import { useContext } from 'react'
import { useLink } from 'solito/navigation'
import { fileState } from 'packages/app/contexts/mapData/fileReducer'
import TamaIcon from 'packages/app/ui/Icon'

export function HomeScreen({ pagesMode = false }: { pagesMode?: boolean }) {
  const linkTarget = pagesMode ? '/pages-example-user' : '/user'
  const markerLinkProps = useLink({
    href: '/marker/marker',
  })
  const routeLinkProps = useLink({
    href: `/route/route`,
  })
  const fileLinkProps = useLink({
    href: '/file/file',
  })

  const { enabled, location, setEnabled } = useBackgroundGeolocation()
  const fileInfo = useContext(fileState)

  console.log(fileInfo?.currentRoute.map((data) => data[0]))
  console.log((fileInfo?.currentRoute.length || 0) > 1)
  console.log(fileInfo?.routes.length)
  return (
    <>
      <MapBoxComponent location={location}>
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
              style={{
                lineColor: '#FF0000',
                lineWidth: 10,
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
      <Button {...markerLinkProps}>marker</Button>
      <Button {...routeLinkProps}>route</Button>
      <Button {...fileLinkProps}>file</Button>
    </>
  )
}
