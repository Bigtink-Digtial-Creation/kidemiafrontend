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
import { useState } from "react";
import HistoryDrawer from "./HistoryDrawer";
import SpinnerCircle from "../../../components/Spinner/Circle";
import { statusTheme, useFormattedDateTime } from "../../../utils";



interface HistoryTableProps {
  data: any[];
  isLoading: boolean;
  error: any;
}


export default function HistoryTable({
  data,
  isLoading,
  error,
}: HistoryTableProps) {
  const openDrawer = useDisclosure();
  const [selectedAttempt, setSelectedAttempt] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);



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
        <p className="text-red-500">Error loading history data</p>
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
            <TableColumn>Remark</TableColumn>
            <TableColumn>Date Taken</TableColumn>
            <TableColumn>Action</TableColumn>
          </TableHeader>

          <TableBody emptyContent={"No available data"}>
            {currentData.map((item) => (
              <TableRow key={item.attempt_id}>
                <TableCell>{item.sn}</TableCell>
                <TableCell>{item.title}</TableCell>
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
                    onPress={() => {
                      setSelectedAttempt(item);
                      openDrawer.onOpen();
                    }}
                  >
                    View More
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedAttempt ? (
        <HistoryDrawer
          isOpen={openDrawer.isOpen}
          onOpenChange={openDrawer.onOpenChange}
          id={selectedAttempt.attempt_id}
        />
      ) : null}
    </>
  );
}
