import { PropsWithChildren } from "react";
import Navbar from "./_components/navbar";

const MarketingLayout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="h-full dark:bg-darkbackground">
            <Navbar />
            <main className="h-full pt-40">
                {children}
            </main>
        </div>
    );
};

export default MarketingLayout;