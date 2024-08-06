import {
  Button,
  Paragraph,
  XStack,
  YStack,
  SizableText,
  Separator,
  Stack,
  Square,
  ButtonIcon,
  useEvent,
} from '@my/ui'
import { Scale } from '@tamagui/lucide-icons'
import { selectedIcon } from 'packages/app/types/type'
import TamaIcon from 'packages/app/ui/Icon'
import { useEffect, useRef, useState } from 'react'
import { useLink, useRouter, useParams, useUpdateSearchParams } from 'solito/navigation'

export function SelectMarkerView() {
  const [markerIcon, setMarkerIcon] = useState<selectedIcon>({
    icon: '',
    color: '$white0',
  })

  const router = useRouter()

  const linkProps = useLink({
    href: `/marker/addMarker/${markerIcon.color}/${markerIcon.icon}`,
  })

  useEffect(() => {}, [markerIcon])

  return (
    <YStack f={1} ai="center" gap="$0" w="100%" h="100%" jc="flex-start" p="$2">
      <Stack p="$2" gap="$5" jc="flex-start" mt="$2" w="100%">
        <Paragraph>즐겨찾기</Paragraph>
        <XStack gap="$3" jc="space-around">
          {['PinOff', 'PinOff', 'PinOff', 'PinOff'].map((iconName, index) => (
            <Button
              key={index}
              size="$7"
              circular
              iconAfter={<TamaIcon iconName={iconName} size="$6" />}
              onPress={() => setMarkerIcon({ ...markerIcon, icon: iconName })}
            />
          ))}
        </XStack>
      </Stack>
      <Stack p="$2" gap="$5" jc="flex-start" mt="$2" w="100%">
        <Paragraph>마커</Paragraph>
        <XStack gap="$2" jc="space-around" flexWrap="wrap">
          {[
            'PinOff',
            'Eraser',
            'AArrowUp',
            'MapPinOff',
            'MapPin',
            'Pin',
            'TreePine',
            'ShoppingBag',
          ].map((iconName: string, index) => (
            <Button
              key={index}
              size="$7"
              animation="medium"
              circular
              icon={
                <TamaIcon
                  iconName={iconName}
                  size="$6"
                  color={iconName === markerIcon.icon ? markerIcon.color : ''}
                />
              }
              onPress={() => setMarkerIcon({ ...markerIcon, icon: iconName })}
            />
          ))}
        </XStack>
      </Stack>
      <Stack p="$2" gap="$5" jc="flex-start" mt="$2" w="100%">
        <Paragraph>색상</Paragraph>
        <XStack gap="$3" jc="space-around">
          {['$red10', '$blue10', '$purple10', '$green10'].map((color, index) => (
            <Square
              key={index}
              size="$8"
              hoverStyle={{
                scale: 1.5,
              }}
              pressStyle={{
                scale: 0.9,
              }}
              onPress={() =>
                setMarkerIcon({
                  ...markerIcon,
                  color,
                })
              }
              backgroundColor={color}
              elevation={color === '$red10' ? '$5' : undefined}
            />
          ))}
        </XStack>
        <XStack gap="$3" jc="space-around">
          {['$red10', '$blue10', '$purple10', '$green10'].map((color, index) => (
            <Square
              key={index}
              size="$8"
              onPress={() =>
                setMarkerIcon({
                  ...markerIcon,
                  color,
                })
              }
              backgroundColor={color}
              elevation={color === '$red10' ? '$5' : undefined}
            />
          ))}
        </XStack>
      </Stack>
      <XStack f={2} jc="space-between" ai="flex-end" gap="$4" p={2} w="100%" m={2}>
        <Button {...linkProps} icon={<TamaIcon iconName="PlusCircle" />}></Button>
        <Button icon={<TamaIcon iconName="ChevronLeft" />} onPress={() => router.back()}></Button>
        <Button icon={<TamaIcon iconName="Trash" />} onPress={() => router.back()}></Button>
      </XStack>
    </YStack>
  )
}
