import React, { useEffect, useRef } from 'react'
import MapboxGL, { Camera } from '@rnmapbox/maps'
import { Pos } from '../types/type'
MapboxGL.setAccessToken(
  'sk.eyJ1IjoiaHllb24zMDUxIiwiYSI6ImNsa3YwM3BhcjBneGEzbHIweGFuNTgzZXoifQ.uvJeaDq7NLN0HyOENlWUcA'
)

const MapBoxComponent = ({
  location,
  children,
  zoomLevel = 10,
}: {
  location: Pos
  children: React.ReactNode
  zoomLevel: number
}) => {
  const camera = useRef<Camera>(null) // Corrected here
  useEffect(() => {
    if (location && camera.current) {
      camera.current.setCamera({
        centerCoordinate: location[0],
      })
    }
  }, [location])
  return (
    <>
      <MapboxGL.MapView style={{ flex: 1, zIndex: 1 }}>
        <MapboxGL.UserLocation androidRenderMode="normal" animated={true} />
        <MapboxGL.Camera
          ref={camera}
          defaultSettings={{
            centerCoordinate: location[0],
            zoomLevel: zoomLevel,
          }}
          zoomLevel={zoomLevel}
          centerCoordinate={location[0]}
        />
      </MapboxGL.MapView>
    </>
  )
}
export default MapBoxComponent
