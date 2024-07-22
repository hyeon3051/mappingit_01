import { Button, Paragraph, YStack } from '@my/ui'
import { ChevronLeft, PlusCircle } from '@tamagui/lucide-icons'
import { useRouter } from 'solito/navigation'

export function UserDetailScreen() {
  const router = useRouter()

  return (
    <YStack f={1} jc="center" ai="center" gap="$4" bg="$background">
      <Button icon={PlusCircle} onPress={() => router.back()}></Button>
    </YStack>
  )
}
