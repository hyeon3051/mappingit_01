import { useSignIn, useOAuth } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, Input, Button, YStack, ButtonIcon, Image } from '@my/ui'
import React from 'react'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: 'oauth_google',
  })
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({
    strategy: 'oauth_apple',
  })
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  const onGoogleOAuthPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startGoogleOAuthFlow()
      if (createdSessionId) {
        setActive!({ session: createdSessionId })
      } else {
        // Use signIn or signUp returned from startOAuthFlow
        // for next steps, such as MFA
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }, [])

  const onAppleOAuthPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startAppleOAuthFlow()
      if (createdSessionId) {
        setActive!({ session: createdSessionId })
      } else {
        // Use signIn or signUp returned from startOAuthFlow
        // for next steps, such as MFA
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }, [])

  // Handle the submission of the sign-in form
  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, emailAddress, password])

  return (
    <YStack>
      <YStack f={1} alignItems="center">
        <Button onPress={onGoogleOAuthPress} variant="outlined" w="80%">
          <Image
            source={{
              uri: 'https://cdn.pixabay.com/photo/2021/05/24/09/15/google-logo-6278331_1280.png',
              width: 40,
              height: 40,
            }}
            h="100%"
          />
          <Text>Sign in Google</Text>
        </Button>
        <Button onPress={onAppleOAuthPress}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/0/747.png',
              width: 40,
              height: 40,
            }}
            h="100%"
          />
          <Text>Sign in Apple</Text>
        </Button>
        <Button onPress={() => router.replace('/sign-up')}>Sign up</Button>
      </YStack>
    </YStack>
  )
}
