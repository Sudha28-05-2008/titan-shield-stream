import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Shield, User, Bell, Lock } from "lucide-react";

export default function Settings() {
  const { logout } = useApp();
  const navigate = useNavigate();

  const items = [
    { icon: User, label: "Profile", desc: "Manage your account details" },
    { icon: Bell, label: "Notifications", desc: "Payment and security alerts" },
    { icon: Lock, label: "Security", desc: "PIN, biometrics, and 2FA" },
    { icon: Shield, label: "Privacy", desc: "Data and permissions" },
  ];

  return (
    <div className="space-y-6 pb-6">
      <h1 className="text-xl font-bold text-foreground">Settings</h1>

      <div className="card-elevated p-5 flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center">
          <span className="text-lg font-bold text-primary-foreground">A</span>
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">Admin User</p>
          <p className="text-sm text-muted-foreground">admin@securepay.com</p>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="card-elevated p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
              <item.icon className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => { logout(); navigate("/login"); }}
        className="w-full card-elevated p-4 flex items-center gap-4 text-destructive hover:shadow-md transition-shadow"
      >
        <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
          <LogOut className="h-5 w-5" />
        </div>
        <span className="text-sm font-medium">Sign Out</span>
      </button>
    </div>
  );
}
