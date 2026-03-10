import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

const statusColorMap: Record<User['status'], string> = {
  "On-Duty": "bg-green-500",
  "On-Call": "bg-yellow-500",
  "Off-Duty": "bg-gray-500",
};

export function PersonnelStatus({ users }: { users: User[] }) {
  const onDutyUsers = users.filter((u) => u.status === "On-Duty");

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Personnel Status</CardTitle>
        <CardDescription>
          {onDutyUsers.length} technicians currently on duty.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => {
            const userAvatar = PlaceHolderImages.find((p) => p.id === user.avatar);
            return (
              <div key={user.id} className="flex items-center gap-4">
                <Avatar className="h-9 w-9">
                  {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={user.name} />}
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1 flex-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn("h-2.5 w-2.5 rounded-full", statusColorMap[user.status])} />
                  <span className="text-sm text-muted-foreground">{user.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
