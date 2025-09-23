import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import { mockResultsData } from "../../staticData";
import { useState } from "react";
import HistoryDrawer from "./HistoryDrawer";

export default function HistoryTable() {
  const [selectedId, setSelectedId] = useState<string>("");
  const openDrawer = useDisclosure();

  return (
    <>
      <div>
        <Table
          aria-label="history table"
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
            <TableColumn>Subject</TableColumn>
            <TableColumn>Average Score (%)</TableColumn>
            <TableColumn>Remark</TableColumn>
            <TableColumn>Date Taken</TableColumn>
            <TableColumn>Action</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No available data"}>
            {mockResultsData.map((mock) => (
              <TableRow key={mock.sn}>
                <TableCell>{mock.sn}</TableCell>
                <TableCell>{mock.subject}</TableCell>
                <TableCell>{mock.averageScore}</TableCell>
                <TableCell>{mock.remark}</TableCell>
                <TableCell>{mock.dateTaken}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="light"
                    className="bg-transparent text-kidemia-secondary"
                    onPress={() => {
                      setSelectedId(mock.subject);
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

      {selectedId ? (
        <HistoryDrawer
          isOpen={openDrawer.isOpen}
          onOpenChange={openDrawer.onOpenChange}
          id={selectedId}
        />
      ) : null}
    </>
  );
}
