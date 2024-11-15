import { motion, AnimatePresence } from "framer-motion";
import { ShieldOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import axios from "axios";
export function DataManagmentCard({
  cardTitle,
  cardDescription,
  alertDialogTitle,
  alertDialogDescription,
  alertDialogAction,
  url,
}: {
  cardTitle: string;
  cardDescription: string;
  alertDialogTitle: string;
  alertDialogDescription: string;
  alertDialogAction: string;
  url: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRevokeAccess = () => {
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    const res = await axios.post(url);
    // Implement the actual revoke access logic here
    console.log("Email access revoked");
    setIsDialogOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-primary">
            {cardTitle}
          </CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>
        <div className="p-6">
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                onClick={handleRevokeAccess}
                variant="outline"
                className="w-full bg-destructive/10 hover:bg-destructive/20 text-destructive hover:text-destructive-foreground transition-colors duration-200"
              >
                <ShieldOffIcon className="w-5 h-5 mr-2" />
                {alertDialogTitle}
              </Button>
            </AlertDialogTrigger>
            <AnimatePresence>
              {isDialogOpen && (
                <AlertDialogContent
                  //@ts-ignore
                  as={motion.div}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle>Revoke Email Access?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {alertDialogDescription}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleConfirm}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors duration-200"
                    >
                      Yes, {alertDialogAction}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              )}
            </AnimatePresence>
          </AlertDialog>
        </div>
      </Card>
    </motion.div>
  );
}
