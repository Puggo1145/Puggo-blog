import { PropsWithChildren } from "react";

import Logo from "../(marketing)/_components/logo";

const LoginLayout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="h-full">
            <div className="fixed top-0 w-full flex items-center bg-background p-6">
                <Logo />
            </div>
            <main className="h-full">
                {children}
            </main>
        </div>
    );
};

export default LoginLayout;