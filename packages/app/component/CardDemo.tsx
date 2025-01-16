import { Button, Paragraph, XStack, YStack, SizableText, Stack, Card } from '@my/ui'
import TamaIcon from '../ui/Icon'
import { useColorScheme } from 'react-native'

export function CardDemo({
  title,
  description,
  markerIcon,
  markerColor,
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
  const colorScheme = useColorScheme()
  return (
    <Card
      size="$4"
      width="80%"
      height="90%"
      backgroundColor={colorScheme === 'dark' ? '#000000AA' : '#ffffffAA'}
      m="$2"
      p="$2"
    >
      <Stack alignSelf="flex-start" py="$4" width="$15" height="$20">
        <XStack gap="$3" ai="flex-start" jc="center" px="$4">
          <TamaIcon iconName={markerIcon} color={markerColor} size="$3" />
          <YStack alignContent="center" w="80%">
            <SizableText size="$8">{title}</SizableText>
            <Paragraph size="$1">{description}</Paragraph>
          </YStack>
        </XStack>
      </Stack>
      <Card.Footer>
        <XStack flex={1} m="$2" jc="flex-end">
          <Button
            size="$3"
            icon={<TamaIcon iconName="Check" size="$2" />}
            px="$4"
            onPress={onSelect}
          />
          {onFileSelect && (
            <Button
              size="$3"
              icon={<TamaIcon iconName="PlusCircle" size="$2" />}
              px="$4"
              onPress={onFileSelect}
            />
          )}
        </XStack>
      </Card.Footer>
    </Card>
  )
}
