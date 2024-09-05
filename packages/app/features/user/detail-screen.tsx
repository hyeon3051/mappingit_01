import {
  Avatar,
  Button,
  ListItem,
  Paragraph,
  ScrollView,
  Separator,
  Stack,
  XStack,
  YGroup,
  YStack,
} from '@my/ui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import TamaIcon from 'packages/app/ui/Icon'
import { useParams, useRouter } from 'solito/navigation'

export function UserDetailScreen() {
  const router = useRouter()
  const { id } = useParams()

  return (
    <>
      <ScrollView bg="$background">
        <YStack f={1} bg="$background">
          <XStack gap="$4" p="$4">
            <Avatar circular size="$8">
              <Avatar.Image
                accessibilityLabel="Cam"
                src="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80"
              />
              <Avatar.Fallback backgroundColor="$blue10" />
            </Avatar>
            <YStack gap="$2">
              <Paragraph fow="700" col="$blue10">
                hyeon3051 (구독 중)
              </Paragraph>
              <Paragraph col="$black10">google 계정으로 로그인</Paragraph>
            </YStack>
          </XStack>
          <YGroup>
            <YGroup.Item>
              <ListItem title="아이콘 수정" subTitle="색생, 아이콘 변경" />
            </YGroup.Item>
            <YGroup.Item>
              <ListItem title="유저 정보" subTitle="유저 정보 수정" />
            </YGroup.Item>
            <YGroup.Item>
              <ListItem>Third</ListItem>
            </YGroup.Item>
          </YGroup>
        </YStack>
      </ScrollView>
    </>
  )
}
