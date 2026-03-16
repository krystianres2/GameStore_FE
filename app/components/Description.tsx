import { HTMLAttributes } from "react";

type DescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const Description = (props : DescriptionProps) => {
  const {className, ...rest} = props;
  const descriptionClassName = 'description ' + (className || '')
  return <p className={descriptionClassName} {...rest} />
}