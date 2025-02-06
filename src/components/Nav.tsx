import { Link } from "react-router"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "@/components/ui/mode-toggle"
import React from "react"

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a"> & { href: string }>(
  ({ className, title, children, href, ...props }, ref) => {
    return (
      <li>
        <Link
          ref={ref}
          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className || ""}`}
          to={href}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </Link>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"

export function Nav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link 
            to="/" 
            className={navigationMenuTriggerStyle()}
          >
            Landing
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link 
            to="/songs" 
            className={navigationMenuTriggerStyle()}
          >
            View All Songs
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link 
            to="/create" 
            className={navigationMenuTriggerStyle()}
          >
            Add a Song
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <ModeToggle />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}