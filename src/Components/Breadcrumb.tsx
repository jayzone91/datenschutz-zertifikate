import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const path = usePathname();

  const pathSplit = path.split("/");

  if (pathSplit.length == 2 && pathSplit[1]!.length < 1) {
    return (
      <nav aria-label="breadcrumb" className="mb-3 mt-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item active">Dashboard</li>
        </ol>
      </nav>
    );
  } else {
    return (
      <nav aria-label="breadcrumb" className="mb-3 mt-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/">Dashboard</Link>
          </li>
          {pathSplit.map((x, idx) => {
            if (idx == 0) return <></>;
            else if (idx == pathSplit.length - 1) {
              return (
                <li className="breadcrumb-item active" key={idx}>
                  {x}
                </li>
              );
            } else if (x == "edit") {
              return <></>;
            } else {
              return (
                <li className="breadcrumb-item" key={idx}>
                  <Link href={`/${pathSplit.slice(0, idx + 1).join("/")}`}>
                    {x}
                  </Link>
                </li>
              );
            }
          })}
        </ol>
      </nav>
    );
  }
}
