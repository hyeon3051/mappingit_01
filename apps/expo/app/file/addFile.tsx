import { AddFileView } from 'app/features/file/file-add'
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
} from 'react-native-google-mobile-ads'
import { Stack } from 'expo-router'
import { useTheme } from '@my/ui'
import { useState, useEffect } from 'react'
export default function Screen() {
  const theme = useTheme()

  return (
    <>
      <Stack.Screen
        options={{
          title: '파일 추가',
          presentation: 'modal',
          animation: 'slide_from_bottom',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      <AddFileView />
    </>
  )
}

const NativeComponent = () => {
  const [nativeAd, setNativeAd] = useState<NativeAd>()

  useEffect(() => {
    NativeAd.createForAdRequest(TestIds.NATIVE).then(setNativeAd).catch(console.error)
  }, [])

  if (!nativeAd) {
    return null
  }

  return (
    <NativeAdView nativeAd={nativeAd}>
      {nativeAd.icon && (
        <NativeAsset assetType={NativeAssetType.ICON}>
          <Image source={{ uri: nativeAd.icon.url }} width={24} height={24} />
        </NativeAsset>
      )}
      <NativeAsset assetType={NativeAssetType.HEADLINE}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{nativeAd.headline}</Text>
      </NativeAsset>
      // Always display an ad attribution to denote that the view is an advertisement
      <Text>Sponsored</Text>
      // Display the media asset
      <NativeMediaView />
    </NativeAdView>
  )
}
