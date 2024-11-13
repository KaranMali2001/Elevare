import { categoryfilter } from "@/recoil/atom";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

function SideBarFilters({
  categories,
  isLoading,
  startTransition,
  curTab,
  setCurTab,
}: {
  categories: string[];
  isLoading: boolean;
  startTransition: any;
  curTab: string;
  setCurTab: any;
}) {
  const [filter, setFilter] = useRecoilState(categoryfilter);
  function handleCheckBoxChange(e: any) {
    startTransition(() => {
      if (e.target.checked) {
        setFilter((filter) => {
          filter.add(e.target.value);
          //@ts-ignore
          return new Set([...filter]);
        });
      } else {
        setFilter((filter) => {
          filter.delete(e.target.value);
          //@ts-ignore
          return new Set([...filter]);
        });
      }
    });
  }
  useEffect(() => {
    const urlARR = window.location.href.split("/");
    if (urlARR.at(-1) === "dashboard") setCurTab("Inbox");
    else setCurTab("");
  }, []);
  // console.log(curTab);
  if (curTab !== "Inbox") return null;
  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <div
          className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 transition-colors rounded-md"
          key={category}
        >
          <input
            id={category}
            type="checkbox"
            value={category}
            checked={filter.has(category)}
            onChange={handleCheckBoxChange}
            disabled={isLoading}
            className="h-4 w-4 border-gray-300 rounded focus:ring-primary disabled:cursor-not-allowed"
          />
          <label
            htmlFor={category}
            className="text-gray-800 text-base font-medium"
          >
            {category}
          </label>
        </div>
      ))}
    </div>
  );
}

export default SideBarFilters;
