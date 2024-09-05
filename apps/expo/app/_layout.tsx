import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { Provider } from 'app/provider'
import { NativeToast } from '@my/ui/src/NativeToast'
import TamaIcon from 'app/ui/Icon'
import { Avatar, Button, ButtonIcon } from '@my/ui'
import { useLink } from 'solito/navigation'

export const unstable_settings = {
  // Ensure that reloading on `/user` keeps a back button present.
  initialRouteName: 'Home',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function App() {
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [interLoaded, interError])

  if (!interLoaded && !interError) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const userLink = useLink({
    href: '/user/23',
  })
  const colorScheme = useColorScheme()

  return (
    <Provider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerRight: () => (
              <Button {...userLink} circular backgroundColor={'transparent'}>
                <Avatar circular size="$3">
                  <Avatar.Image
                    accessibilityLabel="Cam"
                    src="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80"
                  />
                  <Avatar.Fallback backgroundColor="$blue10" />
                </Avatar>
              </Button>
            ),
          }}
        />
        <NativeToast />
      </ThemeProvider>
    </Provider>
  )
}
