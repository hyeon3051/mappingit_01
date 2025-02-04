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
  Stack,
  Text,
} from '@my/ui'
import { Cannabis, ChevronDown, Search } from '@tamagui/lucide-icons'
import { useState, useEffect, useMemo, useCallback } from 'react'
import TamaIcon from '../ui/Icon'
import { useColorScheme, Image, Platform, Linking, TouchableOpacity, View } from 'react-native'
import {
  TestIds,
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
  NativeAdEventType,
  NativeAdChoicesPlacement,
  NativeMediaAspectRatio,
} from 'react-native-google-mobile-ads'

export function SheetDemo({ onChangeIdx, data, type, selectedIdx }) {
  const [search, setSearch] = useState('')
  const stringToColor = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    let color = '#'
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      color += value.toString(16).padStart(2, '0')
    }
    return color
  }
  const colorScheme = useColorScheme()
  const isFilterdData = (search, item) => {
    return (
      item.title.includes(search) ||
      item.description.includes(search) ||
      item?.hashTags?.includes(search)
    )
  }

  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)

  const title =
    type === 'marker' ? '마커' : type === 'route' ? '경로' : type === 'file' ? '파일' : '정보'
  return (
    <>
      <Button
        size="$6"
        circular
        onPress={() => setOpen((x) => !x)}
        bg="$white5"
        icon={<TamaIcon iconName={open ? 'ChevronDown' : 'ChevronUp'} color="$black10" size="$4" />}
      ></Button>
      <Sheet
        modal
        animation="medium"
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
      >
        <Sheet.Frame
          ai="center"
          gap="$6"
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
              borderRadius="$2"
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
            <XStack gap="$2" px="$2" w="90%" mx={20} ai="center" key="current">
              <Button
                size="$5"
                circular
                iconAfter={<TamaIcon iconName="MapPin" color="$white10" size="$2" />}
                onPress={() => {
                  onChangeIdx(-1)
                  setOpen(false)
                }}
              />
              <YStack gap="$2" ml={20} px="$2">
                <H2>{'현재 ' + title}</H2>
                <Paragraph>{'description'}</Paragraph>
              </YStack>
            </XStack>
            {data?.map((file, idx) => {
              if (search && !isFilterdData(search, file)) {
                return
              }
              return (
                <YStack key={file.id + idx}>
                  <XStack gap="$2" px="$2" w="90%" mx={20} ai="center">
                    <Button
                      size="$5"
                      circular
                      onPress={() => {
                        onChangeIdx(idx)
                        setOpen(false)
                      }}
                      iconAfter={
                        <TamaIcon
                          iconName={file['markerIcon'] || 'PinOff'}
                          color={idx == selectedIdx ? '$white' : file['markerColor'] || '$black10'}
                          size="$6"
                          backgroundColor={idx === selectedIdx ? file['markerColor'] : '$white'}
                          circular
                          borderRadius="10"
                        />
                      }
                    />
                    <YStack gap="$2" ml={20}>
                      <H2 px="$2">{file['title'] || 'example'}</H2>
                      <Paragraph px="$2">{file['description'] || 'description'}</Paragraph>
                      <XStack f={1} ai="center" jc="center">
                        <XStack flexWrap="wrap" w="100%" gap="$2">
                          {Array.isArray(file?.hashTags) &&
                            file?.hashTags?.map((tag) => (
                              <XStack key={tag} px="$1">
                                <Text color={stringToColor(tag)}>{tag}</Text>
                              </XStack>
                            ))}
                        </XStack>
                      </XStack>
                    </YStack>
                  </XStack>
                </YStack>
              )
            })}
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

const NativeComponent = () => {
  const [nativeAd, setNativeAd] = useState<NativeAd>()

  useEffect(() => {
    if (NativeAd) {
      NativeAd.createForAdRequest(
        Platform.OS === 'android'
          ? 'ca-app-pub-5218306923860994/1043521337'
          : 'ca-app-pub-5218306923860994/9703664462',
        {
          aspectRatio: NativeMediaAspectRatio.LANDSCAPE,
          adChoicesPlacement: NativeAdChoicesPlacement.BOTTOM_LEFT,
        }
      )
        .then(setNativeAd)
        .catch(console.error)
    }
  }, [])

  useEffect(() => {
    if (!nativeAd) return
    const listener = nativeAd.addAdEventListener(NativeAdEventType.CLICKED, () => {
      console.log('Native ad clicked')
    })
    return () => {
      listener.remove()
      // or
      nativeAd.destroy()
    }
  }, [nativeAd])

  if (!nativeAd) {
    return null
  }

  return (
    <NativeAdView
      nativeAd={nativeAd}
      style={{
        backgroundColor: 'white',
        borderRadius: 10,
        border: '1px solid black',
        margin: 15,
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      <View style={{ padding: 8, gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {nativeAd.icon && (
            <NativeAsset assetType={NativeAssetType.ICON}>
              <Image source={{ uri: nativeAd.icon.url }} width={24} height={24} />
            </NativeAsset>
          )}
          <NativeAsset assetType={NativeAssetType.HEADLINE}>
            <Text style={{ fontSize: 6, fontWeight: 'bold' }}>{nativeAd.headline}</Text>
          </NativeAsset>
          <Text
            style={{
              backgroundColor: '#FBBC04',
              color: 'white',
              paddingHorizontal: 2,
              paddingVertical: 1,
              fontSize: 6,
              borderRadius: 4,
            }}
          >
            AD
          </Text>
        </View>
        {nativeAd.advertiser && (
          <NativeAsset assetType={NativeAssetType.ADVERTISER}>
            <Text>{nativeAd.advertiser}</Text>
          </NativeAsset>
        )}
        <NativeAsset assetType={NativeAssetType.BODY}>
          <Text>{nativeAd.body}</Text>
        </NativeAsset>
      </View>
      <NativeMediaView />
      <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
        <Text
          style={{
            color: 'white',
            fontWeight: 'bold',
            backgroundColor: '#4285F4',
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          {nativeAd.callToAction}
        </Text>
      </NativeAsset>
    </NativeAdView>
  )
}
