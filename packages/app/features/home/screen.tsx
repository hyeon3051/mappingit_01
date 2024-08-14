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

  const { enabled, location, setEnabled } = useBackgroundGeolocation()
  const fileInfo = useContext(fileState)

  console.log(fileInfo?.currentRoute.map((data) => data[0]))

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
                lineColor: '#bfbfbf',
                lineWidth: 3,
              }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapBoxComponent>
      <Button {...markerLinkProps}>marker</Button>
      <Button {...routeLinkProps}>route</Button>
    </>
  )
}
