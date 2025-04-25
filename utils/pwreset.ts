import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "@/components/ui/use-toast";

export async function sendInitialPasswordReset(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    toast({
      title: "Password Reset Sent",
      description: `An email was sent to ${email} to set the password.`,
    });
  } catch (error: any) {
    toast({
      title: "Reset Failed",
      description: error.message || "Failed to send reset email.",
      variant: "destructive",
    });
    throw error;
  }
}
