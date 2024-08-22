import {
  Button,
  XStack,
  YStack,
  Input,
  TextArea,
  H3,
  H6,
  H5,
  useToastController,
  Square,
  Slider,
  SliderProps,
  Separator,
} from '@my/ui'
import TamaIcon from 'packages/app/ui/Icon'
import { useContext, useEffect, useState } from 'react'
import { useLink, useParams, useRouter } from 'solito/navigation'
import { fileState, fileDispatch } from 'packages/app/contexts/mapData/fileReducer'
import { FileState } from 'packages/app/types/type'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
export function AddFileView() {
  const toast = useToastController()
  const fileInfo = useContext(fileState)
  const dispatch = useContext(fileDispatch)
  const params = useParams<{ fileId: number }>()

  const fileId = params.fileId || -1

  const [currentFileInfo, setCurrentFileInfo] = useState<FileState>({
    id: '',
    title: '',
    description: '',
    routes: [],
    markers: [],
  })

  const fileSelectProps = useLink({
    href: `/file/selectFile`,
  })

  useEffect(() => {
    setCurrentFileInfo((prev) => ({
      ...prev,
    }))
    if (fileId !== -1) {
      const { id, title, description, routes, markers } = currentFileInfo
      setCurrentFileInfo((prev) => ({
        ...prev,
        id: id,
        title: title,
        description: description,
        routes: routes,
        markers: markers,
      }))
    }
  }, [params])

  const { title, description, routes, markers } = currentFileInfo

  const router = useRouter()

  const onNameChange = (text) => {
    setCurrentFileInfo((prev) => ({
      ...prev,
      title: text,
    }))
  }
  const onDescriptionChange = (text) => {
    setCurrentFileInfo((prev) => ({
      ...prev,
      description: text,
    }))
  }

  const handleRemove = () => {
    if (fileId === -1 && fileId) return
    /*
    sqlite3 => delete from file where id = fileId
    fileId: integer
    */
    router.replace('/file/file')
  }

  const handleChange = () => {
    if (fileId !== -1 && fileId) {
      /*
      sqlite3 => update file set title = title, description = description where id = fileId
      for (let i = 0; i < routes.length; i++) {
        if (prevRoutes[i].delete_flag !== currRoutes[i].delete_flag) {
         sqlite3 => update route set delete_flag = 1 where id = routes[i].id
        }
      }
      for (let i = 0; i < markers.length; i++) {
        if (prevMarkers[i].delete_flag !== currMarkers[i].delete_flag) {
         sqlite3 => update marker set delete_flag = 1 where id = markers[i].id
        }
      }
      }
      */
    } else {
      /*
      sqlite3 => insert into file (id, title, description) values (fileId, title, description)
      batch = []
      sqltie3 => insert into route (id, title, description, lineColor, lineWidth) values (routeId, title, description, lineColor, lineWidth)
      batch.push(routeId)
      sqlite3 => insert into marker (id, title, description, markerIcon, markerColor) values (markerId, title, description, markerIcon, markerColor)
      batch.push(markerId)
      batch.excute()
      */
    }
    toast.show('Sheet closed!', {
      message: 'Just showing how toast works...',
    })
    router.replace('/file/file')
  }

  return (
    <>
      <YStack f={1} gap="$1" w="100%" h="100%" jc="flex-start" p="$2">
        <XStack gap="$4" p="$2" w="100%" m={20} ai="center">
          <YStack>
            <H3>{title || 'example'}</H3>
            <H6>Lorem ipsum</H6>
          </YStack>
        </XStack>
        <YStack gap="$4" p="$2" w="80%" ml={20}>
          <H5>name</H5>
          <Input onChangeText={onNameChange} value={title} />
        </YStack>
        <YStack gap="$4" p="$2" w="80%" ml={20}>
          <H5>description</H5>
          <TextArea onChangeText={onDescriptionChange} value={description} />
        </YStack>
        <YStack gap="$4" p="$2" w="80%" ml={20}>
          <H5>파일 결합</H5>
          <XStack gap="$2" jc="space-between">
            <Button icon={<TamaIcon iconName="File" />} {...fileSelectProps}>
              파일 선택
            </Button>
          </XStack>
        </YStack>
        <YStack gap="$4" p="$2" w="80%" ml={20}></YStack>

        <XStack f={1} jc="space-between" ai="flex-end" gap="$4" p={2} w="100%" m={2}>
          <Button icon={<TamaIcon iconName="PlusCircle" />} onPress={handleChange}></Button>
          <Button icon={<TamaIcon iconName="ChevronLeft" />} onPress={() => router.back()}></Button>
          <Button icon={<TamaIcon iconName="Trash" />} onPress={handleRemove}></Button>
        </XStack>
      </YStack>
    </>
  )
}

function SimpleSlider({ children, ...props }: SliderProps) {
  return (
    <Slider defaultValue={[2]} max={15} step={1} {...props}>
      <Slider.Track>
        <Slider.TrackActive />
      </Slider.Track>
      <Slider.Thumb size="$2" index={0} circular />
      {children}
    </Slider>
  )
}
