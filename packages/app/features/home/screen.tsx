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
import MapboxGL, { Camera } from '@rnmapbox/maps'
import useBackgroundGeolocation from 'app/services/BackGroundGelocation'
import { Pos } from 'app/types/type'
import { useState, useReducer, use, useContext, useEffect } from 'react'
import { Platform } from 'react-native'
import { useLink } from 'solito/navigation'
import { fileState } from 'packages/app/contexts/mapData/fileReducer'
import TamaIcon from 'packages/app/ui/Icon'

export function HomeScreen({ pagesMode = false }: { pagesMode?: boolean }) {
  const linkTarget = pagesMode ? '/pages-example-user' : '/user'
  const markerLinkProps = useLink({
    href: `/marker/marker`,
  })
  const routeLinkProps = useLink({
    href: `/route/route`,
  })

  const { enabled, location, setEnabled } = useBackgroundGeolocation()
  const fileInfo = useContext(fileState)
  return (
    <>
      <MapBoxComponent location={location}>
        {fileInfo.markers?.map(({ pos, markerIcon, markerColor, id }) => (
          <MapboxGL.PointAnnotation key={id} coordinate={pos} id="pt-ann">
            <TamaIcon iconName={markerIcon} color={markerColor} />
          </MapboxGL.PointAnnotation>
        ))}
      </MapBoxComponent>
      <Button {...markerLinkProps}>marker</Button>
      <Button {...routeLinkProps}>route</Button>
    </>
  )
}
