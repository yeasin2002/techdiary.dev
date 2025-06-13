"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface ContextType {
  show: () => void;
  closeModal: () => void;
}

const Context = createContext<ContextType | undefined>(undefined);

export function AppLoginPopupProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const show = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <Context.Provider value={{ show, closeModal }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent aria-describedby={undefined}>
          <AlertDialogHeader>
            <AlertDialogTitle>Titleee</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>COntent</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </Context.Provider>
  );
}

export function useLoginPopup() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useLoginPopup must be used within a ModalProvider");
  }
  return context;
}
