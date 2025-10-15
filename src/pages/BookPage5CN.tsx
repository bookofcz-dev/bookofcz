import { Book } from "@/components/Book";
import { bookContent } from "@/lib/bookContent5CN";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const BookPage5CN = () => {
  return (
    <>
      <div className="fixed top-16 left-0 right-0 z-10 px-4 py-2 bg-background/95 backdrop-blur">
        <Alert className="max-w-4xl mx-auto">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>免责声明：</strong>这是根据真实事件改编的虚构故事。
            虽然主要里程碑（币安于2017年7月成立、BSC于2020年9月启动、2025年10月的成就）是事实，
            但个人细节和对话是创意性诠释。
          </AlertDescription>
        </Alert>
      </div>
      <div className="pt-20">
        <Book content={bookContent} title="CZ之书：伙伴关系" />
      </div>
    </>
  );
};

export default BookPage5CN;
