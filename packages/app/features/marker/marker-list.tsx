import { Button, XStack, SizableText, Separator, Stack } from '@my/ui'
import { PlusCircle, FileEdit } from '@tamagui/lucide-icons'
import MapBoxComponent from 'packages/app/provider/MapBox'
import { useContext, useEffect, useRef, useState } from 'react'
import { useLink } from 'solito/navigation'
import MapboxGL from '@rnmapbox/maps'
import TamaIcon from 'packages/app/ui/Icon'
import { fileState } from 'packages/app/contexts/mapData/fileReducer'
import Carousel from 'react-native-reanimated-carousel'
import { Marker } from 'packages/app/types/type'
import { CardDemo } from 'packages/app/component/CardDemo'
import { SheetDemo } from 'packages/app/component/SheetDemo'

export function MarkerView() {
  const carouselRef = useRef(null)
  const [idx, setIdx] = useState(-1)
  const [selectedMarker, setSelectedMarker] = useState<Marker>({
    id: '',
    title: '',
    description: '',
    pos: [127, 38],
    markerIcon: 'PinOff',
    markerColor: '$black10',
  })
  const fileInfo = useContext(fileState)

  const linkProps = useLink({
    href: `/marker/selectMarker`,
  })

  const editLinkProps = useLink({
    href: `/marker/selectMarker/?marker=${idx}`,
  })

  const onChageIdx = (index) => {
    setIdx(index)
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ index })
    }
  }
  useEffect(() => {
    setSelectedMarker((prev) => ({
      ...prev,
      pos: fileInfo?.currentRoute[fileInfo.currentRoute.length - 1]?.[0],
    }))
  }, [fileInfo])
  useEffect(() => {
    const markers = fileInfo?.markers || []
    const tempSelectedMarker = markers[idx] || { pos: [127, 38] }
    setSelectedMarker(tempSelectedMarker)
  }, [idx])
  return (
    <>
      <MapBoxComponent location={[selectedMarker.pos, '']} zoomLevel={20}>
        <MapboxGL.PointAnnotation
          coordinate={selectedMarker.pos}
          key={selectedMarker.id || '1'}
          id="pt-ann"
        >
          <TamaIcon
            iconName={selectedMarker.markerIcon || 'PinOff'}
            color={selectedMarker.markerColor || '$black10'}
          />
        </MapboxGL.PointAnnotation>
      </MapBoxComponent>
      <Stack top={25} flex={1} zIndex={3} pos="absolute" width="100%" ai="center">
        <XStack
          backgroundColor="$blue10"
          f={2}
          w="80%"
          jc="space-around"
          p="$2"
          m="$2"
          borderRadius="$10"
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
      </Stack>
      <Stack zIndex={3} pos="absolute" left={0} bottom={100}>
        <Carousel
          loop={false}
          width={224}
          ref={carouselRef}
          height={300}
          vertical={true}
          data={fileInfo?.markers}
          scrollAnimationDuration={100}
          onSnapToItem={(index) => {
            setIdx(index)
          }}
          renderItem={(data) => {
            const { title, description, markerIcon, markerColor } = data.item
            return (
              <CardDemo
                title={title}
                description={description}
                markerIcon={markerIcon}
                markerColor={markerColor}
              />
            )
          }}
        />
      </Stack>
      <XStack
        f={2}
        jc="space-between"
        gap="$4"
        w="100%"
        zIndex={3}
        pos="absolute"
        bottom={0}
        left={0}
        p="$4"
        right={0}
      >
        <Button {...linkProps} icon={PlusCircle}>
          추가
        </Button>
        <SheetDemo onChangeIdx={onChageIdx} data={fileInfo?.markers} type="marker" />
        {idx !== -1 ? (
          <Button {...editLinkProps} icon={FileEdit}>
            수정
          </Button>
        ) : (
          <Button>현재 마커</Button>
        )}
      </XStack>
    </>
  )
}
