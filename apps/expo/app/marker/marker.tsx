import { MarkerView } from 'app/features/marker/marker-list'
import { Stack } from 'expo-router'
import { useTheme } from '@my/ui'

export default function Screen() {
  const theme = useTheme()

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Marker',
          presentation: 'modal',
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      <MarkerView />
    </>
  )
}
