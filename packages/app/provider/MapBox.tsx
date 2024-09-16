import React, { use, useEffect, useRef } from 'react'
import MapboxGL, { Camera, SymbolLayer } from '@rnmapbox/maps'
import { Pos } from '../types/type'
import { Image } from '@my/ui'
import useBackgroundGeolocation from 'app/services/BackGroundGelocation'
MapboxGL.setAccessToken(
  'sk.eyJ1IjoiaHllb24zMDUxIiwiYSI6ImNsa3YwM3BhcjBneGEzbHIweGFuNTgzZXoifQ.uvJeaDq7NLN0HyOENlWUcA'
)

const MapBoxComponent = ({ location, children }: { location?: Pos; children: React.ReactNode }) => {
  let { location: currLocation } = useBackgroundGeolocation()
  const camera = useRef<Camera>(null) // Corrected here
  const mapRef = useRef<MapboxGL.MapView>(null)

  const img_url =
    'https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80'

  mapRef.current?.getZoom().then((zoom) => {
    camera.current?.setCamera({
      zoomLevel: zoom,
      animationDuration: 1000,
    })
  })

  useEffect(() => {
    if (location && camera.current) {
      camera.current.setCamera({
        centerCoordinate: location[0] ?? currLocation[0],
        animationDuration: 1000,
      })
    }
  }, [location])

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
          followUserLocation={true}
          animationDuration={1000}
          followZoomLevel={15}
          followPitch={0}
        />
        {children}
      </MapboxGL.MapView>
    </>
  )
}
export default MapBoxComponent
