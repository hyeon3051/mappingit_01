import { Button, Paragraph, XStack, YStack, SizableText, Separator, Stack } from '@my/ui'
import { ChevronLeft, PlusCircle, Trash, Piano } from '@tamagui/lucide-icons'
import { useLink, useRouter } from 'solito/navigation'

export function MarkerView() {
  const router = useRouter()

  const linkProps = useLink({
    href: `/marker/addMarker`,
  })

  return (
    <YStack f={1} ai="center" gap="$4" w="100%" h="100%">
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
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet enim quia debitis fuga
              sequi minima quod officia expedita nostrum qui eligendi
            </Paragraph>
          </YStack>
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
