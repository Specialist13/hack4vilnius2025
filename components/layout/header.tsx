"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, Menu, User } from "lucide-react"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { isAuthenticated, removeAuthToken } from "@/lib/api"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const t = useTranslations()
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)

  // Check authentication status on mount and when localStorage changes
  useEffect(() => {
    setIsAuth(isAuthenticated())

    // Listen for storage changes (e.g., login/logout in another tab)
    const handleStorageChange = () => {
      setIsAuth(isAuthenticated())
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLogout = () => {
    removeAuthToken()
    setIsAuth(false)
    
    // Trigger storage event for other tabs/components
    window.dispatchEvent(new Event('storage'))
    
    // Force page refresh to update UI state everywhere
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-primary flex-shrink-0">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-semibold leading-none">{t("common.appName")}</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground hidden xs:block">{t("common.tagline")}</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-4 lg:gap-6 md:flex">
          <Link
            href="/forum"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            {t("nav.forum")}
          </Link>
          <Link
            href="/petitions"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            Petitions
          </Link>
          <Link href="/map" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
            {t("nav.map")}
          </Link>
          <Link
            href="/documents"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            {t("nav.documents")}
          </Link>
          <Link
            href="/ai-consultant"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            {t("nav.aiConsultant")}
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            {t("nav.about")}
          </Link>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitcher />

          {isAuth ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 sm:h-10 sm:w-10">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex text-sm">
                <Link href="/auth/login">{t("nav.login")}</Link>
              </Button>
              <Button asChild size="sm" className="text-xs sm:text-sm">
                <Link href="/auth/register">{t("nav.signup")}</Link>
              </Button>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/forum">{t("nav.forum")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/petitions">Petitions</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/map">{t("nav.map")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/documents">{t("nav.documents")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/ai-consultant">{t("nav.aiConsultant")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/about">{t("nav.about")}</Link>
              </DropdownMenuItem>
              {!isAuth && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="sm:hidden">
                    <Link href="/auth/login">{t("nav.login")}</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
