import { HomeScreen } from 'app/features/home/screen'
import { Stack } from 'expo-router'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { RouteView } from 'app/features/route/route-list'
import { MarkerView } from 'app/features/marker/marker-list'
import { FileView } from 'app/features/file/file-list'
import TamaIcon from 'packages/app/ui/Icon'

const Tab = createBottomTabNavigator()

export default function Screen() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <TamaIcon iconName="Home" color={color} size="$1" />,
        }}
      />
      <Tab.Screen
        name="Route"
        component={RouteView}
        options={{
          tabBarIcon: ({ color }) => <TamaIcon iconName="Route" color={color} size="$1" />,
        }}
      />

      <Tab.Screen
        name="Marker"
        component={MarkerView}
        options={{
          tabBarIcon: ({ color }) => <TamaIcon iconName="MapPin" color={color} size="$1" />,
        }}
      />
      <Tab.Screen
        name="File"
        component={FileView}
        options={{
          tabBarIcon: ({ color }) => <TamaIcon iconName="File" color={color} size="$1" />,
        }}
      />
    </Tab.Navigator>
  )
}
