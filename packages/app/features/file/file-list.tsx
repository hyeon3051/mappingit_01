import { Button, XStack, SizableText, Separator, Stack, useToastController } from '@my/ui'
import { PlusCircle, FileEdit } from '@tamagui/lucide-icons'
import MapBoxComponent from 'packages/app/provider/MapBox'
import { useCallback, useContext, useEffect, useRef, useState, useTransition } from 'react'
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
import { v4 as uuidv4 } from 'uuid'
import { useColorScheme } from 'react-native'
import stringToColor from 'packages/app/utils/stringToColor'

export function FileView() {
  const colorScheme = useColorScheme()
  const [isPending, startTransition] = useTransition()
  const toast = useToastController()
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
    setIdx(index + 1)
  }

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync('SELECT * from file')
      if (result) {
        setFileList(result)
      }
    }
    setup()
  }, [currentFileInfo, idx])

  const setupData = useCallback(() => {
    startTransition(async () => {
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
              id: uuidv4(),
              pos: JSON.parse(marker.pos),
              hashTags: marker.hashTags ? JSON.parse(marker.hashTags) : [],
              imageUri: marker.imageUri ? JSON.parse(marker.imageUri) : [],
            })),
            routes: routes.map((route) => ({
              ...route,
              id: uuidv4(),
              lineWidth: parseInt(route.lineWidth),
              path: JSON.parse(route.path),
              hashTags: route.hashTags ? JSON.parse(route.hashTags) : [],
            })),
          })
        }
      }
      toast.show('정보 불러옴', {
        message: '정보를 지도에 불러왔습니다',
      })
    })
  }, [idx, check])

  useEffect(() => {
    if (idx !== 0) {
      setupData()
    } else {
      setFileInfo(currentFileInfo)
    }
  }, [setupData])

  const onSelect = () => {
    if (isPending) return
    setCheck(!check)
  }

  useEffect(() => {
    setCheck(false)

    carouselRef?.current?.scrollTo({
      index: idx,
    })
  }, [idx])

  useEffect(() => {
    if (save) {
      startTransition(() => {
        dispatch({ type: 'SET_DATA', payload: { data: fileInfo } })
        toast.show('데이터 저장 완료', {
          message: `현재 파일에 ${fileInfo?.title} 파일 정보를 가져왔습니다.`,
        })
      })
      setSave(false)
    }
  }, [save])
  return (
    <>
      <MapBoxComponent
        location={
          fileInfo?.routes?.[0]?.path[0] || fileInfo?.markers?.[0]?.pos || currentFileInfo?.pos
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
              markerIcon: 'CalendarDays',
              color: '$green10',
            },
            ...(fileList?.map((file) => ({
              title: file['title'],
              description: file['description'],
              markerIcon: 'CalendarDays',
              color: stringToColor(file['title']),
            })) || []),
          ]}
          scrollAnimationDuration={5}
          onSnapToItem={(index) => {
            setIdx(index)
          }}
          renderItem={(data) => {
            const { title, description, markerIcon, color, id } = data.item
            return (
              <CardDemo
                title={title}
                description={description}
                markerIcon={markerIcon}
                color={color}
                key={id}
                onSelect={() => onSelect(id)}
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
        <Button {...linkProps} icon={PlusCircle} bg="$green10" opacity={0.8} circular></Button>
        <SheetDemo onChangeIdx={onChageIdx} data={fileList} type="file" />
        {idx !== 0 ? (
          <Button
            {...editLinkProps}
            icon={FileEdit}
            bg={stringToColor(idx !== 0 ? fileList[idx - 1]?.title : 'green')}
            opacity={0.8}
            circular
          ></Button>
        ) : (
          <Button>현재 파일</Button>
        )}
      </XStack>
    </>
  )
}
