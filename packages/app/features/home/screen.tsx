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
import { fileState, fileDispatch } from 'packages/app/contexts/mapData/fileReducer'

const initalData = {
  title: '',
  routes: [],
  markers: [],
  isRecord: false,
  currentRoute: [],
}

export function HomeScreen({ pagesMode = false }: { pagesMode?: boolean }) {
  const [state, dispatch] = useReducer(fileReducer, initalData)
  const linkTarget = pagesMode ? '/pages-example-user' : '/user'
  const linkProps = useLink({
    href: `/marker/marker`,
  })

  const { enabled, location, setEnabled } = useBackgroundGeolocation()

  return (
    <fileState.Provider value={state}>
      <fileDispatch.Provider value={dispatch}>
        <MapBoxComponent location={location} />
        <Button {...linkProps}>Link to user</Button>
        <YStack f={1} jc="center" ai="center" gap="$8" p="$4">
          <SheetDemo />
        </YStack>
        <SwitchRouterButton pagesMode={pagesMode} />
      </fileDispatch.Provider>
    </fileState.Provider>
  )
}

function SheetDemo() {
  const toast = useToastController()

  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)

  return (
    <>
      <Button
        size="$6"
        icon={open ? ChevronDown : ChevronUp}
        circular
        onPress={() => setOpen((x) => !x)}
      />
      <Sheet
        modal
        animation="medium"
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Handle bg="$gray8" />
        <Sheet.Frame ai="center" jc="center" gap="$10" bg="$color2">
          <XStack gap="$2">
            <Paragraph ta="center">Made by</Paragraph>
            <Anchor col="$blue10" href="https://twitter.com/natebirdman" target="_blank">
              @natebirdman,
            </Anchor>
            <Anchor
              color="$purple10"
              href="https://github.com/tamagui/tamagui"
              target="_blank"
              rel="noreferrer"
            >
              give it a ⭐️
            </Anchor>
          </XStack>

          <Button
            size="$6"
            circular
            icon={ChevronDown}
            onPress={() => {
              setOpen(false)
              toast.show('Sheet closed!', {
                message: 'Just showing how toast works...',
              })
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
