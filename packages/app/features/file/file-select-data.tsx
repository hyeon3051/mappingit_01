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
  Checkbox,
} from '@my/ui'
import {
  PlusCircle,
  FileEdit,
  ChevronDown,
  ChevronUp,
  X,
  ChevronLeft,
  ChevronRight,
} from '@tamagui/lucide-icons'
import MapBoxComponent from 'packages/app/provider/MapBox'
import { use, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useLink, useParams, useRouter } from 'solito/navigation'
import MapboxGL from '@rnmapbox/maps'
import TamaIcon from 'packages/app/ui/Icon'
import { fileState } from 'packages/app/contexts/mapData/fileReducer'
import { File, FileState, Marker, Route } from 'packages/app/types/type'
import { useSQLiteContext } from 'expo-sqlite'

export function SelectDataView() {
  const db = useSQLiteContext()
  const [idx, setIdx] = useState(0)
  const [fileList, setFileList] = useState<File[]>()
  const [fileInfo, setFileInfo] = useState<FileState | undefined>()
  const currentFileInfo = useContext(fileState)

  const linkProps = useLink({
    href: `/file/addFile`,
  })

  const editLinkProps = useLink({
    href: `/file/selectData/?ids=${fileList?.filter((file) => file.isSelected).map((file) => file.id)}`,
  })

  const router = useRouter()

  const params = useParams<{ ids: string }>()

  console.log(params, 'params')

  useEffect(() => {
    let ids = params.ids.split(',').map((id) => parseInt(id))
    if (currentFileInfo) {
      const { title, description, routes, markers } = currentFileInfo
      const fileInfo = {
        id: '1',
        title: title,
        description: description,
        routes: routes.map((route) => ({
          ...route,
          isSelected: true,
        })),
        markers: markers.map((marker) => ({
          ...marker,
          isSelected: true,
        })),
      }
      setFileInfo(fileInfo)
    }
    async function setup() {
      await Promise.all(
        ids.map(async (fileId) => {
          const markers: Marker[] = await db.getAllAsync('SELECT * from marker where parent = ?', [
            fileId,
          ])
          const routes: Route[] = await db.getAllAsync('SELECT * from route where parent = ?', [
            fileId,
          ])
          setFileInfo((prev) => {
            if (!prev) return prev
            return {
              ...prev,
              markers: [
                ...prev.markers,
                ...markers.map((marker) => ({
                  ...marker,
                  pos: JSON.parse(marker.pos),
                  isSelected: true,
                })),
              ],
              routes: [
                ...prev?.routes,
                ...routes.map((route) => ({
                  ...route,
                  path: JSON.parse(route.path),
                  isSelected: true,
                })),
              ],
            }
          })
        })
      )
    }
    setup()
  }, [])

  const onChangeMarkerSelected = useCallback((idx: number, value: boolean) => {
    setFileInfo((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        markers: prev.markers.map((marker, index) =>
          index === idx ? { ...marker, isSelected: value } : marker
        ),
      }
    })
    console.log(fileInfo?.markers[idx])
  }, [])

  const onChangeRoueSelected = useCallback((idx: number, value: boolean) => {
    setFileInfo((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        routes: prev.routes.map((route, index) =>
          index === idx ? { ...route, isSelected: value } : route
        ),
      }
    })
    console.log(fileInfo?.routes[idx])
  }, [])

  return (
    <>
      <MapBoxComponent location={[[127.32, 37.44], '']} zoomLevel={3}>
        {fileInfo?.markers?.map(
          ({ pos, markerIcon, markerColor, id, isSelected }) =>
            isSelected && (
              <MapboxGL.PointAnnotation key={id} coordinate={pos} id="pt-ann">
                <TamaIcon iconName={markerIcon} color={markerColor} />
              </MapboxGL.PointAnnotation>
            )
        )}
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
        <Button onPress={() => router.back()} icon={ChevronLeft}></Button>
        <SheetDemo
          routes={fileInfo?.routes}
          markers={fileInfo?.markers}
          onChangeMarkerSelected={onChangeMarkerSelected}
          onChangeRoueSelected={onChangeRoueSelected}
        />
        <Button {...editLinkProps} icon={ChevronRight}></Button>
      </XStack>
    </>
  )
}

function SheetDemo({ markers, routes, onChangeMarkerSelected, onChangeRoueSelected }) {
  const toast = useToastController()

  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)
  console.log(markers, 'markers')
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
        <Sheet.Handle width="100%" h="10px" bg="$gray10" />
        <Sheet.Frame ai="center" gap="$5" bg="$color2" p="$2">
          <XStack gap="$4">
            <Paragraph ta="center">
              <H2>MarkerList</H2>
            </Paragraph>
          </XStack>
          <ScrollView w="100%" h="90%">
            {markers?.map((marker, idx) => (
              <XStack gap="$2" p="$2" w="90%" m={20} ai="center">
                <XStack gap="$2">
                  <Checkbox
                    checked={marker.isSelected}
                    value={marker.isSelected}
                    onCheckedChange={(value) => {
                      onChangeMarkerSelected(idx, value)
                    }}
                  />
                </XStack>
                <TamaIcon
                  iconName={marker.markerIcon}
                  color={marker.isSelected ? marker.markerColor : '$gray10'}
                  size="$6"
                />
                <YStack gap="$2" ml={20}>
                  <H2>{marker.title}</H2>
                  <Paragraph>{marker.description}</Paragraph>
                </YStack>
              </XStack>
            ))}
            {routes?.map((route, idx) => (
              <XStack gap="$2" p="$2" w="90%" m={20} ai="center">
                <XStack gap="$2">
                  <Checkbox
                    checked={route.isSelected}
                    value={route.isSelected}
                    onCheckedChange={(value) => {
                      onChangeRoueSelected(idx, value)
                    }}
                  />
                </XStack>
                <YStack gap="$2" ml={20}>
                  <H2>{route.title}</H2>
                  <Paragraph>{route.description}</Paragraph>
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
