import { Button, Paragraph, XStack, YStack, Stack, Square, ScrollView } from '@my/ui'
import { fileDispatch, fileState } from 'packages/app/contexts/mapData/fileReducer'
import { selectedIcon } from 'packages/app/types/type'
import TamaIcon from 'packages/app/ui/Icon'
import { useContext, useEffect, useState } from 'react'
import { useLink, useRouter, useParams } from 'solito/navigation'
import { useIconStore } from 'packages/app/store/icon'
import { usecolorStore } from 'packages/app/store/color'

export function SelectMarkerView() {
  const { icons } = useIconStore()
  const { colors } = usecolorStore()
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
    router.back()
  }


  return (
    <>
      <ScrollView>
        <YStack f={1} ai="center" gap="$0" w="100%" h="100%" jc="flex-start" p="$2">
          <Stack p="$2" gap="$5" jc="flex-start" mt="$2" w="100%">
            <Paragraph>즐겨찾기</Paragraph>
            <XStack gap="$5" jc="flex-start" flexWrap="wrap">
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
            <XStack gap="$5" jc="space-around" flexWrap="wrap">
              {icons?.map((iconName: string, index) => (
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
          <Stack p="$2" gap="$2" jc="flex-start" mt="$2" w="100%">
            <Paragraph>색상</Paragraph>
            <XStack gap="$5" jc="flex-start" flexWrap="wrap">
              {colors?.map((color, index) => (
                <Square
                  key={index}
                  size="$7"
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
        {marker !== 0 && (
          <Button icon={<TamaIcon iconName="Trash" />} onPress={handleRemove}>
            삭제
          </Button>
        )}
      </XStack>
    </>
  )
}
