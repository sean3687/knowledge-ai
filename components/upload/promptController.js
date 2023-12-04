import React from "react";
import PromptReceipts from "./promptReceipts";
import PromptBankStatements from "./promptBankStatements";

function PromptController({ isOpen, onClose, itemId, type }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto bg-white">
      <div className="text-xl flex">
        <div onClick={onClose}>Back to files</div>
        <div className="flex mr-0 ml-auto">
          <div> | </div>
          <div>Automation Status</div>
          <div>Save</div>
        </div>
      </div>
      <>
        {type === "general" && <PromptReceipts />}
        {type === "receipts" && <PromptReceipts />}
        {type === "bankStatements" && <PromptBankStatements />}
      </>
    </div>
  );
}

export default PromptController;
