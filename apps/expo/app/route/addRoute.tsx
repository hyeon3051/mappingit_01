import { AddRouteView } from 'app/features/route/route-add'
import { Stack } from 'expo-router'
import { useTheme } from '@my/ui'

export default function Screen() {
  const theme = useTheme()

  return (
    <>
      <Stack.Screen
        options={{
          title: 'RouteAdd',
          presentation: 'modal',
          animation: 'slide_from_left',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      <AddRouteView />
    </>
  )
}
