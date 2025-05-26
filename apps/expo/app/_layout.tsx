import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { Provider } from 'app/provider'
import { NativeToast } from '@my/ui/src/NativeToast'
import { AvatarFallback, Avatar, Text, AvatarImage, Button, Theme, TamaguiProvider } from '@my/ui'
import { UserCircle } from '@tamagui/lucide-icons'
import { config } from 'packages/config/src'
import { ClerkProvider, SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { useLink } from 'solito/navigation'
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated'
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Disable strict mode
})

export const unstable_settings = {
  // Ensure that reloading on `/user` keeps a back button present.
  initialRouteName: 'index',
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
    return <Text>Loading...</Text>
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()
  mobileAds().initialize()
  return (
    <Provider>
      <TamaguiProvider config={config} defaultTheme={colorScheme!}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <NativeToast />
          <StackComponent />
        </ThemeProvider>
      </TamaguiProvider>
    </Provider>
  )
}

function StackComponent() {
  const userLink = useLink({
    href: '/user/23',
  })

  const signInLink = useLink({
    href: '/(auth)/sign-in',
  })
  const { isLoaded, isSignedIn, user } = useUser()
  return (
    <>
      <Stack
        screenOptions={{
          headerRight: () => (
            <>
              <SignedIn>
                <Button {...userLink} className="flex-row items-center" circular>
                  <Avatar>
                    <AvatarImage src={user?.imageUrl} />
                  </Avatar>
                </Button>
              </SignedIn>
              <SignedOut>
                <Button {...signInLink} variant="outlined">
                  <UserCircle />
                </Button>
              </SignedOut>
            </>
          ),
        }}
      />
    </>
  )
}
