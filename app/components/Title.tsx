import { ReactNode } from "react";

interface TitleProps {
  children: ReactNode;
}

export const Title = ({children}: TitleProps) => {
    return <h1>{children}</h1>
}