import { SelectMarkerView } from 'app/features/marker/marker-select'
import { Stack } from 'expo-router'
import { useTheme } from '@my/ui'

export default function Screen() {
  const theme = useTheme()

  return (
    <>
      <Stack.Screen
        options={{
          title: '마커 선택',
          presentation: 'modal',
          animation: 'default',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      <SelectMarkerView />
    </>
  )
}
