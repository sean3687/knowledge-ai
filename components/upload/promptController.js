import React from "react";
import PromptReceipts from "./promptReceipts";
import PromptBankStatements from "./promptBankStatements";

function PromptController({ isOpen, onClose, type }) {
  if (!isOpen) return null;
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
        {type === "general" && <PromptReceipts />}
        {type === "receipts" && <PromptReceipts />}
        {type === "bankStatements" && <PromptBankStatements />}
    </div>
  );
}

export default PromptController;
