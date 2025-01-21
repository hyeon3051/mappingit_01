import { HomeScreen } from 'app/features/home/screen'
import { Stack } from 'expo-router'
import { useTheme } from '@my/ui'

export default function Home() {
  const theme = useTheme()

  return (
    <>
      <Stack.Screen
        options={{
          title: '마커',
          presentation: 'modal',
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      <HomeScreen />
    </>
  )
}
