"use client";

import { DataManagmentCard } from "./ui/data-managmentCard";

export function RevokeEmailAccess() {
  return (
    <DataManagmentCard
      cardTitle="Email Access Control"
      cardDescription="Manage third-party access to your email account"
      alertDialogTitle="Revoke Email Access"
      alertDialogDescription="This action will prevent our website from reading or sending emails on your behalf. 
                      You can always grant access again later if needed. Are you sure you want to proceed?"
      alertDialogAction="Revoke Access"
      url="/api/revokeAccess"
    />
  );
}
