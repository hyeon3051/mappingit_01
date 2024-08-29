import React, { use, useEffect, useRef } from 'react'
import MapboxGL, { Camera } from '@rnmapbox/maps'
import { Pos } from '../types/type'
import { useColorScheme } from 'react-native'
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
  const colorScheme = useColorScheme()
  const styleURL = colorScheme === 'dark' ? MapboxGL.StyleURL.Dark : MapboxGL.StyleURL
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
      <MapboxGL.MapView
        style={{ flex: 1 }}
        logoEnabled={false}
        attributionEnabled={false}
      >
        <MapboxGL.UserLocation
          androidRenderMode="normal"
          animated={true}
        />        
        <MapboxGL.Camera
          ref={camera}
          zoomLevel={zoomLevel}
          animationMode="easeTo"
          followUserLocation={true}
          animationDuration={1000}
        />
        {children}
      </MapboxGL.MapView>
    </>
  )
}
export default MapBoxComponent
