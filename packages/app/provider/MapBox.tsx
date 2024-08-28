import React, { useEffect, useRef } from 'react'
import MapboxGL, { Camera } from '@rnmapbox/maps'
import { Pos } from '../types/type'
MapboxGL.setAccessToken(
  'sk.eyJ1IjoiaHllb24zMDUxIiwiYSI6ImNsa3YwM3BhcjBneGEzbHIweGFuNTgzZXoifQ.uvJeaDq7NLN0HyOENlWUcA'
)

const MapBoxComponent = ({
  location,
  children,
  zoomLevel = 15,
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
        animationDuration: 500,
      })
    }
  }, [location])
  return (
    <>
      <MapboxGL.MapView style={{ flex: 1 }} logoEnabled={false} attributionEnabled={false}>
        <MapboxGL.UserLocation androidRenderMode="normal" animated={true} />
        <MapboxGL.Camera
          ref={camera}
          zoomLevel={zoomLevel}
          centerCoordinate={location[0]}
          animationMode="easeTo"
          animationDuration={1000}
        />
        {children}
      </MapboxGL.MapView>
    </>
  )
}
export default MapBoxComponent
