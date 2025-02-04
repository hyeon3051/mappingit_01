import { useState, useEffect, useContext, useRef } from 'react'
import BackgroundGeolocation, {
  Location,
  State,
  Subscription,
} from 'react-native-background-geolocation'
import { Pos } from '../types/type'
import { fileDispatch, fileState } from '../contexts/mapData/fileReducer'
const MIN_DISTANCE = 1e-6
const useBackgroundGeolocation = () => {
  const dispatch = useContext(fileDispatch)
  const fileInfo = useContext(fileState)
  const [enabled, setEnabled] = useState<boolean>(false)
  const [location, setLocation] = useState<Pos>([[127.001, 37.001], ''])
  const locateLngLat = useRef<[number, number]>([127.001, 37.001])

  useEffect(() => {
    const onLocation = BackgroundGeolocation.onLocation((loc: Location) => {
      let coords = loc.coords

      try {
        setLocation([[coords.longitude, coords.latitude], loc.timestamp])
        locateLngLat.current = [coords.longitude, coords.latitude]
      } catch (e) {}
    })

    const onMotionChange: Subscription = BackgroundGeolocation.onMotionChange((event) => {})

    const onActivityChange: Subscription = BackgroundGeolocation.onActivityChange((event) => {})

    const onProviderChange: Subscription = BackgroundGeolocation.onProviderChange((event) => {})

    BackgroundGeolocation.ready(
      {
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 20,
        locationUpdateInterval: 100000,
        startOnBoot: true,
        debug: false,
        notification: {
          layout: '맵핑잇',
          title: '위치 정보 수집 중',
          text: '위치 정보 수집 중입니다.',
        },
        isMoving: true,
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      },
      (state: State) => {
        BackgroundGeolocation.start()
        BackgroundGeolocation.watchPosition((loc: Location) => {
          setEnabled(true)
        })
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
    if (locateLngLat.current[0] === 127.001 && locateLngLat.current[1] === 37.001) return
    dispatch({ type: 'SET_LOCATION', payload: { location } })
    if (!fileInfo?.isRecord) return
    dispatch({ type: 'APPEND_POS', payload: { pos: location } })
  }, [location, fileInfo?.isRecord])

  return { enabled, location, setEnabled }
}

export default useBackgroundGeolocation
