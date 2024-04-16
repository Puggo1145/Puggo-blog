"use client"

import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogContent,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useState, useEffect } from "react";

const RegisterCheckDialog: React.FC<{ open: boolean }> = ({ open }) => {

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Want to register?</DialogTitle>
                    <DialogClose onClick={() => setIsOpen(false)} />
                    <DialogDescription>
                        It looks like you do not have an account yet. Click sign up button again to register after closing this window.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-2">
                    <Button onClick={() => setIsOpen(false)}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RegisterCheckDialog;