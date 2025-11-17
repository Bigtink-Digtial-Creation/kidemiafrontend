interface AppImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export default function AppImage(props: AppImageProps) {
  return <img {...props} loading="lazy" />;
}
