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
import { ChevronLeft, Link } from '@tamagui/lucide-icons'
import { useLink, useParams, useRouter } from 'solito/navigation'
import { useUser } from '@clerk/clerk-expo'

export function UserDetailScreen() {
  const params = useParams<{ id: number }>()
  const router = useRouter()

  const linkProps = useLink({
    href: `/icon/${params.id}`,
  })

  const { user } = useUser()
  return (
    <>
      <ScrollView bg="$background">
        <YStack f={1} bg="$background">
          <Button {...linkProps} icon={Link} />
          <XStack gap="$4" p="$4">
            <Avatar circular size="$8">
              <Avatar.Image accessibilityLabel="Cam" src={user?.imageUrl} />
              <Avatar.Fallback backgroundColor="$blue10" />
            </Avatar>
            <YStack gap="$2">
              <Paragraph fow="700" col="$blue10">
                {user?.firstName} {user?.lastName} (구독 중)
              </Paragraph>
              <Paragraph col="$black10">{user?.emailAddresses[0].emailAddress}</Paragraph>
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
