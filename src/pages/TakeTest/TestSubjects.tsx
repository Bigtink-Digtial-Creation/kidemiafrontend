/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Spinner, Pagination } from "@heroui/react";
import SubjectCard from "../../components/Cards/SubjectCard";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import type { SubjectResponse } from "../../sdk/generated"; // ✅ UPDATED: import type

export default function TestSubjectsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: rawData, isLoading } = useQuery({
    queryKey: [QueryKeys.allSubjects],
    queryFn: () => ApiSDK.SubjectsService.getSubjectsApiV1SubjectsGet(),
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  // Normalize response into an array
  const subjectsArray: SubjectResponse[] = (() => {
    const d: any = rawData;

    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.items)) return d.items;
    if (Array.isArray(d?.data)) return d.data;
    if (Array.isArray(d?.result)) return d.result;
    if (Array.isArray(d?.data?.items)) return d.data.items;

    // fallback: if response is an object keyed by numeric indices, convert to array
    if (d && typeof d === "object") {
      const possibleArray = Object.keys(d)
        .sort()
        .map((k) => d[k])
        .filter((v) => v && typeof v === "object" && "id" in v);
      if (possibleArray.length > 0) return possibleArray as SubjectResponse[];
    }

    // If nothing matched, log once to help debugging (dev-only)
    if (process.env.NODE_ENV !== "production") {
      console.warn("Unexpected subjects response shape:", rawData);
    }
    return [];
  })();

  const totalItems =
    typeof (rawData as any)?.total === "number"
      ? (rawData as any).total
      : subjectsArray.length;

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const startIndex = (page - 1) * pageSize;
  const currentSubjects = subjectsArray.slice(
    startIndex,
    startIndex + pageSize,
  );

  if (subjectsArray.length === 0) {
    return (
      <section className="py-4 space-y-6 md:px-12">
        <div className="space-y-3 text-center">
          <h2 className="text-2xl md:text-3xl text-kidemia-black font-semibold">
            Welcome! Let's Get Started
          </h2>
          <p className="text-base md:text-lg text-kidemia-grey font-medium max-w-xl mx-auto">
            Pick a subject you'd love to write a test on. Choose what excites
            you most and show what you know!
          </p>
        </div>

        <div className="py-12 text-center text-kidemia-grey">
          No subjects found.
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 space-y-6 md:px-12">
      <div className="space-y-3 text-center">
        <h2 className="text-2xl md:text-3xl text-kidemia-black font-semibold">
          Welcome! Let's Get Started
        </h2>

        <p className="text-base md:text-lg text-kidemia-grey font-medium max-w-xl mx-auto">
          Pick a subject you'd love to write a test on. Choose what excites you
          most and show what you know!
        </p>
      </div>

      <div className="py-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        {currentSubjects.map((sub) => (
          <SubjectCard
            key={sub.id}
            id={sub.id}
            icon_url={sub.icon_url || ""}
            title={sub.name}
            topics_count={sub.topics_count || 0}
            questions_count={sub.questions_count || 0}
            code={sub.code}
            description={sub.description || ""}
            color_code={sub.color_code || ""}
          />
        ))}
      </div>

      <div className="flex justify-center py-6">
        <Pagination
          radius="sm"
          page={page}
          total={totalPages}
          onChange={(p) => setPage(p)}
          color="warning"
          variant="bordered"
          classNames={{
            cursor: "border-1 bg-transparent text-kidemia-primary",
            item: "bg-transparent shadow-none cursor-pointer",
          }}
          showControls
        />
      </div>
    </section>
  );
}
