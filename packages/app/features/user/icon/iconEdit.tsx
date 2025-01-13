import {
  Button,
  Paragraph,
  XStack,
  YStack,
  Stack,
  Square,
  ScrollView,
  Select,
  Checkbox,
} from '@my/ui'
import TamaIcon from 'packages/app/ui/Icon'
import * as Icons from '@tamagui/lucide-icons'
import { useRouter } from 'solito/navigation'
import { useIconStore } from 'packages/app/store/icon'
import { usecolorStore } from 'packages/app/store/color'
import { markerIcons } from 'packages/app/icons'
import { useEffect, useState } from 'react'
export function IconEdit() {
  const [staticIcons, setStaticIcons] = useState([])
  const router = useRouter()
  const { icons, addIcon, removeIcon } = useIconStore()
  const { colors, removecolor } = usecolorStore()

  const stringToColor = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    let color = '#'
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      color += value.toString(16).padStart(2, '0')
    }
    return color
  }

  useEffect(() => {
    setStaticIcons(
      markerIcons?.map((icon) => {
        return {
          iconName: icon,
          isSelected: icons.includes(icon),
        }
      })
    )
  }, [icons])

  const handleIcon = (iconName: string) => {
    addIcon(iconName)
    setStaticIcons(
      staticIcons.map((icon) => {
        return {
          ...icon,
          isSelected: iconName === icon.iconName,
        }
      })
    )
  }

  const handleRemoveIcon = (iconName: string) => {
    removeIcon(iconName)
    setStaticIcons(
      staticIcons.map((icon) => {
        return {
          ...icon,
          isSelected: iconName !== icon.iconName,
        }
      })
    )
  }

  const handleIconChange = (iconName: string) => {
    if (icons?.includes(iconName)) {
      handleRemoveIcon(iconName)
    } else {
      handleIcon(iconName)
    }
  }
  return (
    <>
      <ScrollView>
        <YStack f={1} ai="center" gap="$0" w="100%" h="100%" jc="flex-start" p="$2" m="$2">
          <Stack p="$2" gap="$2" jc="flex-start" mt="$2" w="100%">
            <Paragraph>현재 아이콘</Paragraph>
            <XStack gap="$4" jc="flex-start" flexWrap="wrap">
              {staticIcons.map((iconName: { iconName: string; isSelected: boolean }, index) => (
                <YStack key={index} className="relative">
                  <TamaIcon
                    iconName={iconName.iconName}
                    size="$7"
                    color={iconName.isSelected ? stringToColor(iconName.iconName) : 'unset'}
                  />
                  <Checkbox
                    position="absolute"
                    onCheckedChange={() => handleIconChange(iconName.iconName)}
                    checked={iconName.isSelected}
                    top={'-10%'}
                    left={'-10%'}
                    animateOnly={['opacity']}
                    size="$1"
                    circular
                  >
                    <Checkbox.Indicator>
                      <TamaIcon iconName="Check" size="$1" />
                    </Checkbox.Indicator>
                  </Checkbox>
                </YStack>
              ))}
            </XStack>
          </Stack>
          <Stack p="$2" gap="$5" jc="flex-start" mt="$2" w="100%">
            <Paragraph>현재 색상</Paragraph>
            <XStack gap="$4" jc="flex-start" flexWrap="wrap">
              {colors?.map((color, index) => (
                <Stack key={index} className="relative">
                  <Square size="$7" backgroundColor={color} />
                  <Button
                    position="absolute"
                    top={'-10%'}
                    left={'-10%'}
                    animateOnly={['opacity']}
                    size="$1"
                    bg="$black12"
                    circular
                    onPress={() => removecolor(color)}
                  >
                    <TamaIcon iconName="X" size="$1" color="$black10" />
                  </Button>
                </Stack>
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
