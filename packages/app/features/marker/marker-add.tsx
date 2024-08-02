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
} from '@my/ui'
import { Scale } from '@tamagui/lucide-icons'
import TamaIcon from 'packages/app/ui/Icon'
import { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { useLink, useParams, useRouter, useSearchParams } from 'solito/navigation'
import { fileState, fileDispatch } from 'packages/app/contexts/mapData/fileReducer'
import { selectedIcon } from 'packages/app/types/type'

export function AddMarkerView() {
  const userInfo = useContext(fileState)
  const params = useParams<selectedIcon>()

  const [markerInfo, setMarkerInfo] = useState({
    name: '',
    description: '',
  })

  const { name, description } = markerInfo

  const router = useRouter()

  const linkProps = useLink({
    href: `/marker`,
  })

  const onNameChange = (text) => {
    setMarkerInfo((prev) => ({
      ...prev,
      name: text,
    }))
  }
  const onDescriptionChange = (text) => {
    setMarkerInfo((prev) => ({
      ...prev,
      description: text,
    }))
  }

  const handleChange = () => {
    console.log(markerInfo)
  }
  useEffect(() => {
    console.log(userInfo?.currentRoute)
    console.log(params)
  }, [])

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
          <H3>{name || 'example'}</H3>
          <H6>Lorem ipsum</H6>
        </YStack>
      </XStack>
      <YStack gap="$4" p="$2" w="80%" m={20}>
        <H5>name</H5>
        <Input onChangeText={onNameChange} value={name} />
      </YStack>
      <YStack gap="$4" p="$2" w="80%" ml={20}>
        <H5>description</H5>
        <TextArea onChange={onDescriptionChange} value={description} />
      </YStack>
      <YStack gap="$4" p="$2" w="80%" ml={20}>
        <H5>Picture</H5>
        <Image />
      </YStack>

      <XStack f={1} jc="space-between" ai="flex-end" gap="$4" p={2} w="100%" m={2}>
        <Button
          {...linkProps}
          icon={<TamaIcon iconName="PlusCircle" />}
          onPress={handleChange}
        ></Button>
        <Button icon={<TamaIcon iconName="ChevronLeft" />} onPress={() => router.back()}></Button>
        <Button icon={<TamaIcon iconName="Trash" />} onPress={() => router.back()}></Button>
      </XStack>
    </YStack>
  )
}
