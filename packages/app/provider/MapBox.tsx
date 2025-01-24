import React, { useEffect, useRef } from 'react'
import MapboxGL, { Camera, SymbolLayer } from '@rnmapbox/maps'
import { Pos } from '../types/type'
import useBackgroundGeolocation from 'app/services/BackGroundGelocation'
import { useUser } from '@clerk/clerk-expo'

MapboxGL.setAccessToken(
  'sk.eyJ1IjoiaHllb24zMDUxIiwiYSI6ImNsa3YwM3BhcjBneGEzbHIweGFuNTgzZXoifQ.uvJeaDq7NLN0HyOENlWUcA'
)

const MapBoxComponent = ({ location, children }: { location?: Pos; children: React.ReactNode }) => {
  const { user } = useUser()
  const { location: currLocation } = useBackgroundGeolocation()
  const mapRef = useRef<MapboxGL.MapView>(null)
  const zoomLevel = useRef(15)
  const img_url = user?.imageUrl
  const camera = useRef<Camera>(null)

  useEffect(() => {
    if (location) {
      camera.current?.setCamera({
        animationDuration: 1000,
        centerCoordinate: location[0],
        animationMode: 'easeTo',
      })
    }
  }, [location])

  return (
    <MapboxGL.MapView
      style={{
        flex: 1,
        position: 'absolute',
        zIndex: 3,
        width: '100%',
        height: '100%',
      }}
      logoEnabled={false}
      attributionEnabled={false}
      zoomEnabled={true}
      ref={mapRef}
    >
      <MapboxGL.UserLocation visible={true} animated={true} />
      <MapboxGL.Camera
        animationMode="easeTo"
        zoomLevel={zoomLevel.current}
        centerCoordinate={location ? location[0] : currLocation[0]}
        ref={camera}
      />
      {children}
    </MapboxGL.MapView>
  )
}
export default MapBoxComponent
