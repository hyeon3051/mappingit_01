import { Button, Paragraph, XStack, YStack, Stack, Square, ScrollView } from '@my/ui'
import { fileDispatch, fileState } from 'packages/app/contexts/mapData/fileReducer'
import { selectedIcon } from 'packages/app/types/type'
import TamaIcon from 'packages/app/ui/Icon'
import { useContext, useEffect, useState } from 'react'
import { useLink, useRouter, useParams } from 'solito/navigation'

export function SelectMarkerView() {
  const [markerIcon, setMarkerIcon] = useState<selectedIcon>({
    icon: '',
    color: '$black10',
  })
  const fileInfo = useContext(fileState)
  const dispatch = useContext(fileDispatch)

  const params = useParams()
  const marker = parseInt(`${params.marker}` || '-1')

  useEffect(() => {
    if (marker !== -1 && fileInfo?.markers[marker - 1]) {
      const { markerIcon, markerColor } = fileInfo?.markers[marker - 1]
      setMarkerIcon({
        icon: markerIcon,
        color: markerColor,
      })
    }
  }, [params])

  const router = useRouter()

  const linkProps = useLink({
    href: `/marker/addMarker/${markerIcon.color}/${markerIcon.icon}/?marker=${marker}`,
  })

  const handleRemove = () => {
    if (marker !== -1) return
    dispatch({
      type: 'REMOVE_MARKER',
      payload: { markerId: marker },
    })
    router.replace('/marker/marker')
  }

  return (
    <>
      <ScrollView>
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
          <Stack p="$2" gap="$2" jc="flex-start" mt="$2" w="100%">
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
        </YStack>
      </ScrollView>
      <XStack f={2} jc="space-around" ai="flex-end" gap="$4" p={2} w="100%" m={2}>
        <Button
          {...(marker !== -1 ? { ...linkProps } : {})}
          icon={<TamaIcon iconName="PlusCircle" />}
        >
          정보 입력
        </Button>
        <Button icon={<TamaIcon iconName="ChevronLeft" />} onPress={() => router.back()}>
          돌아가기
        </Button>
        {marker !== -1 && (
          <Button icon={<TamaIcon iconName="Trash" />} onPress={handleRemove}>
            삭제
          </Button>
        )}
      </XStack>
    </>
  )
}
