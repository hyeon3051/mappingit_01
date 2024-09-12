import { PlusCircle, FileEdit } from '@tamagui/lucide-icons'
import MapBoxComponent from 'packages/app/provider/MapBox'
import { useContext, useEffect, useRef, useState } from 'react'
import { useLink, useRouter } from 'solito/navigation'
import MapboxGL from '@rnmapbox/maps'
import TamaIcon from 'packages/app/ui/Icon'
import { fileState } from 'packages/app/contexts/mapData/fileReducer'
import Carousel from 'react-native-reanimated-carousel'
import { CardDemo } from 'packages/app/component/CardDemo'
import { SheetDemo } from 'packages/app/component/SheetDemo'
import { Button, XStack, SizableText, Card, Stack, YStack, Paragraph, Image } from '@my/ui'
import { TabView, SceneMap } from 'react-native-tab-view'
import { useWindowDimensions } from 'react-native'
import { create } from 'zustand'
import { Route, Pos } from 'packages/app/types/type'

interface RouteState {
  idx: number
  setIdx: (idx: number) => void
}

const useMarkerState = create<RouteState>((set) => ({
  idx: -1,
  setIdx(idx) {
    set({ idx })
  },
}))

const RouteOnMap = ({ location }) => {
  const fileInfo = useContext(fileState)
  const { idx } = useMarkerState()
  const [route, setRoute] = useState<Route>()
  useEffect(() => {
    if (idx !== -1) {
      setRoute(fileInfo?.routes[idx])
    } else {
      setRoute({
        title: 'current',
        description: 'current',
        path: fileInfo?.currentRoute,
        lineColor: 'black',
        lineWidth: 2,
      })
    }
  }, [idx])
  return (
    <MapBoxComponent location={location}>
      {route && (
        <>
          <MapboxGL.PointAnnotation coordinate={[127, 37]} key="start" id="pt-ann">
            <TamaIcon iconName="MapPin" color="$black10" size="$2" />
          </MapboxGL.PointAnnotation>
          <MapboxGL.PointAnnotation coordinate={location} key="end" id="pt-ann">
            <TamaIcon iconName="MapPin" color="$black10" size="$2" />
          </MapboxGL.PointAnnotation>
          <MapboxGL.ShapeSource
            id="line-source"
            shape={{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: route?.path?.map((pos) => pos[0]) || [],
              },
            }}
          >
            <MapboxGL.LineLayer
              id="line"
              sourceID="line"
              style={{
                lineColor: route.lineColor,
                lineWidth: route.lineWidth,
              }}
            />
          </MapboxGL.ShapeSource>
        </>
      )}
    </MapBoxComponent>
  )
}

const RouteInfoView = () => {
  const fileInfo = useContext(fileState)
  const { idx } = useMarkerState()
  const [route, setRoute] = useState()
  useEffect(() => {
    if (idx !== -1) {
      setRoute(fileInfo?.routes[idx])
    } else {
      setRoute({
        title: 'current',
        description: 'current',
      })
    }
  }, [idx])
  const start_at = new Date()
  const startDate = start_at.toLocaleDateString()
  const startTime = start_at.toLocaleTimeString()
  const end_at = new Date()
  const endDate = end_at.toLocaleDateString()
  const endTime = end_at.toLocaleTimeString()
  return (
    <>
      <Stack zIndex={3} pos="absolute" left={0} bottom={'20%'} height="20%">
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
                <SizableText size="$8">{route?.title}</SizableText>
                <Paragraph size="$1">{route?.description}</Paragraph>
                <Paragraph size="$1">{startDate}</Paragraph>
                <Paragraph size="$1">{startTime}</Paragraph>
                <Paragraph size="$1">{endDate}</Paragraph>
                <Paragraph size="$1">{endTime}</Paragraph>
              </YStack>
            </XStack>
          </Stack>
          <Card.Footer></Card.Footer>
        </Card>
      </Stack>
    </>
  )
}

export function RouteListView() {
  const carouselRef = useRef(null)
  const { idx, setIdx } = useMarkerState()
  const fileInfo = useContext(fileState)

  const linkProps = useLink({
    href: `/route/addRoute`,
  })

  const editLinkProps = useLink({
    href: `/route/addRoute/?routeId=${idx}`,
  })

  const onChageIdx = (index) => {
    setIdx(index) // 0 is current route
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ index })
    }
  }
  const routes = fileInfo?.routes || []

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
              title: 'title',
              description: 'description',
              markerIcon: 'MapPin',
              markerColor: '$black10',
            },
            ...routes.map((route) => ({
              title: route.title,
              description: route.title,
              markerIcon: 'MapPin',
              markerColor: '$black10',
            })),
          ]}
          scrollAnimationDuration={100}
          onSnapToItem={(index) => {
            setIdx(index)
          }}
          renderItem={(data) => {
            return (
              <CardDemo
                title={data.item.title}
                description={data.item.description}
                markerIcon="MapPin"
                markerColor="$black10"
                key={data.index}
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
        <SheetDemo onChangeIdx={onChageIdx} data={fileInfo?.routes} type="route" />
        {idx !== 0 ? (
          <Button {...editLinkProps} icon={FileEdit}>
            수정
          </Button>
        ) : (
          <Button>현재 파일</Button>
        )}
      </XStack>
    </>
  )
}

const renderScreen = SceneMap({
  first: RouteInfoView,
  second: RouteListView,
})
export function RouteView() {
  const { idx } = useMarkerState()
  const layout = useWindowDimensions()
  const [tabIdx, setTabIdx] = useState(1)
  const [zIndex, setZIndex] = useState(1)
  const [routes] = useState([
    { key: 'first', title: 'info' },
    { key: 'second', title: 'route' },
  ])
  useEffect(() => {}, [idx])
  return (
    <>
      <RouteOnMap location={[127, 38]} />
      <TabView
        navigationState={{
          index: tabIdx,
          routes,
        }}
        style={{ width: '100%', height: '100%', zIndex: zIndex }}
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
