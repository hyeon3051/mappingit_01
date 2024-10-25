import { Button, XStack, SizableText, Card, Stack, YStack, Paragraph, Image } from '@my/ui'
import { PlusCircle, FileEdit, X, MonitorSpeaker } from '@tamagui/lucide-icons'
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
import useBackgroundGeolocation from 'packages/app/services/BackGroundGelocation'
import { TabView, SceneMap } from 'react-native-tab-view'
import { useWindowDimensions } from 'react-native'
import { create } from 'zustand'

interface MarkerState {
  marker: Marker
  updateMarker: (marker: Marker) => void
}

const useMarkerState = create<MarkerState>((set) => ({
  marker: {
    id: 'current',
    title: '',
    description: '',
    pos: [[127.001, 37.001], ''],
    markerIcon: 'PinOff',
    markerColor: '$black10',
  },
  updateMarker(marker) {
    set({ marker })
  },
}))

const MarkerOnMap = () => {
  const fileInfo = useContext(fileState)
  const { marker } = useMarkerState()
  console.log(marker)
  return (
    <MapBoxComponent location={marker?.id && marker.pos ? marker.pos : fileInfo?.pos}>
      <MapboxGL.PointAnnotation
        coordinate={marker?.pos[0]}
        key={marker.id ? 'marker-' + marker.id.toString() : 'current'}
        id={marker.id ? 'marker-' + marker.id.toString() : 'current'}
      >
        <TamaIcon
          iconName={marker?.markerIcon || 'PinOff'}
          color={marker?.markerColor || '$black10'}
        />
      </MapboxGL.PointAnnotation>
    </MapBoxComponent>
  )
}

const MarkerListView = () => {
  const carouselRef = useRef(null)
  const [idx, setIdx] = useState(0)
  const { location: currLocation } = useBackgroundGeolocation()
  const { marker, updateMarker } = useMarkerState()
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
      carouselRef.current.scrollTo({ index: index - 1 })
    }
  }
  useEffect(() => {
    const markers = fileInfo?.markers || []
    const tempSelectedMarker = idx !== 0 ? markers[idx - 1] : { pos: currLocation }
    updateMarker(tempSelectedMarker)
  }, [idx])
  return (
    <>
      <Stack top={25} flex={1} zIndex={3} pos="absolute" width="100%" ai="center"></Stack>
      <Stack zIndex={3} pos="absolute" left={0} bottom={100}>
        <Carousel
          loop={false}
          width={224}
          ref={carouselRef}
          height={300}
          vertical={true}
          data={fileInfo?.markers.map((data) => {
            return {
              ...data,
              key: data.id,
            }
          })}
          scrollAnimationDuration={100}
          onSnapToItem={(index) => {
            setIdx(index + 1)
          }}
          renderItem={(data) => {
            const { title, description, markerIcon, markerColor, id } = data.item
            return (
              <CardDemo
                title={title}
                description={description}
                markerIcon={markerIcon}
                markerColor={markerColor}
                key={id}
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
        {idx !== 0 ? (
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

const MarkerInfoView = () => {
  const { marker } = useMarkerState()
  const markerDate = new Date(marker?.pos[1]) || new Date()
  const markerTimeStr = markerDate.toLocaleTimeString()
  const markerDateStr = markerDate.toLocaleDateString()
  return (
    <>
      <Stack zIndex={3} pos="absolute" left={0} bottom={20}>
        <Card size="$4" width="100%" height="100%" backgroundColor="$black0" mx="$2" px="$2">
          <Card.Header padded>
            <Paragraph></Paragraph>
          </Card.Header>
          <Stack
            borderColor="$white075"
            backgroundColor="$white075"
            borderWidth="$1"
            width="$15"
            height="$20"
          >
            <XStack gap="$3" ai="flex-start" jc="center" px="$4">
              <YStack alignContent="center" w="80%">
                <SizableText size="$8">{marker?.title}</SizableText>
                <Paragraph size="$1">{marker?.description}</Paragraph>
                <Paragraph size="$1">{markerDateStr}</Paragraph>
                <Paragraph size="$1">{markerTimeStr}</Paragraph>
              </YStack>
            </XStack>
          </Stack>
          <Card.Footer></Card.Footer>
        </Card>
      </Stack>
    </>
  )
}

export function CardImage({ uri }) {
  return (
    <Card size="$4" width="100%" height="90%" backgroundColor="$black0" m="$2" p="$2">
      <Image source={{ uri: uri, width: 420, height: 324 }} />
      <Card.Footer>
        <XStack flex={1} m="$2" jc="flex-end" px="$4">
          <Button size="$3" icon={<TamaIcon iconName="Check" size="$2" />} px="$4" />
        </XStack>
      </Card.Footer>
    </Card>
  )
}

const MakerImageView = () => {
  const { marker } = useMarkerState()
  return (
    <Stack zIndex={3} pos="absolute" left={0} bottom={20}>
      <Carousel
        loop={true}
        modeConfig={{
          mode: 'stack',
          stackInterval: 18,
        }}
        mode="horizontal-stack"
        width={420}
        height={324}
        scrollAnimationDuration={100}
        data={typeof marker?.imageUri === 'string' ? [marker?.imageUri] : marker?.imageUri}
        renderItem={({ item }) => <CardImage uri={item} />}
      />
    </Stack>
  )
}

const renderScreen = SceneMap({
  markerInfo: MarkerInfoView,
  markerList: MarkerListView,
  markerImage: MakerImageView,
})
export function MarkerView() {
  const layout = useWindowDimensions()
  const [tabIdx, setTabIdx] = useState(1)
  const [zIndex, setZIndex] = useState(1)
  const [routes] = useState([
    { key: 'markerInfo', title: 'info' },
    { key: 'markerList', title: 'Marker' },
    { key: 'markerImage', title: 'Image' },
  ])
  return (
    <>
      <MarkerOnMap />
      <TabView
        navigationState={{
          index: tabIdx,
          routes,
        }}
        style={{ width: '100%', height: '90%', zIndex: zIndex }}
        renderScene={renderScreen}
        onIndexChange={setTabIdx}
        initialLayout={{ width: layout.width, height: layout.height }}
      />
      <Button
        onPress={() => setZIndex(zIndex === 1 ? 10 : 1)}
        backgroundColor={'$white10'}
        zIndex={10}
      >
        press the map view
      </Button>
    </>
  )
}
