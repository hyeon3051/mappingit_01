import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Link, SplashScreen, Stack } from 'expo-router'
import { Provider } from 'app/provider'
import { NativeToast } from '@my/ui/src/NativeToast'
import { AvatarFallback, Avatar, Text, AvatarImage, Button } from '@my/ui'
import { ClerkProvider, SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { useLink } from 'solito/navigation'
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Disable strict mode
})

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
  const colorScheme = useColorScheme()
  return (
    <Provider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <NativeToast />
        <StackComponent />
      </ThemeProvider>
    </Provider>
  )
}

function StackComponent() {
  const userLink = useLink({
    href: '/user/23',
  })
  const colorScheme = useColorScheme()
  const signInLink = useLink({
    href: '/(auth)/sign-in',
  })
  const signUpLink = useLink({
    href: '/(auth)/sign-up',
  })
  const { isLoaded, isSignedIn, user } = useUser()
  return (
    <Stack
      initialRouteName="Home"
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
              <Link {...signInLink}>
                <Text>Sign in</Text>
              </Link>
              <Link {...signUpLink}>
                <Text>Sign up</Text>
              </Link>
            </SignedOut>
          </>
        ),
      }}
    />
  )
}
