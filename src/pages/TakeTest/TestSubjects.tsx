/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Pagination,
  Breadcrumbs,
  BreadcrumbItem,
  Chip,
} from "@heroui/react";
import SubjectCard from "../../components/Cards/SubjectCard";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import type { SubjectResponse } from "../../sdk/generated";
import { SidebarRoutes, TestRoutes } from "../../routes";
import LoadingSequence from "../../components/Loading/LoadingSequence";
import { useAtomValue } from "jotai";
import { loggedinUserAtom } from "../../store/user.atom";

export default function TestSubjectsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const storedUser = useAtomValue(loggedinUserAtom);

  const userCategory = storedUser?.user.student?.category; // Assuming the object is available
  const userCategoryId = storedUser?.user.student?.category_id;

  const { data: rawData, isLoading } = useQuery({
    queryKey: [QueryKeys.allSubjects, userCategoryId], // Add ID to key so it refetches if category changes
    queryFn: () => ApiSDK.SubjectsService.getSubjectsApiV1SubjectsGet(
      (page - 1) * pageSize,
      pageSize,
      true,
      userCategoryId
    ),
  });

  if (isLoading) {
    return (
      <LoadingSequence
        lines={[
          { text: "Loading Practice subjects...", className: "text-lg md:text-xl text-kidemia-primary" },
          { text: "Tailoring to your curriculum...", className: "text-lg md:text-xl text-kidemia-secondary" },
          { text: "Getting things ready" },
        ]}
      />
    );
  }

  // Clean data extraction
  const subjectsArray: SubjectResponse[] = (rawData as any)?.items || [];
  const totalItems = (rawData as any)?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <section className="py-6 space-y-8 md:px-12 w-full max-w-7xl mx-auto">
      {/* Top Navigation Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Breadcrumbs variant="light" color="foreground" className="hidden md:flex">
          <BreadcrumbItem href={SidebarRoutes.dashboard}>Dashboard</BreadcrumbItem>
          <BreadcrumbItem href={TestRoutes.takeTest}>Take a Test</BreadcrumbItem>
          <BreadcrumbItem color="warning">Pick a Subject</BreadcrumbItem>
        </Breadcrumbs>

        {/* Category Indicator: Clear & Non-cluttered */}
        {userCategory?.display_name && (
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-sm font-medium text-kidemia-grey">Active Curriculum:</span>
            <Chip
              variant="flat"
              color="warning"
              size="sm"
              className="bg-kidemia-biege/50 text-kidemia-secondary font-bold"
            >
              {userCategory.display_name}
            </Chip>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <div className="space-y-3 text-center pt-4">
        <h2 className="text-3xl md:text-4xl text-kidemia-black font-bold tracking-tight">
          Ready to <span className="text-kidemia-secondary">Challenge</span> Yourself?
        </h2>
        <p className="text-base md:text-lg text-kidemia-grey font-medium max-w-2xl mx-auto">
          Choose a subject from your {userCategory?.display_name || ""} curriculum below to start your practice session.
        </p>
      </div>

      {/* Subject Grid */}
      {subjectsArray.length > 0 ? (
        <div className="py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-center">
          {subjectsArray.map((sub) => (
            <SubjectCard
              key={sub.id}
              id={sub.id}
              icon_url={sub.icon_url || ""}
              title={sub.name}
              topics_count={sub.topics_count || 0}
              description={sub.description || ""}
              color_code={sub.color_code || ""}
              category_name={sub.category?.display_name} // Passing category name to card if needed
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4">
          <p className="text-xl text-kidemia-grey font-semibold">No subjects found for this curriculum.</p>
          <p className="text-sm text-gray-400">Try checking back later or contact support.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-8">
          <Pagination
            radius="sm"
            page={page}
            total={totalPages}
            onChange={setPage}
            color="warning"
            variant="bordered"
            classNames={{
              cursor: "border-1 bg-transparent text-kidemia-primary",
              item: "bg-transparent shadow-none cursor-pointer",
            }}
            showControls
          />
        </div>
      )}
    </section>
  );
}