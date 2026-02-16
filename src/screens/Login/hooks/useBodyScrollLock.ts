import { useEffect } from "react";

export const useBodyScrollLock = () => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingBottom = document.body.style.paddingBottom;

    document.body.style.overflow = "hidden";
    document.body.style.paddingBottom = "0";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingBottom = originalPaddingBottom;
    };
  }, []);
};