import { Button, XStack, SizableText, Separator, Stack } from '@my/ui'
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
import useBackgroundGeolocation from 'packages/app/services/BackGroundGelocation'

export function RouteView() {
  const router = useRouter()
  const carouselRef = useRef(null)
  const [idx, setIdx] = useState(0)
  const [route, setRoute] = useState<number[]>([127, 38])
  const fileInfo = useContext(fileState)
  const { location } = useBackgroundGeolocation()

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

  const calculateZoomLevel = (start, end) => {
    if (!start || !end) return 10 // Default zoom level

    const distance = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2))

    // Simple heuristic for zoom level based on distance
    if (distance < 0.01) return 15
    if (distance < 0.1) return 12
    return 10
  }

  const routes = fileInfo?.routes || []
  useEffect(() => {
    console.log('idx', idx)
    let route =
      idx !== 0
        ? fileInfo?.routes[idx - 1]?.path.map((pos) => pos[0])
        : fileInfo?.currentRoute?.map((pos) => pos[0])
    setRoute(route)
  }, [idx, fileInfo?.currentRoute])

  return (
    <>
      <MapBoxComponent location={[route[route.length - 1] ?? 0, '']}>
        {route && (
          <>
            <MapboxGL.PointAnnotation coordinate={route[0] ?? location[0]} key="start" id="pt-ann">
              <TamaIcon iconName="MapPin" color="$black10" size="$2" />
            </MapboxGL.PointAnnotation>
            <MapboxGL.PointAnnotation
              coordinate={route.length ? route[route.length - 1] : location[0]}
              key="end"
              id="pt-ann"
            >
              <TamaIcon iconName="MapPin" color="$black10" size="$2" />
            </MapboxGL.PointAnnotation>
            <MapboxGL.ShapeSource
              id="line-source"
              shape={{
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: route,
                },
              }}
            >
              <MapboxGL.LineLayer
                id="line"
                sourceID="line"
                style={{
                  lineColor: idx !== 0 ? fileInfo?.routes[idx - 1]?.lineColor : '#000',
                  lineWidth: idx !== 0 ? fileInfo?.routes[idx - 1]?.lineWidth : 3,
                }}
              />
            </MapboxGL.ShapeSource>
          </>
        )}
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
