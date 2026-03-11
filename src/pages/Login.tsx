import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Shield, Delete } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const { login, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  if (isAuthenticated) return <Navigate to="/home" replace />;

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    setError(false);

    if (newPin.length === 4) {
      setTimeout(() => {
        if (login(newPin)) {
          navigate("/home");
        } else {
          setError(true);
          setShake(true);
          setTimeout(() => { setPin(""); setShake(false); }, 500);
        }
      }, 300);
    }
  };

  const handleDelete = () => {
    setPin((p) => p.slice(0, -1));
    setError(false);
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-4 shadow-lg">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">SecurePay</h1>
          <p className="text-sm text-muted-foreground mt-1">Predictive Payment Security</p>
        </motion.div>

        {/* PIN dots */}
        <motion.div
          animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex justify-center gap-4 mb-3"
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`pin-dot ${i < pin.length ? "pin-dot-filled" : ""} ${error ? "border-destructive" : ""}`}
            />
          ))}
        </motion.div>

        <p className="text-xs text-muted-foreground mb-8">
          {error ? "Incorrect PIN. Try again." : "Enter your 4-digit PIN"}
        </p>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
          {keys.map((key, i) => (
            <div key={i} className="flex justify-center">
              {key === "" ? (
                <div className="h-16 w-16" />
              ) : key === "del" ? (
                <button onClick={handleDelete} className="keypad-btn text-muted-foreground">
                  <Delete className="h-5 w-5" />
                </button>
              ) : (
                <button onClick={() => handleDigit(key)} className="keypad-btn hover:bg-accent">
                  {key}
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-10">Secure access required.</p>
      </div>
    </div>
  );
}
