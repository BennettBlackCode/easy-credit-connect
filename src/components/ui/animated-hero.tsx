
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

export function AnimatedTitle() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => [
      "SEO",
      "blog posts",
      "GBP posts",
      "backlink research",
      "keyword research",
      "competitor research"
    ],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <span className="relative flex w-full justify-center overflow-hidden text-center">
      {titles.map((title, index) => (
        <motion.span
          key={index}
          className="absolute font-semibold bg-gradient-to-r from-primary via-primary to-[#95F9C3] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", stiffness: 50 }}
          animate={
            titleNumber === index
              ? {
                  y: 0,
                  opacity: 1,
                }
              : {
                  y: titleNumber > index ? -150 : 150,
                  opacity: 0,
                }
          }
        >
          {title}
        </motion.span>
      ))}
    </span>
  );
}
