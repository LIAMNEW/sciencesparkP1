import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Settings as SettingsIcon, Trash2, LogOut, User } from "lucide-react";

export default function Settings() {
  const [user, setUser] = React.useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const handleLogout = () => {
    base44.auth.logout();
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await base44.entities.User.delete(user.id);
      base44.auth.logout();
    } catch (err) {
      console.error("Delete account error:", err);
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto pb-24 lg:pb-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
          <SettingsIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm">Manage your account</p>
        </div>
      </div>

      {/* Account Info */}
      <Card className="border-none shadow-md mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="w-4 h-4 text-purple-600" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {user && (
            <>
              <p className="text-sm text-gray-700"><span className="font-medium">Name:</span> {user.full_name}</p>
              <p className="text-sm text-gray-700"><span className="font-medium">Email:</span> {user.email}</p>
            </>
          )}
          <Button variant="outline" onClick={handleLogout} className="mt-4 w-full flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-2 border-red-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-base text-red-600 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full" disabled={isDeleting}>
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete Account"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your account, all chat history, quiz attempts, and progress data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}