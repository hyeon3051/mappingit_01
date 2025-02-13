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
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { useWindowDimensions } from 'react-native'
import { create } from 'zustand'
import { useEffect, useCallback } from 'react'
import { useColorScheme } from 'react-native'

interface RouteState {
  idx: number
  setIdx: (idx: number) => void
}

const useRouteState = create<RouteState>((set) => ({
  idx: -1,
  setIdx(idx: number) {
    set({ idx })
  },
}))

const RouteOnMap = () => {
  const colorScheme = useColorScheme()
  const fileInfo = useContext(fileState)
  const { idx } = useRouteState()
  const [routeSet, useRouteSet] = useState({
    routeId: '',
    startCoordinate: undefined,
    endCoordinate: undefined,
    startIdx: '',
    endIdx: '',
    shapeIdx: '',
    lineIdx: '',
  })

  const setRouteSet = useCallback(() => {
    const routeId = idx !== -1 ? fileInfo?.routes[idx]?.id : 'current'
    const startCoordinate =
      idx !== -1 ? fileInfo?.routes[idx]?.path[0] : fileInfo?.currentRoute?.[0] || fileInfo?.pos
    const endCoordinate =
      idx !== -1
        ? fileInfo?.routes[idx]?.path[fileInfo.routes[idx].path.length - 1][0]
        : fileInfo?.currentRoute?.[fileInfo?.currentRoute?.length - 1]?.[0] || fileInfo?.pos?.[0]
    useRouteSet({
      routeId: routeId || '',
      startCoordinate: startCoordinate,
      endCoordinate: endCoordinate,
      startIdx: `start-${routeId}`,
      endIdx: `end-${routeId}`,
      shapeIdx: `shape-${routeId}`,
      lineIdx: `line-${routeId}`,
    })
  }, [idx, fileInfo?.routes])

  useEffect(() => {
    setRouteSet()
  }, [setRouteSet])

  if (!fileInfo) {
    return
  }
  return (
    <MapBoxComponent location={[routeSet.endCoordinate, 'end']}>
      {routeSet.startCoordinate && (
        <MapboxGL.PointAnnotation
          coordinate={routeSet.startCoordinate?.[0]}
          key={routeSet.startIdx}
          id={routeSet.startIdx}
        >
          <TamaIcon
            iconName="MapPin"
            color={colorScheme === 'dark' ? '$white10' : '$black10'}
            size="$2"
          />
        </MapboxGL.PointAnnotation>
      )}
      {routeSet.endCoordinate && (
        <MapboxGL.PointAnnotation
          coordinate={routeSet.endCoordinate}
          key={routeSet.endIdx}
          id={routeSet.endIdx}
        >
          <TamaIcon
            iconName="MapPin"
            color={colorScheme === 'dark' ? '$white10' : '$black10'}
            size="$2"
          />
        </MapboxGL.PointAnnotation>
      )}
      {routeSet.endCoordinate && (
        <MapboxGL.ShapeSource
          id="shapeSource"
          shape={{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates:
                idx === -1
                  ? (fileInfo.currentRoute.length >= 2
                      ? fileInfo.currentRoute
                      : [fileInfo.pos, fileInfo.pos]
                    ).map((route) => route?.[0])
                  : fileInfo.routes[idx]?.path?.map((route) => route?.[0]),
            },
          }}
        >
          <MapboxGL.LineLayer
            id="lineIdx"
            sourceID="shapeSource"
            style={{
              lineColor: idx > -1 ? fileInfo.routes[idx]?.lineColor : 'black',
              lineWidth: idx > -1 ? fileInfo.routes[idx]?.lineWidth : 3,
            }}
          />
        </MapboxGL.ShapeSource>
      )}
    </MapBoxComponent>
  )
}

const RouteInfoView = () => {
  const fileInfo = useContext(fileState)
  const { idx } = useRouteState()
  if (idx === -1) return
  const start_at = new Date(
    fileInfo?.routes[idx]?.path?.[0]?.[1] || fileInfo?.currentRoute?.[0]?.[1] || new Date()
  )
  const startDate = start_at.toLocaleDateString()
  const startTime = start_at.toLocaleTimeString()
  const end_at = new Date(
    fileInfo?.routes[idx]?.path?.[fileInfo?.routes[idx]?.path?.length - 1]?.[1] ||
      fileInfo?.currentRoute?.[fileInfo?.currentRoute?.length - 1]?.[1] ||
      new Date()
  )
  const endDate = end_at.toLocaleDateString()
  const endTime = end_at.toLocaleTimeString()
  return (
    <>
      <Stack zIndex={3} pos="absolute" left={0} bottom={20}>
        <Card size="$4" width="100%" height="100%" backgroundColor="$black0" mx="$2" px="$2">
          <Card.Header padded>
            <Paragraph></Paragraph>
          </Card.Header>
          <Stack width="$15" height="$20">
            <XStack gap="$3" ai="flex-start" jc="center" px="$4">
              <YStack alignContent="center" w="80%">
                <SizableText size="$8">{idx !== -1 && fileInfo?.routes[idx]?.title}</SizableText>
                <Paragraph size="$1">{idx !== -1 && fileInfo?.routes[idx]?.description}</Paragraph>
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
  const { idx, setIdx } = useRouteState()
  const fileInfo = useContext(fileState)

  const linkProps = useLink({
    href: `/route/addRoute`,
  })

  const editLinkProps = useLink({
    href: `/route/addRoute/?routeId=${idx}`,
  })

  const onChageIdx = (index) => {
    setIdx(index)
  }

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef?.current.scrollTo({ index: idx + 1 })
    }
  }, [idx])

  return (
    <>
      <Stack
        top={25}
        flex={1}
        zIndex={3}
        pos="absolute"
        width="100%"
        ai="center"
        backgroundColor="$black0"
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
              lineWidth: 3,
              lineColor: '$green10',
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
            setIdx(index - 1)
          }}
          renderItem={(data) => {
            const { title, description, id, lineWidth, lineColor } = data.item
            return (
              <CardDemo
                title={title}
                description={description}
                color={lineColor}
                markerIcon="Route"
                lineWidth={lineWidth}
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
        <Button {...linkProps} icon={PlusCircle} bg="$white1">
          추가
        </Button>
        <SheetDemo
          onChangeIdx={onChageIdx}
          data={fileInfo?.routes}
          type="route"
          selectedIdx={idx}
        />
        {idx !== -1 ? (
          <Button
            {...editLinkProps}
            icon={FileEdit}
            backgroundColor={fileInfo?.routes[idx - 1]?.lineColor}
            opacity={0.8}
          >
            수정
          </Button>
        ) : (
          <Button bg="$green10" opacity={0.8}>
            현재 파일
          </Button>
        )}
      </XStack>
    </>
  )
}

const renderScreen = SceneMap({
  first: RouteInfoView,
  second: RouteListView,
})

const renderTabBar = (props) => (
  <TabBar
    {...props}
    activeColor="red"
    inactiveColor="black"
    indicatorStyle={{ display: 'none' }}
    style={{
      backgroundColor: 'white',
      borderColor: 'black',
      borderRadius: 50,
      width: '80%',
      position: 'absolute',
      left: '10%',
      right: '10%',
      top: '5%',
    }}
  />
)
export function RouteView() {
  const layout = useWindowDimensions()
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
        renderTabBar={renderTabBar}
        style={{ width: '100%', height: '100%', zIndex: zIndex }}
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
