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
} from '@my/ui'
import TamaIcon from 'packages/app/ui/Icon'
import { useEffect, useRef, useState } from 'react'
import { useLink, useRouter } from 'solito/navigation'

export function AddMarkerView() {
  const [markerIcon, setMarkerIcon] = useState({
    icon: '',
    color: '',
  })

  const iconRef = useRef('')
  const colorRef = useRef('')
  const router = useRouter()

  const linkProps = useLink({
    href: `/marker/addMarker`,
  })
  useEffect(() => {
    console.log(markerIcon)
  }, [markerIcon])

  return (
    <YStack f={1} ai="center" gap="$0" w="100%" h="100%" jc="flex-start">
      <Stack p="$2" gap="$5" jc="flex-start" mt="$2" w="100%">
        <Paragraph>즐겨찾기</Paragraph>
        <XStack gap="$3" jc="space-around">
          {['PinOff', 'PinOff', 'PinOff', 'PinOff'].map((iconName, index) => (
            <Button
              key={index}
              size="$7"
              circular
              focusStyle={{
                backgroundColor: 'black',
              }}
              iconAfter={<TamaIcon iconName={iconName} size="$6" />}
              onPress={() => setMarkerIcon({ ...markerIcon, icon: iconName })}
            />
          ))}
        </XStack>
      </Stack>
      <Stack p="$2" gap="$5" jc="flex-start" mt="$2" w="100%">
        <Paragraph>마커</Paragraph>
        <XStack gap="$5" jc="space-around" flexWrap="wrap">
          {[
            'PinOff',
            'Eraser',
            'AArrowUp',
            'MapPinOff',
            'MapPin',
            'Pin',
            'TreePine',
            'ShoppingBag',
          ].map((iconName, index) => (
            <Button
              key={index}
              size="$6"
              circular
              animation="bouncy"
              animatePresence
              iconAfter={
                <TamaIcon
                  iconName={iconName}
                  size="$6"
                  color={iconName === markerIcon.icon ? '$gray10' : undefined}
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