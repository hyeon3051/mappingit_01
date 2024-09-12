import {
  Button,
  XStack,
  YStack,
  Stack,
  Input,
  TextArea,
  H3,
  Card,
  H6,
  H5,
  ScrollView,
  Image,
} from '@my/ui'
import TamaIcon from 'packages/app/ui/Icon'
import { useContext, useEffect, useState } from 'react'
import Carousel from 'react-native-reanimated-carousel'
import { useParams, useRouter } from 'solito/navigation'
import { fileState, fileDispatch } from 'packages/app/contexts/mapData/fileReducer'
import { Marker } from 'packages/app/types/type'
import 'react-native-get-random-values'
import ImagePicker from 'react-native-image-crop-picker'
import { v4 as uuidv4 } from 'uuid'
export function AddMarkerView() {
  const fileInfo = useContext(fileState)
  const dispatch = useContext(fileDispatch)
  const params = useParams<{ icon: string; color: string; marker: number }>()
  const marker = parseInt(`${params.marker}` || '-1')
  const [markerInfo, setMarkerInfo] = useState<Marker>({
    id: uuidv4(),
    title: '',
    description: '',
    markerColor: '',
    markerIcon: '',
    imageUri: [],
    pos: fileInfo?.currentRoute[fileInfo.currentRoute.length - 1],
  })

  useEffect(() => {
    const { icon, color, marker } = params
    setMarkerInfo((prev) => ({
      ...prev,
      markerIcon: icon,
      markerColor: color,
    }))
    if (marker !== -1 && fileInfo?.markers[marker - 1]) {
      const selectedMarker = fileInfo?.markers[marker - 1]
      const { id, title, description, imageUri } = selectedMarker
      setMarkerInfo((prev) => ({
        ...prev,
        id: id,
        title: title,
        description: description,
        imageUri: imageUri,
      }))
    }
  }, [params])

  const { title, description } = markerInfo

  const router = useRouter()

  const onNameChange = (text) => {
    setMarkerInfo((prev) => ({
      ...prev,
      title: text,
    }))
  }
  const onDescriptionChange = (text) => {
    setMarkerInfo((prev) => ({
      ...prev,
      description: text,
    }))
  }

  const handleRemove = () => {
    if (marker === -1) return
    dispatch({
      type: 'REMOVE_MARKER',
      payload: { markerId: marker },
    })
  }

  const handleChange = () => {
    if (marker !== -1) {
      dispatch({ type: 'ADD_MARKER', payload: { marker: markerInfo } })
      console.log('add marker')
    } else {
      dispatch({
        type: 'EDIT_MARKER',
        payload: { marker: markerInfo, markerId: markerInfo.id },
      })
    }
    router.back()
    router.back()
  }
  console.log(marker)

  return (
    <>
      <ScrollView>
        <YStack f={1} gap="$0" w="100%" h="100%" jc="flex-start" p="$2">
          <XStack gap="$4" p="$2" w="100%" m={20} ai="center">
            <Button
              size="$7"
              circular
              iconAfter={<TamaIcon iconName={params.icon} size="$6" />}
              backgroundColor={params.color}
            />
            <YStack>
              <H3>{title || 'example'}</H3>
              <H6>Lorem ipsum</H6>
            </YStack>
          </XStack>
          <YStack gap="$4" p="$2" w="80%" m={20}>
            <H5>name</H5>
            <Input onChangeText={onNameChange} value={title} />
          </YStack>
          <YStack gap="$4" p="$2" w="80%" ml={20}>
            <H5>description</H5>
            <TextArea onChangeText={onDescriptionChange} value={description} />
          </YStack>
          <YStack gap="$4" p="$2" w="80%" ml={20}>
            <H5>Picture</H5>
            <Button
              onPress={() =>
                ImagePicker.openPicker({
                  width: 300,
                  height: 400,
                  cropping: true,
                  multiple: true,
                }).then((image) => {
                  setMarkerInfo((prev) => ({
                    ...prev,
                    imageUri: image.map((img) => img.path),
                  }))
                })
              }
            >
              Add Picture
            </Button>
            {markerInfo?.imageUri?.length > 0 &&
              (console.log(markerInfo?.imageUri),
              (
                <Carousel
                  loop={true}
                  modeConfig={{
                    mode: 'stack',
                    stackInterval: 18,
                  }}
                  mode="horizontal-stack"
                  width={300}
                  height={300}
                  scrollAnimationDuration={100}
                  data={markerInfo?.imageUri}
                  renderItem={({ item }) => <CardDemo uri={item} />}
                />
              ))}
          </YStack>
        </YStack>
      </ScrollView>

      <XStack f={1} jc="space-between" ai="flex-end" gap="$4" p={2} w="100%" m={2}>
        <Button icon={<TamaIcon iconName="PlusCircle" />} onPress={handleChange}>
          추가
        </Button>
        <Button icon={<TamaIcon iconName="ChevronLeft" />} onPress={() => router.back()}>
          뒤로가기
        </Button>
        {marker !== -1 ? (
          <Button icon={<TamaIcon iconName="Trash" />} onPress={handleRemove}>
            삭제
          </Button>
        ) : (
          <Button>현재 위치</Button>
        )}
      </XStack>
    </>
  )
}

export function CardDemo({ uri }) {
  return (
    <Card size="$4" width="100%" height="90%" backgroundColor="$black0" m="$2" p="$2">
      <Image source={{ uri: uri, width: 274, height: 300 }} />
      <Card.Footer>
        <XStack flex={1} m="$2" jc="flex-end" px="$4">
          <Button size="$3" icon={<TamaIcon iconName="Check" size="$2" />} px="$4" />
        </XStack>
      </Card.Footer>
    </Card>
  )
}
