import { ReactNode } from "react";

interface CardProps {
    key: number;
    title: React.ReactNode;
    content: React.ReactNode;
}

interface Props {
  children: ReactNode;
}

// export const GenreCard = ({key, title, content }: CardProps) => {
//     return (
//         <div className="card">
//             {title}
//             {content}
//         </div>
//     );
// }