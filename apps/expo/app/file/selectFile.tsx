import { SelectFileView } from 'app/features/file/file-select'
import { Stack } from 'expo-router'
import { useTheme } from '@my/ui'

export default function Screen() {
  const theme = useTheme()

  return (
    <>
      <Stack.Screen
        options={{
          title: '파일 선택',
          presentation: 'modal',
          animation: 'slide_from_bottom',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      <SelectFileView />
    </>
  )
}
