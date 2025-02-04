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
import { useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useLink } from 'solito/navigation'
import MapboxGL from '@rnmapbox/maps'
import TamaIcon from 'packages/app/ui/Icon'
import { fileState } from 'app/contexts/mapData/fileReducer'
import Carousel from 'react-native-reanimated-carousel'
import { Marker } from 'packages/app/types/type'
import { CardDemo } from 'packages/app/component/CardDemo'
import { SheetDemo } from 'packages/app/component/SheetDemo'
import { TabView, SceneMap } from 'react-native-tab-view'
import { Dimensions, useWindowDimensions } from 'react-native'
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
  const { marker } = useMarkerState()
  return (
    <MapBoxComponent location={marker?.pos || undefined}>
      {!!marker.pos && (
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
      )}
    </MapBoxComponent>
  )
}

const MarkerListView = () => {
  const carouselRef = useRef(null)
  const [idx, setIdx] = useState(-1)
  const { marker, updateMarker } = useMarkerState()
  const fileInfo = useContext(fileState)

  const linkProps = useLink({
    href: `/marker/selectMarker/?marker=-1`,
  })

  const editLinkProps = useLink({
    href: `/marker/selectMarker/?marker=${idx}`,
  })

  const onChangeIdx = useCallback(
    (index) => {
      if (carouselRef.current) {
        setIdx(index)
      }
    },
    [idx, carouselRef]
  )

  useEffect(() => {
    const tempSelectedMarker =
      idx !== -1
        ? fileInfo?.markers[idx]
        : { pos: fileInfo?.pos, markerIcon: 'PinOff', markerColor: '$black10' }
    updateMarker(tempSelectedMarker as Marker)
    carouselRef?.current?.scrollTo({
      index: idx + 1,
      animated: true,
    })
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
              pos: fileInfo?.pos,
              markerIcon: 'PinOff',
              markerColor: '$green10',
            },
            ...(fileInfo?.markers.map((data) => {
              return {
                ...data,
                hashTags: data.hashTags,
              }
            }) || []),
          ]}
          scrollAnimationDuration={500}
          onSnapToItem={(index) => {
            setIdx(index - 1)
          }}
          renderItem={(data) => {
            return (
              <CardDemo
                title={data.item.title}
                description={data.item.description}
                markerIcon={data.item.markerIcon}
                color={data.item.markerColor}
                key={data.item.id}
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
        <Button {...linkProps} icon={PlusCircle} bg="$green10" opacity={0.8}>
          추가
        </Button>
        <SheetDemo
          onChangeIdx={onChangeIdx}
          data={fileInfo?.markers}
          type="marker"
          selectedIdx={idx}
        />
        {idx !== -1 ? (
          <Button
            {...editLinkProps}
            icon={FileEdit}
            bg={marker?.markerColor || '$blue10'}
            opacity={0.8}
          >
            수정
          </Button>
        ) : (
          <Button bg="$green10" opacity={0.8}>
            현재 마커
          </Button>
        )}
      </XStack>
    </>
  )
}

const MarkerInfoView = () => {
  const colorScheme = useColorScheme()
  const { marker } = useMarkerState()
  const markerDate = marker.pos ? new Date(marker?.pos[1]) : new Date()
  const markerTimeStr = markerDate.toLocaleTimeString()
  const markerDateStr = markerDate.toLocaleDateString()
  const hashTags = marker?.hashTags
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
          height="$20"
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
          <XStack ml="$2" flexWrap="wrap" gap="$2">
            {Array.isArray(hashTags) &&
              hashTags?.map((tag) => (
                <Stack key={tag}>
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
                </Stack>
              ))}
          </XStack>
          <Card.Footer>
            <XStack gap="$3" ai="flex-start" jc="center">
              <YStack alignContent="center" w="80%" flexWrap="wrap">
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
      opacity={0.95}
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

const MarkerImageView = () => {
  const { marker } = useMarkerState()
  const imageUri = marker?.imageUri || []
  return (
    <Stack zIndex={3} pos="absolute" left={0} bottom={0} w="100%" h="60%" right={0}>
      <Carousel
        loop={true}
        modeConfig={{
          mode: 'stack',
          stackInterval: 18,
        }}
        mode="horizontal-stack"
        width={Math.floor(Dimensions.get('window').width * 0.9)}
        height={300}
        scrollAnimationDuration={100}
        data={Array.isArray(imageUri) ? imageUri : []}
        renderItem={({ item }) => <CardImage uri={item} />}
      />
    </Stack>
  )
}

const renderScreen = SceneMap({
  markerInfo: MarkerInfoView,
  markerList: MarkerListView,
  markerImage: MarkerImageView,
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
        zIndex={10}
        width="$5"
        height="$5"
        circular
        position="absolute"
        right={0}
        top="10%"
      >
        {zIndex === 1 ? (
          <TamaIcon iconName="Info" size="$5" />
        ) : (
          <TamaIcon iconName="Map" size="$5" />
        )}
      </Button>
    </>
  )
}
