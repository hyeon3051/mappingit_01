import { AddMarkerView } from 'app/features/marker/marker-add'
import { Stack } from 'expo-router'
import { useTheme } from '@my/ui'

export default function Screen() {
  const theme = useTheme()

  return (
    <>
      <Stack.Screen
        options={{
          title: 'addMarker',
          presentation: 'modal',
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      <AddMarkerView />
    </>
  )
}
