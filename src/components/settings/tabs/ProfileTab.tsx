import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { Session } from "next-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProfileTabProps {
  user?: Session["user"];
}

export function ProfileTab({ user }: ProfileTabProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-stone-800">
          氏名
        </Label>
        <Input
          id="name"
          defaultValue={user?.name || "山田 太郎"}
          className="border-stone-200"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-stone-800">
          メールアドレス
        </Label>
        <Input
          id="email"
          defaultValue={user?.email || "eco_user@example.com"}
          className="border-stone-200"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium text-stone-800">
          電話番号
        </Label>
        <Input
          id="phone"
          defaultValue="090-1234-5678"
          className="border-stone-200"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="location"
          className="text-sm font-medium text-stone-800"
        >
          お住まいの地域
        </Label>
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-stone-400" />
          <Select defaultValue="tokyo">
            <SelectTrigger className="border-stone-200">
              <SelectValue placeholder="地域を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hokkaido">北海道</SelectItem>
              <SelectItem value="tohoku">東北</SelectItem>
              <SelectItem value="kanto">関東</SelectItem>
              <SelectItem value="tokyo">東京</SelectItem>
              <SelectItem value="chubu">中部</SelectItem>
              <SelectItem value="kansai">関西</SelectItem>
              <SelectItem value="chugoku">中国</SelectItem>
              <SelectItem value="shikoku">四国</SelectItem>
              <SelectItem value="kyushu">九州</SelectItem>
              <SelectItem value="okinawa">沖縄</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white mt-2">
        変更を保存
      </Button>
    </div>
  );
}
