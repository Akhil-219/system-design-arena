import { useEffect, useRef } from "react";

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function GoogleSignInButton({ onCredential }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    loadGoogleScript().then(() => {
      if (cancelled || !containerRef.current) return;

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: (response) => onCredential(response.credential),
      });

      window.google.accounts.id.renderButton(containerRef.current, {
        theme: "filled_black",
        size: "large",
        shape: "rectangular",
        width: 320,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [onCredential]);

  return <div ref={containerRef} className="flex justify-center" />;
}

export default GoogleSignInButton;