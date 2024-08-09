import {
  Button,
  Paragraph,
  XStack,
  YStack,
  SizableText,
  Separator,
  Stack,
  Square,
  ButtonIcon,
  useEvent,
  Input,
  TextArea,
  H1,
  H3,
  H6,
  H5,
  TextAreaFrame,
  Image,
  useToastController,
} from '@my/ui'
import { Scale } from '@tamagui/lucide-icons'
import TamaIcon from 'packages/app/ui/Icon'
import { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { useLink, useParams, useRouter, useSearchParams } from 'solito/navigation'
import { fileState, fileDispatch } from 'packages/app/contexts/mapData/fileReducer'
import { selectedIcon, Marker } from 'packages/app/types/type'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
export function AddMarkerView() {
  const toast = useToastController()
  const fileInfo = useContext(fileState)
  const dispatch = useContext(fileDispatch)
  const params = useParams<{ icon: string; color: string; marker: number }>()

  console.log(params)
  const marker = parseInt(`${params.marker}` || '-1')

  const [markerInfo, setMarkerInfo] = useState<Marker>({
    id: uuidv4(),
    title: '',
    description: '',
    markerColor: '',
    markerIcon: '',
    pos: fileInfo?.currentRoute[fileInfo.currentRoute.length - 1]?.[0],
  })

  useEffect(() => {
    setMarkerInfo((prev) => ({
      ...prev,
      markerIcon: params.icon,
      markerColor: params.color,
    }))
    if (!isNaN(params.marker)) {
      const selectedMarker = fileInfo?.markers[marker]
      console.log(selectedMarker)
      setMarkerInfo((prev) => ({
        ...prev,
        id: selectedMarker.id,
        title: selectedMarker.title,
        description: selectedMarker.description,
      }))
    }
  }, [params])

  const { title, description } = markerInfo

  const router = useRouter()

  const linkProps = useLink({
    href: `/marker`,
  })

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
    console.log(markerInfo)
  }

  const handleRemove = () => {
    if (isNaN(params.marker) || params.marker === '-1') return
    dispatch({
      type: 'REMOVE_MARKER',
      payload: { markerId: marker },
    })
    router.replace('/marker/marker')
  }

  const handleChange = () => {
    console.log(params.marker)
    if (isNaN(params.marker) && params.marker !== '-1') {
      dispatch({ type: 'ADD_MARKER', payload: { marker: markerInfo } })
    } else {
      dispatch({
        type: 'EDIT_MARKER',
        payload: { marker: markerInfo, markerId: markerInfo.id },
      })
    }
    toast.show('Sheet closed!', {
      message: 'Just showing how toast works...',
    })
    router.replace('/marker/marker')
  }

  return (
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
        <Image />
      </YStack>

      <XStack f={1} jc="space-between" ai="flex-end" gap="$4" p={2} w="100%" m={2}>
        <Button icon={<TamaIcon iconName="PlusCircle" />} onPress={handleChange}></Button>
        <Button icon={<TamaIcon iconName="ChevronLeft" />} onPress={() => router.back()}></Button>
        <Button icon={<TamaIcon iconName="Trash" />} onPress={handleRemove}></Button>
      </XStack>
    </YStack>
  )
}
