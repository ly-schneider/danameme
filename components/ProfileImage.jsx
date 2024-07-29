import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ProfileImage({ src, className, ...rest }) {
  const imageClassName = cn(src ? "" : "saturate-0", className);
  const imageSrc = `${src}?auto=format&auto=compress&cs=srgb&mask=ellipse&w=250&h=250&fit=crop&fm=png` || "/images/danameme-profile-image.png";

  return (
    <Image className={imageClassName} src={imageSrc} {...rest} />
  );
}