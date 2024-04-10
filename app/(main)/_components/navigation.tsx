"use client"

// shadcn components
import { 
    ChevronsLeft, 
    MenuIcon, 
    PlusCircle, 
    Search, 
    Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
// components
import UserItem from "./user-item";
import Item from "./item";
import DocumentList from "./document-list";
// hooks
import {
    ElementRef,
    useRef,
    useState,
    useEffect,
    useMemo
} from "react";
import { useSession } from "next-auth/react";
import { useMediaQuery } from "usehooks-ts";
import { usePathname } from "next/navigation";
import useDocuments from "@/stores/documents";
// apis
import { createDocument } from "@/routes/documents";

const Navigation: React.FC = () => {
    // Fn - get documents
    const { documents, setDocuments } = useDocuments();
    const { data: session } = useSession();
    const user_id = useMemo(() => session?.user.id, [session]);

    async function createDoc() {
        const res = await createDocument(user_id!)

        if (res.ok) {
            const { document } = await res.json();
            setDocuments([...documents, document]);
            toast.success("document created");
        }
    }

    // Fn - navigation bar collapse
    const pathname = usePathname();
    const isMobile = useMediaQuery("(max-width: 768px)");

    const isResizingRef = useRef(false);
    const sidebarRef = useRef<ElementRef<"aside">>(null);
    const navbarRef = useRef<ElementRef<"div">>(null);

    const [isResetting, setIsResetting] = useState(false); // 鼠标按住缩放条时，标识是否正在进行缩放操作
    const [isCollapsed, setIsCollapsed] = useState(isMobile); // 根据设备屏幕尺寸判断是否折叠侧边栏

    // 屏幕宽度变化时，自动折叠侧边栏
    useEffect(() => {
        if (isMobile) {
            collapse();
        } else {
            resetWidth();
        }
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) {
            collapse();
        }
    }, [pathname, isMobile]);

    // 侧边栏缩放事件发送器：鼠标按住，启用对鼠标移动和鼠标松开的监听
    function handleMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event?.preventDefault();
        event?.stopPropagation();

        isResizingRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }

    function handleMouseMove(event: MouseEvent) {
        if (!isResizingRef.current) return;

        let newWidth = event.clientX;

        if (newWidth < 240) newWidth = 240;
        if (newWidth > 480) newWidth = 480;

        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`;
            navbarRef.current.style.setProperty("left", `${newWidth}px`);
            navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
        }
    }

    function handleMouseUp() {
        isResizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    }

    function resetWidth() {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(false);
            setIsResetting(true);

            sidebarRef.current.style.width = isMobile ? "100%" : "240px";
            navbarRef.current.style.setProperty("width", isMobile ? "0" : "calc(100% - 240px)");
            navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");

            setTimeout(() => setIsResetting(false), 300);
        }
    }

    function collapse() {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(true);
            setIsResetting(true);

            sidebarRef.current.style.width = "0px";
            navbarRef.current.style.setProperty("width", "100%");
            navbarRef.current.style.setProperty("left", "0");

            setTimeout(() => setIsResetting(false), 300);
        }
    }

    return (
        <>
            <aside
                ref={sidebarRef}
                className={cn("group/sidebar h-full bg-secondary overflow-y-auto relative flex flex-col w-60 z-10",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "w-0"
                )}
            >
                <div
                    onClick={collapse}
                    role="button"
                    className={cn(
                        "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-2 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                        isMobile && "opacity-100"
                    )}
                >
                    <ChevronsLeft className="h-6 w-6" />
                </div>
                <div>
                    <UserItem />
                    <Item
                        label="Search"
                        icon={Search}
                        isSearch
                        onClick={() => {}}
                    />
                    <Item
                        label="Settings"
                        icon={Settings}
                        onClick={() => {}}
                    />
                    <Item
                        label="New Page"
                        icon={PlusCircle}
                        onClick={createDoc}
                    />
                </div>

                {/* Documents */}
                <section className="mt-4">
                    <DocumentList />
                </section>

                <div
                    onMouseDown={handleMouseDown}
                    onClick={resetWidth}
                    className="opacity-0 group-hover/sidebar:opacity-100
                    transition cursor-ew-resize h-full w-1 
                    absolute right-0 top-0
                    bg-primary/10"
                />
            </aside>
            <div
                ref={navbarRef}
                className={cn(
                    "absolute top-0 z-10 left-60 w-[calc(100%-240px)]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "left-0 w-full"
                )}
            >
                <nav className="bg-transparent px-3 py-2 w-full">
                    {isCollapsed && <MenuIcon onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground" />}
                </nav>
            </div>
        </>
    );
};

export default Navigation;