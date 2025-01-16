import {
  Button,
  Paragraph,
  XStack,
  YStack,
  useToastController,
  Sheet,
  H2,
  ScrollView,
  Input,
} from '@my/ui'
import { ChevronDown, Search } from '@tamagui/lucide-icons'
import { useState, useEffect } from 'react'
import TamaIcon from '../ui/Icon'
import { useColorScheme } from 'react-native'

export function SheetDemo({ onChangeIdx, data, type }) {
  const [search, setSearch] = useState('')
  const [filterdData, setFilterdData] = useState(data)
  const toast = useToastController()
  const colorScheme = useColorScheme()
  console.log(data)
  useEffect(() => {
    console.log(search)

    if (search === '') {
      setFilterdData(data)
    } else {
      console.log('search')
      console.log(data)
      const prevFilterdData = data.filter(
        (item) =>
          item.title.includes(search) ||
          item.description.includes(search) ||
          item.hashTags.includes(search)
      )
      setFilterdData(prevFilterdData)
    }
    console.log(filterdData)
  }, [search, data])

  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)

  const title =
    type === 'marker' ? '마커' : type === 'route' ? '경로' : type === 'file' ? '파일' : '정보'
  console.log(colorScheme)
  return (
    <>
      <Button
        size="$6"
        circular
        onPress={() => setOpen((x) => !x)}
        icon={<TamaIcon iconName={open ? 'ChevronDown' : 'ChevronUp'} color="$black10" size="$4" />}
      ></Button>
      <Sheet
        modal
        animation="medium"
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Frame
          ai="center"
          gap="$5"
          bg={colorScheme === 'dark' ? '$black10' : '$white'}
          p="$2"
        >
          <XStack w="100%" jc="center" position="relative">
            <Input
              placeholder={`${title} 검색`}
              value={search}
              w="90%"
              onChangeText={setSearch}
              bg="#FFFFFFAA"
              borderRadius="$10"
            />
            <TamaIcon
              iconName="Search"
              color="#000000"
              size="$3"
              position="absolute"
              right="$6"
              top="$1"
            />
          </XStack>
          <ScrollView w="100%">
            <XStack gap="$2" p="$2" w="90%" m={20} ai="center">
              <Button
                size="$5"
                circular
                iconAfter={<TamaIcon iconName="MapPin" color="$black10" size="$2" />}
                onPress={() => {
                  onChangeIdx(0)
                  setOpen(false)
                }}
              />
              <YStack gap="$2" ml={20}>
                <H2>{'현재 ' + title}</H2>
                <Paragraph>{'description'}</Paragraph>
              </YStack>
            </XStack>
            {filterdData?.map((file, idx) => (
              <XStack gap="$2" p="$2" w="90%" m={20} ai="center" key={idx}>
                <Button
                  size="$5"
                  circular
                  onPress={() => {
                    onChangeIdx(idx + 1)
                    setOpen(false)
                  }}
                  iconAfter={
                    <TamaIcon
                      iconName={file['markerIcon'] || 'PinOff'}
                      color={file['markerColor'] || '$black10'}
                      size="$6"
                    />
                  }
                />
                <YStack gap="$2" ml={20}>
                  <H2>{file['title'] || 'example'}</H2>
                  <Paragraph>{file['description']}</Paragraph>
                </YStack>
              </XStack>
            ))}
          </ScrollView>
          <Button
            size="$6"
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
