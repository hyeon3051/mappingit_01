import { Button, Paragraph, XStack, YStack, Stack, Square, ScrollView } from '@my/ui'
import TamaIcon from 'packages/app/ui/Icon'
import { useRouter } from 'solito/navigation'
import { useIconStore } from 'packages/app/store/icon'
import { usecolorStore } from 'packages/app/store/color'
export function IconEdit() {
  const router = useRouter()
  const { icons, removeIcon } = useIconStore()
  const packageIcons = import('@tamagui/lucide-icons')
  const iconsName = Object.keys(packageIcons)
  const { colors, removecolor } = usecolorStore()
  return (
    <>
      <ScrollView>
        <YStack f={1} ai="center" gap="$0" w="100%" h="100%" jc="flex-start" p="$2" m="$2">
          <Stack p="$2" gap="$2" jc="flex-start" mt="$2" w="100%">
            <Paragraph>아이콘 추가</Paragraph>
            <XStack gap="$4" jc="flex-start" flexWrap="wrap">
              {iconsName.map((iconName: string, index) => (
                <YStack key={index} className="relative">
                  <TamaIcon iconName={iconName} size="$7" />
                  <Button
                    position="absolute"
                    top={'-10%'}
                    left={'-10%'}
                    animateOnly={['opacity']}
                    size="$1"
                    bg="$black12"
                    circular
                    onPress={() => removeIcon(iconName)}
                  >
                    <TamaIcon iconName="X" size="$1" color="$black10" />
                  </Button>
                </YStack>
              ))}
            </XStack>
          </Stack>
        </YStack>
      </ScrollView>
      <XStack f={2} jc="space-around" ai="flex-end" gap="$4" p={2} w="100%" m={2}>
        <Button icon={<TamaIcon iconName="PlusCircle" />}>정보 입력</Button>
        <Button icon={<TamaIcon iconName="ChevronLeft" />} onPress={() => router.back()}>
          돌아가기
        </Button>
      </XStack>
    </>
  )
}
