import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Login | ShenoMaster",
    description: "Login to your account.",
    authors: [{ name: "George Shenoda" }],
};

const layout = async ({ children }: { children: ReactNode }) => {
    return <>{children}</>;
};
export default layout;
