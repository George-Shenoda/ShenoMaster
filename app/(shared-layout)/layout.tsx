import { ReactNode } from "react";
import Navbar from "../../components/web/navbar";

function SharedLayout({ children }: { children: ReactNode }) {
    return (
        <>
                <Navbar />
                {children}
        </>
    );
}

export default SharedLayout;
