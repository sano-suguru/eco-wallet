"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Users } from "lucide-react";
import { Session } from "next-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { SettingSection } from "@/features/settings/components/SettingSection";
import { AppError } from "@/shared/types/errors";
import { ErrorDisplay } from "@/components/ui/error-display";
import { showAppErrorNotification } from "@/shared/stores/app.slice";
import {
  validateEmailResult,
  validatePhoneResult,
} from "@/lib/utils/validation";

interface ProfileTabProps {
  user?: Session["user"];
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
}

export function ProfileTab({ user }: ProfileTabProps) {
  // フォームデータの状態管理
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || "山田 太郎",
    email: user?.email || "eco_user@example.com",
    phone: "090-1234-5678",
    location: "tokyo",
  });

  // エラーステート管理（Result型対応）
  const [error, setError] = useState<AppError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // バリデーション結果（Result型対応）
  const emailValidationResult = useMemo(() => {
    if (!profileData.email) return validateEmailResult("");
    return validateEmailResult(profileData.email);
  }, [profileData.email]);

  const phoneValidationResult = useMemo(() => {
    if (!profileData.phone) return validatePhoneResult("");
    return validatePhoneResult(profileData.phone);
  }, [profileData.phone]);

  // 全体のバリデーション状態
  const isFormValid = useMemo(() => {
    return (
      profileData.name.trim() !== "" &&
      emailValidationResult.isOk() &&
      phoneValidationResult.isOk() &&
      profileData.location !== ""
    );
  }, [profileData, emailValidationResult, phoneValidationResult]);

  // エラー再試行ハンドラ（Result型対応）
  const handleRetry = () => {
    setError(null);
  };

  // フォームデータ更新ハンドラ
  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // 入力時にエラーをクリア
    if (error) {
      setError(null);
    }
  };

  // プロフィール更新処理（Result型対応）
  const handleProfileUpdate = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // 基本バリデーション
      if (!isFormValid) {
        const validationError: AppError = {
          type: "INVALID_FORMAT",
          message: "入力内容に不備があります。各項目を確認してください。",
          field: "profile",
          expected: "有効な形式",
        };
        setError(validationError);
        showAppErrorNotification(validationError, "入力エラー");
        return;
      }

      // 各フィールドのバリデーション結果をチェック
      const validationResults = [emailValidationResult, phoneValidationResult];

      for (const result of validationResults) {
        result.match(
          () => {
            // 成功時は何もしない
          },
          (validationError: AppError) => {
            setError(validationError);
            showAppErrorNotification(validationError, "バリデーションエラー");
            return;
          },
        );
      }

      // エラーがある場合は処理を中断
      if (error) return;

      // TODO: 実際のAPI呼び出し処理
      // const updateResult = await updateProfileAsync(profileData);
      // updateResult.match(
      //   (updatedProfile) => {
      //     showAppErrorNotification(
      //       { type: "success", message: "プロフィールを更新しました" } as any,
      //       "更新完了"
      //     );
      //   },
      //   (updateError) => {
      //     setError(updateError);
      //     showAppErrorNotification(updateError, "更新エラー");
      //   }
      // );

      // 現在はモックの成功処理
      setTimeout(() => {
        // showAppErrorNotification の代わりに成功通知を表示
        console.log("Profile updated successfully:", profileData);
      }, 1000);
    } catch {
      const appError: AppError = {
        type: "NETWORK_ERROR",
        message: "プロフィールの更新中にエラーが発生しました",
      };
      setError(appError);
      showAppErrorNotification(appError, "更新エラー");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* エラー表示（Result型対応） */}
      {error && (
        <ErrorDisplay error={error} onRetry={handleRetry} className="mb-4" />
      )}

      {/* 基本情報セクション */}
      <SettingSection
        title="基本情報"
        description="アカウントの基本情報を編集します"
      >
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-stone-800">
            氏名
          </Label>
          <Input
            id="name"
            value={profileData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="border-stone-200"
            placeholder="山田 太郎"
          />
          {profileData.name.trim() === "" && (
            <p className="text-xs text-red-600">氏名は必須です</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-stone-800">
            メールアドレス
          </Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="border-stone-200"
            placeholder="eco_user@example.com"
          />
          {emailValidationResult.isErr() && (
            <p className="text-xs text-red-600">
              {emailValidationResult.error.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-stone-800">
            電話番号
          </Label>
          <Input
            id="phone"
            type="tel"
            value={profileData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="border-stone-200"
            placeholder="090-1234-5678"
          />
          {phoneValidationResult.isErr() && (
            <p className="text-xs text-red-600">
              {phoneValidationResult.error.message}
            </p>
          )}
        </div>
      </SettingSection>

      {/* 地域情報セクション */}
      <SettingSection
        title="地域情報"
        icon={<MapPin className="h-4 w-4 text-stone-600" />}
      >
        <div className="space-y-2">
          <Label
            htmlFor="location"
            className="text-sm font-medium text-stone-800"
          >
            お住まいの地域
          </Label>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-stone-400" />
            <Select
              value={profileData.location}
              onValueChange={(value) => handleInputChange("location", value)}
            >
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
      </SettingSection>

      {/* 友達招待セクション */}
      <SettingSection
        title="友達招待"
        icon={<Users className="h-4 w-4 text-teal-700" />}
        className="mt-6 pt-6 border-t border-stone-200"
      >
        <div className="flex items-center justify-between">
          <p className="text-xs text-stone-600">
            友達を招待すると、あなたも友達も1,000円分のエコポイントがもらえます
          </p>
          <Link href="/invite">
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-teal-700 border-teal-200 hover:bg-teal-50"
            >
              友達を招待する
            </Button>
          </Link>
        </div>
      </SettingSection>

      <Button
        onClick={handleProfileUpdate}
        disabled={!isFormValid || isSubmitting}
        className="w-full bg-teal-700 hover:bg-teal-800 text-white mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            更新中...
          </div>
        ) : (
          "変更を保存"
        )}
      </Button>
    </div>
  );
}
