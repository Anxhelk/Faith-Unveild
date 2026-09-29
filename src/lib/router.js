import { useEffect, useState } from "react"

// Tiny hash router: "#/theme/giving?x=1" -> { path: ["theme", "giving"], query: URLSearchParams }
function parse() {
  const raw = window.location.hash.replace(/^#\/?/, "")
  const [p, q = ""] = raw.split("?")
  return { path: p.split("/").filter(Boolean), query: new URLSearchParams(q) }
}

export function useRoute() {
  const [route, setRoute] = useState(parse)
  useEffect(() => {
    const onChange = () => {
      setRoute(parse())
      window.scrollTo(0, 0)
    }
    window.addEventListener("hashchange", onChange)
    return () => window.removeEventListener("hashchange", onChange)
  }, [])
  return route
}

export function go(href) {
  window.location.hash = href
}
