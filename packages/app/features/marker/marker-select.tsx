import { Button, Paragraph, XStack, YStack, Stack, Square, ScrollView, H6 } from '@my/ui'
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
  const marker = parseInt(`${params.marker}`)
  useEffect(() => {
    if (marker !== -1 && fileInfo?.markers[marker]) {
      const { markerIcon, markerColor, id } = fileInfo?.markers[marker]
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
    if (!marker) return
    dispatch({
      type: 'REMOVE_MARKER',
      payload: { markerId: marker },
    })
    router.back()
  }

  return (
    <>
      <ScrollView>
        <YStack f={1} ai="center" gap="$5" w="100%" h="100%" jc="flex-start" p="$2" pb="$14">
          <Stack p="$2" gap="$5" jc="flex-start" mt="$2" w="100%">
            <H6>마커</H6>
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
          <Stack p="$2" gap="$5" jc="flex-start" mt="$2" w="100%">
            <H6>색상</H6>
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
          icon={<TamaIcon iconName="ChevronLeft" />}
          onPress={() => router.back()}
          bg="$gray10"
          opacity={0.8}
        >
          뒤로
        </Button>
        {marker !== -1 ? (
          <Button
            {...linkProps}
            icon={<TamaIcon iconName="PlusCircle" />}
            bg="$blue10"
            opacity={0.8}
          >
            수정
          </Button>
        ) : (
          <Button
            {...linkProps}
            bg="$green10"
            icon={<TamaIcon iconName="PlusCircle" />}
            opacity={0.8}
          >
            추가
          </Button>
        )}
        {marker !== -1 ? (
          <Button
            icon={<TamaIcon iconName="Trash" />}
            onPress={handleRemove}
            bg="$red10"
            opacity={0.8}
          >
            삭제
          </Button>
        ) : (
          <Button bg="$blue10" opacity={0.8}>
            현재 마커
          </Button>
        )}
      </XStack>
    </>
  )
}
