import React, { use, useEffect, useRef } from 'react'
import MapboxGL, { Camera, SymbolLayer } from '@rnmapbox/maps'
import { Pos } from '../types/type'
import useBackgroundGeolocation from 'app/services/BackGroundGelocation'
MapboxGL.setAccessToken(
  'sk.eyJ1IjoiaHllb24zMDUxIiwiYSI6ImNsa3YwM3BhcjBneGEzbHIweGFuNTgzZXoifQ.uvJeaDq7NLN0HyOENlWUcA'
)

const MapBoxComponent = ({ location, children }: { location?: Pos; children: React.ReactNode }) => {
  const { location: currLocation } = useBackgroundGeolocation()
  const camera = useRef<Camera>(null) // Corrected here
  const mapRef = useRef<MapboxGL.MapView>(null)

  const img_url =
    'https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80'


  useEffect(() => {
      camera.current?.setCamera({
        animationDuration: 1000,
        centerCoordinate: currLocation[0],
        zoomLevel: 15,
      })
  }, [location, currLocation])


  return (
    <>
      <MapboxGL.MapView
        style={{ flex: 1, zIndex: 3, top: 0, position: 'absolute', width: '100%', height: '100%' }}
        logoEnabled={false}
        attributionEnabled={false}
        zoomEnabled={true}
        ref={mapRef}
      >
        <MapboxGL.UserLocation visible={true} animated={true} />
        <MapboxGL.Camera
          ref={camera}
          animationMode="easeTo"
        />
        {children}
      </MapboxGL.MapView>
    </>
  )
}
export default MapBoxComponent
