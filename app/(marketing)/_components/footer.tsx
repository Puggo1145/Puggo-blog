import Logo from "./logo";
import { Button } from "@/components/ui/button";

const Footer: React.FC = () => {
  return (
    <div className="flex items-center w-full p-6 bg-background z-50 dark:bg-darkbackground">
        <Logo />
        <div className="
            md:ml-auto 
            w-full 
            flex items-center justify-between md:justify-end gap-x-2
            text-muted-foreground
        ">  
            <Button variant="ghost" size="sm">Privacy Policy</Button>
            <Button variant="ghost" size="sm">Terms & Conditions</Button>
        </div>
    </div>
  );
};

export default Footer;