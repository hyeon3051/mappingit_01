import {
  Button,
  XStack,
  YStack,
  Stack,
  Input,
  Text,
  TextArea,
  H3,
  Card,
  H6,
  ScrollView,
  Image,
  Separator,
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
import stringToColor from 'packages/app/utils/stringToColor'
export function AddMarkerView() {
  const fileInfo = useContext(fileState)
  const dispatch = useContext(fileDispatch)
  const params = useParams<{ icon: string; color: string; marker: number }>()
  const marker = parseInt(`${params.marker}`)
  console.log(marker, 'markerId')
  const [markerInfo, setMarkerInfo] = useState<Marker>({
    id: uuidv4(),
    title: '',
    description: '',
    markerColor: '',
    markerIcon: '',
    imageUri: [],
    hashTags: [],
    pos: fileInfo.pos,
  })
  useEffect(() => {
    const { icon, color, marker } = params
    setMarkerInfo((prev) => ({
      ...prev,
      markerIcon: icon,
      markerColor: color,
    }))
    if (marker !== -1 && fileInfo?.markers[marker]) {
      const selectedMarker = fileInfo?.markers[marker]
      let { id, title, description, imageUri, hashTags } = selectedMarker
      setMarkerInfo((prev) => ({
        ...prev,
        id: id,
        title: title,
        description: description,
        imageUri: imageUri,
        hashTags: hashTags,
      }))
    }
  }, [params])
  let { title, description, hashTags } = markerInfo

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

  const onHashTagChange = (text: string) => {
    setMarkerInfo((prev) => ({
      ...prev,
      hashTags: [...prev.hashTags, text],
    }))
  }

  const onHashTagRemove = (text: string) => {
    setMarkerInfo((prev) => ({
      ...prev,
      hashTags: prev.hashTags.filter((tag) => tag !== text),
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
    console.log(marker)
    if (marker === -1) {
      dispatch({ type: 'ADD_MARKER', payload: { marker: markerInfo } })
    } else {
      dispatch({
        type: 'EDIT_MARKER',
        payload: { marker: markerInfo, markerId: markerInfo.id },
      })
    }
    router.back()
    router.back()
  }

  return (
    <>
      <ScrollView>
        <YStack f={1} gap="$0" w="100%" h="100%" jc="flex-start" p="$2">
          <XStack gap="$4" p="$2" w="100%" m={20} ai="center">
            <Button
              size="$7"
              circular
              iconAfter={<TamaIcon iconName={params.icon} size="$6" />}
              color={params.color}
            />
            <YStack>
              <H6>마커</H6>
              <H3>{title || '제목'}</H3>
            </YStack>
          </XStack>
          <YStack gap="$4" p="$2" w="80%" m={20}>
            <H6>마커</H6>
            <Input onChangeText={onNameChange} value={title} focusStyle={{ borderColor: 'blue' }} />
          </YStack>
          <YStack gap="$4" p="$2" w="80%" ml={20}>
            <H6>설명</H6>
            <TextArea onChangeText={onDescriptionChange} value={description} />
          </YStack>
          <YStack gap="$4" p="$2" w="80%" ml={20}>
            <H6>사진</H6>
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
              사진 추가
            </Button>
            {Array.isArray(markerInfo.imageUri) && (
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
                data={markerInfo.imageUri}
                renderItem={({ item }) => <CardDemo uri={item} />}
              />
            )}
          </YStack>
          <YStack gap="$4" p="$2" w="80%" m={20}>
            <H6>해시태그</H6>
            <HashTagCard
              hashTags={hashTags}
              setHashTags={onHashTagChange}
              onHashTagRemove={onHashTagRemove}
            />
          </YStack>
        </YStack>
      </ScrollView>

      <XStack f={1} jc="space-between" ai="flex-end" gap="$4" p={2} w="100%" m={2}>
        <Button
          icon={<TamaIcon iconName="ChevronLeft" />}
          onPress={() => router.back()}
          bg="$gray10"
          opacity={0.8}
          circular
        ></Button>
        <Button
          icon={<TamaIcon iconName="PlusCircle" />}
          onPress={handleChange}
          bg={marker !== 0 ? '$green10' : '$blue10'}
          opacity={0.8}
          circular
        ></Button>
        {marker !== -1 ? (
          <Button
            icon={<TamaIcon iconName="Trash" />}
            onPress={handleRemove}
            bg="$red10"
            opacity={0.8}
            circular
          ></Button>
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

export function HashTagCard({
  hashTags,
  setHashTags,
  onHashTagRemove,
}: {
  hashTags: string[]
  setHashTags: (hashTags: string[]) => void
  onHashTagRemove: (hashTags: string[]) => void
}) {
  const [hashTag, setHashTag] = useState('')
  const onEnroll = () => {
    if (hashTag) {
      setHashTags(hashTag)
      setHashTag('')
    }
  }
  return (
    <>
      <XStack flex={1} ai="center" jc="flex-start" flexWrap="wrap" gap="$2" p="$2">
        {hashTags &&
          hashTags.length > 0 &&
          hashTags?.map((tag) => (
            <XStack
              key={tag}
              ai="center"
              jc="center"
              borderRadius="$3"
              backgroundColor={stringToColor(tag) + 'CC'}
            >
              <Text fontSize="$8" p="$2" color="$white1">
                {tag}
              </Text>
              <Button
                onPress={() => onHashTagRemove(tag)}
                circular
                position="absolute"
                size="$1"
                top="-5%"
                right="-5%"
              >
                <TamaIcon iconName="X" size="$1" />
              </Button>
            </XStack>
          ))}
        <Separator />
        <XStack>
          <Input w="80%" placeholder="해시태그" value={hashTag} onChangeText={setHashTag} />
          <Button onPress={onEnroll}>
            <TamaIcon iconName="PlusCircle" size="$2" />
          </Button>
        </XStack>
      </XStack>
    </>
  )
}
