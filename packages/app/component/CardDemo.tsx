import { Button, Paragraph, XStack, YStack, SizableText, Stack, Card } from '@my/ui'
import TamaIcon from '../ui/Icon'
import { useColorScheme } from 'react-native'
import { useEffect, useState } from 'react'

export function CardDemo({
  title,
  description,
  markerIcon,
  lineWidth,
  color,
  onSelect = () => {},
  onFileSelect,
}: {
  title: string
  description: string
  markerIcon: string
  markerColor: string
  onSelect?: () => void
  onFileSelect?: () => void
}) {
  const [strokeWidth, setStrokeWidth] = useState(2)
  useEffect(() => {
    if (lineWidth < 5) {
      setStrokeWidth(1)
    } else if (lineWidth < 10) {
      setStrokeWidth(2)
    } else if (lineWidth < 15) {
      setStrokeWidth(3)
    } else if (lineWidth < 20) {
      setStrokeWidth(4)
    }
  }, [lineWidth])
  return (
    <Card size="$4" width="80%" height="90%" backgroundColor="white" m="$2" p="$2" opacity={0.8}>
      <Stack alignSelf="flex-start" py="$4" width="$15" height="$20">
        <XStack gap="$3" ai="flex-start" jc="center" px="$4">
          <TamaIcon iconName={markerIcon} size="$3" color={color} strokeWidth={strokeWidth} />
          <YStack alignContent="center" w="80%">
            <SizableText size="$8">{title}</SizableText>
            <Paragraph size="$1">{description}</Paragraph>
          </YStack>
        </XStack>
      </Stack>
      <Card.Footer>
        {onFileSelect && (
          <XStack flex={1} m="$2" jc="flex-end" pos="absolute" bottom={20} left={0} right={0}>
            <Button
              size="$3"
              icon={<TamaIcon iconName="Check" size="$2" />}
              px="$4"
              onPress={onSelect}
            />
            <Button
              size="$3"
              icon={<TamaIcon iconName="PlusCircle" size="$2" />}
              px="$4"
              onPress={onFileSelect}
            />
          </XStack>
        )}
      </Card.Footer>
    </Card>
  )
}
