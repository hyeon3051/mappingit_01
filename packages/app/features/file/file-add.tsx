import { Button, XStack, YStack, Input, TextArea, H3, H6, H5, useToastController } from '@my/ui'
import TamaIcon from 'packages/app/ui/Icon'
import { useContext, useEffect, useState, useTransition } from 'react'
import { useLink, useParams, useRouter } from 'solito/navigation'
import { fileState, fileDispatch } from 'app/contexts/mapData/fileReducer'
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
  const [isPending, startTransition] = useTransition()
  const dispatch = useContext(fileDispatch)
  const params = useParams<{ fileId: number }>()
  const [fileId, setFileId] = useState<number>(params.fileId || -1)
  const db = useSQLiteContext()

  const [currentFileInfo, setCurrentFileInfo] = useState<FileState>({
    id: -1,
    title: '',
    description: '',
    routes: [],
    markers: [],
  })

  useEffect(() => {
    setFileId(Number(params.fileId) || -1)
  }, [params.fileId])

  useEffect(() => {
    async function setup() {
      if (fileId === -1) {
        setCurrentFileInfo((prev) => ({
          ...prev,
        }))
        return
      }
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
    setup()
  }, [fileId])

  const { title, description, routes, markers } = currentFileInfo

  const router = useRouter()

  const onFileChange = () => {
    const { title, description } = currentFileInfo
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
    router.back()
  }

  const handleChange = () => {
    startTransition(async () => {
      if (fileId !== -1 && fileId) {
        await updateFile({ title, description }, fileId, db)
        toast.hide()
        toast.show('파일 수정이 완료되었습니다.')
      } else {
        const file = await addFile({ title, description }, db)
        const fileId = file.lastInsertRowId
        for await (let route of fileInfo.routes) {
          addRoute({ ...route, parent: fileId }, db)
        }
        for await (let marker of fileInfo.markers) {
          addMarker({ ...marker, parent: fileId }, db)
        }
        toast.hide()
        toast.show('파일 추가가 완료되었습니다.')
        dispatch({ type: 'INIT' })
      }
    })
    /*
      sqlite3 => insert into file (id, title, description) values (fileId, title, description)
      batch = []
      sqltie3 => insert into route (id, title, description, lineColor, lineWidth) values (routeId, title, description, lineColor, lineWidth)
      batch.push(routeId)
      sqlite3 => insert into marker (id, title, description, markerIcon, markerColor) values (markerId, title, description, markerIcon, markerColor)
      batch.push(markerId)
      batch.excute()
      */
    router.back()
  }

  return (
    <>
      <YStack f={1} gap="$1" w="100%" h="100%" jc="flex-start" p="$2">
        <XStack gap="$4" p="$2" w="100%" m={20} ai="center">
          <YStack>
            <H6>파일 추가</H6>
            <H3>{title || 'example'}</H3>
          </YStack>
        </XStack>
        <YStack gap="$4" p="$2" w="80%" ml={20}>
          <H6>제목</H6>
          <Input onChangeText={onNameChange} value={title} />
        </YStack>
        <YStack gap="$4" p="$2" w="80%" ml={20}>
          <H6>설명</H6>
          <TextArea onChangeText={onDescriptionChange} value={description} />
        </YStack>
        <YStack gap="$4" p="$2" w="80%" ml={20}>
          <H6>파일 결합</H6>
          <XStack gap="$2" jc="space-between">
            <Button icon={<TamaIcon iconName="File" />} onPress={onFileChange}>
              파일 선택
            </Button>
          </XStack>
        </YStack>
        <YStack gap="$4" p="$2" w="80%" ml={20}></YStack>

        <XStack f={1} jc="space-between" ai="flex-end" gap="$4" p={2} w="100%" m={2}>
          <Button
            icon={<TamaIcon iconName="ChevronLeft" />}
            onPress={() => router.back()}
            bg="$gray10"
          >
            뒤로가기
          </Button>
          <Button
            iconAfter={<TamaIcon iconName="PlusCircle" />}
            onPress={handleChange}
            bg="$green10"
          >
            추가
          </Button>
          {fileId !== -1 && fileId ? (
            <Button
              icon={<TamaIcon iconName="Trash" />}
              onPress={handleRemove}
              bg="$red10"
              disabled={isPending}
            >
              삭제
            </Button>
          ) : null}
        </XStack>
      </YStack>
    </>
  )
}
