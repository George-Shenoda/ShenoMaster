import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Create Post | ShenoMaster",
    description: "Share your Thoughts",
    authors: [{ name: "George Shenoda" }],
};

const layout = ({ children }: { children: ReactNode }) => {
    return <>{children}</>;
};

export default layout;
