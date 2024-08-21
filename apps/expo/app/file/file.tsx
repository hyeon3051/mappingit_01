import { FileView } from 'app/features/file/file-list'
import { Stack } from 'expo-router'
import { useTheme } from '@my/ui'

export default function Screen() {
  const theme = useTheme()

  return (
    <>
      <Stack.Screen
        options={{
          title: 'File',
          presentation: 'modal',
          animation: 'slide_from_left',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      <FileView />
    </>
  )
}
