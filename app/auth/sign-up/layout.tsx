import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Sign Up | ShenoMaster",
    description: "Create a new account",
    authors: [{ name: "George Shenoda" }],
};

const layout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            {children}
        </>
    );
};

export default layout;