"use client";

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
import { ErrorDisplay } from "@/components/ui/error-display";
import { useAuthForm } from "@/features/auth/hooks/useAuthForm";
import { validateProfileForm } from "@/features/auth/utils/validation";
import { ok, err } from "neverthrow";
import { AppError } from "@/shared/types/errors";

interface ProfileTabProps {
  user?: Session["user"];
}

export function ProfileTab({ user }: ProfileTabProps) {
  // useAuthFormフックを使用してプロフィール更新フォームを管理
  const profileForm = useAuthForm({
    initialValues: {
      name: user?.name || "山田 太郎",
      email: user?.email || "eco_user@example.com",
      phone: "090-1234-5678",
      location: "tokyo",
    },
    validateForm: validateProfileForm,
    onSubmit: async (values) => {
      try {
        // TODO: 実際のAPI呼び出し処理
        // const updateResult = await updateProfileAsync(values);
        // return updateResult;

        // 現在はモックの成功処理
        console.log("Profile updated successfully:", values);

        return ok(undefined);
      } catch {
        const appError: AppError = {
          type: "NETWORK_ERROR",
          message: "プロフィールの更新中にエラーが発生しました",
        };
        return err(appError);
      }
    },
  });

  // エラー再試行ハンドラ
  const handleRetry = () => {
    profileForm.clearError();
  };

  // Select用の値変更ハンドラ
  const handleLocationChange = (value: string) => {
    profileForm.setValues((prev) => ({
      ...prev,
      location: value,
    }));

    // フィールドエラーをクリア
    if (profileForm.fieldErrors.location) {
      profileForm.clearFieldError("location");
    }
  };

  return (
    <div className="space-y-4">
      {/* エラー表示（Result型対応） */}
      {profileForm.error && (
        <ErrorDisplay
          error={profileForm.error}
          onRetry={handleRetry}
          className="mb-4"
        />
      )}

      {/* 基本情報セクション */}
      <form onSubmit={profileForm.handleSubmit}>
        <SettingSection
          title="基本情報"
          description="アカウントの基本情報を編集します"
        >
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-stone-800"
            >
              氏名
            </Label>
            <Input
              id="name"
              name="name"
              value={profileForm.values.name}
              onChange={profileForm.handleChange}
              className="border-stone-200"
              placeholder="山田 太郎"
              aria-describedby={
                profileForm.fieldErrors.name ? "name-error" : undefined
              }
            />
            {profileForm.fieldErrors.name && (
              <p id="name-error" className="text-xs text-red-600">
                {profileForm.fieldErrors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-stone-800"
            >
              メールアドレス
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={profileForm.values.email}
              onChange={profileForm.handleChange}
              className="border-stone-200"
              placeholder="eco_user@example.com"
              aria-describedby={
                profileForm.fieldErrors.email ? "email-error" : undefined
              }
            />
            {profileForm.fieldErrors.email && (
              <p id="email-error" className="text-xs text-red-600">
                {profileForm.fieldErrors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-sm font-medium text-stone-800"
            >
              電話番号
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={profileForm.values.phone}
              onChange={profileForm.handleChange}
              className="border-stone-200"
              placeholder="090-1234-5678"
              aria-describedby={
                profileForm.fieldErrors.phone ? "phone-error" : undefined
              }
            />
            {profileForm.fieldErrors.phone && (
              <p id="phone-error" className="text-xs text-red-600">
                {profileForm.fieldErrors.phone.message}
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
                value={profileForm.values.location}
                onValueChange={handleLocationChange}
              >
                <SelectTrigger
                  className="border-stone-200"
                  aria-describedby={
                    profileForm.fieldErrors.location
                      ? "location-error"
                      : undefined
                  }
                >
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
            {profileForm.fieldErrors.location && (
              <p id="location-error" className="text-xs text-red-600">
                {profileForm.fieldErrors.location.message}
              </p>
            )}
          </div>
        </SettingSection>

        <Button
          type="submit"
          disabled={profileForm.isLoading}
          className="w-full bg-teal-700 hover:bg-teal-800 text-white mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {profileForm.isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              更新中...
            </div>
          ) : (
            "変更を保存"
          )}
        </Button>
      </form>

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
    </div>
  );
}
