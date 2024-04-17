"use client"

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import useSpinner from "@/components/spinner";
import { toast } from "sonner";
// server actions
import { createDocument } from "@/actions/documents/actions";
// utils
import PubSub from "pubsub-js";

const DocumentsPage: React.FC = () => {
  const { Spinner, loading, setLoading } = useSpinner();

  async function createDoc() {
    setLoading(true);

    const promise = createDocument()
    toast.promise(promise, {
      success: () => {
        setLoading(false);
        PubSub.publish("refresh-documents-list");
        return "Document created"
      },
      error: () => {
        setLoading(false);
        return "Failed to create document"
      }
    })
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
        {
          loading ?
            <Spinner size="default" className="mr-2" />
            :
            <CirclePlus className="h-4 w-4 mr-2" />
        }
        Create a note
      </Button>
    </div>
  );
};

export default DocumentsPage;