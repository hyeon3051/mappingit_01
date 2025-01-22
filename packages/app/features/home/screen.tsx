import { Button, XStack, YStack } from '@my/ui'
import MapBoxComponent from 'packages/app/provider/MapBox'
import MapboxGL from '@rnmapbox/maps'
import { useContext, useEffect, useState } from 'react'
import { fileState, fileDispatch } from 'app/contexts/mapData/fileReducer'
import * as Notifications from 'expo-notifications'
import TamaIcon from 'packages/app/ui/Icon'

export function HomeScreen() {
  const [isRecord, setIsRecord] = useState(false)
  const fileInfo = useContext(fileState)
  const dispatch = useContext(fileDispatch)

  async function registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    return
  }

  useEffect(() => {
    registerForPushNotificationsAsync()
  }, [])

  useEffect(() => {
    if (fileInfo?.isRecord) {
      setIsRecord(true)
    } else {
      setIsRecord(false)
    }
  }, [fileInfo?.isRecord])

  const changeIsRecordTrue = () => {
    dispatch({ type: 'CHANGE_IS_RECORD_TRUE' })
  }
  const changeIsRecordFalse = () => {
    dispatch({ type: 'CHANGE_IS_RECORD_FALSE' })
  }
  return (
    <>
      <MapBoxComponent location={fileInfo?.pos}>
        {fileInfo?.markers?.map(({ pos, markerIcon, markerColor, id }) => (
          <MapboxGL.PointAnnotation key={'key' + id.toString()} coordinate={pos[0]} id="pt-ann">
            <TamaIcon iconName={markerIcon} color={markerColor} />
          </MapboxGL.PointAnnotation>
        ))}
        {(fileInfo?.currentRoute.length || 0) > 1 && (
          <MapboxGL.ShapeSource
            id="line-source"
            lineMetrics={true}
            shape={{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: fileInfo?.currentRoute.map((pos) => pos[0]),
              },
            }}
          >
            <MapboxGL.LineLayer
              id="line"
              sourceID="line"
              minZoomLevel={10}
              style={{
                lineColor: '#000000',
                lineWidth: 5,
              }}
            />
          </MapboxGL.ShapeSource>
        )}
        {fileInfo?.routes?.map(({ path, id, lineColor, lineWidth }, idx) => (
          <MapboxGL.ShapeSource
            key={idx}
            id={'line' + idx}
            lineMetrics={true}
            shape={{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: path.map((pos) => pos[0]),
              },
            }}
          >
            <MapboxGL.LineLayer
              id={'line' + idx}
              sourceID={'line' + idx}
              style={{
                lineColor: lineColor || '#FFFFFF',
                lineWidth: lineWidth || 3,
              }}
            />
          </MapboxGL.ShapeSource>
        ))}
      </MapBoxComponent>
      <XStack
        f={2}
        jc="space-between"
        gap="$1"
        w="100%"
        zIndex={5}
        pos="absolute"
        bottom={0}
        left={0}
        p="$4"
        right={0}
      >
        {isRecord ? (
          <Button
            onPress={changeIsRecordFalse}
            icon={<TamaIcon iconName="CameraOff" color="red" />}
            disabled
          >
            경로에서 종료
          </Button>
        ) : (
          <Button onPress={changeIsRecordTrue} icon={<TamaIcon iconName="Camera" color="green" />}>
            측정 시작
          </Button>
        )}
        <Button>측정 여부</Button>
      </XStack>
    </>
  )
}
