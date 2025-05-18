import { Button } from "@/components/ui/button";
import { Twitter, Facebook, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

interface SocialShareButtonsProps {
  inviteLink: string;
  inviteMessage?: string;
}

export function SocialShareButtons({
  inviteLink,
  inviteMessage = "Eco Walletを試してみませんか？登録すると、私たち二人とも1,000円分のエコポイントがもらえて、環境保全にも貢献できます。",
}: SocialShareButtonsProps) {
  // ブラウザ環境でのWeb Share APIのサポート状況をチェック
  const [isShareSupported, setIsShareSupported] = useState(false);

  useEffect(() => {
    // クライアントサイドでのみ実行される
    setIsShareSupported(
      typeof navigator !== "undefined" && typeof navigator.share === "function",
    );
  }, []);

  // URLエンコードされたメッセージとリンク
  const encodedMessage = encodeURIComponent(inviteMessage);
  const encodedLink = encodeURIComponent(inviteLink);

  // 各SNSの共有URL
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedLink}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}&quote=${encodedMessage}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodedLink}`;

  // スマホの場合、ネイティブアプリで共有
  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Eco Wallet招待",
          text: inviteMessage,
          url: inviteLink,
        });
      } catch (error) {
        // AbortError (ユーザーによる共有キャンセル) の場合はエラーとして扱わない
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("共有に失敗しました", error);
        }
      }
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-stone-700">SNSで共有</h4>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 bg-[#1DA1F2]/10 text-[#1DA1F2] border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/20"
          onClick={() => window.open(twitterUrl, "_blank")}
        >
          <Twitter className="h-4 w-4 mr-1" />
          <span>Twitter</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex-1 bg-[#4267B2]/10 text-[#4267B2] border-[#4267B2]/30 hover:bg-[#4267B2]/20"
          onClick={() => window.open(facebookUrl, "_blank")}
        >
          <Facebook className="h-4 w-4 mr-1" />
          <span>Facebook</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex-1 bg-[#06C755]/10 text-[#06C755] border-[#06C755]/30 hover:bg-[#06C755]/20"
          onClick={() => window.open(lineUrl, "_blank")}
        >
          <span className="mr-1 font-bold">L</span>
          <span>LINE</span>
        </Button>

        {isShareSupported && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-stone-100 text-stone-700 border-stone-200"
            onClick={handleNativeShare}
          >
            <Smartphone className="h-4 w-4 mr-1" />
            <span>その他</span>
          </Button>
        )}
      </div>
    </div>
  );
}
