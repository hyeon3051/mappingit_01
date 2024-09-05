import { Button, XStack, SizableText, Separator, Stack } from '@my/ui'
import { PlusCircle, FileEdit } from '@tamagui/lucide-icons'
import MapBoxComponent from 'packages/app/provider/MapBox'
import { useContext, useEffect, useRef, useState } from 'react'
import { useLink } from 'solito/navigation'
import MapboxGL from '@rnmapbox/maps'
import TamaIcon from 'packages/app/ui/Icon'
import { fileState } from 'packages/app/contexts/mapData/fileReducer'
import Carousel from 'react-native-reanimated-carousel'
import { Marker, File, FileState, Route } from 'packages/app/types/type'
import { useSQLiteContext } from 'expo-sqlite'
import {
  getFileDataById,
  getMarkerById,
  getRouteById,
} from 'packages/app/contexts/fileData/fileReducer'
import { CardDemo } from 'packages/app/component/CardDemo'
import { SheetDemo } from 'packages/app/component/SheetDemo'

export function FileView() {
  const carouselRef = useRef(null)
  const db = useSQLiteContext()
  const [idx, setIdx] = useState(0)
  const [check, setCheck] = useState(false)
  const [fileList, setFileList] = useState<File[]>()
  const [fileInfo, setFileInfo] = useState<FileState>()
  const currentFileInfo = useContext(fileState)

  const linkProps = useLink({
    href: `/file/addFile`,
  })

  const editLinkProps = useLink({
    href: `/file/addFile/?fileId=${fileInfo?.id}`,
  })

  const onChageIdx = (index) => {
    setIdx(index)
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ index })
    }
  }

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync('SELECT * from file')
      if (result) {
        setFileList(result)
      }
    }
    setup()
    if (currentFileInfo) {
      const { title, description, routes, markers } = currentFileInfo
      const fileInfo = {
        id: '1',
        title: title,
        description: description,
        routes: routes,
        markers: markers,
      }
      setFileInfo(fileInfo)
    }
  }, [])

  useEffect(() => {
    async function setupData() {
      let { id, title, description } = fileList[idx - 1]
      const result = await getFileDataById(id, db)
      if (!result) {
        return
      }
      if (check) {
        const markers: Marker[] = await getMarkerById(result.id, db)
        const routes: Route[] = await getRouteById(result.id, db)
        console.log(result, markers, routes)
        if (result.id) {
          setFileInfo({
            id: id,
            title: title,
            description: description,
            markers: markers.map((marker) => ({
              ...marker,
              pos: JSON.parse(marker.pos),
            })),
            routes: routes.map((route) => ({
              ...route,
              path: JSON.parse(route.path),
            })),
          })
        }
      }
    }
    console.log(idx)
    if (idx !== 0) {
      setupData()
    } else {
      setFileInfo(currentFileInfo)
    }
    console.log(fileInfo)
  }, [idx, check])

  const onSelect = () => {
    setCheck(!check)
  }

  useEffect(() => {
    setCheck(false)
  }, [idx])
  return (
    <>
      <MapBoxComponent>
        {fileInfo?.markers?.map(({ pos, markerIcon, markerColor, id }) => (
          <MapboxGL.PointAnnotation key={id} coordinate={pos} id="pt-ann">
            <TamaIcon iconName={markerIcon} color={markerColor} />
          </MapboxGL.PointAnnotation>
        ))}
        {fileInfo?.routes?.map(({ path, lineColor, lineWidth }, idx) => (
          <MapboxGL.ShapeSource
            key={String(idx)}
            id={'line' + String(idx)}
            lineMetrics={true}
            shape={{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: path.map((pos) => pos[0]),
              },
            }}
          >
            <MapboxGL.LineLayer
              id={'line' + idx}
              sourceID={'line' + idx}
              style={{
                lineColor: lineColor || '#FFFFFF',
                lineWidth: lineWidth || 3,
              }}
            />
          </MapboxGL.ShapeSource>
        ))}
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
            ...(fileList?.map((file) => ({
              title: file['title'],
              description: file['description'],
              markerIcon: 'MapPin',
              markerColor: '$black10',
            })) || []),
          ]}
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
                key={data.index}
                onSelect={() => onSelect(data.index)}
              />
            )
          }}
        />
      </Stack>
      <XStack
        f={2}
        jc="space-between"
        gap="$1"
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
        <SheetDemo onChangeIdx={onChageIdx} data={fileList} type="file" />
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
