import React, { use, useEffect, useRef } from 'react'
import MapboxGL, { Camera, SymbolLayer } from '@rnmapbox/maps'
import { Pos } from '../types/type'
import useBackgroundGeolocation from 'app/services/BackGroundGelocation'
import { useColorScheme } from 'react-native'
MapboxGL.setAccessToken(
  'sk.eyJ1IjoiaHllb24zMDUxIiwiYSI6ImNsa3YwM3BhcjBneGEzbHIweGFuNTgzZXoifQ.uvJeaDq7NLN0HyOENlWUcA'
)

const MapBoxComponent = ({ location, children }: { location?: Pos; children: React.ReactNode }) => {
  const { location: currLocation } = useBackgroundGeolocation()
  const camera = useRef<Camera>(null) // Corrected here
  const mapRef = useRef<MapboxGL.MapView>(null)
  const zoomLevel = useRef(15)
  const colorScheme = useColorScheme()
  const img_url =
    'https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80'

  useEffect(() => {
    if (
      (location && location[0][0] !== 0 && location[0][1] !== 0) ||
      (currLocation && currLocation[0][0] !== 0 && currLocation[0][1] !== 0)
    ) {
      camera.current?.setCamera({
        animationDuration: 200,
        centerCoordinate: location ? location[0] : currLocation[0],
        zoomLevel: zoomLevel.current,
      })
    }
  }, [location, currLocation])

  return (
    <>
      <MapboxGL.MapView
        style={{
          flex: 1,
          zIndex: 3,
          top: 0,
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
        }}
        logoEnabled={false}
        attributionEnabled={false}
        zoomEnabled={true}
        ref={mapRef}
      >
        <MapboxGL.UserLocation visible={true} animated={true} />
        <MapboxGL.Camera ref={camera} animationMode="easeTo" zoomLevel={zoomLevel.current} />
        {children}
      </MapboxGL.MapView>
    </>
  )
}
export default MapBoxComponent
