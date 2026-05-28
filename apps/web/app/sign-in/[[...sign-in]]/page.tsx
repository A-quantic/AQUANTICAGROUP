import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <SignIn 
        fallbackRedirectUrl="/redirect"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-navy/80 border border-gold/20 shadow-2xl",
            headerTitle: "text-white font-serif",
            headerSubtitle: "text-white/60",
            socialButtonsBlockButton: "bg-white/10 border border-white/20 text-white hover:bg-white/20",
            socialButtonsBlockButtonText: "text-white",
            dividerLine: "bg-white/20",
            dividerText: "text-white/60",
            formFieldLabel: "text-white/80",
            formFieldInput: "bg-white/10 border-white/20 text-white placeholder:text-white/40",
            formButtonPrimary: "bg-gold text-navy hover:bg-gold/90",
            footerActionText: "text-white/60",
            footerActionLink: "text-gold hover:text-gold/80",
          }
        }}
      />
    </div>
  );
}
