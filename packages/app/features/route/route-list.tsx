import { PlusCircle, FileEdit } from '@tamagui/lucide-icons'
import MapBoxComponent from 'packages/app/provider/MapBox'
import { useContext, useRef, useState } from 'react'
import { useLink } from 'solito/navigation'
import MapboxGL from '@rnmapbox/maps'
import TamaIcon from 'packages/app/ui/Icon'
import { fileState } from 'app/contexts/mapData/fileReducer'
import Carousel from 'react-native-reanimated-carousel'
import { CardDemo } from 'packages/app/component/CardDemo'
import { SheetDemo } from 'packages/app/component/SheetDemo'
import { Button, XStack, SizableText, Card, Stack, YStack, Paragraph } from '@my/ui'
import { TabView, SceneMap } from 'react-native-tab-view'
import { useWindowDimensions } from 'react-native'
import { create } from 'zustand'
import { useEffect } from 'react'
import { useColorScheme } from 'react-native'

interface RouteState {
  idx: number
  setIdx: (idx: number) => void
}

const useRouteState = create<RouteState>((set) => ({
  idx: 0,
  setIdx(idx: number) {
    set({ idx })
  },
}))

const RouteOnMap = () => {
  const colorScheme = useColorScheme()
  const fileInfo = useContext(fileState)
  const { idx } = useRouteState()
  const [idxSet, useIdxSet] = useState({
    startIdx: '',
    endIdx: '',
    shapeIdx: '',
    lineIdx: '',
  })

  const routeId = idx !== 0 ? fileInfo?.routes[idx - 1]?.id : 'current'
  const startCoordinate = idx !== 0 ? fileInfo?.routes[idx - 1]?.path[0] : fileInfo?.pos
  const endCoordinate =
    idx !== 0
      ? fileInfo?.routes[idx - 1]?.path[fileInfo.routes[idx - 1].path.length - 1][0]
      : fileInfo?.pos?.[0]

  useEffect(() => {
    useIdxSet({
      startIdx: `start-${routeId}`,
      endIdx: `end-${routeId}`,
      shapeIdx: `shape-${routeId}`,
      lineIdx: `line-${routeId}`,
    })
  }, [idx])

  if (!fileInfo) {
    return
  }
  return (
    <MapBoxComponent location={startCoordinate ? startCoordinate : fileInfo.pos}>
      <MapboxGL.PointAnnotation
        coordinate={startCoordinate?.[0]}
        key={idxSet.startIdx}
        id={idxSet.startIdx}
      >
        <TamaIcon
          iconName="MapPin"
          color={colorScheme === 'dark' ? '$white10' : '$black10'}
          size="$2"
        />
      </MapboxGL.PointAnnotation>
      <MapboxGL.PointAnnotation coordinate={endCoordinate} key={idxSet.endIdx} id={idxSet.endIdx}>
        <TamaIcon
          iconName="MapPin"
          color={colorScheme === 'dark' ? '$white10' : '$black10'}
          size="$2"
        />
      </MapboxGL.PointAnnotation>
      <MapboxGL.ShapeSource
        id="shapeSource"
        shape={{
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates:
              idx === 0
                ? (fileInfo.currentRoute.length >= 2
                    ? fileInfo.currentRoute
                    : [fileInfo.pos, fileInfo.pos]
                  ).map((route) => route?.[0])
                : fileInfo.routes[idx - 1]?.path?.map((route) => route?.[0]),
          },
        }}
      >
        <MapboxGL.LineLayer
          id="lineIdx"
          sourceID="shapeSource"
          style={{
            lineColor: idx > 0 ? fileInfo.routes[idx - 1]?.lineColor : 'red',
            lineWidth: idx > 0 ? fileInfo.routes[idx - 1]?.lineWidth : 3,
          }}
        />
      </MapboxGL.ShapeSource>
    </MapBoxComponent>
  )
}

const RouteInfoView = () => {
  const { idx } = useRouteState()
  const colorScheme = useColorScheme()
  const fileInfo = useContext(fileState)
  const start_at = new Date(
    fileInfo?.routes[idx - 1]?.path?.[0]?.[1] || fileInfo?.currentRoute?.[0]?.[1] || new Date()
  )
  const startDate = start_at.toLocaleDateString()
  const startTime = start_at.toLocaleTimeString()
  const end_at = new Date(
    fileInfo?.routes[idx - 1]?.path?.[fileInfo?.routes[idx - 1]?.path?.length - 1]?.[1] ||
      fileInfo?.currentRoute?.[fileInfo?.currentRoute?.length - 1]?.[1] ||
      new Date()
  )
  const endDate = end_at.toLocaleDateString()
  const endTime = end_at.toLocaleTimeString()
  return (
    <>
      <Stack zIndex={3} pos="absolute" left={0} bottom={20}>
        <Card
          size="$4"
          width="100%"
          height="100%"
          backgroundColor={colorScheme === 'dark' ? '$black10' : '$white10'}
          mx="$2"
          px="$2"
        >
          <Card.Header padded>
            <Paragraph></Paragraph>
          </Card.Header>
          <Stack width="$15" height="$20">
            <XStack gap="$3" ai="flex-start" jc="center" px="$4">
              <YStack alignContent="center" w="80%">
                <SizableText size="$8">{idx !== 0 && fileInfo?.routes[idx - 1]?.title}</SizableText>
                <Paragraph size="$1">
                  {idx !== 0 && fileInfo?.routes[idx - 1]?.description}
                </Paragraph>
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
  const colorScheme = useColorScheme()
  const carouselRef = useRef(null)
  const { idx, setIdx } = useRouteState()
  const fileInfo = useContext(fileState)

  const linkProps = useLink({
    href: `/route/addRoute`,
  })

  const editLinkProps = useLink({
    href: `/route/addRoute/?routeId=${idx - 1}`,
  })

  const onChageIdx = (index) => {
    setIdx(index) // 0 is current route
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ index: index - 1 })
    }
  }

  return (
    <>
      <Stack
        top={25}
        flex={1}
        zIndex={3}
        pos="absolute"
        width="100%"
        ai="center"
        backgroundColor={colorScheme === 'dark' ? '$black10' : '$white10'}
      ></Stack>
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
              path: fileInfo?.currentRoute,
              markerIcon: 'PinOff',
              markerColor: '$black10',
            },
            ...(fileInfo?.routes.map((route) => {
              return {
                ...route,
                key: route.id,
              }
            }) || []),
          ]}
          scrollAnimationDuration={100}
          onSnapToItem={(index) => {
            setIdx(index)
          }}
          renderItem={(data) => {
            const { title, description, id } = data.item
            return (
              <CardDemo
                title={title}
                description={description}
                markerIcon="MapPin"
                markerColor="$black10"
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
  const layout = useWindowDimensions()
  const colorScheme = useColorScheme()
  const [tabIdx, setTabIdx] = useState(1)
  const [zIndex, setZIndex] = useState(1)
  const [routes] = useState([
    { key: 'first', title: '정보' },
    { key: 'second', title: '루트' },
  ])

  return (
    <>
      <RouteOnMap />
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
        backgroundColor={'$white100'}
        zIndex={10}
      >
        {zIndex === 1 ? '루트 뷰로 돌아가기' : '맵 뷰로 돌아가기'}
      </Button>
    </>
  )
}
