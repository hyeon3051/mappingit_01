import { useSignIn, useOAuth } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, Input, Button, YStack } from '@my/ui'
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
      <Input
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <Input
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <Button onPress={onSignInPress}>Sign in</Button>
      <YStack>
        <Button onPress={onGoogleOAuthPress}>Google</Button>
        <Button onPress={onAppleOAuthPress}>Apple</Button>
        <Button onPress={() => router.replace('/sign-up')}>Sign up</Button>
      </YStack>
    </YStack>
  )
}
