import {
  Button,
  Paragraph,
  XStack,
  YStack,
  SizableText,
  Separator,
  Stack,
  useToastController,
  Sheet,
  Card,
  H2,
  ScrollView,
} from '@my/ui'
import TamaIcon from '../ui/Icon'

export function CardDemo({ title, description, markerIcon, markerColor }) {
  return (
    <Card size="$4" width="100%" height="90%" backgroundColor="$black0" m="$2" p="$2">
      <Card.Header padded>
        <Paragraph></Paragraph>
      </Card.Header>
      <Stack
        borderColor="$white075"
        backgroundColor="$white075"
        borderWidth="$1"
        alignSelf="flex-start"
        py="$4"
        width="$15"
        height="$20"
      >
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
          <Button size="$3" icon={<TamaIcon iconName="Check" size="$2" />} px="$4" />
        </XStack>
      </Card.Footer>
    </Card>
  )
}
