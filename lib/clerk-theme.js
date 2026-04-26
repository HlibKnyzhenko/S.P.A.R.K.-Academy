export const clerkAppearance = {
  variables: {
    colorPrimary: "#ffffff",
    colorBackground: "rgba(255,255,255,0.06)",
    colorInputBackground: "rgba(255,255,255,0.07)",
    colorInputText: "#f8fbff",
    colorText: "#f8fbff",
    colorTextSecondary: "rgba(255,255,255,0.72)",
    colorNeutral: "#00eaff",
    borderRadius: "18px",
    fontFamily: "Montserrat, sans-serif",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "w-full max-w-[460px]",
    card:
      "w-full rounded-[28px] border border-white/12 bg-white/6 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl",
    headerTitle: "text-white text-2xl font-extrabold",
    headerSubtitle: "text-white/70",
    socialButtonsBlockButton:
      "rounded-2xl border border-white/12 bg-white/8 text-white hover:bg-white/12",
    socialButtonsBlockButtonText: "font-semibold",
    dividerLine: "bg-white/10",
    dividerText: "text-white/45 text-xs uppercase tracking-[0.22em]",
    formFieldLabel: "text-white/78 font-semibold",
    formFieldInput:
      "h-12 rounded-2xl border border-white/12 bg-black/20 text-white placeholder:text-white/35 focus:border-white/30 focus:bg-black/30 focus:ring-0",
    formButtonPrimary:
      "h-12 rounded-2xl bg-white text-black font-bold shadow-none hover:bg-white/92",
    footerActionText: "text-white/60",
    footerActionLink: "text-[#00eaff] hover:text-white",
    identityPreviewEditButton:
      "rounded-full border border-white/12 bg-white/8 text-white hover:bg-white/12",
    formResendCodeLink: "text-[#00eaff] hover:text-white",
    otpCodeFieldInput:
      "h-12 w-12 rounded-2xl border border-white/12 bg-black/20 text-white",
    alertText: "text-white",
    formFieldSuccessText: "text-[#7df6b0]",
    formFieldErrorText: "text-[#ff8e8e]",
  },
};
