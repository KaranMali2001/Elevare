import { X } from "lucide-react";
import { Button } from "./ui/button";

function ModalHeader({ handleModalClose, heading1, heading2 = "" }: any) {
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-300">
      <div className="flex gap-2">
        <h3 className="font-semibold">{heading1}</h3>
        <h3>{heading2}</h3>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={handleModalClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default ModalHeader;
