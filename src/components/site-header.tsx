"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation } from "@/content/site";
import { Logo } from "./logo";
import { Arrow, ButtonLink, Container, cx } from "./ui";

/** Which nav item matches the part of the homepage being read: the section whose top most recently passed the header. */
function useActiveHref() {
  const pathname = usePathname();
  const [active, setActive] = useState("/");

  useEffect(() => {
    if (pathname !== "/") return;
    const targets = navigation
      .filter((n) => n.href.startsWith("/#"))
      .map((n) => ({ href: n.href, el: document.getElementById(n.href.slice(2)) }))
      .filter((t): t is { href: string; el: HTMLElement } => t.el !== null);

    const onScroll = () => {
      // Nav order isn't page order, so take the passed section nearest the top.
      let current = "/";
      let nearest = -Infinity;
      for (const t of targets) {
        const top = t.el.getBoundingClientRect().top;
        if (top < 140 && top > nearest) {
          nearest = top;
          current = t.href;
        }
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return pathname === "/" ? active : null;
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveHref();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header
      className={cx(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled || open
          ? "border-line bg-paper/85 backdrop-blur-xl backdrop-saturate-150"
          : "border-white/[0.06] bg-paper/40 backdrop-blur-md",
      )}
    >
      <Container className="flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" aria-label="KOV4 — начало" className="rounded-md" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav aria-label="Основна навигация" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-3">
            {navigation.map((item) => {
              const isActive = active === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className={cx(
                      "relative block px-3 py-2 text-[0.9375rem] transition-colors",
                      "after:absolute after:inset-x-3 after:-bottom-[0.95rem] after:h-0.5 after:origin-center after:rounded-full after:bg-brand after:transition-transform after:duration-300",
                      isActive
                        ? "text-brand after:scale-x-100"
                        : "text-ink-soft after:scale-x-0 hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/#contact" variant="dark" className="group h-11 px-6 text-[0.9375rem] max-sm:hidden">
            Заявете пилот
            <Arrow className="transition-transform group-hover:translate-x-0.5" />
          </ButtonLink>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line-strong text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Затвори менюто" : "Отвори менюто"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
              {open ? (
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              ) : (
                <path d="M3.5 7h13M3.5 13h13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      <div id="mobile-menu" hidden={!open} className="border-t border-line bg-paper lg:hidden">
        <Container className="py-4">
          <nav aria-label="Мобилна навигация">
            <ul className="divide-y divide-line">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-4 text-[1.25rem] font-semibold tracking-[-0.02em]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ButtonLink href="/#contact" onClick={() => setOpen(false)} className="mt-4 mb-2 w-full">
            Заявете пилот
            <Arrow />
          </ButtonLink>
        </Container>
      </div>
    </header>
  );
}
