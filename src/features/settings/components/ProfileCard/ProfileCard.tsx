"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Leaf, Upload } from "lucide-react";
import { Session } from "next-auth";
import { UserProfile } from "../../types/settings";

/**
 * プロフィールカードのプロパティ
 */
export interface ProfileCardProps {
  /** ユーザー情報 */
  user?: Session["user"] | UserProfile;
  /** 環境貢献データ */
  ecoContribution?: {
    donation: number; // 累計寄付額
    forestArea: number; // 森林保全面積(m²)
    co2Reduction: number; // CO2削減量(kg)
  };
  /** カードの幅のカスタマイズ用クラス */
  className?: string;
}

/**
 * ユーザープロフィールカードを表示するコンポーネント
 *
 * @param user ユーザー情報
 * @param ecoContribution 環境貢献データ
 * @param className カスタムCSSクラス
 */
export function ProfileCard({
  user,
  ecoContribution = {
    donation: 12450,
    forestArea: 5.2,
    co2Reduction: 25,
  },
  className = "sm:w-1/3",
}: ProfileCardProps) {
  return (
    <Card className={`${className} border-0 shadow-md bg-white`}>
      <div className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 border-2 border-teal-100">
            <AvatarImage
              src={user?.image || "/api/placeholder/100/100"}
              alt="プロフィール画像"
            />
            <AvatarFallback className="bg-teal-100 text-teal-800">
              {user?.name ? user.name.slice(0, 2) : "山田"}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-xs text-stone-600"
          >
            <Upload className="h-3 w-3 mr-1" />
            画像を変更
          </Button>
          <h2 className="mt-3 text-lg font-medium text-stone-900">
            {user?.name || "山田 太郎"}
          </h2>
          <p className="text-sm text-stone-600">
            {user?.email || "eco_user@example.com"}
          </p>

          <div className="mt-4 w-full">
            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200 w-full flex items-center py-1.5">
              <Leaf className="h-3 w-3 mr-1" />
              {user?.ecoRank || "エコマイスター"}
            </Badge>
          </div>

          <div className="mt-6 w-full text-left">
            <h3 className="text-sm font-medium text-stone-800 mb-2">
              環境貢献状況
            </h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-stone-600">累計寄付額</span>
                <span className="font-medium text-teal-700">
                  ¥{ecoContribution.donation.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">森林保全面積</span>
                <span className="font-medium text-teal-700">
                  {ecoContribution.forestArea.toFixed(1)} m²
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">削減CO2</span>
                <span className="font-medium text-teal-700">
                  {ecoContribution.co2Reduction} kg
                </span>
              </div>
            </div>

            <Link href="/impact">
              <Button className="w-full mt-4 text-xs text-teal-700 border border-teal-200 bg-white hover:bg-teal-50">
                環境インパクト詳細
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
