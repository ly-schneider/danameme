import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ProfileImage({ src, className, ...rest }) {
  const imageClassName = cn(src ? "" : "saturate-0", className);
  const imageSrc = !src ? "/images/danameme-profile-image.png" : src.startsWith("blob") ? src : `${src}?auto=format&auto=compress&cs=srgb&mask=ellipse&w=250&h=250&fit=crop&fm=png`;

  return (
    <Image className={imageClassName} src={imageSrc} {...rest} />
  );
}