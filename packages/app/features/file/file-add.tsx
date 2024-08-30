import { Button, XStack, YStack, Input, TextArea, H3, H6, H5, useToastController } from '@my/ui'
import TamaIcon from 'packages/app/ui/Icon'
import { useContext, useEffect, useState } from 'react'
import { useLink, useParams, useRouter } from 'solito/navigation'
import { fileState, fileDispatch } from 'packages/app/contexts/mapData/fileReducer'
import { FileState } from 'packages/app/types/type'
import {
  addFile,
  addMarker,
  addRoute,
  getFileDataById,
  getMarkerById,
  getRouteById,
  updateFile,
  deleteFile,
} from 'packages/app/contexts/fileData/fileReducer'
import { useSQLiteContext } from 'expo-sqlite'
export function AddFileView() {
  const toast = useToastController()
  const fileInfo = useContext(fileState)
  const dispatch = useContext(fileDispatch)
  const params = useParams<{ fileId: number }>()
  const db = useSQLiteContext()

  const fileId = params.fileId || -1

  const [currentFileInfo, setCurrentFileInfo] = useState<FileState>({
    id: -1,
    title: '',
    description: '',
    routes: [],
    markers: [],
  })

  const fileSelectProps = useLink({
    href: `/file/selectFile`,
  })

  const fileDataSelectProps = useLink({
    href: `/file/selectData/?fileId=${fileId}`,
  })

  useEffect(() => {
    async function setup() {
      setCurrentFileInfo((prev) => ({
        ...prev,
      }))
      console.log(fileId)
      if (fileId !== -1) {
        const file = await getFileDataById(fileId, db)
        const routes = await getRouteById(fileId, db)
        const markers = await getMarkerById(fileId, db)
        const { id, title, description } = file
        setCurrentFileInfo((prev) => ({
          ...prev,
          id: id,
          title: title,
          description: description,
          routes: routes,
          markers: markers,
        }))
      }
    }
    setup()
  }, [params])

  const { title, description, routes, markers } = currentFileInfo

  const router = useRouter()

  const onFileChange = () => {
    const { title, description } = currentFileInfo
    console.log(title, description)
    dispatch({ type: 'SET_TITLE', payload: { title, description } })
    if (fileId !== -1 && fileId) {
      router.replace(`/file/selectData/?fileId=${fileId}`)
    } else {
      router.replace(`/file/selectFile`)
    }
  }

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

  const handleRemove = async () => {
    if (fileId === -1 && fileId) return
    await deleteFile(fileId, db)
    router.replace('/file/file')
  }

  const handleChange = async () => {
    if (fileId !== -1 && fileId) {
      updateFile({ title, description }, fileId, db)
    } else {
      const file = await addFile({ title, description }, db)
      const fileId = file.lastInsertRowId
      console.log(fileId)
      for (let route of fileInfo.routes) {
        const routeId = await addRoute({ ...route, parent: fileId }, db)
        console.log(routeId, 'routeId')
      }
      console.log(markers)
      for await (let marker of fileInfo.markers) {
        const markerId = await addMarker({ ...marker, parent: fileId }, db)
        console.log(markerId, 'markerId')
      }
      dispatch({ type: 'INIT' })
    }
    /*
      sqlite3 => insert into file (id, title, description) values (fileId, title, description)
      batch = []
      sqltie3 => insert into route (id, title, description, lineColor, lineWidth) values (routeId, title, description, lineColor, lineWidth)
      batch.push(routeId)
      sqlite3 => insert into marker (id, title, description, markerIcon, markerColor) values (markerId, title, description, markerIcon, markerColor)
      batch.push(markerId)
      batch.excute()
      */
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
            <Button icon={<TamaIcon iconName="File" />} onPress={onFileChange}>
              파일 선택
            </Button>
          </XStack>
        </YStack>
        <YStack gap="$4" p="$2" w="80%" ml={20}></YStack>

        <XStack f={1} jc="space-between" ai="flex-end" gap="$4" p={2} w="100%" m={2}>
          <Button icon={<TamaIcon iconName="PlusCircle" />} onPress={handleChange}>
            추가
          </Button>
          <Button icon={<TamaIcon iconName="ChevronLeft" />} onPress={() => router.back()}>
            뒤로가기
          </Button>
          <Button icon={<TamaIcon iconName="Trash" />} onPress={handleRemove}>
            삭제
          </Button>
        </XStack>
      </YStack>
    </>
  )
}
