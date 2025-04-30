import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export function InviteCard() {
  return (
    <Card className="border-0 shadow-md bg-gradient-to-r from-teal-50 to-teal-100 p-4">
      <div className="flex items-start space-x-3">
        <div className="mt-0.5 bg-teal-100 p-2 rounded-full">
          <Users className="h-5 w-5 text-teal-700" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-teal-800">
            友達を招待して1,000円ゲット！
          </h3>
          <p className="text-xs text-teal-700 mt-1">
            友達を招待すると、あなたも友達も1,000円分のエコポイントが獲得できます
          </p>
          <Link href="/invite">
            <Button className="w-full mt-3 bg-teal-700 hover:bg-teal-800 text-white text-xs">
              友達を招待する
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
