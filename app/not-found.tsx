import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaf, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Leaf className="h-24 w-24 text-green-600 mx-auto mb-6" />
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          ページが見つかりません
        </h2>
        <p className="text-gray-600 mb-8">
          お探しのページは移動または削除された可能性があります。<br />
          URLをご確認いただくか、トップページからお探しください。
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              トップページへ
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/vegetables">
              <Search className="mr-2 h-5 w-5" />
              野菜を探す
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
