import { useState, useEffect, useContext, useRef } from 'react'
import BackgroundGeolocation, {
  Location,
  State,
  Subscription,
} from 'react-native-background-geolocation'
import { Pos } from '../types/type'
import { fileDispatch } from '../contexts/mapData/fileReducer'
const useBackgroundGeolocation = () => {
  const dispatch = useContext(fileDispatch)
  const [enabled, setEnabled] = useState<boolean>(false)
  const [location, setLocation] = useState<Pos>([[0, 0], ''])
  const locateLngLat = useRef<[number, number]>([0, 0])

  useEffect(() => {
    const onLocation = BackgroundGeolocation.onLocation((loc: Location) => {
      let coords = loc.coords

      console.log('onLocation', coords)
      try {
        setLocation([[coords.longitude, coords.latitude], loc.timestamp])
        locateLngLat.current = [coords.longitude, coords.latitude]
      } catch (e) {
        console.log('error', e)
      }
    })

    const onMotionChange: Subscription = BackgroundGeolocation.onMotionChange((event) => {})

    const onActivityChange: Subscription = BackgroundGeolocation.onActivityChange((event) => {})

    const onProviderChange: Subscription = BackgroundGeolocation.onProviderChange((event) => {})

    BackgroundGeolocation.ready(
      {
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_MEDIUM,
        distanceFilter: 8,
        startOnBoot: true,
        stopOnTerminate: true,
        debug: false,
        isMoving: true,
      },
      (state: State) => {
        BackgroundGeolocation.start()
        BackgroundGeolocation.watchPosition((loc: Location) => {
          setEnabled(state.enabled)
        })
        console.log('- BackgroundGeolocation is configured and ready: ', state.enabled)
      }
    )

    return () => {
      // 이벤트 리스너 제거
      onLocation.remove()
      onMotionChange.remove()
      onActivityChange.remove()
      onProviderChange.remove()
    }
  }, [])

  useEffect(() => {
    if (enabled) {
      BackgroundGeolocation.start()
    } else {
      BackgroundGeolocation.stop()
    }
  }, [enabled])

  useEffect(() => {
    if (locateLngLat.current[0] === 0 && locateLngLat.current[1] === 0) return
    dispatch({ type: 'APPEND_POS', payload: { pos: location } })
  }, [location])

  return { enabled, location, setEnabled }
}

export default useBackgroundGeolocation
