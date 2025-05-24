"use client";

import React, { useState } from "react";
import { ArrowLeftRight, Split } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { TransferForm } from "../TransferForm";
import { SplitForm } from "../SplitForm";
import { SplitHistoryList } from "../SplitHistoryList";

export const TransferSplitPage = () => {
  const [activeTab, setActiveTab] = useState<"transfer" | "split">("transfer");

  return (
    <div className="min-h-screen pb-20">
      {/* ページヘッダー */}
      <div className="bg-teal-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">送金・割り勘</h1>
        <p className="text-sm opacity-90">
          友達に送金したり、割り勘の管理ができます
        </p>
      </div>

      {/* タブ切り替え */}
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "transfer" | "split")}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 h-14">
            <TabsTrigger
              value="transfer"
              className="flex items-center gap-2 text-base font-medium data-[state=active]:bg-teal-600 data-[state=active]:text-white"
            >
              <ArrowLeftRight className="w-5 h-5" />
              送金
            </TabsTrigger>
            <TabsTrigger
              value="split"
              className="flex items-center gap-2 text-base font-medium data-[state=active]:bg-teal-600 data-[state=active]:text-white"
            >
              <Split className="w-5 h-5" />
              割り勘
            </TabsTrigger>
          </TabsList>

          {/* 送金タブ */}
          <TabsContent value="transfer" className="space-y-6">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-stone-800">
                  送金する
                </h2>
                <p className="text-sm text-stone-600 mt-1">
                  送金先と金額を入力してください
                </p>
              </div>
              <TransferForm />
            </Card>
          </TabsContent>

          {/* 割り勘タブ */}
          <TabsContent value="split" className="space-y-6">
            {/* 割り勘作成フォーム */}
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-stone-800">
                  割り勘を作成
                </h2>
                <p className="text-sm text-stone-600 mt-1">
                  割り勘の詳細を入力してください
                </p>
              </div>
              <SplitForm />
            </Card>

            {/* 割り勘履歴 */}
            <div>
              <h2 className="text-xl font-semibold text-stone-800 mb-4">
                割り勘履歴
              </h2>
              <SplitHistoryList />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
