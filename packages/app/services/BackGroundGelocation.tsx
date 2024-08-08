import { useState, useEffect, useContext, useRef } from 'react'
import BackgroundGeolocation, {
  Location,
  State,
  Subscription,
} from 'react-native-background-geolocation'
import { LocateFile, Pos } from '../types/type'
import { fileDispatch } from '../contexts/mapData/fileReducer'
const MIN_DISTANCE = 0.0001
const useBackgroundGeolocation = () => {
  const dispatch = useContext(fileDispatch)
  const [enabled, setEnabled] = useState<boolean>(false)
  const [location, setLocation] = useState<Pos>([[127.93205, 36.97344], ''])
  const locateLngLat = useRef<[number, number]>([127.93205, 36.97344])

  useEffect(() => {
    const onLocation = BackgroundGeolocation.onLocation((loc: Location) => {
      let coords = loc.coords
      if (
        Math.abs(locateLngLat.current[0] - coords.longitude) > MIN_DISTANCE ||
        Math.abs(locateLngLat.current[1] - coords.latitude) > MIN_DISTANCE
      ) {
        setLocation([[coords.longitude, coords.latitude], loc.timestamp])
        locateLngLat.current = [coords.longitude, coords.latitude]
      }
    })

    const onMotionChange: Subscription = BackgroundGeolocation.onMotionChange((event) => {})

    const onActivityChange: Subscription = BackgroundGeolocation.onActivityChange((event) => {})

    const onProviderChange: Subscription = BackgroundGeolocation.onProviderChange((event) => {})

    BackgroundGeolocation.ready(
      {
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        stopTimeout: 1,
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        distanceFilter: 10,
        stopOnTerminate: true,
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
    dispatch({ type: 'APPEND_POS', payload: { pos: location } })
  }, [location])

  return { enabled, location, setEnabled }
}

export default useBackgroundGeolocation
