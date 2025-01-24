import * as Icons from '@tamagui/lucide-icons'

const TamaIcon = ({
  iconName,
  color = '$black10',
  size = '$5',
  backgroundColor = '$white0',
  borderRadius = '$0',
  strokeWidth = 2,
  ...props
}) => {
  const IconComponent = Icons[iconName]

  if (!IconComponent) {
    return null // 아이콘이 없을 경우 처리
  }

  return (
    <IconComponent
      size={size}
      color={color}
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
      {...props}
      strokeWidth={strokeWidth}
    />
  )
}

export default TamaIcon
