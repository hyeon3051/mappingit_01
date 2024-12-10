import { EditRoutePathView } from 'app/features/route/route-edit'
import { Stack } from 'expo-router'
import { useTheme } from '@my/ui'

export default function Screen() {
  const theme = useTheme()

  return (
    <>
      <Stack.Screen
        options={{
          title: '경로 추가',
          presentation: 'modal',
          animation: 'slide_from_left',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      <EditRoutePathView />
    </>
  )
}
