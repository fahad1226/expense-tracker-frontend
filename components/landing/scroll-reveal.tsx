"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Premium easing — smooth deceleration */
export const easeLux = [0.22, 1, 0.36, 1] as const;

const defaultTransition = (delay = 0, reduceMotion: boolean | null) =>
    reduceMotion
        ? { duration: 0.01 }
        : { duration: 0.65, delay, ease: easeLux };

type RevealProps = {
    children: ReactNode;
    className?: string;
    delay?: number;
    y?: number;
};

export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
    const reduceMotion = useReducedMotion();
    return (
        <motion.div
            className={className}
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12, margin: "0px 0px -10% 0px" }}
            transition={defaultTransition(delay, reduceMotion)}
        >
            {children}
        </motion.div>
    );
}

type StaggerProps = {
    children: ReactNode;
    className?: string;
    stagger?: number;
    delayChildren?: number;
};

export function RevealStagger({
    children,
    className,
    stagger = 0.1,
    delayChildren = 0.06,
}: StaggerProps) {
    const reduceMotion = useReducedMotion();
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1, margin: "0px 0px -8% 0px" }}
            variants={
                reduceMotion
                    ? {
                          hidden: {},
                          visible: {
                              transition: {
                                  staggerChildren: 0,
                                  delayChildren: 0,
                              },
                          },
                      }
                    : {
                          hidden: {},
                          visible: {
                              transition: {
                                  staggerChildren: stagger,
                                  delayChildren,
                              },
                          },
                      }
            }
        >
            {children}
        </motion.div>
    );
}

type RevealItemProps = {
    children: ReactNode;
    className?: string;
};

export function RevealItem({ children, className }: RevealItemProps) {
    const reduceMotion = useReducedMotion();
    return (
        <motion.div
            className={className}
            variants={
                reduceMotion
                    ? {
                          hidden: { opacity: 1, y: 0 },
                          visible: { opacity: 1, y: 0 },
                      }
                    : {
                          hidden: { opacity: 0, y: 26 },
                          visible: {
                              opacity: 1,
                              y: 0,
                              transition: {
                                  duration: 0.55,
                                  ease: easeLux,
                              },
                          },
                      }
            }
        >
            {children}
        </motion.div>
    );
}
