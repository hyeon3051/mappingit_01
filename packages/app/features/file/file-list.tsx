import { Button, XStack, SizableText, Separator, Stack } from '@my/ui'
import { PlusCircle, FileEdit } from '@tamagui/lucide-icons'
import MapBoxComponent from 'packages/app/provider/MapBox'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useLink } from 'solito/navigation'
import MapboxGL from '@rnmapbox/maps'
import TamaIcon from 'packages/app/ui/Icon'
import { fileDispatch, fileState } from 'app/contexts/mapData/fileReducer'
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
import { useColorScheme } from 'react-native'

export function FileView() {
  const colorScheme = useColorScheme()
  const carouselRef = useRef(null)
  const db = useSQLiteContext()
  const [idx, setIdx] = useState(0)
  const dispatch = useContext(fileDispatch)
  const [check, setCheck] = useState(false)
  const [fileList, setFileList] = useState<File[]>()
  const [fileInfo, setFileInfo] = useState<FileState>()
  const [save, setSave] = useState(false)
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
  }, [currentFileInfo?.title, idx])

  const setupData = useCallback(async () => {
    let { id, title, description } = fileList[idx - 1]
    const result = await getFileDataById(id, db)
    if (!result) {
      return
    }
    if (idx && check) {
      const markers: Marker[] = await getMarkerById(result.id, db)
      const routes: Route[] = await getRouteById(result.id, db)
      if (result.id) {
        setFileInfo({
          id: id,
          title: title,
          description: description,
          markers: markers.map((marker) => ({
            ...marker,
            pos: JSON.parse(marker.pos),
            hashTags: JSON.parse(marker.hashTags),
          })),
          routes: routes.map((route) => ({
            ...route,
            lineWidth: parseInt(route.lineWidth),
            path: JSON.parse(route.path),
            hashTags: JSON.parse(route.hashTags),
          })),
        })
      }
    }
  }, [idx, check])

  useEffect(() => {
    if (idx !== 0) {
      setupData()
    } else {
      setFileInfo(currentFileInfo)
    }
  }, [setupData])

  const onSelect = () => {
    setCheck(!check)
  }

  useEffect(() => {
    setCheck(false)
  }, [idx])

  useEffect(() => {
    if (save) {
      dispatch({ type: 'SET_DATA', payload: { data: fileInfo } })
      setSave(false)
    }
  }, [save])
  return (
    <>
      <MapBoxComponent
        location={
          fileInfo?.routes?.[0]?.path[0] || fileInfo?.markers?.[0]?.pos || currentFileInfo?.pos?.[0]
        }
      >
        {fileInfo?.markers?.map(({ pos, markerIcon, markerColor, id }) => (
          <MapboxGL.PointAnnotation key={id} coordinate={pos[0]} id="pt-ann">
            <TamaIcon iconName={markerIcon} color={markerColor} />
          </MapboxGL.PointAnnotation>
        ))}
        {fileInfo?.routes?.map((route, idx) => (
          <MapboxGL.ShapeSource
            key={String(idx)}
            id={'line' + String(idx)}
            lineMetrics={true}
            shape={{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: route['path'].map((pos) => pos[0]),
              },
            }}
          >
            <MapboxGL.LineLayer
              id={'line' + idx}
              sourceID={'line' + idx}
              style={{
                lineColor: route['lineColor'] || '#FFFFFF',
                lineWidth: route['lineWidth'] || 3,
              }}
            />
          </MapboxGL.ShapeSource>
        ))}
      </MapBoxComponent>
      <Stack zIndex={3} pos="absolute" left={0} bottom={100}>
        <Carousel
          loop={false}
          width={224}
          ref={carouselRef}
          height={300}
          vertical={true}
          data={[
            {
              title: '현재 파일',
              description: '현재 저장 중인 파일',
              markerIcon: 'Globe',
              markerColor: colorScheme === 'dark' ? '$white10' : '$black10',
            },
            ...(fileList?.map((file) => ({
              title: file['title'],
              description: file['description'],
              markerIcon: 'MapPin',
              markerColor: colorScheme === 'dark' ? '$white10' : '$black10',
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
                onSelect={() => onSelect(data.id)}
                onFileSelect={() => setSave(true)}
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
