import { HomeScreen } from 'app/features/home/screen'
import { Stack } from 'expo-router'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { RouteView } from 'app/features/route/route-list'
import { MarkerView } from 'app/features/marker/marker-list'
import { FileView } from 'app/features/file/file-list'
import TamaIcon from 'packages/app/ui/Icon'
import { Dimensions, Platform, useColorScheme } from 'react-native'
import { BannerAd, TestIds, BannerAdSize, useForeground } from 'react-native-google-mobile-ads'
import { XStack, YStack } from '@my/ui'
import { useRef } from 'react'
const Tab = createBottomTabNavigator()

export default function Screen() {
  const bannerRef = useRef<BannerAd>(null)

  useForeground(() => {
    Platform.OS === 'ios' && bannerRef.current?.load()
  })

  bannerRef.current?.forceUpdate()

  const width = Dimensions.get('window').width

  const colorScheme = useColorScheme()
  console.log(TestIds.BANNER)
  return (
    <YStack height="100%">
      <BannerAd
        unitId={'ca-app-pub-5218306923860994/7176917638'}
        size={`${width}x75`}
        ref={bannerRef}
      />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="홈"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color }) => <TamaIcon iconName="Home" color={color} size="$1" />,
          }}
        />
        <Tab.Screen
          name="경로"
          component={RouteView}
          options={{
            tabBarIcon: ({ color }) => <TamaIcon iconName="Route" color={color} size="$1" />,
          }}
        />

        <Tab.Screen
          name="마커"
          component={MarkerView}
          options={{
            tabBarIcon: ({ color }) => <TamaIcon iconName="MapPin" color={color} size="$1" />,
          }}
        />
        <Tab.Screen
          name="파일"
          component={FileView}
          options={{
            tabBarIcon: ({ color }) => <TamaIcon iconName="File" color={color} size="$1" />,
          }}
        />
      </Tab.Navigator>
    </YStack>
  )
}
