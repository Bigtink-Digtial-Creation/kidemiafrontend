import { Card, CardBody } from "@heroui/react";


export default function StatMiniCard({ icon, title, value }: { icon: any; title: string; value: string }) {
    return (
        <Card className="border-none shadow-sm">
            <CardBody className="flex flex-row items-center gap-4 py-6">
                <div className="text-2xl">{icon}</div>
                <div>
                    <p className="text-xs text-gray-500 font-medium">{title}</p>
                    <h3 className="text-xl font-bold">{value}</h3>
                </div>
            </CardBody>
        </Card>
    );
}