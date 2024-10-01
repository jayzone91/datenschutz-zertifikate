import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const path = usePathname();
  return (
    <nav aria-label="breadcrumb" className="mb-3 mt-3">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link href="/">Dashboard</Link>
        </li>
        {path.split("/").map((x, idx) => {
          if (idx === 0) return null;
          if (x == "edit") return null;
          if (path.split("/").length < 1) {
            return (
              <li className="breadcrumb-item active" key={idx}>
                {x}
              </li>
            );
          }
          if (idx === path.split("/").length - 1) {
            return (
              <li className="breadcrumb-item active" key={idx}>
                {x}
              </li>
            );
          }
          return (
            <>
              <li className="breadcrumb-item" key={idx}>
                <Link
                  href={`/${path
                    .split("/")
                    .slice(0, idx + 1)
                    .join("/")}`}
                >
                  {x}
                </Link>
              </li>
            </>
          );
        })}
      </ol>
    </nav>
  );
}
