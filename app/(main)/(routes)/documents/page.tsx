"use client"

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import useSpinner from "@/components/spinner";
import { toast } from "sonner";
// hooks
import { useSession } from "next-auth/react";
import useDocuments from "@/stores/documents";
// apis
import { createDocument } from "@/routes/documents";

const DocumentsPage: React.FC = () => {

  const { data: session } = useSession();
  const { documents, setDocuments } = useDocuments();
  const { Spinner, loading, setLoading } = useSpinner();

  async function createDoc() {
    const user_id = session?.user.id;

    setLoading(true);

    const res = await createDocument(user_id!);

    if (res.ok) {
      const { document } = await res.json();

      toast.success("Document created");
      setDocuments([...documents, document]);
    } else {
      toast.error("Failed to create document");
    }

    setLoading(false);
  }

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        height={300}
        width={300}
        alt="Empty"
        className="dark:hidden"
      />
      <Image
        src="/empty.png"
        height={300}
        width={300}
        alt="Empty"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        {/* Welcome to {user?.firstName}&apos;s Notion */}
      </h2>
      <Button onClick={createDoc} disabled={loading} >
        {loading ? <Spinner size="default" className="mr-2" /> : <CirclePlus className="h-4 w-4 mr-2" />}
        Create a note
      </Button>
    </div>
  );
};

export default DocumentsPage;