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
  Anchor,
  Card,
  Image,
  H2,
  ScrollView,
  H1,
} from '@my/ui'
import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Trash,
  FileEdit,
  Piano,
  ChevronDown,
  ChevronUp,
} from '@tamagui/lucide-icons'
import MapBoxComponent from 'packages/app/provider/MapBox'
import useBackgroundGeolocation from 'packages/app/services/BackGroundGelocation'
import { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { useLink, useRouter } from 'solito/navigation'
import MapboxGL, { Camera } from '@rnmapbox/maps'
import TamaIcon from 'packages/app/ui/Icon'
import { fileState } from 'packages/app/contexts/mapData/fileReducer'
import Carousel from 'react-native-reanimated-carousel'
import { Dimensions } from 'react-native'
import { Route } from 'packages/app/types/type'

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

export function RouteView() {
  const router = useRouter()
  const { enabled, location, setEnabled } = useBackgroundGeolocation()
  const carouselRef = useRef(null)
  const [idx, setIdx] = useState(-1)
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

  const calculateZoomLevel = (start, end) => {
    if (!start || !end) return 10 // Default zoom level

    const distance = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2))

    // Simple heuristic for zoom level based on distance
    if (distance < 0.01) return 15
    if (distance < 0.1) return 12
    return 10
  }

  const startLocation = fileInfo?.routes[idx]?.path[0] || [[127.9321, 36.9735], '']
  const endLocation = fileInfo?.routes[idx]?.path[fileInfo.routes[idx].path.length - 1] || [
    [127.9321, 36.9735],
    '',
  ]
  const zoomLevel = calculateZoomLevel(startLocation, endLocation)
  const routeId = fileInfo?.routes[idx]?.id || '1'

  return (
    <>
      <MapBoxComponent location={startLocation} zoomLevel={zoomLevel}>
        <MapboxGL.PointAnnotation coordinate={startLocation[0]} key="start" id="pt-ann">
          <TamaIcon iconName="mapPin" color="$black10" />
        </MapboxGL.PointAnnotation>
        <MapboxGL.PointAnnotation coordinate={endLocation[0]} key="end" id="pt-ann">
          <TamaIcon iconName="mapPinOff" color="$black10" />
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
            console.log('current index:', index)
            setIdx(index)
          }}
          renderItem={(data) => {
            return (
              <CardDemo
                title={data.item.title}
                description={data.item.description}
                markerIcon={data.item.markerIcon}
                markerColor={data.item.markerColor}
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
