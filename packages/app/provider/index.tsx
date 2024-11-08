import { useColorScheme } from 'react-native'
import { CustomToast, TamaguiProvider, TamaguiProviderProps, ToastProvider, config } from '@my/ui'
import { ToastViewport } from './ToastViewport'
import { fileState, fileDispatch } from 'packages/app/contexts/mapData/fileReducer'
import fileReducer from 'packages/app/contexts/mapData/fileReducer'
import { useReducer } from 'react'
import { SQLiteProvider } from 'expo-sqlite'

const initalData = {
  title: '',
  routes: [],
  markers: [],
  isRecord: false,
  currentRoute: [],
}

export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  const colorScheme = useColorScheme()
  const [state, dispatch] = useReducer(fileReducer, initalData)
  return (
    <TamaguiProvider
      config={config}
      defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}
      {...rest}
    >
      <ToastProvider
        swipeDirection="horizontal"
        duration={6000}
        native={
          [
            /* uncomment the next line to do native toasts on mobile. NOTE: it'll require you making a dev build and won't work with Expo Go */
            // 'mobile'
          ]
        }
      >
        <SQLiteProvider
          databaseName="mappingit.db"
          assetSource={{ assetId: require('../mappingit.db') }}
        >
          <fileState.Provider value={state}>
            <fileDispatch.Provider value={dispatch}>{children}</fileDispatch.Provider>
          </fileState.Provider>
        </SQLiteProvider>
        <CustomToast />
        <ToastViewport />
      </ToastProvider>
    </TamaguiProvider>
  )
}
