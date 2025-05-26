import { HomeScreen } from 'app/features/home/screen'
import { Stack } from 'expo-router'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { RouteView } from 'app/features/route/route-list'
import { MarkerView } from 'app/features/marker/marker-list'
import { FileView } from 'app/features/file/file-list'
import TamaIcon from 'packages/app/ui/Icon'
import { Dimensions, Platform, useColorScheme, View } from 'react-native'
import { BannerAd, TestIds, BannerAdSize, useForeground } from 'react-native-google-mobile-ads'
import { AvatarImage, Avatar, XStack, YStack, Button } from '@my/ui'
import { useRef } from 'react'
import { UserCircle } from '@tamagui/lucide-icons'
const Tab = createBottomTabNavigator()
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { useLink } from 'solito/navigation'
export default function Screen() {
  const bannerRef = useRef<BannerAd>(null)

  useForeground(() => {
    Platform.OS === 'ios' && bannerRef.current?.load()
  })

  bannerRef.current?.forceUpdate()

  const width = Math.floor(Dimensions.get('window').width)

  const colorScheme = useColorScheme()
  return (
    <>
      <BannerAd
        unitId={
          Platform.OS === 'android'
            ? 'ca-app-pub-5218306923860994/2970041329'
            : 'ca-app-pub-5218306923860994/7176917638'
        }
        size={`${width}x75`}
        ref={bannerRef}
      />
      <BottomTab />
    </>
  )
}
export function BottomTab() {
  const userLink = useLink({
    href: '/user/23',
  })

  const signInLink = useLink({
    href: '/(auth)/sign-in',
  })
  const { user } = useUser()

  return (
    <Tab.Navigator
      initialRouteName="홈"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="홈"
        component={HomeScreen}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ color }) => <TamaIcon iconName="Home" color={color} size="$1" />,
        }}
      />
      <Tab.Screen
        name="경로"
        component={RouteView}
        options={{
          tabBarLabel: '경로',
          tabBarIcon: ({ color }) => <TamaIcon iconName="Route" color={color} size="$1" />,
        }}
      />

      <Tab.Screen
        name="마커"
        component={MarkerView}
        options={{
          tabBarLabel: '마커',
          tabBarIcon: ({ color }) => <TamaIcon iconName="MapPin" color={color} size="$1" />,
        }}
      />
      <Tab.Screen
        name="파일"
        component={FileView}
        options={{
          tabBarLabel: '파일',
          tabBarIcon: ({ color }) => <TamaIcon iconName="File" color={color} size="$1" />,
        }}
      />
    </Tab.Navigator>
  )
}
