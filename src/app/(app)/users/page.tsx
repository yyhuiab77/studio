import { PageHeader } from "@/components/page-header";
import { users } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";

const statusColorMap: Record<User["status"], string> = {
  "On-Duty": "bg-green-500",
  "On-Call": "bg-yellow-500",
  "Off-Duty": "bg-gray-500",
};

export default function UsersPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="User Management" />
      <main className="flex-1 p-4 md:p-6">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const userAvatar = PlaceHolderImages.find((p) => p.id === user.avatar);
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={user.name} />}
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {user.name}
                        </div>
                      </TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={cn("h-2.5 w-2.5 rounded-full", statusColorMap[user.status])} />
                          <span>{user.status}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
