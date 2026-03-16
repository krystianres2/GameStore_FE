import { HTMLAttributes } from "react";

type ImageProps = HTMLAttributes<HTMLImageElement>;

export const Image = (props : ImageProps) => {
  const {className, ...rest} = props;
  const imageClassName = 'image ' + (className || '')
  return <img className={imageClassName} {...rest} />
}