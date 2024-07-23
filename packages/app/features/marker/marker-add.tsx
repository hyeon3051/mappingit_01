import { Button, Paragraph, XStack, YStack, SizableText, Separator, Stack, Square } from '@my/ui'
import {
  ChevronLeft,
  PlusCircle,
  Trash,
  Piano,
  PinOff,
  Eraser,
  AArrowUp,
} from '@tamagui/lucide-icons'
import { useLink, useRouter } from 'solito/navigation'

export function AddMarkerView() {
  const router = useRouter()

  const linkProps = useLink({
    href: `/marker/addMarker`,
  })

  return (
    <YStack f={1} ai="center" gap="$0" w="100%" h="100%" jc="flex-start">
      <Stack p="$2" gap="$5" jc="center" alignContent="center" borderRadius="$10" mt="$2">
        <Paragraph>즐겨찾기</Paragraph>
        <XStack gap="$3">
          <PinOff size="$6" backgroundColor="$red10" borderRadius="$5" />
          <PinOff size="$6" />
          <PinOff size="$6" />
          <PinOff size="$6" />
        </XStack>
      </Stack>
      <Stack p="$2" gap="$5" jc="center" alignContent="center" borderRadius="$10" mt="$2">
        <Paragraph>마커</Paragraph>
        <XStack gap="$3">
          <PinOff size="$6" />
          <Eraser size="$6" />
          <AArrowUp size="$6" />
          <PinOff size="$6" />
        </XStack>
        <XStack gap="$3">
          <PinOff size="$6" />
          <Piano size="$6" />
          <Eraser size="$6" />
          <PinOff size="$6" />
        </XStack>
        <XStack gap="$3">
          <PinOff size="$6" />
          <Piano size="$6" />
          <Eraser size="$6" />
          <AArrowUp size="$6" />
          <PinOff size="$6" />
        </XStack>
      </Stack>
      <Stack p="$2" gap="$5" jc="center" alignContent="center" borderRadius="$10" mt="$2">
        <Paragraph>색상</Paragraph>
        <XStack gap="$3">
          <Square size="$6" backgroundColor="$red10" elevation="$5" />
          <Square size="$6" backgroundColor="$blue10" />
          <Square size="$6" backgroundColor="$purple10" />
          <Square size="$6" backgroundColor="$green10" />
        </XStack>
        <XStack gap="$3">
          <Square size="$6" backgroundColor="$red10" />
          <Square size="$6" backgroundColor="$blue10" />
          <Square size="$6" backgroundColor="$purple10" />
          <Square size="$6" backgroundColor="$green10" />
        </XStack>
      </Stack>
      <XStack f={2} jc="space-between" ai="flex-end" gap="$4" p={2} w="100%" m={2}>
        <Button {...linkProps} icon={PlusCircle}></Button>
        <Button icon={ChevronLeft} onPress={() => router.back()}></Button>
        <Button icon={Trash} onPress={() => router.back()}></Button>
      </XStack>
    </YStack>
  )
}
