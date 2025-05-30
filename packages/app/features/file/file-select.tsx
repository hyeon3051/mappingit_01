import {
  Button,
  Paragraph,
  XStack,
  YStack,
  useToastController,
  Sheet,
  H2,
  ScrollView,
  Text,
  Checkbox,
} from '@my/ui'
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import MapBoxComponent from 'packages/app/provider/MapBox'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useLink, useRouter } from 'solito/navigation'
import MapboxGL from '@rnmapbox/maps'
import TamaIcon from 'packages/app/ui/Icon'
import { fileState } from 'app/contexts/mapData/fileReducer'
import { File, FileState, Marker, Route } from 'packages/app/types/type'
import { useSQLiteContext } from 'expo-sqlite'
import {
  getFileDataById,
  getMarkerById,
  getRouteById,
} from 'packages/app/contexts/fileData/fileReducer'

export function SelectFileView() {
  const db = useSQLiteContext()
  const [fileList, setFileList] = useState<File[]>()
  const [fileInfo, setFileInfo] = useState<FileState | undefined>()
  const currentFileInfo = useContext(fileState)
  const [prevSelected, setPrevSelected] = useState<boolean[]>([])

  const editLinkProps = useLink({
    href: `/file/selectData/?ids=${fileList?.filter((file) => file.isSelected).map((file) => file.id)}`,
  })

  const router = useRouter()

  useEffect(() => {
    async function setup() {
      let result: File[] | undefined = await db.getAllAsync('SELECT * from file')
      if (result.length > 0) {
        result = result.map((file) => ({
          ...file,
          isSelected: false,
        }))
        setFileList(result)
      }
      setPrevSelected(Array(result?.length).fill(false))
    }
    setup()
    if (currentFileInfo) {
      async function setupFile() {
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
      setupFile()
    }
  }, [])

  useEffect(() => {
    async function setupData() {
      // 만약 prevSelected의 array 중 변경 사항이 있을 경우에만 실행
      // 오직 하나의 인덱스에 대해서만 실행
      if (fileList === undefined) return
      let idx: number = prevSelected.findIndex((check, i) => check !== fileList[i].isSelected)
      let fileId: number = fileList[idx].id
      let check: boolean = fileList[idx].isSelected
      if (check) {
        setFileInfo((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            markers: prev.markers.filter((marker) => marker.parent !== fileId),
            routes: prev.routes.filter((route) => route.parent !== fileId),
          }
        })
      } else {
        const result = await getFileDataById(fileId, db)
        const markers: Marker[] = await getMarkerById(fileId, db)
        const routes: Route[] = await getRouteById(fileId, db)
        if (result?.id) {
          setFileInfo((prev) => {
            if (!prev) return prev
            return {
              ...prev,
              markers: [
                ...prev.markers,
                ...markers.map((marker) => ({
                  ...marker,
                  pos: JSON.parse(marker.pos),
                })),
              ],
              routes: [
                ...prev?.routes,
                ...routes.map((route) => ({
                  ...route,
                  lineWidth: parseInt(route.lineWidth),
                  path: JSON.parse(route.path),
                })),
              ],
            }
          })
        }
      }
      setFileList((prev) =>
        prev.map((file, i) => (i === idx ? { ...file, isSelected: !file.isSelected } : file))
      )
    }
    setupData()
  }, [prevSelected])

  const onChangeSelected = useCallback(
    (index: number) => {
      setPrevSelected(prevSelected.map((check, i) => (i === index ? !check : check)))
    },
    [prevSelected]
  )
  return (
    <>
      <MapBoxComponent location={fileInfo?.routes[0]?.path[0] || currentFileInfo?.pos}>
        {fileInfo?.markers?.map(({ pos, markerIcon, markerColor, id }) => (
          <MapboxGL.PointAnnotation key={id} coordinate={pos[0]} id="pt-ann">
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
        gap="$2"
        w="100%"
        zIndex={3}
        pos="absolute"
        bottom={0}
        left={0}
        p="$4"
        right={0}
      >
        <Button onPress={() => router.back()} icon={ChevronLeft}>
          <Text>뒤로</Text>
        </Button>
        <SheetDemo fileList={fileList} onChangeSelected={onChangeSelected} />
        <Button {...editLinkProps} iconAfter={ChevronRight}>
          <Text>선택</Text>
        </Button>
      </XStack>
    </>
  )
}

function SheetDemo({ fileList, onChangeSelected }) {
  const [open, setOpen] = useState(true)
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
        snapPoints={[50, 70, 100]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Frame ai="center" gap="$5" bg="$color2" p="$2" height={'100%'}>
          <XStack gap="$4">
            <Paragraph ta="center">
              <H2>MarkerList</H2>
            </Paragraph>
          </XStack>
          <ScrollView w="100%" h="100%">
            <XStack gap="$2" p="$2" w="90%" m={20} ai="center">
              <Button
                size="$5"
                circular
                iconAfter={<TamaIcon iconName="MapPin" color="$black10" size="$2" />}
                onPress={() => {
                  setOpen(false)
                }}
              />
              <YStack gap="$2" ml={20}>
                <H2>{'현재경로'}</H2>
                <Paragraph>{'description'}</Paragraph>
              </YStack>
            </XStack>
            {fileList?.map((file, idx) => (
              <XStack gap="$2" p="$2" w="90%" m={20} ai="center" key={file.id}>
                <XStack gap="$2">
                  <Checkbox
                    value={file['isSelected']}
                    onCheckedChange={(value) => {
                      onChangeSelected(idx)
                    }}
                  />
                </XStack>
                <TamaIcon iconName="AArrowUp" color="$black10" size="$6" />

                <YStack gap="$2" ml={20}>
                  <H2>{file['title'] || '제목'}</H2>
                  <Paragraph>{file['description']}</Paragraph>
                </YStack>
              </XStack>
            ))}
          </ScrollView>
          <Button
            position="absolute"
            bottom={0}
            size="$3"
            circular
            icon={ChevronDown}
            onPress={() => {
              setOpen(false)
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
