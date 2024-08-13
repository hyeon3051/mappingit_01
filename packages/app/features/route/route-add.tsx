import { Button, XStack, YStack, Input, TextArea, H3, H6, H5, useToastController, Square, Slider, SliderProps,Separator } from '@my/ui'
import TamaIcon from 'packages/app/ui/Icon'
import { useContext, useEffect, useState } from 'react'
import { useLink, useParams, useRouter } from 'solito/navigation'
import { fileState, fileDispatch } from 'packages/app/contexts/mapData/fileReducer'
import { Marker, Route } from 'packages/app/types/type'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
export function AddRouteView() {
  const toast = useToastController()
  const fileInfo = useContext(fileState)
  const dispatch = useContext(fileDispatch)
  const params = useParams<{ routeId: number }>()

  const routeIdx = parseInt(`${params.routeId}` || '-1')

  const [routeInfo, setRouteInfo] = useState<Route>({
    id: uuidv4(),
    title: '',
    description: '',
    path: [],
    lineWidth: 3,
    lineColor: "#fbfbfb"
  })

  useEffect(() => {
    setRouteInfo((prev) => ({
      ...prev,
    }))
    if (routeIdx !== -1 && fileInfo?.routes[routeIdx]) {
      const selectedRoute = fileInfo?.routes[routeIdx]
      const { id, title, description, path } = selectedRoute
      setRouteInfo((prev) => ({
        ...prev,
        id: id,
        title: title,
        description: description,
        path: path
      }))
    }
  }, [params])

  const { title, description,  id:routeId, lineColor, lineWidth } = routeInfo

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

  const onWidthChange = (value) =>{
    console.log()
    setRouteInfo((prev)=>({
      ...prev,
      lineWidth: value[0]
    }))
  } 

  const handleRemove = () => {
    if (routeIdx === -1 && routeId) return
    dispatch({
      type: 'REMOVE_ROUTE',
      payload: { routeId: routeId },
    })
    router.replace('/marker/marker')
  }

  const handleChange = () => {
    if (routeIdx !== -1 && routeId) {
      dispatch({ type: 'EDIT_ROUTE', payload: { routeId: routeId, route: routeInfo }})
    } else {
      dispatch({
        type: 'ADD_ROUTE',
        payload: {  routeId: routeId },
      })
    }
    toast.show('Sheet closed!', {
      message: 'Just showing how toast works...',
    })
    router.replace('/marker/marker')
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
      <XStack gap="$4" p="$2" w="80%" ml={20} ai="center">
        <Separator backgroundColor={lineColor} borderColor={lineColor} borderWidth={lineWidth}/>
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
        <H5>color</H5>
        <XStack gap="$2" jc="space-between">
          {['$red10', '$blue10', '$purple10', '$green10'].map((color, index) => (
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
          <H5>width</H5>
          <SimpleSlider onValueChange={onWidthChange}/>
        </YStack>

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