"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useSidebarPreference(key: string, defaultValue: boolean) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  // Charger la préférence
  useEffect(() => {
    if (status === "loading") {
      return;
    }

    const loadPreference = async () => {
      try {
        if (session?.user) {
          // Utilisateur connecté (régulier ou invité) → charger depuis l'API
          const response = await fetch(`/api/user/preferences?key=${key}`);
          if (response.ok) {
            const data = await response.json();
            if (data.value !== null && data.value !== undefined) {
              setIsOpen(data.value);
            }
          }
        } else {
          // Pas de session (cas extrême) → localStorage
          const saved = localStorage.getItem(`sidebar:${key}`);
          if (saved !== null) {
            setIsOpen(JSON.parse(saved));
          }
        }
      } catch {
        // Ignorer l'erreur
        console.error("Failed to load preference");
      } finally {
        setIsLoading(false);
      }
    };

    loadPreference();
  }, [key, session, status]);

  // Sauvegarder quand ça change
  const setPreference = async (newValue: boolean) => {
    setIsOpen(newValue);

    try {
      if (session?.user) {
        // Utilisateur connecté → API
        await fetch("/api/user/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value: newValue }),
        });
      } else {
        // Pas de session → localStorage
        localStorage.setItem(`sidebar:${key}`, JSON.stringify(newValue));
      }
    } catch {
      console.error("Failed to save preference");
    }
  };

  return { isOpen, setPreference, isLoading };
}
