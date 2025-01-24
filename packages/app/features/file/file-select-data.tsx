import {
  Button,
  Paragraph,
  XStack,
  YStack,
  useToastController,
  Sheet,
  H2,
  ScrollView,
  Checkbox,
} from '@my/ui'
import { ChevronDown, ChevronUp, ChevronLeft, PlusCircle } from '@tamagui/lucide-icons'
import MapBoxComponent from 'packages/app/provider/MapBox'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useLink, useParams, useRouter } from 'solito/navigation'
import MapboxGL from '@rnmapbox/maps'
import TamaIcon from 'packages/app/ui/Icon'
import { fileDispatch, fileState } from 'app/contexts/mapData/fileReducer'
import { File, FileState, Marker, Pos, Route } from 'packages/app/types/type'
import { useSQLiteContext } from 'expo-sqlite'
import {
  addFile,
  addMarker,
  addRoute,
  getFileDataById,
  getMarkerById,
  getRouteById,
} from 'packages/app/contexts/fileData/fileReducer'

export function SelectDataView() {
  const db = useSQLiteContext()
  const toast = useToastController()
  const [fileInfo, setFileInfo] = useState<FileState | undefined>()
  const currentFileInfo = useContext(fileState)
  const [currentLocation, setCurrentLocation] = useState<Pos | undefined>(undefined)
  const dispatch = useContext(fileDispatch)

  const router = useRouter()

  const params = useParams<{ ids?: string; fileId?: number }>()

  useEffect(() => {
    if (params.fileId) {
      async function fileSetup() {
        const fileId = parseInt(params.fileId)
        const file = await getFileDataById(fileId, db)
        const routes = await getRouteById(fileId, db)
        const markers = await getMarkerById(fileId, db)
        const { id, title, description } = file
        setFileInfo((prev) => ({
          ...prev,
          id: id,
          title: title,
          description: description,
          routes: routes.map((route) => ({
            ...route,
            path: JSON.parse(route.path),
            lineWidth: JSON.parse(route.lineWidth),
            isSelected: true,
          })),
          markers: markers.map((marker) => ({
            ...marker,
            pos: JSON.parse(marker.pos),
            hashTags: marker.hashTags ? JSON.parse(marker.hashTags) : [],
            imageUri: marker.imageUri ? JSON.parse(marker.imageUri) : [],
            isSelected: true,
          })),
        }))
      }
      fileSetup()
    } else {
      async function multiFileSetup() {
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
              key: route.id,
            })),
            markers: markers.map((marker) => ({
              ...marker,
              isSelected: true,
              key: marker.id,
            })),
          }
          setFileInfo(fileInfo)
        }
        await Promise.all(
          ids.map(async (fileId) => {
            const markers: Marker[] = await db.getAllAsync(
              'SELECT * from marker where parent = ?',
              [fileId]
            )
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
                    key: marker.id,
                  })),
                ],
                routes: [
                  ...prev?.routes,
                  ...routes.map((route) => ({
                    ...route,
                    path: JSON.parse(route.path),
                    lineWidth: JSON.parse(route.lineWidth),
                    isSelected: true,
                    key: route.id,
                  })),
                ],
              }
            })
          })
        )
      }
      multiFileSetup()
    }
  }, [params.fileId, params.ids])

  const onEnroll = async () => {
    toast.show('등록중', {
      message: '파일을 등록중입니다.',
    })
    if (!fileInfo) return
    const { title, description } = fileInfo
    const file = await addFile({ title, description }, db)
    const fileId = file.lastInsertRowId
    for await (let route of fileInfo.routes) {
      if (!route.isSelected) continue
      await addRoute({ ...route, parent: fileId }, db)
    }
    for await (let marker of fileInfo.markers) {
      if (!marker.isSelected) continue
      await addMarker({ ...marker, parent: fileId }, db)
    }
    toast.hide()
    toast.show('등록완료', {
      message: '파일 등록이 완료되었습니다.',
    })

    dispatch({ type: 'INIT' })
    router.back()
    router.back()
    router.back()
  }

  const onChangeMarkerSelected = useCallback((idx: number, value: boolean) => {
    const marker = fileInfo?.markers[idx]
    setCurrentLocation(marker?.pos || undefined)
    setFileInfo((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        markers: prev.markers.map((marker, index) =>
          index === idx ? { ...marker, isSelected: value } : marker
        ),
      }
    })
  }, [])

  const onChangeRoueSelected = useCallback((idx: number, value: boolean) => {
    const route = fileInfo?.routes[idx]
    setCurrentLocation(route?.path[0] || undefined)
    setFileInfo((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        routes: prev.routes.map((route, index) =>
          index === idx ? { ...route, isSelected: value } : route
        ),
      }
    })
  }, [])

  useEffect(() => {
    console.log(currentLocation, 'currentLocation')
  }, [currentLocation])

  return (
    <>
      <MapBoxComponent location={currentLocation || fileInfo?.pos} zoomLevel={3}>
        {fileInfo?.markers?.map(
          ({ pos, markerIcon, markerColor, id, isSelected }) =>
            isSelected && (
              <MapboxGL.PointAnnotation key={id} coordinate={pos[0]} id="pt-ann">
                <TamaIcon iconName={markerIcon} color={markerColor} />
              </MapboxGL.PointAnnotation>
            )
        )}
        {fileInfo?.routes &&
          fileInfo?.routes?.map(({ path, lineColor, lineWidth, isSelected }, idx) => {
            return (
              isSelected && (
                <MapboxGL.ShapeSource
                  key={String(idx)}
                  id={'line' + String(idx)}
                  lineMetrics={true}
                  shape={{
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'LineString',
                      coordinates: Array.isArray(path) ? path.map((pos) => pos[0]) : [],
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
              )
            )
          })}
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
        <Button onPress={onEnroll} icon={PlusCircle}></Button>
      </XStack>
    </>
  )
}

function SheetDemo({ markers, routes, onChangeMarkerSelected, onChangeRoueSelected }) {
  const [open, setOpen] = useState(true)
  const toggleOpen = useCallback(() => setOpen((prev) => !prev), [])
  const [position, setPosition] = useState(0)
  return (
    <>
      <Button
        size="$6"
        icon={open ? ChevronDown : ChevronUp}
        circular
        onPress={() => toggleOpen()}
      />
      <Sheet
        modal
        animation="medium"
        open={open}
        onOpenChange={() => toggleOpen()}
        snapPoints={[45]}
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
            {markers?.map((marker, idx) => (
              <XStack gap="$2" p="$2" w="90%" m={20} ai="center" key={marker.id}>
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
              <XStack gap="$2" p="$2" w="90%" m={20} ai="center" key={route.id}>
                <XStack gap="$2">
                  <Checkbox
                    checked={route.isSelected}
                    value={route.isSelected}
                    onCheckedChange={(value) => {
                      onChangeRoueSelected(idx, value)
                    }}
                  />
                </XStack>
                <TamaIcon
                  iconName="Route"
                  color={route.isSelected ? route.lineColor : '$gray10'}
                  strokeWidth={
                    route.lineWidth > 15
                      ? 4
                      : route.lineWidth > 10
                        ? 3
                        : route.lineWidth > 5
                          ? 2
                          : 1
                  }
                  size="$6"
                />
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
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
