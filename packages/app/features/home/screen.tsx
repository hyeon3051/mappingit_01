import {
  Anchor,
  Button,
  H1,
  Paragraph,
  Separator,
  Sheet,
  useToastController,
  SwitchThemeButton,
  SwitchRouterButton,
  XStack,
  YStack,
  Switch,
} from '@my/ui'
import { ChevronDown, ChevronUp, X } from '@tamagui/lucide-icons'
import MapBoxComponent from 'app/provider/MapBox'
import useBackgroundGeolocation from 'app/services/BackGroundGelocation'
import { Pos } from 'app/types/type'
import { useState, useReducer } from 'react'
import { Platform } from 'react-native'
import { useLink } from 'solito/navigation'
import fileReducer from 'packages/app/contexts/mapData/fileReducer'

export function HomeScreen({ pagesMode = false }: { pagesMode?: boolean }) {
  const linkTarget = pagesMode ? '/pages-example-user' : '/user'
  const markerLinkProps = useLink({
    href: `/marker/marker`,
  })
  const routeLinkProps = useLink({
    href: `/route/route`,
  })

  const { enabled, location, setEnabled } = useBackgroundGeolocation()

  return (
    <>
      <MapBoxComponent location={location} />
      <Button {...markerLinkProps}>marker</Button>
      <Button {...routeLinkProps}>route</Button>
    </>
  )
}
