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
import { statusTheme } from "../../utils";
import PerformanceModal from "./PerformanceModal";
import { mockTableData } from "../../staticData";

export default function PerformanceTable() {
  const viewDetails = useDisclosure();
  const [selectedId, setSelectedId] = useState<string>("");

  return (
    <>
      <div>
        <Table
          aria-label="Example static collection table"
          className="pt-4"
          bottomContent={
            <div className="flex justify-end py-3">
              <Pagination
                radius="sm"
                initialPage={1}
                total={10}
                classNames={{
                  cursor: "border-1 bg-transparent text-kidemia-primary",
                  item: "bg-transparent shadow-none cursor-pointer",
                }}
              />
            </div>
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
            {mockTableData.map((mock) => (
              <TableRow key={mock.sn}>
                <TableCell>{mock.sn}</TableCell>
                <TableCell>{mock.title}</TableCell>
                <TableCell>{mock.averageScore}</TableCell>
                <TableCell>
                  <Chip
                    color={statusTheme[mock.status]}
                    className="text-xs px-3 capitalize"
                    variant="flat"
                  >
                    {mock.status}
                  </Chip>
                </TableCell>
                <TableCell>{mock.comment}</TableCell>
                <TableCell>{mock.dateCreated}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="light"
                    className="bg-transparent text-kidemia-secondary"
                    onPress={() => {
                      setSelectedId(mock.title);
                      viewDetails.onOpen();
                    }}
                  >
                    View Result
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedId ? (
        <PerformanceModal
          isOpen={viewDetails.isOpen}
          onOpenChange={viewDetails.onOpenChange}
          id={selectedId}
        />
      ) : null}
    </>
  );
}
