
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

export function AnimatedTitle() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => [
      "SEO",
      "Blog Posts",
      "GBP Posts",
      "Backlink Research",
      "Keyword Research",
      "Competitor Research"
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
    <div className="relative h-20 w-full">
      {titles.map((title, index) => (
        <motion.span
          key={index}
          className="absolute left-1/2 -translate-x-1/2 font-semibold bg-gradient-to-r from-primary via-primary to-[#95F9C3] bg-clip-text text-transparent whitespace-nowrap"
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
    </div>
  );
}
