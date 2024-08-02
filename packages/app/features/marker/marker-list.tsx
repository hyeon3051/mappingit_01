import {
  Button,
  Paragraph,
  XStack,
  YStack,
  SizableText,
  Separator,
  Stack,
  useToastController,
  Sheet,
  Anchor,
} from '@my/ui'
import {
  ChevronLeft,
  PlusCircle,
  Trash,
  Piano,
  ChevronDown,
  ChevronUp,
} from '@tamagui/lucide-icons'
import MapBoxComponent from 'packages/app/provider/MapBox'
import useBackgroundGeolocation from 'packages/app/services/BackGroundGelocation'
import { useRef, useState } from 'react'
import { useLink, useRouter } from 'solito/navigation'

export function MarkerView() {
  const router = useRouter()
  const { enabled, location, setEnabled } = useBackgroundGeolocation()

  const [markerComponent, setMarkerComponent] = useState(false)

  const handleTouchStart = (e) => {
    setMarkerComponent(true)
  }

  const handleTouchEnd = (e) => {
    setMarkerComponent(false)
  }

  const linkProps = useLink({
    href: `/marker/selectMarker`,
  })

  return (
    <>
      <MapBoxComponent location={[[127.9321, 36.9735], 'hello']} />
      <YStack
        f={1}
        ai="center"
        gap="$4"
        w="100%"
        h="100%"
        p="$2"
        zIndex={markerComponent ? -1 : 1}
        pos="absolute"
        onPress={handleTouchStart}
      >
        <XStack
          backgroundColor="$blue10"
          p="$2.5"
          m={2}
          gap="$0"
          jc="space-evenly"
          w="80%"
          borderRadius="$10"
          mt="$3"
        >
          <SizableText size="$4" fontWeight="800" color="$white1">
            정보
          </SizableText>
          <Separator alignSelf="stretch" vertical marginHorizontal={15} />
          <SizableText size="$4" fontWeight="800" color="$white1">
            마커
          </SizableText>
          <Separator alignSelf="stretch" vertical marginHorizontal={15} />
          <SizableText size="$4" fontWeight="800" color="$white1">
            사진
          </SizableText>
        </XStack>
        <Stack
          borderColor="$black075"
          borderWidth="$1"
          alignSelf="flex-start"
          p="$4"
          mx="$5"
          mt="90%"
          width="$15"
          height="$20"
        >
          <XStack gap="$3" ai="flex-start" jc="center">
            <Piano size="$3" />
            <YStack alignContent="center" w="80%">
              <SizableText size="$8">Hello</SizableText>
              <Paragraph size="$1">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet enim quia debitis
                fuga sequi minima quod officia expedita nostrum qui eligendi
              </Paragraph>
            </YStack>
          </XStack>
        </Stack>
        <XStack f={2} jc="space-between" ai="flex-end" gap="$4" p={2} w="100%" m={2}>
          <Button {...linkProps} icon={PlusCircle}></Button>
          <SheetDemo />
          <Button icon={Trash} onPress={() => router.back()}></Button>
        </XStack>
      </YStack>
      {markerComponent && (
        <YStack zIndex={2} position="absolute" bottom={0} right={0}>
          <Button onPress={handleTouchEnd} bottom={0}>
            Back to the marker
          </Button>
        </YStack>
      )}
    </>
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
