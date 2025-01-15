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
import { fileState, fileDispatch } from 'app/contexts/mapData/fileReducer'
import { Route } from 'packages/app/types/type'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
export function AddRouteView() {
  const toast = useToastController()
  const fileInfo = useContext(fileState)
  const dispatch = useContext(fileDispatch)
  const params = useParams<{ routeId: number }>()

  const routeIdx = params.routeId

  const [routeInfo, setRouteInfo] = useState<Route>({
    id: uuidv4(),
    title: '',
    description: '',
    path: fileInfo?.currentRoute || [],
    lineWidth: 3,
    lineColor: '#fbfbfb',
  })

  useEffect(() => {
    if (routeIdx !== 0 && fileInfo?.routes[routeIdx]) {
      const selectedRoute = fileInfo?.routes[routeIdx]
      const { id, title, description, lineColor, lineWidth, path } = selectedRoute
      setRouteInfo((prev) => ({
        ...prev,
        id: id,
        title: title,
        description: description,
        path: path,
        lineColor: lineColor,
        lineWidth: lineWidth,
      }))
    }
  }, [params])

  const { title, description, id: routeId, lineColor, lineWidth } = routeInfo

  const router = useRouter()

  const onNameChange = (text) => {
    setRouteInfo((prev) => ({
      ...prev,
      title: text,
    }))
  }
  const onDescriptionChange = (text) => {
    setRouteInfo((prev) => ({
      ...prev,
      description: text,
    }))
  }

  const onWidthChange = (value) => {
    setRouteInfo((prev) => ({
      ...prev,
      lineWidth: value[0],
    }))
  }

  const handleRemove = () => {
    if (routeIdx === 0 && routeId) return
    dispatch({
      type: 'REMOVE_ROUTE',
      payload: { routeId: routeId },
    })
    router.replace('/route/route')
  }

  const handleChange = () => {
    if (routeIdx !== 0 && routeId) {
      dispatch({ type: 'EDIT_ROUTE', payload: { routeId: routeId, route: routeInfo } })
    } else {
      dispatch({
        type: 'ADD_ROUTE',
        payload: { route: routeInfo },
      })
      dispatch({ type: 'CHANGE_IS_RECORD_FALSE' })
    }
    router.back()
  }

  const linkProps = useLink({
    href: `/route/editRoute/${routeId}`,
  })

  const changeRoutePath = () => {
    linkProps.onPress()
  }

  return (
    <>
      <YStack f={1} gap="$1" w="100%" h="100%" jc="flex-start" p="$2">
        <XStack gap="$4" p="$2" w="100%" m={20} ai="center">
          <YStack>
            <H3>{title || '제목'}</H3>
            <H6>제목</H6>
          </YStack>
        </XStack>
        <XStack gap="$4" p="$2" w="80%" ml={20} ai="center">
          <Separator backgroundColor={lineColor} borderColor={lineColor} borderWidth={lineWidth} />
        </XStack>
        <YStack gap="$4" p="$2" w="80%" ml={20}>
          <H5>이름</H5>
          <Input onChangeText={onNameChange} value={title} />
        </YStack>
        <YStack gap="$4" p="$2" w="80%" ml={20}>
          <H5>설명</H5>
          <TextArea onChangeText={onDescriptionChange} value={description} />
        </YStack>
        <YStack gap="$4" p="$2" w="80%" ml={20}>
          <H5>색상</H5>
          <XStack gap="$2" jc="space-between">
            {['#FF0000', '#00FF00', '#0000FF', '#FF00FF'].map((color, index) => (
              <Square
                key={index}
                size="$6"
                hoverStyle={{
                  scale: 1.5,
                }}
                pressStyle={{
                  scale: 0.9,
                }}
                onPress={() =>
                  setRouteInfo({
                    ...routeInfo,
                    lineColor: color,
                  })
                }
                backgroundColor={color}
                elevation={color === '$red10' ? '$5' : undefined}
              />
            ))}
          </XStack>
        </YStack>
        <YStack gap="$4" p="$2" w="80%" ml={20}>
          <H5>너비</H5>
          <SimpleSlider onValueChange={onWidthChange} />
        </YStack>

        <XStack f={1} jc="space-between" ai="flex-end" gap="$4" p={2} w="100%" m={2}>
          <Button icon={<TamaIcon iconName="PlusCircle" />} onPress={handleChange}></Button>
          <Button icon={<TamaIcon iconName="ChevronLeft" />} onPress={() => router.back()}></Button>
          <Button icon={<TamaIcon iconName="Check" />} onPress={changeRoutePath}></Button>
          {routeIdx !== 0 && (
            <>
              <Button icon={<TamaIcon iconName="Trash" />} onPress={handleRemove}></Button>
            </>
          )}
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
