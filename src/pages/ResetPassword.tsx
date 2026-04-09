import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-md space-y-6">
        <Link to="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to login
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-foreground">Set new password</h1>
          <p className="text-sm text-muted-foreground mt-1">Choose a strong password for your account.</p>
        </div>

        {done ? (
          <div className="rounded-lg border bg-card p-6 text-center space-y-3 animate-fade-in">
            <div className="rounded-full bg-success/10 p-3 inline-flex">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <h3 className="font-semibold text-foreground">Password updated</h3>
            <p className="text-sm text-muted-foreground">You can now sign in with your new password.</p>
            <Link to="/login">
              <Button className="mt-2">Sign in</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pw">New password</Label>
              <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpw">Confirm password</Label>
              <Input id="cpw" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={!password || password !== confirm}>
              Update password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
