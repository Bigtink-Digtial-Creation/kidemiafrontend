import { Image } from "@heroui/react";
import { footerData } from "../../staticData/home";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  containerVariants,
  itemVariants,
  linkVariants,
  logoVariants,
  socialIconVariants,
} from "./variants";

const iconClasses = "text-kidemia-white text-base";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      <div
        className="relative bg-cover bg-center h-full text-white"
        style={{ backgroundImage: `url("/src/assets/images/map-bg.svg")` }}
      >
        <div className="absolute inset-0 bg-black/75" />

        <div className="relative z-10 container max-w-screen-xl mx-auto h-full px-2 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:justify-items-center">
              <motion.div
                variants={logoVariants}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
                className="col-span-1 cursor-pointer"
              >
                <Image src="src/assets/kidemia.svg" alt="logo" />
              </motion.div>

              {footerData.map((section, idx) => (
                <motion.div key={idx} variants={itemVariants}>
                  <motion.h4
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="font-semibold mb-3 text-white"
                  >
                    {section.title}
                  </motion.h4>
                  <ul className="space-y-2 text-sm text-white">
                    {section.links.map((link, linkIdx) => (
                      <motion.li
                        key={linkIdx}
                        className="hover:underline  hover:text-kidemia-secondary cursor-pointer"
                        variants={linkVariants}
                        initial="rest"
                        whileHover="hover"
                        whileInView={{
                          opacity: [0, 1],
                          x: [20, 0],
                        }}
                        transition={{
                          delay: idx * 0.1 + linkIdx * 0.05,
                          duration: 0.4,
                        }}
                      >
                        <Link to={link.href}>{link.label}</Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}

              {/* Desktop Social Icons */}
              <motion.div
                className="hidden md:flex space-x-4"
                variants={itemVariants}
              >
                <motion.a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialIconVariants}
                  whileHover={{
                    scale: 1.2,
                    rotate: 5,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div className="w-9 h-9 cursor-pointer rounded-full bg-black flex items-center justify-center">
                    <FaXTwitter className={iconClasses} />
                  </motion.div>
                </motion.a>

                <motion.a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialIconVariants}
                  whileHover={{
                    scale: 1.2,
                    rotate: -5,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div className="w-9 h-9 cursor-pointer rounded-full bg-[#3b5998] flex items-center justify-center">
                    <FaFacebookF className={iconClasses} />
                  </motion.div>
                </motion.a>

                <motion.a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialIconVariants}
                  whileHover={{
                    scale: 1.2,
                    rotate: 5,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div className="w-9 h-9 cursor-pointer rounded-full bg-[#0077b5] flex items-center justify-center">
                    <FaLinkedinIn className={iconClasses} />
                  </motion.div>
                </motion.a>
              </motion.div>
            </div>

            {/* Bottom Bar with Social Icons */}
            <motion.div
              className="flex flex-col md:flex-row justify-between items-center mt-10 pt-6 border-t md:border-0 border-white/20 text-white"
              variants={itemVariants}
            >
              <motion.p
                className="text-sm mb-4 md:mb-0 text-kidemia-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                © {currentYear} Kidemia. All Rights Reserved.
              </motion.p>

              {/* Mobile Social Icons */}
              <motion.div
                className="flex space-x-4 md:hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <motion.a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    scale: 1.2,
                    rotate: 10,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div className="w-9 h-9 cursor-pointer rounded-full bg-black flex items-center justify-center">
                    <FaXTwitter className={iconClasses} />
                  </motion.div>
                </motion.a>

                <motion.a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    scale: 1.2,
                    rotate: -10,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div className="w-9 h-9 cursor-pointer rounded-full bg-[#3b5998] flex items-center justify-center">
                    <FaFacebookF className={iconClasses} />
                  </motion.div>
                </motion.a>

                <motion.a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    scale: 1.2,
                    rotate: 10,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div className="w-9 h-9 cursor-pointer rounded-full bg-[#0077b5] flex items-center justify-center">
                    <FaLinkedinIn className={iconClasses} />
                  </motion.div>
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
