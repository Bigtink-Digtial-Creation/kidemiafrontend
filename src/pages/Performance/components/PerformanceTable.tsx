import { useState } from "react";
import {
  Button,
  Chip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import { statusTheme, useFormattedDateTime } from "../../../utils";
import PerformanceModal from "./PerformanceModal";
import SpinnerCircle from "../../../components/Spinner/Circle";

interface PerformanceTableProps {
  data: any[];
  isLoading: boolean;
  error: any;
}

export default function PerformanceTable({
  data,
  isLoading,
  error,
}: PerformanceTableProps) {
  const viewDetails = useDisclosure();
  const [selectedAttempt, setSelectedAttempt] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handleViewResult = (item: any) => {
    setSelectedAttempt(item);
    viewDetails.onOpen();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <SpinnerCircle />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-red-500">Error loading performance data</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <Table
          aria-label="performance table"
          className="pt-4"
          bottomContent={
            totalPages > 1 ? (
              <div className="flex justify-end py-3">
                <Pagination
                  radius="sm"
                  page={currentPage}
                  total={totalPages}
                  onChange={setCurrentPage}
                  classNames={{
                    cursor: "border-1 bg-transparent text-kidemia-primary",
                    item: "bg-transparent shadow-none cursor-pointer",
                  }}
                />
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn className="w-12">S/N</TableColumn>
            <TableColumn>Title</TableColumn>
            <TableColumn>Average Score (%)</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Comment</TableColumn>
            <TableColumn>Date Created</TableColumn>
            <TableColumn>Action</TableColumn>
          </TableHeader>

          <TableBody emptyContent={"No available data"}>
            {currentData.map((item) => (
              <TableRow key={item.attempt_id}>
                <TableCell>{item.sn}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.average_score}</TableCell>
                <TableCell>
                  <Chip
                    color={statusTheme[item.status as keyof typeof statusTheme]}
                    className="text-xs px-3 capitalize"
                    variant="flat"
                  >
                    {item.status}
                  </Chip>
                </TableCell>
                <TableCell>{item.comment}</TableCell>
                <TableCell>{useFormattedDateTime(item.date_created, 'short')}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="light"
                    className="bg-transparent text-kidemia-secondary"
                    onPress={() => handleViewResult(item)}
                  >
                    View Result
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedAttempt && (
        <PerformanceModal
          isOpen={viewDetails.isOpen}
          onOpenChange={viewDetails.onOpenChange}
          attemptId={selectedAttempt.attempt_id}
          assessmentId={selectedAttempt.assessment_id}
        />
      )}
    </>
  );
}