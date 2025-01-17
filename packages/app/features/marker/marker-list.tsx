import {
  Button,
  XStack,
  SizableText,
  Card,
  Stack,
  YStack,
  Paragraph,
  Image,
  Text,
  Separator,
} from '@my/ui'
import { PlusCircle, FileEdit, X, MonitorSpeaker } from '@tamagui/lucide-icons'
import MapBoxComponent from 'packages/app/provider/MapBox'
import { useContext, useEffect, useRef, useState } from 'react'
import { useLink } from 'solito/navigation'
import MapboxGL from '@rnmapbox/maps'
import TamaIcon from 'packages/app/ui/Icon'
import { fileState } from 'app/contexts/mapData/fileReducer'
import Carousel from 'react-native-reanimated-carousel'
import { Marker } from 'packages/app/types/type'
import { CardDemo } from 'packages/app/component/CardDemo'
import { SheetDemo } from 'packages/app/component/SheetDemo'
import useBackgroundGeolocation from 'packages/app/services/BackGroundGelocation'
import { TabView, SceneMap } from 'react-native-tab-view'
import { useWindowDimensions } from 'react-native'
import { create } from 'zustand'
import { useColorScheme } from 'react-native'

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
  return (
    <MapBoxComponent location={marker?.id && marker.pos ? marker.pos : fileInfo?.pos}>
      <MapboxGL.PointAnnotation
        coordinate={marker?.pos[0]}
        key={marker?.id ? 'marker-' + marker.id.toString() : 'current'}
        id={marker?.id ? 'marker-' + marker.id.toString() : 'current'}
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
      carouselRef.current.scrollTo({ index: index })
    }
  }
  useEffect(() => {
    const markers = fileInfo?.markers || []
    const tempSelectedMarker = idx !== 0 ? markers[idx - 1] : { pos: currLocation }
    updateMarker(tempSelectedMarker as Marker)
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
          data={[
            {
              id: 'current',
              title: '현재 위치',
              description: '',
              pos: currLocation,
              markerIcon: 'PinOff',
              markerColor: '$black10',
            },
            ...(fileInfo?.markers.map((data) => {
              return {
                ...data,
                key: data.id,
              }
            }) || []),
          ]}
          scrollAnimationDuration={100}
          onSnapToItem={(index) => {
            console.log(index)
            setIdx(index)
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
  const colorScheme = useColorScheme()
  const { marker } = useMarkerState()
  const markerDate = new Date(marker?.pos[1]) || new Date()
  const markerTimeStr = markerDate.toLocaleTimeString()
  const markerDateStr = markerDate.toLocaleDateString()
  const hashTags = marker?.hashTags || []
  console.log(marker)
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
  return (
    <>
      <Stack zIndex={3} pos="absolute" left={0} bottom={20}>
        <Card
          width="$15"
          height="$15"
          backgroundColor={colorScheme === 'dark' ? '#000000AA' : '#ffffffAA'}
          mx="$2"
          px="$2"
          py="$2"
        >
          <Card.Header>
            <SizableText size="$5" weight="bold">
              {marker?.title}
            </SizableText>
          </Card.Header>
          <XStack ml="$2">
            {hashTags?.map((tag) => (
              <>
                <Text
                  theme="alt2"
                  size="$3"
                  key={tag}
                  mx="$2"
                  color={stringToColor(tag) + 'AA'}
                  borderRadius="$10"
                >
                  {tag}
                </Text>
                <Separator vertical />
              </>
            ))}
          </XStack>
          <Card.Footer>
            <XStack gap="$3" ai="flex-start" jc="center">
              <YStack alignContent="center" w="80%">
                <Paragraph size="$2" fontWeight="light">
                  {marker?.description}
                </Paragraph>
                <Paragraph size="$4">{markerDateStr}</Paragraph>
                <Paragraph size="$4">{markerTimeStr}</Paragraph>
              </YStack>
            </XStack>
          </Card.Footer>
        </Card>
      </Stack>
    </>
  )
}

export function CardImage({ uri }) {
  const colorScheme = useColorScheme()
  return (
    <Card
      size="$4"
      width="100%"
      height="90%"
      backgroundColor={colorScheme === 'dark' ? '$black10' : '$white10'}
      m="$2"
      p="$2"
    >
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
  const colorScheme = useColorScheme()
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
    { key: 'markerInfo', title: '정보' },
    { key: 'markerList', title: '리스트' },
    { key: 'markerImage', title: '사진' },
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
        backgroundColor={'$white100'}
        zIndex={10}
      >
        {zIndex === 1 ? '마커 뷰로 돌아가기' : '맵 뷰로 돌아가기'}
      </Button>
    </>
  )
}
