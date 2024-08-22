import {
  Button,
  Paragraph,
  XStack,
  YStack,
  SizableText,
  Separator,
  Stack,
  useToastController,
  Sheet,
  Card,
  H2,
  ScrollView,
} from '@my/ui'
import { PlusCircle, FileEdit, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import MapBoxComponent from 'packages/app/provider/MapBox'
import { useContext, useEffect, useRef, useState } from 'react'
import { useLink } from 'solito/navigation'
import MapboxGL from '@rnmapbox/maps'
import TamaIcon from 'packages/app/ui/Icon'
import { fileState } from 'packages/app/contexts/mapData/fileReducer'
import Carousel from 'react-native-reanimated-carousel'
import { LocateFile, Marker, File, FileState } from 'packages/app/types/type'
import { useSQLiteContext } from 'expo-sqlite'

export function Header() {
  const db = useSQLiteContext()
  const [version, setVersion] = useState('')
  useEffect(() => {
    async function setup() {
      const result = await db.getFirstAsync<{ 'sqlite_version()': string }>(
        'SELECT sqlite_version()'
      )
      if (result) {
        setVersion(result['sqlite_version()'])
      }
    }
    setup()
  }, [])
  return (
    <XStack gap="$4" p="$4">
      <H2>SQLite Version: {version}</H2>
    </XStack>
  )
}

export function SelectFileView() {
  const carouselRef = useRef(null)
  const db = useSQLiteContext()
  const [idx, setIdx] = useState(0)
  const [fileList, setFileList] = useState<File[]>()
  const [fileInfo, setFileInfo] = useState<FileState>()
  const currentFileInfo = useContext(fileState)

  const linkProps = useLink({
    href: `/file/addFile`,
  })

  const editLinkProps = useLink({
    href: `/file/addFile/?fileId=${idx}`,
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
      const result = await db.getFirstAsync('SELECT * from file where id = ?', [id])
      const markers = await db.getAllAsync('SELECT * from marker where parent = ?', [id])
      const routes = await db.getAllAsync('SELECT * from route where parent = ?', [id])
      if (result) {
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
    if (idx !== 0) {
      setupData()
    } else {
      setFileInfo(currentFileInfo)
    }
  }, [idx])
  return (
    <>
      <MapBoxComponent location={[[0, 0], '']} zoomLevel={2}>
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
        <Button {...linkProps} icon={PlusCircle}></Button>
        <SheetDemo onChangeIdx={onChageIdx} fileList={fileList} />
        <Button {...editLinkProps} icon={FileEdit}></Button>
      </XStack>
    </>
  )
}

function SheetDemo({ onChangeIdx, fileList }) {
  const toast = useToastController()

  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)

  return (
    <>
      <Button
        size="$6"
        icon={open ? ChevronDown : ChevronUp}
        circular
        onPress={() => setOpen((x) => !x)}
      />
      <Sheet
        modal
        animation="medium"
        open={open}
        onOpenChange={setOpen}
        snapPoints={[60]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Frame ai="center" gap="$5" bg="$color2" p="$2">
          <XStack gap="$4">
            <Paragraph ta="center">
              <H2>MarkerList</H2>
            </Paragraph>
          </XStack>
          <ScrollView w="100%" h="90%">
            <XStack gap="$2" p="$2" w="90%" m={20} ai="center">
              <Button
                size="$5"
                circular
                iconAfter={<TamaIcon iconName="MapPin" color="$black10" size="$2" />}
                onPress={() => {
                  onChangeIdx(0)
                  setOpen(false)
                }}
              />
              <YStack gap="$2" ml={20}>
                <H2>{'현재경로'}</H2>
                <Paragraph>{'description'}</Paragraph>
              </YStack>
            </XStack>
            {fileList?.map((file, idx) => (
              <XStack gap="$2" p="$2" w="90%" m={20} ai="center">
                <Button
                  size="$5"
                  circular
                  onPress={() => {
                    onChangeIdx(idx + 1)
                    setOpen(false)
                  }}
                  iconAfter={<TamaIcon iconName="AArrowUp" color="$black10" size="$6" />}
                />
                <YStack gap="$2" ml={20}>
                  <H2>{file['title'] || 'example'}</H2>
                  <Paragraph>{file['description']}</Paragraph>
                </YStack>
              </XStack>
            ))}
          </ScrollView>
          <Button
            size="$3"
            circular
            icon={ChevronDown}
            onPress={() => {
              setOpen(false)
              toast.show('Sheet closed!', {
                message: 'Just showing how toast works...',
              })
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
