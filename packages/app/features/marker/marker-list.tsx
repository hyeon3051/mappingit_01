import {
  Button,
  Paragraph,
  XStack,
  YStack,
  SizableText,
  Separator,
  Stack,
  useToastController,
  Sheet,
  Card,
  H2,
  ScrollView,
} from '@my/ui'
import { PlusCircle, FileEdit, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import MapBoxComponent from 'packages/app/provider/MapBox'
import { useContext, useEffect, useRef, useState } from 'react'
import { useLink } from 'solito/navigation'
import MapboxGL from '@rnmapbox/maps'
import TamaIcon from 'packages/app/ui/Icon'
import { fileState } from 'packages/app/contexts/mapData/fileReducer'
import Carousel from 'react-native-reanimated-carousel'
import { Marker } from 'packages/app/types/type'

function CardDemo({ title, description, markerIcon, markerColor }) {
  return (
    <Card size="$4" width="100%" height="90%" backgroundColor="$black0" m="$2" p="$2">
      <Card.Header padded>
        <Paragraph></Paragraph>
      </Card.Header>
      <Stack
        borderColor="$white075"
        backgroundColor="$white075"
        borderWidth="$1"
        alignSelf="flex-start"
        py="$4"
        width="$15"
        height="$20"
      >
        <XStack gap="$3" ai="flex-start" jc="center" px="$4">
          <TamaIcon iconName={markerIcon} color={markerColor} size="$3" />
          <YStack alignContent="center" w="80%">
            <SizableText size="$8">{title}</SizableText>
            <Paragraph size="$1">{description}</Paragraph>
          </YStack>
        </XStack>
      </Stack>
      <Card.Footer padded>
        <XStack flex={1} />
      </Card.Footer>
    </Card>
  )
}

export function MarkerView() {
  const carouselRef = useRef(null)
  const [idx, setIdx] = useState(-1)
  const [selectedMarker, setSelectedMarker] = useState<Marker>({
    id: '',
    title: '',
    description: '',
    pos: [127.9321, 36.9735],
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
    const markers = fileInfo?.markers || []
    const tempSelectedMarker = markers[idx] || { pos: [127.9321, 36.9735] }
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
        <Button {...linkProps} icon={PlusCircle}></Button>
        <SheetDemo onChangeIdx={onChageIdx} />
        <Button {...editLinkProps} icon={FileEdit}></Button>
      </XStack>
    </>
  )
}

function SheetDemo({ onChangeIdx }) {
  const toast = useToastController()

  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)

  const fileInfo = useContext(fileState)

  return (
    <>
      <Button
        size="$6"
        icon={open ? ChevronDown : ChevronUp}
        circular
        onPress={() => setOpen((x) => !x)}
      />
      <Sheet
        modal
        animation="medium"
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Handle bg="$gray8" />
        <Sheet.Frame ai="center" gap="$5" bg="$color2" p="$2">
          <XStack gap="$4">
            <Paragraph ta="center">
              <H2>MarkerList</H2>
            </Paragraph>
          </XStack>
          <ScrollView w="100%">
            {fileInfo?.markers.map((marker, idx) => (
              <XStack gap="$2" p="$2" w="90%" m={20} ai="center">
                <Button
                  size="$5"
                  circular
                  onPress={() => {
                    onChangeIdx(idx)
                    setOpen(false)
                  }}
                  iconAfter={
                    <TamaIcon iconName={marker.markerIcon} color={marker.markerColor} size="$6" />
                  }
                />
                <YStack gap="$2" ml={20}>
                  <H2>{marker.title || 'example'}</H2>
                  <Paragraph>{marker.description}</Paragraph>
                </YStack>
              </XStack>
            ))}
          </ScrollView>
          <Button
            size="$6"
            circular
            icon={ChevronDown}
            onPress={() => {
              setOpen(false)
              toast.show('Sheet closed!', {
                message: 'Just showing how toast works...',
              })
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
